import React, { useState } from 'react';
import { Check, ArrowRight, Phone, ShieldCheck, Lock } from 'lucide-react';
import { LANGUAGES, TRANSLATIONS, type LanguageCode } from '../i18n/translations';
import { MEDIA } from '../assets/media';
import { ListenButton } from './ListenButton';
import { useSpeechSynthesis } from '../hooks/useSpeech';

interface LanguageOnboardingProps {
  selectedLanguage: LanguageCode;
  voiceSpeed: 0.8 | 1.0 | 1.2;
  onSelectLanguage: (lang: LanguageCode) => void;
  onContinue: () => void;
}

export const LanguageOnboarding: React.FC<LanguageOnboardingProps> = ({
  selectedLanguage,
  voiceSpeed,
  onSelectLanguage,
  onContinue,
}) => {
  const t = TRANSLATIONS[selectedLanguage];
  const { isSpeaking, isLoading, speechError, speak, stop } = useSpeechSynthesis(
    selectedLanguage,
    voiceSpeed
  );
  const [imgError, setImgError] = useState(false);

  const handleToggleSpeech = () => {
    if (isSpeaking || isLoading) {
      stop();
    } else {
      speak(t.welcomeSpeechText, { staticId: `welcome_${selectedLanguage}` });
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between px-4 py-6 sm:px-6 lg:py-10">
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col justify-center">
        <p className="text-xs font-medium text-on-surface-variant text-center mb-5">
          {t.cdscoDatabaseHint}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Emblem, Identity & Civic Mission */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-24 h-24 rounded-full bg-surface-container-low p-1.5 shadow-sm flex items-center justify-center mb-4 border border-outline-variant/40 overflow-hidden">
              {!imgError ? (
                <img
                  src={MEDIA.emblem}
                  alt="MedCheck Public Health Shield Emblem"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <ShieldCheck className="w-12 h-12 text-primary" />
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-on-surface">
                {t.appName}
              </h1>
              <span className="text-xl font-bold text-primary">{t.appNameNative}</span>
            </div>

            <p className="text-[17px] text-on-surface-variant leading-relaxed max-w-md">
              {t.tagline}
            </p>
            <p className="text-xs text-outline mt-1">{t.subTagline}</p>

            <div className="mt-5 w-full bg-surface-container-low rounded-3xl p-4 border border-outline-variant/30 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-on-primary-fixed">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{t.missionTitle}</p>
                  <p className="text-sm text-on-surface leading-relaxed mt-0.5">
                    {t.missionBody}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-on-surface-variant">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.noLoginPrivacy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2x3 Language Grid, Listen Button, Continue CTA */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[17px] font-semibold text-on-surface">
                {t.chooseLanguageTitle}
              </h2>
              <span className="text-xs font-medium text-on-surface-variant">
                {t.sixLanguagesCount}
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label="Choose Language"
              className="grid grid-cols-2 gap-3"
            >
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === selectedLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      stop();
                      onSelectLanguage(lang.code);
                    }}
                    className={`flex items-center justify-between px-4 min-h-[64px] rounded-[20px] transition-all active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface border border-outline-variant/40 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-base font-bold leading-snug">{lang.nativeName}</span>
                      <span
                        className={`text-xs ${
                          isSelected ? 'text-on-primary/85' : 'text-on-surface-variant'
                        }`}
                      >
                        {lang.englishName}
                      </span>
                    </div>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-on-primary text-primary'
                          : 'bg-surface-container text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </button>
                );
              })}
            </div>

            <ListenButton
              isSpeaking={isSpeaking}
              isLoading={isLoading}
              errorMessage={speechError ? t.voiceBusyHint : null}
              onToggle={handleToggleSpeech}
              listenLabel={t.listenWelcomeBtn}
              stopLabel={t.stopListeningBtn}
              subLabel={t.listenWelcomeSub}
              variant="secondary"
            />

            <button
              type="button"
              onClick={() => {
                stop();
                onContinue();
              }}
              className="w-full min-h-[56px] rounded-full bg-primary hover:bg-primary-container text-on-primary text-base font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.99] cursor-pointer"
            >
              <span>{t.continueBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-xs text-center text-on-surface-variant">
              {t.freeNoSaveMicro}
            </p>

            {/* Toll-free CDSCO Helpline */}
            <div className="bg-surface-container rounded-[20px] px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">
                  {t.helplineTitle}
                </p>
                <p className="text-xs text-on-surface-variant truncate">{t.helplineSub}</p>
              </div>
              <a
                href="tel:1800114477"
                className="min-h-[44px] inline-flex items-center gap-1.5 bg-surface-container-lowest text-secondary px-4 py-2 rounded-full text-xs font-bold shadow-xs hover:bg-secondary-fixed transition-colors shrink-0 whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>1800-11-4477</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
