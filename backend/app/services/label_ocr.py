"""
Label OCR service.

Sends a base64-encoded image to the configured LLM (mock or real) with a strict
Pydantic schema validation. If the LLM returns invalid output, retries once,
then routes to the human review queue. Never invents missing fields (safety rule §4).
"""
import base64
import json
import logging
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from app.services.llm_client import llm_client

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """\
You are a pharmaceutical label OCR assistant. Extract information from the medicine label image.
Return ONLY valid JSON matching this EXACT schema — no extra keys, no markdown fences:

{
  "drug_name":    {"value": "<string|null>", "confidence": <0.0-1.0>},
  "batch_number": {"value": "<string|null>", "confidence": <0.0-1.0>},
  "manufacturer": {"value": "<string|null>", "confidence": <0.0-1.0>},
  "mfg_date":     {"value": "<string|null>", "confidence": <0.0-1.0>},
  "expiry_date":  {"value": "<string|null>", "confidence": <0.0-1.0>},
  "licence_no":   {"value": "<string|null>", "confidence": <0.0-1.0>}
}

Rules:
- confidence is your certainty that the extracted value is correct (0=unsure, 1=certain).
- Set value to null if the field is not visible or illegible — do NOT guess.
- For batch_number: look for "Batch No.", "B.No.", "Lot No.", "बैच नं."
- For mfg_date / expiry_date: output as YYYY-MM or YYYY-MM-DD.
- Beware look-alike characters: 0/O, 1/I/l, 5/S, 8/B. If ambiguous, lower confidence.
"""


# ---------------------------------------------------------------------------
# Strict Pydantic schema for LLM output (safety rule §4)
# ---------------------------------------------------------------------------
class FieldExtraction(BaseModel):
    value: Optional[str] = None
    confidence: float = Field(ge=0.0, le=1.0, default=0.0)

    @field_validator("value", mode="before")
    @classmethod
    def coerce_empty_to_none(cls, v):
        if v == "" or v == "null":
            return None
        return v


class LabelExtractionSchema(BaseModel):
    drug_name: FieldExtraction = Field(default_factory=lambda: FieldExtraction())
    batch_number: FieldExtraction = Field(default_factory=lambda: FieldExtraction())
    manufacturer: FieldExtraction = Field(default_factory=lambda: FieldExtraction())
    mfg_date: FieldExtraction = Field(default_factory=lambda: FieldExtraction())
    expiry_date: FieldExtraction = Field(default_factory=lambda: FieldExtraction())
    licence_no: FieldExtraction = Field(default_factory=lambda: FieldExtraction())


_EMPTY_FIELD = {"value": None, "confidence": 0.0}
_EMPTY_RESULT = {
    "drug_name": _EMPTY_FIELD,
    "batch_number": _EMPTY_FIELD,
    "manufacturer": _EMPTY_FIELD,
    "mfg_date": _EMPTY_FIELD,
    "expiry_date": _EMPTY_FIELD,
    "licence_no": _EMPTY_FIELD,
    "raw_llm_output": None,
    "routed_to_review": False,
}


def _validate_extraction(raw: dict) -> LabelExtractionSchema:
    """Validate LLM output against strict schema. Raises ValidationError if invalid."""
    from pydantic import ValidationError
    return LabelExtractionSchema(**raw)


async def extract_label(
    image_bytes: bytes,
    mime_type: str = "image/jpeg",
    db=None,       # optional AsyncSession — used to queue failed rows
    source_id: Optional[str] = None,
) -> dict:
    """
    Send image to LLM for label extraction.

    Safety rule §4:
    - Validates against strict Pydantic schema.
    - If invalid, retries once (handled by llm_client.complete_json).
    - If still invalid, routes to review queue and returns empty fields.
    - Never invents missing fields: uses null with confidence 0.

    Safety rule §6:
    - Image bytes are processed in memory here and not stored unless
      the caller explicitly saves them.
    """
    b64 = base64.b64encode(image_bytes).decode()
    user_prompt = (
        f"<image data-mime='{mime_type}' data-base64='{b64}'/>\n"
        "Extract the medicine label fields from the image above."
    )

    raw_str = None
    try:
        raw = await llm_client.complete_json(_SYSTEM_PROMPT, user_prompt)
        raw_str = json.dumps(raw)
    except Exception as exc:
        logger.error("LLM label extraction failed: %s", exc)
        raw_str = str(exc)
        # Route to review queue
        if db is not None:
            await _route_to_review(db, source_id, raw_str, exc)
        result = dict(_EMPTY_RESULT)
        result["raw_llm_output"] = raw_str
        result["routed_to_review"] = True
        return result

    # Validate schema
    try:
        validated = _validate_extraction(raw)
    except Exception as exc:
        logger.warning("LLM output schema validation failed: %s. Routing to review.", exc)
        if db is not None:
            await _route_to_review(db, source_id, raw_str, exc)
        result = dict(_EMPTY_RESULT)
        result["raw_llm_output"] = raw_str
        result["routed_to_review"] = True
        return result

    return {
        **validated.model_dump(),
        "raw_llm_output": None,
        "routed_to_review": False,
    }


async def _route_to_review(db, source_id: Optional[str], raw_str: str, exc: Exception):
    """Persist failed LLM output to the review queue."""
    try:
        from app.models import ReviewQueue
        item = ReviewQueue(
            source_id=source_id,
            raw_data=json.dumps({"error": str(exc), "raw_llm_output": raw_str}),
            extraction_confidence=0.0,
        )
        db.add(item)
        await db.commit()
        logger.info("Routed failed LLM extraction to review queue")
    except Exception as queue_exc:
        logger.error("Failed to route to review queue: %s", queue_exc)
