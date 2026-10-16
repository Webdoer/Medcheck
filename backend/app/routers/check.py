"""POST /check and POST /check/confirm — fuzzy batch check (two-step)."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.check import CheckRequest, CheckResponse, ConfirmRequest
from app.services.fuzzy_search import fuzzy_check, confirm_match

router = APIRouter(prefix="/api", tags=["check"])


@router.post("/check", response_model=CheckResponse)
async def check_medicine(req: CheckRequest, db: AsyncSession = Depends(get_db)):
    """
    Step 1: fuzzy check.
    POSSIBLE_MATCH returns candidates only (no flagged details).
    MATCH_FOUND and NOT_FOUND return full info.
    """
    result = await fuzzy_check(
        db,
        drug_name=req.drug_name,
        batch_number=req.batch_number,
        manufacturer=req.manufacturer,
        lang=req.lang,
    )
    return CheckResponse(**result)


@router.post("/check/confirm", response_model=CheckResponse)
async def confirm_possible_match(req: ConfirmRequest, db: AsyncSession = Depends(get_db)):
    """
    Step 2: user confirmed a POSSIBLE_MATCH candidate.
    Returns full flagged details (safety rule §3).
    """
    result = await confirm_match(db, candidate_id=req.candidate_id, lang=req.lang)
    return CheckResponse(**result)
