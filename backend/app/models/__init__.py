"""SQLAlchemy ORM models.

Compatible with both SQLite and PostgreSQL.
Uses String PK for cross-DB UUID compatibility (stored as text in SQLite).
"""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Float, Boolean, Integer,
    DateTime, Enum, ForeignKey, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
import enum

from app.database import Base


def _uuid_default():
    return str(uuid.uuid4())


class AlertCategory(str, enum.Enum):
    NSQ = "NSQ"
    SPURIOUS = "SPURIOUS"


class ReviewStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


# ---------------------------------------------------------------------------
# Source documents (PDF tracking, idempotent import)
# ---------------------------------------------------------------------------
class SourceDocument(Base):
    """Tracks imported PDF/month sources. Keyed on sha256 for idempotency."""
    __tablename__ = "source_documents"

    id = Column(String(36), primary_key=True, default=_uuid_default)
    url = Column(Text, nullable=False)
    sha256 = Column(String(64), nullable=False, unique=True)  # dedup key
    month = Column(String(20))          # e.g. "2024-09" or "October 2024"
    imported_at = Column(DateTime, default=datetime.utcnow)

    alerts = relationship("FlaggedBatch", back_populates="source")
    queue_items = relationship("ReviewQueue", back_populates="source")


# ---------------------------------------------------------------------------
# Legacy alias (some routers still reference PdfSource)
# ---------------------------------------------------------------------------
class PdfSource(Base):
    __tablename__ = "pdf_sources"

    id = Column(String(36), primary_key=True, default=_uuid_default)
    url = Column(Text, nullable=False, unique=True)
    file_hash = Column(String(64), nullable=False)   # sha256
    local_path = Column(Text, nullable=False)
    month_label = Column(String(20))
    category = Column(Enum(AlertCategory), nullable=False)
    downloaded_at = Column(DateTime, default=datetime.utcnow)
    processed = Column(Boolean, default=False)

    alerts = relationship("DrugAlert", back_populates="source")
    queue_items = relationship("ReviewQueueLegacy", back_populates="source")


# ---------------------------------------------------------------------------
# Flagged batches (canonical table, spec §Step 2)
# ---------------------------------------------------------------------------
class FlaggedBatch(Base):
    __tablename__ = "flagged_batches"

    id = Column(String(36), primary_key=True, default=_uuid_default)
    source_id = Column(String(36), ForeignKey("source_documents.id"), nullable=True)

    drug_name = Column(Text, nullable=False)
    drug_name_norm = Column(Text, nullable=False)
    batch_no = Column(Text, nullable=False)
    batch_no_norm = Column(Text, nullable=False)
    manufacturer = Column(Text)
    manufacturer_norm = Column(Text)
    state = Column(String(100))
    failure_reason = Column(Text)
    category = Column(Enum(AlertCategory), nullable=False, default=AlertCategory.NSQ)
    month = Column(String(20))
    source_pdf_url = Column(Text)
    page_no = Column(Integer)
    extraction_confidence = Column(Float, default=1.0)
    review_status = Column(Enum(ReviewStatus), nullable=False, default=ReviewStatus.APPROVED)

    # Dedup key — keyed on sha256 of source + row identity
    dedup_key = Column(String(256), unique=True, nullable=False)

    source = relationship("SourceDocument", back_populates="alerts")

    __table_args__ = (
        Index("ix_flagged_batches_batch_norm", "batch_no_norm"),
        Index("ix_flagged_batches_drug_norm", "drug_name_norm"),
        Index("ix_flagged_batches_review_status", "review_status"),
    )


# ---------------------------------------------------------------------------
# User cabinet (saved medicines)
# ---------------------------------------------------------------------------
class UserCabinet(Base):
    __tablename__ = "user_cabinet"

    id = Column(String(36), primary_key=True, default=_uuid_default)
    user_id = Column(String(100))      # anonymous device id for now
    drug = Column(Text, nullable=False)
    batch = Column(Text, nullable=False)
    expiry = Column(String(20))
    added_at = Column(DateTime, default=datetime.utcnow)


# ---------------------------------------------------------------------------
# User reports
# ---------------------------------------------------------------------------
class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=_uuid_default)
    user_id = Column(String(100))
    payload = Column(Text, nullable=False)   # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)


# ---------------------------------------------------------------------------
# Review queue (low-confidence rows awaiting human approval)
# ---------------------------------------------------------------------------
class ReviewQueue(Base):
    __tablename__ = "review_queue"

    id = Column(String(36), primary_key=True, default=_uuid_default)
    source_id = Column(String(36), ForeignKey("source_documents.id"), nullable=True)

    raw_data = Column(Text, nullable=False)      # JSON string of extracted row
    page_number = Column(Integer)
    extraction_confidence = Column(Float)
    page_image_path = Column(Text)

    status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING)
    reviewed_by = Column(String(100))
    reviewed_at = Column(DateTime)
    admin_notes = Column(Text)
    approved_batch_id = Column(String(36), ForeignKey("flagged_batches.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    source = relationship("SourceDocument", back_populates="queue_items")

    __table_args__ = (
        Index("ix_review_queue_status", "status"),
    )


# ---------------------------------------------------------------------------
# Legacy models (keep for backward-compat with old routers)
# ---------------------------------------------------------------------------
class DrugAlert(Base):
    __tablename__ = "drug_alerts"

    id = Column(String(36), primary_key=True, default=_uuid_default)
    source_id = Column(String(36), ForeignKey("pdf_sources.id"), nullable=True)
    drug_name = Column(Text, nullable=False)
    drug_name_norm = Column(Text, nullable=False)
    batch_number = Column(Text, nullable=False)
    batch_number_norm = Column(Text, nullable=False)
    manufacturer = Column(Text)
    manufacturer_norm = Column(Text)
    state = Column(String(100))
    failure_reason = Column(Text)
    month_label = Column(String(20))
    category = Column(Enum(AlertCategory), nullable=False)
    page_number = Column(Integer)
    extraction_confidence = Column(Float, default=1.0)
    source_pdf_url = Column(Text)
    dedup_key = Column(String(256), unique=True, nullable=False)

    source = relationship("PdfSource", back_populates="alerts")

    __table_args__ = (
        Index("ix_drug_alerts_batch_norm", "batch_number_norm"),
        Index("ix_drug_alerts_drug_norm", "drug_name_norm"),
    )


class ReviewQueueLegacy(Base):
    __tablename__ = "review_queue_legacy"

    id = Column(String(36), primary_key=True, default=_uuid_default)
    source_id = Column(String(36), ForeignKey("pdf_sources.id"), nullable=True)
    raw_data = Column(Text, nullable=False)
    page_number = Column(Integer)
    extraction_confidence = Column(Float)
    page_image_path = Column(Text)
    status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING)
    reviewed_by = Column(String(100))
    reviewed_at = Column(DateTime)
    admin_notes = Column(Text)
    approved_alert_id = Column(String(36), ForeignKey("drug_alerts.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    source = relationship("PdfSource", back_populates="queue_items")
