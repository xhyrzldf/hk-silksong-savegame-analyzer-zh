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
  const baseClass = "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";
  const activeClass = "border-emerald-400/60 bg-emerald-500/90 text-slate-950 shadow";
  const inactiveClass = "border-white/15 bg-white/5 text-white/70 hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-emerald-500/10 hover:text-white";
  const disabledClass = disabled ? "cursor-not-allowed opacity-50 hover:translate-y-0" : "";

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
      <span className="text-xs font-semibold uppercase tracking-wide text-white/60">{label}</span>
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
    <div className="flex flex-wrap items-start gap-6 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-white">
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
