// i18n hook — loads the right JSON file for the current language

import { useCallback } from "react";
import type { Lang } from "@/types";

// Static imports for all languages so Next.js bundles them
import hi from "@/i18n/hi.json";
import en from "@/i18n/en.json";
import ta from "@/i18n/ta.json";
import bn from "@/i18n/bn.json";
import mr from "@/i18n/mr.json";
import te from "@/i18n/te.json";

const STRINGS: Record<Lang, Record<string, string>> = { hi, en, ta, bn, mr, te };

export function useI18n(lang: Lang) {
  const t = useCallback(
    (key: string, fallback?: string): string => {
      return STRINGS[lang]?.[key] ?? STRINGS["hi"][key] ?? fallback ?? key;
    },
    [lang]
  );
  return { t };
}
