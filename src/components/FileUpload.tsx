import { useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";

import { useI18n } from "../i18n/I18nContext";

interface FileUploadProps {
  fileName: string;
  onFileSelected: (file: File) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
}

export function FileUpload({ fileName, onFileSelected, onDrop, onDragOver }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useI18n();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={() => inputRef.current?.click()}
      className="group relative flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-400/40 bg-slate-950/40 px-6 py-10 text-center text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/70 hover:bg-emerald-500/10"
    >
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 transition-transform duration-300 group-hover:scale-110">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
        >
          <path
            d="M12 3v12m0 0-4-4m4 4 4-4M4 19h16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      {fileName ? (
        <p className="text-sm leading-relaxed">
          <span className="font-semibold text-emerald-200">{fileName}</span>
          <span className="ml-1 text-white/60">{t("UI_FILE_SELECTED_SUFFIX", "selected")}</span>
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-white/70">
          {t("UI_FILE_PLACEHOLDER", "Drag and drop a file here, or click to browse")}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
