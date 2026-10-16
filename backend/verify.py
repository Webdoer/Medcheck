"""Quick API verification script."""
import requests
import json
import io
import sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = "http://localhost:8000"

def check(drug, batch, lang="en"):
    r = requests.post(f"{BASE}/api/check",
        json={"drug_name": drug, "batch_number": batch, "lang": lang})
    return r.json()

def ok(label, cond, detail=""):
    status = "[PASS]" if cond else "[FAIL]"
    print(f"{status} {label}" + (f" | {detail}" if detail else ""))
    return cond

print("\n" + "="*60)
print("MedCheck API Verification")
print("="*60)

# Test 1: Exact match
print("\n--- Test 1: Exact Match ---")
r = check("DEMORIL TABLETS 500mg", "B2024-DEMO-001", "hi")
ok("MATCH_FOUND", r["status"] == "MATCH_FOUND", r["status"])
ok("month present", r.get("alert", {}).get("month_label") == "October 2024",
   r.get("alert", {}).get("month_label"))
ok("failure_reason present", bool(r.get("alert", {}).get("failure_reason")),
   r.get("alert", {}).get("failure_reason"))
ok("data_last_updated present", r.get("data_last_updated") == "October 2024",
   r.get("data_last_updated"))
ok("PDF link present", bool(r.get("alert", {}).get("source_pdf_url")),
   r.get("alert", {}).get("source_pdf_url"))
print(f"   Hindi message (first 60): {r.get('plain_message','')[:60]}...")

# Test 2: 0 typed as O (normalises to same -> MATCH_FOUND)
print("\n--- Test 2: Typo 0 for O ---")
r = check("DEMORIL TABLETS 500mg", "B2024-DEM0-001", "en")
ok("0→O normalised to MATCH_FOUND", r["status"] == "MATCH_FOUND", r["status"])

# Test 3a: Dropped character -> POSSIBLE_MATCH (B2024-DEM-001)
print("\n--- Test 3a: Dropped character ---")
r = check("DEMORIL TABLETS 500mg", "B2024-DEM-001", "en")
ok("Dropped char -> POSSIBLE_MATCH", r["status"] == "POSSIBLE_MATCH", r["status"])
ok("POSSIBLE_MATCH: alert is hidden", r.get("alert") is None, str(r.get("alert")))
ok("POSSIBLE_MATCH: candidates present", bool(r.get("candidates")),
   str(r.get("candidates", [])))
ok("data_last_updated included", bool(r.get("data_last_updated")), r.get("data_last_updated"))

# Test 3b: Extra space
print("\n--- Test 3b: Extra space ---")
r = check("DEMORIL TABLETS 500mg", "B2024-DEMO -001", "en")
ok("Extra space normalised", r["status"] in ("MATCH_FOUND", "POSSIBLE_MATCH"), r["status"])

# Test 3c: Lowercase
print("\n--- Test 3c: Lowercase ---")
r = check("demoril tablets 500mg", "b2024-demo-001", "en")
ok("Lowercase -> MATCH_FOUND", r["status"] == "MATCH_FOUND", r["status"])

# Test 4: Right batch, wrong drug -> must NOT be MATCH_FOUND
print("\n--- Test 4: Right batch, wrong drug ---")
r = check("COMPLETELY UNRELATED MEDICINE XYZ", "B2024-DEMO-001", "en")
ok("Wrong drug NOT MATCH_FOUND", r["status"] != "MATCH_FOUND", r["status"])

# Test 5: NOT_FOUND exact message
print("\n--- Test 5: NOT_FOUND ---")
r = check("UNKNOWNDRUG", "ZZZZZ-9999", "en")
expected_msg = ("This batch is not in the flagged list we have. "
                "This does not guarantee it is safe. "
                "Check the pack, buy from licensed shops.")
ok("NOT_FOUND status", r["status"] == "NOT_FOUND", r["status"])
ok("NOT_FOUND exact message", r.get("plain_message") == expected_msg,
   repr(r.get("plain_message")))
ok("data_last_updated in NOT_FOUND", bool(r.get("data_last_updated")),
   r.get("data_last_updated"))

# Test 6: Label upload (mock)
print("\n--- Test 6: Label Upload (mock LLM) ---")
try:
    from PIL import Image
    img = Image.new("RGB", (100, 100), color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    r = requests.post(f"{BASE}/api/ocr/label",
        files={"file": ("label.png", buf, "image/png")})
    j = r.json()
    ok("OCR returns drug_name", bool(j.get("drug_name", {}).get("value")),
       j.get("drug_name", {}).get("value"))
    ok("OCR returns batch_number", bool(j.get("batch_number", {}).get("value")),
       j.get("batch_number", {}).get("value"))
    ok("routed_to_review=False", j.get("routed_to_review") == False,
       str(j.get("routed_to_review")))
    conf = j.get("drug_name", {}).get("confidence", 0)
    ok("Confidence in [0,1]", 0 <= conf <= 1, str(conf))
except Exception as e:
    print(f"[FAIL] Label upload: {e}")

# Test 7: POSSIBLE_MATCH confirm gate
print("\n--- Test 7: POSSIBLE_MATCH confirm -> full details ---")
r = check("DEMORIL TABLETS 500mg", "B2024-DEM-001", "en")
if r["status"] == "POSSIBLE_MATCH" and r.get("candidates"):
    cid = r["candidates"][0]["id"]
    r2 = requests.post(f"{BASE}/api/check/confirm",
        json={"candidate_id": cid, "lang": "en"})
    j2 = r2.json()
    ok("Confirm returns MATCH_FOUND", j2["status"] == "MATCH_FOUND", j2["status"])
    ok("Confirm reveals failure_reason", bool(j2.get("alert", {}).get("failure_reason")),
       j2.get("alert", {}).get("failure_reason"))
else:
    print(f"  Skipped (status={r['status']})")

# Test 8: Admin - get queue, approve a row, verify searchable
print("\n--- Test 8: Admin queue & approve ---")
# Login
lr = requests.post(f"{BASE}/api/admin/token",
    data={"username": "admin", "password": "medcheck2024"})
token = lr.json().get("access_token")
ok("Admin login", bool(token))
headers = {"Authorization": f"Bearer {token}"}

# Get queue
qr = requests.get(f"{BASE}/api/admin/queue?status_filter=PENDING", headers=headers)
items = qr.json()
ok("Queue has 5 items", len(items) == 5, f"found {len(items)}")

# Approve first item with corrected data
item = items[0]
raw = item["raw_data"]
# Give it a unique drug+batch for search test
corrected = {
    "drug_name": "ADMIN APPROVED DRUG",
    "batch_no": "ADMIN-APPROVED-001",
    "manufacturer": "Admin Labs",
    "failure_reason": "Approved via admin",
    "category": "NSQ",
    "month": "October 2024",
}
dr = requests.post(f"{BASE}/api/admin/queue/{item['id']}",
    headers=headers,
    json={"status": "APPROVED", "corrected_data": corrected, "admin_notes": "Demo approval"})
ok("Approve succeeds", dr.json().get("ok") == True, str(dr.json()))

# Verify it's now searchable
r = check("ADMIN APPROVED DRUG", "ADMIN-APPROVED-001", "en")
ok("Approved row is searchable", r["status"] == "MATCH_FOUND", r["status"])

# Stats
sr = requests.get(f"{BASE}/api/admin/stats", headers=headers)
stats = sr.json()
ok("Stats shows pending_review=4", stats.get("pending_review") == 4,
   str(stats.get("pending_review")))
ok("Stats data_last_updated", bool(stats.get("data_last_updated")),
   stats.get("data_last_updated"))

# Test 9: Language switch
print("\n--- Test 9: Language switch ---")
r_hi = check("DEMORIL TABLETS 500mg", "B2024-DEMO-001", "hi")
r_en = check("DEMORIL TABLETS 500mg", "B2024-DEMO-001", "en")
ok("Hindi response", r_hi["status"] == "MATCH_FOUND" and len(r_hi["plain_message"]) > 20)
ok("English response", r_en["status"] == "MATCH_FOUND" and len(r_en["plain_message"]) > 20)
ok("Hindi != English message", r_hi["plain_message"] != r_en["plain_message"])

# Test 10: /api/admin/explain endpoint
print("\n--- Test 10: /explain endpoint ---")
er = requests.get(f"{BASE}/api/admin/explain?reason=dissolution&lang=hi")
ej = er.json()
ok("Explain returns explanation", bool(ej.get("explanation")), ej.get("explanation", "")[:40])
ok("Explain returns advice", bool(ej.get("advice")))
ok("Advice has no dosage/diagnosis", "dosage" not in ej.get("advice","").lower())

print("\n" + "="*60)
print("Verification complete")
print("="*60)
