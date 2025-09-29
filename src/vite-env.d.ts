/// <reference types="vite/client" />

interface WindowsSaveEntry {
  id: string;
  slotIndex: number;
  fileName: string;
  directoryName: string;
  filePath: string;
  modifiedAt: number;
  data: string;
}

interface WindowsBackupEntry {
  fileName: string;
  slotIndex: number | null;
  modifiedAt: number;
  size: number;
}

interface ElectronAPI {
  platform: NodeJS.Platform;
  versions: NodeJS.ProcessVersions;
  listWindowsSaves: () => Promise<WindowsSaveEntry[]>;
  writeWindowsSlot: (payload: { filePath: string; data: Uint8Array }) => Promise<void>;
  copyWindowsSlot: (payload: { sourcePath: string; targetPath: string }) => Promise<void>;
  listWindowsBackups: () => Promise<WindowsBackupEntry[]>;
  restoreWindowsBackup: (payload: { fileName: string; targetPath: string }) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

