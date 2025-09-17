import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { decodeSave, encodeSave, downloadFile } from "./services/decryptor";



export default function App() {
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [search, setSearch] = useState("");
  const [decrypted, setDecrypted] = useState(false);
  const [showToast, setShowToast] = useState(false);


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
      <div className="w-full max-w-2xl bg-[#454d5c] rounded-lg shadow-lg p-5 mt-12 space-y-5">
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

        {/* Decrypt Button */}
        <button
          onClick={decryptFile}
          disabled={!fileData}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded w-full transition-colors"
        >
          Analyze
        </button>

        {/* Search */}
        {decrypted && (
          <input
            type="text"
            placeholder="Search JSON..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded bg-[#24344d] text-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* JSON Editor */}
        {decrypted && (
          <textarea
            className="w-full h-96 p-3 rounded bg-[#0d1b2a] text-white font-mono overflow-auto resize-none"
            value={filteredJson}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
          />
        )}

        {/* Save Buttons */}
        {decrypted && (
          <div className="flex flex-col md:flex-row gap-2">
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
        )}

      </div>
    </div>
  );
}