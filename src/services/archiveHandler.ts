import * as fflate from "fflate";
// @ts-ignore - libarchive.js 没有TypeScript类型定义
import { Archive } from "libarchive.js";

/**
 * 从压缩包中提取存档文件
 * 支持 zip/rar/7z 格式
 * 如果有多个 userX.dat 文件，返回数字最小的那个
 */
export async function extractSaveFromArchive(
  file: File
): Promise<{ filename: string; data: Uint8Array } | null> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  try {
    if (extension === "zip") {
      return await extractFromZip(file);
    } else if (extension === "rar" || extension === "7z") {
      return await extractFromArchiveJs(file);
    }
  } catch (error) {
    console.error("解压失败:", error);
    throw new Error(`解压文件失败: ${error instanceof Error ? error.message : String(error)}`);
  }

  return null;
}

/**
 * 使用 fflate 处理 ZIP 文件
 */
async function extractFromZip(
  file: File
): Promise<{ filename: string; data: Uint8Array } | null> {
  const arrayBuffer = await file.arrayBuffer();
  const zipData = new Uint8Array(arrayBuffer);
  const unzipped = fflate.unzipSync(zipData);

  // 查找所有 userX.dat 文件
  const saveFiles: Array<{ filename: string; index: number }> = [];

  for (const filename of Object.keys(unzipped)) {
    // 匹配 userX.dat 文件（可能在子目录中）
    const match = filename.match(/user(\d+)\.dat$/i);
    if (match) {
      saveFiles.push({
        filename,
        index: parseInt(match[1], 10),
      });
    }
  }

  if (saveFiles.length === 0) {
    throw new Error("压缩包中未找到存档文件 (userX.dat)");
  }

  // 选择数字最小的存档
  saveFiles.sort((a, b) => a.index - b.index);
  const selectedFile = saveFiles[0];

  return {
    filename: selectedFile.filename.split("/").pop() || selectedFile.filename,
    data: unzipped[selectedFile.filename],
  };
}

/**
 * 使用 libarchive.js 处理 RAR/7z 文件
 */
async function extractFromArchiveJs(
  file: File
): Promise<{ filename: string; data: Uint8Array } | null> {
  // 初始化 libarchive（需要配置 worker 路径）
  // 注意：这需要在 public 目录中有 libarchive 的 worker 文件
  try {
    Archive.init({
      workerUrl: "/libarchive.js/worker-bundle.js",
    });
  } catch (e) {
    // 如果已经初始化过，会抛出错误，忽略即可
  }

  const archive = await Archive.open(file);
  const extractedFiles = await archive.extractFiles();

  // 查找所有 userX.dat 文件
  const saveFiles: Array<{ filename: string; index: number; file: File }> = [];

  for (const [filename, extractedFile] of Object.entries(extractedFiles)) {
    const match = filename.match(/user(\d+)\.dat$/i);
    if (match) {
      saveFiles.push({
        filename,
        index: parseInt(match[1], 10),
        file: extractedFile as File,
      });
    }
  }

  if (saveFiles.length === 0) {
    throw new Error("压缩包中未找到存档文件 (userX.dat)");
  }

  // 选择数字最小的存档
  saveFiles.sort((a, b) => a.index - b.index);
  const selectedFile = saveFiles[0];

  const arrayBuffer = await selectedFile.file.arrayBuffer();

  return {
    filename: selectedFile.filename.split("/").pop() || selectedFile.filename,
    data: new Uint8Array(arrayBuffer),
  };
}

/**
 * 创建包含存档文件的 ZIP 压缩包
 */
export function createSaveZip(
  filename: string,
  data: Uint8Array
): Uint8Array {
  const files: Record<string, Uint8Array> = {
    [filename]: data,
  };

  const zipped = fflate.zipSync(files, {
    level: 6, // 压缩级别 0-9
  });

  return zipped;
}

/**
 * 下载文件到本地
 */
export function downloadFile(
  data: Uint8Array | Blob,
  filename: string,
  mimeType: string = "application/octet-stream"
) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 检查文件是否是支持的压缩包格式
 */
export function isSupportedArchive(filename: string): boolean {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension === "zip" || extension === "rar" || extension === "7z";
}

/**
 * 检查文件是否是存档文件
 */
export function isSaveFile(filename: string): boolean {
  return /user\d+\.dat$/i.test(filename);
}