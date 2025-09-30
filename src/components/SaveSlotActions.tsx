import { useCallback, useEffect, useMemo, useState } from "react";

import type { AutoSaveSummary } from "../hooks/useWindowsSaves";
import { useI18n } from "../i18n/I18nContext";
import { encodeSave } from "../services/decryptor";

type FeedbackKind = "success" | "error" | "info";

type FeedbackMessage = {
  kind: FeedbackKind;
  text: string;
};

interface SaveSlotActionsProps {
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

export function SaveSlotActions({
  parsedJson,
  jsonText,
  setJsonText,
  activeAutoSave,
  autoSaveSlots,
  isAutoSaveSupported,
  refreshAutoSaves,
  saveEncrypted,
  savePlain,
}: SaveSlotActionsProps) {
  const { t, locale } = useI18n();
  const electronApi =
    typeof window !== "undefined"
      ? (window as Window & { electronAPI?: ElectronAPI }).electronAPI
      : undefined;

  const localeKey = locale === "zh" ? "zh-CN" : "en-US";
  const hasParsedJson = Boolean(parsedJson) && typeof parsedJson === "object";

  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [backups, setBackups] = useState<WindowsBackupEntry[]>([]);
  const [selectedBackupName, setSelectedBackupName] = useState<string>("");
  const [restoreTargetId, setRestoreTargetId] = useState<string>("");
  const [copySourceId, setCopySourceId] = useState<string>("");
  const [copyTargetId, setCopyTargetId] = useState<string>("");

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

  const slotOptions = useMemo(
    () => autoSaveSlots.map(save => ({ id: save.id, label: buildSlotLabel(save, t) })),
    [autoSaveSlots, t],
  );

  const ensureJsonIsValid = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      const normalized = JSON.stringify(parsed, null, 2);
      if (normalized !== jsonText) {
        setJsonText(normalized);
      }
      return normalized;
    } catch (error) {
      console.error("[save-slot-actions] Invalid JSON before saving", error);
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_JSON_INVALID", "Unable to parse the current save data") });
      return null;
    }
  }, [jsonText, setJsonText, t]);

  const loadBackups = useCallback(async () => {
    if (!electronApi?.listWindowsBackups) {
      setBackups([]);
      return;
    }
    setIsLoadingBackups(true);
    try {
      const entries = await electronApi.listWindowsBackups();
      setBackups(entries);
    } catch (error) {
      console.error("[save-slot-actions] Failed to list backups", error);
      setBackups([]);
    } finally {
      setIsLoadingBackups(false);
    }
  }, [electronApi, t]);

  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

  useEffect(() => {
    if (backups.length === 0) {
      setSelectedBackupName("");
      return;
    }
    if (!backups.some(entry => entry.fileName === selectedBackupName)) {
      setSelectedBackupName(backups[0].fileName);
    }
  }, [backups, selectedBackupName]);

  const handleSaveToSlot = useCallback(async () => {
    if (!electronApi?.writeWindowsSlot) {
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_SAVE_UNAVAILABLE", "Slot writing is not supported in this environment") });
      return;
    }
    if (!activeAutoSave) {
      setFeedback({ kind: "info", text: t("UI_SAVE_EDITOR_ACTIVE_SLOT_REQUIRED", "Select a destination slot first") });
      return;
    }
    const normalized = ensureJsonIsValid();
    if (!normalized) {
      return;
    }
    setIsSaving(true);
    try {
      const data = encodeSave(normalized);
      await electronApi.writeWindowsSlot({ filePath: activeAutoSave.filePath, data });
      setFeedback({ kind: "success", text: t("UI_SAVE_EDITOR_SAVE_SUCCESS", "Save written and backup created") });
      const refreshResult = refreshAutoSaves();
      if (isPromiseLike(refreshResult)) {
        await refreshResult;
      }
      await loadBackups();
    } catch (error) {
      console.error("[save-slot-actions] Failed to write slot", error);
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_SAVE_FAILED", "Save failed, please try again") });
    } finally {
      setIsSaving(false);
    }
  }, [activeAutoSave, ensureJsonIsValid, loadBackups, refreshAutoSaves, t, electronApi]);

  const handleDownloadDat = useCallback(() => {
    const normalized = ensureJsonIsValid();
    if (!normalized) {
      return;
    }
    setJsonText(normalized);
    saveEncrypted();
  }, [ensureJsonIsValid, saveEncrypted, setJsonText]);

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
      console.error("[save-slot-actions] Failed to copy slot", error);
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
      console.error("[save-slot-actions] Failed to restore backup", error);
      setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_RESTORE_FAILED", "Restore failed, please try again") });
    } finally {
      setIsRestoring(false);
    }
  }, [autoSaveSlots, electronApi, loadBackups, refreshAutoSaves, restoreTargetId, selectedBackupName, t]);

  return (
    <section className="text-white">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-semibold text-white/90">
          {t("UI_SAVE_MANAGER_TITLE", "存档工具")}
        </h2>
        {activeAutoSave && (
          <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-200">
            {t("UI_AUTO_SAVES_SLOT", "槽位 {index}").replace("{index}", String(activeAutoSave.slotIndex))} · {activeAutoSave.displayName}
          </span>
        )}
      </div>

      {feedback && (
        <div
          className={`mt-2 rounded-lg border px-3 py-2 text-xs ${
            feedback.kind === "success"
              ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-100"
              : feedback.kind === "error"
                ? "border-red-500/60 bg-red-500/15 text-red-200"
                : "border-sky-400/60 bg-sky-500/15 text-sky-100"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {/* 快捷操作按钮 - 网格布局 */}
        <button
          type="button"
          onClick={handleSaveToSlot}
          disabled={!isAutoSaveSupported || !electronApi?.writeWindowsSlot || !hasParsedJson || isSaving}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
            !isAutoSaveSupported || !electronApi?.writeWindowsSlot || !hasParsedJson || isSaving
              ? "cursor-not-allowed border-emerald-400/25 bg-emerald-500/10 text-white/50"
              : "border-emerald-400/70 bg-emerald-500/90 text-slate-950 shadow-md hover:bg-emerald-400/80"
          }`}
        >
          {isSaving ? t("UI_SAVE_EDITOR_SAVING", "保存中...") : t("UI_SAVE_EDITOR_SAVE_BUTTON", "写入槽位")}
        </button>
        <button
          type="button"
          onClick={handleDownloadDat}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 transition-all hover:border-emerald-300/60 hover:bg-emerald-500/10 hover:text-white"
        >
          {t("UI_SAVE_ENCRYPTED", "导出 .dat")}
        </button>
        <button
          type="button"
          onClick={savePlain}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 transition-all hover:border-emerald-300/60 hover:bg-emerald-500/10 hover:text-white"
        >
          {t("UI_SAVE_PLAIN", "导出 .json")}
        </button>

        {/* 槽位复制按钮组 */}
        {isAutoSaveSupported && autoSaveSlots.length >= 2 && (
          <>
            <span className="text-xs text-white/30">|</span>
            <select
              className="rounded-lg border border-white/15 bg-slate-950/60 px-2 py-1 text-xs"
              value={copySourceId}
              onChange={event => setCopySourceId(event.target.value)}
            >
              {slotOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="text-xs text-white/50">→</span>
            <select
              className="rounded-lg border border-white/15 bg-slate-950/60 px-2 py-1 text-xs"
              value={copyTargetId}
              onChange={event => setCopyTargetId(event.target.value)}
            >
              {slotOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleCopySlot}
              disabled={isCopying}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                isCopying
                  ? "cursor-not-allowed border-emerald-400/25 bg-emerald-500/10 text-white/50"
                  : "border-emerald-400/70 bg-emerald-500/90 text-slate-950 shadow-md hover:bg-emerald-400/80"
              }`}
            >
              {isCopying ? t("UI_SAVE_EDITOR_COPYING", "复制中...") : t("UI_SAVE_EDITOR_COPY_BUTTON", "复制")}
            </button>
          </>
        )}

        {/* 备份还原按钮组 */}
        {electronApi?.listWindowsBackups && backups.length > 0 && (
          <>
            <span className="text-xs text-white/30">|</span>
            <select
              className="max-w-[200px] truncate rounded-lg border border-white/15 bg-slate-950/60 px-2 py-1 text-xs"
              value={selectedBackupName}
              onChange={event => setSelectedBackupName(event.target.value)}
            >
              {backups.map(entry => (
                <option key={entry.fileName} value={entry.fileName}>
                  {buildBackupLabel(entry, t, value => formatTimestamp(value, localeKey))}
                </option>
              ))}
            </select>
            <span className="text-xs text-white/50">→</span>
            <select
              className="rounded-lg border border-white/15 bg-slate-950/60 px-2 py-1 text-xs"
              value={restoreTargetId}
              onChange={event => setRestoreTargetId(event.target.value)}
            >
              {slotOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRestoreBackup}
              disabled={isRestoring}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                isRestoring
                  ? "cursor-not-allowed border-amber-400/25 bg-amber-500/10 text-white/50"
                  : "border-amber-400/70 bg-amber-500/90 text-slate-950 shadow-md hover:bg-amber-400/80"
              }`}
            >
              {isRestoring ? t("UI_SAVE_EDITOR_RESTORING", "还原中...") : t("UI_SAVE_EDITOR_RESTORE_BUTTON", "还原")}
            </button>
            <button
              type="button"
              onClick={loadBackups}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs font-semibold text-white/70 transition-all hover:border-emerald-300/60 hover:bg-emerald-500/10 hover:text-white"
            >
              {isLoadingBackups ? "⟳" : "↻"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
