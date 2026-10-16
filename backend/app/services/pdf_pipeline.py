"""
CDSCO PDF pipeline service.

Flow:
  1. cdsco_scraper.discover_pdfs()  → list of (url, category, month_label)
  2. For each: download if hash is new, store PdfSource
  3. For each PDF page:
     a. Try pypdf text extraction
     b. If text is sparse → OCR with Tesseract (pdf2image + pytesseract)
     c. Send text to Gemma 4 with table-extraction prompt → list of row dicts
  4. Validate rows; below confidence_threshold → ReviewQueue
  5. Above threshold → DrugAlert (idempotent via dedup_key)
"""
import hashlib
import json
import logging
import os
import tempfile
from pathlib import Path
from typing import Optional

import aiofiles
import httpx
from PIL import Image
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import DrugAlert, PdfSource, ReviewQueue, AlertCategory, ReviewStatus
from app.services.llm_client import llm_client
from app.services.normalise import normalise, make_dedup_key

logger = logging.getLogger(__name__)
settings = get_settings()

_TABLE_SYSTEM_PROMPT = """\
You are a pharmaceutical regulatory data extractor. You will receive text from a CDSCO
(Central Drugs Standard Control Organisation) PDF listing drugs that are "Not of Standard
Quality" (NSQ) or spurious.

Extract ALL rows from the table and return a JSON array of objects. Each object MUST follow
this exact schema:

{
  "drug_name":   "<string>",
  "batch_number":"<string>",
  "manufacturer":"<string>",
  "state":       "<string|null>",
  "failure_reason": "<string|null>",
  "month_label": "<string|null>",
  "category":    "NSQ" | "SPURIOUS",
  "confidence":  <0.0-1.0>
}

Rules:
- confidence: your certainty this row was extracted correctly (check split rows, OCR errors).
- If a row spans multiple lines, merge it into one object.
- If the table has no state column, set state to null.
- failure_reason examples: "Failed Dissolution Test", "Assay Below Limit", "Microbial Contamination".
- Return ONLY the JSON array, no markdown, no explanation.
"""


async def _extract_text_from_page(pdf_path: str, page_num: int) -> tuple[str, Optional[str]]:
    """
    Extract text from a PDF page. Returns (text, image_path).
    Falls back to OCR if text is sparse.
    """
    import pypdf

    reader = pypdf.PdfReader(pdf_path)
    if page_num >= len(reader.pages):
        return "", None

    page = reader.pages[page_num]
    text = page.extract_text() or ""

    # image_path for review queue thumbnail
    image_path: Optional[str] = None

    if len(text.strip()) < 100:
        # Sparse text → OCR fallback
        try:
            from pdf2image import convert_from_path
            import pytesseract

            images = convert_from_path(
                pdf_path, first_page=page_num + 1, last_page=page_num + 1, dpi=200
            )
            if images:
                img = images[0]
                # Save thumbnail for review queue
                img_dir = Path(settings.PDF_STORAGE_DIR) / "page_images"
                img_dir.mkdir(parents=True, exist_ok=True)
                fname = f"{Path(pdf_path).stem}_p{page_num}.png"
                image_path = str(img_dir / fname)
                img.save(image_path)
                # OCR
                text = pytesseract.image_to_string(img, lang="eng")
        except Exception as exc:
            logger.warning("OCR failed for page %d: %s", page_num, exc)

    return text, image_path


async def process_pdf(
    db: AsyncSession,
    source: PdfSource,
) -> dict:
    """Process a single PDF: extract rows and write to DB."""
    import pypdf

    stats = {
        "rows_extracted": 0,
        "rows_approved": 0,
        "rows_queued": 0,
        "rows_skipped": 0,
        "errors": [],
    }

    reader = pypdf.PdfReader(source.local_path)
    total_pages = len(reader.pages)

    for page_num in range(total_pages):
        try:
            page_text, page_image_path = await _extract_text_from_page(
                source.local_path, page_num
            )
            if not page_text.strip():
                continue

            # Ask LLM to extract rows
            try:
                rows = await llm_client.complete_json(
                    _TABLE_SYSTEM_PROMPT,
                    f"PDF page {page_num + 1} of {total_pages}:\n\n{page_text[:8000]}",
                )
                if not isinstance(rows, list):
                    rows = [rows] if isinstance(rows, dict) else []
            except Exception as exc:
                logger.error("LLM extraction failed p%d: %s", page_num, exc)
                stats["errors"].append(f"Page {page_num}: LLM error: {exc}")
                continue

            for row in rows:
                stats["rows_extracted"] += 1
                confidence = float(row.get("confidence", 0.0))

                drug_name = str(row.get("drug_name") or "").strip()
                batch_number = str(row.get("batch_number") or "").strip()
                if not drug_name or not batch_number:
                    continue

                manufacturer = str(row.get("manufacturer") or "").strip()
                dedup_key = make_dedup_key(drug_name, batch_number, manufacturer)

                # Idempotency check
                existing = await db.execute(
                    select(DrugAlert).where(DrugAlert.dedup_key == dedup_key)
                )
                if existing.scalar_one_or_none():
                    stats["rows_skipped"] += 1
                    continue

                if confidence < settings.CONFIDENCE_THRESHOLD:
                    # → review queue
                    queue_item = ReviewQueue(
                        source_id=source.id,
                        raw_data=json.dumps(row),
                        page_number=page_num + 1,
                        extraction_confidence=confidence,
                        page_image_path=page_image_path,
                        status=ReviewStatus.PENDING,
                    )
                    db.add(queue_item)
                    stats["rows_queued"] += 1
                else:
                    # → approved alert
                    try:
                        cat = AlertCategory(row.get("category", "NSQ"))
                    except ValueError:
                        cat = AlertCategory.NSQ

                    alert = DrugAlert(
                        source_id=source.id,
                        drug_name=drug_name,
                        drug_name_norm=normalise(drug_name),
                        batch_number=batch_number,
                        batch_number_norm=normalise(batch_number),
                        manufacturer=manufacturer,
                        manufacturer_norm=normalise(manufacturer),
                        state=row.get("state"),
                        failure_reason=row.get("failure_reason"),
                        month_label=row.get("month_label") or source.month_label,
                        category=cat,
                        page_number=page_num + 1,
                        extraction_confidence=confidence,
                        source_pdf_url=source.url,
                        dedup_key=dedup_key,
                    )
                    db.add(alert)
                    stats["rows_approved"] += 1

        except Exception as exc:
            logger.error("Error processing page %d: %s", page_num, exc)
            stats["errors"].append(f"Page {page_num}: {exc}")

    source.processed = True
    await db.commit()
    return stats
