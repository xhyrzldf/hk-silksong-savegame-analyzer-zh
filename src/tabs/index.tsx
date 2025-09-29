import type { TabDefinition } from "./types";
import { StatsTab } from "./StatsTab";
import { MaskShardsTab, getMaskShardsExtra } from "./MaskShardsTab";
import { SpoolFragmentsTab, getSpoolFragmentsExtra } from "./SpoolFragmentsTab";
import { UpgradesTab, getUpgradesExtra } from "./UpgradesTab";
import { ToolsTab, getToolsExtra } from "./ToolsTab";
import { CrestsTab, getCrestsExtra } from "./CrestsTab";
import { AncestralArtsTab, getAncestralArtsExtra } from "./AncestralArtsTab";
import { RelicsTab, getRelicsExtra } from "./RelicsTab";
import { FleasTab, getFleasExtra } from "./FleasTab";
import { MemoryLocketsTab, getMemoryLocketsExtra } from "./MemoryLocketsTab";
import { BossesTab, getBossesExtra } from "./BossesTab";
import { KeysTab, getKeysExtra } from "./KeysTab";
import { getHuntersJournalExtra, HuntersJournalTab } from "./HuntersJournalTab";

export const tabDefinitions: TabDefinition[] = [
  {
    id: "Stats",
    label: "Stats",
    labelKey: "UI_TAB_STATS",
    render: props => <StatsTab {...props} />,
  },
  {
    id: "Mask Shards",
    label: "Mask Shards",
    labelKey: "UI_TAB_MASK_SHARDS",
    render: props => <MaskShardsTab {...props} />,
    getExtra: getMaskShardsExtra,
  },
  {
    id: "Spool Fragments",
    label: "Spool Fragments",
    labelKey: "UI_TAB_SPOOL_FRAGMENTS",
    render: props => <SpoolFragmentsTab {...props} />,
    getExtra: getSpoolFragmentsExtra,
  },
  {
    id: "Upgrades",
    label: "Upgrades",
    labelKey: "UI_TAB_UPGRADES",
    render: props => <UpgradesTab {...props} />,
    getExtra: getUpgradesExtra,
  },
  {
    id: "Tools",
    label: "Tools",
    labelKey: "UI_TAB_TOOLS",
    render: props => <ToolsTab {...props} />,
    getExtra: getToolsExtra,
  },
  {
    id: "Crests",
    label: "Crests",
    labelKey: "UI_TAB_CRESTS",
    render: props => <CrestsTab {...props} />,
    getExtra: getCrestsExtra,
  },
  {
    id: "Ancestral Arts",
    label: "Ancestral Arts",
    labelKey: "UI_TAB_ANCESTRAL_ARTS",
    render: props => <AncestralArtsTab {...props} />,
    getExtra: getAncestralArtsExtra,
  },
  {
    id: "Relics",
    label: "Relics",
    labelKey: "UI_TAB_RELICS",
    render: props => <RelicsTab {...props} />,
    getExtra: getRelicsExtra,
  },
  {
    id: "Fleas",
    label: "Fleas",
    labelKey: "UI_TAB_FLEAS",
    render: props => <FleasTab {...props} />,
    getExtra: getFleasExtra,
  },
  {
    id: "Memory Lockets",
    label: "Memory Lockets",
    labelKey: "UI_TAB_MEMORY_LOCKETS",
    render: props => <MemoryLocketsTab {...props} />,
    getExtra: getMemoryLocketsExtra,
  },
  {
    id: "Keys",
    label: "Keys",
    labelKey: "UI_TAB_KEYS",
    render: props => <KeysTab {...props} />,
    getExtra: getKeysExtra,
  },
  {
    id: "Bosses",
    label: "Bosses",
    labelKey: "UI_TAB_BOSSES",
    render: props => <BossesTab {...props} />,
    getExtra: getBossesExtra,
  },
  {
    id: "Hunters Journal",
    label: "Hunters Journal",
    labelKey: "UI_TAB_HUNTERS_JOURNAL",
    render: props => <HuntersJournalTab {...props} />,
    getExtra: getHuntersJournalExtra,
  },
];
