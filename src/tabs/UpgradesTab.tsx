/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";

import { useFilteredCategoryItems, type FilteredCategoryItem } from "../hooks/useResultFilters";
import { useI18n } from "../i18n/I18nContext";
import { CATEGORIES, isItemUnlockedInPlayerSave } from "../parsers/dictionary";
import type { TabRenderProps } from "./types";

const CATEGORY_NAME = "Upgrades";

function formatPercent(value: number): string {
  return `${Number(value.toFixed(2))}%`;
}

function UpgradesTableSection({ section, upgrades }: { section: string; upgrades: FilteredCategoryItem[] }) {
  const { t, translate } = useI18n();
  if (upgrades.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2 text-blue-200">{translate(section)}</h2>
      <div className="max-w-3xl mx-auto">
        <table className="w-full border-collapse divide-y divide-gray-600 table-fixed">
          <colgroup>
            <col style={{ width: "56px" }} />
            <col style={{ width: "56px" }} />
            <col style={{ width: "220px" }} />
            <col style={{ width: "260px" }} />
            <col style={{ width: "48px" }} />
            <col style={{ width: "64px" }} />
          </colgroup>
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1" />
              <th className="px-2 py-1 text-center" />
              <th className="px-2 py-1">{t("UI_TABLE_NAME", "Name")}</th>
              <th className="px-2 py-1">{t("UI_TABLE_LOCATION", "Location")}</th>
              <th className="px-2 py-1">{t("UI_TABLE_ACT", "Act")}</th>
              <th className="px-2 py-1" />
            </tr>
          </thead>
          <tbody>
            {upgrades.map(({ item, result }, index) => {
              const { unlocked } = result;
              return (
                <tr key={index} className="border-b border-gray-700 last:border-b-0">
                  <td className="px-2 py-1 text-center align-middle">
                    <span className={unlocked ? "text-green-400" : "text-red-400"}>{unlocked ? "[x]" : "[ ]"}</span>
                  </td>
                  <td className="px-2 py-1 text-center align-middle">
                    <span className="text-xs text-blue-200 mt-1 font-normal">
                      {item.completionPercent ? `+${item.completionPercent}%` : ""}
                    </span>
                  </td>
                  <td className="px-2 py-1 break-words whitespace-pre-line">{translate(item.name)}</td>
                   <td className="px-2 py-1 relative min-w-[140px] max-w-[260px] break-words whitespace-pre-line">
                    {translate(item.location)}
                  </td>
                  <td className="px-2 py-1 w-[48px] text-center">{item.whichAct}</td>
                  <td className="px-2 py-1 text-center">
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

export function UpgradesTab({ parsedJson, decrypted }: TabRenderProps) {
  const { t, translate } = useI18n();
  const upgradeCategory = CATEGORIES.find(cat => cat.name === CATEGORY_NAME);
  const upgrades = upgradeCategory?.items ?? [];
  const filteredUpgrades = useFilteredCategoryItems(upgrades, parsedJson);
  const sections = Array.from(
    new Set(
      filteredUpgrades
        .map(entry => entry.item.section)
        .filter((section): section is string => typeof section === "string"),
    ),
  );

  if (!decrypted || !parsedJson) {
    const message = t("UI_LOAD_SAVE_PROMPT", "Load a save file to view {section} data.").replace(
      "{section}",
      translate(CATEGORY_NAME),
    );
    return <div className="text-white text-center">{message}</div>;
  }

  return (
    <div className="text-white">
      {sections.map(section => (
        <UpgradesTableSection
          key={section}
          section={section}
          upgrades={filteredUpgrades.filter(entry => entry.item.section === section)}
        />
      ))}
    </div>
  );
}

export function getUpgradesExtra({ parsedJson, decrypted }: { parsedJson: unknown; decrypted: boolean }): ReactNode {
  if (!decrypted || !parsedJson) {
    return null;
  }

  const upgradeCategory = CATEGORIES.find(cat => cat.name === CATEGORY_NAME);
  const upgrades = upgradeCategory?.items ?? [];

  if (upgrades.length === 0) {
    return null;
  }

  let currentPercent = 0;
  let maxPercent = 0;

  upgrades.forEach(item => {
    const percent = item.completionPercent ?? 0;
    maxPercent += percent;
    const { unlocked } = isItemUnlockedInPlayerSave(item.parsingInfo, parsedJson);
    if (unlocked) {
      currentPercent += percent;
    }
  });

  return (
    <div className="text-xs text-blue-200 mt-1 font-normal">
      {`${formatPercent(currentPercent)} / ${formatPercent(maxPercent)}`}
    </div>
  );
}
