'use client';

import React, { useState } from 'react';
import { INITIAL_AUDIT_LOGS } from '@/lib/mockGenomicData';

export function AuditSecurityView() {
  const [logs] = useState(INITIAL_AUDIT_LOGS);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Enterprise Audit &amp; Security Shield
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                HIPAA / GDPR Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cryptographically verified event logs: PII/PHI scrubbing, prompt injection prevention, and consensus traceability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
              SHA-256 Merkle Root: 0x48a...e91
            </span>
          </div>
        </div>

        {/* Security Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">PII Zero-Leakage Engine</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">100% Client-Side Stripping</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Names, MRNs, and genomic patient IDs redacted before LLM prompt assembly.</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Prompt Sentinel v3</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">Active Jailbreak Defenses</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Inspects all user free-text inputs for adversarial prompt injections.</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Audit Trail Immutability</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">Append-Only Event Ledger</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Every clinical classification is digitally hashed and permanently recorded.</p>
          </div>
        </div>

        {/* Event Logs Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Event Type</th>
                <th className="py-3 px-3">Trigger Entity</th>
                <th className="py-3 px-3">Security Action / Summary</th>
                <th className="py-3 px-3">Audit Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.eventType === 'GUARDRAIL_INTERCEPT'
                        ? 'bg-rose-100 text-rose-800'
                        : log.eventType === 'HITL_OVERRIDE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.eventType}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {log.entityId}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-md">
                    {log.message}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                    {log.hash}
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
