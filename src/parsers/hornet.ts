export interface HornetInfo {
  playtime: string;
  rosaries: number;
  shellShards: number;
  healthMasks: string;
  healthMasksCompletion: number;
  silkSpools: string;
  silkSpoolsCompletion: number;
  silkHearts: string;
  silkHeartsCompletion: number;
  nailUpgrades: string;
  nailUpgradesCompletion: number;
  toolPouchUpgrades: string;
  toolPouchUpgradesCompletion: number;
  toolKitUpgrades: string;
  toolKitUpgradesCompletion: number;
  totalCompletion: number;
  maxCompletion: number;
}

function formatPlaytime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function parseHornet(json: any): HornetInfo {
  const pd = json?.playerData || {};
  // Health Masks: start with 5, each additional (up to 10) gives 1% (max 5%)
  const healthMasks = pd.maxHealth ?? 0;
  const healthMasksCompletion = Math.max(0, Math.min(healthMasks - 5, 5));
  // Silk: start with 9, each additional (up to 18) gives 1% (max 9%)
  const silkSpools = pd.silkMax ?? 0;
  const silkSpoolsCompletion = Math.max(0, Math.min(silkSpools - 9, 9));
  // Silk Hearts: each (up to 3) gives 1%
  const silkHearts = pd.silkRegenMax ?? 0;
  const silkHeartsCompletion = Math.max(0, Math.min(silkHearts, 3));
  // Nail Upgrades: each (up to 4) gives 1%
  const nailUpgrades = pd.nailUpgrades ?? 0;
  const nailUpgradesCompletion = Math.max(0, Math.min(nailUpgrades, 4));
  // Tool Pouch Upgrades: each (up to 4) gives 1%
  const toolPouchUpgrades = pd.ToolPouchUpgrades ?? 0;
  const toolPouchUpgradesCompletion = Math.max(0, Math.min(toolPouchUpgrades, 4));
  // Tool Kit Upgrades: each (up to 4) gives 1%
  const toolKitUpgrades = pd.ToolKitUpgrades ?? 0;
  const toolKitUpgradesCompletion = Math.max(0, Math.min(toolKitUpgrades, 4));
  // Total and max
  const totalCompletion = healthMasksCompletion + silkSpoolsCompletion + silkHeartsCompletion + nailUpgradesCompletion + toolPouchUpgradesCompletion + toolKitUpgradesCompletion;
  const maxCompletion = 5 + 9 + 3 + 4 + 4 + 4;
  return {
    playtime: formatPlaytime(pd.playTime ?? 0),
    rosaries: pd.geo ?? 0,
    shellShards: pd.ShellShards ?? 0,
    healthMasks: `${healthMasks}/10`,
    healthMasksCompletion,
    silkSpools: `${silkSpools}/18`,
    silkSpoolsCompletion,
    silkHearts: `${silkHearts}/3`,
    silkHeartsCompletion,
    nailUpgrades: `${nailUpgrades}/4`,
    nailUpgradesCompletion,
    toolPouchUpgrades: `${toolPouchUpgrades}/4`,
    toolPouchUpgradesCompletion,
    toolKitUpgrades: `${toolKitUpgrades}/4`,
    toolKitUpgradesCompletion,
    totalCompletion,
    maxCompletion,
  };
}