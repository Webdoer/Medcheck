"""
Pipeline router — manual trigger + status.
Protected by admin JWT.
"""
import logging
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import PdfSource
from app.schemas.pipeline import PipelineRunRequest, PipelineRunResponse
from app.services.cdsco_scraper import discover_pdfs, download_pdf
from app.services.pdf_pipeline import process_pdf
from app.routers.admin import get_current_admin

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/pipeline", tags=["pipeline"])


async def _run_pipeline(db: AsyncSession, force: bool, month_label=None):
    stats = {
        "pdfs_discovered": 0,
        "pdfs_downloaded": 0,
        "rows_extracted": 0,
        "rows_approved": 0,
        "rows_queued_for_review": 0,
        "rows_skipped_duplicate": 0,
        "errors": [],
    }

    discovered = await discover_pdfs()
    stats["pdfs_discovered"] = len(discovered)

    for item in discovered:
        if month_label and item.get("month_label") != month_label:
            continue

        url = item["url"]
        category = item["category"]
        ml = item.get("month_label")

        # Check if already downloaded
        existing = await db.execute(select(PdfSource).where(PdfSource.url == url))
        existing_source = existing.scalar_one_or_none()

        if existing_source and existing_source.processed and not force:
            continue

        result = await download_pdf(url)
        if not result:
            stats["errors"].append(f"Download failed: {url}")
            continue

        local_path, file_hash = result

        if existing_source:
            if existing_source.file_hash == file_hash and not force:
                continue  # Same file, skip
            source = existing_source
            source.local_path = local_path
            source.file_hash = file_hash
            source.processed = False
        else:
            source = PdfSource(
                url=url,
                file_hash=file_hash,
                local_path=local_path,
                month_label=ml,
                category=category,
            )
            db.add(source)
            await db.flush()

        stats["pdfs_downloaded"] += 1

        page_stats = await process_pdf(db, source)
        stats["rows_extracted"] += page_stats["rows_extracted"]
        stats["rows_approved"] += page_stats["rows_approved"]
        stats["rows_queued_for_review"] += page_stats["rows_queued"]
        stats["rows_skipped_duplicate"] += page_stats["rows_skipped"]
        stats["errors"].extend(page_stats["errors"])

    return stats


@router.post("/run", response_model=PipelineRunResponse)
async def run_pipeline(
    req: PipelineRunRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    stats = await _run_pipeline(db, req.force, req.month_label)
    return PipelineRunResponse(**stats)
