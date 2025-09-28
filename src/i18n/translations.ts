import { CUSTOM_TRANSLATIONS } from "./customTranslations";

export type Locale = "en" | "zh";

export interface TranslationEntry {
  en: string;
  zh: string;
  key?: string;
  sheet?: string;
}

interface TranslationResources {
  byKey: Record<string, TranslationEntry>;
  byNormalizedEnglish: Map<string, TranslationEntry>;
}

const translationFiles = import.meta.glob("../translations/*.xml", {
  query: "?raw",
  import: "default",
  eager: true,
});

let cachedResources: TranslationResources | null = null;

const normalizeEnglish = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035'`"“”]/g, "")
    .replace(/&lt;br\s*\/?>/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const decodeHtml = (value: string) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const buildResources = (): TranslationResources => {
  const byKey: Record<string, TranslationEntry> = {};
  const byNormalizedEnglish = new Map<string, TranslationEntry>();
  const parser = new DOMParser();

  Object.entries(translationFiles).forEach(([path, raw]) => {
    const doc = parser.parseFromString(raw as string, "application/xml");
    const entries = Array.from(doc.getElementsByTagName("entry"));

    for (const entry of entries) {
      const key = entry.getAttribute("key") ?? undefined;
      const enNode = entry.getElementsByTagName("en")[0];
      const zhNode = entry.getElementsByTagName("zh")[0];
      if (!enNode || !zhNode) continue;
      const en = decodeHtml(enNode.textContent?.trim() ?? "");
      const zh = decodeHtml(zhNode.textContent?.trim() ?? "");
      if (!en) continue;
      const data: TranslationEntry = { en, zh, key, sheet: path };
      if (key) {
        byKey[key] = data;
      }
      const normalized = normalizeEnglish(en);
      if (normalized) {
        if (!byNormalizedEnglish.has(normalized)) {
          byNormalizedEnglish.set(normalized, data);
        }
      }
    }
  });

  Object.entries(CUSTOM_TRANSLATIONS).forEach(([key, data]) => {
    byKey[key] = data;
    const normalized = normalizeEnglish(data.en);
    if (normalized && !byNormalizedEnglish.has(normalized)) {
      byNormalizedEnglish.set(normalized, data);
    }
  });

  return { byKey, byNormalizedEnglish };
};

export const getTranslationResources = (): TranslationResources => {
  if (typeof document === "undefined") {
    throw new Error("Translation resources require a DOM environment");
  }
  if (!cachedResources) {
    cachedResources = buildResources();
  }
  return cachedResources;
};

export const translateByKey = (key: string, locale: Locale): string | undefined => {
  const { byKey } = getTranslationResources();
  const entry = byKey[key];
  if (!entry) return undefined;
  return locale === "zh" ? entry.zh || entry.en : entry.en;
};

const trySplitNumericSuffix = (
  english: string,
  locale: Locale,
  byNormalizedEnglish: Map<string, TranslationEntry>,
) => {
  const match = english.match(/^(.*?)(\d+(?:\s*\/\s*\d+)?)$/);
  if (!match) return undefined;
  const base = match[1]?.trim();
  const suffix = match[2]?.trim();
  if (!base || !suffix) return undefined;
  const baseEntry = byNormalizedEnglish.get(normalizeEnglish(base));
  if (!baseEntry) return undefined;
  const translatedBase = locale === "zh" ? baseEntry.zh || baseEntry.en : baseEntry.en;
  if (translatedBase === base) return undefined;
  return `${translatedBase} ${suffix}`.trim();
};

export const translateByEnglish = (
  english: string,
  locale: Locale,
): string => {
  if (!english) return "";
  if (locale === "en") return english;
  const { byNormalizedEnglish } = getTranslationResources();
  const normalized = normalizeEnglish(english);
  const entry = normalized ? byNormalizedEnglish.get(normalized) : undefined;
  if (!entry) {
    const composed = trySplitNumericSuffix(english, locale, byNormalizedEnglish);
    if (composed) {
      return composed;
    }
    return english;
  }
  return entry.zh || english;
};

export const mergeCustomTranslation = (key: string, entry: TranslationEntry) => {
  const resources = getTranslationResources();
  resources.byKey[key] = entry;
  const normalized = normalizeEnglish(entry.en);
  if (normalized) {
    resources.byNormalizedEnglish.set(normalized, entry);
  }
};
