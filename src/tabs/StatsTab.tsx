function formatSecondsToHMS(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':');
}
import { CATEGORIES, isItemUnlockedInPlayerSave } from "../parsers/dictionary";
import type { TabRenderProps } from "./types";

export function StatsTab({ parsedJson, decrypted }: TabRenderProps) {
  if (!decrypted || !parsedJson) {
    return <div className="text-white text-center">Load a save file to view mask shard data.</div>;
  }

  const statsCategory = CATEGORIES.find(cat => cat.name === "Stats");
  const stats = statsCategory?.items ?? [];

  return (
    <div className="text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center">
          <table className="table-auto border-collapse divide-y divide-gray-600" style={{ minWidth: 0 }}>
            <thead>
              <tr className="text-left">
                <th className="px-2 py-1 whitespace-nowrap"></th>
                <th className="px-2 py-1 w-[100px] text-center whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item, index) => {
                const { returnValue } = isItemUnlockedInPlayerSave(item.parsingInfo, parsedJson);
                let displayValue: string | number | undefined = returnValue;
                if (item.name.toLowerCase() === 'playtime' && typeof returnValue === 'number') {
                  displayValue = formatSecondsToHMS(returnValue);
                }
                return (
                  <tr key={index} className="border-b border-gray-700 last:border-b-0">      
                    <td className="px-2 py-1 truncate whitespace-nowrap">{item.name}</td>
                    <td className="px-2 py-1 w-[100px] text-center whitespace-nowrap">{displayValue !== undefined ? String(displayValue) : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
