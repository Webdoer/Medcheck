'use client';

import React, { useState } from 'react';
import { VariantInterpretation } from '@/types/genomic';
import { QUICK_DEMO_VARIANTS } from '@/lib/mockGenomicData';

interface HistoryViewProps {
  historyItems: VariantInterpretation[];
  onSelectVariant: (variant: VariantInterpretation) => void;
  onExportPdf: (variant: VariantInterpretation) => void;
}

export function HistoryView({ historyItems, onSelectVariant, onExportPdf }: HistoryViewProps) {
  const items = historyItems.length > 0 ? historyItems : QUICK_DEMO_VARIANTS;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('ALL');

  const filtered = items.filter(item => {
    const matchesSearch = item.gene.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hgvs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.proteinChange.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.clinvarId && item.clinvarId.includes(searchTerm));
    
    const matchesFilter = filterClass === 'ALL' || item.classification === filterClass;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Variant Interpretation History
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Audit log of previous multi-agent runs, consensus classifications, and export timestamps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search gene, ClinVar, HGVS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            >
              <option value="ALL">All Classifications</option>
              <option value="PATHOGENIC">Pathogenic</option>
              <option value="HITL_REQUIRED">HITL Required</option>
              <option value="BENIGN">Benign</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Gene</th>
                <th className="py-3 px-3">Variant (HGVS / Protein)</th>
                <th className="py-3 px-3">ClinVar ID</th>
                <th className="py-3 px-3">Consensus Score</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {item.createdAt}
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">
                    {item.gene}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{item.proteinChange}</span>
                    <span className="text-[11px] font-mono text-slate-400">{item.hgvs}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {item.clinvarId || '—'}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {item.confidenceScore}%
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.classification === 'PATHOGENIC'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : item.classification === 'HITL_REQUIRED'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {item.classification.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectVariant(item)}
                        className="px-2.5 py-1 text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onExportPdf(item)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        title="Export PDF"
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
