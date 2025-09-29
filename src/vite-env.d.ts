/// <reference types="vite/client" />

interface ElectronAPI {
  platform: NodeJS.Platform;
  versions: NodeJS.ProcessVersions;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
