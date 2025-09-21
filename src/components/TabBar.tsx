import type { TabDefinition, TabId } from "../tabs/types";

interface TabBarProps {
  tabs: TabDefinition[];
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
  parsedJson: unknown;
  decrypted: boolean;
}

export function TabBar({ tabs, activeTab, onSelect, parsedJson, decrypted }: TabBarProps) {
  return (
    <div className="flex justify-between mt-4 mb-2 flex-wrap gap-2">
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        const extra = decrypted && parsedJson ? tab.getExtra?.({ parsedJson, decrypted }) : null;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            disabled={!decrypted}
            className={`flex-1 min-w-[120px] py-2 rounded font-semibold transition-colors ${
              isActive ? "bg-blue-700 text-white" : "bg-[#24344d] text-blue-200"
            } ${!decrypted ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
          >
            <div className="flex flex-col items-center">
              <span>{tab.label}</span>
              {extra}
            </div>
          </button>
        );
      })}
    </div>
  );
}
