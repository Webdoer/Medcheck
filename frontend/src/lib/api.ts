// Backend API client

import type { CheckResponse, LabelOCRResponse, MedicineForm } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function checkMedicine(
  form: Pick<MedicineForm, "drug_name" | "batch_number" | "manufacturer">,
  lang: string
): Promise<CheckResponse> {
  const resp = await fetch(`${BASE}/api/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...form, lang }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Check failed");
  }
  return resp.json();
}

export async function ocrLabel(file: File): Promise<LabelOCRResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const resp = await fetch(`${BASE}/api/ocr/label`, {
    method: "POST",
    body: formData,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "OCR failed");
  }
  return resp.json();
}

export async function adminLogin(
  username: string,
  password: string
): Promise<string> {
  const form = new URLSearchParams({ username, password });
  const resp = await fetch(`${BASE}/api/admin/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  if (!resp.ok) throw new Error("Invalid credentials");
  const data = await resp.json();
  return data.access_token;
}

export async function getReviewQueue(token: string, status = "PENDING") {
  const resp = await fetch(`${BASE}/api/admin/queue?status_filter=${status}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error("Unauthorized");
  return resp.json();
}

export async function decideQueueItem(
  token: string,
  id: string,
  decision: { status: string; corrected_data?: object; admin_notes?: string }
) {
  const resp = await fetch(`${BASE}/api/admin/queue/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(decision),
  });
  if (!resp.ok) throw new Error("Decision failed");
  return resp.json();
}

export async function getAdminStats(token: string) {
  const resp = await fetch(`${BASE}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error("Unauthorized");
  return resp.json();
}

export async function triggerPipeline(
  token: string,
  force = false,
  month_label?: string
) {
  const resp = await fetch(`${BASE}/api/pipeline/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ force, month_label }),
  });
  if (!resp.ok) throw new Error("Pipeline trigger failed");
  return resp.json();
}
