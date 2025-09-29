import { useI18n } from "../i18n/I18nContext";

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();
  const nextLocale = locale === "en" ? "zh" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70 transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      aria-label={t("UI_LANGUAGE_LABEL", "Language")}
    >
      {t("UI_LANGUAGE_LABEL", "Language")}: {t("UI_LANGUAGE_SWITCH")}
    </button>
  );
}
