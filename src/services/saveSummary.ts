import { CATEGORIES, isItemUnlockedInPlayerSave } from "../parsers/dictionary";

type AnyRecord = Record<string, unknown>;

export function calculateCompletionPercent(parsedJson: unknown): number {
  if (!parsedJson || typeof parsedJson !== "object") {
    return 0;
  }

  const allItems = CATEGORIES.flatMap(category => category.items);
  const itemsWithPercent = allItems.filter(
    item => typeof item.completionPercent === "number" && item.completionPercent > 0,
  );

  let unlockedSum = 0;
  let maxSum = 0;

  for (const item of itemsWithPercent) {
    const percent = item.completionPercent ?? 0;
    maxSum += percent;
    const { unlocked } = isItemUnlockedInPlayerSave(item.parsingInfo, parsedJson);
    if (unlocked) {
      unlockedSum += percent;
    }
  }

  if (maxSum <= 0) {
    return 0;
  }

  return Math.round((unlockedSum / maxSum) * 100);
}

function findNameValue(object: unknown, visited: WeakSet<object>): string | null {
  if (!object || typeof object !== "object") {
    return null;
  }

  if (visited.has(object)) {
    return null;
  }
  visited.add(object);

  const entries = Object.entries(object as AnyRecord);

  for (const [key, value] of entries) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) continue;
      const keyLower = key.toLowerCase();
      if (
        keyLower.includes("savename") ||
        keyLower.includes("save_name") ||
        keyLower.includes("save slot") ||
        keyLower.includes("profile") ||
        keyLower === "name" ||
        keyLower === "playername" ||
        (keyLower.includes("slot") && keyLower.includes("name"))
      ) {
        if (trimmed.length <= 64) {
          return trimmed;
        }
      }
    }
  }

  for (const [, value] of entries) {
    if (typeof value === "object" && value !== null) {
      const nested = findNameValue(value, visited);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

export function extractSaveDisplayName(parsedJson: unknown): string | null {
  if (!parsedJson || typeof parsedJson !== "object") {
    return null;
  }

  const root = parsedJson as AnyRecord;
  const candidatePaths: Array<unknown> = [
    root.saveSlotName,
    root.profileName,
    root.playerName,
    (root.playerData as AnyRecord | undefined)?.profileName,
    (root.playerData as AnyRecord | undefined)?.PlayerName,
    (root.playerData as AnyRecord | undefined)?.SaveName,
    (root.playerData as AnyRecord | undefined)?.SaveGameName,
    (root.playerData as AnyRecord | undefined)?.ProfileName,
    (root.saveData as AnyRecord | undefined)?.saveSlotName,
    (root.saveData as AnyRecord | undefined)?.profileName,
    (root.saveData as AnyRecord | undefined)?.PlayerName,
  ];

  for (const candidate of candidatePaths) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return findNameValue(parsedJson, new WeakSet());
}
