"use client";

import { Suspense } from "react";
import ResultPageInner from "./ResultPageInner";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center text-slate-400">Loading...</div>}>
      <ResultPageInner />
    </Suspense>
  );
}
