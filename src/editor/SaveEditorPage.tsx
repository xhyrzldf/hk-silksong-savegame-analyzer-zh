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
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-lg">
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
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              {t("UI_AUTO_SAVES_SLOT", "Slot {index}").replace("{index}", String(activeAutoSave.slotIndex))}
              <span className="text-white/70">· {activeAutoSave.displayName}</span>
            </span>
          ) : null}
        </div>
        {feedback ? (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              feedback.kind === "success"
                ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-100"
                : feedback.kind === "error"
                  ? "border-red-500/60 bg-red-500/15 text-red-200"
                  : "border-sky-400/60 bg-sky-500/15 text-sky-100"
            }`}
          >
            {feedback.text}
          </div>
        ) : null}
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-lg">
        <h3 className="text-base font-semibold text-white/90">
          {t("UI_SAVE_EDITOR_SECTION_EDIT", "Entry editing")}
        </h3>
        {!hasParsedJson ? (
          <div className="text-sm text-white/70">
            {t("UI_SAVE_EDITOR_NO_JSON", "Load a save file first")}
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(category => {
              let currentSection = "";
              return (
                <details
                  key={category.name}
                  className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/35 transition-all duration-300 open:border-emerald-400/30"
                >
                  <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-white/90">
                    {translate(category.name)}
                  </summary>
                  <div className="space-y-3 px-4 pb-4">
                    {category.description ? (
                      <div className="text-xs text-white/60">{translate(category.description)}</div>
                    ) : null}
                    {category.items.flatMap((item, index) => {
                      const elements: ReactElement[] = [];
                      if (item.section && item.section !== currentSection) {
                        currentSection = item.section;
                        elements.push(
                          <div
                            key={`section-${category.name}-${item.section}-${index}`}
                            className="mt-2 text-sm font-semibold text-white/80"
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
                          className="space-y-3 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-3"
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-white/90">{translate(item.name)}</div>
                            {item.location ? (
                              <div className="text-xs text-white/60 whitespace-pre-line">
                                {translate(item.location)}
                              </div>
                            ) : null}
                            {prereqText ? (
                              <div className="text-xs text-white/50">{prereqText}</div>
                            ) : null}
                            {helperText ? (
                              <div className="text-xs text-white/50">{helperText}</div>
                            ) : null}
                          </div>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-xs text-white/60">
                              {t("UI_SAVE_EDITOR_CURRENT_VALUE", "Current value")}: {String(value)}
                            </div>
                            {isBoolean ? (
                              <label className="flex items-center gap-2 text-sm text-white/80">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border border-white/30 bg-slate-950/70 text-emerald-400 focus:ring-emerald-400/50"
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
                                className="w-28 rounded border border-white/15 bg-slate-950/60 px-2 py-1 text-right text-sm text-white/80 focus:border-emerald-400/60 focus:outline-none"
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
                </details>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

