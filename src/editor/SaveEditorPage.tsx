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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  return (
    <div className="space-y-6 text-white">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card/60">
        <CardContent className="p-6">
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
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            {t("UI_SAVE_EDITOR_NO_JSON", "Load a save file first")}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={categories[0]?.name} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 h-auto bg-card/50 p-2">
            {categories.map(category => (
              <TabsTrigger
                key={category.name}
                value={category.name}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {translate(category.name)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => {
            let currentSection = "";
            return (
              <TabsContent key={category.name} value={category.name} className="mt-4">
                <Card>
                  <CardContent className="space-y-4 p-6">
                    {category.description ? (
                      <p className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
                        {translate(category.description)}
                      </p>
                    ) : null}

                    <div className="space-y-3">
                      {category.items.flatMap((item, index) => {
                      const elements: ReactElement[] = [];
                        if (item.section && item.section !== currentSection) {
                          currentSection = item.section;
                          elements.push(
                            <div
                              key={`section-${category.name}-${item.section}-${index}`}
                              className="mt-4 mb-2 text-sm font-semibold text-foreground border-b border-border pb-2"
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
                            className="space-y-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-3 hover:border-primary/30 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-foreground">{translate(item.name)}</div>
                              {item.location ? (
                                <div className="text-xs text-muted-foreground whitespace-pre-line">
                                  {translate(item.location)}
                                </div>
                              ) : null}
                              {prereqText ? (
                                <div className="text-xs text-muted-foreground">{prereqText}</div>
                              ) : null}
                              {helperText ? (
                                <div className="text-xs text-muted-foreground">{helperText}</div>
                              ) : null}
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="text-xs text-muted-foreground">
                                {t("UI_SAVE_EDITOR_CURRENT_VALUE", "Current value")}: <span className="font-mono">{String(value)}</span>
                              </div>
                              {isBoolean ? (
                                <label className="flex items-center gap-2 text-sm text-foreground">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-ring focus:ring-offset-2"
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
                                  className="w-28 rounded-md border border-input bg-background px-3 py-2 text-right text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

