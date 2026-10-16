'use client';

import React, { useState } from 'react';
import { VariantInterpretation, Pathogenicity } from '@/types/genomic';
import { QUICK_DEMO_VARIANTS } from '@/lib/mockGenomicData';

interface HITLGateViewProps {
  onInspectVariant: (variant: VariantInterpretation) => void;
}

export function HITLGateView({ onInspectVariant }: HITLGateViewProps) {
  const [hitlList, setHitlList] = useState<VariantInterpretation[]>([
    QUICK_DEMO_VARIANTS[0], // BRCA1 Arg1700Gln (HITL Required)
    {
      ...QUICK_DEMO_VARIANTS[1],
      id: 'hitl-msh6',
      gene: 'MSH6',
      proteinChange: 'Thr1085Pro',
      hgvs: 'NM_000179.3:c.3253A>C',
      clinvarId: '89104',
      condition: 'Lynch Syndrome',
      classification: 'HITL_REQUIRED',
      confidenceScore: 68.2,
      hitlStatus: 'pending'
    }
  ]);

  const [selectedVariant, setSelectedVariant] = useState<VariantInterpretation>(hitlList[0]);
  const [selectedCall, setSelectedCall] = useState<Pathogenicity>('VUS');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [signOffSuccess, setSignOffSuccess] = useState(false);

  const handleSignOff = () => {
    setSignOffSuccess(true);
    setHitlList(prev => prev.filter(item => item.id !== selectedVariant.id));
    setTimeout(() => setSignOffSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="pb-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Human-in-the-Loop (HITL) Review Gate
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Variants flagged by the Consensus Agent due to conflicting ClinVar evidence or marginal ACMG Bayesian thresholds.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            {hitlList.length} Pending Review
          </span>
        </div>

        {signOffSuccess && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-between">
            <span>✓ Geneticist sign-off recorded and cryptographically signed into audit log.</span>
            <span className="text-[10px] font-mono">HASH: 0x98cf...41a</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column: Queue List */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Awaiting Verification
            </span>
            {hitlList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                All pending variants have been resolved!
              </div>
            ) : (
              hitlList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedVariant(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedVariant.id === item.id
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-blue-600 dark:text-blue-400">{item.gene}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      FLAGGED
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1">{item.proteinChange}</p>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{item.condition}</p>
                </div>
              ))
            )}
          </div>

          {/* Right 2 Columns: Review Panel */}
          {selectedVariant && hitlList.length > 0 && (
            <div className="lg:col-span-2 bg-slate-50/70 dark:bg-slate-950/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {selectedVariant.gene} {selectedVariant.proteinChange}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedVariant.hgvs}</p>
                </div>
                <button
                  onClick={() => onInspectVariant(selectedVariant)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View Full Evidence Trace →
                </button>
              </div>

              {/* Agent Warning / Conflict Details */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  Reason for Human Oversight:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Conflicting interpretations in ClinVar (4 submitters classified as Likely Pathogenic, 2 submitters classified as Variant of Uncertain Significance). AlphaMissense predicts damaging (0.81), but family segregation data is limited.
                </p>
              </div>

              {/* Geneticist Determination */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Certified Geneticist Final Pathogenicity Call:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['PATHOGENIC', 'LIKELY_PATHOGENIC', 'VUS', 'LIKELY_BENIGN'] as Pathogenicity[]).map((call) => (
                    <button
                      key={call}
                      onClick={() => setSelectedCall(call)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedCall === call
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {call.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Clinical Rationale & Sign-Off Comments:
                </label>
                <textarea
                  rows={3}
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Enter medical rationale for overriding or validating agent consensus (e.g. reviewed functional data from recent 2024 trial)..."
                  className="w-full p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Signed as: <strong>Dr. Sarah Chen, MD (FACMG)</strong>
                </span>
                <button
                  onClick={handleSignOff}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                >
                  ✓ Approve & Sign Off Variant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
