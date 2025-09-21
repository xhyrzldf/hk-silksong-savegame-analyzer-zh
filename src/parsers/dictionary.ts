export type FlagParsingInfo = { type: 'flag'; internalId: string };
export type FlagIntParsingInfo = { type: 'flagInt'; internalId: [string, number] };
export type ToolParsingInfo = { type: 'tool'; internalId: string[] };
export type CrestParsingInfo = { type: 'crest'; internalId: string };
export type CollectableParsingInfo = { type: 'collectable'; internalId: string };
export type RelictParsingInfo = { type: 'relict'; internalId: string };
export type QuestParsingInfo = { type: 'quest'; internalId: string };
export type SceneDataParsingInfo = { type: 'sceneData'; internalId: [string, string] };
export type ParsingInfo = FlagParsingInfo | FlagIntParsingInfo | ToolParsingInfo | CrestParsingInfo | CollectableParsingInfo | RelictParsingInfo |QuestParsingInfo | SceneDataParsingInfo;

export type CategoryItem = {
  name: string;
  section?: string;
  whichAct: 0 | 1 | 2 | 3;
  completionPercent: number;
  prereqs: string[];
  location: string;
  parsingInfo: ParsingInfo;
  mapLink: string;
};

export type CollectableCategory = {
  name: string;
  description: string;
  items: CategoryItem[];
};

export const CATEGORIES: CollectableCategory[] = [
  {
    name: 'Mask Shards',
    description: 'Each mask shard counts 0.25% towards completion.',
    items: [
      { name: 'Mask Shard 1', whichAct: 1, completionPercent: 0.25, prereqs: [], location: 'Purchased from Bonebottom', parsingInfo: { type: 'flag', internalId: 'PurchasedBonebottomHeartPiece' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477840' },
      { name: 'Mask Shard 2', whichAct: 1, completionPercent: 0.25, prereqs: ['Swift Step'], location: 'Behind a breakable wall in the Wormways', parsingInfo: { type: 'sceneData', internalId: ['Crawl_02', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478091' },
      { name: 'Mask Shard 3', whichAct: 1, completionPercent: 0.25, prereqs: ['Drifters cloak'], location: 'Left of the seamstress', parsingInfo: { type: 'sceneData', internalId: ['Bone_East_20', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477975' },
      { name: 'Mask Shard 4', whichAct: 1, completionPercent: 0.25, prereqs: [], location: 'At the end of a parkour section in Shellwood', parsingInfo: { type: 'sceneData', internalId: ['Shellwood_14', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478177' },
      { name: 'Mask Shard 5', whichAct: 1, completionPercent: 0.25, prereqs: ['Cling Grip'], location: 'Near the Deep Docks entrance in the Marrow', parsingInfo: { type: 'sceneData', internalId: ['Dock_08', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477901' },
      { name: 'Mask Shard 6', whichAct: 1, completionPercent: 0.25, prereqs: ['Needolin'], location: 'Behind a breakable wall in Weavenest Atla', parsingInfo: { type: 'sceneData', internalId: ['Weave_05b', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478233' },
      { name: 'Mask Shard 7', whichAct: 1, completionPercent: 0.25, prereqs: [], location: 'Reward for the Savage Beastfly quest obtainable in Bellhart', parsingInfo: { type: 'quest', internalId: 'Beastfly Hunt' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478800' },
      { name: 'Mask Shard 8', whichAct: 2, completionPercent: 0.25, prereqs: [], location: 'Left of the Cogwork Core', parsingInfo: { type: 'sceneData', internalId: ['Song_09', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478615' },
      { name: 'Mask Shard 9', whichAct: 2, completionPercent: 0.25, prereqs: [], location: 'Whispering Vaults', parsingInfo: { type: 'sceneData', internalId: ['Library_05', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478671' },
      { name: 'Mask Shard 10', whichAct: 2, completionPercent: 0.25, prereqs: ['Clawline'], location: 'At the end of some long corridors in Bilewater', parsingInfo: { type: 'sceneData', internalId: ['Shadow_13', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478849' },
      { name: 'Mask Shard 11', whichAct: 2, completionPercent: 0.25, prereqs: ['Clawline'], location: 'Within the Skull Cavern in the Far Fields', parsingInfo: { type: 'sceneData', internalId: ['Bone_East_LavaChallenge', 'Heart Piece (1)'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478841' },
      { name: 'Mask Shard 12', whichAct: 2, completionPercent: 0.25, prereqs: [], location: 'At the end of a parkour section in the Slab behind a lock which requires the Key of Apostate', parsingInfo: { type: 'sceneData', internalId: ['Slab_17', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479001' },
      { name: 'Mask Shard 13', whichAct: 2, completionPercent: 0.25, prereqs: ['Faydown Cloak'], location: 'Left of the toll bench in Mount Fay', parsingInfo: { type: 'sceneData', internalId: ['Peak_04c', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479038' },
      { name: 'Mask Shard 14', whichAct: 2, completionPercent: 0.25, prereqs: ['Faydown Cloak'], location: 'Right of the Wisp Thicket', parsingInfo: { type: 'sceneData', internalId: ['Wisp_07', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479151' },
      { name: 'Mask Shard 15', whichAct: 2, completionPercent: 0.25, prereqs: [], location: 'Purchased from Jubilana', parsingInfo: { type: 'flag', internalId: 'MerchantEnclaveShellFragment' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478879' },
      { name: 'Mask Shard 16', whichAct: 2, completionPercent: 0.25, prereqs: ['Faydown Cloak'], location: 'Left part of the Blasted Steps', parsingInfo: { type: 'sceneData', internalId: ['Coral_19b', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478498' },
      { name: 'Mask Shard 17', whichAct: 3, completionPercent: 0.25, prereqs: [], location: 'Reward for the Fastest in Pharloom quest', parsingInfo: { type: 'quest', internalId: 'Sprintmaster Race' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479194' },
      { name: 'Mask Shard 18', whichAct: 3, completionPercent: 0.25, prereqs: [], location: 'Reward for the Hidden Hunter quest', parsingInfo: { type: 'quest', internalId: 'Ant Trapper' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479447' },
      { name: 'Mask Shard 19', whichAct: 3, completionPercent: 0.25, prereqs: [], location: 'Reward for the Dark Hearts quest', parsingInfo: { type: 'quest', internalId: 'Destroy Thread Cores' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479449' },
      { name: 'Mask Shard 20', whichAct: 3, completionPercent: 0.25, prereqs: ['Silk Soar'], location: 'At the top of Brightvein in Mount Fay', parsingInfo: { type: 'sceneData', internalId: ['Peak_06', 'Heart Piece'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479460' },
    ],
  },
  {
    name: 'Spool Fragments',
    description: 'Each Spool Fragment counts 0.5% towards completion.',
    items: [
      { name: 'Spool Fragment 1', whichAct: 1, completionPercent: 0.5, prereqs: [], location: 'Above the Bonebottom settlement', parsingInfo: { type: 'sceneData', internalId: ['Bone_11b', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478080' },
      { name: 'Spool Fragment 2', whichAct: 1, completionPercent: 0.5, prereqs: [], location: 'At the end of a long room in the Deep Docks', parsingInfo: { type: 'sceneData', internalId: ['Bone_East_13', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477926' },
      { name: 'Spool Fragment 3', whichAct: 1, completionPercent: 0.5, prereqs: ['Cling Grip'], location: 'In Greymoor, right and up of the Bell bench', parsingInfo: { type: 'sceneData', internalId: ['Greymoor_02', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478263' },
      { name: 'Spool Fragment 4', whichAct: 1, completionPercent: 0.5, prereqs: ['Cling Grip'], location: 'In the Slab, top of a frosty section to the left', parsingInfo: { type: 'sceneData', internalId: ['Peak_01', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478475' },
      { name: 'Spool Fragment 5', whichAct: 1, completionPercent: 0.5, prereqs: ['Needolin'], location: 'Behind a breakable wall in Weavenest Atla', parsingInfo: { type: 'sceneData', internalId: ['Weave_11', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478230' },
      { name: 'Spool Fragment 6', whichAct: 1, completionPercent: 0.5, prereqs: ['Needolin'], location: 'Purchased from Frey after completing the mission "My Missing Courier"', parsingInfo: { type: 'flag', internalId: 'PurchasedBelltownSpoolSegment' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478347' },
      { name: 'Spool Fragment 7', whichAct: 2, completionPercent: 0.5, prereqs: [], location: 'Fleamaster reward (Caravan Location 2, 14 Fleas)', parsingInfo: { type: 'flagInt', internalId: ['CaravanTroupeLocation', 2] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478820' },
      { name: 'Spool Fragment 8', whichAct: 2, completionPercent: 0.5, prereqs: [], location: 'Bottom-right of the Cogwork Core', parsingInfo: { type: 'sceneData', internalId: ['Cog_07', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478618' },
      { name: 'Spool Fragment 9', whichAct: 2, completionPercent: 0.5, prereqs: [], location: 'Right of the Underworks', parsingInfo: { type: 'sceneData', internalId: ['Library_11b', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478704' },
      { name: 'Spool Fragment 10', whichAct: 2, completionPercent: 0.5, prereqs: [], location: 'Top of the Grand Gate room', parsingInfo: { type: 'sceneData', internalId: ['Song_19_entrance', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478586' },
      { name: 'Spool Fragment 11', whichAct: 2, completionPercent: 0.5, prereqs: [], location: 'Behind a Arena battle in the Underworks', parsingInfo: { type: 'sceneData', internalId: ['Under_10', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478931' },
      { name: 'Spool Fragment 12', whichAct: 2, completionPercent: 0.5, prereqs: [], location: 'Bottom of the elevator shaft in Whiteward. Requires lift to be called up first.', parsingInfo: { type: 'sceneData', internalId: ['Ward_01', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479317' },
      { name: 'Spool Fragment 13', whichAct: 2, completionPercent: 0.5, prereqs: [], location: 'Balm for The Wounded quest reward', parsingInfo: { type: 'quest', internalId: 'Save Sherma' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479180' },
      { name: 'Spool Fragment 14', whichAct: 2, completionPercent: 0.5, prereqs: [], location: 'Bottom-right of the Deep Docks', parsingInfo: { type: 'sceneData', internalId: ['Dock_03c', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478825' },
      { name: 'Spool Fragment 15', whichAct: 2, completionPercent: 0.5, prereqs: ['Clawline'], location: 'Top of the High Halls', parsingInfo: { type: 'sceneData', internalId: ['Hang_03_top', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478909' },
      { name: 'Spool Fragment 16', whichAct: 2, completionPercent: 0.5, prereqs: ['Faydown Cloak'], location: 'Left part of the Memorium', parsingInfo: { type: 'sceneData', internalId: ['Arborium_09', 'Silk Spool'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479117' },
      { name: 'Spool Fragment 17', whichAct: 2, completionPercent: 0.5, prereqs: ['Faydown Cloak'], location: 'Purchased from Grindle in Blasted Steps', parsingInfo: { type: 'flag', internalId: 'purchasedGrindleSpoolPiece' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478527' },
      { name: 'Spool Fragment 18', whichAct: 2, completionPercent: 0.5, prereqs: ['Faydown Cloak'], location: 'Purchased from Jubilana after saving her as part of the The Lost Merchant quest', parsingInfo: { type: 'flag', internalId: 'MerchantEnclaveSpoolPiece' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479249' },
  ],
  },
  {
    name: 'Tools',
    description: 'Nearly every Tool counts 1% towards completion.',
    items: [
      //White Tools
      { name: 'Silkspear', section: 'Silk Skills', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Silk Spear'] }, mapLink: '' },
      { name: 'Thread Storm', section: 'Silk Skills', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Thread Sphere'] }, mapLink: '' },
      { name: 'Cross Stitch', section: 'Silk Skills', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Parry'] }, mapLink: '' },
      { name: 'Sharpdart', section: 'Silk Skills', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Silk Charge'] }, mapLink: '' },
      { name: 'Rune Rage', section: 'Silk Skills', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Silk Bomb'] }, mapLink: '' },
      { name: 'Pale Nails', section: 'Silk Skills', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Silk Boss Needle'] }, mapLink: '' },
      
      //Red Tools
      { name: 'Straight Pin', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Straight Pin'] }, mapLink: '' },
      { name: 'Threefold Pin', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Tri Pin'] }, mapLink: '' },
      { name: 'Sting Shard', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Sting Shard'] }, mapLink: '' },
      { name: 'Tacks', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Tack'] }, mapLink: '' },
      { name: 'Longpin', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Harpoon'] }, mapLink: '' },
      { name: 'Curveclaw / Curvesickle', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Curve Claws','Curve Claws Upgraded'] }, mapLink: '' },
      { name: 'Throwing Ring', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Shakra Ring'] }, mapLink: '' },
      { name: 'Pimpillo', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Pimpilo'] }, mapLink: '' },
      { name: 'Conchcutter', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Conch Drill'] }, mapLink: '' },
      { name: 'Silkshot', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['WebShot Forge', 'WebShot Architect', 'WebShot Weaver'] }, mapLink: '' },
      { name: "Delver's Drill", section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Screw Attack'] }, mapLink: '' },
      { name: 'Cogwork Wheel', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Cogwork Saw'] }, mapLink: '' },
      { name: 'Cogfly', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Cogwork Flier'] }, mapLink: '' },
      { name: 'Rosary Cannon', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Rosary Cannon'] }, mapLink: '' },
      { name: 'Voltvessels', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Lightning Rod'] }, mapLink: '' },
      { name: 'Flintslate', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Flintstone'] }, mapLink: '' },
      { name: 'Flea Brew', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Flea Brew'] }, mapLink: '' },
      { name: 'Plasmium Phial', section: 'Attack Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Lifeblood Syringe'] }, mapLink: '' },
      { name: 'Needle Phial', section: 'Attack Tools', whichAct: 0, completionPercent: 0, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Extractor'] }, mapLink: '' },
      { name: 'Snare Setter', section: 'Attack Tools', whichAct: 0, completionPercent: 0, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Silk Snare'] }, mapLink: '' },
      
      // Blue Tools
      { name: "Druid's Eye / Druid's Eyes", section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Mosscreep Tool 1','Mosscreep Tool 2'] }, mapLink: '' },
      { name: 'Magma Bell', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Lava Charm'] }, mapLink: '' },
      { name: 'Warding Bell', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Bell Bind'] }, mapLink: '' },
      { name: 'Pollip Pouch', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Poison Pouch'] }, mapLink: '' },
      { name: 'Fractured Mask', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Fractured Mask'] }, mapLink: '' },
      { name: 'Multibinder', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Multibind'] }, mapLink: '' },
      { name: 'Weavelight', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['White Ring'] }, mapLink: '' },
      { name: 'Sawtooth Circlet', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Brolly Spike'] }, mapLink: '' },
      { name: 'Injector Band', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Quickbind'] }, mapLink: '' },
      { name: 'Spool Extender', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Spool Extender'] }, mapLink: '' },
      { name: 'Reserve Bind', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Reserve Bind'] }, mapLink: '' },
      { name: 'Claw Mirror / Claw Mirrors', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Dazzle Bind', 'Dazzle Bind Upgraded'] }, mapLink: '' },
      { name: 'Memory Crystal', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Revenge Crystal'] }, mapLink: '' },
      { name: 'Snitch Pick', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Thief Claw'] }, mapLink: '' },
      { name: 'Volt Filament', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Zap Imbuement'] }, mapLink: '' },
      { name: 'Quick Sling', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Quick Sling'] }, mapLink: '' },
      { name: 'Wreath of Purity', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Maggot Charm'] }, mapLink: '' },
      { name: 'Longclaw', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Longneedle'] }, mapLink: '' },
      { name: 'Wispfire Latern', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Wisp Lantern'] }, mapLink: '' },
      { name: 'Egg of Flealia', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Flea Charm'] }, mapLink: '' },
      { name: 'Pin Badge', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Pinstress Tool'] }, mapLink: '' },
     
     // Yellow Tools
      { name: 'Compass', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Compass'] }, mapLink: '' },
      { name: 'Shard Pendant', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Bone Necklace'] }, mapLink: '' },
      { name: 'Magnetite Brooch', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Rosary Magnet'] }, mapLink: '' },
      { name: 'Weighted Belt', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Weighted Anklet'] }, mapLink: '' },
      { name: 'Barbed Bracelet', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Barbed Wire'] }, mapLink: '' },
      { name: "Dead Bug's Purse / Shell Satchel", section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Dead Mans Purse','Shell Satchel'] }, mapLink: '' },
      { name: 'Magnetite Dice', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Magnetite Dice'] }, mapLink: '' },
      { name: 'Scuttlebrace', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Scuttlebrace'] }, mapLink: '' },
      { name: "Ascendant's Grip", section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Wallcling'] }, mapLink: '' },
      { name: 'Spider Strings', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Musician Charm'] }, mapLink: '' },
      { name: 'Silkspeed Anklets', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Sprintmaster'] }, mapLink: '' },
      { name: "Thief's Mark", section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'tool', internalId: ['Thief Charm'] }, mapLink: '' },
  ],
  },
  {
    name: 'Crests',
    description: 'Each Crest counts 1% towards completion (except Hunter Crest)',
    items: [
      { name: 'Hunter Crest', whichAct: 0, completionPercent: 0, prereqs: [], location: 'TODO', parsingInfo: { type: 'crest', internalId: 'Hunter' }, mapLink: '' },
      { name: 'Hunter Crest 2', whichAct: 0, completionPercent: 0, prereqs: [], location: 'TODO', parsingInfo: { type: 'crest', internalId: 'Hunter_v2' }, mapLink: '' },
      { name: 'Hunter Crest 3', whichAct: 0, completionPercent: 0, prereqs: [], location: 'TODO', parsingInfo: { type: 'crest', internalId: 'Hunter_v3' }, mapLink: '' },
      { name: 'Reaper Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'crest', internalId: 'Reaper' }, mapLink: '' },
      { name: 'Wanderer Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'crest', internalId: 'Wanderer' }, mapLink: '' },
      { name: 'Beast Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'crest', internalId: 'Warrior' }, mapLink: '' },
      { name: 'Witch Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'crest', internalId: 'Witch' }, mapLink: '' },
      { name: 'Architect Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'crest', internalId: 'Toolmaster' }, mapLink: '' },
      { name: 'Shaman Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'crest', internalId: 'Spell' }, mapLink: '' },
  ],
  },
  {
    name: 'Ancestral Arts',
    description: 'Each Crest counts 1% towards completion (except Hunter Crest)',
    items: [
      { name: 'Swift Step (Dash / Sprint)', whichAct: 1, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flag', internalId: 'hasDash' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477915' },
      { name: 'Drifters Cloak (Glide)', whichAct: 1, completionPercent: 0, prereqs: [], location: 'TODO', parsingInfo: { type: 'flag', internalId: 'hasBrolly' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477971' },
      { name: 'Clawline (Needle Harpoon)', whichAct: 2, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flag', internalId: 'hasHarpoonDash' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478714' },
      { name: 'Cling Grip (Walljump)', whichAct: 1, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flag', internalId: 'hasWalljump' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478189' },
      { name: 'Needolin', whichAct: 1, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flag', internalId: 'hasNeedolin' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478199' },
      { name: 'Needle Strike', whichAct: 1, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flag', internalId: 'hasChargeSlash' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478510' },
      { name: 'Faydown Cloak (Double Jump)', whichAct: 2, completionPercent: 0, prereqs: ['Needoline','Clawline'], location: 'TODO', parsingInfo: { type: 'flag', internalId: 'hasDoubleJump' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479103' },
      { name: 'Silk Soar (Highjump)', whichAct: 3, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flag', internalId: 'hasSuperJump' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479288' },
      { name: 'Sylphsong', whichAct: 3, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flag', internalId: 'HasBoundCrestUpgrader' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479654' },
      { name: 'Everbloom', whichAct: 3, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'collectable', internalId: 'White Flower' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479387' },
  ],
  },
  {
    name: 'Relics',
    description: 'Relics',
    items: [
      { name: 'Choral Commandment 1', whichAct: 0, completionPercent: 0, prereqs: [], location: 'On a high-up ledge. Left from Mosshome.', parsingInfo: { type: 'relict', internalId: 'Seal Chit Aspid_01' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477867' },
      { name: 'Choral Commandment 2', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Top-Left Room of Whiteward', parsingInfo: { type: 'relict', internalId: 'Seal Chit Silk Siphon' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478914' },
      { name: 'Choral Commandment 3', whichAct: 0, completionPercent: 0, prereqs: [], location: 'At the end of a room above the Hidden Passage in Whiteward, easiest to reach via Silk Soar', parsingInfo: { type: 'relict', internalId: 'Seal Chit Ward Corpse' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478919' },
      { name: 'Choral Commandment 4', whichAct: 0, completionPercent: 0, prereqs: ['The Lost Merchant Wish completed'], location: 'Can be purchased from Jubilana (Songclave) for 210 Rosaries', parsingInfo: { type: 'relict', internalId: 'Seal Chit City Merchant' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479251' },
      
      { name: 'Weaver Effigy 1', whichAct: 0, completionPercent: 0, prereqs: [], location: 'In a secret room above Bone Bottom. Easiest to reach wit Drifters Cloak and floating down from above.', parsingInfo: { type: 'relict', internalId: 'Weaver Totem Bonetown_upper_room' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478093' },
      { name: 'Weaver Effigy 2', whichAct: 0, completionPercent: 0, prereqs: ['Cling Grip'], location: 'Shellwood Witch Tunnel', parsingInfo: { type: 'relict', internalId: 'Weaver Totem Witch' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478794' },
      { name: 'Weaver Effigy 3', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Bottom Right of the Slab. On a corpse', parsingInfo: { type: 'relict', internalId: 'Weaver Totem Slab_Bottom' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479034' },
      
      { name: 'Bone Scroll 1', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Greymore Secret Room. Swim all the way to the right', parsingInfo: { type: 'relict', internalId: 'Bone Record Greymoor_flooded_corridor' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478142' },
      { name: 'Bone Scroll 2', whichAct: 0, completionPercent: 0, prereqs: ['Drifters cloak'], location: 'Far fields secret Room. Reachable by Drifters Cloak', parsingInfo: { type: 'relict', internalId: 'Bone Record Bone_East_14' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478213' },
      { name: 'Bone Scroll 3', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Left side of Underworks behind a breakable wall', parsingInfo: { type: 'relict', internalId: 'Bone Record Understore_Map_Room' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478553' },
      { name: 'Bone Scroll 4', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Top of Wisp Thicket Platform Challange', parsingInfo: { type: 'relict', internalId: 'Bone Record Wisp Top' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479150' },
      
      { name: 'Rune Harp 1', whichAct: 1, completionPercent: 0, prereqs: [], location: 'On a high-up ledge in Weavernest Atla', parsingInfo: { type: 'relict', internalId: 'Weaver Record Weave_08' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478231' },
      { name: 'Rune Harp 2', whichAct: 1, completionPercent: 0, prereqs: [], location: 'Secret Room in Far Fields Weaver nest (Sprint Challange)', parsingInfo: { type: 'relict', internalId: 'Weaver Record Sprint_Challenge' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479057' },
      { name: 'Rune Harp 3', whichAct: 3, completionPercent: 0, prereqs: [], location: 'Where Conductor Ballador would be in Act 3.', parsingInfo: { type: 'relict', internalId: 'Weaver Record Conductor' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479495' },

      { name: 'Psalm Cylinder - Grindle', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Sold by Grindle for 240 Rosaries (Blasted Steps)', parsingInfo: { type: 'relict', internalId: 'Psalm Cylinder Grindle' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478530' },
      { name: 'Psalm Cylinder - Vaultkeeper Cardinius Lair', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Cylinder auf Vaultkeeper in Whispering Vaults', parsingInfo: { type: 'relict', internalId: 'Psalm Cylinder Librarian' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478650' },
      { name: 'Psalm Cylinder - Whispering Vaults', whichAct: 0, completionPercent: 0, prereqs: ['Clawline'], location: 'At the end of a parkour challenge at the top of the Whispering Vaults', parsingInfo: { type: 'relict', internalId: 'Psalm Cylinder Library Roof' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479717' },
      { name: 'Psalm Cylinder - High Halls', whichAct: 0, completionPercent: 0, prereqs: ['Clawline'], location: 'Behind a breakable wall in High Halls', parsingInfo: { type: 'relict', internalId: 'Psalm Cylinder Hang' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478908' },
      { name: 'Psalm Cylinder - Underworks', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Behind breakable wall at the top of Underworks', parsingInfo: { type: 'relict', internalId: 'Psalm Cylinder Ward' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478929' },
      { name: 'Sacred Cylinder', whichAct: 0, completionPercent: 0, prereqs: [], location: 'TODO', parsingInfo: { type: 'relict', internalId: 'Librarian Melody Cylinder' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479717' },
      
      { name: 'Arcane Egg', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Behind a platforming sequence in the Abyss', parsingInfo: { type: 'relict', internalId: 'Ancient Egg Abyss Middle' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479281' },
  ],
  },
];

// Check if a category item is unlocked in the save data
export function isItemUnlockedInPlayerSave(itemParsingInfo: ParsingInfo, saveData: any): boolean {
  const playerData = saveData.playerData ?? {};
  const typeHandlers = {
    flag: (flagName: string) => !!playerData[flagName],
    flagInt: ([flagName, value]: [string, number]) => playerData[flagName] >= value,
    tool: (toolNames: string[]) => {
      const tools = playerData?.Tools?.savedData || [];
      return toolNames.some(name => {
        const foundTool = tools.find((t: any) => t?.Name === name);
        return !!foundTool?.Data?.IsUnlocked;
      });
    },
    crest: (crestName: string) => {
      const crest = playerData?.ToolEquips?.savedData || [];
      const foundCrest = crest.find((t: any) => t?.Name === crestName);
      return !!foundCrest?.Data?.IsUnlocked;
    },
    collectable: (itemName: string) => {
      const collectableEntry = playerData.Collectables?.savedData?.find(
        (x: any) => x.Name === itemName
      );
      return !!collectableEntry && collectableEntry.Data.Amount > 0;
    },
    relict: (relicName: string) => {
      const relics = playerData?.Relics?.savedData || [];
      const foundRelict = relics.find((r: any) => r?.Name === relicName);
      return !!foundRelict?.Data?.IsCollected;
    },
    quest: (questName: string) => {
      const questEntry = playerData.QuestCompletionData?.savedData?.find((x: any) => x.Name === questName);
      return questEntry?.Data?.IsCompleted ?? false;
    },
    sceneData: ([sceneName, Id]: [string, string]) => {
      const sceneData = saveData.sceneData || {};
      const allEntries = sceneData.persistentBools?.serializedList || [];
      const match = allEntries.find((x: any) => x.SceneName === sceneName && x.ID === Id);
      return match?.Value === true;
    },
  };
  // @ts-ignore
  return typeHandlers[itemParsingInfo.type](itemParsingInfo.internalId);
}
