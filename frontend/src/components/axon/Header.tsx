'use client';

import React from 'react';
import {
  DatabasePillIcon,
  CheckmarkPillIcon,
  ShieldPillIcon,
  PdfDocIcon,
  MoonIcon,
  SunIcon
} from './Icons';

interface HeaderProps {
  onToggleSidebar: () => void;
  runCount: number;
  completedCount: number;
  guardrailHits: number;
  onExportPdf: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export function Header({
  onToggleSidebar,
  runCount,
  completedCount,
  guardrailHits,
  onExportPdf,
  darkMode,
  onToggleTheme
}: HeaderProps) {
  return (
    <header className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
      {/* Left side: Hamburger + Title + Subtitle */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center border border-slate-200/70 dark:border-slate-700/60"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Variant Interpretation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            Real-time multi-agent genomic classification with enterprise guardrails
          </p>
        </div>
      </div>

      {/* Right side: Stat pills + PDF export + Dark mode */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Runs Stat */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <DatabasePillIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="font-bold">{runCount}</span>
          <span className="text-slate-500 dark:text-slate-400 font-normal">Runs</span>
        </div>

        {/* Completed Stat */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <CheckmarkPillIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold">{completedCount}</span>
          <span className="text-slate-500 dark:text-slate-400 font-normal">Completed</span>
        </div>

        {/* Guardrail Hits Stat */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <ShieldPillIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="font-bold">{guardrailHits}</span>
          <span className="text-slate-500 dark:text-slate-400 font-normal">Guardrail Hits</span>
        </div>

        {/* Export PDF Button */}
        <button
          onClick={onExportPdf}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 text-xs font-semibold transition-all hover:shadow-xs active:scale-95"
        >
          <PdfDocIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Export PDF</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme mode"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-colors"
        >
          {darkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
}
