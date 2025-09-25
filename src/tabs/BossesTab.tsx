import type { ReactNode } from "react";
import type { TabRenderProps } from "./types";
import { CATEGORIES, isItemUnlockedInPlayerSave } from "../parsers/dictionary";

const BOSSES_CATEGORY_NAME = "Bosses";

export function BossesTab({ parsedJson, decrypted }: TabRenderProps) {
  if (!decrypted || !parsedJson) {
    return <div className="text-white text-center">Load a save file to view boss data.</div>;
  }

  const bossesCategory = CATEGORIES.find(cat => cat.name === BOSSES_CATEGORY_NAME);
  const bosses = bossesCategory?.items ?? [];

  return (
    <div className="text-white">
      <div className="max-w-3xl mx-auto">
        <table className="w-full table-auto border-collapse divide-y divide-gray-600">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1 w-[56px]" />
              <th className="px-2 py-1 w-[56px] text-center" />
              <th className="px-2 py-1 min-w-[120px] max-w-[220px]">Name</th>
              <th className="px-2 py-1 min-w-[140px] max-w-[260px]">Location</th>
              <th className="px-2 py-1 w-[48px]">Act</th>
              <th className="px-2 py-1 w-[64px]" />
            </tr>
          </thead>
          <tbody>
            {bosses.map((boss, index) => {
              const { unlocked } = isItemUnlockedInPlayerSave(boss.parsingInfo, parsedJson);
              return (
                <tr key={index} className="border-b border-gray-700 last:border-b-0">
                  <td className="px-2 py-1 text-center w-[56px] align-middle">
                    <span className={unlocked  ? "text-green-400" : "text-red-400"}>{unlocked ? "[x]" : "[ ]"}</span>
                  </td>
                  <td className="px-2 py-1 text-center w-[56px] align-middle">
                    <span className="text-xs text-blue-200 mt-1 font-normal"/>
                  </td>
                  <td className="px-2 py-1 min-w-[60px] max-w-[120px] truncate">{boss.name}</td>
                  <td className="px-2 py-1 relative min-w-[140px] max-w-[260px] break-words whitespace-pre-line blur-sm hover:blur-none transition duration-100">
                    {boss.location || "TODO"}
                  </td>
                  <td className="px-2 py-1 w-[48px] text-center blur-sm hover:blur-none transition duration-100">
                    {boss.whichAct}
                  </td>
                  <td className="px-2 py-1 w-[64px] text-center">
                    <button
                      className={`flex-1 min-w-[48px] py-2 rounded font-semibold transition-colors text-xs ${
                        boss.mapLink
                          ? "bg-[#24344d] text-white hover:bg-blue-600"
                          : "bg-[#24344d] text-blue-200 opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (boss.mapLink) window.open(boss.mapLink, "_blank", "noopener");
                      }}
                      disabled={!boss.mapLink}
                      tabIndex={boss.mapLink ? 0 : -1}
                    >
                      Map
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

export function getBossesExtra({ parsedJson, decrypted }: { parsedJson: unknown; decrypted: boolean }): ReactNode {
  if (!decrypted || !parsedJson) {
    return null;
  }

  const bossCategory = CATEGORIES.find(cat => cat.name === "Bosses");
  const bosses = bossCategory?.items ?? [];

  if (bosses.length === 0) {
    return null;
  }

   let unlockedCount = 0;

  bosses.forEach(boss => {
    const { unlocked } = isItemUnlockedInPlayerSave(boss.parsingInfo, parsedJson);
    if (unlocked) {
      unlockedCount += 1;
    }
  });

  return (
    <div className="text-xs text-blue-200 mt-1 font-normal">
      {`${unlockedCount} / ${bosses.length}`}
    </div>
  );
}