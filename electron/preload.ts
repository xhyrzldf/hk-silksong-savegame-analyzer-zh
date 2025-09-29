import { contextBridge, ipcRenderer } from 'electron';

type ExposedWindowsSave = {
  id: string;
  slotIndex: number;
  fileName: string;
  directoryName: string;
  filePath: string;
  modifiedAt: number;
  data: string;
};

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
  async listWindowsSaves(): Promise<ExposedWindowsSave[]> {
    if (process.platform !== 'win32') {
      return [];
    }

    const entries = (await ipcRenderer.invoke('auto-saves:list')) as Array<
      Omit<ExposedWindowsSave, 'data'> & { data: Buffer }
    >;

    return entries.map(entry => ({
      ...entry,
      data: entry.data.toString('base64'),
    }));
  },
});
