"""
TTS service — Web Speech API is primary; this is the server-side fallback.

POST /api/tts  { text: str, lang: str }  →  audio/mpeg stream
"""
import hashlib
import logging
from pathlib import Path

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_LANG_MAP = {
    "hi": "hi",
    "en": "en-IN",
    "ta": "ta",
    "bn": "bn",
    "mr": "mr",
    "te": "te",
}


async def synthesise(text: str, lang: str = "hi") -> bytes:
    """
    Synthesise speech using gTTS.
    Returns MP3 bytes (cached on disk for repeated queries).
    """
    from gtts import gTTS
    import io

    cache_dir = Path(settings.TTS_CACHE_DIR)
    cache_dir.mkdir(parents=True, exist_ok=True)

    cache_key = hashlib.md5(f"{lang}:{text}".encode()).hexdigest()
    cache_path = cache_dir / f"{cache_key}.mp3"

    if cache_path.exists():
        return cache_path.read_bytes()

    gtts_lang = _LANG_MAP.get(lang, "hi")
    tts = gTTS(text=text, lang=gtts_lang, slow=False)

    buf = io.BytesIO()
    tts.write_to_fp(buf)
    mp3_bytes = buf.getvalue()

    cache_path.write_bytes(mp3_bytes)
    return mp3_bytes
