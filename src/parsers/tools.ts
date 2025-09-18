export interface ToolStatus {
  index: number;
  name: string;
  unlocked: boolean;
  completion?: number; // Optional completion value
}

export interface ToolSection {
  section: string;
  tools: ToolStatus[];
}

type ToolConfigEntry = {
  names: string[];
  displayName: string;
  section: 'Silk Skills' | 'Attack Tools' | 'Defense Tools' | 'Explore Tools';
  completion?: number; // Optional completion value
};

const TOOL_CONFIG: ToolConfigEntry[] = [
  // White Tools
    { names: ['Silk Spear'], displayName: 'Silkspear', section: 'Silk Skills', completion: 1 },
    { names: ['Thread Sphere'], displayName: 'Thread Storm', section: 'Silk Skills', completion: 1 },
    { names: ['Parry'], displayName: 'Cross Stitch', section: 'Silk Skills', completion: 1 },
    { names: ['Silk Charge'], displayName: 'Sharpdart', section: 'Silk Skills', completion: 1 },
    { names: ['Silk Bomb'], displayName: 'Rune Rage', section: 'Silk Skills', completion: 1 },
    { names: ['Silk Boss Needle'], displayName: 'Pale Nails', section: 'Silk Skills', completion: 1 },
  
  // Red Tools
    { names: ['Straight Pin'], displayName: 'Straight Pin', section: 'Attack Tools', completion: 1 },
    { names: ['Tri Pin'], displayName: 'Threefold Pin', section: 'Attack Tools', completion: 1 },
    { names: ['Sting Shard'], displayName: 'Sting Shard', section: 'Attack Tools', completion: 1 },
    { names: ['Tack'], displayName: 'Tacks', section: 'Attack Tools', completion: 1 },
    { names: ['Harpoon'], displayName: 'Longpin', section: 'Attack Tools', completion: 1 },
    { names: ['Curve Claws','Curve Claws Upgraded'], displayName: 'Curveclaw / Curvesickle', section: 'Attack Tools', completion: 1 },
    { names: ['Shakra Ring'], displayName: 'Throwing Ring', section: 'Attack Tools', completion: 1 },
    { names: ['Pimpilo'], displayName: 'Pimpillo', section: 'Attack Tools', completion: 1 },
    { names: ['Conch Drill'], displayName: 'Conchcutter', section: 'Attack Tools', completion: 1 },
    { names: ['WebShot Architect','WebShot Weaver','WebShot Forge'], displayName: 'Silkshot', section: 'Attack Tools', completion: 1 },
    { names: ['Screw Attack'], displayName: "Delver's Drill", section: 'Attack Tools', completion: 1 },
    { names: ['Cogwork Saw'], displayName: 'Cogwork Wheel', section: 'Attack Tools', completion: 1 },
    { names: ['Cogwork Flier'], displayName: 'Cogfly', section: 'Attack Tools', completion: 1 },
    { names: ['Rosary Cannon'], displayName: 'Rosary Cannon', section: 'Attack Tools', completion: 1 },
    { names: ['Lightning Rod'], displayName: 'Voltvessels', section: 'Attack Tools', completion: 1 },
    { names: ['Flintstone'], displayName: 'Flintslate', section: 'Attack Tools', completion: 1 },
    { names: ['Flea Brew'], displayName: 'Flea Brew', section: 'Attack Tools', completion: 1 },
    { names: ['Lifeblood Syringe'], displayName: 'Plasmium Phial', section: 'Attack Tools', completion: 1 },
    { names: ['Extractor'], displayName: 'Needle Phial', section: 'Attack Tools', completion: 0 },
    { names: ['Silk Snare'], displayName: 'Snare Setter', section: 'Attack Tools', completion: 0 },
  
  // Blue Tools
    { names: ['Mosscreep Tool 1','Mosscreep Tool 2'], displayName: "Druid's Eye / Druid's Eyes", section: 'Defense Tools', completion: 1 },
    { names: ['Lava Charm'], displayName: 'Magma Bell', section: 'Defense Tools', completion: 1 },
    { names: ['Bell Bind'], displayName: 'Warding Bell', section: 'Defense Tools', completion: 1 },
    { names: ['Poison Pouch'], displayName: 'Pollip Pouch', section: 'Defense Tools', completion: 1 },
    { names: ['Fractured Mask'], displayName: 'Fractured Mask', section: 'Defense Tools', completion: 1 },
    { names: ['Multibind'], displayName: 'Multibinder', section: 'Defense Tools', completion: 1 },
    { names: ['White Ring'], displayName: 'Weavelight', section: 'Defense Tools', completion: 1 },
    { names: ['Brolly Spike'], displayName: 'Sawtooth Circlet', section: 'Defense Tools', completion: 1 },
    { names: ['Quickbind'], displayName: 'Injector Band', section: 'Defense Tools', completion: 1 },
    { names: ['Spool Extender'], displayName: 'Spool Extender', section: 'Defense Tools', completion: 1 },
    { names: ['Reserve Bind'], displayName: 'Reserve Bind', section: 'Defense Tools', completion: 1 },
    { names: ['Dazzle Bind','Dazzle Bind Upgraded'], displayName: 'Claw Mirror / Claw Mirrors', section: 'Defense Tools', completion: 1 },
    { names: ['Revenge Crystal'], displayName: 'Memory Crystal', section: 'Defense Tools', completion: 1 },
    { names: ['Thief Claw'], displayName: 'Snitch Pick', section: 'Defense Tools', completion: 1 },
    { names: ['Zap Imbuement'], displayName: 'Volt Filament', section: 'Defense Tools', completion: 1 },
    { names: ['Quick Sling'], displayName: 'Quick Sling', section: 'Defense Tools', completion: 1 },
    { names: ['Maggot Charm'], displayName: 'Wreath of Purity', section: 'Defense Tools', completion: 1 },
    { names: ['Longneedle'], displayName: 'Longclaw', section: 'Defense Tools', completion: 1 },
    { names: ['Wisp Lantern'], displayName: 'Wispfire Latern', section: 'Defense Tools', completion: 1 },
    { names: ['Flea Charm'], displayName: 'Egg of Flealia', section: 'Defense Tools', completion: 1 },
    { names: ['Pinstress Tool'], displayName: 'Pin Badge', section: 'Defense Tools', completion: 1 },


  // Yellow Tools
    { names: ['Compass'], displayName: 'Compass', section: 'Explore Tools', completion: 1 },
    { names: ['Bone Necklace'], displayName: 'Shard Pendant', section: 'Explore Tools', completion: 1 },
    { names: ['Rosary Magnet'], displayName: 'Magnetite Brooch', section: 'Explore Tools', completion: 1 },
    { names: ['Weighted Anklet'], displayName: 'Weighted Belt', section: 'Explore Tools', completion: 1 },
    { names: ['Barbed Wire'], displayName: 'Barbed Bracelet', section: 'Explore Tools', completion: 1 },
    { names: ['Dead Mans Purse','Shell Satchel'], displayName: "Dead Bug's Purse / Shell Satchel", section: 'Explore Tools', completion: 1 },
    { names: ['Magnetite Dice'], displayName: 'Magnetite Dice', section: 'Explore Tools', completion: 1 },
    { names: ['Scuttlebrace'], displayName: 'Scuttlebrace', section: 'Explore Tools', completion: 1 },
    { names: ['Wallcling'], displayName: "Ascendant's Grip", section: 'Explore Tools', completion: 1 },
    { names: ['Musician Charm'], displayName: 'Spider Strings', section: 'Explore Tools', completion: 1 },
    { names: ['Sprintmaster'], displayName: 'Silkspeed Anklets', section: 'Explore Tools', completion: 1 },
    { names: ['Thief Charm'], displayName: "Thief's Mark", section: 'Explore Tools', completion: 1 },
];

export function parseTools(json: any): ToolSection[] {
  const tools = json?.playerData?.Tools?.savedData || [];
  // Group by section
  const sectionMap: Record<string, ToolStatus[]> = {};
  for (const { names, displayName, section, completion } of TOOL_CONFIG) {
    const foundTool = tools.find((t: any) => names.includes(t?.Name));
    if (!sectionMap[section]) sectionMap[section] = [];
    sectionMap[section].push({
      index: foundTool?.Index ?? -1,
      name: displayName,
      unlocked: !!foundTool?.Data?.IsUnlocked,
      completion,
    });
  }
  return Object.entries(sectionMap).map(([section, tools]) => ({ section, tools }));
}
