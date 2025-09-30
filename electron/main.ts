import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { promises as fs } from 'node:fs';
import type { Dirent } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

const isDev = !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:5173';
const BACKUP_DIR_NAME = 'tool_bak';

let mainWindow: BrowserWindow | null = null;

type WindowsSaveEntry = {
  id: string;
  slotIndex: number;
  fileName: string;
  directoryName: string;
  filePath: string;
  modifiedAt: number;
  data: Buffer;
};

type BackupEntry = {
  fileName: string;
  slotIndex: number | null;
  modifiedAt: number;
  size: number;
};

function getSavesRoot(): string {
  const userProfile = process.env.USERPROFILE ?? os.homedir();
  return path.join(
    userProfile,
    'AppData',
    'LocalLow',
    'Team Cherry',
    'Hollow Knight Silksong',
  );
}

function assertInsideRoot(targetPath: string, root: string) {
  const relative = path.relative(root, targetPath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path outside of save root: ${targetPath}`);
  }
}

function formatTimestamp(date: Date): string {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

async function createBackupIfExists(targetPath: string): Promise<string | null> {
  try {
    await fs.access(targetPath);
  } catch {
    return null;
  }

  const savesRoot = getSavesRoot();
  assertInsideRoot(targetPath, savesRoot);

  const backupDir = path.join(savesRoot, BACKUP_DIR_NAME);
  await fs.mkdir(backupDir, { recursive: true });

  const extension = path.extname(targetPath) || '.dat';
  const baseName = path.basename(targetPath, extension);
  const timestamp = formatTimestamp(new Date());
  const backupName = `${baseName}_${timestamp}${extension}`;
  const backupPath = path.join(backupDir, backupName);

  await fs.copyFile(targetPath, backupPath);
  return backupName;
}

function toBuffer(data: ArrayBuffer | Uint8Array | number[]): Buffer {
  if (data instanceof ArrayBuffer) {
    return Buffer.from(data);
  }
  if (ArrayBuffer.isView(data)) {
    const view = data as ArrayBufferView;
    return Buffer.from(view.buffer, view.byteOffset, view.byteLength);
  }
  return Buffer.from(data);
}

async function discoverWindowsSaves(): Promise<WindowsSaveEntry[]> {
  if (process.platform !== 'win32') {
    return [];
  }

  const savesRoot = getSavesRoot();
  const entries: WindowsSaveEntry[] = [];

  let rootDirEntries: Dirent[];
  try {
    rootDirEntries = await fs.readdir(savesRoot, { withFileTypes: true });
    console.log('[electron] scanning saves root:', savesRoot);
  } catch (error) {
    console.warn('[electron] Unable to read Silksong save root:', error);
    return [];
  }

  for (const dirent of rootDirEntries) {
    if (!dirent.isDirectory()) continue;
    const folderPath = path.join(savesRoot, dirent.name);
    let filesInFolder: Dirent[];
    try {
      filesInFolder = await fs.readdir(folderPath, { withFileTypes: true });
    } catch (error) {
      console.warn('[electron] Unable to read Silksong save folder:', folderPath, error);
      continue;
    }

    for (const fileDirent of filesInFolder) {
      if (!fileDirent.isFile()) continue;
      if (!/^user([1-4])\.dat$/i.test(fileDirent.name)) {
        continue;
      }

      const filePath = path.join(folderPath, fileDirent.name);
      try {
        const [stats, data] = await Promise.all([
          fs.stat(filePath),
          fs.readFile(filePath),
        ]);

        const slotMatch = fileDirent.name.match(/user([1-4])\.dat/i);
        const slotIndex = slotMatch ? Number(slotMatch[1]) : 0;

        entries.push({
          id: `${dirent.name}-${fileDirent.name.toLowerCase()}`,
          slotIndex,
          fileName: fileDirent.name,
          directoryName: dirent.name,
          filePath,
          modifiedAt: stats.mtime.getTime(),
          data,
        });
      } catch (error) {
        console.warn('[electron] Unable to read Silksong save file:', filePath, error);
      }
    }
  }

  return entries.sort((a, b) => {
    if (a.slotIndex !== b.slotIndex) {
      return a.slotIndex - b.slotIndex;
    }
    return b.modifiedAt - a.modifiedAt;
  });
}

async function listBackups(): Promise<BackupEntry[]> {
  const savesRoot = getSavesRoot();
  const backupDir = path.join(savesRoot, BACKUP_DIR_NAME);

  let dirents: Dirent[];
  try {
    dirents = await fs.readdir(backupDir, { withFileTypes: true });
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const backups: BackupEntry[] = [];
  for (const dirent of dirents) {
    if (!dirent.isFile() || !dirent.name.toLowerCase().endsWith('.dat')) continue;
    const fullPath = path.join(backupDir, dirent.name);
    try {
      const stats = await fs.stat(fullPath);
      const slotMatch = dirent.name.match(/user(\d+)/i);
      backups.push({
        fileName: dirent.name,
        slotIndex: slotMatch ? Number(slotMatch[1]) : null,
        modifiedAt: stats.mtime.getTime(),
        size: stats.size,
      });
    } catch (error) {
      console.warn('[electron] Unable to stat backup file:', fullPath, error);
    }
  }

  return backups.sort((a, b) => b.modifiedAt - a.modifiedAt);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    if (isDev) {
      mainWindow?.webContents.openDevTools({ mode: 'detach' });
    }
  });

  if (isDev) {
    mainWindow.loadURL(devServerUrl).catch(error => {
      console.error('[electron] Failed to load dev server URL:', error);
    });
  } else {
    const indexHtml = path.join(app.getAppPath(), 'dist', 'index.html');
    mainWindow
      .loadFile(indexHtml)
      .catch(error => console.error('[electron] Failed to load index.html:', error));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createMainWindow();

    ipcMain.handle('auto-saves:list', async () => {
      try {
        return await discoverWindowsSaves();
      } catch (error) {
        console.error('[electron] Failed to gather Silksong saves:', error);
        return [];
      }
    });

    ipcMain.handle('auto-saves:read-slot', async (_event, payload: { filePath: string }) => {
      try {
        const { filePath } = payload;
        if (!filePath) {
          throw new Error('Missing file path');
        }
        const savesRoot = getSavesRoot();
        assertInsideRoot(filePath, savesRoot);
        const data = await fs.readFile(filePath);
        return data;
      } catch (error) {
        console.error('[electron] Failed to read slot file:', error);
        throw error;
      }
    });

    ipcMain.handle('auto-saves:write-slot', async (_event, payload: { filePath: string; data: ArrayBuffer | Uint8Array | number[] }) => {
      try {
        const { filePath, data } = payload;
        if (!filePath || !data) {
          throw new Error('Missing target path or data');
        }
        const savesRoot = getSavesRoot();
        assertInsideRoot(filePath, savesRoot);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const backupName = await createBackupIfExists(filePath);
        const buffer = toBuffer(data);
        await fs.writeFile(filePath, buffer);
        return { success: true, backupName };
      } catch (error) {
        console.error('[electron] Failed to write slot file:', error);
        throw error;
      }
    });

    ipcMain.handle('auto-saves:copy-slot', async (_event, payload: { sourcePath: string; targetPath: string }) => {
      try {
        const { sourcePath, targetPath } = payload;
        if (!sourcePath || !targetPath) {
          throw new Error('Missing source or target path');
        }
        const savesRoot = getSavesRoot();
        assertInsideRoot(sourcePath, savesRoot);
        assertInsideRoot(targetPath, savesRoot);
        await fs.access(sourcePath);
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        const backupName = await createBackupIfExists(targetPath);
        await fs.copyFile(sourcePath, targetPath);
        return { success: true, backupName };
      } catch (error) {
        console.error('[electron] Failed to copy slot:', error);
        throw error;
      }
    });

    ipcMain.handle('auto-saves:list-backups', async () => {
      try {
        return await listBackups();
      } catch (error) {
        console.error('[electron] Failed to list backups:', error);
        throw error;
      }
    });

    ipcMain.handle('auto-saves:restore-backup', async (_event, payload: { fileName: string; targetPath: string }) => {
      try {
        const { fileName, targetPath } = payload;
        if (!fileName || !targetPath) {
          throw new Error('Missing backup file name or target path');
        }
        const savesRoot = getSavesRoot();
        assertInsideRoot(targetPath, savesRoot);
        const backupDir = path.join(savesRoot, BACKUP_DIR_NAME);
        const backupPath = path.join(backupDir, fileName);
        assertInsideRoot(backupPath, backupDir);
        await fs.access(backupPath);
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await createBackupIfExists(targetPath);
        await fs.copyFile(backupPath, targetPath);
        return { success: true };
      } catch (error) {
        console.error('[electron] Failed to restore backup:', error);
        throw error;
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
