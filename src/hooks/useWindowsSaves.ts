import { useCallback, useEffect, useMemo, useState } from "react";

import { decodeSave } from "../services/decryptor";
import { calculateCompletionPercent, extractSaveDisplayName } from "../services/saveSummary";
import { useI18n } from "../i18n/I18nContext";

export interface AutoSaveSummary {
  id: string;
  slotIndex: number;
  fileName: string;
  directoryName: string;
  filePath: string;
  displayName: string;
  modifiedAt: number;
  completionPercent: number | null;
  file: File;
}

interface LoadState {
  isSupported: boolean;
  isLoading: boolean;
  error: string | null;
  saves: AutoSaveSummary[];
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function serializeFile(bytes: Uint8Array, fileName: string): File {
  return new File([bytes], fileName, { type: "application/octet-stream" });
}

export function useWindowsSaves() {
  const { t } = useI18n();
  const isRenderer = typeof window !== "undefined";
  const electronApi = isRenderer
    ? (window as Window & { electronAPI?: ElectronAPI }).electronAPI
    : undefined;
  const hasElectronAPI = !!electronApi?.listWindowsSaves;
  const [state, setState] = useState<LoadState>({
    isSupported: hasElectronAPI,
    isLoading: false,
    error: null,
    saves: [],
  });

  useEffect(() => {
    setState(prev => ({ ...prev, isSupported: hasElectronAPI }));
  }, [hasElectronAPI]);

  const loadSaves = useCallback(async () => {
    if (!electronApi?.listWindowsSaves) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const rawEntries = await electronApi.listWindowsSaves();
      const processed: AutoSaveSummary[] = [];

      for (const entry of rawEntries) {
        try {
          const bytes = base64ToUint8Array(entry.data);
          const file = serializeFile(bytes, entry.fileName);
          const json = decodeSave(bytes);
          const parsed = JSON.parse(json);
          const displayName = extractSaveDisplayName(parsed) ?? entry.fileName;
          const completionPercent = calculateCompletionPercent(parsed);
          processed.push({
            id: entry.id,
            slotIndex: entry.slotIndex,
            fileName: entry.fileName,
            directoryName: entry.directoryName,
            filePath: entry.filePath,
            displayName,
            modifiedAt: entry.modifiedAt,
            completionPercent,
            file,
          });
        } catch (innerError) {
          console.warn("[auto-saves] Failed to process entry", entry.fileName, innerError);
        }
      }

      const uniqueBySlot = processed
        .sort((a, b) => {
          if (a.slotIndex !== b.slotIndex) {
            return a.slotIndex - b.slotIndex;
          }
          if (a.directoryName !== b.directoryName) {
            return a.directoryName.localeCompare(b.directoryName);
          }
          return b.modifiedAt - a.modifiedAt;
        })
        .reduce<AutoSaveSummary[]>((acc, entry) => {
          const already = acc.find(item =>
            item.slotIndex === entry.slotIndex && item.directoryName === entry.directoryName,
          );
          if (!already) {
            acc.push(entry);
          }
          return acc;
        }, []);

      setState(prev => ({
        ...prev,
        saves: uniqueBySlot,
        isLoading: false,
      }));
    } catch (error) {
      console.error("[auto-saves] Failed to list windows saves", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: t("ERROR_AUTO_SAVE_LOAD", "Failed to inspect Windows save folder"),
      }));
    }
  }, [electronApi, t]);

  useEffect(() => {
    if (!hasElectronAPI) return;

    let cancelled = false;
    (async () => {
      await loadSaves();
      if (cancelled) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasElectronAPI, loadSaves]);

  return useMemo(() => ({
    ...state,
    refresh: loadSaves,
  }), [state, loadSaves]);
}
