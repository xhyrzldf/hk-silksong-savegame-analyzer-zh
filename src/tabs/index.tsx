import type { TabDefinition } from "./types";
import { StatsTab } from "./StatsTab";
import { MaskShardsTab } from "./MaskShardsTab";
import { UpgradesTab } from "./UpgradesTab";
import { ToolsTab } from "./ToolsTab";
import { CrestsTab } from "./CrestsTab";
import { AncestralArtsTab } from "./AncestralArtsTab";
import { RelicsTab } from "./RelicsTab";
import { BossesTab } from "./BossesTab";
import { HuntersJournalTab } from "./HuntersJournalTab";
import { JsonEditorTab } from "./JsonEditorTab";
import { SpoolFragmentsTab } from "./SpoolFragmentsTab";

export const tabDefinitions: TabDefinition[] = [
  {
    id: "Stats",
    label: "Stats",
    render: props => <StatsTab {...props} />,
  },
  {
    id: "Mask Shards",
    label: "Mask Shards",
    render: props => <MaskShardsTab {...props} />,
    
  },
    {
    id: "Spool Fragments",
    label: "Spool Fragments",
    render: props => <SpoolFragmentsTab {...props} />,
    
  },
    {
    id: "Upgrades",
    label: "Upgrades",
    render: props => <UpgradesTab {...props} />,
    
  },
  {
    id: "Tools",
    label: "Tools",
    render: props => <ToolsTab {...props} />,
  },
  {
    id: "Crests",
    label: "Crests",
    render: props => <CrestsTab {...props} />,
  },
  {
    id: "Ancestral Arts",
    label: "Ancestral Arts",
    render: props => <AncestralArtsTab {...props} />,
  },
  {
    id: "Relics",
    label: "Relics",
    render: props => <RelicsTab {...props} />,
  },
  {
    id: "Bosses",
    label: "Bosses",
    render: props => <BossesTab {...props} />,
  },
  {
    id: "Hunters Journal",
    label: "Hunters Journal",
    render: props => <HuntersJournalTab {...props} />,
  },
  {
    id: "JSON Editor",
    label: "JSON Editor",
    render: props => <JsonEditorTab {...props} />,
  },
];
