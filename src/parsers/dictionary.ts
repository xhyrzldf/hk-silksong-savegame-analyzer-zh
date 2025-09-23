export type FlagParsingInfo = { type: 'flag'; internalId: string };
export type FlagIntParsingInfo = { type: 'flagInt'; internalId: [string, number] };
export type FlagReturnParsingInfo = { type: 'flagReturn'; internalId: string };
export type ToolParsingInfo = { type: 'tool'; internalId: string[] };
export type CrestParsingInfo = { type: 'crest'; internalId: string };
export type CollectableParsingInfo = { type: 'collectable'; internalId: string };
export type RelictParsingInfo = { type: 'relict'; internalId: string };
export type QuestParsingInfo = { type: 'quest'; internalId: string };
export type SceneDataParsingInfo = { type: 'sceneData'; internalId: [string, string, boolean?] };
export type ParsingInfo = FlagParsingInfo | FlagIntParsingInfo | FlagReturnParsingInfo | ToolParsingInfo | CrestParsingInfo | CollectableParsingInfo | RelictParsingInfo |QuestParsingInfo | SceneDataParsingInfo;

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
    name: 'Stats',
    description: 'Statistics tracked in the game.',
    items: [
      { name: 'Playtime', whichAct: 1, completionPercent: 0, prereqs: [], location: '', parsingInfo: { type: 'flagReturn', internalId: 'playTime' }, mapLink: '' },
      { name: 'Rosaries', whichAct: 1, completionPercent: 0, prereqs: [], location: '', parsingInfo: { type: 'flagReturn', internalId: 'geo' }, mapLink: '' },
      { name: 'Shell Shards', whichAct: 1, completionPercent: 0, prereqs: [], location: '', parsingInfo: { type: 'flagReturn', internalId: 'ShellShards' }, mapLink: '' },
    ],
  },
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
    name: 'Upgrades',
    description: 'Each Upgrade Counts 1% towards completion',
    items: [
      // Needle Upgrades
      { name: 'Needle Upgrade 1', section: 'Needle Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['nailUpgrades',1] }, mapLink: '' },
      { name: 'Needle Upgrade 2', section: 'Needle Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['nailUpgrades',2] }, mapLink: '' },
      { name: 'Needle Upgrade 3', section: 'Needle Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['nailUpgrades',3] }, mapLink: '' },
      { name: 'Needle Upgrade 4', section: 'Needle Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['nailUpgrades',4] }, mapLink: '' },

      // Tool Pouch Upgrades
      { name: 'Tool Pouch Upgrade 1', section: 'Tool Pouch Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'Far Fields: Pilgrims Rest, purchased from Mort for 220 Rosaries', parsingInfo: { type: 'flagInt', internalId: ['ToolPouchUpgrades',1] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477946' },
      { name: 'Tool Pouch Upgrade 2', section: 'Tool Pouch Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['ToolPouchUpgrades',2] }, mapLink: '' },
      { name: 'Tool Pouch Upgrade 3', section: 'Tool Pouch Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['ToolPouchUpgrades',3] }, mapLink: '' },
      { name: 'Tool Pouch Upgrade 4', section: 'Tool Pouch Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['ToolPouchUpgrades',4] }, mapLink: '' },

      // Tool Kit Upgrades
      { name: 'Tool Kit Upgrade 1', section: 'Tool Kit Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['ToolKitUpgrades',1] }, mapLink: '' },
      { name: 'Tool Kit Upgrade 2', section: 'Tool Kit Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['ToolKitUpgrades',2] }, mapLink: '' },
      { name: 'Tool Kit Upgrade 3', section: 'Tool Kit Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['ToolKitUpgrades',3] }, mapLink: '' },
      { name: 'Tool Kit Upgrade 4', section: 'Tool Kit Upgrades', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['ToolKitUpgrades',4] }, mapLink: '' },

      // Silk Hearts
      { name: 'Silk Heart 1', section: 'Silk Hearts', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['silkRegenMax',1] }, mapLink: '' },
      { name: 'Silk Heart 2', section: 'Silk Hearts', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['silkRegenMax',2] }, mapLink: '' },
      { name: 'Silk Heart 3', section: 'Silk Hearts', whichAct: 0, completionPercent: 1, prereqs: [], location: 'TODO', parsingInfo: { type: 'flagInt', internalId: ['silkRegenMax',3] }, mapLink: '' },
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
      { name: 'Multibinder', section: 'Defense Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'Bellhart: Purchased from Frey after completing My Missing Courier wish', parsingInfo: { type: 'tool', internalId: ['Multibind'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478203' },
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
      { name: 'Weighted Belt', section: 'Explore Tools', whichAct: 0, completionPercent: 1, prereqs: [], location: 'Far Fields: Pilgrims Rest, purchased from Mort for 160 Rosaries', parsingInfo: { type: 'tool', internalId: ['Weighted Anklet'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477946' },
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
      { name: 'Hunter Crest', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Default Crest, already equipped at the beginning', parsingInfo: { type: 'crest', internalId: 'Hunter' }, mapLink: '' },
      { name: 'Hunter Crest 2', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Talk to Eva in Weavnest Atla', parsingInfo: { type: 'crest', internalId: 'Hunter_v2' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478228' },
      { name: 'Hunter Crest 3', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Unlock Wanderer, Beast, Reaper, Architect and Witch Crest / and use Memory Lockets and talk to Eva', parsingInfo: { type: 'crest', internalId: 'Hunter_v3' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479653' },
      { name: 'Vesticrest 1', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Unlock 4 Crests and talk to Eva: + 1 yellow tool slot on all crests', parsingInfo: { type: 'flag', internalId: 'UnlockedExtraYellowSlot' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479145' },
      { name: 'Vesticrest 2', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Use 9 Memory Lockets and talk to Eva: + 1 blue tool slot on all crests', parsingInfo: { type: 'flag', internalId: 'UnlockedExtraBlueSlot' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479434' },
      { name: 'Reaper Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'Greymore far left:  Chapel of Reaper', parsingInfo: { type: 'crest', internalId: 'Reaper' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478156' },
      { name: 'Wanderer Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'Mossgrotto far left (Bonegrave): Chapel of Wanderer', parsingInfo: { type: 'crest', internalId: 'Wanderer' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478240' },
      { name: 'Beast Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'Hunters March far right: Chapel of Beast', parsingInfo: { type: 'crest', internalId: 'Warrior' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478020' },
      { name: 'Witch Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'Take Twisted Bud to Greyroot, Complete Rite of Rebirth Wish, Complete Infestation Operation Wish', parsingInfo: { type: 'crest', internalId: 'Witch' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478815' },
      { name: 'Architect Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'Above The Cauldron: Chapel of the Architect', parsingInfo: { type: 'crest', internalId: 'Toolmaster' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478745' },
      { name: 'Shaman Crest', whichAct: 0, completionPercent: 1, prereqs: [], location: 'Moss Grotto: In a tunnel above the Lore Tablet, Silk Soar required', parsingInfo: { type: 'crest', internalId: 'Spell' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479384' },
  ],
  },
  {
    name: 'Ancestral Arts',
    description: 'Each Crest counts 1% towards completion (except Hunter Crest)',
    items: [
      { name: 'Swift Step (Dash / Sprint)', whichAct: 1, completionPercent: 1, prereqs: [], location: 'At the top of Deep Rocks', parsingInfo: { type: 'flag', internalId: 'hasDash' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477915' },
      { name: 'Drifters Cloak (Glide)', whichAct: 1, completionPercent: 0, prereqs: [], location: 'Far Fields: Complete Seamstress Wish Flexile Spines', parsingInfo: { type: 'flag', internalId: 'hasBrolly' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477971' },
      { name: 'Clawline (Needle Harpoon)', whichAct: 2, completionPercent: 1, prereqs: [], location: 'In The Cauldron (right side from Underworks', parsingInfo: { type: 'flag', internalId: 'hasHarpoonDash' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478714' },
      { name: 'Cling Grip (Walljump)', whichAct: 1, completionPercent: 1, prereqs: [], location: 'Shellwood', parsingInfo: { type: 'flag', internalId: 'hasWalljump' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478189' },
      { name: 'Needolin', whichAct: 1, completionPercent: 1, prereqs: [], location: 'On Top of Bellhart (Deafeat Widow)', parsingInfo: { type: 'flag', internalId: 'hasNeedolin' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478199' },
      { name: 'Needle Strike', whichAct: 1, completionPercent: 1, prereqs: [], location: 'Blasted Steps far left', parsingInfo: { type: 'flag', internalId: 'hasChargeSlash' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478510' },
      { name: 'Faydown Cloak (Double Jump)', whichAct: 2, completionPercent: 0, prereqs: ['Needoline','Clawline'], location: 'Top of Mount Fay', parsingInfo: { type: 'flag', internalId: 'hasDoubleJump' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479103' },
      { name: 'Silk Soar (Highjump)', whichAct: 3, completionPercent: 1, prereqs: [], location: 'Bottom right of the abyss', parsingInfo: { type: 'flag', internalId: 'hasSuperJump' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479288' },
      { name: 'Sylphsong', whichAct: 3, completionPercent: 1, prereqs: [], location: 'Use 18 Memory Lockets and bind Eva', parsingInfo: { type: 'flag', internalId: 'HasBoundCrestUpgrader' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479654' },
      { name: 'Everbloom', whichAct: 3, completionPercent: 1, prereqs: [], location: 'Complete The Old Hearts wish', parsingInfo: { type: 'collectable', internalId: 'White Flower' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479387' },
  ],
  },
  {
    name: 'Relics',
    description: 'Relics',
    items: [
      { name: 'Choral Commandment 1', whichAct: 0, completionPercent: 0, prereqs: [], location: 'On a high-up ledge. Left from Mosshome.', parsingInfo: { type: 'relict', internalId: 'Seal Chit Aspid_01' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477867' },
      { name: 'Choral Commandment 2', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Top-Left Room of Whiteward', parsingInfo: { type: 'relict', internalId: 'Seal Chit Ward Corpse' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478914' },
      { name: 'Choral Commandment 3', whichAct: 0, completionPercent: 0, prereqs: [], location: 'At the end of a room above the Hidden Passage in Whiteward, easiest to reach via Silk Soar', parsingInfo: { type: 'relict', internalId: 'Seal Chit Silk Siphon' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478919' },
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
  {
    name: 'Fleas',
    description: 'Fleas',
    items: [
      { name: 'Lost Flea 1', whichAct: 0, completionPercent: 0, prereqs: [], location: 'On a high-up ledge at the top of the marrows', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Bone_06' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477890' },
      { name: 'Lost Flea 2', whichAct: 0, completionPercent: 0, prereqs: [], location: 'To the left of Deep Docks Bellway. In the corner of an area fill with lavafalls. ', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Dock_16' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477907' },
      { name: 'Lost Flea 3', whichAct: 0, completionPercent: 0, prereqs: ['Swift Step'], location: 'Top of Deepdocks: Pull a Lever down below, and swift step your way up towards it', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Bone_East_05' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477916' },
      { name: 'Lost Flea 4', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Far Fields: Watch out for the pressure plate trap!', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Bone_East_17b' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477940' },
      { name: 'Lost Flea 5', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Hunters March: At the top of a long series of red fruit.', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Ant_03' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477999' },
      { name: 'Lost Flea 6', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Greymore Secret room (Kratt)', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Greymoor_15b' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478271' },
      { name: 'Lost Flea 7', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Greymore: Reached through the top of the tower', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Greymoor_06' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478287' },
      { name: 'Lost Flea 8', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Shellwood: At the bottom of a pit filled with Pollenica (and a few Phacia) enemies', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Shellwood_03' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478176' },
      { name: 'Lost Flea 9', whichAct: 0, completionPercent: 0, prereqs: ['Drifters Cloak', 'Cling Grip'], location: 'Far Fields: Hidden parkour path to the right of far fields bellway', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Bone_East_10_Church' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478219' },
      { name: 'Lost Flea 10', whichAct: 0, completionPercent: 0, prereqs: ['Cling Grip'], location: 'Top of Blasted Steps', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Coral_35' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478386' },
      { name: 'Lost Flea 11', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Sinners Road: Jump over the first cage, then hit the easternmost side of the one holding the flea to set it free.', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Dust_12' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478360' },
      { name: 'Lost Flea 12', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Inside the Exhaust Organ, there is a room with a silk refill spindle. Go left from there to access it.', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Dust_09' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478378' },
      { name: 'Lost Flea 13', whichAct: 0, completionPercent: 0, prereqs: ['Cling Grip'], location: 'Top of Bellhart behind breakable wall', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Belltown_04' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478193' },
      { name: 'Lost Flea 14', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Behind breakable wall in wormways. Carried by a Aknid', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Crawl_06' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478450' },
      { name: 'Lost Flea 15', whichAct: 0, completionPercent: 0, prereqs: ['Key of Indolent'], location: 'The Slab: In a small side-room at the edge of the area', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Slab_Cell' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478393' },
      { name: 'Lost Flea 16', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Bilewater: In a room behind the Breakable Wall. Defeat the two Snitchflies to rescue it.', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Shadow_28' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478443' },
      { name: 'Lost Flea 17', whichAct: 0, completionPercent: 0, prereqs: ['Clawline'], location: 'Deep Docks: In a room that can only be reached after defeating a nearby Arena Battle', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Dock_03d' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478437' },
      { name: 'Lost Flea 18', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Underworks: Can be collected only by passing through Wisp Thicket area and traversing a room full of saws.', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Under_23' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478419' },
      { name: 'Lost Flea 19', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Bilewater: At the end of a trap-filled secret room', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Shadow_10' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478408' },
      { name: 'Lost Flea 20', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Choral Chambers: At the end of a platforming challenge', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Song_14' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478398' },
      { name: 'Lost Flea 21', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Sands of Karak: Secret area behind breakable wall', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Coral_24' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478385' },
      { name: 'Lost Flea 22', whichAct: 0, completionPercent: 0, prereqs: ['Cling Grip'], location: 'Mount Fay: Top of Room in the middle', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Peak_05c' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478380' },
      { name: 'Lost Flea 23', whichAct: 0, completionPercent: 0, prereqs: ['Clawline'], location: 'Top Right of Songclave: Parkour Challange, Access throught Whispering Vaults', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Library_09' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478404' },
      { name: 'Lost Flea 24', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Choral Chambers: Enter the shaft from this section to turn on a fan, and this section to ride the air current to the top', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Song_11' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478416' },
      { name: 'Lost Flea 25', whichAct: 0, completionPercent: 0, prereqs: ['Clawline'], location: 'Whispering Vaults: Hit the box with a long track into its final position to reach this flea.', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Library_01' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478402' },
      { name: 'Lost Flea 26', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Underworks', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Under_21' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478420' },
      { name: 'Lost Flea 27', whichAct: 0, completionPercent: 0, prereqs: ['Faydown Cloak'], location: 'The Slab: Above the lower bench', parsingInfo: { type: 'flag', internalId: 'SavedFlea_Slab_06' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478392' },
  ],
  },
  {
    name: 'Memory Lockets',
    description: 'Memory Lockets',
    items: [
      { name: 'Memory Locket 1', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Far Fields: Pilgrims Rest, purchased from Mort for 150 Rosaries', parsingInfo: { type: 'flag', internalId: 'PurchasedPilgrimsRestMemoryLocket' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477953' },
      { name: 'Memory Locket 2', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Hunters March far right: In a cage at the end of the spiky corridor. Break the cage to loot it.', parsingInfo: { type: 'sceneData', internalId: ['Ant_20', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478017' },
      { name: 'Memory Locket 3', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Greymoore: On a ledge above the Mitemother', parsingInfo: { type: 'sceneData', internalId: ['Greymoor_16', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478035' },
      { name: 'Memory Locket 4', whichAct: 0, completionPercent: 0, prereqs: ['Faydown Cloak'], location: 'Greymoore: Inside Halfway Home', parsingInfo: { type: 'sceneData', internalId: ['Halfway_01', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478039' },
      { name: 'Memory Locket 5', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Bellhart: Purchased from Frey for 330 Rosaries', parsingInfo: { type: 'flag', internalId: 'PurchasedBelltownMemoryLocket' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478204' },
      { name: 'Memory Locket 6', whichAct: 3, completionPercent: 0, prereqs: ['Silk Soar'], location: 'Bellhart town: Silk Soar into the roof', parsingInfo: { type: 'sceneData', internalId: ['Belltown', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478212' },
      { name: 'Memory Locket 7', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Bone Bottom: Complete Volatile Flintbeetles Wish', parsingInfo: { type: 'quest', internalId: 'Rock Rollers' }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478222' },
      { name: 'Memory Locket 8', whichAct: 0, completionPercent: 0, prereqs: ['Cling Grip'], location: 'Top of the Marrows', parsingInfo: { type: 'sceneData', internalId: ['Bone_18', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478246' },
      { name: 'Memory Locket 9', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Grand Bellway, behind a breakable wall above the bellway station', parsingInfo: { type: 'sceneData', internalId: ['Bellway_City', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478372' },
      { name: 'Memory Locket 10', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Wormways: Bottom right held by a corpse', parsingInfo: { type: 'sceneData', internalId: ['Crawl_09', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478493' },
      { name: 'Memory Locket 11', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Blasted Steps: On a narrow platform above the sands', parsingInfo: { type: 'sceneData', internalId: ['Coral_02', 'Collectable Item Pickup (1)'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478502' },
      { name: 'Memory Locket 12', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Underworks: Found by jumping into the Passage, then dropping down a hole to the left', parsingInfo: { type: 'sceneData', internalId: ['Under_08', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478571' },
      { name: 'Memory Locket 13', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Whispering Vaults: At the top of a tunnel', parsingInfo: { type: 'sceneData', internalId: ['Library_08', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478676' },
      { name: 'Memory Locket 14', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Bilewater: At the far left edge of a secret room. Bounce over the infested waters and wall-jump up the vertical space to reach it', parsingInfo: { type: 'sceneData', internalId: ['Shadow_20', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478787' },
      { name: 'Memory Locket 15', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Deep Docks: Held by a corpse at the bottom of a magma-filled area found behind the Breakable Wall', parsingInfo: { type: 'sceneData', internalId: ['Dock_13', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478836' },
      { name: 'Memory Locket 16', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Bilewater: Held by a corpse in a breakable cocoon dangling from the ceiling', parsingInfo: { type: 'sceneData', internalId: ['Shadow_27', 'Breakable Hang Sack Memory Locket'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478851' },
      { name: 'Memory Locket 17', whichAct: 0, completionPercent: 0, prereqs: [], location: 'The Slab: Inside the shortcut cave. Look out for a breakable wall as you climb a vertical space', parsingInfo: { type: 'sceneData', internalId: ['Slab_Cell_Quiet', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479017' },
      { name: 'Memory Locket 18', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Memorium, after platforming section', parsingInfo: { type: 'sceneData', internalId: ['Arborium_05', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479110' },
      { name: 'Memory Locket 19', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Farlands: Guarded by a void-powered Skarrgard.', parsingInfo: { type: 'sceneData', internalId: ['Bone_East_25', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479196' },
      { name: 'Memory Locket 20', whichAct: 0, completionPercent: 0, prereqs: [], location: 'Sands of Karak: Held by a corpse at the top of the area', parsingInfo: { type: 'sceneData', internalId: ['Coral_23', 'Collectable Item Pickup'] }, mapLink: 'https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479204' },
  ],
  },
];

// Check if a category item is unlocked in the save data
export function isItemUnlockedInPlayerSave(itemParsingInfo: ParsingInfo, saveData: any): { unlocked: boolean, returnValue?: number } {
  const playerData = saveData.playerData ?? {};
  const typeHandlers = {
    flag: (flagName: string) => {
      const val = !!playerData[flagName];
      return { unlocked: val };
    },
    flagInt: ([flagName, value]: [string, number]) => {
      const actual = playerData[flagName] ?? 0;
      return { unlocked: actual >= value };
    },
    flagReturn: (flagName: string) => {
      const val = !!playerData[flagName];
      return { unlocked: val, returnValue: playerData[flagName] };
    },
    tool: (toolNames: string[]) => {
      const tools = playerData?.Tools?.savedData || [];
      let unlocked = false;
      for (const name of toolNames) {
        const foundTool = tools.find((t: any) => t?.Name === name);
        if (foundTool && !!foundTool?.Data?.IsUnlocked) {
          unlocked = true;
          break;
        }
      }
      return { unlocked };
    },
    crest: (crestName: string) => {
      const crest = playerData?.ToolEquips?.savedData || [];
      const foundCrest = crest.find((t: any) => t?.Name === crestName);
      return { unlocked: !!foundCrest?.Data?.IsUnlocked };
    },
    collectable: (itemName: string) => {
      const collectableEntry = playerData.Collectables?.savedData?.find(
        (x: any) => x.Name === itemName
      );
      const amount = collectableEntry?.Data?.Amount ?? 0;
      return { unlocked: amount > 0 };
    },
    relict: (relicName: string) => {
      const relics = playerData?.Relics?.savedData || [];
      const foundRelict = relics.find((r: any) => r?.Name === relicName);
      return { unlocked: !!foundRelict?.Data?.IsCollected };
    },
    quest: (questName: string) => {
      const questEntry = playerData.QuestCompletionData?.savedData?.find((x: any) => x.Name === questName);
      return { unlocked: questEntry?.Data?.IsCompleted ?? false };
    },
    sceneData: ([sceneName, Id, inverse = false]: [string, string, boolean?]) => {
      const sceneData = saveData.sceneData || {};
      const allEntries = sceneData.persistentBools?.serializedList || [];
      const match = allEntries.find((x: any) => x.SceneName === sceneName && x.ID === Id);
      return { unlocked: inverse ? match?.Value === false : match?.Value === true };
    },
  };
  // @ts-ignore
  return typeHandlers[itemParsingInfo.type](itemParsingInfo.internalId);
}
