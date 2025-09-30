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

type BackupEntry = {
  fileName: string;
  slotIndex: number | null;
  modifiedAt: number;
  size: number;
};

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
  async getLogPath(): Promise<string> {
    return (await ipcRenderer.invoke('get-log-path')) as string;
  },
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
  async readWindowsSlot(payload: { filePath: string }): Promise<Uint8Array> {
    const buffer = (await ipcRenderer.invoke('auto-saves:read-slot', payload)) as Buffer;
    return new Uint8Array(buffer);
  },
  async writeWindowsSlot(payload: { filePath: string; data: Uint8Array }): Promise<void> {
    await ipcRenderer.invoke('auto-saves:write-slot', payload);
  },
  async copyWindowsSlot(payload: { sourcePath: string; targetPath: string }): Promise<void> {
    await ipcRenderer.invoke('auto-saves:copy-slot', payload);
  },
  async listWindowsBackups(): Promise<BackupEntry[]> {
    return (await ipcRenderer.invoke('auto-saves:list-backups')) as BackupEntry[];
  },
  async restoreWindowsBackup(payload: { fileName: string; targetPath: string }): Promise<void> {
    await ipcRenderer.invoke('auto-saves:restore-backup', payload);
  },
});
