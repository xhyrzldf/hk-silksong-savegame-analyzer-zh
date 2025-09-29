import { useEffect, useState } from "react";

import { decodeSave } from "../services/decryptor";
import { calculateCompletionPercent, extractSaveDisplayName } from "../services/saveSummary";
import { useI18n } from "../i18n/I18nContext";

export interface AutoSaveSummary {
  id: string;
  slotIndex: number;
  fileName: string;
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
    let cancelled = false;

    async function loadSaves() {
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
            const file = new File([bytes], entry.fileName, { type: "application/octet-stream" });
            const json = decodeSave(bytes);
            const parsed = JSON.parse(json);
            const displayName = extractSaveDisplayName(parsed) ?? entry.fileName;
            const completionPercent = calculateCompletionPercent(parsed);
            processed.push({
              id: entry.id,
              slotIndex: entry.slotIndex,
              fileName: entry.fileName,
              displayName,
              modifiedAt: entry.modifiedAt,
              completionPercent,
              file,
            });
          } catch (innerError) {
            console.warn("[auto-saves] Failed to process entry", entry.fileName, innerError);
          }
        }

        if (!cancelled) {
          processed.sort((a, b) => {
            if (a.slotIndex !== b.slotIndex) {
              return a.slotIndex - b.slotIndex;
            }
            return b.modifiedAt - a.modifiedAt;
          });

          const uniqueBySlot: AutoSaveSummary[] = [];
          const seenSlots = new Set<number>();
          for (const entry of processed) {
            if (entry.slotIndex && seenSlots.has(entry.slotIndex)) {
              continue;
            }
            if (entry.slotIndex) {
              seenSlots.add(entry.slotIndex);
            }
            uniqueBySlot.push(entry);
            if (uniqueBySlot.length >= 4) {
              break;
            }
          }

          setState(prev => ({
            ...prev,
            saves: uniqueBySlot,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("[auto-saves] Failed to list windows saves", error);
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: t("ERROR_AUTO_SAVE_LOAD", "Failed to inspect Windows save folder"),
          }));
        }
      }
    }

    loadSaves();

    return () => {
      cancelled = true;
    };
  }, [hasElectronAPI, t]);

  return state;
}
