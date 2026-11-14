import React, { useState } from 'react';
import { Download, WifiOff, Share } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';
import type { TranslationBundle } from '../i18n/translations';

interface PWAInstallButtonProps {
  t: TranslationBundle;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ t }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  return (
    <div className="rounded-[20px] bg-surface-container-lowest p-4 border border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="text-base font-bold text-on-surface">{t.installAppTitle}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{t.installAppSub}</p>
      </div>

      {isInstallable ? (
        <button
          type="button"
          onClick={install}
          className="min-h-[46px] px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold flex items-center justify-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>{t.installAppBtn}</span>
        </button>
      ) : isIOS ? (
        <>
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="min-h-[46px] px-5 py-2.5 rounded-full bg-secondary-container text-on-secondary-fixed text-sm font-semibold flex items-center justify-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
          >
            <Share className="w-4 h-4" />
            <span>{t.installAppBtn}</span>
          </button>

          {showIOSGuide && (
            <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-sm rounded-[24px] bg-surface p-6 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-on-surface">{t.installAppTitle}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t.iosInstallHint}
                </p>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full min-h-[46px] rounded-full bg-primary text-on-primary text-sm font-semibold cursor-pointer"
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <span className="text-xs font-medium text-secondary">
          {t.installAppBtn} (Browser Menu)
        </span>
      )}
    </div>
  );
};

export const OfflineIndicator: React.FC<{ message: string }> = ({ message }) => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="w-full bg-possible-bg text-possible-ink px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 border-b border-possible-accent/20">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
