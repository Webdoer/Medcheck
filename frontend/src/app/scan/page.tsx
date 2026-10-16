"use client";

import { Suspense } from "react";
import ScanPageInner from "./ScanPageInner";

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center text-slate-400">Loading...</div>}>
      <ScanPageInner />
    </Suspense>
  );
}
