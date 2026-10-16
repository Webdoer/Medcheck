"""Application configuration via environment variables."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # --- Database ---
    # SQLite (default/local): sqlite+aiosqlite:///./data/medcheck.db
    # PostgreSQL: postgresql+asyncpg://user:pass@localhost:5432/medcheck
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/medcheck.db"

    # --- LLM ---
    # LLM_MODE: "mock" = canned realistic output, no LLM needed
    #           "live" = real Gemma / Ollama endpoint
    LLM_MODE: str = "mock"
    LLM_PROVIDER: str = "ollama"          # "ollama" | "openai_compat" | "google"
    LLM_BASE_URL: str = "http://localhost:11434"
    LLM_MODEL: str = "gemma3:4b"
    LLM_API_KEY: str = ""

    # --- OCR fallback ---
    TESSERACT_CMD: str = "tesseract"

    # --- CDSCO pipeline ---
    CDSCO_BASE_URL: str = "https://cdsco.gov.in/opencms/opencms/en/consumer/Drugs-with-Not-of-Standard-Quality/"
    PDF_STORAGE_DIR: str = "./data/pdfs"
    CONFIDENCE_THRESHOLD: float = 0.75   # rows below this → review queue
    PIPELINE_SCHEDULE_HOUR: int = 2       # 2 AM IST daily check

    # --- Auth (admin) ---
    ADMIN_TOKEN: str = "medcheck-admin-token-local"
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_please_use_32_random_bytes"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "medcheck2024"

    # --- TTS fallback ---
    TTS_CACHE_DIR: str = "./data/tts_cache"

    # --- Fuzzy search ---
    SIMILARITY_THRESHOLD: float = 0.4    # floor for rapidfuzz / pg_trgm
    LEVENSHTEIN_MAX_DISTANCE: int = 3

    @property
    def is_postgres(self) -> bool:
        return self.DATABASE_URL.startswith("postgresql")

    @property
    def is_sqlite(self) -> bool:
        return self.DATABASE_URL.startswith("sqlite")

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
