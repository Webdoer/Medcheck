'use client';

import React, { useState } from 'react';
import { 
  VariantInterpretation, 
  AgentStep 
} from '@/types/genomic';
import { QUICK_DEMO_VARIANTS } from '@/lib/mockGenomicData';
import { 
  SearchIcon, 
  PlayTriangleIcon, 
  BatchVcfIcon 
} from './Icons';

interface InterpretViewProps {
  onLaunchPipeline: (inputQuery: string, variantData?: VariantInterpretation) => void;
  onSwitchToBatch: () => void;
  onOpenAnalysis: (variant: VariantInterpretation) => void;
  onOpenPdfReport: (variant: VariantInterpretation) => void;
  onSendToHitl: (variant: VariantInterpretation) => void;
  currentResult: VariantInterpretation | null;
  isRunningPipeline: boolean;
  activeAgentSteps: AgentStep[];
}

export function InterpretView({
  onLaunchPipeline,
  onSwitchToBatch,
  onOpenAnalysis,
  onOpenPdfReport,
  onSendToHitl,
  currentResult,
  isRunningPipeline,
  activeAgentSteps
}: InterpretViewProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);

  const handleSelectDemo = (demo: VariantInterpretation) => {
    setSelectedDemoId(demo.id);
    setInputValue(demo.clinvarId ? demo.clinvarId : demo.hgvs);
  };

  const handleRun = () => {
    const matched = QUICK_DEMO_VARIANTS.find(
      d => d.clinvarId === inputValue.trim() || d.hgvs.toLowerCase() === inputValue.trim().toLowerCase() || d.id === selectedDemoId
    );
    onLaunchPipeline(inputValue.trim() || '55476', matched);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-6xl mx-auto animate-fade-in">
      {/* Sub-navigation tabs matching screenshot */}
      <div className="flex justify-center w-full">
        <div className="inline-flex items-center p-1.5 rounded-full bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/60 backdrop-blur-xs shadow-xs">
          <button
            className="px-6 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-sm transition-all"
          >
            Interpret New Variant
          </button>
          <button
            onClick={onSwitchToBatch}
            className="flex items-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <BatchVcfIcon className="w-4 h-4 text-slate-500" />
            <span>Batch VCF Processing</span>
          </button>
        </div>
      </div>

      {/* Main Container Card matching screenshot */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-9 transition-all">
        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-blue-600 font-bold text-lg">+</span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Interpret New Variant
          </h2>
        </div>

        {/* Form Field */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            ClinVar ID / HGVS Coordinate
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-slate-400" />
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setSelectedDemoId(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRun();
              }}
              placeholder="e.g. 55476  or  NM_007294.4:c.5096G>A"
              className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono shadow-xs"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue('');
                  setSelectedDemoId(null);
                }}
                className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 pl-1">
            Supports NCBI ClinVar IDs or HGVS coding notation. PII is auto-scrubbed before transmission.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="w-full mb-8">
          <button
            onClick={handleRun}
            disabled={isRunningPipeline}
            className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-blue-500/20 transition-all ${
              isRunningPipeline
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white hover:shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            {isRunningPipeline ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Orchestrating Multi-Agent Pipeline...</span>
              </>
            ) : (
              <>
                <PlayTriangleIcon className="w-3.5 h-3.5 fill-current" />
                <span>Launch Multi-Agent Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* QUICK DEMO VARIANTS matching screenshot */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3.5">
            Quick Demo Variants
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {QUICK_DEMO_VARIANTS.map((demo) => {
              const isSelected = selectedDemoId === demo.id;
              
              let badgeColor = '';
              let badgeLabel = '';
              if (demo.classification === 'HITL_REQUIRED') {
                badgeColor = 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
                badgeLabel = 'HITL';
              } else if (demo.classification === 'PATHOGENIC') {
                badgeColor = 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
                badgeLabel = 'PATH';
              } else {
                badgeColor = 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
                badgeLabel = 'BENIGN';
              }

              return (
                <button
                  key={demo.id}
                  onClick={() => handleSelectDemo(demo)}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                    {demo.gene}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-mono my-1 truncate">
                    {demo.proteinChange}
                  </span>
                  <span className={`inline-block self-start text-[10px] font-bold px-2 py-0.5 rounded-md border mt-1 ${badgeColor}`}>
                    {badgeLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Multi-Agent Execution Progress & Live Pipeline View */}
      {(isRunningPipeline || activeAgentSteps.length > 0) && (
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Multi-Agent Consensus Pipeline</span>
                {isRunningPipeline && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full font-medium">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
                    Running
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Independent AI agents validating criteria, evidence retrieval, and clinical guardrails
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-400">
              Pipeline ID: 0x{Math.floor(Math.random() * 89999 + 10000).toString(16)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {activeAgentSteps.map((step, idx) => (
              <div 
                key={step.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  step.status === 'completed'
                    ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                    : step.status === 'alert'
                    ? 'border-amber-200 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20'
                    : step.status === 'running'
                    ? 'border-blue-400 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30 animate-pulse'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Agent {idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {step.durationMs ? `${step.durationMs}ms` : 'pending'}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                  {step.agentName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-2">
                  {step.agentRole}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-[11px] leading-relaxed">
                  {step.outputSummary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result Card when pipeline finishes */}
      {currentResult && !isRunningPipeline && (
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {currentResult.gene}
                </span>
                <span className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {currentResult.proteinChange}
                </span>
                <span className="text-xs text-slate-400">
                  ({currentResult.cDNAChange})
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Associated condition: <span className="font-medium text-slate-700 dark:text-slate-300">{currentResult.condition}</span> • Transcript: <span className="font-mono">{currentResult.transcript}</span>
              </p>
            </div>

            {/* Pathogenicity Badge & Confidence */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Consensus Confidence
                </span>
                <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  {currentResult.confidenceScore}%
                </span>
              </div>
              <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border shadow-xs ${
                currentResult.classification === 'PATHOGENIC'
                  ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800'
                  : currentResult.classification === 'HITL_REQUIRED'
                  ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800'
                  : currentResult.classification === 'BENIGN'
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-indigo-100 text-indigo-700 border-indigo-300'
              }`}>
                {currentResult.classification.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Genomic Evidence Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">gnomAD Population AF</span>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{currentResult.alleleFrequency}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">dbSNP Identifier</span>
              <p className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">{currentResult.dbSNP}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AlphaMissense / REVEL</span>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">
                {currentResult.inSilico.alphaMissense} / {currentResult.inSilico.revel}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CADD Phred Score</span>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{currentResult.inSilico.cadd}</p>
            </div>
          </div>

          {/* ACMG Evidence Criteria Chips */}
          <div className="mb-6">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2.5">
              Satisfied ACMG / AMP Evidence Rules:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentResult.acmgCriteria.map((c) => (
                <div 
                  key={c.code}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    c.met
                      ? c.category === 'Pathogenic'
                        ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300'
                      : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                  }`}
                  title={c.description}
                >
                  <span className="font-bold">{c.code}</span>
                  <span className="text-[10px] opacity-75">({c.strength})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onOpenAnalysis(currentResult)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              Inspect Deep Analysis & Bayesian Score →
            </button>

            <div className="flex items-center gap-2">
              {currentResult.classification === 'HITL_REQUIRED' && (
                <button
                  onClick={() => onSendToHitl(currentResult)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  Open in HITL Review Gate
                </button>
              )}
              <button
                onClick={() => onOpenPdfReport(currentResult)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
              >
                Generate Clinical PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
