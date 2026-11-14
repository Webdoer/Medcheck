import React, { useMemo, useState } from 'react';
import {
  Camera,
  Keyboard,
  Search,
  Mic,
  ArrowRight,
  ChevronRight,
  Phone,
  Lock,
  ShieldAlert,
  Sparkles,
  Ban,
} from 'lucide-react';
import type { CdscoAlert } from '../shared/cdsco';
import { BANNED_DRUGS, type BannedDrugEntry } from '../shared/bannedDrugs';
import type { TranslationBundle, LanguageCode } from '../i18n/translations';
import { MEDIA } from '../assets/media';
import { useSpeechRecognition } from '../hooks/useSpeech';

interface HomeViewProps {
  t: TranslationBundle;
  language: LanguageCode;
  alerts: CdscoAlert[];
  dataUpdatedAt: string;
  onGoToScan: (mode: 'camera' | 'manual', autoSample?: boolean) => void;
  onDirectCheck: (medicineName: string, batchNumber: string, genericName?: string) => void;
  onOpenAlertDetail: (alert: CdscoAlert) => void;
  onOpenBannedDrugDetail: (entry: BannedDrugEntry) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  t,
  language,
  alerts,
  dataUpdatedAt,
  onGoToScan,
  onDirectCheck,
  onOpenAlertDetail,
  onOpenBannedDrugDetail,
}) => {
  const [searchText, setSearchText] = useState('');
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [activeFeedTab, setActiveFeedTab] = useState<'batches' | 'banned'>('batches');
  const [bannedQuery, setBannedQuery] = useState('');
  const [bannedLimit, setBannedLimit] = useState(15);
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const [stripImgError, setStripImgError] = useState(false);
  const { isListening, startListening } = useSpeechRecognition(language);

  const parseAndSubmit = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) return;

    // If user typed "Name, Batch" split them cleanly.
    if (cleaned.includes(',')) {
      const [med, ...rest] = cleaned.split(',');
      const medPart = med.trim();
      onDirectCheck(medPart, rest.join(',').trim(), medPart);
      return;
    }

    const looksLikeBatch = /^[A-Z0-9-]{3,16}$/i.test(cleaned) && /\d/.test(cleaned);
    if (looksLikeBatch) {
      onDirectCheck('', cleaned, '');
    } else {
      onDirectCheck(cleaned, /\d/.test(cleaned) && !cleaned.includes('+') ? cleaned : '', cleaned);
    }
  };

  const handleVoiceSearch = () => {
    setVoiceMessage(null);
    startListening(
      (transcript) => {
        setSearchText(transcript);
        parseAndSubmit(transcript);
      },
      () => {
        setVoiceMessage(t.voiceNotSupported);
        setTimeout(() => setVoiceMessage(null), 4000);
      }
    );
  };

  const visibleAlerts = showAllAlerts ? alerts : alerts.slice(0, 3);

  const filteredBanned = useMemo(() => {
    const q = bannedQuery.trim().toLowerCase();
    if (!q) return BANNED_DRUGS;
    return BANNED_DRUGS.filter(
      (entry) =>
        entry.name.toLowerCase().includes(q) ||
        entry.notification.toLowerCase().includes(q) ||
        String(entry.srNo) === q
    );
  }, [bannedQuery]);

  const visibleBanned = filteredBanned.slice(0, bannedLimit);

  const getLegalStar = (note?: BannedDrugEntry['legalNote']) => {
    if (note === 'madras_stay') return '*';
    if (note === 'cancer_pain_conditions') return '**';
    if (note === 'delhi_hc_quashed_slp') return '***';
    return '';
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Greeting & Freshness Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-[22px] sm:text-[26px] font-bold text-on-surface tracking-tight text-balance">
          {t.homeGreeting}
        </h1>
        <p className="text-xs font-medium text-on-surface-variant">
          {t.dataUpdatedPrefix} {dataUpdatedAt} · {alerts.length} {t.batchesTrackedSuffix} · {BANNED_DRUGS.length} Sec. 26A
        </p>
      </div>

      {/* Desktop 2-column balanced layout: Hero + Search on left, Safety Lists on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* Primary Hero Action Card */}
          <section className="rounded-[24px] bg-gradient-to-br from-primary/10 via-surface-container-low to-primary-fixed/25 p-5 sm:p-6 shadow-[0_8px_24px_-4px_rgba(56,100,88,0.1)]">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-primary tracking-wide mb-1">
                  {t.heroLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface leading-snug">
                  {t.heroTitle}
                </h2>
                <p className="text-[15px] text-on-surface-variant mt-1.5 leading-relaxed">
                  {t.heroSub}
                </p>
              </div>

              <div className="shrink-0 w-20 h-20 rounded-2xl bg-surface-container-lowest p-1 shadow-sm overflow-hidden hidden xs:flex sm:flex items-center justify-center">
                {!stripImgError ? (
                  <img
                    src={MEDIA.sampleBlister}
                    alt="Medicine blister strip showing printed batch number"
                    referrerPolicy="no-referrer"
                    onError={() => setStripImgError(true)}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onGoToScan('camera')}
                className="min-h-[52px] px-5 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary text-base font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <Camera className="w-5 h-5 shrink-0" />
                <span>{t.scanCameraBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => onGoToScan('manual')}
                className="min-h-[52px] px-5 py-3 rounded-full bg-surface-container-lowest hover:bg-surface-container text-secondary text-base font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <Keyboard className="w-5 h-5 shrink-0" />
                <span>{t.manualEntryBtn}</span>
              </button>
            </div>

            <div className="mt-3 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => onGoToScan('camera', true)}
                className="min-h-[40px] inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.trySampleBtn}</span>
              </button>
            </div>
          </section>

          {/* Direct Search & Speech Input */}
          <section className="flex flex-col space-y-2">
            <label
              htmlFor="direct-batch-search"
              className="text-sm font-semibold text-on-surface-variant px-1"
            >
              {t.directSearchLabel}
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                parseAndSubmit(searchText);
              }}
              className="relative flex items-center w-full"
            >
              <Search className="w-5 h-5 text-outline absolute left-4 pointer-events-none" />
              <input
                id="direct-batch-search"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t.directSearchPlaceholder}
                className="w-full min-h-[56px] pl-12 pr-28 rounded-full bg-surface-container-lowest border border-outline-variant/60 text-on-surface placeholder:text-outline text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  aria-label="Voice Search"
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-primary text-on-primary animate-pulse'
                      : 'bg-secondary-container text-on-secondary-fixed hover:bg-secondary-fixed'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  aria-label="Check Batch"
                  className="w-11 h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            {isListening && (
              <p className="text-xs font-medium text-secondary px-2">{t.voiceListening}</p>
            )}
            {voiceMessage && (
              <p className="text-xs font-medium text-possible-ink px-2">{voiceMessage}</p>
            )}

            {/* Interactive Sample Check Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 px-1">
              <span className="text-xs text-on-surface-variant font-medium">
                {t.quickExamplesLabel}
              </span>
              {[
                { label: 'CC-8402', med: 'Cough Care DX', batch: 'CC-8402', generic: '' },
                { label: 'KL-9021-B', med: 'Calpol 650', batch: 'KL-9021-B', generic: '' },
                { label: 'PCM-500-SAFE', med: 'Paracetamol 500', batch: 'PCM-500-SAFE', generic: 'Paracetamol IP' },
                { label: 'Rofecoxib', med: 'Rofecoxib', batch: '', generic: 'Rofecoxib' },
              ].map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => onDirectCheck(sample.med, sample.batch, sample.generic)}
                  className="min-h-[36px] px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-mono font-semibold text-secondary transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </section>

          {/* Privacy Promise & Helpline Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-[20px] bg-primary-fixed/30 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary">{t.privacyCardTitle}</p>
                <p className="text-xs text-on-primary-fixed-variant leading-relaxed mt-0.5">
                  {t.privacyCardBody}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[20px] bg-surface-container flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant">{t.helplineBannerLabel}</p>
                <p className="text-lg font-bold font-mono text-on-surface tracking-wide mt-0.5">
                  1800-11-4477
                </p>
              </div>
              <a
                href="tel:1800114477"
                className="min-h-[44px] px-4 py-2 rounded-full bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>{t.callNow}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Government Safety Lists (Batch Alerts + 444 Section 26A Banned Drugs) */}
        <section className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 min-w-0">
              {activeFeedTab === 'batches' ? (
                <ShieldAlert className="w-5 h-5 text-flagged-accent shrink-0" />
              ) : (
                <Ban className="w-5 h-5 text-flagged-accent shrink-0" />
              )}
              <h2 className="text-[18px] font-semibold text-on-surface truncate">
                {t.recentAlertsTitle}
              </h2>
            </div>

            {activeFeedTab === 'batches' && (
              <button
                type="button"
                onClick={() => setShowAllAlerts((prev) => !prev)}
                className="min-h-[40px] px-2 text-sm font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{showAllAlerts ? t.showFewerAlerts : t.viewAllAlerts}</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${showAllAlerts ? 'rotate-90' : ''}`}
                />
              </button>
            )}
          </div>

          {/* 2-Option Segmented Toggle: Batch Alerts | Banned Drugs (444) */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-surface-container-high gap-1">
            <button
              type="button"
              onClick={() => setActiveFeedTab('batches')}
              className={`min-h-[40px] px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer truncate ${
                activeFeedTab === 'batches'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.batchAlertsTab} ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFeedTab('banned')}
              className={`min-h-[40px] px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer truncate ${
                activeFeedTab === 'banned'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.bannedDrugsTab}
            </button>
          </div>

          {activeFeedTab === 'batches' ? (
            <div className="flex flex-col space-y-3">
              {visibleAlerts.map((alert) => (
                <button
                  key={alert.id}
                  type="button"
                  onClick={() => onOpenAlertDetail(alert)}
                  className="w-full text-left p-4 rounded-[20px] bg-surface-container-lowest border border-outline-variant/40 hover:bg-flagged-bg/40 transition-colors shadow-[0_2px_10px_rgba(43,58,74,0.03)] cursor-pointer flex flex-col space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-on-surface leading-snug">
                        {alert.medicineName}
                      </h3>
                      <p className="text-xs font-mono font-semibold text-flagged-accent mt-0.5">
                        {t.batchNumberLabel}: {alert.batchNumber}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-flagged-accent shrink-0">
                      {alert.severity === 'spurious' ? 'Spurious' : 'NSQ'}
                    </span>
                  </div>

                  <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                    {alert.reasonSummary}
                  </p>

                  <div className="flex items-center justify-between text-xs text-outline pt-1">
                    <span>
                      {alert.state} · {alert.alertMonth}
                    </span>
                    <span className="text-primary font-semibold flex items-center gap-0.5">
                      {t.viewDetailsBtn}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              {/* Filter Input for 444 Banned Drugs */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={bannedQuery}
                  onChange={(e) => {
                    setBannedQuery(e.target.value);
                    setBannedLimit(15);
                  }}
                  placeholder={t.bannedSearchPlaceholder}
                  aria-label={t.bannedSearchPlaceholder}
                  className="w-full min-h-[44px] pl-10 pr-4 rounded-full bg-surface-container-lowest border border-outline-variant/60 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                />
              </div>

              {filteredBanned.length === 0 ? (
                <div className="p-5 rounded-[20px] bg-surface-container-low text-center text-sm text-on-surface-variant">
                  {t.bannedNoMatches}
                </div>
              ) : (
                <div className="flex flex-col space-y-2.5">
                  {visibleBanned.map((entry) => {
                    const star = getLegalStar(entry.legalNote);
                    return (
                      <button
                        key={entry.srNo}
                        type="button"
                        onClick={() => onOpenBannedDrugDetail(entry)}
                        className="w-full text-left p-3.5 rounded-[18px] bg-surface-container-lowest border border-outline-variant/40 hover:bg-flagged-bg/40 transition-colors shadow-[0_2px_10px_rgba(43,58,74,0.03)] cursor-pointer flex flex-col space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-on-surface leading-snug">
                            <span className="font-mono text-flagged-accent mr-1.5">
                              #{entry.srNo}
                            </span>
                            {entry.name}
                          </h3>
                          {star && (
                            <span className="text-xs font-mono font-bold text-possible-accent shrink-0">
                              {star}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs text-outline pt-0.5">
                          <span className="font-mono truncate">{entry.notification}</span>
                          <span className="text-primary font-semibold flex items-center gap-0.5 shrink-0">
                            {t.viewDetailsBtn}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {filteredBanned.length > visibleBanned.length && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setBannedLimit((prev) => prev + 30)}
                        className="flex-1 min-h-[44px] px-4 rounded-full bg-surface-container-high hover:bg-surface-dim text-on-surface text-xs font-semibold cursor-pointer"
                      >
                        {t.showMoreBannedBtn} ({visibleBanned.length}/{filteredBanned.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannedLimit(filteredBanned.length)}
                        className="min-h-[44px] px-4 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold cursor-pointer whitespace-nowrap"
                      >
                        {t.showAllBannedBtn} ({filteredBanned.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
