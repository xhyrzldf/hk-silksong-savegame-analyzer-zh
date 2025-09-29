import { useI18n } from "../i18n/I18nContext";
import { calculateCompletionPercent } from "../services/saveSummary";

interface TotalProgressProps {
  parsedJson: unknown;
}

export function TotalProgress({ parsedJson }: TotalProgressProps) {
  const { t } = useI18n();
  const percent = parsedJson ? calculateCompletionPercent(parsedJson) : 0;

  return (
    <div className="w-full my-4">
      <div className="flex justify-between text-sm text-blue-200 mb-1">
        <span>{t("UI_TOTAL_PROGRESS", "Total Progress")}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-[#24344d] rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
