import { useI18n } from "../i18n/I18nContext";
import type { TabDefinition, TabId } from "../tabs/types";

interface TabBarProps {
  tabs: TabDefinition[];
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
  parsedJson: unknown;
  decrypted: boolean;
}

export function TabBar({ tabs, activeTab, onSelect, parsedJson, decrypted }: TabBarProps) {
  const { t, translate } = useI18n();
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        const extra = decrypted && parsedJson ? tab.getExtra?.({ parsedJson, decrypted }) : null;
        const label = tab.labelKey ? t(tab.labelKey, tab.label) : translate(tab.label);
        const stateClass = !decrypted
          ? "cursor-not-allowed opacity-50"
          : isActive
            ? "border-emerald-400/70 bg-emerald-500/15 text-white shadow-lg shadow-emerald-900/40"
            : "border-white/10 bg-slate-950/50 text-white/70 hover:-translate-y-1 hover:border-emerald-300/60 hover:bg-emerald-500/10 hover:text-white";
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            disabled={!decrypted}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${stateClass}`}
          >
            <div className="flex flex-col items-start gap-1 text-left">
              <span>{label}</span>
              {extra ? <span className="text-xs font-normal text-emerald-200">{extra}</span> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
