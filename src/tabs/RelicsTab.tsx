import { parsers } from "../parsers";
import type { TabRenderProps } from "./types";

export function RelicsTab({ parsedJson }: TabRenderProps) {
  if (!parsedJson) {
    return <div className="text-red-300 text-center">Invalid or no JSON loaded.</div>;
  }

  const relics = parsers.Relics(parsedJson);

  return (
    <div className="text-white">
      <h2 className="text-lg font-bold mb-2 text-center">Relics</h2>
      <ul className="max-w-md mx-auto divide-y divide-gray-600">
        {relics.map((relic: any, index: number) => (
          <li key={index} className="flex items-center justify-between py-2 px-2">
            <span>{relic.name}</span>
            <span className="flex items-center min-w-[48px] justify-end">
              <span className={relic.unlocked ? "text-green-400" : "text-red-400"}>
                {relic.unlocked ? "[x]" : "[ ]"}
              </span>
              <span className="inline-block w-10 text-xs text-blue-300 font-mono text-right">
                {relic.completion > 0 ? `+${relic.completion}%` : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function getRelicsExtra(parsedJson: unknown) {
  if (!parsedJson) return null;
  const relics = parsers.Relics(parsedJson);
  const unlocked = relics
    .filter((relic: any) => relic.unlocked)
    .reduce((sum: number, relic: any) => sum + (relic.completion || 0), 0);
  const total = relics.reduce((sum: number, relic: any) => sum + (relic.completion || 0), 0);

  return (
    <div className="text-xs text-blue-200 mt-1 font-normal">
      {unlocked}% / {total}%
    </div>
  );
}
