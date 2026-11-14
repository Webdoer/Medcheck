import React from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';

interface ListenButtonProps {
  isSpeaking: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  onToggle: () => void;
  listenLabel: string;
  stopLabel: string;
  subLabel?: string;
  variant?: 'default' | 'secondary';
}

export const ListenButton: React.FC<ListenButtonProps> = ({
  isSpeaking,
  isLoading = false,
  errorMessage = null,
  onToggle,
  listenLabel,
  stopLabel,
  subLabel,
  variant = 'default',
}) => {
  const bgClass =
    variant === 'secondary'
      ? 'bg-secondary-container/70 hover:bg-secondary-container text-on-secondary-fixed'
      : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/50';

  return (
    <div className="w-full flex flex-col gap-1.5">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isSpeaking}
        className={`w-full min-h-[52px] rounded-full px-4 py-2.5 flex items-center justify-between gap-3 transition-all active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${bgClass}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isSpeaking || isLoading
                ? 'bg-primary text-on-primary'
                : 'bg-primary/15 text-primary'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSpeaking ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </span>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[15px] font-semibold text-primary truncate">
              {isSpeaking || isLoading ? stopLabel : listenLabel}
            </span>
            {subLabel && (
              <span className="text-xs text-on-surface-variant truncate">{subLabel}</span>
            )}
          </div>
        </div>

        <div aria-hidden="true" className="flex items-center gap-1 pr-1 shrink-0 h-5">
          {[10, 18, 13, 20, 9].map((heightPx, idx) => (
            <span
              key={idx}
              className={`w-1 rounded-full bg-primary transition-all duration-300 ${
                isSpeaking ? 'animate-pulse opacity-100' : 'opacity-45'
              }`}
              style={{
                height: isSpeaking ? `${((idx % 3) + 2) * 5}px` : `${heightPx * 0.7}px`,
                animationDelay: `${idx * 110}ms`,
              }}
            />
          ))}
        </div>
      </button>

      {errorMessage && (
        <p className="text-xs text-on-surface-variant px-3 leading-snug" role="status">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
