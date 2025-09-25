import type { ReactNode } from "react";
import type { TabRenderProps } from "./types";
import { CATEGORIES, isItemUnlockedInPlayerSave } from "../parsers/dictionary";

const JOURNAL_CATEGORY_NAME = "Hunter's Journal";

export function HuntersJournalTab({ parsedJson, decrypted }: TabRenderProps) {
  if (!decrypted || !parsedJson) {
    return <div className="text-white text-center">Load a save file to view the hunter's journal.</div>;
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
              <th className="px-2 py-1 min-w-[120px] max-w-[220px]">Name</th>
              <th className="px-2 py-1 min-w-[100px] max-w-[150px] text-center">Kills Required</th>
              <th className="px-2 py-1 min-w-[100px] max-w-[150px] text-center">Kills Achieved</th>
            </tr>
          </thead>
          <tbody>
            {journalEntries.map((entry, index) => {
              const {  unlocked , returnValue: killsAchieved  } = isItemUnlockedInPlayerSave(entry.parsingInfo, parsedJson);
              return (
                <tr key={index} className="border-b border-gray-700 last:border-b-0">
                  <td className="px-2 py-1 text-center w-[56px] align-middle">
                    <span className={unlocked ? "text-green-400" : "text-red-400"}>{unlocked ? "[x]" : "[ ]"}</span>
                  </td>
                  <td className="px-2 py-1 text-center w-[56px] align-middle">
                    <span className="text-xs text-blue-200 mt-1 font-normal" />
                  </td>
                  <td className="px-2 py-1 min-w-[120px] max-w-[220px] truncate">{entry.name}</td>
                  <td className="px-2 py-1 min-w-[100px] max-w-[150px] text-center">
                    {entry.killsRequired ?? "N/A"}
                  </td>
                  <td className="px-2 py-1 min-w-[100px] max-w-[150px] text-center">
                    {killsAchieved}
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

export function getHuntersJournalExtra({ parsedJson, decrypted }: { parsedJson: unknown; decrypted: boolean }): ReactNode {
  if (!decrypted || !parsedJson) {
    return null;
  }

  const journalCategory = CATEGORIES.find(cat => cat.name === JOURNAL_CATEGORY_NAME);
  const journalEntries = journalCategory?.items ?? [];

  if (journalEntries.length === 0) {
    return null;
  }

  let unlockedEntry = 0;

  journalEntries.forEach(entry => {
    const {  returnValue: killsAchieved  } = isItemUnlockedInPlayerSave(entry.parsingInfo, parsedJson);
    if (
      killsAchieved !== undefined &&
      entry.killsRequired !== undefined &&
      typeof killsAchieved === "number" &&
      killsAchieved >= entry.killsRequired
    ) {
      unlockedEntry += 1;
    }
  });

  return (
    <div className="text-xs text-blue-200 mt-1 font-normal">
      {`${unlockedEntry} / ${journalEntries.length} entries fully completed`}
    </div>
  );
}