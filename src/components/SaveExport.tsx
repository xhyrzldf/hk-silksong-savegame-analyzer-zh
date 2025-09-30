import { useState } from "react";
import { Download, FileArchive, File } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "../i18n/I18nContext";
import type { AutoSaveSummary } from "../hooks/useWindowsSaves";
import { createSaveZip, downloadFile } from "../services/archiveHandler";
import { toast } from "sonner";

interface SaveExportProps {
  saves: AutoSaveSummary[];
  isSupported: boolean;
  onExport: (slotIndex: number) => Promise<Uint8Array | null>;
}

export function SaveExport({ saves, isSupported, onExport }: SaveExportProps) {
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState<"dat" | "zip">("dat");
  const [exporting, setExporting] = useState(false);

  const availableSaves = saves.filter(save => save.slotIndex >= 1 && save.slotIndex <= 4);

  const handleExport = async () => {
    if (selectedSlot === null) {
      toast.error(t("UI_EXPORT_SELECT_SLOT", "请选择要导出的槽位"));
      return;
    }

    setExporting(true);

    try {
      const saveData = await onExport(selectedSlot);

      if (!saveData) {
        toast.error(t("UI_EXPORT_NO_DATA", "无法读取存档数据"));
        return;
      }

      const filename = `user${selectedSlot}.dat`;

      if (exportFormat === "dat") {
        // 直接导出 .dat 文件
        downloadFile(saveData, filename, "application/octet-stream");
        toast.success(t("UI_EXPORT_SUCCESS_DAT", "成功导出存档文件"));
      } else {
        // 导出为 ZIP 压缩包
        const zipData = createSaveZip(filename, saveData);
        downloadFile(zipData, `user${selectedSlot}_backup.zip`, "application/zip");
        toast.success(t("UI_EXPORT_SUCCESS_ZIP", "成功导出压缩包"));
      }

      setDialogOpen(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error("导出失败:", error);
      toast.error(
        t("UI_EXPORT_ERROR", "导出失败: {error}").replace(
          "{error}",
          error instanceof Error ? error.message : String(error)
        )
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={!isSupported || availableSaves.length === 0}
          className="rounded-lg border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:border-primary hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="mr-1.5 inline h-3.5 w-3.5" />
          {t("UI_EXPORT_SAVE", "导出存档")}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-slate-900/95 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {t("UI_EXPORT_TITLE", "导出存档")}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {t("UI_EXPORT_DESCRIPTION", "选择要导出的槽位和格式")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 槽位选择 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              {t("UI_EXPORT_SELECT_SLOT_LABEL", "选择槽位")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableSaves.map(save => {
                const isSelected = selectedSlot === save.slotIndex;
                return (
                  <button
                    key={save.slotIndex}
                    onClick={() => setSelectedSlot(save.slotIndex)}
                    className={`rounded-lg border-2 p-3 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/15"
                        : "border-white/10 bg-slate-800/50 hover:border-primary/50 hover:bg-slate-800"
                    }`}
                  >
                    <div className="font-semibold text-white">
                      {t("UI_SLOT_NUMBER", "槽位 {index}").replace("{index}", String(save.slotIndex))}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      {save.displayName}
                    </div>
                    <div className="mt-1 text-xs text-primary">
                      {save.completionPercent}% {t("UI_COMPLETE", "完成")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 格式选择 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              {t("UI_EXPORT_FORMAT", "导出格式")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportFormat("dat")}
                className={`flex items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                  exportFormat === "dat"
                    ? "border-primary bg-primary/15"
                    : "border-white/10 bg-slate-800/50 hover:border-primary/50 hover:bg-slate-800"
                }`}
              >
                <File className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold text-white">.dat</div>
                  <div className="text-xs text-white/60">
                    {t("UI_EXPORT_FORMAT_DAT", "直接文件")}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setExportFormat("zip")}
                className={`flex items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                  exportFormat === "zip"
                    ? "border-primary bg-primary/15"
                    : "border-white/10 bg-slate-800/50 hover:border-primary/50 hover:bg-slate-800"
                }`}
              >
                <FileArchive className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold text-white">.zip</div>
                  <div className="text-xs text-white/60">
                    {t("UI_EXPORT_FORMAT_ZIP", "压缩包")}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDialogOpen(false)}
            className="border-white/20 bg-slate-800 text-white hover:bg-slate-700"
          >
            {t("UI_CANCEL", "取消")}
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={selectedSlot === null || exporting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Download className="mr-2 h-4 w-4" />
            {exporting ? t("UI_EXPORTING", "导出中...") : t("UI_EXPORT", "导出")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}