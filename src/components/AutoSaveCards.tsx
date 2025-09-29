import type { AutoSaveSummary } from "../hooks/useWindowsSaves";
import { useI18n } from "../i18n/I18nContext";

interface AutoSaveCardsProps {
  saves: AutoSaveSummary[];
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  activeSaveId: string | null;
  onSelect: (save: AutoSaveSummary) => void;
}

function formatTimestamp(timestamp: number, locale: string): string {
  try {
    return new Date(timestamp).toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return new Date(timestamp).toLocaleString();
  }
}

export function AutoSaveCards({
  saves,
  isLoading,
  error,
  isSupported,
  activeSaveId,
  onSelect,
}: AutoSaveCardsProps) {
  const { t, locale } = useI18n();

  if (!isSupported) {
    return null;
  }

  return (
    <section className="space-y-4 text-white">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-lg font-semibold text-white/90">
          {t("UI_AUTO_SAVES_TITLE", "Detected Windows save slots")}
        </h2>
        {isLoading ? (
          <span className="inline-flex items-center gap-2 text-xs text-white/60">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            {t("UI_AUTO_SAVES_LOADING", "Scanning...")}
          </span>
        ) : null}
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-inner">
          {error}
        </div>
      ) : null}

      {!error && !isLoading && saves.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm text-white/70 shadow-inner">
          {t("UI_AUTO_SAVES_EMPTY", "No Windows saves found in the default folder.")}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {saves.map(save => {
          const isActive = activeSaveId === save.id;
          return (
            <button
              key={save.id}
              type="button"
              onClick={() => onSelect(save)}
              aria-pressed={isActive}
              className={`group flex flex-col gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                isActive
                  ? "border-emerald-400/70 bg-emerald-500/10 shadow-lg shadow-emerald-900/40"
                  : "border-white/10 bg-slate-950/50 hover:-translate-y-1 hover:border-emerald-300/60 hover:bg-emerald-500/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="truncate text-base font-semibold text-white"
                  title={save.displayName}
                >
                  {save.displayName}
                </span>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                  {t("UI_AUTO_SAVES_SLOT", "Slot {index}").replace("{index}", String(save.slotIndex))}
                </span>
              </div>

              <div className="space-y-1 text-sm text-white/80">
                <div>
                  {t("UI_AUTO_SAVES_COMPLETION", "Completion: {percent}%").replace(
                    "{percent}",
                    save.completionPercent !== null ? String(save.completionPercent) : "--",
                  )}
                </div>
                <div className="text-xs text-white/60">
                  {t("UI_AUTO_SAVES_MODIFIED", "Last updated: {time}").replace(
                    "{time}",
                    formatTimestamp(save.modifiedAt, locale === "zh" ? "zh-CN" : "en-US"),
                  )}
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-slate-900/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(save.completionPercent ?? 0, 100))}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
