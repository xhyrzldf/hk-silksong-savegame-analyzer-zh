import type { TabDefinition } from "./types";
import { HornetTab, getHornetExtra } from "./HornetTab";
import { ToolsTab, getToolsExtra } from "./ToolsTab";
import { CrestsTab, getCrestsExtra } from "./CrestsTab";
import { AncestralArtsTab, getAncestralArtsExtra } from "./AncestralArtsTab";
import { RelicsTab, getRelicsExtra } from "./RelicsTab";
import { BossesTab } from "./BossesTab";
import { HuntersJournalTab } from "./HuntersJournalTab";
import { JsonEditorTab } from "./JsonEditorTab";

export const tabDefinitions: TabDefinition[] = [
  {
    id: "Hornet",
    label: "Hornet",
    render: props => <HornetTab {...props} />,
    getExtra: ({ parsedJson }) => getHornetExtra(parsedJson),
  },
  {
    id: "Tools",
    label: "Tools",
    render: props => <ToolsTab {...props} />,
    getExtra: ({ parsedJson }) => getToolsExtra(parsedJson),
  },
  {
    id: "Crests",
    label: "Crests",
    render: props => <CrestsTab {...props} />,
    getExtra: ({ parsedJson }) => getCrestsExtra(parsedJson),
  },
  {
    id: "Ancestral Arts",
    label: "Ancestral Arts",
    render: props => <AncestralArtsTab {...props} />,
    getExtra: ({ parsedJson }) => getAncestralArtsExtra(parsedJson),
  },
  {
    id: "Relics",
    label: "Relics",
    render: props => <RelicsTab {...props} />,
    getExtra: ({ parsedJson }) => getRelicsExtra(parsedJson),
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
