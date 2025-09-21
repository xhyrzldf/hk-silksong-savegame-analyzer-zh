import { parsers } from "../parsers";
import type { TabRenderProps } from "./types";

export function ToolsTab({ parsedJson }: TabRenderProps) {
  if (!parsedJson) {
    return <div className="text-red-300 text-center">Invalid or no JSON loaded.</div>;
  }

  const sections = parsers.Tools(parsedJson);

  return (
    <div className="text-white">
      <h2 className="text-lg font-bold mb-2 text-center">Tools</h2>
      <div className="max-w-md mx-auto">
        {sections.map((section: any) => (
          <div key={section.section} className="mb-4">
            <h3 className="text-md font-semibold mb-1 text-center">{section.section}</h3>
            <ul className="divide-y divide-gray-600">
              {section.tools.map((tool: any, index: number) => (
                <li key={index} className="flex items-center justify-between py-2 px-2">
                  <span>{tool.name}</span>
                  <span className="flex items-center min-w-[48px] justify-end">
                    <span className={tool.unlocked ? "text-green-400" : "text-red-400"}>
                      {tool.unlocked ? "[x]" : "[ ]"}
                    </span>
                    <span className="inline-block w-10 text-xs text-blue-300 font-mono text-right">
                      {tool.completion > 0 ? `+${tool.completion}%` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function getToolsExtra(parsedJson: unknown) {
  if (!parsedJson) return null;
  const sections = parsers.Tools(parsedJson);
  const allTools = sections.flatMap((section: any) => section.tools);
  const unlocked = allTools
    .filter((tool: any) => tool.unlocked)
    .reduce((sum: number, tool: any) => sum + (tool.completion || 0), 0);
  const total = allTools.reduce((sum: number, tool: any) => sum + (tool.completion || 0), 0);

  return (
    <div className="text-xs text-blue-200 mt-1 font-normal">
      {unlocked}% / {total}%
    </div>
  );
}
