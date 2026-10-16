"""POST /api/tts — server-side speech synthesis fallback."""
from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel

from app.services.tts_service import synthesise

router = APIRouter(prefix="/api/tts", tags=["tts"])


class TTSRequest(BaseModel):
    text: str
    lang: str = "hi"


@router.post("")
async def text_to_speech(req: TTSRequest):
    mp3_bytes = await synthesise(req.text, req.lang)
    return Response(content=mp3_bytes, media_type="audio/mpeg")
