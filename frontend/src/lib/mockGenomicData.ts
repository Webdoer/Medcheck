import { 
  VariantInterpretation, 
  BatchVCFRow, 
  AuditLogEntry, 
  TelemetryMetric 
} from '@/types/genomic';

export const QUICK_DEMO_VARIANTS: VariantInterpretation[] = [
  {
    id: 'demo-brca1',
    clinvarId: '55476',
    hgvs: 'NM_007294.4:c.5099G>A',
    gene: 'BRCA1',
    proteinChange: 'Arg1700Gln',
    cDNAChange: 'c.5099G>A',
    genomicCoords: 'chr17:43071077 (GRCh38)',
    transcript: 'NM_007294.4',
    classification: 'HITL_REQUIRED',
    confidenceScore: 78.4,
    condition: 'Hereditary Breast and Ovarian Cancer Syndrome',
    inheritance: 'Autosomal Dominant',
    alleleFrequency: '0.000018 (gnomAD v4.1)',
    dbSNP: 'rs80357474',
    inSilico: {
      revel: 0.742,
      alphaMissense: 0.812,
      cadd: 28.6,
      spliceAI: 0.04,
    },
    acmgCriteria: [
      {
        code: 'PM1',
        strength: 'Moderate',
        category: 'Pathogenic',
        met: true,
        description: 'Located in a mutational hot spot and/or critical domain (BRCT domain).',
        evidence: 'Variant resides in C-terminal BRCT domain critical for DNA repair phosphopeptide binding.'
      },
      {
        code: 'PM2',
        strength: 'Supporting',
        category: 'Pathogenic',
        met: true,
        description: 'Extremely low allele frequency in population control databases (gnomAD).',
        evidence: 'Exome frequency is 0.000018 with no homozygous individuals reported.'
      },
      {
        code: 'PP3',
        strength: 'Supporting',
        category: 'Pathogenic',
        met: true,
        description: 'Multiple lines of computational evidence support a deleterious effect on the gene.',
        evidence: 'REVEL score 0.742, AlphaMissense 0.812 (Likely Pathogenic cutoff met).'
      },
      {
        code: 'BP4',
        strength: 'Supporting',
        category: 'Benign',
        met: false,
        description: 'Multiple computational predictions suggest no impact on gene product.',
        evidence: 'In silico consensus overwhelmingly indicates deleterious consequence.'
      }
    ],
    agentSteps: [
      {
        id: 'step-1',
        agentName: 'PII & HIPAA Guardrail Agent',
        agentRole: 'Input Sanitization & Compliance',
        icon: 'ShieldCheck',
        status: 'completed',
        timestamp: '13:45:02',
        durationMs: 142,
        outputSummary: 'Input validated. No patient identifiers (MRN, Name, DOB) detected. HIPAA Safe Harbor verified.'
      },
      {
        id: 'step-2',
        agentName: 'Genomic Retrieval Agent',
        agentRole: 'NCBI ClinVar & gnomAD Knowledge Aggregator',
        icon: 'Database',
        status: 'completed',
        timestamp: '13:45:03',
        durationMs: 380,
        outputSummary: 'Retrieved ClinVar RCV000049211 (conflicting interpretations of pathogenicity: 4 Pathogenic, 2 VUS). gnomAD AF=0.000018.'
      },
      {
        id: 'step-3',
        agentName: 'ACMG Engine Agent',
        agentRole: 'Standardized 2015 Guidelines Evaluation',
        icon: 'Scale',
        status: 'completed',
        timestamp: '13:45:04',
        durationMs: 420,
        outputSummary: 'Evaluated criteria: PM1_Mod + PM2_Sup + PP3_Sup. Score on threshold border (Bayesian P=0.88).'
      },
      {
        id: 'step-4',
        agentName: 'Consensus & HITL Routing Agent',
        agentRole: 'Clinical Decision Synthesizer',
        icon: 'Cpu',
        status: 'alert',
        timestamp: '13:45:05',
        durationMs: 210,
        outputSummary: 'Ambiguous clinical submissions detected across expert submitters. Routed to Human-in-the-Loop (HITL) review queue.'
      }
    ],
    guardrailTriggered: false,
    hitlRequired: true,
    hitlStatus: 'pending',
    createdAt: '2026-10-16 13:45'
  },
  {
    id: 'demo-brca2',
    clinvarId: '12345',
    hgvs: 'NM_000059.4:c.5946delT',
    gene: 'BRCA2',
    proteinChange: 'c.5946delT',
    cDNAChange: 'c.5946delT (p.Ser1982fs)',
    genomicCoords: 'chr13:32340301 (GRCh38)',
    transcript: 'NM_000059.4',
    classification: 'PATHOGENIC',
    confidenceScore: 99.8,
    condition: 'Hereditary Breast and Ovarian Cancer Syndrome / Fanconi Anemia',
    inheritance: 'Autosomal Dominant',
    alleleFrequency: '0.000003 (gnomAD v4.1)',
    dbSNP: 'rs80359550',
    inSilico: {
      revel: 0.985,
      alphaMissense: 0.991,
      cadd: 35.0,
      spliceAI: 0.12,
    },
    acmgCriteria: [
      {
        code: 'PVS1',
        strength: 'Very Strong',
        category: 'Pathogenic',
        met: true,
        description: 'Null variant (frameshift) in a gene where LOF is a known mechanism of disease.',
        evidence: 'Single nucleotide deletion produces premature truncation downstream in exon 11.'
      },
      {
        code: 'PS4',
        strength: 'Strong',
        category: 'Pathogenic',
        met: true,
        description: 'Prevalence of variant in affected individuals is significantly increased compared with controls.',
        evidence: 'Ashkenazi Jewish founder mutation with extensive worldwide case-control validation (OR > 12.0).'
      },
      {
        code: 'PM2',
        strength: 'Supporting',
        category: 'Pathogenic',
        met: true,
        description: 'Extremely rare in healthy outbred population databases.',
        evidence: 'gnomAD global allele frequency is 0.000003.'
      }
    ],
    agentSteps: [
      {
        id: 'step-1',
        agentName: 'PII & HIPAA Guardrail Agent',
        agentRole: 'Input Sanitization & Compliance',
        icon: 'ShieldCheck',
        status: 'completed',
        timestamp: '13:40:10',
        durationMs: 110,
        outputSummary: 'PII clean. HGVS coordinate canonicalized to NM_000059.4:c.5946delT.'
      },
      {
        id: 'step-2',
        agentName: 'Genomic Retrieval Agent',
        agentRole: 'NCBI ClinVar & gnomAD Knowledge Aggregator',
        icon: 'Database',
        status: 'completed',
        timestamp: '13:40:11',
        durationMs: 310,
        outputSummary: 'Found 48 concordant Pathogenic submissions in ClinVar. Classical Ashkenazi founder variant.'
      },
      {
        id: 'step-3',
        agentName: 'ACMG Engine Agent',
        agentRole: 'Standardized 2015 Guidelines Evaluation',
        icon: 'Scale',
        status: 'completed',
        timestamp: '13:40:12',
        durationMs: 290,
        outputSummary: 'Satisfies PVS1 (Very Strong) + PS4 (Strong) + PM2 (Supporting). Definitively Pathogenic.'
      },
      {
        id: 'step-4',
        agentName: 'Consensus & HITL Routing Agent',
        agentRole: 'Clinical Decision Synthesizer',
        icon: 'Cpu',
        status: 'completed',
        timestamp: '13:40:13',
        durationMs: 180,
        outputSummary: 'High confidence classification (>99%). Auto-approved without requiring manual intervention.'
      }
    ],
    guardrailTriggered: false,
    hitlRequired: false,
    createdAt: '2026-10-16 13:40'
  },
  {
    id: 'demo-tp53-path',
    clinvarId: '12374',
    hgvs: 'NM_000546.6:c.743G>A',
    gene: 'TP53',
    proteinChange: 'Arg248Gln',
    cDNAChange: 'c.743G>A',
    genomicCoords: 'chr17:7674220 (GRCh38)',
    transcript: 'NM_000546.6',
    classification: 'PATHOGENIC',
    confidenceScore: 99.2,
    condition: 'Li-Fraumeni Syndrome / Familial Cancer Predisposition',
    inheritance: 'Autosomal Dominant',
    alleleFrequency: '0.000000 (absent in gnomAD)',
    dbSNP: 'rs28934578',
    inSilico: {
      revel: 0.941,
      alphaMissense: 0.978,
      cadd: 34.2,
      spliceAI: 0.01,
    },
    acmgCriteria: [
      {
        code: 'PS1',
        strength: 'Strong',
        category: 'Pathogenic',
        met: true,
        description: 'Same amino acid change as a previously established pathogenic variant.',
        evidence: 'Well-characterized DNA-binding domain hotspot with loss of transactivation function.'
      },
      {
        code: 'PM1',
        strength: 'Moderate',
        category: 'Pathogenic',
        met: true,
        description: 'Mutational hotspot in central core DNA-binding domain of p53.',
        evidence: 'Codon 248 is the most recurrent germline & somatic mutation in TP53.'
      },
      {
        code: 'PS3',
        strength: 'Strong',
        category: 'Pathogenic',
        met: true,
        description: 'Well-established in vitro functional studies show a damaging effect.',
        evidence: 'Abe et al. yeast functional assays confirm complete loss of transcriptional activation.'
      }
    ],
    agentSteps: [
      {
        id: 'step-1',
        agentName: 'PII & HIPAA Guardrail Agent',
        agentRole: 'Input Sanitization & Compliance',
        icon: 'ShieldCheck',
        status: 'completed',
        timestamp: '13:30:15',
        durationMs: 125,
        outputSummary: 'Verified coordinate and sanitized input context.'
      },
      {
        id: 'step-2',
        agentName: 'Genomic Retrieval Agent',
        agentRole: 'NCBI ClinVar & gnomAD Knowledge Aggregator',
        icon: 'Database',
        status: 'completed',
        timestamp: '13:30:16',
        durationMs: 340,
        outputSummary: 'Hotspot confirmed in TP53 core domain. Over 120 literature citations.'
      },
      {
        id: 'step-3',
        agentName: 'ACMG Engine Agent',
        agentRole: 'Standardized 2015 Guidelines Evaluation',
        icon: 'Scale',
        status: 'completed',
        timestamp: '13:30:17',
        durationMs: 310,
        outputSummary: 'PS1 + PS3 + PM1 + PM2 fulfilled. Absolute Pathogenic assignment.'
      },
      {
        id: 'step-4',
        agentName: 'Consensus & HITL Routing Agent',
        agentRole: 'Clinical Decision Synthesizer',
        icon: 'Cpu',
        status: 'completed',
        timestamp: '13:30:18',
        durationMs: 150,
        outputSummary: 'Consensus confidence 99.2%. Immediate clinical alert generated.'
      }
    ],
    guardrailTriggered: false,
    hitlRequired: false,
    createdAt: '2026-10-16 13:30'
  },
  {
    id: 'demo-tp53-benign',
    clinvarId: '142857',
    hgvs: 'NM_000546.6:c.324C>T',
    gene: 'TP53',
    proteinChange: 'Gly108Gly',
    cDNAChange: 'c.324C>T',
    genomicCoords: 'chr17:7676044 (GRCh38)',
    transcript: 'NM_000546.6',
    classification: 'BENIGN',
    confidenceScore: 99.5,
    condition: 'None / Polymorphism',
    inheritance: 'Not Applicable',
    alleleFrequency: '0.0482 (gnomAD v4.1)',
    dbSNP: 'rs1042522',
    inSilico: {
      revel: 0.05,
      alphaMissense: 0.02,
      cadd: 4.1,
      spliceAI: 0.00,
    },
    acmgCriteria: [
      {
        code: 'BA1',
        strength: 'Stand-alone',
        category: 'Benign',
        met: true,
        description: 'Allele frequency is >5% in ExAC or gnomAD population control database.',
        evidence: 'Exome frequency is 4.82% overall and reaches 8.1% in East Asian subpopulation.'
      },
      {
        code: 'BP7',
        strength: 'Supporting',
        category: 'Benign',
        met: true,
        description: 'A synonymous variant for which splicing prediction algorithms predict no impact.',
        evidence: 'Synonymous codon transition (Gly -> Gly), SpliceAI score is 0.00 across donor and acceptor sites.'
      }
    ],
    agentSteps: [
      {
        id: 'step-1',
        agentName: 'PII & HIPAA Guardrail Agent',
        agentRole: 'Input Sanitization & Compliance',
        icon: 'ShieldCheck',
        status: 'completed',
        timestamp: '13:20:00',
        durationMs: 95,
        outputSummary: 'Passed input validation.'
      },
      {
        id: 'step-2',
        agentName: 'Genomic Retrieval Agent',
        agentRole: 'NCBI ClinVar & gnomAD Knowledge Aggregator',
        icon: 'Database',
        status: 'completed',
        timestamp: '13:20:01',
        durationMs: 290,
        outputSummary: 'gnomAD AF=0.0482. Multiple submissions confirm common polymorphism.'
      },
      {
        id: 'step-3',
        agentName: 'ACMG Engine Agent',
        agentRole: 'Standardized 2015 Guidelines Evaluation',
        icon: 'Scale',
        status: 'completed',
        timestamp: '13:20:02',
        durationMs: 220,
        outputSummary: 'Stand-alone Benign rule BA1 triggered by high population frequency.'
      },
      {
        id: 'step-4',
        agentName: 'Consensus & HITL Routing Agent',
        agentRole: 'Clinical Decision Synthesizer',
        icon: 'Cpu',
        status: 'completed',
        timestamp: '13:20:02',
        durationMs: 110,
        outputSummary: 'Benign classification established. No clinical action required.'
      }
    ],
    guardrailTriggered: false,
    hitlRequired: false,
    createdAt: '2026-10-16 13:20'
  }
];

export const INITIAL_BATCH_VCF: BatchVCFRow[] = [
  {
    id: 'vcf-1',
    chrom: 'chr17',
    pos: 43071077,
    ref: 'G',
    alt: 'A',
    gene: 'BRCA1',
    hgvs: 'c.5099G>A',
    predictedImpact: 'Missense (p.Arg1700Gln)',
    status: 'Flagged',
    classification: 'HITL_REQUIRED'
  },
  {
    id: 'vcf-2',
    chrom: 'chr13',
    pos: 32340301,
    ref: 'TG',
    alt: 'T',
    gene: 'BRCA2',
    hgvs: 'c.5946delT',
    predictedImpact: 'Frameshift Truncation',
    status: 'Completed',
    classification: 'PATHOGENIC'
  },
  {
    id: 'vcf-3',
    chrom: 'chr17',
    pos: 7674220,
    ref: 'G',
    alt: 'A',
    gene: 'TP53',
    hgvs: 'c.743G>A',
    predictedImpact: 'Missense (p.Arg248Gln)',
    status: 'Completed',
    classification: 'PATHOGENIC'
  },
  {
    id: 'vcf-4',
    chrom: 'chr17',
    pos: 7676044,
    ref: 'C',
    alt: 'T',
    gene: 'TP53',
    hgvs: 'c.324C>T',
    predictedImpact: 'Synonymous (p.Gly108Gly)',
    status: 'Completed',
    classification: 'BENIGN'
  },
  {
    id: 'vcf-5',
    chrom: 'chr2',
    pos: 47641559,
    ref: 'C',
    alt: 'T',
    gene: 'MSH2',
    hgvs: 'c.942+3A>T',
    predictedImpact: 'Splice Region Intronic',
    status: 'Queued',
    classification: 'VUS'
  },
  {
    id: 'vcf-6',
    chrom: 'chr1',
    pos: 115256528,
    ref: 'T',
    alt: 'C',
    gene: 'NRAS',
    hgvs: 'c.182A>G',
    predictedImpact: 'Missense (p.Gln61Arg)',
    status: 'Completed',
    classification: 'PATHOGENIC'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-101',
    timestamp: '2026-10-16 13:50:22',
    eventType: 'PII_SCRUBBED',
    user: 'sys_guardrail_worker',
    entityId: 'NM_007294.4:c.5099G>A',
    severity: 'INFO',
    message: 'Scrubbed metadata header containing clinical site identifier "MGH-Onc-72". Cleaned payload stored in vault.',
    hash: '0x8f2b...c391'
  },
  {
    id: 'aud-102',
    timestamp: '2026-10-16 13:48:15',
    eventType: 'GUARDRAIL_INTERCEPT',
    user: 'sys_prompt_sentinel',
    entityId: 'REQ-9941',
    severity: 'WARNING',
    message: 'Interception triggered: Prompt injection attempt detected in raw VCF header comments. Sanitized before LLM context injection.',
    hash: '0x1d44...90e2'
  },
  {
    id: 'aud-103',
    timestamp: '2026-10-16 13:45:05',
    eventType: 'HITL_OVERRIDE',
    user: 'dr_sarah_chen_md',
    entityId: '55476',
    severity: 'ALERT',
    message: 'Variant flagged by Consensus Agent routed to geneticist review due to conflicting ClinVar submissions.',
    hash: '0x7e59...fa12'
  },
  {
    id: 'aud-104',
    timestamp: '2026-10-16 13:30:19',
    eventType: 'AGENT_CONSENSUS',
    user: 'agent_synthesis_v2',
    entityId: '12374',
    severity: 'INFO',
    message: 'Unanimous 4-agent consensus achieved for TP53 Arg248Gln: Class 5 Pathogenic (Score: 99.2%).',
    hash: '0x3c71...48a5'
  },
  {
    id: 'aud-105',
    timestamp: '2026-10-16 13:15:02',
    eventType: 'REPORT_EXPORTED',
    user: 'dr_sarah_chen_md',
    entityId: '12345',
    severity: 'INFO',
    message: 'Clinical Diagnostic Summary PDF generated and exported with cryptographic sign-off.',
    hash: '0x5b90...217c'
  }
];

export const INITIAL_TELEMETRY: TelemetryMetric[] = [
  {
    agent: 'PII & HIPAA Guardrail',
    avgLatencyMs: 112,
    tokenCount: 420,
    accuracy: 99.9,
    guardrailChecks: 1420,
    costUsd: 0.0004
  },
  {
    agent: 'Genomic Knowledge Retriever',
    avgLatencyMs: 345,
    tokenCount: 1850,
    accuracy: 98.7,
    guardrailChecks: 980,
    costUsd: 0.0018
  },
  {
    agent: 'ACMG Rule Engine',
    avgLatencyMs: 290,
    tokenCount: 2400,
    accuracy: 97.4,
    guardrailChecks: 1200,
    costUsd: 0.0024
  },
  {
    agent: 'Consensus & Clinical Synthesis',
    avgLatencyMs: 180,
    tokenCount: 1200,
    accuracy: 99.1,
    guardrailChecks: 1420,
    costUsd: 0.0012
  }
];

export const EVAL_BENCHMARK_DATA = {
  totalVariantsEvaluated: 12450,
  accuracy: 98.4,
  acmgConcordance: 97.8,
  guardrailSafetyScore: 100,
  averagePipelineLatency: '1.24s',
  benchmarks: [
    { name: 'ClinVar 2024 Gold Standard Set', variants: 5000, accuracy: '98.9%', status: 'Passed' },
    { name: 'ACMG Inter-Laboratory Challenge', variants: 1200, accuracy: '97.2%', status: 'Passed' },
    { name: 'In-Silico SpliceAI Concordance', variants: 3400, accuracy: '98.1%', status: 'Passed' },
    { name: 'Adversarial Prompt & PHI Injection Test', variants: 2850, accuracy: '100.0%', status: 'Passed' },
  ]
};
