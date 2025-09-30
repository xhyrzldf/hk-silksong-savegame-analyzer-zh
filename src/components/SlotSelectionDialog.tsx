import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "../i18n/I18nContext";
import type { AutoSaveSummary } from "../hooks/useWindowsSaves";

interface SlotSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saves: AutoSaveSummary[];
  onConfirm: (slotIndex: number) => void;
  importFileName: string;
}

export function SlotSelectionDialog({
  open,
  onOpenChange,
  saves,
  onConfirm,
  importFileName,
}: SlotSelectionDialogProps) {
  const { t } = useI18n();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // 生成4个槽位的状态（1-4）
  const slots = [1, 2, 3, 4].map(index => {
    const save = saves.find(s => s.slotIndex === index);
    return {
      index,
      exists: !!save,
      displayName: save?.displayName || t("UI_SLOT_EMPTY", "空槽位"),
      completionPercent: save?.completionPercent || 0,
    };
  });

  const handleConfirm = () => {
    if (selectedSlot !== null) {
      onConfirm(selectedSlot);
      onOpenChange(false);
      setSelectedSlot(null);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedSlot(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900/95 border-emerald-400/20">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {t("UI_IMPORT_SELECT_SLOT", "选择导入槽位")}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {t("UI_IMPORT_FILE_INFO", "导入文件")}: <span className="font-mono text-emerald-300">{importFileName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {slots.map(slot => {
            const isSelected = selectedSlot === slot.index;
            const isOccupied = slot.exists;

            return (
              <button
                key={slot.index}
                onClick={() => setSelectedSlot(slot.index)}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-500/15 shadow-lg"
                    : isOccupied
                      ? "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                      : "border-white/10 bg-slate-800/50 hover:border-emerald-400/50 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                        isSelected
                          ? "bg-emerald-500 text-slate-900"
                          : isOccupied
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-slate-700 text-white/50"
                      }`}
                    >
                      {slot.index}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {t("UI_SLOT_NUMBER", "槽位 {index}").replace("{index}", String(slot.index))}
                      </div>
                      <div className="text-sm text-white/60">
                        {isOccupied ? (
                          <>
                            {slot.displayName} - {slot.completionPercent}%
                          </>
                        ) : (
                          t("UI_SLOT_EMPTY", "空槽位")
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOccupied && (
                      <div className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-semibold text-yellow-300">
                        <AlertTriangle className="h-3 w-3" />
                        {t("UI_SLOT_WILL_OVERWRITE", "将覆盖")}
                      </div>
                    )}
                    {isSelected && <Check className="h-5 w-5 text-emerald-400" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedSlot !== null && slots[selectedSlot - 1].exists && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <div className="font-semibold">{t("UI_IMPORT_WARNING", "注意")}</div>
                <div className="mt-1 text-yellow-200/80">
                  {t(
                    "UI_IMPORT_WARNING_TEXT",
                    "此操作将覆盖现有存档。原存档将自动备份到 tool_bak 文件夹。"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-white/20 bg-slate-800 text-white hover:bg-slate-700"
          >
            <X className="mr-2 h-4 w-4" />
            {t("UI_CANCEL", "取消")}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={selectedSlot === null}
            className="bg-emerald-500 text-slate-900 hover:bg-emerald-400 disabled:opacity-50"
          >
            <Check className="mr-2 h-4 w-4" />
            {t("UI_CONFIRM_IMPORT", "确认导入")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}