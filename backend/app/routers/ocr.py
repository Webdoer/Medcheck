"""POST /api/ocr/label — send label image to LLM for extraction."""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.ocr import LabelOCRResponse
from app.services.label_ocr import extract_label

router = APIRouter(prefix="/api/ocr", tags=["ocr"])

_MAX_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/label", response_model=LabelOCRResponse)
async def ocr_label(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(400, "Unsupported image type. Use JPEG, PNG or WebP.")

    content = await file.read()
    if len(content) > _MAX_SIZE:
        raise HTTPException(413, "Image too large (max 10 MB).")

    # Image processed in memory, not stored (safety rule §6)
    result = await extract_label(content, mime_type=file.content_type or "image/jpeg", db=db)
    return LabelOCRResponse(**result)
