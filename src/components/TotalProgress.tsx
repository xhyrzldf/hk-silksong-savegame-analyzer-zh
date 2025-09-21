import { parsers } from "../parsers";

interface TotalProgressProps {
  parsedJson: unknown;
}

export function TotalProgress({ parsedJson }: TotalProgressProps) {
  if (!parsedJson) return null;

  const hornet = parsers.Hornet(parsedJson);
  const crests = parsers.Crests(parsedJson);
  const arts = parsers.AncestralArts(parsedJson);
  const toolSections = parsers.Tools(parsedJson);
  const allTools = toolSections.flatMap((section: any) => section.tools);

  const buckets = [
    { unlocked: hornet.totalCompletion, max: hornet.maxCompletion },
    {
      unlocked: crests
        .filter((crest: any) => crest.unlocked)
        .reduce((sum: number, crest: any) => sum + (crest.completion || 0), 0),
      max: crests.reduce((sum: number, crest: any) => sum + (crest.completion || 0), 0),
    },
    {
      unlocked: arts
        .filter((art: any) => art.unlocked)
        .reduce((sum: number, art: any) => sum + (art.completion || 0), 0),
      max: arts.reduce((sum: number, art: any) => sum + (art.completion || 0), 0),
    },
    {
      unlocked: allTools
        .filter((tool: any) => tool.unlocked)
        .reduce((sum: number, tool: any) => sum + (tool.completion || 0), 0),
      max: allTools.reduce((sum: number, tool: any) => sum + (tool.completion || 0), 0),
    },
  ];

  const totalUnlocked = buckets.reduce((sum, bucket) => sum + bucket.unlocked, 0);
  const totalMax = buckets.reduce((sum, bucket) => sum + bucket.max, 0);
  const percent = totalMax > 0 ? Math.round((totalUnlocked / totalMax) * 100) : 0;

  return (
    <div className="w-full my-4">
      <div className="flex justify-between text-sm text-blue-200 mb-1">
        <span>Total Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-[#24344d] rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
