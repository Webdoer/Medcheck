import React, { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  Lock,
  ChevronDown,
  Volume2,
  Contrast,
  Database,
} from 'lucide-react';
import type { TranslationBundle } from '../i18n/translations';
import { MEDIA } from '../assets/media';
import { PWAInstallButton } from './PWAInstallButton';

interface HelpPrivacyViewProps {
  t: TranslationBundle;
  dataUpdatedAt: string;
  voiceSpeed: 0.8 | 1.0 | 1.2;
  highContrast: boolean;
  onChangeVoiceSpeed: (speed: 0.8 | 1.0 | 1.2) => void;
  onToggleHighContrast: () => void;
}

export const HelpPrivacyView: React.FC<HelpPrivacyViewProps> = ({
  t,
  dataUpdatedAt,
  voiceSpeed,
  highContrast,
  onChangeVoiceSpeed,
  onToggleHighContrast,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto w-full">
      {/* Hero Trust & Safety Summary */}
      <section className="rounded-[24px] bg-surface-container-low p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-on-surface">
              {t.helpHeroTitle}
            </h1>
            <p className="text-[15px] text-on-surface-variant mt-1 leading-relaxed">
              {t.helpHeroSub}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-surface-container-lowest flex items-start gap-3">
            <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-on-surface">{t.localProcessingTitle}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{t.localProcessingSub}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest flex items-start gap-3">
            <Database className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-on-surface">{t.cdscoSyncTitle}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {t.cdscoSyncSub} ({dataUpdatedAt})
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Helpline & Reassurance Visual & Install */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-[24px] bg-surface-container-lowest p-5 border border-outline-variant/40 space-y-3">
            <p className="text-xs font-semibold text-secondary">{t.helplineSub}</p>
            <h2 className="text-xl font-bold text-on-surface">{t.helplineTitle}</h2>
            <a
              href="tel:1800114477"
              className="w-full min-h-[54px] px-5 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span className="text-lg font-mono font-bold tracking-wide">1800-11-4477</span>
              </div>
              <span className="text-xs font-semibold">{t.callNow}</span>
            </a>
          </div>

          <div className="rounded-[24px] overflow-hidden bg-surface-container-lowest border border-outline-variant/40">
            {!imgError && (
              <img
                src={MEDIA.consultation}
                alt="Community health clinic consultation"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-36 object-cover"
              />
            )}
            <div className="p-4">
              <p className="text-sm font-bold text-on-surface">{t.reassuranceCardTitle}</p>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                {t.reassuranceCardSub}
              </p>
            </div>
          </div>

          <PWAInstallButton t={t} />
        </div>

        {/* Right: FAQs & Accessibility Settings */}
        <div className="lg:col-span-7 space-y-5">
          {/* FAQs Accordion */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface px-1">{t.faqTitle}</h2>
            <div className="space-y-2.5">
              {t.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full min-h-[52px] px-4 py-3 flex items-center justify-between gap-3 text-left cursor-pointer"
                    >
                      <span className="text-sm sm:text-[15px] font-semibold text-on-surface">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-on-surface-variant shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-on-surface-variant leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Accessibility & Voice Controls */}
          <section className="rounded-[24px] bg-surface-container-lowest p-5 border border-outline-variant/40 space-y-4">
            <h2 className="text-lg font-bold text-on-surface">{t.accessibilityTitle}</h2>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
                <Volume2 className="w-4 h-4 text-primary" />
                <span>{t.voiceSpeedLabel}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { val: 0.8, label: t.speedSlow },
                    { val: 1.0, label: t.speedNormal },
                    { val: 1.2, label: t.speedFast },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => onChangeVoiceSpeed(item.val)}
                    className={`min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      voiceSpeed === item.val
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <Contrast className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{t.highContrastLabel}</p>
                  <p className="text-xs text-on-surface-variant">{t.highContrastSub}</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={highContrast}
                onClick={onToggleHighContrast}
                className={`w-13 h-8 rounded-full p-1 transition-colors flex items-center shrink-0 cursor-pointer ${
                  highContrast ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-surface-container-lowest shadow-xs" />
              </button>
            </div>
          </section>
        </div>
      </div>

      <p className="text-xs text-center text-on-surface-variant pb-2">
        {t.dataSourceFooter}
      </p>
    </div>
  );
};
