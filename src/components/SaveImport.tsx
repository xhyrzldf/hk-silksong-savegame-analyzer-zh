import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlotSelectionDialog } from "./SlotSelectionDialog";
import { useI18n } from "../i18n/I18nContext";
import type { AutoSaveSummary } from "../hooks/useWindowsSaves";
import {
  extractSaveFromArchive,
  isSupportedArchive,
  isSaveFile,
} from "../services/archiveHandler";
import { decodeSave } from "../services/decryptor";
import { toast } from "sonner";

interface SaveImportProps {
  saves: AutoSaveSummary[];
  isSupported: boolean;
  onImport: (slotIndex: number, saveData: Uint8Array, filename: string) => Promise<void>;
}

export function SaveImport({ saves, isSupported, onImport }: SaveImportProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<{
    data: Uint8Array;
    filename: string;
  } | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let saveData: Uint8Array;
      let filename: string;

      // 检查文件类型
      if (isSupportedArchive(file.name)) {
        // 压缩包文件
        toast.info(t("UI_IMPORT_EXTRACTING", "正在解压..."));
        const extracted = await extractSaveFromArchive(file);

        if (!extracted) {
          toast.error(t("UI_IMPORT_NO_SAVE_FOUND", "压缩包中未找到存档文件"));
          return;
        }

        saveData = extracted.data;
        filename = extracted.filename;
        toast.success(
          t("UI_IMPORT_EXTRACTED", "已提取: {filename}").replace("{filename}", filename)
        );
      } else if (isSaveFile(file.name)) {
        // 直接的存档文件
        const arrayBuffer = await file.arrayBuffer();
        saveData = new Uint8Array(arrayBuffer);
        filename = file.name;
      } else {
        toast.error(
          t(
            "UI_IMPORT_UNSUPPORTED_FILE",
            "不支持的文件格式。请选择 userX.dat 或压缩包（zip/rar/7z）"
          )
        );
        return;
      }

      // 验证存档文件是否有效
      try {
        const jsonText = decodeSave(saveData);
        JSON.parse(jsonText); // 验证是否为有效JSON
      } catch (error) {
        toast.error(t("UI_IMPORT_INVALID_SAVE", "无效的存档文件"));
        console.error("存档验证失败:", error);
        return;
      }

      // 保存待导入的数据并打开槽位选择对话框
      setPendingImport({ data: saveData, filename });
      setDialogOpen(true);
    } catch (error) {
      console.error("导入失败:", error);
      toast.error(
        t("UI_IMPORT_ERROR", "导入失败: {error}").replace(
          "{error}",
          error instanceof Error ? error.message : String(error)
        )
      );
    } finally {
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSlotConfirm = async (slotIndex: number) => {
    if (!pendingImport) return;

    try {
      await onImport(slotIndex, pendingImport.data, pendingImport.filename);
      toast.success(
        t("UI_IMPORT_SUCCESS", "成功导入到槽位 {slot}").replace("{slot}", String(slotIndex))
      );
    } catch (error) {
      console.error("导入到槽位失败:", error);
      toast.error(
        t("UI_IMPORT_SLOT_ERROR", "导入失败: {error}").replace(
          "{error}",
          error instanceof Error ? error.message : String(error)
        )
      );
    } finally {
      setPendingImport(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".dat,.zip,.rar,.7z"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        onClick={handleClick}
        disabled={!isSupported}
        variant="outline"
        className="border-emerald-400/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 disabled:opacity-50"
      >
        <Upload className="mr-2 h-4 w-4" />
        {t("UI_IMPORT_SAVE", "导入存档")}
      </Button>

      {pendingImport && (
        <SlotSelectionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          saves={saves}
          onConfirm={handleSlotConfirm}
          importFileName={pendingImport.filename}
        />
      )}
    </>
  );
}