export interface AncestralArtsInfo {
  name: string;
  unlocked: boolean;
  completion: number;
}

export function parseAncestralArts(json: any): AncestralArtsInfo[] {
  const pd = json?.playerData || {};
  return [
    {
      name: 'Swift Step (Dash / Sprint)',
      unlocked: !!pd.hasDash,
      completion: 1,
    },
    {
      name: "Drifter's Cloak (Glide)",
      unlocked: false, // Not yet found in json
      completion: 0,
    },
    {
      name: 'Clawline (Needle Harpoon)',
      unlocked: !!pd.hasNeedleThrow || !!pd.hasHarpoonDash,
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
      unlocked: !!pd.hasChargeSlash || !!pd.hasNeedleThrow,
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
      unlocked: false, // Not yet found in json
      completion: 1,
    },
  ];
}
