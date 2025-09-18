export interface AncestralArtsInfo {
  name: string;
  unlocked: boolean;
  completion: number;
}

export function parseAncestralArts(json: any): AncestralArtsInfo[] {
  const pd = json?.playerData || {};
  const collectables = pd.Collectables?.savedData || [];
  const everbloom = collectables.find((c: any) => c?.Name === "White Flower" && c?.Data?.Amount === 1);
  return [
    {
      name: 'Swift Step (Dash / Sprint)',
      unlocked: !!pd.hasDash,
      completion: 1,
    },
    {
      name: "Drifter's Cloak (Glide)",
      unlocked: !!pd.hasBrolly,
      completion: 0,
    },
    {
      name: 'Clawline (Needle Harpoon)',
      unlocked: !!pd.hasNeedleThrow, // Not sure yet (maybe pd.hasHarpoonDash)
      completion: 1,
    },
    {
      name: 'Cling Grip (Walljump)',
      unlocked: !!pd.hasWalljump,
      completion: 1,
    },
    {
      name: 'Needolin',
      unlocked: !!pd.hasNeedolin,
      completion: 1,
    },
    {
      name: 'Needle Strike',
      unlocked: !!pd.hasChargeSlash, // Not sure yet
      completion: 1,
    },
    {
      name: 'Faydown Cloak (Double Jump)',
      unlocked: !!pd.hasDoubleJump,
      completion: 0,
    },
    {
      name: 'Silk Soar (Highjump)',
      unlocked: !!pd.hasSuperJump,
      completion: 1,
    },
    {
      name: 'Sylphsong',
      unlocked: !!pd.HasBoundCrestUpgrader,
      completion: 1,
    },
    {
      name: 'Everbloom',
      unlocked: !!everbloom,
      completion: 1,
    },
  ];
}
