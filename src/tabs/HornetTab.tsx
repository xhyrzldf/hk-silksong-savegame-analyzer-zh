import { parsers } from "../parsers";
import type { TabRenderProps } from "./types";

export function HornetTab({ parsedJson }: TabRenderProps) {
  if (!parsedJson) {
    return <div className="text-red-300 text-center">Invalid or no JSON loaded.</div>;
  }

  const hornet = parsers.Hornet(parsedJson);
  const items = [
    { label: "Playtime", value: hornet.playtime },
    { label: "Rosaries", value: hornet.rosaries },
    { label: "Shell Shards", value: hornet.shellShards },
    { label: "Health Masks", value: hornet.healthMasks, completion: hornet.healthMasksCompletion, max: 5 },
    { label: "Silk Spools", value: hornet.silkSpools, completion: hornet.silkSpoolsCompletion, max: 9 },
    { label: "Silk Hearts", value: hornet.silkHearts, completion: hornet.silkHeartsCompletion, max: 3 },
    { label: "Nail Upgrades", value: hornet.nailUpgrades, completion: hornet.nailUpgradesCompletion, max: 4 },
    { label: "Tool Pouch Upgrades", value: hornet.toolPouchUpgrades, completion: hornet.toolPouchUpgradesCompletion, max: 4 },
    { label: "Tool Kit Upgrades", value: hornet.toolKitUpgrades, completion: hornet.toolKitUpgradesCompletion, max: 4 },
  ];

  return (
    <div className="text-white">
      <h2 className="text-lg font-bold mb-2 text-center">Hornet</h2>
      <ul className="max-w-md mx-auto divide-y divide-gray-600">
        {items.map(item => (
          <li key={item.label} className="flex items-center justify-between py-2 px-2">
            <span>{item.label}</span>
            <span className="flex items-center min-w-[48px] justify-end">
              <span className="font-mono">{item.value}</span>
              <span className="inline-block w-16 text-xs text-blue-300 font-mono text-right ml-2">
                {typeof item.completion === "number" && typeof item.max === "number"
                  ? `+${item.completion}% / ${item.max}%`
                  : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function getHornetExtra(parsedJson: unknown) {
  if (!parsedJson) return null;
  const hornet = parsers.Hornet(parsedJson);
  return (
    <div className="text-xs text-blue-200 mt-1 font-normal">
      {hornet.totalCompletion}% / {hornet.maxCompletion}%
    </div>
  );
}
