import { useState, useMemo } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { decodeSave, encodeSave, downloadFile } from "./services/decryptor";

import { parsers } from "./parsers";



export default function App() {
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [search, setSearch] = useState("");
  const [decrypted, setDecrypted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState("Hornet");

  // Parse JSON only once per jsonText change
  const parsedJson = useMemo(() => {
    try {
      return JSON.parse(jsonText);
    } catch {
      return null;
    }
  }, [jsonText]);


  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        setFileData(new Uint8Array(e.target.result as ArrayBuffer));
        setDecrypted(false);
        setJsonText("");
      }
    };
    reader.readAsArrayBuffer(file);
  };
    // Additional imports if necessary

    const handleCopyPath = () => {
    const savePath = "%userprofile%\\appdata\\LocalLow\\Team Cherry\\Hollow Knight Silksong";
    navigator.clipboard.writeText(savePath); // Copy path to clipboard

    // Show the toast and hide it after 3 seconds
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  const decryptFile = () => {
    if (!fileData) return;
    try {
      const json = decodeSave(fileData);
      const pretty = JSON.stringify(JSON.parse(json), null, 2);

      setJsonText(pretty);
      setDecrypted(true);
    } catch (e) {
      alert("Failed to decode file");
      console.error(e);
    }
  };

  const saveEncrypted = () => {
    const encoded = encodeSave(jsonText);
    downloadFile(encoded, fileName || "save.dat");
  };

  const savePlain = () =>
    downloadFile(jsonText, fileName.replace(/\.[^/.]+$/, "") + ".json");

  const filteredJson = search
    ? jsonText
      .split("\n")
      .filter(line => line.toLowerCase().includes(search.toLowerCase()))
      .join("\n")
    : jsonText;

  return (
    <div className="min-h-screen flex justify-center items-start bg-[#82979e] p-4">
      <div className="w-full max-w-4xl bg-[#454d5c] rounded-lg shadow-lg p-5 mt-12 space-y-5">
        <h1 className="text-2xl font-bold text-white text-center">
          Hollow Knight Silksong Savegame Analyzer
        </h1>

         <div className="text-center text-sm">
      <p className="font-bold text-white">
        Save files are located at "
        <span
          className="text-green-500 hover:underline cursor-pointer"
          onClick={handleCopyPath}
        >
          %userprofile%\appdata\LocalLow\Team Cherry\Hollow Knight Silksong
        </span>
         " /SteamIDNumber (userX.dat)
      </p>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#454d5c] text-white px-4 py-2 rounded shadow-lg">
          Path copied to clipboard!
        </div>
      )}
    </div>

        {/* File Upload Box */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => document.getElementById("fileInput")?.click()}
          className="border-2 border-dashed border-black rounded-lg p-5 text-center cursor-pointer hover:bg-[#82979e] text-white"
        >
          {fileName ? (
            <p>📄 {fileName} selected</p>
          ) : (
            <p>Drag & drop file here, or click to browse</p>
          )}
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.length) handleFile(e.target.files[0]);
            }}
          />
        </div>



        {/* Analyze Button */}
        <button
          onClick={decryptFile}
          disabled={!fileData}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded w-full transition-colors"
        >
          Analyze
        </button>


        {/* Total Progress Bar */}
        {decrypted && parsedJson && (
          (() => {
            // Gather completion and max for all tracked tabs
            const hornet = parsers.Hornet(parsedJson);
            const crests = parsers.Crests(parsedJson);
            const arts = parsers.AncestralArts(parsedJson);
            const toolSections = parsers.Tools(parsedJson);
            const allTools = toolSections.flatMap((section: any) => section.tools);
            const tabs = [
              { unlocked: hornet.totalCompletion, max: hornet.maxCompletion },
              { unlocked: crests.filter((c: any) => c.unlocked).reduce((sum: number, c: any) => sum + (c.completion || 0), 0), max: crests.reduce((sum: number, c: any) => sum + (c.completion || 0), 0) },
              { unlocked: arts.filter((a: any) => a.unlocked).reduce((sum: number, a: any) => sum + (a.completion || 0), 0), max: arts.reduce((sum: number, a: any) => sum + (a.completion || 0), 0) },
              { unlocked: allTools.filter((t: any) => t.unlocked).reduce((sum: number, t: any) => sum + (t.completion || 0), 0), max: allTools.reduce((sum: number, t: any) => sum + (t.completion || 0), 0) },
            ];
            const totalUnlocked = tabs.reduce((sum, t) => sum + t.unlocked, 0);
            const totalMax = tabs.reduce((sum, t) => sum + t.max, 0);
            const percent = totalMax > 0 ? Math.round((totalUnlocked / totalMax) * 100) : 0;
            return (
              <div className="w-full my-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-white">Total Progress</span>
                  <span className="text-xs text-blue-200 font-mono">{totalUnlocked} / {totalMax} ({percent}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })()
        )}

        {/* Tabs Bar */}
        <div className="flex justify-between mt-4 mb-2">
          {['Hornet', 'Tools', 'Crests', 'Ancestral Arts', 'Bosses', 'JSON Editor'].map(tab => {
            let extra = null;
            if (tab === 'Hornet' && decrypted && parsedJson) {
              const hornet = parsers.Hornet(parsedJson);
              extra = (
                <div className="text-xs text-blue-200 mt-1 font-normal">
                  {hornet.totalCompletion}% / {hornet.maxCompletion}%
                </div>
              );
            } else if (tab === 'Crests' && decrypted && parsedJson) {
              const crests = parsers.Crests(parsedJson);
              const unlocked = crests.filter((c: any) => c.unlocked).reduce((sum: number, c: any) => sum + (c.completion || 0), 0);
              const total = crests.reduce((sum: number, c: any) => sum + (c.completion || 0), 0);
              extra = (
                <div className="text-xs text-blue-200 mt-1 font-normal">
                  {unlocked}% / {total}%
                </div>
              );
            } else if (tab === 'Tools' && decrypted && parsedJson) {
              const toolSections = parsers.Tools(parsedJson);
              const allTools = toolSections.flatMap((section: any) => section.tools);
              const unlocked = allTools.filter((t: any) => t.unlocked).reduce((sum: number, t: any) => sum + (t.completion || 0), 0);
              const total = allTools.reduce((sum: number, t: any) => sum + (t.completion || 0), 0);
              extra = (
                <div className="text-xs text-blue-200 mt-1 font-normal">
                  {unlocked}% / {total}%
                </div>
              );
            } else if (tab === 'Ancestral Arts' && decrypted && parsedJson) {
              const arts = parsers.AncestralArts(parsedJson);
              const unlocked = arts.filter((a: any) => a.unlocked).reduce((sum: number, a: any) => sum + (a.completion || 0), 0);
              const total = arts.reduce((sum: number, a: any) => sum + (a.completion || 0), 0);
              extra = (
                <div className="text-xs text-blue-200 mt-1 font-normal">
                  {unlocked}% / {total}%
                </div>
              );
            }
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={!decrypted}
                className={`flex-1 mx-1 py-2 rounded font-semibold transition-colors 
                  ${activeTab === tab ? 'bg-blue-700 text-white' : 'bg-[#24344d] text-blue-200'}
                  ${!decrypted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              >
                <div className="flex flex-col items-center">
                  <span>{tab}</span>
                  {extra}
                </div>
              </button>
            );
          })}
        </div>


        {/* Tab Content */}
        {decrypted && (
          <div className="mt-4">
            {activeTab === 'Hornet' && (
              <div className="text-white">
                <h2 className="text-lg font-bold mb-2 text-center">Hornet</h2>
                {parsedJson ? (() => {
                  const hornet = parsers.Hornet(parsedJson);
                  const items = [
                    { label: 'Playtime', value: hornet.playtime },
                    { label: 'Rosaries', value: hornet.rosaries },
                    { label: 'Shell Shards', value: hornet.shellShards },
                    { label: 'Health Masks', value: hornet.healthMasks, completion: hornet.healthMasksCompletion, max: 5 },
                    { label: 'Silk Spools', value: hornet.silkSpools, completion: hornet.silkSpoolsCompletion, max: 9 },
                    { label: 'Silk Hearts', value: hornet.silkHearts, completion: hornet.silkHeartsCompletion, max: 3 },
                    { label: 'Nail Upgrades', value: hornet.nailUpgrades, completion: hornet.nailUpgradesCompletion, max: 4 },
                    { label: 'Tool Pouch Upgrades', value: hornet.toolPouchUpgrades, completion: hornet.toolPouchUpgradesCompletion, max: 4 },
                    { label: 'Tool Kit Upgrades', value: hornet.toolKitUpgrades, completion: hornet.toolKitUpgradesCompletion, max: 4 },
                  ];
                  return (
                    <ul className="max-w-md mx-auto divide-y divide-gray-600">
                      {items.map((item) => (
                        <li key={item.label} className="flex items-center justify-between py-2 px-2">
                          <span>{item.label}</span>
                          <span className="flex items-center min-w-[48px] justify-end">
                            <span className="font-mono">{item.value}</span>
                            <span className="inline-block w-16 text-xs text-blue-300 font-mono text-right ml-2">
                              {typeof item.completion === 'number' && typeof item.max === 'number' ? `+${item.completion}% / ${item.max}%` : ''}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                })() : (
                  <div className="text-red-300 text-center">Invalid or no JSON loaded.</div>
                )}
              </div>
            )}
            {activeTab === 'Tools' && (
              <div className="text-white">
                <h2 className="text-lg font-bold mb-2 text-center">Tools</h2>
                {parsedJson ? (
                  <div className="max-w-md mx-auto">
                    {parsers.Tools(parsedJson).map((section: any) => (
                      <div key={section.section} className="mb-4">
                        <h3 className="text-md font-semibold mb-1 text-center">{section.section}</h3>
                        <ul className="divide-y divide-gray-600">
                          {section.tools.map((tool: any, i: number) => (
                            <li key={i} className="flex items-center justify-between py-2 px-2">
                              <span>{tool.name}</span>
                              <span className="flex items-center min-w-[48px] justify-end">
                                <span className={tool.unlocked ? "text-green-400" : "text-red-400"}>
                                  {tool.unlocked ? "✓" : "✘"}
                                </span>
                                <span className="inline-block w-10 text-xs text-blue-300 font-mono text-right">
                                  {tool.completion > 0 ? `+${tool.completion}%` : ''}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-red-300 text-center">Invalid or no JSON loaded.</div>
                )}
              </div>
            )}
            {activeTab === 'Crests' && (
              <div className="text-white">
                <h2 className="text-lg font-bold mb-2 text-center">Crests</h2>
                {parsedJson ? (() => {
                  const crests = parsers.Crests(parsedJson);
                  return (
                    <ul className="max-w-md mx-auto divide-y divide-gray-600">
                      {crests.map((crest: any, i: number) => (
                        <li key={i} className="flex items-center justify-between py-2 px-2">
                          <span>{crest.name}</span>
                          <span className="flex items-center min-w-[48px] justify-end">
                            <span className={crest.unlocked ? "text-green-400" : "text-red-400"}>
                              {crest.unlocked ? "✓" : "✘"}
                            </span>
                            <span className="inline-block w-10 text-xs text-blue-300 font-mono text-right">
                              {crest.completion > 0 ? `+${crest.completion}%` : ''}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                })() : (
                  <div className="text-red-300 text-center">Invalid or no JSON loaded.</div>
                )}
              </div>
            )}
            {activeTab === 'Ancestral Arts' && (
              <div className="text-white">
                <h2 className="text-lg font-bold mb-2 text-center">Ancestral Arts</h2>
                {parsedJson ? (
                  <ul className="max-w-md mx-auto divide-y divide-gray-600">
                    {parsers.AncestralArts(parsedJson).map((art: any, i: number) => (
                      <li key={i} className="flex items-center justify-between py-2 px-2">
                        <span>{art.name}</span>
                        <span className="flex items-center min-w-[48px] justify-end">
                          <span className={art.unlocked ? "text-green-400" : "text-red-400"}>
                            {art.unlocked ? "✓" : "✘"}
                          </span>
                          <span className="inline-block w-10 text-xs text-blue-300 font-mono text-right">
                              {art.completion > 0 ? `+${art.completion}%` : ''}
                            </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-red-300 text-center">Invalid or no JSON loaded.</div>
                )}
              </div>
            )}
            {activeTab === 'Bosses' && (
              <div className="text-white text-center">Bosses data will appear here.</div>
            )}
            {activeTab === 'JSON Editor' && (
              <>
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search JSON..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-2 rounded bg-[#24344d] text-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* JSON Editor */}
                <textarea
                  className="w-full h-96 p-3 rounded bg-[#0d1b2a] text-white font-mono overflow-auto resize-none mt-2"
                  value={filteredJson}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (!search) {
                      setJsonText(newValue);
                    } else {
                      // Update only the matching lines in the full JSON
                      const originalLines = jsonText.split("\n");
                      const searchLower = search.toLowerCase();
                      let filteredIdx = 0;
                      const newLines = originalLines.map(line => {
                        if (line.toLowerCase().includes(searchLower)) {
                          // Replace with edited line
                          return newValue.split("\n")[filteredIdx++] ?? line;
                        } else {
                          return line;
                        }
                      });
                      setJsonText(newLines.join("\n"));
                    }
                  }}
                  spellCheck={false}
                />
                {/* Save Buttons */}
                <div className="flex flex-col md:flex-row gap-2 mt-2">
                  <button
                    onClick={saveEncrypted}
                    className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded flex-1"
                  >
                    💾 Save Encrypted (.dat)
                  </button>
                  <button
                    onClick={savePlain}
                    className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded flex-1"
                  >
                    📄 Save Plain (.json)
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}