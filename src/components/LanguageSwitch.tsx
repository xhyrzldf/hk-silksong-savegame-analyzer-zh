import { useI18n } from "../i18n/I18nContext";

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();
  const nextLocale = locale === "en" ? "zh" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      className="px-3 py-1 text-xs font-semibold rounded border border-white/30 text-white/80 hover:border-white hover:text-white transition-colors"
    >
      {t("UI_LANGUAGE_LABEL", "Language")}: {t("UI_LANGUAGE_SWITCH")}
    </button>
  );
}
