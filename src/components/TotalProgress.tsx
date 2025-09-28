import { useI18n } from "../i18n/I18nContext";
import { CATEGORIES, isItemUnlockedInPlayerSave } from "../parsers/dictionary";

interface TotalProgressProps {
  parsedJson: unknown;
}

export function TotalProgress({ parsedJson }: TotalProgressProps) {
  const { t } = useI18n();
  let percent = 0;
  if (parsedJson) {
    // Flatten all items from all categories
    const allItems = CATEGORIES.flatMap(category => category.items);
    // Only count items with a positive completionPercent
    const itemsWithPercent = allItems.filter(item => typeof item.completionPercent === 'number' && item.completionPercent > 0);

    let unlockedSum = 0;
    let maxSum = 0;
    for (const item of itemsWithPercent) {
      maxSum += item.completionPercent;
      const { unlocked } = isItemUnlockedInPlayerSave(item.parsingInfo, parsedJson);
      if (unlocked) {
        unlockedSum += item.completionPercent;
      }
    }
    percent = maxSum > 0 ? Math.round((unlockedSum / maxSum) * 100) : 0;
  }

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
