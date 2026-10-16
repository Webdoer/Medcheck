'use client';

import React, { useState } from 'react';
import { BatchVCFRow, Pathogenicity } from '@/types/genomic';
import { INITIAL_BATCH_VCF } from '@/lib/mockGenomicData';

interface BatchVCFViewProps {
  onBackToInterpret: () => void;
  onInspectVariant: (hgvs: string) => void;
}

export function BatchVCFView({ onBackToInterpret, onInspectVariant }: BatchVCFViewProps) {
  const [rows, setRows] = useState<BatchVCFRow[]>(INITIAL_BATCH_VCF);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(100);
  const [fileName, setFileName] = useState('sample_trio_germline_panel.vcf.gz');

  const handleStartBatch = () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate real-time streaming batch execution
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setRows(r => r.map(row => ({
            ...row,
            status: 'Completed',
            classification: row.classification || 'PATHOGENIC'
          })));
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleLoadSample = (sample: string) => {
    setFileName(sample);
    setProgress(0);
    setRows(INITIAL_BATCH_VCF.map((r, i) => ({
      ...r,
      status: i < 3 ? 'Completed' : 'Queued'
    })));
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-6xl mx-auto animate-fade-in">
      {/* Top controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToInterpret}
          className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          ← Return to Single Variant Interpreter
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sample Datasets:</span>
          <button
            onClick={() => handleLoadSample('clinvar_cancer_hotspots.vcf')}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            Cancer Hotspots VCF
          </button>
          <button
            onClick={() => handleLoadSample('pediatric_exome_trio.vcf.gz')}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            Exome Trio VCF
          </button>
        </div>
      </div>

      {/* Upload Dropzone Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Batch VCF Processing Pipeline</span>
              <span className="text-xs font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300 px-2 py-0.5 rounded-full">
                High-Throughput
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Upload VCF 4.2 / 4.3 files to annotate thousands of variants with multi-agent consensus in parallel.
            </p>
          </div>

          <button
            onClick={handleStartBatch}
            disabled={isProcessing}
            className={`px-6 py-3 rounded-full font-semibold text-xs sm:text-sm text-white shadow-md transition-all ${
              isProcessing 
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/25'
            }`}
          >
            {isProcessing ? `Processing (${progress}%)...` : '▶ Run Batch Multi-Agent Analysis'}
          </button>
        </div>

        {/* File info and progress */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center font-bold text-xs">
              VCF
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">{fileName}</p>
              <p className="text-[11px] text-slate-500">6 Annotated Records • Reference: GRCh38 • PII Sanitized</p>
            </div>
          </div>

          <div className="w-full sm:w-64 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Annotation Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Variants Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Coordinates (GRCh38)</th>
                <th className="py-3 px-3">Gene</th>
                <th className="py-3 px-3">HGVS Notation</th>
                <th className="py-3 px-3">Predicted Impact</th>
                <th className="py-3 px-3">Consensus Classification</th>
                <th className="py-3 px-3">Pipeline Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {row.chrom}:{row.pos.toLocaleString()} ({row.ref}&gt;{row.alt})
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">
                    {row.gene}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {row.hgvs}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {row.predictedImpact}
                  </td>
                  <td className="py-3 px-3">
                    {row.classification ? (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        row.classification === 'PATHOGENIC'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : row.classification === 'HITL_REQUIRED'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : row.classification === 'BENIGN'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {row.classification}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Pending...</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                      row.status === 'Completed' ? 'text-emerald-600' : row.status === 'Flagged' ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        row.status === 'Completed' ? 'bg-emerald-500' : row.status === 'Flagged' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onInspectVariant(row.hgvs)}
                      className="px-2.5 py-1 text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                    >
                      Inspect →
                    </button>
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
