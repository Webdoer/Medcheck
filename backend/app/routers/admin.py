"""
Admin router — simple token auth + review queue management.

Endpoints:
  POST /api/admin/token           → login, get JWT
  GET  /api/admin/queue           → list pending review items
  POST /api/admin/queue/{id}      → approve/edit/reject a review item
  POST /api/admin/import-month    → trigger a manual month import
  GET  /api/admin/stats           → dashboard stats
  GET  /api/explain               → localized explanation for a failure_reason
"""
import json
import logging
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Header, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models import (
    FlaggedBatch, ReviewQueue, ReviewStatus, AlertCategory, SourceDocument
)
from app.services.normalise import normalise, make_dedup_key

logger = logging.getLogger(__name__)
settings = get_settings()

router = APIRouter(prefix="/api/admin", tags=["admin"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/token")


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def _create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    x_admin_token: Optional[str] = Header(None),
) -> str:
    # Accept either JWT OR the simple ADMIN_TOKEN header
    if x_admin_token and x_admin_token == settings.ADMIN_TOKEN:
        return "admin"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if (
        form_data.username != settings.ADMIN_USERNAME
        or form_data.password != settings.ADMIN_PASSWORD
    ):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    token = _create_access_token(
        {"sub": form_data.username},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer"}


@router.get("/queue")
async def list_queue(
    status_filter: str = "PENDING",
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    try:
        status_enum = ReviewStatus(status_filter)
    except ValueError:
        raise HTTPException(400, f"Invalid status: {status_filter}")

    result = await db.execute(
        select(ReviewQueue)
        .where(ReviewQueue.status == status_enum)
        .order_by(ReviewQueue.created_at.asc())
        .offset(skip)
        .limit(limit)
    )
    items = result.scalars().all()
    return [
        {
            "id": str(item.id),
            "source_id": str(item.source_id) if item.source_id else None,
            "raw_data": json.loads(item.raw_data),
            "page_number": item.page_number,
            "extraction_confidence": item.extraction_confidence,
            "status": item.status.value,
            "created_at": item.created_at.isoformat(),
        }
        for item in items
    ]


@router.post("/queue/{item_id}")
async def decide_queue_item(
    item_id: str,
    decision: dict,
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    result = await db.execute(select(ReviewQueue).where(ReviewQueue.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(404, "Review item not found")
    if item.status != ReviewStatus.PENDING:
        raise HTTPException(400, "Item already reviewed")

    new_status_str = decision.get("status", "REJECTED")
    try:
        new_status = ReviewStatus(new_status_str)
    except ValueError:
        raise HTTPException(400, f"Invalid status: {new_status_str}")

    item.status = new_status
    item.reviewed_by = admin
    item.reviewed_at = datetime.utcnow()
    item.admin_notes = decision.get("admin_notes")

    if new_status == ReviewStatus.APPROVED:
        raw = json.loads(item.raw_data)
        row = decision.get("corrected_data") or raw

        drug_name = str(row.get("drug_name") or "").strip()
        batch_no = str(row.get("batch_no") or row.get("batch_number") or "").strip()
        manufacturer = str(row.get("manufacturer") or "").strip()
        dedup_key = make_dedup_key(drug_name, batch_no, manufacturer)

        existing = await db.execute(
            select(FlaggedBatch).where(FlaggedBatch.dedup_key == dedup_key)
        )
        if not existing.scalar_one_or_none():
            try:
                cat = AlertCategory(row.get("category", "NSQ"))
            except ValueError:
                cat = AlertCategory.NSQ

            # Ensure source doc exists
            src_id = item.source_id
            if src_id is None:
                # Create a placeholder source document
                src = SourceDocument(
                    url="manual-review",
                    sha256=f"manual-{dedup_key[:32]}",
                    month=row.get("month", "N/A"),
                )
                db.add(src)
                await db.flush()
                src_id = src.id

            batch = FlaggedBatch(
                source_id=src_id,
                drug_name=drug_name,
                drug_name_norm=normalise(drug_name),
                batch_no=batch_no,
                batch_no_norm=normalise(batch_no),
                manufacturer=manufacturer,
                manufacturer_norm=normalise(manufacturer),
                state=row.get("state"),
                failure_reason=row.get("failure_reason"),
                month=row.get("month"),
                category=cat,
                page_no=item.page_number,
                extraction_confidence=item.extraction_confidence or 0.0,
                source_pdf_url=None,
                review_status=ReviewStatus.APPROVED,
                dedup_key=dedup_key,
            )
            db.add(batch)
            await db.flush()
            item.approved_batch_id = batch.id

    await db.commit()
    return {"ok": True, "status": new_status.value}


@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    total_batches = await db.execute(
        select(func.count()).select_from(FlaggedBatch).where(
            FlaggedBatch.review_status == ReviewStatus.APPROVED
        )
    )
    pending_review = await db.execute(
        select(func.count()).select_from(ReviewQueue).where(
            ReviewQueue.status == ReviewStatus.PENDING
        )
    )
    last_source = await db.execute(
        select(SourceDocument.month)
        .order_by(SourceDocument.imported_at.desc())
        .limit(1)
    )
    last_month = last_source.scalar() or "N/A"
    return {
        "total_flagged_batches": total_batches.scalar(),
        "pending_review": pending_review.scalar(),
        "data_last_updated": last_month,
    }


# ---------------------------------------------------------------------------
# GET /api/explain — localized plain-language explanation (safety rule §5)
# ---------------------------------------------------------------------------
_ADVICE = {
    "en": (
        "Stop using this medicine immediately. Consult a pharmacist or doctor. "
        "Keep the strip or pack. Report to CDSCO helpline 1800-11-4477 or "
        "your state drug controller."
    ),
    "hi": (
        "इस दवा का उपयोग तुरंत बंद करें। फार्मासिस्ट या डॉक्टर से मिलें। "
        "पट्टी या पैक संभाल कर रखें। CDSCO हेल्पलाइन 1800-11-4477 या "
        "राज्य दवा नियंत्रक को रिपोर्ट करें।"
    ),
    "ta": "இந்த மருந்தை உடனடியாக பயன்படுத்துவதை நிறுத்துங்கள். மருந்தாளர் அல்லது மருத்துவரை அணுகுங்கள்.",
    "bn": "এই ওষুধ অবিলম্বে ব্যবহার বন্ধ করুন। ফার্মাসিস্ট বা ডাক্তারের সাথে পরামর্শ করুন।",
    "mr": "हे औषध त्वरित वापरणे बंद करा. फार्मासिस्ट किंवा डॉक्टरांचा सल्ला घ्या.",
    "te": "ఈ మందు వెంటనే ఉపయోగించడం ఆపండి. ఫార్మాసిస్ట్ లేదా డాక్టర్‌ని సంప్రదించండి.",
}

_FAILURE_EXPLANATIONS = {
    "en": {
        "dissolution": "This batch failed the dissolution test, meaning the tablet does not dissolve properly in the body.",
        "assay": "This batch failed the assay test, meaning the active ingredient is outside the permitted range.",
        "description": "This batch failed the description/appearance test — packaging or tablet appearance does not match specifications.",
        "sterility": "This batch failed the sterility test — it may be contaminated.",
        "default": "This batch failed quality testing by CDSCO. Do not use it.",
    },
    "hi": {
        "dissolution": "इस बैच ने विघटन परीक्षण में विफल रहा — गोली शरीर में ठीक से नहीं घुलती।",
        "assay": "इस बैच ने परख परीक्षण में विफल रहा — सक्रिय घटक अनुमत सीमा से बाहर है।",
        "description": "इस बैच ने विवरण/दिखावट परीक्षण में विफल रहा।",
        "sterility": "इस बैच ने बाँझपन परीक्षण में विफल रहा — यह दूषित हो सकता है।",
        "default": "इस बैच ने CDSCO की गुणवत्ता जाँच में विफल रहा। इसका उपयोग न करें।",
    },
}


@router.get("/explain")
async def explain(reason: str = "", lang: str = "hi"):
    """
    Return localized plain-language explanation for a failure reason.
    Safety rule §5: gives generic advice only — no dosage/diagnosis/alt drug.
    """
    lang_key = lang if lang in _ADVICE else "en"
    explanations = _FAILURE_EXPLANATIONS.get(lang_key, _FAILURE_EXPLANATIONS["en"])

    # Find best matching explanation
    reason_lower = reason.lower()
    explanation = explanations["default"]
    for key in ("dissolution", "assay", "description", "sterility"):
        if key in reason_lower:
            explanation = explanations[key]
            break

    return {
        "reason": reason,
        "explanation": explanation,
        "advice": _ADVICE[lang_key],
        "lang": lang_key,
    }
