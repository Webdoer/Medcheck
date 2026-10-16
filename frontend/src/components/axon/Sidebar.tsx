'use client';

import React from 'react';
import { NavigationTab } from '@/types/genomic';
import {
  DnaLogoIcon,
  DashboardIcon,
  AnalysisIcon,
  HistoryIcon,
  BatchVcfIcon,
  HitlIcon,
  EvalSuiteIcon,
  AuditIcon,
  TelemetryIcon
} from './Icons';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ activeTab, onSelectTab, isOpen, onCloseMobile }: SidebarProps) {
  const coreNavItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'analysis', label: 'Analysis', icon: <AnalysisIcon /> },
    { id: 'history', label: 'Analysis History', icon: <HistoryIcon /> },
    { id: 'batch-vcf', label: 'Batch VCF', icon: <BatchVcfIcon />, badge: 'NEW' },
    { id: 'hitl', label: 'HITL Gate', icon: <HitlIcon /> },
  ];

  const advancedNavItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'eval-suite', label: 'Eval Suite', icon: <EvalSuiteIcon />, badge: '20' },
    { id: 'audit-security', label: 'Audit & Security', icon: <AuditIcon /> },
    { id: 'telemetry', label: 'Telemetry Matrix', icon: <TelemetryIcon /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between py-6 px-4 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
              <DnaLogoIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
                Axon gene
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-blue-600 dark:text-blue-400">
                AI v2
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-5 mt-2">
            {/* CORE section */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-2">
                Core
              </span>
              <nav className="flex flex-col gap-1">
                {coreNavItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ADVANCED section */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-2">
                Advanced
              </span>
              <nav className="flex flex-col gap-1">
                {advancedNavItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom System Status */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 px-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-emerald-700 dark:text-emerald-400">System Operational</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">v2.4.0</span>
        </div>
      </aside>
    </>
  );
}
