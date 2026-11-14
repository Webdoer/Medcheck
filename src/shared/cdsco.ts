import {
  findBannedDrugMatches,
  type BannedDrugEntry,
} from './bannedDrugs.ts';

export interface CdscoAlert {
  id: string;
  medicineName: string;
  genericName: string;
  dosageForm: 'tablet' | 'syrup' | 'capsule' | 'injection' | 'drops';
  batchNumber: string;
  manufacturer: string;
  reasonCode: 'deg_contamination' | 'dissolution_fail' | 'assay_low' | 'spurious' | 'sterility_fail' | 'particulate_matter';
  reasonSummary: string;
  state: string;
  alertMonth: string;
  bulletinSource: string;
  testingLab: string;
  severity: 'nsq' | 'spurious';
}

export interface BatchDiffSegment {
  char: string;
  isDifferent: boolean;
}

export interface PossibleMatchItem {
  alert: CdscoAlert;
  matchReason: 'lookalike' | 'typo' | 'medicine_match';
  userDiff: BatchDiffSegment[];
  alertDiff: BatchDiffSegment[];
}

export interface BatchCheckResult {
  status: 'flagged' | 'possible_match' | 'not_found';
  queryMedicine: string;
  queryBatch: string;
  exactAlert?: CdscoAlert;
  bannedMatches?: BannedDrugEntry[];
  possibleMatches: PossibleMatchItem[];
  checkedAt: string;
  dataUpdatedAt: string;
}

export const CDSCO_DATA_UPDATED_AT = 'November 2026 · Monthly NSQ & Spurious Bulletin';

export const CDSCO_ALERTS: CdscoAlert[] = [
  {
    id: 'cdsco-2026-01',
    medicineName: 'Cough Care DX Syrup',
    genericName: 'Dextromethorphan Hydrobromide Syrup (100ml)',
    dosageForm: 'syrup',
    batchNumber: 'CC-8402',
    manufacturer: 'Maiden Relief Formulations Pvt. Ltd.',
    reasonCode: 'deg_contamination',
    reasonSummary: 'Diethylene Glycol (DEG) content exceeded permissible safety limit in CDSCO lab testing.',
    state: 'Uttar Pradesh',
    alertMonth: 'October 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Oct 2026 (Sr. No. 14)',
    testingLab: 'CDL Kolkata',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-02',
    medicineName: 'Guaifenesin Cough Syrup IP',
    genericName: 'Guaifenesin + Terbutaline Oral Solution',
    dosageForm: 'syrup',
    batchNumber: 'GP-2041',
    manufacturer: 'Saraswati Bio-Remedies',
    reasonCode: 'assay_low',
    reasonSummary: 'Sample failed Assay test (active ingredient found below 62% of labeled claim).',
    state: 'Uttar Pradesh',
    alertMonth: 'October 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Oct 2026 (Sr. No. 29)',
    testingLab: 'RDTL Chandigarh',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-03',
    medicineName: 'Calpol 650 Tablets (Look-alike Batch)',
    genericName: 'Paracetamol IP 650mg',
    dosageForm: 'tablet',
    batchNumber: 'KL-9021-A',
    manufacturer: 'Unverified / Suspected Spurious Batch',
    reasonCode: 'spurious',
    reasonSummary: 'Declared spurious by manufacturer inquiry; packaging and tablet weight failed IP standards.',
    state: 'Maharashtra',
    alertMonth: 'September 2026',
    bulletinSource: 'CDSCO Spurious Drug Alert · Sep 2026 (Sr. No. 04)',
    testingLab: 'CDTL Mumbai',
    severity: 'spurious',
  },
  {
    id: 'cdsco-2026-04',
    medicineName: 'Calcium + Vitamin D3 Tablets',
    genericName: 'Calcium Carbonate 500mg + Cholecalciferol',
    dosageForm: 'tablet',
    batchNumber: 'CD-8812',
    manufacturer: 'Shivalik Labs Pvt. Ltd.',
    reasonCode: 'dissolution_fail',
    reasonSummary: 'Failed Disintegration and Dissolution test in state drug laboratory screening.',
    state: 'Himachal Pradesh',
    alertMonth: 'October 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Oct 2026 (Sr. No. 41)',
    testingLab: 'RDTL Guwahati',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-05',
    medicineName: 'Azithromycin Tablets IP 500mg',
    genericName: 'Azithromycin Dihydrate IP 500mg',
    dosageForm: 'tablet',
    batchNumber: 'AZ-5540',
    manufacturer: 'Navjeevan Meditech',
    reasonCode: 'assay_low',
    reasonSummary: 'Failed Assay and Dissolution criteria for Azithromycin content.',
    state: 'Bihar',
    alertMonth: 'September 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Sep 2026 (Sr. No. 19)',
    testingLab: 'CDL Kolkata',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-06',
    medicineName: 'Pantoprazole Gastro-Resistant 40mg',
    genericName: 'Pantoprazole Sodium IP 40mg',
    dosageForm: 'tablet',
    batchNumber: 'PT-1108',
    manufacturer: 'Arogya Pharma Works',
    reasonCode: 'dissolution_fail',
    reasonSummary: 'Failed acid-resistance stage dissolution test; tablets disintegrated prematurely.',
    state: 'Madhya Pradesh',
    alertMonth: 'October 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Oct 2026 (Sr. No. 08)',
    testingLab: 'CDTL Chennai',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-07',
    medicineName: 'Amoxicillin + Clavulanate 625mg',
    genericName: 'Amoxycillin 500mg + Clavulanic Acid 125mg',
    dosageForm: 'tablet',
    batchNumber: 'AM-108B',
    manufacturer: 'Kaveri Lifesciences',
    reasonCode: 'assay_low',
    reasonSummary: 'Clavulanic acid assay significantly below standard limits due to moisture ingress.',
    state: 'Tamil Nadu',
    alertMonth: 'September 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Sep 2026 (Sr. No. 33)',
    testingLab: 'CDTL Chennai',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-08',
    medicineName: 'Metformin Hydrochloride SR 500mg',
    genericName: 'Metformin Hydrochloride Prolonged Release IP',
    dosageForm: 'tablet',
    batchNumber: 'MF-3044',
    manufacturer: 'Ganga Healthcare Formulations',
    reasonCode: 'dissolution_fail',
    reasonSummary: 'Failed 2-hour sustained-release dissolution profile.',
    state: 'West Bengal',
    alertMonth: 'August 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Aug 2026 (Sr. No. 52)',
    testingLab: 'CDL Kolkata',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-09',
    medicineName: 'Telmisartan Tablets IP 40mg',
    genericName: 'Telmisartan IP 40mg',
    dosageForm: 'tablet',
    batchNumber: 'TM-4012',
    manufacturer: 'Vindhya Pharmaceuticals',
    reasonCode: 'assay_low',
    reasonSummary: 'Sample failed Uniformity of Weight and Assay specifications.',
    state: 'Rajasthan',
    alertMonth: 'October 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Oct 2026 (Sr. No. 37)',
    testingLab: 'IPC Ghaziabad',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-10',
    medicineName: 'Paracetamol Oral Suspension IP',
    genericName: 'Paracetamol Paediatric Oral Suspension 125mg/5ml',
    dosageForm: 'syrup',
    batchNumber: 'PCM-650-X',
    manufacturer: 'Deccan Cure Formulations',
    reasonCode: 'particulate_matter',
    reasonSummary: 'Presence of visible suspended foreign particles and incorrect pH level.',
    state: 'Telangana',
    alertMonth: 'September 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Sep 2026 (Sr. No. 25)',
    testingLab: 'CDTL Hyderabad',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-11',
    medicineName: 'Ciprofloxacin Tablets IP 500mg',
    genericName: 'Ciprofloxacin Hydrochloride IP 500mg',
    dosageForm: 'tablet',
    batchNumber: 'CF-2219',
    manufacturer: 'Eastern Drug House',
    reasonCode: 'dissolution_fail',
    reasonSummary: 'Failed Dissolution test in CDSCO state surveillance sampling.',
    state: 'Odisha',
    alertMonth: 'August 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Aug 2026 (Sr. No. 11)',
    testingLab: 'CDL Kolkata',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-12',
    medicineName: 'Montelukast + Levocetirizine',
    genericName: 'Montelukast Sodium 10mg + Levocetirizine 5mg',
    dosageForm: 'tablet',
    batchNumber: 'MK-6104',
    manufacturer: 'Apex Remedies (Unlicensed Label)',
    reasonCode: 'spurious',
    reasonSummary: 'Reported spurious; actual manufacturer confirmed batch code was never produced.',
    state: 'Gujarat',
    alertMonth: 'October 2026',
    bulletinSource: 'CDSCO Spurious Drug Alert · Oct 2026 (Sr. No. 02)',
    testingLab: 'CDTL Mumbai',
    severity: 'spurious',
  },
  {
    id: 'cdsco-2026-13',
    medicineName: 'Cefixime Oral Suspension IP',
    genericName: 'Cefixime Trihydrate 50mg/5ml',
    dosageForm: 'syrup',
    batchNumber: 'CX-091I',
    manufacturer: 'Pratap Medilabs',
    reasonCode: 'assay_low',
    reasonSummary: 'Failed Assay test after reconstitution.',
    state: 'Punjab',
    alertMonth: 'September 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Sep 2026 (Sr. No. 44)',
    testingLab: 'RDTL Chandigarh',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-14',
    medicineName: 'Diclofenac Sodium Injection IP',
    genericName: 'Diclofenac Sodium 25mg/ml',
    dosageForm: 'injection',
    batchNumber: 'DC-5082',
    manufacturer: 'Bharati Parenterals',
    reasonCode: 'sterility_fail',
    reasonSummary: 'Failed Sterility and Particulate Matter inspection.',
    state: 'Karnataka',
    alertMonth: 'August 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Aug 2026 (Sr. No. 06)',
    testingLab: 'CDTL Chennai',
    severity: 'nsq',
  },
  {
    id: 'cdsco-2026-15',
    medicineName: 'Omeprazole Capsules IP 20mg',
    genericName: 'Omeprazole Enteric Coated Capsules 20mg',
    dosageForm: 'capsule',
    batchNumber: 'OM-4019',
    manufacturer: 'Narmada Biopharma',
    reasonCode: 'dissolution_fail',
    reasonSummary: 'Enteric coating failed buffer stage dissolution.',
    state: 'Maharashtra',
    alertMonth: 'September 2026',
    bulletinSource: 'CDSCO NSQ Alert List · Sep 2026 (Sr. No. 28)',
    testingLab: 'CDTL Mumbai',
    severity: 'nsq',
  },
];

export function normalizeBatchCode(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/^(B\.?\s*NO\.?|BATCH\s*NO\.?|BATCH|LOT)\s*[:#-]?\s*/i, '')
    .replace(/[^A-Z0-9]/g, '');
}

export function confusableBatchKey(normalized: string): string {
  return normalized
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')
    .replace(/S/g, '5')
    .replace(/B/g, '8')
    .replace(/Z/g, '2');
}

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function computeBatchDiff(userInput: string, alertBatch: string): {
  userDiff: BatchDiffSegment[];
  alertDiff: BatchDiffSegment[];
} {
  const uClean = userInput.toUpperCase().replace(/^#/, '').trim();
  const aClean = alertBatch.toUpperCase().replace(/^#/, '').trim();
  const maxLen = Math.max(uClean.length, aClean.length);

  const userDiff: BatchDiffSegment[] = [];
  const alertDiff: BatchDiffSegment[] = [];

  for (let i = 0; i < maxLen; i++) {
    const uc = uClean[i];
    const ac = aClean[i];
    const diff = uc !== ac;
    if (uc !== undefined) {
      userDiff.push({ char: uc, isDifferent: diff });
    }
    if (ac !== undefined) {
      alertDiff.push({ char: ac, isDifferent: diff });
    }
  }

  return { userDiff, alertDiff };
}

function medicineTokenOverlap(queryMed: string, alert: CdscoAlert): number {
  const qTokens = queryMed
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3);
  if (qTokens.length === 0) return 0;

  const targetText = `${alert.medicineName} ${alert.genericName}`.toLowerCase();
  let matches = 0;
  for (const token of qTokens) {
    if (targetText.includes(token)) {
      matches++;
    }
  }
  return matches / qTokens.length;
}

export function checkMedicineBatch(
  medicineQuery: string,
  batchQuery: string,
  alerts: CdscoAlert[] = CDSCO_ALERTS,
  genericQuery = ''
): BatchCheckResult {
  const trimmedMed = medicineQuery.trim();
  const trimmedBatch = batchQuery.trim();
  const trimmedGeneric = genericQuery.trim();
  const normBatch = normalizeBatchCode(trimmedBatch);
  const confusableInput = confusableBatchKey(normBatch);
  const bannedMatches = findBannedDrugMatches(trimmedMed, trimmedGeneric);

  // 1. Check exact batch match
  if (normBatch.length >= 3) {
    for (const alert of alerts) {
      const alertNorm = normalizeBatchCode(alert.batchNumber);
      if (alertNorm === normBatch) {
        return {
          status: 'flagged',
          queryMedicine: trimmedMed || alert.medicineName,
          queryBatch: trimmedBatch || alert.batchNumber,
          exactAlert: alert,
          ...(bannedMatches.length > 0 ? { bannedMatches } : {}),
          possibleMatches: [],
          checkedAt: new Date().toISOString(),
          dataUpdatedAt: CDSCO_DATA_UPDATED_AT,
        };
      }
    }
  }

  // 1b. Check Section 26A Prohibited / Banned Drugs (444 Gazette Entries)
  if (bannedMatches.length > 0) {
    return {
      status: 'flagged',
      queryMedicine: trimmedMed || bannedMatches[0].name,
      queryBatch: trimmedBatch || `Section 26A · Sr. No. ${bannedMatches[0].srNo}`,
      bannedMatches,
      possibleMatches: [],
      checkedAt: new Date().toISOString(),
      dataUpdatedAt: CDSCO_DATA_UPDATED_AT,
    };
  }

  // 2. Check possible matches: look-alikes, small edit distance (<= 2), or medicine name + partial batch
  const possibleMatches: PossibleMatchItem[] = [];
  const seenIds = new Set<string>();

  for (const alert of alerts) {
    const alertNorm = normalizeBatchCode(alert.batchNumber);
    const alertConfusable = confusableBatchKey(alertNorm);
    const medScore = trimmedMed ? medicineTokenOverlap(trimmedMed, alert) : 0;

    if (normBatch.length >= 3) {
      if (confusableInput === alertConfusable) {
        seenIds.add(alert.id);
        const diff = computeBatchDiff(trimmedBatch, alert.batchNumber);
        possibleMatches.push({
          alert,
          matchReason: 'lookalike',
          ...diff,
        });
        continue;
      }

      const dist = levenshteinDistance(normBatch, alertNorm);
      const maxAllowed = normBatch.length >= 6 ? 2 : 1;
      if (dist > 0 && dist <= maxAllowed) {
        seenIds.add(alert.id);
        const diff = computeBatchDiff(trimmedBatch, alert.batchNumber);
        possibleMatches.push({
          alert,
          matchReason: 'typo',
          ...diff,
        });
        continue;
      }

      // Prefix / substring partial match with medicine name confirmation
      if (
        medScore >= 0.5 &&
        (alertNorm.startsWith(normBatch) || normBatch.startsWith(alertNorm))
      ) {
        seenIds.add(alert.id);
        const diff = computeBatchDiff(trimmedBatch, alert.batchNumber);
        possibleMatches.push({
          alert,
          matchReason: 'medicine_match',
          ...diff,
        });
        continue;
      }
    } else if (trimmedMed.length >= 3 && medScore >= 0.5 && !seenIds.has(alert.id)) {
      // User searched only by medicine name without batch number
      seenIds.add(alert.id);
      const diff = computeBatchDiff(trimmedBatch || '—', alert.batchNumber);
      possibleMatches.push({
        alert,
        matchReason: 'medicine_match',
        ...diff,
      });
    }
  }

  if (possibleMatches.length > 0) {
    return {
      status: 'possible_match',
      queryMedicine: trimmedMed || possibleMatches[0].alert.medicineName,
      queryBatch: trimmedBatch || 'Not entered',
      possibleMatches,
      checkedAt: new Date().toISOString(),
      dataUpdatedAt: CDSCO_DATA_UPDATED_AT,
    };
  }

  // 3. Not found in CDSCO alert list
  return {
    status: 'not_found',
    queryMedicine: trimmedMed || 'Medicine Strip',
    queryBatch: trimmedBatch || 'Not specified',
    possibleMatches: [],
    checkedAt: new Date().toISOString(),
    dataUpdatedAt: CDSCO_DATA_UPDATED_AT,
  };
}
