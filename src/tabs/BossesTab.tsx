import type { TabRenderProps } from "./types";

export function BossesTab({ parsedJson, decrypted }: TabRenderProps) {
  if (!decrypted || !parsedJson) {
    return <div className="text-white text-center">Load a save file to view boss data.</div>;
  }

  return <div className="text-white text-center">Bosses data will appear here.</div>;
}
