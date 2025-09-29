import type {
  ParsingInfo,
  JournalParsingInfo,
  FlagIntParsingInfo,
  SceneDataParsingInfo,
  ToolParsingInfo,
} from "../parsers/dictionary";

export type MutableSave = Record<string, any>;

const BOOLEAN_TYPES = new Set<ParsingInfo["type"]>([
  "flag",
  "tool",
  "crest",
  "collectable",
  "relict",
  "quest",
  "sceneData",
]);

const NUMERIC_TYPES = new Set<ParsingInfo["type"]>([
  "flagInt",
  "flagReturn",
  "journal",
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function cloneSave(parsedJson: unknown): MutableSave | null {
  if (!isObject(parsedJson)) {
    return null;
  }
  return JSON.parse(JSON.stringify(parsedJson)) as MutableSave;
}

function ensurePlayerData(save: MutableSave): MutableSave {
  if (!isObject(save.playerData)) {
    save.playerData = {};
  }
  return save.playerData as MutableSave;
}

function ensureSceneData(save: MutableSave): MutableSave {
  if (!isObject(save.sceneData)) {
    save.sceneData = {};
  }
  return save.sceneData as MutableSave;
}

function ensureSavedDataArray(root: MutableSave, key: string): MutableSave[] {
  if (!Array.isArray(root[key])) {
    root[key] = [];
  }
  return root[key] as MutableSave[];
}

function ensureEntry(
  array: MutableSave[],
  key: string,
  factory: () => MutableSave,
  matcher?: (item: MutableSave) => boolean,
): MutableSave {
  let entry = array.find(item => (matcher ? matcher(item) : item?.Name === key));
  if (!entry) {
    entry = factory();
    array.push(entry);
  }
  return entry;
}

function normalizeBoolean(value: boolean | number): boolean {
  if (typeof value === "number") {
    return value !== 0;
  }
  return !!value;
}

function normalizeNumber(value: boolean | number): number {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  if (Number.isNaN(Number(value))) {
    return 0;
  }
  return Number(value);
}

export function getItemValue(parsedJson: unknown, parsingInfo: ParsingInfo): boolean | number {
  if (!isObject(parsedJson)) {
    return BOOLEAN_TYPES.has(parsingInfo.type) ? false : 0;
  }
  const playerData = (parsedJson.playerData ?? {}) as MutableSave;

  switch (parsingInfo.type) {
    case "flag":
      return normalizeBoolean(playerData[parsingInfo.internalId as string] ?? false);
    case "flagReturn":
      return normalizeNumber(playerData[parsingInfo.internalId as string] ?? 0);
    case "flagInt": {
      const [flagName] = (parsingInfo as FlagIntParsingInfo).internalId;
      return normalizeNumber(playerData[flagName] ?? 0);
    }
    case "tool": {
      const toolNames = (parsingInfo as ToolParsingInfo).internalId;
      const tools = playerData?.Tools?.savedData ?? [];
      return toolNames.some(name =>
        tools.find((tool: any) => tool?.Name === name && tool?.Data?.IsUnlocked === true),
      );
    }
    case "journal": {
      const [entryName] = (parsingInfo as JournalParsingInfo).internalId;
      const journal = playerData?.EnemyJournalKillData?.list ?? [];
      const match = journal.find((entry: any) => entry?.Name === entryName);
      return normalizeNumber(match?.Record?.Kills ?? 0);
    }
    case "crest": {
      const crestName = parsingInfo.internalId as string;
      const crests = playerData?.ToolEquips?.savedData ?? [];
      return crests.some(
        (entry: any) => entry?.Name === crestName && entry?.Data?.IsUnlocked === true,
      );
    }
    case "collectable": {
      const collectName = parsingInfo.internalId as string;
      const collectables = playerData?.Collectables?.savedData ?? [];
      const match = collectables.find((entry: any) => entry?.Name === collectName);
      return normalizeNumber(match?.Data?.Amount ?? 0) > 0;
    }
    case "relict": {
      const relics = playerData?.Relics?.savedData ?? [];
      return relics.some(
        (entry: any) => entry?.Name === parsingInfo.internalId && entry?.Data?.IsCollected === true,
      );
    }
    case "quest": {
      const quests = playerData?.QuestCompletionData?.savedData ?? [];
      return quests.some(
        (entry: any) => entry?.Name === parsingInfo.internalId && entry?.Data?.IsCompleted === true,
      );
    }
    case "sceneData": {
      const [sceneName, id, inverse = false] = (parsingInfo as SceneDataParsingInfo).internalId;
      const sceneData = (parsedJson.sceneData ?? {}) as MutableSave;
      const allEntries = sceneData?.persistentBools?.serializedList ?? [];
      const match = allEntries.find(
        (entry: any) => entry?.SceneName === sceneName && entry?.ID === id,
      );
      const current = match?.Value === true;
      return inverse ? !current : current;
    }
    default:
      return 0;
  }
}

export function applyItemValue(save: MutableSave, parsingInfo: ParsingInfo, value: boolean | number): void {
  const playerData = ensurePlayerData(save);

  switch (parsingInfo.type) {
    case "flag": {
      playerData[parsingInfo.internalId as string] = normalizeBoolean(value);
      break;
    }
    case "flagReturn": {
      playerData[parsingInfo.internalId as string] = normalizeNumber(value);
      break;
    }
    case "flagInt": {
      const [flagName] = (parsingInfo as FlagIntParsingInfo).internalId;
      playerData[flagName] = normalizeNumber(value);
      break;
    }
    case "tool": {
      const toolNames = (parsingInfo as ToolParsingInfo).internalId;
      if (!isObject(playerData.Tools)) {
        playerData.Tools = {};
      }
      const toolsRoot = playerData.Tools as MutableSave;
      const tools = ensureSavedDataArray(toolsRoot, "savedData");
      for (const name of toolNames) {
        const entry = ensureEntry(tools, name, () => ({ Name: name, Data: {} }));
        if (!isObject(entry.Data)) {
          entry.Data = {};
        }
        entry.Data.IsUnlocked = normalizeBoolean(value);
        if (entry.Data.HasBeenSeen === undefined) {
          entry.Data.HasBeenSeen = normalizeBoolean(value);
        }
        if (entry.Data.IsHidden === undefined) {
          entry.Data.IsHidden = false;
        }
      }
      break;
    }
    case "journal": {
      const [entryName] = (parsingInfo as JournalParsingInfo).internalId;
      if (!isObject(playerData.EnemyJournalKillData)) {
        playerData.EnemyJournalKillData = {};
      }
      const journalRoot = playerData.EnemyJournalKillData as MutableSave;
      const journal = ensureSavedDataArray(journalRoot, "list");
      const entry = ensureEntry(journal, entryName, () => ({ Name: entryName, Record: {} }));
      if (!isObject(entry.Record)) {
        entry.Record = {};
      }
      const kills = Math.max(0, Math.floor(normalizeNumber(value)));
      entry.Record.Kills = kills;
      if (entry.Record.HasBeenSeen === undefined) {
        entry.Record.HasBeenSeen = kills > 0;
      }
      break;
    }
    case "crest": {
      const crestName = parsingInfo.internalId as string;
      if (!isObject(playerData.ToolEquips)) {
        playerData.ToolEquips = {};
      }
      const crestRoot = playerData.ToolEquips as MutableSave;
      const crests = ensureSavedDataArray(crestRoot, "savedData");
      const entry = ensureEntry(crests, crestName, () => ({ Name: crestName, Data: {} }));
      if (!isObject(entry.Data)) {
        entry.Data = {};
      }
      entry.Data.IsUnlocked = normalizeBoolean(value);
      break;
    }
    case "collectable": {
      const collectName = parsingInfo.internalId as string;
      if (!isObject(playerData.Collectables)) {
        playerData.Collectables = {};
      }
      const collectRoot = playerData.Collectables as MutableSave;
      const collectables = ensureSavedDataArray(collectRoot, "savedData");
      const entry = ensureEntry(collectables, collectName, () => ({ Name: collectName, Data: {} }));
      if (!isObject(entry.Data)) {
        entry.Data = {};
      }
      entry.Data.Amount = normalizeBoolean(value)
        ? entry.Data.Amount && entry.Data.Amount > 0
          ? entry.Data.Amount
          : 1
        : 0;
      break;
    }
    case "relict": {
      const relicName = parsingInfo.internalId as string;
      if (!isObject(playerData.Relics)) {
        playerData.Relics = {};
      }
      const relicRoot = playerData.Relics as MutableSave;
      const relics = ensureSavedDataArray(relicRoot, "savedData");
      const entry = ensureEntry(relics, relicName, () => ({ Name: relicName, Data: {} }));
      if (!isObject(entry.Data)) {
        entry.Data = {};
      }
      entry.Data.IsCollected = normalizeBoolean(value);
      break;
    }
    case "quest": {
      const questName = parsingInfo.internalId as string;
      if (!isObject(playerData.QuestCompletionData)) {
        playerData.QuestCompletionData = {};
      }
      const questRoot = playerData.QuestCompletionData as MutableSave;
      const quests = ensureSavedDataArray(questRoot, "savedData");
      const entry = ensureEntry(quests, questName, () => ({ Name: questName, Data: {} }));
      if (!isObject(entry.Data)) {
        entry.Data = {};
      }
      entry.Data.IsCompleted = normalizeBoolean(value);
      break;
    }
    case "sceneData": {
      const [sceneName, id, inverse = false] = (parsingInfo as SceneDataParsingInfo).internalId;
      const sceneData = ensureSceneData(save);
      if (!isObject(sceneData.persistentBools)) {
        sceneData.persistentBools = {};
      }
      const persistentRoot = sceneData.persistentBools as MutableSave;
      const entries = ensureSavedDataArray(persistentRoot, "serializedList");
      const entry = ensureEntry(
        entries,
        `${sceneName}:${id}`,
        () => ({ SceneName: sceneName, ID: id, Value: false }),
        item => item?.SceneName === sceneName && item?.ID === id,
      );
      entry.SceneName = sceneName;
      entry.ID = id;
      entry.Value = inverse ? !normalizeBoolean(value) : normalizeBoolean(value);
      break;
    }
    default:
      break;
  }
}

export function isBooleanItem(parsingInfo: ParsingInfo): boolean {
  return BOOLEAN_TYPES.has(parsingInfo.type);
}

export function isNumericItem(parsingInfo: ParsingInfo): boolean {
  return NUMERIC_TYPES.has(parsingInfo.type);
}

export function getSuggestedMax(parsingInfo: ParsingInfo): number | null {
  switch (parsingInfo.type) {
    case "journal":
      return (parsingInfo as JournalParsingInfo).internalId[1];
    case "flagInt":
      return (parsingInfo as FlagIntParsingInfo).internalId[1];
    default:
      return null;
  }
}
