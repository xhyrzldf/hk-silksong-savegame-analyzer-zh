export interface RelicInfo {
  name: string;
  unlocked: boolean;
}

const RELIC_NAMES = [
  "Bone Record Bone_East_14",
  "Bone Record Greymoor_flooded_corridor",
  "Psalm Cylinder Grindle",
  "Seal Chit Ward Corpse",
  "Psalm Cylinder Hang",
  "Psalm Cylinder Librarian",
  "Librarian Melody Cylinder",
  "Weaver Totem Slab_Bottom",
  "Weaver Record Weave_08",
  "Seal Chit Aspid_01",
  "Bone Record Wisp Top",
  "Psalm Cylinder Library Roof",
  "Seal Chit City Merchant",
  "Weaver Totem Witch",
  "Ancient Egg Abyss Middle",
  "Weaver Totem Bonetown_upper_room",
  "Seal Chit Silk Siphon",
  "Psalm Cylinder Ward",
  "Weaver Record Sprint_Challenge",
];

export function parseRelics(json: any): RelicInfo[] {
  const relics = json?.playerData?.Relics?.savedData || [];
  return RELIC_NAMES.map(name => {
    const found = relics.find((r: any) => r?.Name === name);
    return {
      name,
      unlocked: !!found?.Data?.IsCollected,
    };
  });
}
