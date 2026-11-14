import type { BatchCheckResult } from '../shared/cdsco';
import type { LanguageCode } from '../i18n/translations';

export interface UserPreferences {
  language: LanguageCode;
  voiceSpeed: 0.8 | 1.0 | 1.2;
  highContrast: boolean;
  hasCompletedOnboarding: boolean;
}

export interface HistoryRecord {
  id: string;
  medicineName: string;
  batchNumber: string;
  status: 'flagged' | 'possible_match' | 'not_found';
  result: BatchCheckResult;
  checkedAt: string;
}

const PREFS_KEY = 'medcheck_prefs_v1';
const HISTORY_KEY = 'medcheck_history_v1';

const DEFAULT_PREFS: UserPreferences = {
  language: 'hi',
  voiceSpeed: 1.0,
  highContrast: false,
  hasCompletedOnboarding: false,
};

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      language: parsed.language ?? DEFAULT_PREFS.language,
      voiceSpeed: parsed.voiceSpeed ?? DEFAULT_PREFS.voiceSpeed,
      highContrast: Boolean(parsed.highContrast),
      hasCompletedOnboarding: Boolean(parsed.hasCompletedOnboarding),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addHistoryRecord(result: BatchCheckResult): HistoryRecord[] {
  const current = loadHistory();
  const entry: HistoryRecord = {
    id: `chk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    medicineName: result.exactAlert?.medicineName || result.queryMedicine,
    batchNumber: result.exactAlert?.batchNumber || result.queryBatch,
    status: result.status,
    result,
    checkedAt: result.checkedAt,
  };
  const updated = [entry, ...current].slice(0, 50);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}

export function deleteHistoryRecord(id: string): HistoryRecord[] {
  const updated = loadHistory().filter((item) => item.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  return updated;
}

export function clearAllHistory(): HistoryRecord[] {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore
  }
  return [];
}
