'use client';

import React, { useState } from 'react';
import { EVAL_BENCHMARK_DATA } from '@/lib/mockGenomicData';

export function EvalSuiteView() {
  const [isRunningEval, setIsRunningEval] = useState(false);
  const [accuracy, setAccuracy] = useState(EVAL_BENCHMARK_DATA.accuracy);

  const handleRunBenchmark = () => {
    setIsRunningEval(true);
    setTimeout(() => {
      setIsRunningEval(false);
      setAccuracy(98.6);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Genomic Evaluation Suite
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
                20 Benchmarks Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Continuous validation against 12,450 curated variants with known clinical outcomes (ClinVar &amp; ACMG gold-standards).
            </p>
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={isRunningEval}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:bg-blue-300"
          >
            {isRunningEval ? 'Executing 20 Benchmarks...' : '▶ Run Real-Time Validation'}
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Classification Accuracy</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{accuracy}%</p>
            <span className="text-[10px] text-emerald-600 font-semibold">↑ +0.4% vs Baseline</span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">ACMG Concordance</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{EVAL_BENCHMARK_DATA.acmgConcordance}%</p>
            <span className="text-[10px] text-slate-400">Inter-laboratory verified</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Guardrail Intercept</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">100.0%</p>
            <span className="text-[10px] text-emerald-600 font-semibold">0 PHI leakage</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Pipeline Latency</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{EVAL_BENCHMARK_DATA.averagePipelineLatency}</p>
            <span className="text-[10px] text-slate-400">4 Parallel Agents</span>
          </div>
        </div>

        {/* Benchmark Suites List */}
        <div className="mt-8">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
            Benchmark Datasets &amp; Stress Tests
          </h3>
          <div className="space-y-3">
            {EVAL_BENCHMARK_DATA.benchmarks.map((b, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">{b.name}</h4>
                  <p className="text-[11px] text-slate-400">{b.variants.toLocaleString()} curated test variants</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{b.accuracy}</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
