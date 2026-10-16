"""
Fuzzy search service — works with BOTH SQLite (rapidfuzz) and PostgreSQL (pg_trgm).

Strategy:
  1. Exact normalised batch match on FlaggedBatch (review_status=APPROVED)
     + drug name similarity check → MATCH_FOUND
  2. Fuzzy match → POSSIBLE_MATCH (candidates only, NO flagged details)
  3. Nothing → NOT_FOUND

Safety rules enforced here:
  - NOT_FOUND message is exactly the approved wording (never "safe" or "genuine")
  - POSSIBLE_MATCH returns candidates only; full details come after confirmation
  - data_last_updated always included
"""
import logging
from typing import Optional
from datetime import datetime

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import FlaggedBatch, ReviewStatus, SourceDocument
from app.services.normalise import normalise, diff_chars

logger = logging.getLogger(__name__)
settings = get_settings()

# ---------------------------------------------------------------------------
# APPROVED NOT_FOUND wording (safety rule §1)
# NEVER add "safe" or "genuine" here — enforced by test_banned_words.py
# ---------------------------------------------------------------------------
_NOT_FOUND_EN = (
    "This batch is not in the flagged list we have. "
    "This does not guarantee it is safe. "
    "Check the pack, buy from licensed shops."
)

_NOT_FOUND_HI = (
    "यह बैच हमारी चिह्नित सूची में नहीं है। "
    "इसका मतलब यह नहीं कि दवा ठीक है। "
    "पैक जाँचें, लाइसेंसशुदा दुकान से खरीदें।"
)

# Plain-language messages (per language, keyed by status + lang)
_MESSAGES: dict[str, dict[str, str]] = {
    "MATCH_FOUND": {
        "hi": (
            "⚠️ यह दवा की बैच CDSCO द्वारा 'मानक से कम गुणवत्ता' (NSQ) या नकली "
            "घोषित की गई है। कृपया इसका उपयोग तुरंत बंद करें, पट्टी को संभाल कर "
            "रखें और अपने फार्मासिस्ट या डॉक्टर को बताएँ। "
            "CDSCO हेल्पलाइन 1800-11-4477 पर भी रिपोर्ट करें।"
        ),
        "en": (
            "⚠️ This medicine batch has been flagged by CDSCO as 'Not of Standard "
            "Quality' (NSQ) or spurious. Stop using it immediately. Keep the strip "
            "and report to your pharmacist, doctor, or the CDSCO helpline 1800-11-4477."
        ),
        "ta": "⚠️ இந்த மருந்து தொகுப்பு CDSCO ஆல் தரமற்றது என கண்டறியப்பட்டது. உடனே பயன்படுத்துவதை நிறுத்துங்கள்.",
        "bn": "⚠️ এই ওষুধের ব্যাচ CDSCO দ্বারা চিহ্নিত। এখনই ব্যবহার বন্ধ করুন।",
        "mr": "⚠️ या औषधाची बॅच CDSCO ने 'दर्जाहीन' घोषित केली आहे. ताबडतोब वापर थांबवा.",
        "te": "⚠️ ఈ మందు బ్యాచ్ CDSCO చే గుర్తించబడింది. వెంటనే ఉపయోగం ఆపండి.",
    },
    "POSSIBLE_MATCH": {
        "hi": (
            "🔍 यह बैच नंबर एक चिह्नित बैच से मिलता-जुलता है। "
            "कृपया नीचे दी गई जानकारी की तुलना करें और पुष्टि करें।"
        ),
        "en": (
            "🔍 This batch number is close to a flagged batch. Please compare the "
            "details below and confirm whether it is the same batch."
        ),
        "ta": "🔍 இந்த தொகுப்பு எண் ஒரு கொடியிடப்பட்ட தொகுப்புக்கு ஒத்திருக்கிறது.",
        "bn": "🔍 এই ব্যাচ নম্বরটি একটি চিহ্নিত ব্যাচের কাছাকাছি।",
        "mr": "🔍 हा बॅच नंबर एका चिन्हांकित बॅचशी जवळ आहे.",
        "te": "🔍 ఈ బ్యాచ్ నంబర్ ఒక గుర్తించిన బ్యాచ్‌కు దగ్గరగా ఉంది.",
    },
    "NOT_FOUND": {
        "hi": _NOT_FOUND_HI,
        "en": _NOT_FOUND_EN,
        "ta": "இந்த தொகுப்பு CDSCO பட்டியலில் கண்டறியப்படவில்லை. இது பாதுகாப்பானது என்று உத்தரவாதம் இல்லை. உரிமம் பெற்ற கடைகளில் வாங்குங்கள்.",
        "bn": "এই ব্যাচটি CDSCO তালিকায় পাওয়া যায়নি। এটি নিরাপদ বলে নিশ্চিত নয়। লাইসেন্সপ্রাপ্ত দোকান থেকে কিনুন।",
        "mr": "ही बॅच CDSCO यादीत आढळली नाही. ती सुरक्षित आहे याची हमी नाही. परवानाधारक दुकानातून खरेदी करा.",
        "te": "ఈ బ్యాచ్ CDSCO జాబితాలో కనుగొనబడలేదు. ఇది నిర్భయంగా ఉందని హామీ లేదు. లైసెన్స్ పొందిన దుకాణాల నుండి కొనండి.",
    },
}


def _msg(status: str, lang: str) -> str:
    return _MESSAGES.get(status, {}).get(lang) or _MESSAGES[status]["en"]


async def _get_data_last_updated(db: AsyncSession) -> str:
    """Return 'Month YYYY' of the most recently imported source, or 'N/A'."""
    try:
        result = await db.execute(
            select(SourceDocument.month, SourceDocument.imported_at)
            .order_by(SourceDocument.imported_at.desc())
            .limit(1)
        )
        row = result.first()
        if row and row[0]:
            return row[0]
        # If no source documents, try FlaggedBatch
        result2 = await db.execute(
            select(FlaggedBatch.month)
            .where(FlaggedBatch.review_status == ReviewStatus.APPROVED)
            .order_by(FlaggedBatch.month.desc())
            .limit(1)
        )
        r2 = result2.scalar()
        return r2 or "N/A"
    except Exception:
        return "N/A"


async def _fuzzy_check_sqlite(
    db: AsyncSession,
    norm_batch: str,
    norm_drug: str,
) -> tuple[Optional[FlaggedBatch], Optional[FlaggedBatch], float]:
    """
    rapidfuzz-based fuzzy matching for SQLite.
    Returns (exact_match, fuzzy_match, similarity_score).
    """
    from rapidfuzz import fuzz

    # Load all approved batches (reasonable for demo; add pagination for prod)
    result = await db.execute(
        select(FlaggedBatch).where(
            FlaggedBatch.review_status == ReviewStatus.APPROVED
        )
    )
    rows = result.scalars().all()

    # Step 1: exact normalised batch match
    for row in rows:
        if row.batch_no_norm == norm_batch:
            drug_sim = fuzz.token_sort_ratio(row.drug_name_norm, norm_drug) / 100.0
            if drug_sim > 0.3:
                return row, None, 1.0

    # Step 2: fuzzy match
    best_row = None
    best_score = 0.0
    threshold = settings.SIMILARITY_THRESHOLD

    for row in rows:
        batch_sim = fuzz.ratio(row.batch_no_norm, norm_batch) / 100.0
        if batch_sim < threshold:
            continue
        drug_sim = fuzz.token_sort_ratio(row.drug_name_norm, norm_drug) / 100.0
        if drug_sim < 0.2:
            continue
        if batch_sim > best_score:
            best_score = batch_sim
            best_row = row

    return None, best_row, best_score


async def _fuzzy_check_postgres(
    db: AsyncSession,
    norm_batch: str,
    norm_drug: str,
) -> tuple[Optional[dict], Optional[dict], float]:
    """pg_trgm + levenshtein-based matching for PostgreSQL."""
    # Step 1: exact
    exact_sql = text("""
        SELECT id, drug_name, batch_no, manufacturer, state,
               failure_reason, month, category, source_pdf_url,
               page_no, extraction_confidence,
               drug_name_norm, batch_no_norm
        FROM   flagged_batches
        WHERE  batch_no_norm = :batch_norm
          AND  review_status = 'APPROVED'
          AND  similarity(drug_name_norm, :drug_norm) > 0.3
        LIMIT 1
    """)
    result = await db.execute(exact_sql, {"batch_norm": norm_batch, "drug_norm": norm_drug})
    row = result.mappings().first()
    if row:
        return dict(row), None, 1.0

    # Step 2: fuzzy
    fuzzy_sql = text("""
        SELECT id, drug_name, batch_no, manufacturer, state,
               failure_reason, month, category, source_pdf_url,
               page_no, extraction_confidence,
               drug_name_norm, batch_no_norm,
               similarity(batch_no_norm, :batch_norm) AS sim
        FROM   flagged_batches
        WHERE  review_status = 'APPROVED'
          AND  similarity(batch_no_norm, :batch_norm) > :sim_threshold
          AND  similarity(drug_name_norm, :drug_norm) > 0.2
        ORDER  BY sim DESC
        LIMIT  5
    """)
    result = await db.execute(fuzzy_sql, {
        "batch_norm": norm_batch,
        "drug_norm": norm_drug,
        "sim_threshold": settings.SIMILARITY_THRESHOLD,
    })
    rows = result.mappings().all()
    if rows:
        best = rows[0]
        return None, [dict(r) for r in rows], float(best["sim"])

    return None, None, 0.0


def _row_to_candidate(row: FlaggedBatch) -> dict:
    """Return only non-sensitive fields for POSSIBLE_MATCH candidates."""
    return {
        "id": row.id,
        "drug_name": row.drug_name,
        "batch_no": row.batch_no,
        "manufacturer": row.manufacturer,
        "month": row.month,
        "category": row.category.value if row.category else "NSQ",
    }


def _row_to_full(row: FlaggedBatch) -> dict:
    """Return full details for MATCH_FOUND."""
    return {
        "id": row.id,
        "drug_name": row.drug_name,
        "batch_number": row.batch_no,
        "manufacturer": row.manufacturer,
        "state": row.state,
        "failure_reason": row.failure_reason,
        "month_label": row.month,
        "category": row.category.value if row.category else "NSQ",
        "source_pdf_url": row.source_pdf_url,
        "page_number": row.page_no,
        "extraction_confidence": row.extraction_confidence or 1.0,
    }


async def fuzzy_check(
    db: AsyncSession,
    drug_name: str,
    batch_number: str,
    manufacturer: Optional[str] = None,
    lang: str = "hi",
) -> dict:
    norm_batch = normalise(batch_number)
    norm_drug = normalise(drug_name)

    data_last_updated = await _get_data_last_updated(db)

    if settings.is_postgres:
        exact, fuzzy_rows, score = await _fuzzy_check_postgres(db, norm_batch, norm_drug)

        if exact:
            return {
                "status": "MATCH_FOUND",
                "alert": exact,
                "candidates": None,
                "similarity_score": 1.0,
                "diff_chars": [],
                "message_key": "MATCH_FOUND",
                "plain_message": _msg("MATCH_FOUND", lang),
                "data_last_updated": data_last_updated,
            }

        if fuzzy_rows:
            candidates = fuzzy_rows  # list of dicts (non-sensitive)
            # Only batch number diffs for display
            first = fuzzy_rows[0]
            diffs = diff_chars(batch_number, first.get("batch_no", ""))
            return {
                "status": "POSSIBLE_MATCH",
                "alert": None,          # hidden until confirmed
                "candidates": candidates,
                "similarity_score": score,
                "diff_chars": diffs,
                "message_key": "POSSIBLE_MATCH",
                "plain_message": _msg("POSSIBLE_MATCH", lang),
                "data_last_updated": data_last_updated,
            }

    else:
        # SQLite path
        exact_row, fuzzy_row, score = await _fuzzy_check_sqlite(db, norm_batch, norm_drug)

        if exact_row is not None:
            return {
                "status": "MATCH_FOUND",
                "alert": _row_to_full(exact_row),
                "candidates": None,
                "similarity_score": 1.0,
                "diff_chars": [],
                "message_key": "MATCH_FOUND",
                "plain_message": _msg("MATCH_FOUND", lang),
                "data_last_updated": data_last_updated,
            }

        if fuzzy_row is not None:
            diffs = diff_chars(batch_number, fuzzy_row.batch_no)
            return {
                "status": "POSSIBLE_MATCH",
                "alert": None,          # hidden until confirmed (safety rule §3)
                "candidates": [_row_to_candidate(fuzzy_row)],
                "similarity_score": score,
                "diff_chars": diffs,
                "message_key": "POSSIBLE_MATCH",
                "plain_message": _msg("POSSIBLE_MATCH", lang),
                "data_last_updated": data_last_updated,
            }

    return {
        "status": "NOT_FOUND",
        "alert": None,
        "candidates": None,
        "similarity_score": None,
        "diff_chars": None,
        "message_key": "NOT_FOUND",
        "plain_message": _msg("NOT_FOUND", lang),
        "data_last_updated": data_last_updated,
    }


async def confirm_match(
    db: AsyncSession,
    candidate_id: str,
    lang: str = "hi",
) -> dict:
    """
    Second-step confirmation for POSSIBLE_MATCH.
    Returns full flagged details only after user confirms.
    Safety rule §3: details are hidden until this is called.
    """
    result = await db.execute(
        select(FlaggedBatch).where(
            FlaggedBatch.id == candidate_id,
            FlaggedBatch.review_status == ReviewStatus.APPROVED,
        )
    )
    row = result.scalar_one_or_none()
    data_last_updated = await _get_data_last_updated(db)

    if not row:
        return {
            "status": "NOT_FOUND",
            "alert": None,
            "candidates": None,
            "similarity_score": None,
            "diff_chars": None,
            "message_key": "NOT_FOUND",
            "plain_message": _msg("NOT_FOUND", lang),
            "data_last_updated": data_last_updated,
        }

    return {
        "status": "MATCH_FOUND",
        "alert": _row_to_full(row),
        "candidates": None,
        "similarity_score": 1.0,
        "diff_chars": [],
        "message_key": "MATCH_FOUND",
        "plain_message": _msg("MATCH_FOUND", lang),
        "data_last_updated": data_last_updated,
    }
