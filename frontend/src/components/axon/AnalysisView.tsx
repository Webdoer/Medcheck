'use client';

import React, { useState } from 'react';
import { VariantInterpretation, ACMGCriterion } from '@/types/genomic';
import { QUICK_DEMO_VARIANTS } from '@/lib/mockGenomicData';

interface AnalysisViewProps {
  currentVariant?: VariantInterpretation | null;
  onExportPdf: (variant: VariantInterpretation) => void;
  onSendToHitl: (variant: VariantInterpretation) => void;
}

export function AnalysisView({ currentVariant, onExportPdf, onSendToHitl }: AnalysisViewProps) {
  const variant = currentVariant || QUICK_DEMO_VARIANTS[0];
  const [criteria, setCriteria] = useState<ACMGCriterion[]>(variant.acmgCriteria);
  const [notes, setNotes] = useState('');

  const toggleCriterion = (code: string) => {
    setCriteria(prev => prev.map(c => c.code === code ? { ...c, met: !c.met } : c));
  };

  const metPathogenicCount = criteria.filter(c => c.met && c.category === 'Pathogenic').length;
  const metBenignCount = criteria.filter(c => c.met && c.category === 'Benign').length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{variant.gene}</span>
            <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-xl">
              {variant.proteinChange}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {variant.hgvs}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Condition: <strong className="text-slate-700 dark:text-slate-200">{variant.condition}</strong> • ClinVar ID: <span className="font-mono">{variant.clinvarId || 'N/A'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSendToHitl(variant)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-all"
          >
            Review in HITL Gate
          </button>
          <button
            onClick={() => onExportPdf(variant)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            Export Clinical PDF
          </button>
        </div>
      </div>

      {/* Grid: ACMG Interactive Rule Matrix & Bayesian Confidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: ACMG Rule Engine */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                ACMG/AMP Evidence Rules Evaluation
              </h3>
              <p className="text-xs text-slate-500">
                Click any criterion to toggle evidence application and test consensus impact.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px]">
                {metPathogenicCount} Pathogenic
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px]">
                {metBenignCount} Benign
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {criteria.map((c) => (
              <div 
                key={c.code}
                onClick={() => toggleCriterion(c.code)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                  c.met 
                    ? c.category === 'Pathogenic'
                      ? 'border-rose-300 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20 shadow-xs'
                      : 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                      c.met ? (c.category === 'Pathogenic' ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-slate-300'
                    }`}>
                      {c.met ? '✓' : ''}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {c.code}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {c.strength}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-400">
                    {c.met ? 'Met' : 'Unmet'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-2">
                  {c.description}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                  Evidence: {c.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: In-Silico Predictors & In-Depth Confidence */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              In-Silico Pathogenicity Scores
            </h4>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>AlphaMissense (DeepMind)</span>
                  <span className="text-blue-600 font-mono">{variant.inSilico.alphaMissense}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${variant.inSilico.alphaMissense * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>REVEL Ensemble</span>
                  <span className="text-blue-600 font-mono">{variant.inSilico.revel}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${variant.inSilico.revel * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>CADD Phred</span>
                  <span className="text-blue-600 font-mono">{variant.inSilico.cadd}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full" style={{ width: `${Math.min(variant.inSilico.cadd * 2.5, 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>SpliceAI (Δ max score)</span>
                  <span className="text-blue-600 font-mono">{variant.inSilico.spliceAI}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${variant.inSilico.spliceAI * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Clinical Interpretation Notes
            </h4>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add laboratory notes, Sanger confirmation results, or patient family history details..."
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={() => alert('Clinical notes saved to variant case record.')}
              className="mt-3 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Save Variant Annotations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
