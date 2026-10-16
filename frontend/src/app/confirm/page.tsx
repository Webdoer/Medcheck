"use client";

import { Suspense } from "react";
import ConfirmPageInner from "./ConfirmPageInner";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center text-slate-400">Loading...</div>}>
      <ConfirmPageInner />
    </Suspense>
  );
}
