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
    <section className="bg-[#24344d80] rounded-lg p-4 text-white space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {t("UI_AUTO_SAVES_TITLE", "Detected Windows save slots")}
        </h2>
        {isLoading ? (
          <span className="text-sm text-white/70">
            {t("UI_AUTO_SAVES_LOADING", "Scanning...")}
          </span>
        ) : null}
      </header>

      {error ? (
        <div className="text-sm text-red-300 bg-red-900/40 border border-red-600 rounded p-3">
          {error}
        </div>
      ) : null}

      {!error && !isLoading && saves.length === 0 ? (
        <div className="text-sm text-white/70">
          {t("UI_AUTO_SAVES_EMPTY", "No Windows saves found in the default folder.")}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {saves.map(save => {
          const isActive = activeSaveId === save.id;
          return (
            <button
              key={save.id}
              type="button"
              onClick={() => onSelect(save)}
              className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                isActive
                  ? "bg-green-600/80 border-green-400 shadow-lg"
                  : "bg-[#1f2b3d] border-white/20 hover:border-green-300 hover:bg-[#2a3a53]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold truncate max-w-[70%]" title={save.displayName}>
                  {save.displayName}
                </span>
                <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full">
                  {t("UI_AUTO_SAVES_SLOT", "Slot {index}").replace("{index}", String(save.slotIndex))}
                </span>
              </div>

              <div className="mt-2 text-sm text-white/80">
                <div>
                  {t("UI_AUTO_SAVES_COMPLETION", "Completion: {percent}%").replace(
                    "{percent}",
                    save.completionPercent !== null ? String(save.completionPercent) : "--",
                  )}
                </div>
                <div className="text-white/60">
                  {t("UI_AUTO_SAVES_MODIFIED", "Last updated: {time}").replace(
                    "{time}",
                    formatTimestamp(save.modifiedAt, locale === "zh" ? "zh-CN" : "en-US"),
                  )}
                </div>
              </div>

              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 transition-all duration-500"
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
