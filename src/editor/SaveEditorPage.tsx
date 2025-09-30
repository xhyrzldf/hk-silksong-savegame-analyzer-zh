import { useCallback, useMemo, useState, type ReactElement } from "react";

import {
  applyItemValue,
  cloneSave,
  getItemValue,
  getSuggestedMax,
  isBooleanItem,
  isNumericItem,
} from "../services/saveMutations";
import { CATEGORIES } from "../parsers/dictionary";
import type { CategoryItem } from "../parsers/dictionary";
import type { AutoSaveSummary } from "../hooks/useWindowsSaves";
import { useI18n } from "../i18n/I18nContext";
import { Card, CardContent } from "@/components/ui/card";

interface SaveEditorPageProps {
  parsedJson: unknown;
  setJsonText: (value: string) => void;
  fileName: string;
  activeAutoSave: AutoSaveSummary | null;
}

type FeedbackKind = "success" | "error" | "info";

type FeedbackMessage = {
  kind: FeedbackKind;
  text: string;
};

export function SaveEditorPage({
  parsedJson,
  setJsonText,
  fileName,
  activeAutoSave,
}: SaveEditorPageProps) {
  const { t, translate } = useI18n();
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [activeTab, setActiveTab] = useState<string>(CATEGORIES[0]?.name || "");

  const hasParsedJson = Boolean(parsedJson) && typeof parsedJson === "object";

  const updateJsonFromSave = useCallback(
    (nextSave: Record<string, unknown>) => {
      setJsonText(JSON.stringify(nextSave, null, 2));
    },
    [setJsonText],
  );

  const handleValueChange = useCallback(
    (item: CategoryItem, value: boolean | number) => {
      if (!hasParsedJson) {
        setFeedback({ kind: "info", text: t("UI_SAVE_EDITOR_NO_JSON", "Load a save file first") });
        return;
      }
      const clone = cloneSave(parsedJson);
      if (!clone) {
        setFeedback({ kind: "error", text: t("UI_SAVE_EDITOR_JSON_INVALID", "Unable to parse the current save data") });
        return;
      }
      applyItemValue(clone, item.parsingInfo, value);
      updateJsonFromSave(clone);
      setFeedback({ kind: "success", text: t("UI_SAVE_EDITOR_VALUE_UPDATED", "Value updated") });
    },
    [hasParsedJson, parsedJson, t, updateJsonFromSave],
  );

  const categories = useMemo(() => CATEGORIES, []);

  // 找到当前激活的类别
  const activeCategory = useMemo(
    () => categories.find(cat => cat.name === activeTab),
    [categories, activeTab]
  );

  return (
    <div className="flex h-full flex-col space-y-3">
      {/* 顶部信息卡片 */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card/60">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white/90">
                {t("UI_SAVE_EDITOR_PANEL_TITLE", "Save Editing")}
              </h2>
              <p className="text-xs text-white/60">
                {fileName
                  ? `${fileName} ${t("UI_FILE_SELECTED_SUFFIX", "selected")}`
                  : t("UI_SAVE_EDITOR_FILE_UNKNOWN", "Unnamed")}
              </p>
            </div>
            {activeAutoSave ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {t("UI_AUTO_SAVES_SLOT", "Slot {index}").replace("{index}", String(activeAutoSave.slotIndex))}
                <span className="text-white/70">· {activeAutoSave.displayName}</span>
              </span>
            ) : null}
          </div>
          {feedback ? (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                feedback.kind === "success"
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : feedback.kind === "error"
                    ? "border-destructive/60 bg-destructive/15 text-destructive"
                    : "border-accent/60 bg-accent/15 text-accent-foreground"
              }`}
            >
              {feedback.text}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!hasParsedJson ? (
        <Card className="flex-1">
          <CardContent className="flex h-full items-center justify-center p-6 text-lg text-white/50">
            {t("UI_SAVE_EDITOR_NO_JSON", "Load a save file first")}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 类别选择按钮 - 与分析页面TabBar样式一致 */}
          <div className="flex-shrink-0">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map(category => {
                const isActive = category.name === activeTab;
                const label = translate(category.name);
                const stateClass = isActive
                  ? "border-emerald-400/70 bg-emerald-500/15 text-white shadow-lg shadow-emerald-900/40"
                  : "border-white/10 bg-slate-950/50 text-white/70 hover:-translate-y-1 hover:border-emerald-300/60 hover:bg-emerald-500/10 hover:text-white";
                return (
                  <button
                    key={category.name}
                    onClick={() => setActiveTab(category.name)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${stateClass}`}
                  >
                    <div className="flex flex-col items-start gap-1 text-left">
                      <span>{label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="mt-3 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/50 p-4 shadow-inner">
            {activeCategory ? (
              <div className="space-y-4">
                {activeCategory.description ? (
                  <p className="border-l-2 border-emerald-400 pl-3 text-sm text-white/70">
                    {translate(activeCategory.description)}
                  </p>
                ) : null}

                <div className="space-y-3">
                  {(() => {
                    let currentSection = "";
                    return activeCategory.items.flatMap((item, index) => {
                      const elements: ReactElement[] = [];
                      if (item.section && item.section !== currentSection) {
                        currentSection = item.section;
                        elements.push(
                          <div
                            key={`section-${activeCategory.name}-${item.section}-${index}`}
                            className="mb-2 mt-4 border-b border-white/10 pb-2 text-sm font-semibold text-white/90"
                          >
                            {translate(item.section)}
                          </div>,
                        );
                      }
                      const value = getItemValue(parsedJson, item.parsingInfo);
                      const isBoolean = isBooleanItem(item.parsingInfo);
                      const isNumeric = isNumericItem(item.parsingInfo);
                      const suggestedMax = getSuggestedMax(item.parsingInfo);
                      const prereqText = item.prereqs?.length
                        ? t("UI_SAVE_EDITOR_PREREQS", "Prerequisites: {value}").replace(
                            "{value}",
                            item.prereqs.map(pr => translate(pr)).join(", "),
                          )
                        : null;
                      const helperText = item.killsRequired
                        ? t("UI_SAVE_EDITOR_KILLS_REQUIRED", "Target kills: {value}").replace(
                            "{value}",
                            String(item.killsRequired),
                          )
                        : null;

                      elements.push(
                        <div
                          key={`item-${item.name}-${index}`}
                          className="space-y-3 rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 backdrop-blur-sm transition-colors hover:border-emerald-400/30"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-white/90">{translate(item.name)}</div>
                            {item.location ? (
                              <div className="whitespace-pre-line text-xs text-white/60">
                                {translate(item.location)}
                              </div>
                            ) : null}
                            {prereqText ? (
                              <div className="text-xs text-white/60">{prereqText}</div>
                            ) : null}
                            {helperText ? (
                              <div className="text-xs text-white/60">{helperText}</div>
                            ) : null}
                          </div>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-xs text-white/60">
                              {t("UI_SAVE_EDITOR_CURRENT_VALUE", "Current value")}:{" "}
                              <span className="font-mono text-emerald-300">{String(value)}</span>
                            </div>
                            {isBoolean ? (
                              <label className="flex items-center gap-2 text-sm text-white/80">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border border-white/20 bg-slate-800 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                                  checked={Boolean(value)}
                                  disabled={!hasParsedJson}
                                  onChange={event => handleValueChange(item, event.target.checked)}
                                />
                                <span>{t("UI_SAVE_EDITOR_TOGGLE_UNLOCKED", "Mark as unlocked")}</span>
                              </label>
                            ) : null}
                            {isNumeric ? (
                              <input
                                type="number"
                                className="w-28 rounded-md border border-white/20 bg-slate-800 px-3 py-2 text-right text-sm text-white/90 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:ring-offset-2 focus:ring-offset-slate-950"
                                defaultValue={Number(value) ?? 0}
                                min={0}
                                max={suggestedMax ?? undefined}
                                onBlur={event => {
                                  const nextValue = Number(event.target.value);
                                  if (Number.isNaN(nextValue)) {
                                    return;
                                  }
                                  handleValueChange(item, nextValue);
                                }}
                              />
                            ) : null}
                          </div>
                        </div>,
                      );

                      return elements;
                    });
                  })()}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

