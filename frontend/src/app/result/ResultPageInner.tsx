"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Lang, CheckResponse, DiffChar } from "@/types";
import { useI18n } from "@/hooks/useI18n";
import { useTTS } from "@/hooks/useTTS";
import { checkMedicine } from "@/lib/api";

// ---------------------------------------------------------------------------
// Helper: highlight differing characters
// ---------------------------------------------------------------------------
function DiffBatch({ value, diffs }: { value: string; diffs: DiffChar[] }) {
  const diffPositions = new Set(diffs.map((d) => d.position));
  return (
    <span className="font-mono text-lg tracking-widest">
      {value.split("").map((ch, i) =>
        diffPositions.has(i) ? (
          <span key={i} className="diff-char">{ch}</span>
        ) : (
          <span key={i}>{ch}</span>
        )
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ResultPageInner() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") || "hi") as Lang;
  const { t } = useI18n(lang);
  const { speak, speaking } = useTTS(lang);
  const router = useRouter();

  const rawResult = searchParams.get("result");
  const result: CheckResponse | null = rawResult ? JSON.parse(rawResult) : null;

  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [finalResult, setFinalResult] = useState<CheckResponse | null>(result);
  const [loading, setLoading] = useState(false);

  if (!finalResult) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4">
        <div className="glass p-6 text-center">
          <p className="text-slate-400">No result found.</p>
          <button onClick={() => router.push("/")} className="btn-primary mt-4">
            {t("try_again")}
          </button>
        </div>
      </main>
    );
  }

  const { status, alert, candidates, diff_chars, plain_message, data_last_updated } = finalResult;

  // Status display config — safety rule §1: NOT_FOUND badge says "Not Found" not "Safe"
  const statusConfig = {
    MATCH_FOUND: {
      icon: "⚠️",
      title: t("result_match"),
      cardClass: "result-match",
      badgeClass: alert?.category === "SPURIOUS" ? "badge-spurious" : "badge-nsq",
      badgeText: alert?.category === "SPURIOUS" ? t("category_spurious") : t("category_nsq"),
      bgGradient: "from-red-900/30 to-transparent",
    },
    POSSIBLE_MATCH: {
      icon: "🔍",
      title: t("result_possible"),
      cardClass: "result-possible",
      badgeClass: "badge-warn",
      badgeText: "Possible Match",
      bgGradient: "from-amber-900/30 to-transparent",
    },
    NOT_FOUND: {
      icon: "✅",
      title: t("result_ok"),
      cardClass: "result-ok",
      badgeClass: "badge-info",   // was badge-safe — safety rule §1: no "Safe" badge
      badgeText: "Not Found",     // safety rule §1: never "Safe" or "Genuine"
      bgGradient: "from-emerald-900/30 to-transparent",
    },
  }[status];

  // ---------------------------------------------------------------------------
  // POSSIBLE_MATCH confirmation flow (safety rule §3)
  // Full details hidden until user confirms
  // ---------------------------------------------------------------------------
  async function handleConfirmMatch(isSame: boolean) {
    setConfirmed(isSame);
    if (!isSame) {
      // User says it's NOT the same batch → treat as NOT_FOUND
      setFinalResult((prev) => prev ? {
        ...prev,
        status: "NOT_FOUND",
        alert: undefined,
        plain_message: lang === "hi"
          ? "आपने पुष्टि की कि यह वही बैच नहीं है। सतर्क रहें।"
          : "You confirmed this is a different batch. Stay vigilant.",
      } : prev);
    } else {
      // User says YES — fetch full details from /check/confirm
      if (!candidates || candidates.length === 0) return;
      setLoading(true);
      try {
        const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const resp = await fetch(`${BASE}/api/check/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidate_id: candidates[0].id, lang }),
        });
        if (resp.ok) {
          const full: CheckResponse = await resp.json();
          setFinalResult(full);
        }
      } catch {
        // If confirm fails, show the MATCH_FOUND state without details
        setFinalResult((prev) => prev ? { ...prev, status: "MATCH_FOUND" } : prev);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 py-6 safe-pb">
      {/* Back */}
      <div className="w-full max-w-lg flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/")} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>
        <h1 className="text-lg font-bold gradient-text">Result</h1>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-5 fade-up">
        {/* Main result card */}
        <div className={`glass p-6 flex flex-col gap-4 ${statusConfig.cardClass}`} style={{ position: "relative", overflow: "hidden" }}>
          <div className={`absolute inset-0 bg-gradient-to-b ${statusConfig.bgGradient} pointer-events-none`}/>

          <div className="relative flex items-start gap-4">
            <span className="text-5xl">{statusConfig.icon}</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{statusConfig.title}</h2>
              <span className={`badge ${statusConfig.badgeClass}`}>{statusConfig.badgeText}</span>
            </div>
          </div>

          {/* Plain language message */}
          <p className="relative text-base leading-relaxed text-slate-200 bg-black/20 rounded-xl p-4">
            {plain_message}
          </p>

          {/* Data last updated — safety rule §2 */}
          {data_last_updated && data_last_updated !== "N/A" && (
            <p className="relative text-xs text-slate-500 text-right">
              {t("data_last_updated")}: <span className="text-slate-400 font-medium">{data_last_updated}</span>
            </p>
          )}

          {/* TTS button */}
          <button
            id="btn-listen"
            onClick={() => speak(plain_message)}
            className={`btn-primary ${speaking ? "opacity-70" : ""}`}
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
          >
            {speaking ? (
              <>
                <svg className="animate-pulse w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                {lang === "hi" ? "बोल रहे हैं..." : "Speaking..."}
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
                {t("listen")} 🔊
              </>
            )}
          </button>
        </div>

        {/* ---------------------------------------------------------------
          POSSIBLE_MATCH: side-by-side comparison + confirm prompt
          Safety rule §3: full details hidden until confirmed
        --------------------------------------------------------------- */}
        {status === "POSSIBLE_MATCH" && confirmed === null && candidates && candidates.length > 0 && (
          <div className="glass p-5 flex flex-col gap-4">
            <h3 className="font-bold text-amber-300 text-sm uppercase tracking-widest">
              ⚠️ Possible Match — Please Confirm
            </h3>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-2 gap-4 bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">You entered</span>
                <span className="font-mono text-base text-white">{searchParams.get("batch_number") || "—"}</span>
                <span className="text-xs text-slate-400 mt-1">{searchParams.get("drug_name") || "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Flagged record</span>
                {diff_chars && diff_chars.length > 0 ? (
                  <DiffBatch value={candidates[0].batch_no} diffs={diff_chars} />
                ) : (
                  <span className="font-mono text-base text-amber-200">{candidates[0].batch_no}</span>
                )}
                <span className="text-xs text-slate-400 mt-1">{candidates[0].drug_name}</span>
              </div>
            </div>

            {/* Confirm prompt */}
            <p className="text-center font-semibold text-amber-200">{t("confirm_match")}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-yes-same"
                onClick={() => handleConfirmMatch(true)}
                disabled={loading}
                className="btn-primary btn-danger"
              >
                {loading ? "..." : t("yes_same")}
              </button>
              <button
                id="btn-no-different"
                onClick={() => handleConfirmMatch(false)}
                className="btn-primary btn-success"
              >
                {t("no_different")}
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Flagged details are hidden until you confirm.
            </p>
          </div>
        )}

        {/* MATCH_FOUND alert details — shown after confirmation or on direct match */}
        {alert && status === "MATCH_FOUND" && (
          <div className="glass p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest">
              CDSCO Record
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t("drug_name"), value: alert.drug_name },
                { label: t("batch_number"), value: alert.batch_number },
                { label: t("manufacturer"), value: alert.manufacturer },
                { label: t("state_label"), value: alert.state },
                { label: t("month_label"), value: alert.month_label },
                { label: t("failure_reason_label"), value: alert.failure_reason },
              ].filter((r) => r.value).map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</span>
                  <span className="text-sm text-slate-200 font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Source PDF link */}
            {alert.source_pdf_url && (
              <a
                href={`${alert.source_pdf_url}${alert.page_number ? `#page=${alert.page_number}` : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors mt-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {t("source_pdf")}
                {alert.page_number && ` (Page ${alert.page_number})`}
              </a>
            )}
          </div>
        )}

        {/* Helpline */}
        <div className="glass p-4 flex items-center gap-3">
          <span className="text-2xl">📞</span>
          <div>
            <p className="font-bold text-slate-200">{t("report_helpline")}</p>
            <p className="text-xs text-slate-500">Toll-free, 24x7</p>
          </div>
        </div>

        {/* Privacy footer — safety rule §6 */}
        <p className="text-xs text-slate-600 text-center">
          <a href="/privacy" className="hover:text-slate-400 transition-colors">
            {t("privacy_link")}
          </a>
          {" · "}
          {t("photo_discarded")}
        </p>

        {/* Try again */}
        <button id="btn-again" onClick={() => router.push(`/?lang=${lang}`)} className="btn-primary btn-outline">
          {t("try_again")}
        </button>
      </div>
    </main>
  );
}
