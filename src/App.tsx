import React, { useEffect, useState } from 'react';
import {
  Home,
  Camera,
  History,
  ShieldCheck,
  Languages,
  Loader2,
  HeartHandshake,
} from 'lucide-react';
import {
  CDSCO_ALERTS,
  CDSCO_DATA_UPDATED_AT,
  checkMedicineBatch,
  type BatchCheckResult,
  type CdscoAlert,
} from './shared/cdsco';
import {
  BANNED_DRUGS_SOURCE_TITLE,
  type BannedDrugEntry,
} from './shared/bannedDrugs';
import { TRANSLATIONS, LANGUAGES, type LanguageCode } from './i18n/translations';
import {
  loadPreferences,
  savePreferences,
  loadHistory,
  addHistoryRecord,
  deleteHistoryRecord,
  clearAllHistory,
  type UserPreferences,
  type HistoryRecord,
} from './utils/storage';
import { LanguageOnboarding } from './components/LanguageOnboarding';
import { HomeView } from './components/HomeView';
import { ScanView } from './components/ScanView';
import { ResultView } from './components/ResultView';
import { HistoryView } from './components/HistoryView';
import { HelpPrivacyView } from './components/HelpPrivacyView';
import { OfflineIndicator } from './components/PWAInstallButton';

type ActiveTab = 'home' | 'scan' | 'history' | 'help';
type ScreenState = 'tab' | 'checking' | 'result';

export default function App() {
  const [prefs, setPrefs] = useState<UserPreferences>(() => loadPreferences());
  const [showLanguagePicker, setShowLanguagePicker] = useState<boolean>(
    () => !loadPreferences().hasCompletedOnboarding
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [screenState, setScreenState] = useState<ScreenState>('tab');

  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [autoSample, setAutoSample] = useState(false);

  const [alerts, setAlerts] = useState<CdscoAlert[]>(CDSCO_ALERTS);
  const [dataUpdatedAt, setDataUpdatedAt] = useState<string>(CDSCO_DATA_UPDATED_AT);
  const [currentResult, setCurrentResult] = useState<BatchCheckResult | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>(() => loadHistory());

  const t = TRANSLATIONS[prefs.language];

  useEffect(() => {
    savePreferences(prefs);
  }, [prefs]);

  // Sync live CDSCO alerts from Express server when online
  useEffect(() => {
    let cancelled = false;
    fetch('/api/alerts')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { alerts?: CdscoAlert[]; dataUpdatedAt?: string } | null) => {
        if (!cancelled && data?.alerts && Array.isArray(data.alerts)) {
          setAlerts(data.alerts);
          if (data.dataUpdatedAt) setDataUpdatedAt(data.dataUpdatedAt);
        }
      })
      .catch(() => {
        // Offline or unreachable — bundled CDSCO_ALERTS remains active
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateLanguage = (lang: LanguageCode) => {
    setPrefs((prev) => ({ ...prev, language: lang }));
  };

  const handleCompleteOnboarding = () => {
    setPrefs((prev) => ({ ...prev, hasCompletedOnboarding: true }));
    setShowLanguagePicker(false);
  };

  const runBatchVerification = async (
    medicineName: string,
    batchNumber: string,
    genericName = ''
  ) => {
    setScreenState('checking');

    let result: BatchCheckResult;
    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName, batchNumber, genericName }),
      });

      if (response.ok) {
        result = (await response.json()) as BatchCheckResult;
      } else {
        result = checkMedicineBatch(medicineName, batchNumber, alerts, genericName);
      }
    } catch {
      // Offline fallback uses the exact same local matcher
      result = checkMedicineBatch(medicineName, batchNumber, alerts, genericName);
    }

    // Brief gentle pause so the user perceives calm verification cadence
    setTimeout(() => {
      setCurrentResult(result);
      setHistory(addHistoryRecord(result));
      setScreenState('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 550);
  };

  const handleOpenAlertDetail = (alert: CdscoAlert) => {
    const result: BatchCheckResult = {
      status: 'flagged',
      queryMedicine: alert.medicineName,
      queryBatch: alert.batchNumber,
      exactAlert: alert,
      possibleMatches: [],
      checkedAt: new Date().toISOString(),
      dataUpdatedAt,
    };
    setCurrentResult(result);
    setScreenState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBannedDrugDetail = (entry: BannedDrugEntry) => {
    const result: BatchCheckResult = {
      status: 'flagged',
      queryMedicine: entry.name,
      queryBatch: `Section 26A · Sr. No. ${entry.srNo}`,
      bannedMatches: [entry],
      possibleMatches: [],
      checkedAt: new Date().toISOString(),
      dataUpdatedAt: BANNED_DRUGS_SOURCE_TITLE,
    };
    setCurrentResult(result);
    setScreenState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmPossibleMatch = (alert: CdscoAlert) => {
    if (!currentResult) return;
    const confirmed: BatchCheckResult = {
      status: 'flagged',
      queryMedicine: currentResult.queryMedicine,
      queryBatch: alert.batchNumber,
      exactAlert: alert,
      possibleMatches: [],
      checkedAt: new Date().toISOString(),
      dataUpdatedAt,
    };
    setCurrentResult(confirmed);
    setHistory(addHistoryRecord(confirmed));
  };

  const handleRejectPossibleMatch = () => {
    if (!currentResult) return;
    const rejected: BatchCheckResult = {
      status: 'not_found',
      queryMedicine: currentResult.queryMedicine,
      queryBatch: currentResult.queryBatch,
      possibleMatches: [],
      checkedAt: new Date().toISOString(),
      dataUpdatedAt,
    };
    setCurrentResult(rejected);
    setHistory(addHistoryRecord(rejected));
  };

  if (showLanguagePicker) {
    return (
      <div className={prefs.highContrast ? 'high-contrast-mode' : ''}>
        <LanguageOnboarding
          selectedLanguage={prefs.language}
          voiceSpeed={prefs.voiceSpeed}
          onSelectLanguage={updateLanguage}
          onContinue={handleCompleteOnboarding}
        />
      </div>
    );
  }

  const activeLangMeta = LANGUAGES.find((l) => l.code === prefs.language);

  const navigateTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setScreenState('tab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-surface text-on-surface ${
        prefs.highContrast ? 'high-contrast-mode' : ''
      }`}
    >
      {/* Top App Bar (Clean 3-zone contract, <=56px height) */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 pt-safe">
        <OfflineIndicator message={t.offlineBanner} />
        <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigateTab('home')}
            className="text-lg font-bold tracking-tight text-primary whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.appName}
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {(
              [
                { id: 'home', label: t.navHome },
                { id: 'scan', label: t.navScan },
                { id: 'history', label: t.navHistory },
                { id: 'help', label: t.navHelp },
              ] as const
            ).map((item) => {
              const active = activeTab === item.id && screenState === 'tab';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTab(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'text-primary font-semibold border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setShowLanguagePicker(true)}
              className="min-h-[40px] px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Languages className="w-4 h-4 shrink-0" />
              <span>{activeLangMeta?.nativeName ?? 'हिंदी'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-10">
        {screenState === 'checking' && (
          <div className="max-w-lg mx-auto py-12 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-primary">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-on-surface">{t.checkingHeading}</h1>
              <p className="text-sm text-on-surface-variant">{t.checkingSub}</p>
            </div>
            <div className="rounded-2xl bg-secondary-container/50 p-4 flex items-center gap-3 text-left">
              <HeartHandshake className="w-6 h-6 text-secondary shrink-0" />
              <div>
                <p className="text-sm font-bold text-on-secondary-fixed">{t.stayCalmTitle}</p>
                <p className="text-xs text-on-secondary-container mt-0.5">{t.stayCalmBody}</p>
              </div>
            </div>
          </div>
        )}

        {screenState === 'result' && currentResult && (
          <ResultView
            t={t}
            language={prefs.language}
            voiceSpeed={prefs.voiceSpeed}
            result={currentResult}
            onConfirmPossibleMatch={handleConfirmPossibleMatch}
            onRejectPossibleMatch={handleRejectPossibleMatch}
            onCheckAnother={() => {
              setScanMode('camera');
              setActiveTab('scan');
              setScreenState('tab');
            }}
            onBack={() => {
              setScreenState('tab');
            }}
          />
        )}

        {screenState === 'tab' && activeTab === 'home' && (
          <HomeView
            t={t}
            language={prefs.language}
            alerts={alerts}
            dataUpdatedAt={dataUpdatedAt}
            onGoToScan={(mode, triggerSample) => {
              setScanMode(mode);
              setAutoSample(Boolean(triggerSample));
              setActiveTab('scan');
              setScreenState('tab');
            }}
            onDirectCheck={(med, batch, generic) => {
              runBatchVerification(med, batch, generic);
            }}
            onOpenAlertDetail={handleOpenAlertDetail}
            onOpenBannedDrugDetail={handleOpenBannedDrugDetail}
          />
        )}

        {screenState === 'tab' && activeTab === 'scan' && (
          <ScanView
            t={t}
            initialMode={scanMode}
            autoTriggerSample={autoSample}
            onConsumeAutoSample={() => setAutoSample(false)}
            onVerify={(med, batch, generic) => runBatchVerification(med, batch, generic)}
            onBack={() => navigateTab('home')}
          />
        )}

        {screenState === 'tab' && activeTab === 'history' && (
          <HistoryView
            t={t}
            records={history}
            onOpenRecord={(res) => {
              setCurrentResult(res);
              setScreenState('result');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDeleteRecord={(id) => setHistory(deleteHistoryRecord(id))}
            onClearAll={() => setHistory(clearAllHistory())}
            onGoToScan={() => {
              setScanMode('camera');
              navigateTab('scan');
            }}
          />
        )}

        {screenState === 'tab' && activeTab === 'help' && (
          <HelpPrivacyView
            t={t}
            dataUpdatedAt={dataUpdatedAt}
            voiceSpeed={prefs.voiceSpeed}
            highContrast={prefs.highContrast}
            onChangeVoiceSpeed={(speed) =>
              setPrefs((prev) => ({ ...prev, voiceSpeed: speed }))
            }
            onToggleHighContrast={() =>
              setPrefs((prev) => ({ ...prev, highContrast: !prev.highContrast }))
            }
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar (hidden on md+, height 64px so header+nav <= 15% mobile height) */}
      <nav
        aria-label="Primary Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 pb-safe"
      >
        <div className="grid grid-cols-4 h-16 items-center px-1">
          {(
            [
              { id: 'home', label: t.navHome, Icon: Home },
              { id: 'scan', label: t.navScan, Icon: Camera },
              { id: 'history', label: t.navHistory, Icon: History },
              { id: 'help', label: t.navHelp, Icon: ShieldCheck },
            ] as const
          ).map(({ id, label, Icon }) => {
            const active = activeTab === id && screenState === 'tab';
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigateTab(id)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 px-1 transition-colors cursor-pointer ${
                  active ? 'text-primary font-semibold' : 'text-on-surface-variant'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] leading-tight truncate max-w-full">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
