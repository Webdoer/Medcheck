"""FastAPI application entry point."""
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import engine, Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure data directories exist
    os.makedirs("./data/pdfs", exist_ok=True)
    os.makedirs("./data/tts_cache", exist_ok=True)

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Enable PostgreSQL extensions only when using Postgres
    if settings.is_postgres:
        from sqlalchemy import text
        async with engine.begin() as conn:
            try:
                await conn.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm;"))
                await conn.execute(text("CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;"))
                logger.info("PostgreSQL extensions enabled (pg_trgm, fuzzystrmatch)")
            except Exception as e:
                logger.warning("Could not enable PG extensions: %s", e)
    else:
        logger.info("Running in SQLite mode — using rapidfuzz for fuzzy matching")

    # Start scheduler only if APScheduler is available
    try:
        from apscheduler.schedulers.asyncio import AsyncIOScheduler

        scheduler = AsyncIOScheduler(timezone="Asia/Kolkata")
        scheduler.add_job(
            _scheduled_pipeline,
            "cron",
            hour=settings.PIPELINE_SCHEDULE_HOUR,
            minute=0,
        )
        scheduler.start()
        logger.info(
            "Scheduler started; pipeline runs daily at %02d:00 IST",
            settings.PIPELINE_SCHEDULE_HOUR,
        )
        app.state.scheduler = scheduler
        yield
        scheduler.shutdown(wait=False)
    except ImportError:
        logger.warning("APScheduler not available; scheduled pipeline disabled")
        yield


async def _scheduled_pipeline():
    """Runs in background at configured hour every day."""
    from app.database import AsyncSessionLocal

    logger.info("Scheduled pipeline starting...")
    async with AsyncSessionLocal() as db:
        try:
            from app.routers.pipeline import _run_pipeline
            stats = await _run_pipeline(db, force=False)
            logger.info("Scheduled pipeline complete: %s", stats)
        except Exception as e:
            logger.error("Scheduled pipeline failed: %s", e)


app = FastAPI(
    title="MedCheck API",
    description="CDSCO NSQ/spurious medicine batch checker",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://medcheck.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers after app creation to avoid circular imports
from app.routers import check, ocr, tts, admin, pipeline  # noqa: E402

app.include_router(check.router)
app.include_router(ocr.router)
app.include_router(tts.router)
app.include_router(admin.router)
app.include_router(pipeline.router)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "MedCheck API",
        "db_mode": "sqlite" if settings.is_sqlite else "postgresql",
        "llm_mode": settings.LLM_MODE,
    }
