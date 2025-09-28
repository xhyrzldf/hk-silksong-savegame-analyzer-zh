import type { ReactNode } from "react";
import { useI18n } from "../i18n/I18nContext";
import type { TabRenderProps } from "./types";
import { CATEGORIES, isItemUnlockedInPlayerSave } from "../parsers/dictionary";

const JOURNAL_CATEGORY_NAME = "Hunter's Journal";

export function HuntersJournalTab({ parsedJson, decrypted }: TabRenderProps) {
  const { t, translate } = useI18n();
  if (!decrypted || !parsedJson) {
    const message = t("UI_LOAD_SAVE_PROMPT", "Load a save file to view {section} data.").replace(
      "{section}",
      translate(JOURNAL_CATEGORY_NAME),
    );
    return <div className="text-white text-center">{message}</div>;
  }

  const journalCategory = CATEGORIES.find(cat => cat.name === JOURNAL_CATEGORY_NAME);
  const journalEntries = journalCategory?.items ?? [];

  return (
    <div className="text-white">
      <div className="max-w-3xl mx-auto">
        <table className="w-full table-auto border-collapse divide-y divide-gray-600">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1 w-[56px]" />
              <th className="px-2 py-1 w-[56px] text-center" />
              <th className="px-2 py-1 min-w-[120px] max-w-[220px]">{t("UI_TABLE_NAME", "Name")}</th>
              <th className="px-2 py-1  w-[130px] text-center">{t("UI_TABLE_KILLS_ACHIEVED", "Kills Achieved")}</th>
              <th className="px-2 py-1  w-[130px] text-center">{t("UI_TABLE_KILLS_REQUIRED", "Kills Required")}</th>
              <th className="px-2 py-1 w-[64px]" />
            </tr>
          </thead>
          <tbody>
            {journalEntries.map((item, index) => {
              const { unlocked, returnValue: killsAchieved } = isItemUnlockedInPlayerSave(item.parsingInfo, parsedJson);
              return (
                <tr key={index} className="border-b border-gray-700 last:border-b-0">
                  <td className="px-2 py-1 text-center w-[56px] align-middle">
                    <span className={getHuntersJournalStatusColor(unlocked, killsAchieved, item.killsRequired)}>{unlocked && (killsAchieved ?? 0) >= (item.killsRequired ?? 0) ? "[x]" : "[ ]"}</span>
                  </td>
                  <td className="px-2 py-1 text-center w-[56px] align-middle">
                    <span className="text-xs text-blue-200 mt-1 font-normal" />
                  </td>
                  <td className={`px-2 py-1 min-w-[120px] max-w-[220px] truncate
                    ${!unlocked ? "blur-sm hover:blur-none transition duration-100" : ""}`}
                  >
                    {translate(item.name)}
                  </td>
                  <td className="px-2 py-1 min-w-[100px] max-w-[150px] text-center">
                    {killsAchieved}
                  </td>
                  <td className="px-2 py-1 min-w-[100px] max-w-[150px] text-center">
                    {item.killsRequired ?? t("UI_VALUE_NA", "N/A")}
                  </td>
                  <td className="px-2 py-1 w-[64px] text-center">
                    <button
                      className={`flex-1 min-w-[48px] py-2 rounded font-semibold transition-colors text-xs ${item.mapLink
                        ? "bg-[#24344d] text-white hover:bg-blue-600"
                        : "bg-[#24344d] text-blue-200 opacity-50 cursor-not-allowed"
                        }`}
                      onClick={() => {
                        if (item.mapLink) window.open(item.mapLink, "_blank", "noopener");
                      }}
                      disabled={!item.mapLink}
                      tabIndex={item.mapLink ? 0 : -1}
                    >
                      {t("UI_MAP_BUTTON", "Map")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getHuntersJournalStatusColor(unlocked: boolean, killsAchieved: number | undefined, killsRequired: number | undefined): string {
  if (!unlocked) {
    return "text-red-400";
  }

  if (killsAchieved !== undefined && killsRequired !== undefined) {
    return killsAchieved >= killsRequired ? "text-green-400" : "text-yellow-400";
  }

  return "";
}

export function getHuntersJournalExtra({ parsedJson, decrypted }: { parsedJson: unknown; decrypted: boolean }): ReactNode {
  if (!decrypted || !parsedJson) {
    return null;
  }

  const journalCategory = CATEGORIES.find(cat => cat.name === JOURNAL_CATEGORY_NAME);
  const journalEntries = journalCategory?.items ?? [];

  if (journalEntries.length === 0) {
    return null;
  }

  return (
    <HuntersJournalExtraContent parsedJson={parsedJson} journalEntries={journalEntries} />
  );
}

function HuntersJournalExtraContent({
  parsedJson,
  journalEntries,
}: {
  parsedJson: unknown;
  journalEntries: (typeof CATEGORIES)[number]["items"];
}) {
  const { t } = useI18n();

  let completed = 0;
  let encountered = 0;

  journalEntries.forEach(entry => {
    const { returnValue: killsAchieved } = isItemUnlockedInPlayerSave(entry.parsingInfo, parsedJson);
    if (
      killsAchieved !== undefined &&
      entry.killsRequired !== undefined &&
      typeof killsAchieved === "number" &&
      killsAchieved > 0
    ) {
      encountered += 1;
      if (killsAchieved >= entry.killsRequired) {
        completed += 1;
      }
    }
  });

  const total = journalEntries.length;
  const completedText = t("UI_JOURNAL_COMPLETED", "Completed {completed} / {total}")
    .replace("{completed}", String(completed))
    .replace("{total}", String(total));
  const encounteredText = t("UI_JOURNAL_ENCOUNTERED", "Encountered {encountered} / {total}")
    .replace("{encountered}", String(encountered))
    .replace("{total}", String(total));

  return (
    <div className="text-xs mt-1 font-normal">
      <span className="text-green-400 font-bold">{completedText}</span>
      <br />
      <span className="text-yellow-400 font-bold">{encounteredText}</span>
    </div>
  );
}
