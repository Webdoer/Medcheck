"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Lang, MedicineForm } from "@/types";
import { useI18n } from "@/hooks/useI18n";
import { checkMedicine } from "@/lib/api";
import { findLookalikePositions } from "@/lib/normalise";

interface FieldMeta {
  key: keyof MedicineForm;
  label: string;
  required?: boolean;
}

export default function ConfirmPageInner() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") || "hi") as Lang;
  const { t } = useI18n(lang);
  const router = useRouter();

  const [form, setForm] = useState<MedicineForm>({
    drug_name: searchParams.get("drug_name") || "",
    batch_number: searchParams.get("batch_number") || "",
    manufacturer: searchParams.get("manufacturer") || "",
    mfg_date: searchParams.get("mfg_date") || "",
    expiry_date: searchParams.get("expiry_date") || "",
    licence_no: searchParams.get("licence_no") || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Confidence map from OCR
  const confidences: Partial<Record<keyof MedicineForm, number>> = {};
  for (const key of Object.keys(form) as (keyof MedicineForm)[]) {
    const v = searchParams.get(`conf_${key}`);
    if (v !== null) confidences[key] = parseFloat(v);
  }

  const FIELDS: FieldMeta[] = [
    { key: "drug_name", label: t("drug_name"), required: true },
    { key: "batch_number", label: t("batch_number"), required: true },
    { key: "manufacturer", label: t("manufacturer") },
    { key: "mfg_date", label: t("mfg_date") },
    { key: "expiry_date", label: t("expiry_date") },
    { key: "licence_no", label: t("licence_no") },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.drug_name || !form.batch_number) {
      setError("दवा का नाम और बैच नंबर आवश्यक हैं");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await checkMedicine(
        { drug_name: form.drug_name, batch_number: form.batch_number, manufacturer: form.manufacturer },
        lang
      );
      const params = new URLSearchParams({ lang, result: JSON.stringify(result) });
      router.push(`/result?${params}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  function renderField(meta: FieldMeta) {
    const conf = confidences[meta.key];
    const isLowConf = conf !== undefined && conf < 0.8;
    const value = form[meta.key];
    const lookalikePositions = meta.key === "batch_number"
      ? findLookalikePositions(value)
      : [];
    const hasLookalike = lookalikePositions.length > 0;

    return (
      <div key={meta.key} className="field-wrap">
        <label htmlFor={`field-${meta.key}`} className="field-label flex items-center gap-2">
          {meta.label}
          {meta.required && <span className="text-red-400">*</span>}
          {isLowConf && (
            <span className="badge badge-warn ml-auto">
              ⚠ {Math.round(conf * 100)}%
            </span>
          )}
        </label>
        <input
          id={`field-${meta.key}`}
          type="text"
          value={value}
          onChange={(e) => setForm((prev) => ({ ...prev, [meta.key]: e.target.value }))}
          className={`field-input ${isLowConf ? "low-confidence" : ""} ${hasLookalike && !isLowConf ? "has-lookalike" : ""}`}
          autoCapitalize="characters"
          spellCheck={false}
        />
        {isLowConf && (
          <p className="text-xs text-amber-400 mt-1">⚠ {t("low_confidence_hint")}</p>
        )}
        {hasLookalike && (
          <p className="text-xs text-indigo-300 mt-1">👁 {t("lookalike_hint")}</p>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 py-6 safe-pb">
      <div className="w-full max-w-lg flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-lg font-bold gradient-text">{t("confirm_title")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-4 fade-up">
        <div className="glass p-5 flex flex-col gap-4">
          {FIELDS.map(renderField)}
        </div>

        {error && (
          <div className="glass p-3 border-red-500/30 text-red-300 text-sm rounded-xl">
            {error}
          </div>
        )}

        <button id="btn-confirm" type="submit" disabled={loading} className="btn-primary py-5 text-xl">
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              {t("loading")}
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
              </svg>
              {t("check_btn")}
            </>
          )}
        </button>
      </form>
    </main>
  );
}
