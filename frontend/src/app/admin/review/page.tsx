"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getReviewQueue, decideQueueItem } from "@/lib/api";

interface QueueItem {
  id: string;
  source_id: string;
  raw_data: Record<string, string | number | null>;
  page_number?: number;
  extraction_confidence: number;
  page_image_path?: string;
  status: string;
  created_at: string;
}

export default function ReviewPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deciding, setDeciding] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, Record<string, string | number | null>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState("PENDING");

  useEffect(() => {
    const t = sessionStorage.getItem("admin_token");
    if (!t) { router.push("/admin"); return; }
    setToken(t);
    loadQueue(t, statusFilter);
  }, []);

  async function loadQueue(t: string, status: string) {
    setLoading(true);
    try {
      const data = await getReviewQueue(t, status);
      setItems(data);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }

  async function decide(id: string, status: "APPROVED" | "REJECTED") {
    if (!token) return;
    setDeciding(id);
    try {
      await decideQueueItem(token, id, {
        status,
        corrected_data: editData[id] as object | undefined,
        admin_notes: notes[id],
      });
      setMsg({ ...msg, [id]: `✅ ${status}` });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      setMsg({ ...msg, [id]: `Error: ${e instanceof Error ? e.message : "unknown"}` });
    } finally {
      setDeciding(null);
    }
  }

  const EDITABLE_FIELDS = ["drug_name", "batch_number", "manufacturer", "state", "failure_reason", "category"];

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 py-8 safe-pb">
      <div className="w-full max-w-3xl flex flex-col gap-6 fade-up">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin")} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-bold gradient-text">Review Queue</h1>
          <div className="ml-auto flex gap-2">
            {["PENDING", "APPROVED", "REJECTED"].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); if (token) loadQueue(token, s); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${statusFilter === s ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading...</div>
        ) : items.length === 0 ? (
          <div className="glass p-8 text-center">
            <p className="text-slate-400 text-lg">✅ No items in {statusFilter} status</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="glass p-5 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="badge badge-warn">Confidence: {Math.round(item.extraction_confidence * 100)}%</span>
                  {item.page_number && (
                    <span className="ml-2 text-xs text-slate-500">Page {item.page_number}</span>
                  )}
                </div>
                <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString("en-IN")}</span>
              </div>

              {/* Side-by-side: PDF image + form */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* PDF page image */}
                <div className="bg-black/30 rounded-xl flex items-center justify-center min-h-40 border border-white/5">
                  {item.page_image_path ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/data/page_images/${item.page_image_path.split("/").pop()}`}
                      alt={`Page ${item.page_number}`}
                      className="max-w-full rounded-xl"
                    />
                  ) : (
                    <p className="text-slate-600 text-sm">No image available</p>
                  )}
                </div>

                {/* Editable extracted data */}
                <div className="flex flex-col gap-2">
                  {EDITABLE_FIELDS.map((field) => (
                    <div key={field} className="field-wrap">
                      <label className="field-label">{field.replace(/_/g, " ")}</label>
                      <input
                        type="text"
                        defaultValue={String(item.raw_data[field] ?? "")}
                        onChange={(e) => setEditData((prev) => ({
                          ...prev,
                          [item.id]: { ...(prev[item.id] || item.raw_data), [field]: e.target.value }
                        }))}
                        className="field-input"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="field-wrap">
                <label className="field-label">Admin Notes</label>
                <input
                  type="text"
                  placeholder="Optional notes..."
                  value={notes[item.id] || ""}
                  onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                  className="field-input"
                />
              </div>

              {msg[item.id] && (
                <p className="text-emerald-400 text-sm font-semibold">{msg[item.id]}</p>
              )}

              {/* Actions */}
              {item.status === "PENDING" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id={`btn-approve-${item.id}`}
                    onClick={() => decide(item.id, "APPROVED")}
                    disabled={deciding === item.id}
                    className="btn-primary btn-success"
                  >
                    ✓ Approve
                  </button>
                  <button
                    id={`btn-reject-${item.id}`}
                    onClick={() => decide(item.id, "REJECTED")}
                    disabled={deciding === item.id}
                    className="btn-primary btn-danger"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
