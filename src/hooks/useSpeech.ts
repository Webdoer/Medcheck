import { useCallback, useEffect, useRef, useState } from 'react';
import { LANGUAGES, type LanguageCode } from '../i18n/translations';

const clientTtsCache = new Map<string, string>();

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function useSpeechSynthesis(language: LanguageCode, rate: number) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechError, setSpeechError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const requestIdRef = useRef(0);

  const stop = useCallback(() => {
    requestIdRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.onended = null;
        sourceNodeRef.current.stop();
      } catch {
        // Ignore already stopped source
      }
      sourceNodeRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsLoading(false);
    setIsSpeaking(false);
    setSpeechError(false);
  }, []);

  useEffect(() => {
    return () => {
      stop();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [stop]);

  useEffect(() => {
    if (audioRef.current && isSpeaking) {
      audioRef.current.playbackRate = rate;
    }
    if (sourceNodeRef.current && isSpeaking) {
      sourceNodeRef.current.playbackRate.value = rate;
    }
  }, [rate, isSpeaking]);

  const speakWithBrowserFallback = useCallback(
    async (text: string, currentRequestId: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setIsSpeaking(false);
        setIsLoading(false);
        setSpeechError(true);
        return;
      }

      const loadVoices = (): Promise<SpeechSynthesisVoice[]> =>
        new Promise((resolve) => {
          const existing = window.speechSynthesis.getVoices();
          if (existing.length > 0) {
            resolve(existing);
            return;
          }
          const timer = setTimeout(() => resolve(window.speechSynthesis.getVoices()), 350);
          window.speechSynthesis.onvoiceschanged = () => {
            clearTimeout(timer);
            resolve(window.speechSynthesis.getVoices());
          };
        });

      const voices = await loadVoices();
      if (requestIdRef.current !== currentRequestId) return;

      const langConfig = LANGUAGES.find((l) => l.code === language);
      const langPrefix = (langConfig?.code ?? 'hi').toLowerCase();
      const langVoices = voices.filter((v) =>
        v.lang.toLowerCase().startsWith(langPrefix)
      );

      // On devices without Tamil/Bengali/Marathi/Telugu OS voices, do not silently fail
      if (langVoices.length === 0) {
        setIsLoading(false);
        setIsSpeaking(false);
        setSpeechError(true);
        return;
      }

      window.speechSynthesis.cancel();
      const femalePattern =
        /female|woman|lekha|veena|kalpana|swara|heera|neerja|priya|aditi|raveena|pallavi|vani|tanisha|shruti|sapna|samantha|victoria|karen|zira|aria|jenny|meera/i;
      const matchingVoice =
        langVoices.find((v) => femalePattern.test(v.name)) ?? langVoices[0];

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langConfig?.speechLang ?? 'hi-IN';
      utterance.rate = rate;
      utterance.voice = matchingVoice;

      utterance.onstart = () => {
        setIsLoading(false);
        setSpeechError(false);
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setIsLoading(false);
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsLoading(false);
        setIsSpeaking(false);
        setSpeechError(true);
      };

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [language, rate]
  );

  const speak = useCallback(
    async (text: string, options?: { staticId?: string }) => {
      stop();
      setSpeechError(false);
      const currentRequestId = ++requestIdRef.current;

      // Unlock AudioContext synchronously during user gesture for reliable Safari/mobile playback
      if (typeof window !== 'undefined' && window.AudioContext) {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new window.AudioContext();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
      }

      const audio = new Audio();
      audioRef.current = audio;

      const cacheKey = `${language}:${text}`;
      const cachedUrlOrData = clientTtsCache.get(cacheKey);

      const playAudioSrc = async (srcUrl: string, rawBase64?: string) => {
        if (requestIdRef.current !== currentRequestId) return;
        audio.src = srcUrl;
        audio.playbackRate = rate;
        audio.onended = () => {
          if (requestIdRef.current === currentRequestId) {
            setIsSpeaking(false);
          }
        };
        audio.onerror = () => {
          if (requestIdRef.current === currentRequestId) {
            setIsSpeaking(false);
            setIsLoading(false);
          }
        };

        try {
          setIsLoading(false);
          setIsSpeaking(true);
          await audio.play();
        } catch {
          const ctx = audioCtxRef.current;
          if (!ctx) throw new Error('Audio playback blocked');
          let arrayBuf: ArrayBuffer;
          if (rawBase64) {
            arrayBuf = base64ToArrayBuffer(rawBase64);
          } else {
            const fileResp = await fetch(srcUrl);
            arrayBuf = await fileResp.arrayBuffer();
          }
          const buffer = await ctx.decodeAudioData(arrayBuf);
          if (requestIdRef.current !== currentRequestId) return;
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          src.playbackRate.value = rate;
          src.connect(ctx.destination);
          src.onended = () => {
            if (requestIdRef.current === currentRequestId) {
              setIsSpeaking(false);
              sourceNodeRef.current = null;
            }
          };
          sourceNodeRef.current = src;
          setIsLoading(false);
          setIsSpeaking(true);
          src.start(0);
        }
      };

      if (cachedUrlOrData) {
        try {
          const isStaticPath = cachedUrlOrData.startsWith('/');
          await playAudioSrc(
            isStaticPath ? cachedUrlOrData : `data:audio/wav;base64,${cachedUrlOrData}`,
            isStaticPath ? undefined : cachedUrlOrData
          );
          return;
        } catch {
          // Fall through
        }
      }

      setIsLoading(true);

      // Try pre-generated static audio file first if available (instant & works offline)
      if (options?.staticId) {
        const staticUrl = `/audio/${options.staticId}.wav`;
        try {
          const headResp = await fetch(staticUrl, { method: 'HEAD' });
          const contentType = headResp.headers.get('content-type') || '';
          if (
            headResp.ok &&
            contentType.toLowerCase().includes('audio') &&
            requestIdRef.current === currentRequestId
          ) {
            clientTtsCache.set(cacheKey, staticUrl);
            await playAudioSrc(staticUrl);
            return;
          }
        } catch {
          // Static file not present; continue to /api/tts
        }
      }

      const fetchTts = () =>
        fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language, staticId: options?.staticId }),
        });

      try {
        let response = await fetchTts();
        if (requestIdRef.current !== currentRequestId) return;

        if (response.status === 429) {
          await new Promise((r) => setTimeout(r, 2200));
          if (requestIdRef.current !== currentRequestId) return;
          response = await fetchTts();
          if (requestIdRef.current !== currentRequestId) return;
        }

        if (!response.ok) {
          throw new Error('TTS request failed');
        }

        const data = (await response.json()) as {
          audioBase64?: string;
          mimeType?: string;
        };

        if (!data.audioBase64) {
          throw new Error('Empty audio payload');
        }

        clientTtsCache.set(cacheKey, data.audioBase64);
        const mime = data.mimeType || 'audio/wav';
        await playAudioSrc(`data:${mime};base64,${data.audioBase64}`, data.audioBase64);
      } catch {
        if (requestIdRef.current !== currentRequestId) return;
        setIsLoading(false);
        await speakWithBrowserFallback(text, currentRequestId);
      }
    },
    [language, rate, speakWithBrowserFallback, stop]
  );

  return { isSpeaking, isLoading, speechError, speak, stop };
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function useSpeechRecognition(language: LanguageCode) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        SpeechRecognition?: unknown;
        webkitSpeechRecognition?: unknown;
      };
      setSupported(Boolean(win.SpeechRecognition || win.webkitSpeechRecognition));
    }
  }, []);

  const startListening = useCallback(
    (onTranscript: (text: string) => void, onUnsupported?: () => void) => {
      if (typeof window === 'undefined') return;
      const win = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      };
      const RecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (!RecognitionCtor) {
        setSupported(false);
        onUnsupported?.();
        return;
      }

      try {
        const recognition = new RecognitionCtor();
        const langConfig = LANGUAGES.find((l) => l.code === language);
        recognition.lang = langConfig?.speechLang ?? 'hi-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const transcript = event.results?.[0]?.[0]?.transcript ?? '';
          if (transcript.trim()) {
            onTranscript(transcript.trim());
          }
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        setIsListening(true);
        recognition.start();
      } catch {
        setIsListening(false);
        onUnsupported?.();
      }
    },
    [language]
  );

  return { isListening, supported, startListening };
}
