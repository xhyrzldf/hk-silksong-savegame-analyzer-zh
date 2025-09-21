import type { TabRenderProps } from "./types";

export function HuntersJournalTab({ parsedJson, decrypted }: TabRenderProps) {
  if (!decrypted || !parsedJson) {
    return <div className="text-white text-center">Load a save file to view the hunter's journal.</div>;
  }

  return <div className="text-white text-center">Hunters Journal data will appear here.</div>;
}
