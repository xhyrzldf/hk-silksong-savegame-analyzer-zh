import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { promises as fs } from 'node:fs';
import type { Dirent } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

const isDev = !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:5173';

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

async function discoverWindowsSaves(): Promise<WindowsSaveEntry[]> {
  if (process.platform !== 'win32') {
    return [];
  }

  const userProfile = process.env.USERPROFILE ?? os.homedir();
  const savesRoot = path.join(
    userProfile,
    'AppData',
    'LocalLow',
    'Team Cherry',
    'Hollow Knight Silksong',
  );

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
    console.log('[electron] found entry in root:', dirent.name, dirent.isDirectory() ? '(dir)' : '(file)');
    if (!dirent.isDirectory()) continue;
    if (!/^\\d+$/.test(dirent.name)) continue;

    const folderPath = path.join(savesRoot, dirent.name);
    let filesInFolder: Dirent[];
    try {
      filesInFolder = await fs.readdir(folderPath, { withFileTypes: true });
      console.log('[electron] inspecting folder:', folderPath);
    } catch (error) {
      console.warn('[electron] Unable to read Silksong save folder:', folderPath, error);
      continue;
    }

    for (const fileDirent of filesInFolder) {
      console.log('[electron]  - entry:', fileDirent.name, fileDirent.isFile() ? '(file)' : '(dir)');
      if (!fileDirent.isFile()) continue;
      if (!/^user([1-4])\.dat$/i.test(fileDirent.name)) {
        console.log('[electron]  - skip non-slot file:', fileDirent.name);
        continue;
      }

      const filePath = path.join(folderPath, fileDirent.name);
      try {
        const [stats, data] = await Promise.all([
          fs.stat(filePath),
          fs.readFile(filePath),
        ]);
        console.log('[electron]  - push save file:', filePath, 'mtime:', stats.mtime.toISOString());

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
