import type { ReactNode } from "react";

import { useI18n } from "../i18n/I18nContext";
import { useResultFilters, type ActFilterOption } from "../hooks/useResultFilters";

interface ResultFilterBarProps {
  disabled: boolean;
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled: boolean;
}

function FilterButton({ label, active, onClick, disabled }: FilterButtonProps) {
  const baseClass = "px-3 py-1 rounded border text-xs font-semibold transition-colors";
  const activeClass = "bg-blue-600 border-blue-400 text-white";
  const inactiveClass = "bg-transparent border-white/30 text-white/80 hover:border-white hover:text-white";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type="button"
      className={`${baseClass} ${active ? activeClass : inactiveClass} ${disabledClass}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-blue-200">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function ResultFilterBar({ disabled }: ResultFilterBarProps) {
  const { t } = useI18n();
  const { completion, progress, acts, toggleCompletion, toggleProgress, toggleAct } = useResultFilters();

  const renderActButton = (act: ActFilterOption, label: string) => (
    <FilterButton
      key={act}
      label={label}
      active={acts[act]}
      onClick={() => toggleAct(act)}
      disabled={disabled}
    />
  );

  return (
    <div className="bg-[#24344d80] rounded-lg px-3 py-3 flex flex-wrap gap-4 justify-center md:justify-between text-white">
      <FilterGroup label={t("UI_FILTER_GROUP_STATUS", "Status")}>
        <FilterButton
          label={t("UI_FILTER_INCOMPLETE", "Incomplete")}
          active={completion.incomplete}
          onClick={() => toggleCompletion("incomplete")}
          disabled={disabled}
        />
        <FilterButton
          label={t("UI_FILTER_COMPLETED", "Completed")}
          active={completion.completed}
          onClick={() => toggleCompletion("completed")}
          disabled={disabled}
        />
      </FilterGroup>
      <FilterGroup label={t("UI_FILTER_GROUP_PROGRESS", "Progress")}>
        <FilterButton
          label={t("UI_FILTER_NON_HUNDRED", "Doesn't count toward 100%")}
          active={progress.nonHundredPercent}
          onClick={() => toggleProgress("nonHundredPercent")}
          disabled={disabled}
        />
        <FilterButton
          label={t("UI_FILTER_HUNDRED", "Counts toward 100%")}
          active={progress.hundredPercent}
          onClick={() => toggleProgress("hundredPercent")}
          disabled={disabled}
        />
      </FilterGroup>
      <FilterGroup label={t("UI_FILTER_GROUP_ACT", "Act")}>
        {renderActButton(1, t("UI_FILTER_ACT_ONE", "Act I"))}
        {renderActButton(2, t("UI_FILTER_ACT_TWO", "Act II"))}
        {renderActButton(3, t("UI_FILTER_ACT_THREE", "Act III"))}
      </FilterGroup>
    </div>
  );
}
