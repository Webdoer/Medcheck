"""Pydantic schemas for the PDF pipeline and admin review queue."""
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models import AlertCategory, ReviewStatus


class PipelineRunRequest(BaseModel):
    force: bool = False          # re-process already-processed PDFs
    month_label: Optional[str] = None  # e.g. "2024-09", None = discover all new


class PipelineRunResponse(BaseModel):
    pdfs_discovered: int
    pdfs_downloaded: int
    rows_extracted: int
    rows_approved: int
    rows_queued_for_review: int
    rows_skipped_duplicate: int
    errors: List[str] = []


class ReviewQueueItem(BaseModel):
    id: UUID
    source_id: UUID
    raw_data: dict
    page_number: Optional[int]
    extraction_confidence: float
    page_image_path: Optional[str]
    status: ReviewStatus
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewDecision(BaseModel):
    status: ReviewStatus                    # APPROVED or REJECTED
    corrected_data: Optional[dict] = None  # admin-edited row (if APPROVED)
    admin_notes: Optional[str] = None
