"""Pydantic schemas for OCR / label extraction endpoint."""
from pydantic import BaseModel, Field
from typing import Optional


class FieldExtraction(BaseModel):
    value: Optional[str] = None
    confidence: float = Field(0.0, ge=0.0, le=1.0)


class LabelOCRResponse(BaseModel):
    drug_name: FieldExtraction
    batch_number: FieldExtraction
    manufacturer: FieldExtraction
    mfg_date: FieldExtraction
    expiry_date: FieldExtraction
    licence_no: FieldExtraction
    raw_llm_output: Optional[str] = None
    routed_to_review: bool = False   # True if LLM output was invalid and queued


class BarcodePayload(BaseModel):
    raw: str
    drug_name: Optional[str] = None
    batch_number: Optional[str] = None
    manufacturer: Optional[str] = None
    mfg_date: Optional[str] = None
    expiry_date: Optional[str] = None
