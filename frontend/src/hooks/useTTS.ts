"use client";
// TTS hook — Web Speech API primary, server fallback for unsupported voices

import { useCallback, useRef, useState } from "react";
import type { Lang } from "@/types";

const LANG_BCP47: Record<Lang, string> = {
  hi: "hi-IN",
  en: "en-IN",
  ta: "ta-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  te: "te-IN",
};

export function useTTS(lang: Lang) {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(
    async (text: string) => {
      if (speaking) {
        window.speechSynthesis?.cancel();
        audioRef.current?.pause();
        setSpeaking(false);
        return;
      }

      setSpeaking(true);

      // Try Web Speech API first
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const voices = window.speechSynthesis.getVoices();
        const bcp47 = LANG_BCP47[lang];
        const hasVoice = voices.some((v) => v.lang.startsWith(bcp47.split("-")[0]));

        if (hasVoice || voices.length === 0) {
          const utt = new SpeechSynthesisUtterance(text);
          utt.lang = bcp47;
          utt.rate = 0.85;
          const match = voices.find((v) => v.lang.startsWith(bcp47.split("-")[0]));
          if (match) utt.voice = match;
          utt.onend = () => setSpeaking(false);
          utt.onerror = () => {
            setSpeaking(false);
            _serverFallback(text, lang, setSpeaking, audioRef);
          };
          window.speechSynthesis.speak(utt);
          return;
        }
      }

      // Server-side fallback
      await _serverFallback(text, lang, setSpeaking, audioRef);
    },
    [lang, speaking]
  );

  return { speak, speaking };
}

async function _serverFallback(
  text: string,
  lang: Lang,
  setSpeaking: (v: boolean) => void,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const resp = await fetch(`${apiUrl}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });
    if (!resp.ok) throw new Error("TTS server error");
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => setSpeaking(false);
    await audio.play();
  } catch {
    setSpeaking(false);
  }
}
