import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { getTranslationResources, translateByEnglish, translateByKey, type Locale } from "./translations";

type TranslationContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  translate: (english: string) => string;
};

const STORAGE_KEY = "hk-silksong-language";

const I18nContext = createContext<TranslationContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en" || stored === "zh") return stored;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith("zh") ? "zh" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  useMemo(() => {
    getTranslationResources();
  }, []);

  const value = useMemo<TranslationContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: (key, fallback) => translateByKey(key, locale) ?? fallback ?? key,
      translate: english => translateByEnglish(english, locale),
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
};
