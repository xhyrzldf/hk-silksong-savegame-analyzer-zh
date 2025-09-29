/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";

import { useFilteredCategoryItems } from "../hooks/useResultFilters";
import { useI18n } from "../i18n/I18nContext";
import { CATEGORIES, isItemUnlockedInPlayerSave } from "../parsers/dictionary";
import type { TabRenderProps } from "./types";

const CATEGORY_NAME = "Memory Lockets";

export function MemoryLocketsTab({ parsedJson, decrypted }: TabRenderProps) {
  const { t, translate } = useI18n();
  const memoryLocketCategory = CATEGORIES.find(cat => cat.name === CATEGORY_NAME);
  const memoryLockets = memoryLocketCategory?.items ?? [];
  const filteredMemoryLockets = useFilteredCategoryItems(memoryLockets, parsedJson);

  if (!decrypted || !parsedJson) {
    const message = t("UI_LOAD_SAVE_PROMPT", "Load a save file to view {section} data.").replace(
      "{section}",
      translate(CATEGORY_NAME),
    );
    return <div className="text-white text-center">{message}</div>;
  }

  return (
    <div className="text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">{t("UI_WORK_IN_PROGRESS", "WORK IN PROGRESS")}</h2>
        <table className="w-full table-auto border-collapse divide-y divide-gray-600">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1 w-[56px]" />
              <th className="px-2 py-1 w-[56px] text-center" />
              <th className="px-2 py-1 min-w-[120px] max-w-[220px]">{t("UI_TABLE_NAME", "Name")}</th>
              <th className="px-2 py-1 min-w-[140px] max-w-[260px]">{t("UI_TABLE_LOCATION", "Location")}</th>
              <th className="px-2 py-1 w-[48px]">{t("UI_TABLE_ACT", "Act")}</th>
              <th className="px-2 py-1 w-[64px]" />
            </tr>
          </thead>
          <tbody>
            {filteredMemoryLockets.map(({ item, result }, index) => {
              const { unlocked } = result;
              return (
                <tr key={index} className="border-b border-gray-700 last:border-b-0">
                  <td className="px-2 py-1 text-center w-[56px] align-middle">
                    <span className={unlocked ? "text-green-400" : "text-red-400"}>{unlocked ? "[x]" : "[ ]"}</span>
                  </td>
                  <td className="px-2 py-1 text-center w-[56px] align-middle">
                    <span className="text-xs text-blue-200 mt-1 font-normal" />
                  </td>
                  <td className="px-2 py-1 min-w-[120px] max-w-[220px] truncate">{translate(item.name)}</td>
                  <td className={`px-2 py-1 relative min-w-[140px] max-w-[260px] break-words whitespace-pre-line 
                      ${!unlocked ? "blur-sm hover:blur-none transition duration-100" : ""}`}>
                    {translate(item.location)}
                  </td>
                  <td className={`px-2 py-1 w-[48px] text-center ${!unlocked ? "blur-sm hover:blur-none transition duration-100" : ""}`}>{item.whichAct}</td>
                  <td className="px-2 py-1 w-[64px] text-center">
                    <button
                      className={`flex-1 min-w-[48px] py-2 rounded font-semibold transition-colors text-xs ${
                        item.mapLink
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

export function getMemoryLocketsExtra({ parsedJson, decrypted }: { parsedJson: unknown; decrypted: boolean }): ReactNode {
  if (!decrypted || !parsedJson) {
    return null;
  }

  const memoryLocketCategory = CATEGORIES.find(cat => cat.name === CATEGORY_NAME);
  const memoryLockets = memoryLocketCategory?.items ?? [];

  if (memoryLockets.length === 0) {
    return null;
  }

  let unlockedCount = 0;

  memoryLockets.forEach(item => {
    const { unlocked } = isItemUnlockedInPlayerSave(item.parsingInfo, parsedJson);
    if (unlocked) {
      unlockedCount += 1;
    }
  });

  return (
    <div className="text-xs text-blue-200 mt-1 font-normal">
      {`${unlockedCount}/${memoryLockets.length}`}
    </div>
  );
}
