import React, { useState } from 'react';
import {
  Trash2,
  ChevronRight,
  Lock,
  AlertTriangle,
  SearchCheck,
  HelpCircle,
  QrCode,
} from 'lucide-react';
import type { HistoryRecord } from '../utils/storage';
import type { BatchCheckResult } from '../shared/cdsco';
import type { TranslationBundle } from '../i18n/translations';

interface HistoryViewProps {
  t: TranslationBundle;
  records: HistoryRecord[];
  onOpenRecord: (result: BatchCheckResult) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onGoToScan: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  t,
  records,
  onOpenRecord,
  onDeleteRecord,
  onClearAll,
  onGoToScan,
}) => {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'possible_match' | 'not_found'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredRecords = records.filter((rec) =>
    filter === 'all' ? true : rec.status === filter
  );

  const formatTime = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex flex-col space-y-5 max-w-4xl mx-auto w-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-on-surface">{t.historyTitle}</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">{t.historySub}</p>
        </div>
        <span className="text-sm font-semibold text-secondary tabular-nums">
          {records.length} {t.checksCountLabel}
        </span>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: 'all', label: t.filterAll },
            { id: 'flagged', label: t.filterFlagged },
            { id: 'possible_match', label: t.filterPossible },
            { id: 'not_found', label: t.filterNotFound },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`min-h-[42px] px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filter === item.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* History List or Empty State */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-[24px] bg-surface-container-low p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-surface-container-lowest mx-auto flex items-center justify-center text-secondary">
            <QrCode className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h2 className="text-lg font-bold text-on-surface">{t.historyEmptyTitle}</h2>
            <p className="text-sm text-on-surface-variant">{t.historyEmptyBody}</p>
          </div>
          <button
            type="button"
            onClick={onGoToScan}
            className="min-h-[48px] px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold cursor-pointer"
          >
            {t.scanCameraBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredRecords.map((rec) => {
            const isFlagged = rec.status === 'flagged';
            const isPossible = rec.status === 'possible_match';

            const cardBg = isFlagged
              ? 'bg-flagged-bg/65 border-flagged-accent/25'
              : isPossible
              ? 'bg-possible-bg/70 border-possible-accent/25'
              : 'bg-surface-container-lowest border-outline-variant/40';

            const statusLabel = isFlagged
              ? t.filterFlagged
              : isPossible
              ? t.filterPossible
              : t.filterNotFound;

            const statusColor = isFlagged
              ? 'text-flagged-accent'
              : isPossible
              ? 'text-possible-accent'
              : 'text-notfound-accent';

            return (
              <div
                key={rec.id}
                className={`rounded-[22px] border p-4 shadow-xs flex flex-col justify-between gap-3 ${cardBg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenRecord(rec.result)}
                    className="flex-1 text-left flex items-start gap-3 min-w-0 cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 ${statusColor}`}>
                      {isFlagged ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : isPossible ? (
                        <HelpCircle className="w-5 h-5" />
                      ) : (
                        <SearchCheck className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-on-surface truncate">
                        {rec.medicineName}
                      </h3>
                      <p className="text-xs font-mono font-semibold text-on-surface-variant mt-0.5">
                        {rec.batchNumber.startsWith('Section 26A')
                          ? rec.batchNumber
                          : `${t.batchNumberLabel}: ${rec.batchNumber}`}
                      </p>
                      <p className="text-xs text-outline mt-1">
                        <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
                        {' · '}
                        <span>{formatTime(rec.checkedAt)}</span>
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteRecord(rec.id)}
                    aria-label="Remove entry"
                    className="w-10 h-10 rounded-full hover:bg-surface-container text-outline hover:text-flagged-accent flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenRecord(rec.result)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-surface-container-lowest/85 hover:bg-surface-container-lowest text-xs font-semibold text-primary flex items-center justify-between cursor-pointer"
                >
                  <span>{t.viewDetailsBtn}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Local Storage Guarantee & Clear History */}
      <div className="rounded-[24px] bg-surface-container-low p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">{t.historyLocalBadge}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{t.privacyCardBody}</p>
          </div>
        </div>

        {records.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="min-h-[44px] px-4 py-2 rounded-full bg-surface-container-highest hover:bg-flagged-bg text-flagged-accent text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.clearHistoryBtn}</span>
          </button>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-surface p-6 shadow-xl space-y-4 text-center">
            <h3 className="text-lg font-bold text-on-surface">{t.clearConfirmTitle}</h3>
            <p className="text-sm text-on-surface-variant">{t.clearConfirmBody}</p>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 min-h-[46px] rounded-full bg-surface-container-high text-on-surface text-sm font-semibold cursor-pointer"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="flex-1 min-h-[46px] rounded-full bg-flagged-accent text-white text-sm font-semibold cursor-pointer"
              >
                {t.confirmDeleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
