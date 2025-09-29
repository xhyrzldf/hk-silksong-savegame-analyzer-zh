import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";

import { encodeSave } from "../services/decryptor";
import {
  applyItemValue,
  cloneSave,
  getItemValue,
  getSuggestedMax,
  isBooleanItem,
  isNumericItem,
} from "../services/saveMutations";
import { CATEGORIES } from "../parsers/dictionary";
import type { CategoryItem } from "../parsers/dictionary";
import type { AutoSaveSummary } from "../hooks/useWindowsSaves";
import { useI18n } from "../i18n/I18nContext";

interface SaveEditorPageProps {
  parsedJson: unknown;
  jsonText: string;
  setJsonText: (value: string) => void;
  fileName: string;
  activeAutoSave: AutoSaveSummary | null;
  autoSaveSlots: AutoSaveSummary[];
  isAutoSaveSupported: boolean;
  refreshAutoSaves: () => void | Promise<void>;
  saveEncrypted: () => void;
  savePlain: () => void;
}

type FeedbackKind = "success" | "error" | "info";

type FeedbackMessage = {
  kind: FeedbackKind;
  text: string;
};

function isPromiseLike(value: unknown): value is Promise<unknown> {
  return typeof value === "object" && value !== null && typeof (value as { then?: unknown }).then === "function";
}

function formatTimestamp(timestamp: number, locale: string): string {
  try {
    return new Date(timestamp).toLocaleString(locale);
  } catch {
    return new Date(timestamp).toLocaleString();
  }
}

function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size <= 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const precision = value >= 10 || unitIndex === 0 ? 0 : 2;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

function buildSlotLabel(save: AutoSaveSummary, t: (key: string, fallback?: string) => string): string {
  const base = t("UI_SAVE_EDITOR_SLOT_DISPLAY", "Slot {index}").replace("{index}", String(save.slotIndex));
  return `${base} · ${save.displayName} · ${save.directoryName}`;
}

function buildBackupLabel(
  entry: WindowsBackupEntry,
  t: (key: string, fallback?: string) => string,
  formatter: (value: number) => string,
): string {
  const slotPart = entry.slotIndex
    ? t("UI_SAVE_EDITOR_BACKUP_SLOT", "Slot {index}").replace("{index}", String(entry.slotIndex))
    : t("UI_SAVE_EDITOR_BACKUP_SLOT_UNKNOWN", "Unknown slot");
  const timePart = formatter(entry.modifiedAt);
  const sizePart = formatBytes(entry.size);
  return `${entry.fileName} · ${slotPart} · ${timePart} · ${sizePart}`;
}

export function SaveEditorPage({
  parsedJson,
  jsonText,
  setJsonText,
  fileName,
  activeAutoSave,
  autoSaveSlots,
  isAutoSaveSupported,
  refreshAutoSaves,
  saveEncrypted,
  savePlain,
}: SaveEditorPageProps) {
  const { t, translate, locale } = useI18n();
  const electronApi =
    typeof window !== "undefined"
      ? (window as Window & { electronAPI?: ElectronAPI }).electronAPI
      : undefined;

  const localeKey = locale === "zh" ? "zh-CN" : "en-US";
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backups, setBackups] = useState<WindowsBackupEntry[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [selectedBackupName, setSelectedBackupName] = useState<string>("");
  const [restoreTargetId, setRestoreTargetId] = useState<string>("");
  const [copySourceId, setCopySourceId] = useState<string>("");
  const [copyTargetId, setCopyTargetId] = useState<string>("");

  const hasParsedJson = Boolean(parsedJson) && typeof parsedJson === "object";

  const slotOptions = useMemo(
    () => autoSaveSlots.map(save => ({ id: save.id, label: buildSlotLabel(save, t) })),
    [autoSaveSlots, t],
  );

  const formatLocaleTimestamp = useCallback(
    (value: number) => formatTimestamp(value, localeKey),
    [localeKey],
  );

  const loadBackups = useCallback(async () => {
    if (!electronApi?.listWindowsBackups) {
      setBackups([]);
      return;
    }
    setIsLoadingBackups(true);
    try {
      const entries = await electronApi.listWindowsBackups();
      setBackups(entries);
      setBackupError(null);
    } catch (error) {
      console.error("[save-editor] Failed to list backups", error);
      setBackupError(t("UI_SAVE_EDITOR_BACKUP_LOAD_ERROR", "Failed to load backup list"));
    } finally {
      setIsLoadingBackups(false);
    }
  }, [electronApi, t]);

  useEffect(() => {
    if (autoSaveSlots.length === 0) {
      setCopySourceId("");
      setCopyTargetId("");
      setRestoreTargetId("");
      return;
    }
    if (!copySourceId) {
      setCopySourceId(autoSaveSlots[0].id);
    }
    if (!copyTargetId) {
      setCopyTargetId(autoSaveSlots[0].id);
    }
    if (!restoreTargetId) {
      setRestoreTargetId(autoSaveSlots[0].id);
    }
  }, [autoSaveSlots, copySourceId, copyTargetId, restoreTargetId]);

  useEffect(() => {
    if (activeAutoSave) {
      setCopySourceId(activeAutoSave.id);
      if (!restoreTargetId) {
        setRestoreTargetId(activeAutoSave.id);
      }
    }
  }, [activeAutoSave, restoreTargetId]);

  useEffect(() => {
    if (!electronApi?.listWindowsBackups) {
      setBackups([]);
      return;
    }
    loadBackups();
  }, [electronApi, loadBackups]);

  useEffect(() => {
    if (backups.length === 0) {
      setSelectedBackupName("");
      return;
    }
    if (!backups.some(entry => entry.fileName === selectedBackupName)) {
      setSelectedBackupName(backups[0].fileName);
    }
  }, [backups, selectedBackupName]);

  const updateJsonFromSave = useCallback(
    (nextSave: Record<string, unknown>) => {
      setJsonText(JSON.stringify(nextSave, null, 2));
    },
    [setJsonText],
  );

  const handleValueChange = useCallback(
    (item: CategoryItem, value: boolean | number) => {
      if (!hasParsedJson) {
        setFeedback({ kind: "info", text: t("UI_SAVE_EDITOR_NO_JSON", "Load a save file first") });
        return;
      }
      const clone = cloneSave(parsedJson);
      if (!clone) {
        setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_JSON_INVALID", "Unable to parse the current save data") });
        return;
      }
      applyItemValue(clone, item.parsingInfo, value);
      updateJsonFromSave(clone);
    },
    [hasParsedJson, parsedJson, t, updateJsonFromSave],
  );

  const ensureSaveIsValid = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      const normalized = JSON.stringify(parsed, null, 2);
      if (normalized !== jsonText) {
        setJsonText(normalized);
      }
      return normalized;
    } catch (error) {
      console.error("[save-editor] Invalid JSON before saving", error);
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_JSON_INVALID", "Unable to parse the current save data") });
      return null;
    }
  }, [jsonText, setJsonText, t]);

  const handleSaveToSlot = useCallback(async () => {
    if (!electronApi?.writeWindowsSlot) {
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_SAVE_UNAVAILABLE", "Slot writing is not supported in this environment") });
      return;
    }
    if (!activeAutoSave) {
      setFeedback({ kind: "info", text: t("UI_SAVE_EDITOR_ACTIVE_SLOT_REQUIRED", "Select a destination slot first") });
      return;
    }
    const normalized = ensureSaveIsValid();
    if (!normalized) {
      return;
    }
    setIsSaving(true);
    try {
      const bytes = encodeSave(normalized);
      await electronApi.writeWindowsSlot({ filePath: activeAutoSave.filePath, data: bytes });
      setFeedback({ kind: "success", text: t("UI_SAVE_EDITOR_SAVE_SUCCESS", "Save written and backup created") });
      const refreshResult = refreshAutoSaves();
      if (isPromiseLike(refreshResult)) {
        await refreshResult;
      }
      await loadBackups();
    } catch (error) {
      console.error("[save-editor] Failed to save slot", error);
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_SAVE_FAILED", "Save failed, please try again") });
    } finally {
      setIsSaving(false);
    }
  }, [activeAutoSave, electronApi, ensureSaveIsValid, loadBackups, refreshAutoSaves, t]);

  const handleCopySlot = useCallback(async () => {
    if (!electronApi?.copyWindowsSlot) {
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_SAVE_UNAVAILABLE", "Slot writing is not supported in this environment") });
      return;
    }
    const source = autoSaveSlots.find(save => save.id === copySourceId);
    const target = autoSaveSlots.find(save => save.id === copyTargetId);
    if (!source || !target) {
      setFeedback({ kind: "info", text: t("UI_SAVE_EDITOR_COPY_SLOT_REQUIRED", "Select valid slots first") });
      return;
    }
    if (source.filePath === target.filePath) {
      setFeedback({ kind: "info", text: t("UI_SAVE_EDITOR_COPY_SAME_SLOT", "Source and target slots are identical") });
      return;
    }
    const confirmed = window.confirm(
      t(
        "UI_SAVE_EDITOR_COPY_CONFIRM",
        "Copy the source slot and overwrite the target slot? The original file will be backed up automatically.",
      ),
    );
    if (!confirmed) {
      return;
    }
    setIsCopying(true);
    try {
      await electronApi.copyWindowsSlot({ sourcePath: source.filePath, targetPath: target.filePath });
      setFeedback({ kind: "success", text: t("UI_SAVE_EDITOR_COPY_SUCCESS", "Copied and backed up successfully") });
      const refreshResult = refreshAutoSaves();
      if (isPromiseLike(refreshResult)) {
        await refreshResult;
      }
      await loadBackups();
    } catch (error) {
      console.error("[save-editor] Failed to copy slot", error);
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_COPY_FAILED", "Copy failed, please try again") });
    } finally {
      setIsCopying(false);
    }
  }, [autoSaveSlots, copySourceId, copyTargetId, electronApi, loadBackups, refreshAutoSaves, t]);

  const handleRestoreBackup = useCallback(async () => {
    if (!electronApi?.restoreWindowsBackup) {
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_SAVE_UNAVAILABLE", "Slot writing is not supported in this environment") });
      return;
    }
    const target = autoSaveSlots.find(save => save.id === restoreTargetId);
    if (!selectedBackupName || !target) {
      setFeedback({ kind: "info", text: t("UI_SAVE_EDITOR_RESTORE_REQUIRED", "Select both a backup and a target slot") });
      return;
    }
    const confirmed = window.confirm(
      t(
        "UI_SAVE_EDITOR_RESTORE_CONFIRM",
        "Restore the backup and overwrite the target slot? The current file will be backed up automatically.",
      ),
    );
    if (!confirmed) {
      return;
    }
    setIsRestoring(true);
    try {
      await electronApi.restoreWindowsBackup({ fileName: selectedBackupName, targetPath: target.filePath });
      setFeedback({ kind: "success", text: t("UI_SAVE_EDITOR_RESTORE_SUCCESS", "Backup restored and original file saved") });
      const refreshResult = refreshAutoSaves();
      if (isPromiseLike(refreshResult)) {
        await refreshResult;
      }
      await loadBackups();
    } catch (error) {
      console.error("[save-editor] Failed to restore backup", error);
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_RESTORE_FAILED", "Restore failed, please try again") });
    } finally {
      setIsRestoring(false);
    }
  }, [autoSaveSlots, electronApi, loadBackups, refreshAutoSaves, restoreTargetId, selectedBackupName, t]);

  const handleDownloadDat = useCallback(() => {
    const normalized = ensureSaveIsValid();
    if (!normalized) {
      return;
    }
    setJsonText(normalized);
    saveEncrypted();
  }, [ensureSaveIsValid, saveEncrypted, setJsonText]);

  const categories = useMemo(() => CATEGORIES, []);

  return (
    <div className="text-white space-y-6">
      <section className="bg-[#24344d80] rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-semibold">{t("UI_SAVE_EDITOR_PANEL_TITLE", "Save Editing")}</h2>
        <p className="text-sm text-white/80">
          {t("UI_SAVE_EDITOR_CURRENT_FILE", "Current file: {name}").replace(
            "{name}",
            fileName || t("UI_SAVE_EDITOR_FILE_UNKNOWN", "Unnamed"),
          )}
        </p>
        {activeAutoSave ? (
          <p className="text-sm text-white/70">
            {t("UI_SAVE_EDITOR_ACTIVE_SLOT", "Active slot: Slot {index} · {dir}")
              .replace("{index}", String(activeAutoSave.slotIndex))
              .replace("{dir}", activeAutoSave.directoryName)}
          </p>
        ) : (
          <p className="text-sm text-white/70">
            {t("UI_SAVE_EDITOR_ACTIVE_SLOT_NONE", "No auto-detected slot selected")}
          </p>
        )}
        {feedback ? (
          <div
            className={`rounded border px-3 py-2 text-sm ${
              feedback.kind === "success"
                ? "bg-green-700/40 border-green-500"
                : feedback.kind === "error"
                  ? "bg-red-700/40 border-red-500"
                  : "bg-blue-700/40 border-blue-400"
            }`}
          >
            {feedback.text}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSaveToSlot}
            disabled={isSaving || !hasParsedJson || !electronApi?.writeWindowsSlot}
            className={`px-3 py-2 rounded font-semibold text-sm transition-colors ${
              isSaving || !hasParsedJson || !electronApi?.writeWindowsSlot
                ? "bg-green-900/40 border border-green-700 text-white/60 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 border border-green-500 text-white"
            }`}
          >
            {isSaving ? t("UI_SAVE_EDITOR_SAVING", "Saving…") : t("UI_SAVE_EDITOR_SAVE_BUTTON", "Save to slot (with backup)")}
          </button>
          <button
            type="button"
            onClick={handleDownloadDat}
            className="px-3 py-2 rounded border border-white/30 text-sm font-semibold bg-transparent hover:border-white hover:text-white"
          >
            {t("UI_SAVE_ENCRYPTED", "Save Encrypted (.dat)")}
          </button>
          <button
            type="button"
            onClick={savePlain}
            className="px-3 py-2 rounded border border-white/30 text-sm font-semibold bg-transparent hover:border-white hover:text-white"
          >
            {t("UI_SAVE_PLAIN", "Save Plain (.json)")}
          </button>
        </div>
      </section>

      <section className="bg-[#24344d80] rounded-lg p-4 space-y-3">
        <h3 className="text-base font-semibold">{t("UI_SAVE_EDITOR_SECTION_EDIT", "Entry editing")}</h3>
        {!hasParsedJson ? (
          <div className="text-sm text-white/70">{t("UI_SAVE_EDITOR_NO_JSON", "Load a save file first")}</div>
        ) : (
          <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
            {categories.map(category => {
              let currentSection = "";
              return (
                <details key={category.name} className="bg-[#1f2b3d] border border-white/10 rounded">
                  <summary className="cursor-pointer select-none px-3 py-2 font-semibold">
                    {translate(category.name)}
                  </summary>
                  <div className="px-3 py-2 space-y-2">
                    {category.description ? (
                      <div className="text-xs text-white/60">{translate(category.description)}</div>
                    ) : null}
                    {category.items.flatMap((item, index) => {
                      const elements: ReactElement[] = [];
                      if (item.section && item.section !== currentSection) {
                        currentSection = item.section;
                        elements.push(
                          <div
                            key={`section-${category.name}-${item.section}-${index}`}
                            className="text-sm font-semibold text-white/80 mt-2"
                          >
                            {translate(item.section)}
                          </div>,
                        );
                      }
                      const value = getItemValue(parsedJson, item.parsingInfo);
                      const isBoolean = isBooleanItem(item.parsingInfo);
                      const isNumeric = isNumericItem(item.parsingInfo);
                      const suggestedMax = getSuggestedMax(item.parsingInfo);
                      const prereqText = item.prereqs?.length
                        ? t("UI_SAVE_EDITOR_PREREQS", "Prerequisites: {value}").replace(
                            "{value}",
                            item.prereqs.map(pr => translate(pr)).join(", ")
                          )
                        : null;
                      const helperText = item.killsRequired
                        ? t("UI_SAVE_EDITOR_KILLS_REQUIRED", "Target kills: {value}").replace(
                            "{value}",
                            String(item.killsRequired)
                          )
                        : null;

                      elements.push(
                        <div
                          key={`item-${item.name}-${index}`}
                          className="border border-white/10 rounded px-3 py-2 space-y-2 bg-[#101a2c]"
                        >
                          <div>
                            <div className="font-medium">{translate(item.name)}</div>
                            {item.location ? (
                              <div className="text-xs text-white/60 whitespace-pre-line">
                                {translate(item.location)}
                              </div>
                            ) : null}
                            {prereqText ? (
                              <div className="text-xs text-white/50">{prereqText}</div>
                            ) : null}
                            {helperText ? (
                              <div className="text-xs text-white/50">{helperText}</div>
                            ) : null}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs text-white/60">
                              {t("UI_SAVE_EDITOR_CURRENT_VALUE", "Current value")}: {String(value)}
                            </div>
                            {isBoolean ? (
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4"
                                  checked={Boolean(value)}
                                  disabled={!hasParsedJson}
                                  onChange={event => handleValueChange(item, event.target.checked)}
                                />
                                <span>{t("UI_SAVE_EDITOR_TOGGLE_UNLOCKED", "Mark as unlocked")}</span>
                              </label>
                            ) : null}
                            {isNumeric ? (
                              <input
                                type="number"
                                className="w-28 bg-[#0d1828] border border-white/20 rounded px-2 py-1 text-right"
                                value={Number(value) ?? 0}
                                min={0}
                                max={suggestedMax ?? undefined}
                                disabled={!hasParsedJson}
                                onChange={event => {
                                  const raw = Number(event.target.value);
                                  const clamped = Number.isNaN(raw)
                                    ? 0
                                    : suggestedMax !== null
                                      ? Math.min(Math.max(0, Math.floor(raw)), suggestedMax)
                                      : Math.max(0, Math.floor(raw));
                                  handleValueChange(item, clamped);
                                }}
                              />
                            ) : null}
                          </div>
                        </div>,
                      );
                      return elements;
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-[#24344d80] rounded-lg p-4 space-y-3">
        <h3 className="text-base font-semibold">{t("UI_SAVE_EDITOR_SECTION_COPY", "Copy & backup")}</h3>
        {!isAutoSaveSupported ? (
          <div className="text-sm text-white/70">
            {t("UI_SAVE_EDITOR_SAVE_UNAVAILABLE", "Slot writing is not supported in this environment")}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <label className="flex-1 text-sm space-y-1">
                <span className="text-white/80">{t("UI_SAVE_EDITOR_COPY_SOURCE", "Source slot")}</span>
                <select
                  className="w-full bg-[#0d1828] border border-white/20 rounded px-2 py-2"
                  value={copySourceId}
                  onChange={event => setCopySourceId(event.target.value)}
                >
                  {slotOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex-1 text-sm space-y-1">
                <span className="text-white/80">{t("UI_SAVE_EDITOR_COPY_TARGET", "Target slot")}</span>
                <select
                  className="w-full bg-[#0d1828] border border-white/20 rounded px-2 py-2"
                  value={copyTargetId}
                  onChange={event => setCopyTargetId(event.target.value)}
                >
                  {slotOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={handleCopySlot}
              disabled={isCopying || autoSaveSlots.length < 2}
              className={`px-3 py-2 rounded font-semibold text-sm transition-colors ${
                isCopying || autoSaveSlots.length < 2
                  ? "bg-blue-900/40 border border-blue-700 text-white/60 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white"
              }`}
            >
              {isCopying ? t("UI_SAVE_EDITOR_COPYING", "Copying…") : t("UI_SAVE_EDITOR_COPY_BUTTON", "Copy to target slot")}
            </button>
          </div>
        )}
      </section>

      <section className="bg-[#24344d80] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold">{t("UI_SAVE_EDITOR_BACKUP_SECTION", "Backups")}</h3>
          {electronApi?.listWindowsBackups ? (
            <button
              type="button"
              onClick={loadBackups}
              className="px-3 py-1 text-xs border border-white/30 rounded hover:border-white hover:text-white"
            >
              {isLoadingBackups
                ? t("UI_SAVE_EDITOR_BACKUP_REFRESHING", "Refreshing…")
                : t("UI_SAVE_EDITOR_BACKUP_REFRESH", "Refresh backups")}
            </button>
          ) : null}
        </div>
        {!electronApi?.listWindowsBackups ? (
          <div className="text-sm text-white/70">
            {t("UI_SAVE_EDITOR_BACKUP_UNAVAILABLE", "Backup management is not available here")}
          </div>
        ) : backups.length === 0 ? (
          <div className="text-sm text-white/70">
            {backupError ?? t("UI_SAVE_EDITOR_BACKUP_EMPTY", "No backup files found")}
          </div>
        ) : (
          <div className="space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-white/80">{t("UI_SAVE_EDITOR_BACKUP_SELECT", "Select backup file")}</span>
              <select
                className="w-full bg-[#0d1828] border border-white/20 rounded px-2 py-2"
                value={selectedBackupName}
                onChange={event => setSelectedBackupName(event.target.value)}
              >
                {backups.map(entry => (
                  <option key={entry.fileName} value={entry.fileName}>
                    {buildBackupLabel(entry, t, formatLocaleTimestamp)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-white/80">{t("UI_SAVE_EDITOR_RESTORE_TARGET", "Restore to slot")}</span>
              <select
                className="w-full bg-[#0d1828] border border-white/20 rounded px-2 py-2"
                value={restoreTargetId}
                onChange={event => setRestoreTargetId(event.target.value)}
              >
                {slotOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleRestoreBackup}
              disabled={isRestoring || backups.length === 0}
              className={`px-3 py-2 rounded font-semibold text-sm transition-colors ${
                isRestoring || backups.length === 0
                  ? "bg-orange-900/40 border border-orange-700 text-white/60 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-500 border border-orange-500 text-white"
              }`}
            >
              {isRestoring
                ? t("UI_SAVE_EDITOR_RESTORING", "Restoring…")
                : t("UI_SAVE_EDITOR_RESTORE_BUTTON", "Restore selected backup")}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
