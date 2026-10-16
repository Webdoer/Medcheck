'use client';

import React from 'react';
import { VariantInterpretation } from '@/types/genomic';
import { QUICK_DEMO_VARIANTS } from '@/lib/mockGenomicData';

interface PDFExportModalProps {
  variant?: VariantInterpretation | null;
  onClose: () => void;
}

export function PDFExportModal({ variant, onClose }: PDFExportModalProps) {
  const current = variant || QUICK_DEMO_VARIANTS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          {/* Header of Report */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                AG
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                  Axon Gene Clinical Interpretation Summary
                </h3>
                <p className="text-xs text-slate-500">
                  CLIA / CAP Compliant Molecular Diagnostic Report • ID: #AG-{current.clinvarId || '84920'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 text-base font-bold"
            >
              ✕
            </button>
          </div>

          {/* Variant Core Box */}
          <div className="my-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Gene Symbol</span>
                <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">{current.gene}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Protein Alteration</span>
                <span className="text-base font-mono font-bold text-slate-800 dark:text-slate-200">{current.proteinChange}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">cDNA Coordinate</span>
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-medium">{current.cDNAChange}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Classification</span>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-black ${
                  current.classification === 'PATHOGENIC'
                    ? 'bg-rose-100 text-rose-800'
                    : current.classification === 'HITL_REQUIRED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {current.classification}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Phenotype & Recommendation */}
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                Condition &amp; Inheritance
              </h4>
              <p className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40">
                Associated with <strong>{current.condition}</strong> (Inheritance pattern: {current.inheritance}).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                ACMG / AMP Evidence Justification
              </h4>
              <div className="space-y-2">
                {current.acmgCriteria.filter(c => c.met).map(c => (
                  <div key={c.code} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">{c.code} ({c.strength}):</span>
                    <span>{c.evidence}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                Digital Signature &amp; Reviewer Attestation
              </h4>
              <p className="text-[11px] text-slate-500 italic">
                Electronically approved via Axon Gene AI Consensus Agent + Medical Geneticist Attestation.
                Cryptographic signature timestamp: 2026-10-16 13:52:10 UTC (Auth Token: AG-VAL-99214).
              </p>
            </div>
          </div>
        </div>

        {/* Modal footer actions */}
        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            For Investigational &amp; Clinical Decision Support
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95"
            >
              Print / Save Clinical PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
