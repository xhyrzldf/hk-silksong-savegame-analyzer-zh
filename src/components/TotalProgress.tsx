import { useI18n } from "../i18n/I18nContext";
import { calculateCompletionPercent } from "../services/saveSummary";

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
      <div className="relative h-3 overflow-hidden rounded-full border border-white/10 bg-slate-950/40">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
