"""
CDSCO website scraper — discovers NSQ and spurious PDF links.
"""
import hashlib
import logging
import re
from pathlib import Path
from typing import Optional

import httpx
from bs4 import BeautifulSoup

from app.config import get_settings
from app.models import AlertCategory

logger = logging.getLogger(__name__)
settings = get_settings()


async def discover_pdfs() -> list[dict]:
    """
    Scrape the CDSCO NSQ/spurious pages and return a list of:
      {"url": str, "category": AlertCategory, "month_label": str|None}
    """
    results = []

    pages = [
        (settings.CDSCO_BASE_URL, AlertCategory.NSQ),
        (
            "https://cdsco.gov.in/opencms/opencms/en/consumer/Spurious-Drugs/",
            AlertCategory.SPURIOUS,
        ),
    ]

    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        for page_url, category in pages:
            try:
                resp = await client.get(page_url)
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "html.parser")

                for link in soup.find_all("a", href=True):
                    href = link["href"]
                    if not href.lower().endswith(".pdf"):
                        continue
                    full_url = href if href.startswith("http") else f"https://cdsco.gov.in{href}"
                    month_label = _extract_month_label(link.get_text(strip=True))
                    results.append(
                        {"url": full_url, "category": category, "month_label": month_label}
                    )
            except Exception as exc:
                logger.error("Scraping %s failed: %s", page_url, exc)

    return results


def _extract_month_label(text: str) -> Optional[str]:
    """Try to extract YYYY-MM from link text like 'September 2024'."""
    months = {
        "january": "01", "february": "02", "march": "03", "april": "04",
        "may": "05", "june": "06", "july": "07", "august": "08",
        "september": "09", "october": "10", "november": "11", "december": "12",
    }
    text_lower = text.lower()
    for month_name, month_num in months.items():
        if month_name in text_lower:
            year_match = re.search(r"(20\d{2})", text)
            if year_match:
                return f"{year_match.group(1)}-{month_num}"
    return None


async def download_pdf(url: str) -> Optional[tuple[str, str]]:
    """
    Download PDF to PDF_STORAGE_DIR.
    Returns (local_path, sha256_hex) or None on failure.
    """
    storage = Path(settings.PDF_STORAGE_DIR)
    storage.mkdir(parents=True, exist_ok=True)

    filename = url.split("/")[-1].split("?")[0] or "download.pdf"
    local_path = storage / filename

    try:
        async with httpx.AsyncClient(timeout=120, follow_redirects=True) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            content = resp.content

        sha256 = hashlib.sha256(content).hexdigest()
        async with __import__("aiofiles").open(local_path, "wb") as f:
            await f.write(content)

        return str(local_path), sha256
    except Exception as exc:
        logger.error("Download failed %s: %s", url, exc)
        return None
