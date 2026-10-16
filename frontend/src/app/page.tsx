'use client';

import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  VariantInterpretation, 
  AgentStep 
} from '@/types/genomic';
import { QUICK_DEMO_VARIANTS } from '@/lib/mockGenomicData';
import { Sidebar } from '@/components/axon/Sidebar';
import { Header } from '@/components/axon/Header';
import { InterpretView } from '@/components/axon/InterpretView';
import { BatchVCFView } from '@/components/axon/BatchVCFView';
import { AnalysisView } from '@/components/axon/AnalysisView';
import { HistoryView } from '@/components/axon/HistoryView';
import { HITLGateView } from '@/components/axon/HITLGateView';
import { EvalSuiteView } from '@/components/axon/EvalSuiteView';
import { AuditSecurityView } from '@/components/axon/AuditSecurityView';
import { TelemetryMatrixView } from '@/components/axon/TelemetryMatrixView';
import { PDFExportModal } from '@/components/axon/PDFExportModal';

export default function AxonGeneApp() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Counter metrics
  const [runCount, setRunCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [guardrailHits, setGuardrailHits] = useState(0);

  // Pipeline state
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [activeAgentSteps, setActiveAgentSteps] = useState<AgentStep[]>([]);
  const [currentResult, setCurrentResult] = useState<VariantInterpretation | null>(null);

  // History & Selected Variant for Deep Inspection
  const [historyItems, setHistoryItems] = useState<VariantInterpretation[]>([]);
  const [selectedVariantForAnalysis, setSelectedVariantForAnalysis] = useState<VariantInterpretation | null>(null);

  // PDF modal state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [variantForPdf, setVariantForPdf] = useState<VariantInterpretation | null>(null);

  // Initialize theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // Launch Multi-Agent Pipeline simulation
  const handleLaunchPipeline = (inputQuery: string, variantData?: VariantInterpretation) => {
    const targetVariant = variantData || QUICK_DEMO_VARIANTS.find(
      v => v.clinvarId === inputQuery || v.hgvs.toLowerCase().includes(inputQuery.toLowerCase())
    ) || QUICK_DEMO_VARIANTS[0];

    setIsRunningPipeline(true);
    setRunCount(prev => prev + 1);
    setCurrentResult(null);

    // Initial step setup
    const initialSteps: AgentStep[] = [
      {
        id: 'step-1',
        agentName: 'PII & HIPAA Guardrail',
        agentRole: 'Input Sanitization & Compliance',
        icon: 'ShieldCheck',
        status: 'running',
        timestamp: new Date().toLocaleTimeString(),
        outputSummary: 'Inspecting input payload for PHI, MRNs, patient identity data, and prompt injections...'
      },
      {
        id: 'step-2',
        agentName: 'Genomic Knowledge Retriever',
        agentRole: 'ClinVar, gnomAD, dbSNP Aggregator',
        icon: 'Database',
        status: 'pending',
        timestamp: '',
        outputSummary: 'Queued for allele frequency & clinical database query.'
      },
      {
        id: 'step-3',
        agentName: 'ACMG Rule Engine',
        agentRole: 'Standardized 2015 Criteria Calculator',
        icon: 'Scale',
        status: 'pending',
        timestamp: '',
        outputSummary: 'Waiting on evidence bundle extraction.'
      },
      {
        id: 'step-4',
        agentName: 'Consensus & Clinical Synthesizer',
        agentRole: 'Bayesian Pathogenicity Arbitrator',
        icon: 'Cpu',
        status: 'pending',
        timestamp: '',
        outputSummary: 'Awaiting sub-agent criteria aggregation.'
      }
    ];

    setActiveAgentSteps(initialSteps);

    // Progression timeline simulation
    setTimeout(() => {
      // Step 1 done, Step 2 running
      setActiveAgentSteps(prev => [
        {
          ...prev[0],
          status: 'completed',
          durationMs: 98,
          outputSummary: 'Safe Harbor HIPAA Verified. 0 PII entities detected. Canonical HGVS format confirmed.'
        },
        {
          ...prev[1],
          status: 'running',
          timestamp: new Date().toLocaleTimeString(),
          outputSummary: `Querying NCBI ClinVar API for ${targetVariant.gene} and gnomAD v4.1 population exomes...`
        },
        prev[2],
        prev[3]
      ]);
    }, 600);

    setTimeout(() => {
      // Step 2 done, Step 3 running
      setActiveAgentSteps(prev => [
        prev[0],
        {
          ...prev[1],
          status: 'completed',
          durationMs: 340,
          outputSummary: `Retrieved ${targetVariant.dbSNP}. Population AF: ${targetVariant.alleleFrequency}. ClinVar annotations aggregated.`
        },
        {
          ...prev[2],
          status: 'running',
          timestamp: new Date().toLocaleTimeString(),
          outputSummary: 'Evaluating 28 ACMG/AMP rules across functional, computational, and segregation domains...'
        },
        prev[3]
      ]);
    }, 1300);

    setTimeout(() => {
      // Step 3 done, Step 4 running
      setActiveAgentSteps(prev => [
        prev[0],
        prev[1],
        {
          ...prev[2],
          status: 'completed',
          durationMs: 290,
          outputSummary: `Triggered rules: ${targetVariant.acmgCriteria.filter(c => c.met).map(c => c.code).join(', ')}. In-silico consensus computed.`
        },
        {
          ...prev[3],
          status: targetVariant.classification === 'HITL_REQUIRED' ? 'alert' : 'running',
          timestamp: new Date().toLocaleTimeString(),
          outputSummary: 'Formulating final consensus classification and confidence scoring...'
        }
      ]);
    }, 2000);

    setTimeout(() => {
      // All steps done
      const completedVariant: VariantInterpretation = {
        ...targetVariant,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      setActiveAgentSteps(targetVariant.agentSteps);
      setCurrentResult(completedVariant);
      setIsRunningPipeline(false);
      setCompletedCount(prev => prev + 1);

      if (targetVariant.guardrailTriggered) {
        setGuardrailHits(prev => prev + 1);
      }

      setHistoryItems(prev => [completedVariant, ...prev]);
    }, 2700);
  };

  const handleOpenAnalysis = (variant: VariantInterpretation) => {
    setSelectedVariantForAnalysis(variant);
    setActiveTab('analysis');
  };

  const handleSendToHitl = (variant: VariantInterpretation) => {
    setSelectedVariantForAnalysis(variant);
    setActiveTab('hitl');
  };

  const handleOpenPdf = (variant?: VariantInterpretation) => {
    setVariantForPdf(variant || currentResult || QUICK_DEMO_VARIANTS[0]);
    setPdfModalOpen(true);
  };

  return (
    <div className={`min-h-screen text-slate-800 dark:text-slate-100 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-blue-100 via-sky-50 to-blue-50'
    } transition-colors duration-300 flex`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl w-full mx-auto">
          {/* Header Bar matching screenshot */}
          <Header
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            runCount={runCount}
            completedCount={completedCount}
            guardrailHits={guardrailHits}
            onExportPdf={() => handleOpenPdf()}
            darkMode={darkMode}
            onToggleTheme={toggleTheme}
          />

          {/* Active View Container */}
          <div className="w-full">
            {activeTab === 'dashboard' && (
              <InterpretView
                onLaunchPipeline={handleLaunchPipeline}
                onSwitchToBatch={() => setActiveTab('batch-vcf')}
                onOpenAnalysis={handleOpenAnalysis}
                onOpenPdfReport={handleOpenPdf}
                onSendToHitl={handleSendToHitl}
                currentResult={currentResult}
                isRunningPipeline={isRunningPipeline}
                activeAgentSteps={activeAgentSteps}
              />
            )}

            {activeTab === 'analysis' && (
              <AnalysisView
                currentVariant={selectedVariantForAnalysis || currentResult || QUICK_DEMO_VARIANTS[0]}
                onExportPdf={handleOpenPdf}
                onSendToHitl={handleSendToHitl}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                historyItems={historyItems}
                onSelectVariant={handleOpenAnalysis}
                onExportPdf={handleOpenPdf}
              />
            )}

            {activeTab === 'batch-vcf' && (
              <BatchVCFView
                onBackToInterpret={() => setActiveTab('dashboard')}
                onInspectVariant={(hgvs) => {
                  const matched = QUICK_DEMO_VARIANTS.find(v => v.hgvs === hgvs) || QUICK_DEMO_VARIANTS[0];
                  handleOpenAnalysis(matched);
                }}
              />
            )}

            {activeTab === 'hitl' && (
              <HITLGateView
                onInspectVariant={handleOpenAnalysis}
              />
            )}

            {activeTab === 'eval-suite' && (
              <EvalSuiteView />
            )}

            {activeTab === 'audit-security' && (
              <AuditSecurityView />
            )}

            {activeTab === 'telemetry' && (
              <TelemetryMatrixView />
            )}
          </div>
        </main>
      </div>

      {/* PDF Export Modal */}
      {pdfModalOpen && (
        <PDFExportModal
          variant={variantForPdf}
          onClose={() => setPdfModalOpen(false)}
        />
      )}
    </div>
  );
}
