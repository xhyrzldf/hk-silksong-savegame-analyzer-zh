import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { promises as fs } from 'node:fs';
import type { Dirent } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import log from 'electron-log/main';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

const isDev = !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:5173';
const BACKUP_DIR_NAME = 'tool_bak';

// 配置日志系统 - 统一输出到 userData 目录
// 使用立即执行函数，只计算一次路径
const logPath = (() => {
  const logFileName = `silksong-save-analyzer.log`;

  if (isDev) {
    // 开发模式：输出到项目根目录（dist-electron 的父目录）
    const logDir = path.dirname(app.getAppPath());
    return path.join(logDir, logFileName);
  } else {
    // 打包后：输出到 %APPDATA%\Silksong Savegame Analyzer\logs\
    // 使用 userData 目录确保用户可以稳定访问日志
    const userDataDir = app.getPath('userData');
    const logDir = path.join(userDataDir, 'logs');

    // 确保日志目录存在
    try {
      const fs = require('fs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    } catch (error) {
      console.error('[electron] 无法创建日志目录:', logDir, error);
    }

    return path.join(logDir, logFileName);
  }
})();

log.transports.file.resolvePathFn = () => logPath;

// 配置日志格式和参数
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB
log.transports.file.level = isDev ? 'debug' : 'info';
log.transports.console.level = isDev ? 'debug' : 'info';

// 初始化日志系统
log.initialize();

log.info('='.repeat(80));
log.info('应用启动');
log.info(`版本: ${app.getVersion()}`);
log.info(`Electron 版本: ${process.versions.electron}`);
log.info(`Node 版本: ${process.versions.node}`);
log.info(`Chrome 版本: ${process.versions.chrome}`);
log.info(`平台: ${process.platform} ${process.arch}`);
log.info(`是否打包: ${!isDev}`);
log.info(`应用路径: ${app.getAppPath()}`);
log.info(`可执行文件路径: ${process.execPath}`);
log.info(`Resources 路径: ${process.resourcesPath || 'N/A'}`);
log.info(`日志文件路径: ${log.transports.file.getFile().path}`);
log.info('='.repeat(80));

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
  const savesRoot = path.join(
    userProfile,
    'AppData',
    'LocalLow',
    'Team Cherry',
    'Hollow Knight Silksong',
  );
  log.debug(`存档根目录: ${savesRoot}`);
  return savesRoot;
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
    log.debug(`目标文件不存在，跳过备份: ${targetPath}`);
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

  log.info(`创建备份: ${targetPath} -> ${backupName}`);
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
    log.debug('非 Windows 平台，跳过存档扫描');
    return [];
  }

  const savesRoot = getSavesRoot();
  const entries: WindowsSaveEntry[] = [];

  let rootDirEntries: Dirent[];
  try {
    log.info(`开始扫描存档目录: ${savesRoot}`);
    rootDirEntries = await fs.readdir(savesRoot, { withFileTypes: true });
    log.info(`找到 ${rootDirEntries.length} 个子目录`);
  } catch (error) {
    log.error('无法读取存档根目录:', error);
    return [];
  }

  for (const dirent of rootDirEntries) {
    if (!dirent.isDirectory()) continue;
    const folderPath = path.join(savesRoot, dirent.name);
    let filesInFolder: Dirent[];
    try {
      filesInFolder = await fs.readdir(folderPath, { withFileTypes: true });
    } catch (error) {
      log.warn('无法读取存档子目录:', folderPath, error);
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
        log.debug(`成功读取存档: ${filePath} (${data.length} 字节)`);
      } catch (error) {
        log.warn('无法读取存档文件:', filePath, error);
      }
    }
  }

  const sorted = entries.sort((a, b) => {
    if (a.slotIndex !== b.slotIndex) {
      return a.slotIndex - b.slotIndex;
    }
    return b.modifiedAt - a.modifiedAt;
  });
  log.info(`存档扫描完成，共找到 ${sorted.length} 个存档文件`);
  return sorted;
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
      log.warn('无法读取备份文件信息:', fullPath, error);
    }
  }

  return backups.sort((a, b) => b.modifiedAt - a.modifiedAt);
}

function createMainWindow() {
  log.info('开始创建主窗口');
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
  log.info('主窗口对象已创建');

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    log.debug(`拦截外部链接打开请求: ${url}`);
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('ready-to-show', () => {
    log.info('主窗口准备就绪，开始显示');
    mainWindow?.show();
    if (isDev) {
      log.debug('开发模式：打开开发者工具');
      mainWindow?.webContents.openDevTools({ mode: 'detach' });
    }
  });

  if (isDev) {
    log.info(`加载开发服务器: ${devServerUrl}`);
    mainWindow.loadURL(devServerUrl).catch(error => {
      log.error('无法加载开发服务器 URL:', error);
    });
  } else {
    const indexHtml = path.join(app.getAppPath(), 'dist', 'index.html');
    log.info(`加载生产环境页面: ${indexHtml}`);
    mainWindow
      .loadFile(indexHtml)
      .catch(error => log.error('无法加载 index.html:', error));
  }

  mainWindow.on('closed', () => {
    log.info('主窗口已关闭');
    mainWindow = null;
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    log.info('检测到第二个实例启动，聚焦现有窗口');
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    log.info('Electron 应用准备就绪');
    createMainWindow();

    ipcMain.handle('get-log-path', async () => {
      return log.transports.file.getFile().path;
    });

    ipcMain.handle('auto-saves:list', async () => {
      log.debug('IPC 请求: auto-saves:list');
      try {
        const result = await discoverWindowsSaves();
        log.debug(`IPC 响应: auto-saves:list - 返回 ${result.length} 个存档`);
        return result;
      } catch (error) {
        log.error('IPC 处理失败 (auto-saves:list):', error);
        return [];
      }
    });

    ipcMain.handle('auto-saves:read-slot', async (_event, payload: { filePath: string }) => {
      log.debug(`IPC 请求: auto-saves:read-slot - 读取 ${payload.filePath}`);
      try {
        const { filePath } = payload;
        if (!filePath) {
          throw new Error('Missing file path');
        }
        const savesRoot = getSavesRoot();
        assertInsideRoot(filePath, savesRoot);
        const data = await fs.readFile(filePath);
        log.debug(`成功读取存档: ${filePath} (${data.length} 字节)`);
        return data;
      } catch (error) {
        log.error('IPC 处理失败 (auto-saves:read-slot):', error);
        throw error;
      }
    });

    ipcMain.handle('auto-saves:write-slot', async (_event, payload: { filePath: string; data: ArrayBuffer | Uint8Array | number[] }) => {
      log.info(`IPC 请求: auto-saves:write-slot - 写入 ${payload.filePath}`);
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
        log.info(`成功写入存档: ${filePath} (${buffer.length} 字节)${backupName ? `, 备份: ${backupName}` : ''}`);
        return { success: true, backupName };
      } catch (error) {
        log.error('IPC 处理失败 (auto-saves:write-slot):', error);
        throw error;
      }
    });

    ipcMain.handle('auto-saves:copy-slot', async (_event, payload: { sourcePath: string; targetPath: string }) => {
      log.info(`IPC 请求: auto-saves:copy-slot - ${payload.sourcePath} -> ${payload.targetPath}`);
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
        log.info(`成功复制存档${backupName ? `, 备份: ${backupName}` : ''}`);
        return { success: true, backupName };
      } catch (error) {
        log.error('IPC 处理失败 (auto-saves:copy-slot):', error);
        throw error;
      }
    });

    ipcMain.handle('auto-saves:list-backups', async () => {
      log.debug('IPC 请求: auto-saves:list-backups');
      try {
        const result = await listBackups();
        log.debug(`IPC 响应: auto-saves:list-backups - 返回 ${result.length} 个备份`);
        return result;
      } catch (error) {
        log.error('IPC 处理失败 (auto-saves:list-backups):', error);
        throw error;
      }
    });

    ipcMain.handle('auto-saves:restore-backup', async (_event, payload: { fileName: string; targetPath: string }) => {
      log.info(`IPC 请求: auto-saves:restore-backup - ${payload.fileName} -> ${payload.targetPath}`);
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
        log.info(`成功还原备份: ${fileName} -> ${targetPath}`);
        return { success: true };
      } catch (error) {
        log.error('IPC 处理失败 (auto-saves:restore-backup):', error);
        throw error;
      }
    });

    app.on('activate', () => {
      log.debug('应用激活事件');
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    log.info('所有窗口已关闭');
    if (process.platform !== 'darwin') {
      log.info('退出应用');
      app.quit();
    }
  });
}
