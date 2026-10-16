"""
Seed script — populates the database with:
  - 1 SourceDocument (representing a demo import)
  - 20 realistic FAKE FlaggedBatch rows (clearly fake names)
  - 5 ReviewQueue rows with low confidence (for approve/edit/reject demo)

Run with:
  cd backend
  .venv\\Scripts\\python.exe seed.py
"""
import asyncio
import sys
import os

# Ensure we load the local .env
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, Base, AsyncSessionLocal
from app.models import FlaggedBatch, ReviewQueue, ReviewStatus, AlertCategory, SourceDocument
from app.services.normalise import normalise, make_dedup_key
import json

# ---------------------------------------------------------------------------
# Demo data — clearly fake drug/batch names
# ---------------------------------------------------------------------------
DEMO_MONTH = "October 2024"
DEMO_SOURCE_URL = "https://cdsco.example/DEMO-FAKE-NSQ-OCT-2024.pdf"
DEMO_SOURCE_SHA = "0000000000000000000000000000000000000000000000000000000000000001"

FLAGGED_ROWS = [
    # NSQ (Not of Standard Quality)
    {
        "drug_name": "DEMORIL TABLETS 500mg",
        "batch_no": "B2024-DEMO-001",
        "manufacturer": "FakePharma Pvt Ltd",
        "state": "Maharashtra",
        "failure_reason": "Failed Dissolution Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "PLACEBOCIN CAPSULES",
        "batch_no": "PC-2024-0087",
        "manufacturer": "TestDrug Industries",
        "state": "Delhi",
        "failure_reason": "Failed Assay Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "FAKEAMOX 250mg",
        "batch_no": "FAX-24-0021",
        "manufacturer": "MadeUpMed Ltd",
        "state": "Gujarat",
        "failure_reason": "Failed Description Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "DEMOPARACETAMOL 650",
        "batch_no": "DPC-2024-115",
        "manufacturer": "FakePharma Pvt Ltd",
        "state": "Rajasthan",
        "failure_reason": "Failed Dissolution Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "TESTACILLIN INJECTION",
        "batch_no": "TCI-B-2024-003",
        "manufacturer": "Imaginary Biotech",
        "state": "Karnataka",
        "failure_reason": "Failed Sterility Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "FAKEAZITHRO 500",
        "batch_no": "FAZ-0056-24",
        "manufacturer": "TestDrug Industries",
        "state": "Tamil Nadu",
        "failure_reason": "Failed Assay Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "MOCKCIPROFLOX 500",
        "batch_no": "MCF-24-0019",
        "manufacturer": "FakePharma Pvt Ltd",
        "state": "West Bengal",
        "failure_reason": "Content Uniformity Failure",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "DEMOMETFORMIN 500mg",
        "batch_no": "DMF-B-24-007",
        "manufacturer": "SandboxRx Pvt Ltd",
        "state": "Uttar Pradesh",
        "failure_reason": "Failed Dissolution Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "PLACEBOLIN SYRUP",
        "batch_no": "PLB-SYR-2024-11",
        "manufacturer": "MadeUpMed Ltd",
        "state": "Haryana",
        "failure_reason": "Failed Microbial Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "FAKEDOLO TABLETS",
        "batch_no": "FDT-2024-009",
        "manufacturer": "Imaginary Biotech",
        "state": "Punjab",
        "failure_reason": "Failed Description Test",
        "category": AlertCategory.NSQ,
    },
    # SPURIOUS (counterfeit/fake)
    {
        "drug_name": "DEMORIL TABLETS 500mg",
        "batch_no": "B2024-SPURIOUS-99",
        "manufacturer": "Unknown Manufacturer",
        "state": "Bihar",
        "failure_reason": "Counterfeit — packaging mismatch",
        "category": AlertCategory.SPURIOUS,
    },
    {
        "drug_name": "FAKEINSULIN VIAL",
        "batch_no": "INS-FAKE-2024-001",
        "manufacturer": "Unlicensed Lab",
        "state": "Jharkhand",
        "failure_reason": "Spurious — no manufacturer registration",
        "category": AlertCategory.SPURIOUS,
    },
    {
        "drug_name": "MOCKCLAV 625",
        "batch_no": "MCV-2024-0031",
        "manufacturer": "TestDrug Industries",
        "state": "Odisha",
        "failure_reason": "Failed Assay Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "TESTOMEPRAZOLE 20mg",
        "batch_no": "TOM-24-B-055",
        "manufacturer": "SandboxRx Pvt Ltd",
        "state": "Andhra Pradesh",
        "failure_reason": "Failed Dissolution Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "FAKEATENOLOL 50mg",
        "batch_no": "FAT-2024-0072",
        "manufacturer": "MadeUpMed Ltd",
        "state": "Telangana",
        "failure_reason": "Below Assay Limit",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "DEMOCEFIXIME 200",
        "batch_no": "DCF-B-24-0013",
        "manufacturer": "FakePharma Pvt Ltd",
        "state": "Kerala",
        "failure_reason": "Failed Dissolution Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "SANDBOXVIT D3 CAPS",
        "batch_no": "SVD-24-0088",
        "manufacturer": "Imaginary Biotech",
        "state": "Goa",
        "failure_reason": "Below Assay Limit",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "PLACEBOMIN TABLET",
        "batch_no": "PBM-2024-0044",
        "manufacturer": "TestDrug Industries",
        "state": "Chhattisgarh",
        "failure_reason": "Failed Disintegration Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "FAKEWARFARIN 5mg",
        "batch_no": "FWF-24-0006",
        "manufacturer": "SandboxRx Pvt Ltd",
        "state": "Madhya Pradesh",
        "failure_reason": "Failed Assay Test",
        "category": AlertCategory.NSQ,
    },
    {
        "drug_name": "DEMOCOMBINATION TAB",
        "batch_no": "DCT-2024-0099",
        "manufacturer": "FakePharma Pvt Ltd",
        "state": "Assam",
        "failure_reason": "Counterfeit — hologram missing",
        "category": AlertCategory.SPURIOUS,
    },
]

# 5 review-queue rows (low confidence, for demo of approve/edit/reject)
REVIEW_ROWS = [
    {
        "drug_name": "DEMORIL TABLETS",
        "batch_no": "B2024-REVIEW-001",
        "manufacturer": "FakePharma Pvt Ltd",
        "failure_reason": "Failed Dissolution Test",
        "category": "NSQ",
        "confidence": 0.42,
    },
    {
        "drug_name": "PLCEBOCIN CAPSULES",  # typo intentional
        "batch_no": "PC-2O24-REVIEW",      # O instead of 0 intentional
        "manufacturer": "TestDrug Industries",
        "failure_reason": "Failed Assay Test",
        "category": "NSQ",
        "confidence": 0.38,
    },
    {
        "drug_name": "UNKNOWNDRUG XR",
        "batch_no": "UNK-REVIEW-003",
        "manufacturer": None,
        "failure_reason": "Failed Description",
        "category": "NSQ",
        "confidence": 0.51,
    },
    {
        "drug_name": "FAKEAZITHRO 500",
        "batch_no": "FAZ-REVIEW-004",
        "manufacturer": "TestDrug Industries",
        "failure_reason": "Spurious",
        "category": "SPURIOUS",
        "confidence": 0.29,
    },
    {
        "drug_name": "MOCKDRUG INJECTION",
        "batch_no": "MDI-2024-REVIEW",
        "manufacturer": "MadeUpMed Ltd",
        "failure_reason": "Failed Sterility",
        "category": "NSQ",
        "confidence": 0.44,
    },
]


async def seed():
    # Create all tables first
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        from sqlalchemy import select, func
        count = await db.execute(select(func.count()).select_from(FlaggedBatch))
        if count.scalar() >= 20:
            print("Database already has ≥20 flagged batches — skipping seed.")
            print("To re-seed, delete the database file: backend/data/medcheck.db")
            return

        # Create source document
        existing_src = await db.execute(
            select(SourceDocument).where(SourceDocument.sha256 == DEMO_SOURCE_SHA)
        )
        src = existing_src.scalar_one_or_none()
        if not src:
            src = SourceDocument(
                url=DEMO_SOURCE_URL,
                sha256=DEMO_SOURCE_SHA,
                month=DEMO_MONTH,
            )
            db.add(src)
            await db.flush()
            print(f"Created source document: {DEMO_MONTH}")

        # Seed flagged batches
        count = 0
        for row in FLAGGED_ROWS:
            drug_name = row["drug_name"]
            batch_no = row["batch_no"]
            manufacturer = row.get("manufacturer") or ""
            dedup_key = make_dedup_key(drug_name, batch_no, manufacturer)

            existing = await db.execute(
                select(FlaggedBatch).where(FlaggedBatch.dedup_key == dedup_key)
            )
            if existing.scalar_one_or_none():
                continue

            batch = FlaggedBatch(
                source_id=src.id,
                drug_name=drug_name,
                drug_name_norm=normalise(drug_name),
                batch_no=batch_no,
                batch_no_norm=normalise(batch_no),
                manufacturer=manufacturer,
                manufacturer_norm=normalise(manufacturer),
                state=row.get("state"),
                failure_reason=row.get("failure_reason"),
                month=DEMO_MONTH,
                category=row["category"],
                page_no=1,
                extraction_confidence=0.97,
                source_pdf_url=DEMO_SOURCE_URL,
                review_status=ReviewStatus.APPROVED,
                dedup_key=dedup_key,
            )
            db.add(batch)
            count += 1

        # Seed review queue items
        review_count = 0
        for row in REVIEW_ROWS:
            item = ReviewQueue(
                source_id=src.id,
                raw_data=json.dumps(row),
                page_number=1,
                extraction_confidence=row["confidence"],
            )
            db.add(item)
            review_count += 1

        await db.commit()
        print(f"[OK] Seeded {count} flagged batches (20 total)")
        print(f"[OK] Seeded {review_count} review queue items (5 low-confidence)")
        print(f"   Data last updated: {DEMO_MONTH}")
        print()
        print("Demo drugs to test:")
        print("  MATCH_FOUND:    drug='DEMORIL TABLETS 500mg', batch='B2024-DEMO-001'")
        print("  POSSIBLE_MATCH: drug='DEMORIL TABLETS 500mg', batch='B2024-DEM0-001' (0 swapped for O)")
        print("  NOT_FOUND:      drug='UNKNOWNDRUG', batch='ZZZZZ-9999'")



if __name__ == "__main__":
    asyncio.run(seed())
