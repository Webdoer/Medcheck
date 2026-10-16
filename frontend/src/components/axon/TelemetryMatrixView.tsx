'use client';

import React from 'react';
import { INITIAL_TELEMETRY } from '@/lib/mockGenomicData';

export function TelemetryMatrixView() {
  const totalTokens = INITIAL_TELEMETRY.reduce((acc, curr) => acc + curr.tokenCount, 0);
  const totalCost = INITIAL_TELEMETRY.reduce((acc, curr) => acc + curr.costUsd, 0);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Agent Telemetry Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Low-latency distributed LLM agent performance, token expenditure, and execution profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Live Throughput:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-mono font-bold">
              48.2 req/sec
            </span>
          </div>
        </div>

        {/* Global summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tokens Consumed</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{totalTokens.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inference Cost / Variant</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">${totalCost.toFixed(4)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Median End-to-End Latency</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">927 ms</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Memory Footprint</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-mono">1.18 GB</p>
          </div>
        </div>

        {/* Agent Breakdown Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Autonomous Sub-Agent</th>
                <th className="py-3 px-3">Average Latency</th>
                <th className="py-3 px-3">Token Consumption</th>
                <th className="py-3 px-3">Guardrail Interceptions</th>
                <th className="py-3 px-3">Decision Accuracy</th>
                <th className="py-3 px-3 text-right">Inference Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {INITIAL_TELEMETRY.map((agent, i) => (
                <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                    {agent.agent}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {agent.avgLatencyMs} ms
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {agent.tokenCount.toLocaleString()} tokens
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {agent.guardrailChecks} checks
                  </td>
                  <td className="py-3.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {agent.accuracy}%
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                    ${agent.costUsd.toFixed(4)}
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
