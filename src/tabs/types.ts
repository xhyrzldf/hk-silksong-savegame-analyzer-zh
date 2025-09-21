import type { Dispatch, ReactNode, SetStateAction } from "react";

export type TabId =
  | "Hornet"
  | "Tools"
  | "Crests"
  | "Ancestral Arts"
  | "Relics"
  | "Bosses"
  | "Hunters Journal"
  | "JSON Editor";

export interface TabRenderProps {
  parsedJson: unknown;
  decrypted: boolean;
  jsonText: string;
  setJsonText: Dispatch<SetStateAction<string>>;
  saveEncrypted: () => void;
  savePlain: () => void;
}

export interface TabDefinition {
  id: TabId;
  label: string;
  render: (props: TabRenderProps) => ReactNode;
  getExtra?: (props: { parsedJson: unknown; decrypted: boolean }) => ReactNode;
}
