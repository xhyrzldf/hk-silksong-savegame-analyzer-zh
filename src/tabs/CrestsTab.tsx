import { parsers } from "../parsers";
import type { TabRenderProps } from "./types";

export function CrestsTab({ parsedJson }: TabRenderProps) {
  if (!parsedJson) {
    return <div className="text-red-300 text-center">Invalid or no JSON loaded.</div>;
  }

  const crests = parsers.Crests(parsedJson);

  return (
    <div className="text-white">
      <h2 className="text-lg font-bold mb-2 text-center">Crests</h2>
      <ul className="max-w-md mx-auto divide-y divide-gray-600">
        {crests.map((crest: any, index: number) => (
          <li key={index} className="flex items-center justify-between py-2 px-2">
            <span>{crest.name}</span>
            <span className="flex items-center min-w-[48px] justify-end">
              <span className={crest.unlocked ? "text-green-400" : "text-red-400"}>
                {crest.unlocked ? "[x]" : "[ ]"}
              </span>
              <span className="inline-block w-10 text-xs text-blue-300 font-mono text-right">
                {crest.completion > 0 ? `+${crest.completion}%` : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function getCrestsExtra(parsedJson: unknown) {
  if (!parsedJson) return null;
  const crests = parsers.Crests(parsedJson);
  const unlocked = crests
    .filter((crest: any) => crest.unlocked)
    .reduce((sum: number, crest: any) => sum + (crest.completion || 0), 0);
  const total = crests.reduce((sum: number, crest: any) => sum + (crest.completion || 0), 0);

  return (
    <div className="text-xs text-blue-200 mt-1 font-normal">
      {unlocked}% / {total}%
    </div>
  );
}
