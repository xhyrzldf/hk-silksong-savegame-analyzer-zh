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

interface ElectronAPI {
  platform: NodeJS.Platform;
  versions: NodeJS.ProcessVersions;
  listWindowsSaves: () => Promise<WindowsSaveEntry[]>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
