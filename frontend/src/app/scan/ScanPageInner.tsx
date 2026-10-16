"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Lang, MedicineForm } from "@/types";
import { useI18n } from "@/hooks/useI18n";
import { ocrLabel } from "@/lib/api";

type Mode = "scanner" | "camera" | "processing";

export default function ScanPageInner() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") || "hi") as Lang;
  const { t } = useI18n(lang);
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("scanner");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerInstanceRef = useRef<unknown>(null);

  // Start QR/barcode scanner
  const startScanner = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      scannerInstanceRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        (decodedText: string) => {
          scanner.stop().catch(() => {});
          handleBarcodeResult(decodedText);
        },
        () => {} // ignore scan errors
      );
    } catch {
      setError(t("camera_error"));
      setMode("camera");
    }
  }, [t]);

  useEffect(() => {
    if (mode === "scanner") {
      startScanner();
    }
    return () => {
      const s = scannerInstanceRef.current as { stop?: () => Promise<void>; clear?: () => void } | null;
      if (s) s.stop?.().catch(() => {}).finally(() => s.clear?.());
    };
  }, [mode, startScanner]);

  function handleBarcodeResult(raw: string) {
    // Parse GS1 / QR payload
    const form = parseGS1(raw);
    const params = new URLSearchParams({ lang, ...form });
    router.push(`/confirm?${params}`);
  }

  function parseGS1(raw: string): Partial<MedicineForm> {
    // GS1-128 AIs: (01)=GTIN (10)=Batch (17)=Expiry (21)=Serial
    const batch = raw.match(/\(10\)([^(]+)/)?.[1]?.trim();
    const expiry = raw.match(/\(17\)(\d{6})/)?.[1];
    const expiryDate = expiry
      ? `20${expiry.slice(0, 2)}-${expiry.slice(2, 4)}`
      : undefined;
    // Try JSON QR
    try {
      const json = JSON.parse(raw);
      return {
        drug_name: json.drug_name || json.name || "",
        batch_number: json.batch || json.batch_number || "",
        manufacturer: json.mfr || json.manufacturer || "",
        mfg_date: json.mfg || json.mfg_date || "",
        expiry_date: json.exp || json.expiry_date || "",
      };
    } catch {
      return { batch_number: batch || raw, expiry_date: expiryDate || "" };
    }
  }

  async function handlePhotoCapture(file: File) {
    setProcessing(true);
    setError("");
    try {
      const result = await ocrLabel(file);
      const form: Partial<MedicineForm> & { [k: string]: string } = {};
      for (const key of ["drug_name", "batch_number", "manufacturer", "mfg_date", "expiry_date", "licence_no"] as const) {
        form[key] = result[key].value || "";
      }
      // Pass confidence scores as separate params
      const confidences: Record<string, string> = {};
      for (const key of Object.keys(form)) {
        const r = result[key as keyof typeof result] as { confidence: number } | undefined;
        if (r) confidences[`conf_${key}`] = String(r.confidence);
      }
      const params = new URLSearchParams({ lang, ...form, ...confidences });
      router.push(`/confirm?${params}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "OCR failed");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 py-6 safe-pb">
      {/* Back button + title */}
      <div className="w-full max-w-lg flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-lg font-bold gradient-text">{t("scan")}</h1>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-5 fade-up">
        {/* Scanner box */}
        <div className="scanner-container glass">
          <div id="qr-reader" className="w-full h-full" ref={scannerRef} />
          {mode === "scanner" && (
            <>
              <div className="scanner-corner tl"/><div className="scanner-corner tr"/>
              <div className="scanner-corner bl"/><div className="scanner-corner br"/>
              <div className="scan-line"/>
            </>
          )}
        </div>

        {error && (
          <div className="glass p-3 border-red-500/30 text-red-300 text-sm text-center rounded-xl">
            {error}
          </div>
        )}

        <p className="text-center text-slate-400 text-sm">{t("scan_instruction")}</p>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10"/>
          <span className="text-slate-500 text-sm">{t("or")}</span>
          <div className="flex-1 h-px bg-white/10"/>
        </div>

        {/* Photo capture */}
        <button
          id="btn-photo"
          onClick={() => fileInputRef.current?.click()}
          disabled={processing}
          className="btn-primary"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
        >
          {processing ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              {t("loading")}
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              {t("photo_label")}
            </>
          )}
        </button>
        <p className="text-center text-slate-500 text-sm">{t("photo_instruction")}</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePhotoCapture(file);
          }}
        />
      </div>
    </main>
  );
}
