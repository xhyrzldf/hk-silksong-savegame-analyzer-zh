import { useCallback, useMemo, useState } from "react";
import type { DragEvent } from "react";

import { useI18n } from "../i18n/I18nContext";
import { decodeSave, encodeSave, downloadFile } from "../services/decryptor";

export function useSaveFile() {
  const { t } = useI18n();
  const [fileName, setFileName] = useState("");
  const [decrypted, setDecrypted] = useState(false);
  const [jsonText, setJsonText] = useState("");

  const parsedJson = useMemo(() => {
    if (!jsonText) return null;
    try {
      return JSON.parse(jsonText);
    } catch {
      return null;
    }
  }, [jsonText]);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      if (!e.target?.result) return;
      setDecrypted(false);
      setJsonText("");
      try {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const json = decodeSave(data);
        const pretty = JSON.stringify(JSON.parse(json), null, 2);
        setJsonText(pretty);
        setDecrypted(true);
      } catch (error) {
        alert(t("ERROR_DECODE_FAILED", "Failed to decode file"));
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const saveEncrypted = useCallback(() => {
    const encoded = encodeSave(jsonText);
    downloadFile(encoded, fileName || "save.dat");
  }, [jsonText, fileName]);

  const savePlain = useCallback(() => {
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
    downloadFile(jsonText, `${nameWithoutExtension || "save"}.json`);
  }, [jsonText, fileName]);

  return {
    fileName,
    decrypted,
    jsonText,
    setJsonText,
    parsedJson,
    handleFile,
    handleDrop,
    handleDragOver,
    saveEncrypted,
    savePlain,
  };
}
