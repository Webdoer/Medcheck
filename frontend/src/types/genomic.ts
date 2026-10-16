export type NavigationTab = 
  | 'dashboard'
  | 'analysis'
  | 'history'
  | 'batch-vcf'
  | 'hitl'
  | 'eval-suite'
  | 'audit-security'
  | 'telemetry';

export type SegmentTab = 'interpret' | 'batch-vcf';

export type Pathogenicity = 
  | 'PATHOGENIC'
  | 'LIKELY_PATHOGENIC'
  | 'VUS'
  | 'LIKELY_BENIGN'
  | 'BENIGN'
  | 'HITL_REQUIRED';

export interface ACMGCriterion {
  code: string; // e.g. PVS1, PM2, PP3
  strength: 'Very Strong' | 'Strong' | 'Moderate' | 'Supporting' | 'Stand-alone';
  category: 'Pathogenic' | 'Benign';
  met: boolean;
  description: string;
  evidence: string;
}

export interface AgentStep {
  id: string;
  agentName: string;
  agentRole: string;
  icon: string;
  status: 'pending' | 'running' | 'completed' | 'alert';
  timestamp: string;
  durationMs?: number;
  outputSummary: string;
  details?: Record<string, any>;
}

export interface VariantInterpretation {
  id: string;
  clinvarId?: string;
  hgvs: string;
  gene: string;
  proteinChange: string;
  cDNAChange: string;
  genomicCoords: string;
  transcript: string;
  classification: Pathogenicity;
  confidenceScore: number; // 0 - 100
  condition: string;
  inheritance: string;
  alleleFrequency: string; // e.g. 0.000014 (gnomAD v4)
  dbSNP: string;
  inSilico: {
    revel: number;
    alphaMissense: number;
    cadd: number;
    spliceAI: number;
  };
  acmgCriteria: ACMGCriterion[];
  agentSteps: AgentStep[];
  guardrailTriggered: boolean;
  guardrailDetails?: string;
  hitlRequired: boolean;
  hitlStatus?: 'pending' | 'approved' | 'modified' | 'rejected';
  hitlReviewer?: string;
  hitlNotes?: string;
  createdAt: string;
}

export interface BatchVCFRow {
  id: string;
  chrom: string;
  pos: number;
  ref: string;
  alt: string;
  gene: string;
  hgvs: string;
  predictedImpact: string;
  status: 'Queued' | 'Analyzing' | 'Completed' | 'Flagged';
  classification?: Pathogenicity;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'PII_SCRUBBED' | 'GUARDRAIL_INTERCEPT' | 'AGENT_CONSENSUS' | 'HITL_OVERRIDE' | 'REPORT_EXPORTED';
  user: string;
  entityId: string;
  severity: 'INFO' | 'WARNING' | 'ALERT';
  message: string;
  hash: string;
}

export interface TelemetryMetric {
  agent: string;
  avgLatencyMs: number;
  tokenCount: number;
  accuracy: number;
  guardrailChecks: number;
  costUsd: number;
}
