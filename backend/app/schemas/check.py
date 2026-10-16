"""Pydantic schemas for check endpoint."""
from pydantic import BaseModel, Field
from typing import Optional, Literal


class CheckRequest(BaseModel):
    drug_name: str = Field(..., min_length=1, max_length=500)
    batch_number: str = Field(..., min_length=1, max_length=100)
    manufacturer: Optional[str] = None
    lang: str = "hi"


class ConfirmRequest(BaseModel):
    candidate_id: str = Field(..., description="ID of the candidate from POSSIBLE_MATCH")
    lang: str = "hi"


class AlertDetail(BaseModel):
    id: str
    drug_name: str
    batch_number: str
    manufacturer: Optional[str] = None
    state: Optional[str] = None
    failure_reason: Optional[str] = None
    month_label: Optional[str] = None
    category: str
    source_pdf_url: Optional[str] = None
    page_number: Optional[int] = None
    extraction_confidence: float = 1.0


class CandidateDetail(BaseModel):
    """Partial info shown for POSSIBLE_MATCH before confirmation."""
    id: str
    drug_name: str
    batch_no: str
    manufacturer: Optional[str] = None
    month: Optional[str] = None
    category: str


class DiffChar(BaseModel):
    position: int
    user_char: str
    flagged_char: str


class CheckResponse(BaseModel):
    status: Literal["MATCH_FOUND", "POSSIBLE_MATCH", "NOT_FOUND"]
    alert: Optional[AlertDetail] = None
    candidates: Optional[list[CandidateDetail]] = None
    similarity_score: Optional[float] = None
    diff_chars: Optional[list[DiffChar]] = None
    message_key: str
    plain_message: str
    data_last_updated: str = "N/A"
