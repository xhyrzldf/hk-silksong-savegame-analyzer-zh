export type CrestConfig = {
  names: string[];
  displayName: string;
  completion: number;
};

const CREST_CONFIG: CrestConfig[] = [
  { names: ["Hunter", "Hunter_", "HunterCrest_Upgrade2"], displayName: "Hunter Crest", completion: 0 },
  { names: ["Reaper"], displayName: "Reaper Crest", completion: 1 },
  { names: ["Wanderer"], displayName: "Wanderer Crest", completion: 1 },
  { names: ["Warrior"], displayName: "Beast Crest", completion: 1 },
  { names: ["Witch"], displayName: "Witch Crest", completion: 1 },
  { names: ["Toolmaster"], displayName: "Architect Crest", completion: 1 },
  { names: ["Spell"], displayName: "Shaman Crest", completion: 1 },
];

export interface CrestStatus {
  name: string;
  unlocked: boolean;
  completion: number;
}

export function parseCrests(json: any): CrestStatus[] {
  const equips = json?.playerData?.ToolEquips?.savedData || [];
  return CREST_CONFIG.map(({ names, displayName, completion }) => {
    const found = equips.find((e: any) => names.includes(e?.Name));
    return {
      name: displayName,
      unlocked: !!found,
      completion,
    };
  });
}