import { useI18n } from "../i18n/I18nContext";
import { calculateCompletionPercent } from "../services/saveSummary";
import { Progress } from "@/components/ui/progress";

interface TotalProgressProps {
  parsedJson: unknown;
}

export function TotalProgress({ parsedJson }: TotalProgressProps) {
  const { t } = useI18n();
  const percent = parsedJson ? calculateCompletionPercent(parsedJson) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-white/70">
        <span>{t("UI_TOTAL_PROGRESS", "Total Progress")}</span>
        <span className="font-mono text-base font-semibold text-emerald-300">{percent}%</span>
      </div>
      <Progress value={percent} className="h-3" />
    </div>
  );
}
