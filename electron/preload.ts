import { contextBridge, ipcRenderer } from 'electron';
import { Buffer } from 'node:buffer';

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
      Omit<ExposedWindowsSave, 'data'> & { data: Buffer | Uint8Array }
    >;

    return entries.map(entry => {
      const buffer = Buffer.from(entry.data);
      return {
        ...entry,
        data: buffer.toString('base64'),
      };
    });
  },
});

