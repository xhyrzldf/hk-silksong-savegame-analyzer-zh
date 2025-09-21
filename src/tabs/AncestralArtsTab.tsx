import { parsers } from "../parsers";
import type { TabRenderProps } from "./types";

export function AncestralArtsTab({ parsedJson }: TabRenderProps) {
  if (!parsedJson) {
    return <div className="text-red-300 text-center">Invalid or no JSON loaded.</div>;
  }

  const arts = parsers.AncestralArts(parsedJson);

  return (
    <div className="text-white">
      <h2 className="text-lg font-bold mb-2 text-center">Ancestral Arts</h2>
      <ul className="max-w-md mx-auto divide-y divide-gray-600">
        {arts.map((art: any, index: number) => (
          <li key={index} className="flex items-center justify-between py-2 px-2">
            <span>{art.name}</span>
            <span className="flex items-center min-w-[48px] justify-end">
              <span className={art.unlocked ? "text-green-400" : "text-red-400"}>
                {art.unlocked ? "[x]" : "[ ]"}
              </span>
              <span className="inline-block w-10 text-xs text-blue-300 font-mono text-right">
                {art.completion > 0 ? `+${art.completion}%` : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function getAncestralArtsExtra(parsedJson: unknown) {
  if (!parsedJson) return null;
  const arts = parsers.AncestralArts(parsedJson);
  const unlocked = arts
    .filter((art: any) => art.unlocked)
    .reduce((sum: number, art: any) => sum + (art.completion || 0), 0);
  const total = arts.reduce((sum: number, art: any) => sum + (art.completion || 0), 0);

  return (
    <div className="text-xs text-blue-200 mt-1 font-normal">
      {unlocked}% / {total}%
    </div>
  );
}
