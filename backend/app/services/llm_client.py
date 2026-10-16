"""
LLMClient — single interface for Gemma 4 (or any OpenAI-compat endpoint).

LLM_MODE controls behavior:
  "mock" — returns realistic canned extraction output; no LLM needed.
  "live" — routes to the real provider configured in LLM_PROVIDER.

Providers (LLM_MODE=live):
  "ollama"          → Ollama REST API (local)
  "openai_compat"   → Any OpenAI-compatible endpoint
  "google"          → Google Generative AI (Gemini)
"""
import json
import logging
from abc import ABC, abstractmethod
from typing import Any

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


# ---------------------------------------------------------------------------
# Abstract base
# ---------------------------------------------------------------------------
class BaseLLMProvider(ABC):
    @abstractmethod
    async def complete(self, system: str, user: str, *, json_mode: bool = False) -> str:
        """Return the text completion for system + user prompt."""


# ---------------------------------------------------------------------------
# Mock provider (LLM_MODE=mock)
# ---------------------------------------------------------------------------
class MockLLMProvider(BaseLLMProvider):
    """
    Returns realistic canned label extraction data.
    Used in local dev so the full flow works without a running LLM.
    Setting LLM_MODE_FORCE_INVALID=1 forces malformed JSON for testing retry logic.
    """
    import os as _os

    _CANNED = {
        "drug_name":    {"value": "DEMORIL TABLETS",     "confidence": 0.95},
        "batch_number": {"value": "B2024-DEMO-001",      "confidence": 0.91},
        "manufacturer": {"value": "FakePharma Pvt Ltd",  "confidence": 0.88},
        "mfg_date":     {"value": "2024-01",             "confidence": 0.97},
        "expiry_date":  {"value": "2026-01",             "confidence": 0.96},
        "licence_no":   {"value": "MFG/DL/FAKE/1234",   "confidence": 0.80},
    }

    async def complete(self, system: str, user: str, *, json_mode: bool = False) -> str:
        import os
        if os.environ.get("LLM_MODE_FORCE_INVALID"):
            return "THIS IS NOT VALID JSON {{{"
        return json.dumps(self._CANNED)


# ---------------------------------------------------------------------------
# Ollama provider
# ---------------------------------------------------------------------------
class OllamaProvider(BaseLLMProvider):
    def __init__(self):
        self.base_url = settings.LLM_BASE_URL.rstrip("/")
        self.model = settings.LLM_MODEL

    async def complete(self, system: str, user: str, *, json_mode: bool = False) -> str:
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "stream": False,
        }
        if json_mode:
            payload["format"] = "json"

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(f"{self.base_url}/api/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["message"]["content"]


# ---------------------------------------------------------------------------
# OpenAI-compatible provider
# ---------------------------------------------------------------------------
class OpenAICompatProvider(BaseLLMProvider):
    def __init__(self):
        self.base_url = settings.LLM_BASE_URL.rstrip("/")
        self.model = settings.LLM_MODEL
        self.api_key = settings.LLM_API_KEY

    async def complete(self, system: str, user: str, *, json_mode: bool = False) -> str:
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        async with httpx.AsyncClient(timeout=120, headers=headers) as client:
            resp = await client.post(f"{self.base_url}/v1/chat/completions", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]


# ---------------------------------------------------------------------------
# Google Generative AI provider
# ---------------------------------------------------------------------------
class GoogleGenAIProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = settings.LLM_API_KEY
        self.model = settings.LLM_MODEL  # e.g. "gemma-3-4b-it"

    async def complete(self, system: str, user: str, *, json_mode: bool = False) -> str:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.model}:generateContent?key={self.api_key}"
        )
        payload: dict[str, Any] = {
            "contents": [{"parts": [{"text": f"{system}\n\n{user}"}]}],
        }
        if json_mode:
            payload["generationConfig"] = {"responseMimeType": "application/json"}

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]


# ---------------------------------------------------------------------------
# Provider factory
# ---------------------------------------------------------------------------
_LIVE_PROVIDERS = {
    "ollama": OllamaProvider,
    "openai_compat": OpenAICompatProvider,
    "google": GoogleGenAIProvider,
}


def _make_provider() -> BaseLLMProvider:
    if settings.LLM_MODE == "mock":
        logger.info("LLMClient: using MOCK provider (LLM_MODE=mock)")
        return MockLLMProvider()
    provider_cls = _LIVE_PROVIDERS.get(settings.LLM_PROVIDER)
    if provider_cls is None:
        raise ValueError(
            f"Unknown LLM_PROVIDER: {settings.LLM_PROVIDER!r}. "
            f"Choose from: {list(_LIVE_PROVIDERS)}"
        )
    logger.info("LLMClient: using provider=%s model=%s", settings.LLM_PROVIDER, settings.LLM_MODEL)
    return provider_cls()


# ---------------------------------------------------------------------------
# Public LLMClient
# ---------------------------------------------------------------------------
class LLMClient:
    """Call .complete() for raw text or .complete_json() for parsed dict."""

    def __init__(self):
        self._provider = _make_provider()

    async def complete(self, system: str, user: str) -> str:
        return await self._provider.complete(system, user, json_mode=False)

    async def complete_json(self, system: str, user: str) -> dict:
        """
        Return parsed JSON dict.
        Retries once if the first parse fails (safety rule §4).
        Raises on second failure — caller routes to review queue.
        """
        raw = await self._provider.complete(system, user, json_mode=True)
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            # Strip markdown fences if model wrapped the JSON
            stripped = (
                raw.strip()
                .removeprefix("```json")
                .removeprefix("```")
                .removesuffix("```")
                .strip()
            )
            try:
                return json.loads(stripped)
            except json.JSONDecodeError:
                logger.warning("LLM JSON parse failed on first attempt, retrying once...")
                # Single retry
                raw2 = await self._provider.complete(system, user, json_mode=True)
                stripped2 = (
                    raw2.strip()
                    .removeprefix("```json")
                    .removeprefix("```")
                    .removesuffix("```")
                    .strip()
                )
                return json.loads(stripped2)  # raises if still invalid → caller handles


# Module-level singleton
llm_client = LLMClient()
