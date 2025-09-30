import { useCallback, useEffect, useMemo, useState } from "react";
import type { DragEvent } from "react";

import HornetBackground from "./assets/HornetBackground.png";
import { FileUpload } from "./components/FileUpload";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { ResultFilterBar } from "./components/ResultFilterBar";
import { AutoSaveCards } from "./components/AutoSaveCards";
import { TabBar } from "./components/TabBar";
import { TotalProgress } from "./components/TotalProgress";
import { SaveSlotActions } from "./components/SaveSlotActions";
import { SaveEditorPage } from "./editor/SaveEditorPage";
import { useSaveFile } from "./hooks/useSaveFile";
import { ResultFiltersProvider } from "./hooks/useResultFilters";
import { useWindowsSaves, type AutoSaveSummary } from "./hooks/useWindowsSaves";
import { useI18n } from "./i18n/I18nContext";
import { tabDefinitions } from "./tabs";
import type { TabId } from "./tabs/types";

type PlatformId = "Steam" | "Gamepass(PC)" | "macOS" | "Linux(Steamdeck)" | "Switch";
type ViewId = "analysis" | "editor";

type PlatformNoteLink = {
  href: string;
  labelKey: string;
  fallback: string;
  wrap?: boolean;
};

type PlatformOption = {
  id: PlatformId;
  label: string;
  labelKey: string;
  path: string;
  noteKey?: string;
  noteFallback?: string;
  noteLink?: PlatformNoteLink;
};

const PLATFORM_OPTIONS: PlatformOption[] = [
  {
    id: "Steam",
    label: "Steam",
    labelKey: "UI_PLATFORM_STEAM",
    path: "%userprofile%/appdata/LocalLow/Team Cherry/Hollow Knight Silksong/",
    noteKey: "UI_PLATFORM_STEAM_NOTE",
    noteFallback: "/steamID (userX.dat, where x = savegame slot 1-4)",
    noteLink: {
      href: "https://store.steampowered.com/account/remotestorageapp/?appid=1030300",
      labelKey: "UI_PLATFORM_STEAM_CLOUD",
      fallback: "Steam Cloud saves",
      wrap: true,
    },
  },
  {
    id: "Gamepass(PC)",
    label: "Gamepass (PC)",
    labelKey: "UI_PLATFORM_GAMEPASS",
    path: "%LOCALAPPDATA%/Packages/TeamCherry.Silksong_y4jvztpgccj42/SystemAppData/wgs/",
    noteKey: "UI_PLATFORM_GAMEPASS_NOTE",
    noteFallback: "Savegame file name is really long and doesnt have file extension",
  },
  {
    id: "macOS",
    label: "macOS",
    labelKey: "UI_PLATFORM_MACOS",
    path: "~/Library/Application Support/unity.Team-Cherry.Silksong/",
  },
  {
    id: "Linux(Steamdeck)",
    label: "Linux (Steamdeck)",
    labelKey: "UI_PLATFORM_LINUX",
    path: "~/.local/share/Team Cherry/Hollow Knight Silksong/",
    noteKey: "UI_PLATFORM_LINUX_NOTE",
    noteFallback:
      "Native Linux: ~/.config/unity3d/Team Cherry/Hollow Knight Silksong/(folder with random characters)/ (userX.dat, where x = savegame slot 1-4)",
  },
  {
    id: "Switch",
    label: "Switch",
    labelKey: "UI_PLATFORM_SWITCH",
    path: "sdmc:/atmosphere/contents/<title-id>/saves/hollow_knight_silksong/",
    noteKey: "UI_PLATFORM_NOTE_SWITCH",
    noteFallback: "Not that simple: Homebrew and JKSV required",
    noteLink: {
      href: "https://www.reddit.com/r/HollowKnight/comments/1dacmy1/gamesave_from_switch_to_steam/",
      labelKey: "UI_PLATFORM_REDDIT_GUIDE",
      fallback: "Reddit guide",
      wrap: true,
    },
  },
];

const VIEW_OPTIONS: Array<{ id: ViewId; labelKey: string; fallback: string }> = [
  { id: "analysis", labelKey: "UI_VIEW_ANALYSIS", fallback: "存档分析" },
  { id: "editor", labelKey: "UI_VIEW_EDITOR", fallback: "存档编辑" },
];

export default function App() {
  const { t } = useI18n();
  const {
    fileName,
    decrypted,
    jsonText,
    setJsonText,
    parsedJson,
    handleFile: handleFileInternal,
    handleDragOver,
    saveEncrypted,
    savePlain,
  } = useSaveFile();
  const [activeTab, setActiveTab] = useState<TabId>("Stats");
  const [showToast, setShowToast] = useState(false);
  const [activePlatformId, setActivePlatformId] = useState<PlatformId>("Steam");
  const [activeAutoSaveId, setActiveAutoSaveId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewId>("analysis");

  const autoSaves = useWindowsSaves();

  const activePlatform =
    PLATFORM_OPTIONS.find(platform => platform.id === activePlatformId) ?? PLATFORM_OPTIONS[0];

  const handleCopyPath = () => {
    navigator.clipboard.writeText(activePlatform.path);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const activeTabConfig = tabDefinitions.find(tab => tab.id === activeTab);

  const handleManualFileSelected = useCallback((file: File) => {
    setActiveAutoSaveId(null);
    handleFileInternal(file);
  }, [handleFileInternal]);

  const handleManualDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handleFileInternal(file);
  }, [handleFileInternal]);

  const handleAutoSaveSelect = useCallback((save: AutoSaveSummary) => {
    setActiveAutoSaveId(save.id);
    handleFileInternal(save.file);
  }, [handleFileInternal]);

  const activeAutoSave = useMemo(() => {
    if (!activeAutoSaveId) return null;
    return autoSaves.saves.find(save => save.id === activeAutoSaveId) ?? null;
  }, [autoSaves.saves, activeAutoSaveId]);

  useEffect(() => {
    if (!activeAutoSaveId) return;
    const stillPresent = autoSaves.saves.some(save => save.id === activeAutoSaveId);
    if (!stillPresent) {
      setActiveAutoSaveId(null);
    }
  }, [autoSaves.saves, activeAutoSaveId]);

  return (
    <ResultFiltersProvider>
      <div
        className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-100"
        style={{
          backgroundImage: `url(${HornetBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900/35 to-slate-950/95" />
        <div className="relative z-10 mx-auto max-w-[110rem] space-y-12 px-6 py-10 sm:px-8 lg:px-10 xl:px-12">
          <header className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl space-y-2">
                <h1 className="text-3xl font-semibold tracking-wide text-white md:text-4xl">
                  {t("UI_APP_TITLE", "Hollow Knight Silksong Savegame Analyzer")}
                </h1>
              </div>
              <LanguageSwitch />
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex overflow-hidden rounded-full border border-white/15 bg-white/5 shadow-lg">
                {VIEW_OPTIONS.map(option => {
                  const isActive = option.id === activeView;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setActiveView(option.id)}
                      className={`${
                        isActive
                          ? "bg-emerald-500/90 text-slate-950 shadow-inner"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      } px-6 py-2 text-sm font-semibold transition-all duration-300`}
                    >
                      {t(option.labelKey, option.fallback)}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          <section className="grid gap-6 2xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-lg">
                <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                  {PLATFORM_OPTIONS.map(platform => {
                    const isActive = platform.id === activePlatform.id;

                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => setActivePlatformId(platform.id)}
                        className={`${
                          isActive
                            ? "bg-emerald-500/90 text-slate-950 shadow-lg"
                            : "border border-white/20 bg-white/5 text-white/80 hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-white"
                        } rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300`}
                      >
                        {t(platform.labelKey, platform.label)}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-slate-900/60 p-5 shadow-inner">
                  <button
                    type="button"
                    onClick={handleCopyPath}
                    title={t("UI_COPY_PATH", "Copy path")}
                    className="w-full text-left font-mono text-sm text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    {activePlatform.path}
                  </button>
                  {activePlatform.noteKey ? (
                    <p className="mt-3 text-xs leading-relaxed text-white/70">
                      {t(activePlatform.noteKey, activePlatform.noteFallback ?? "")}
                      {activePlatform.noteLink ? (
                        <>
                          {activePlatform.noteLink.wrap ? " (" : " "}
                          <a
                            className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
                            href={activePlatform.noteLink.href}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {t(activePlatform.noteLink.labelKey, activePlatform.noteLink.fallback)}
                          </a>
                          {activePlatform.noteLink.wrap ? ")" : ""}
                        </>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] 2xl:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-lg">
                  <AutoSaveCards
                    saves={autoSaves.saves}
                    isLoading={autoSaves.isLoading}
                    error={autoSaves.error}
                    isSupported={autoSaves.isSupported}
                    activeSaveId={activeAutoSaveId}
                    onSelect={handleAutoSaveSelect}
                  />
                </div>

                <SaveSlotActions
                  parsedJson={parsedJson}
                  jsonText={jsonText}
                  setJsonText={setJsonText}
                  fileName={fileName}
                  activeAutoSave={activeAutoSave}
                  autoSaveSlots={autoSaves.saves}
                  isAutoSaveSupported={autoSaves.isSupported}
                  refreshAutoSaves={autoSaves.refresh}
                  saveEncrypted={saveEncrypted}
                  savePlain={savePlain}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-lg">
                <FileUpload
                  fileName={fileName}
                  onFileSelected={handleManualFileSelected}
                  onDrop={handleManualDrop}
                  onDragOver={handleDragOver}
                />
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-lg">
                <TotalProgress parsedJson={parsedJson} />
                <div className="text-sm text-white/70">
                  {fileName
                    ? `${fileName} ${t("UI_FILE_SELECTED_SUFFIX", "selected")}`
                    : t("UI_NO_SAVE_LOADED", "No Savefile loaded")}
                </div>
                {activeAutoSave ? (
                  <div className="text-xs text-emerald-300/80">
                    {t("UI_AUTO_SAVES_SLOT", "Slot {index}").replace("{index}", String(activeAutoSave.slotIndex))} - {activeAutoSave.displayName}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
          <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-lg">
            {activeView === "analysis" ? (
              <>
                <TabBar
                  tabs={tabDefinitions}
                  activeTab={activeTab}
                  onSelect={tab => setActiveTab(tab)}
                  parsedJson={parsedJson}
                  decrypted={decrypted}
                />

                <ResultFilterBar disabled={!decrypted || !parsedJson} />

                <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-6 shadow-inner">
                  {decrypted && activeTabConfig ? (
                    activeTabConfig.render({
                      parsedJson,
                      decrypted,
                      jsonText,
                      setJsonText,
                      saveEncrypted,
                      savePlain,
                    })
                  ) : (
                    <div className="text-center text-white/70">
                      {t("UI_NO_SAVE_LOADED", "No Savefile loaded")}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-6 shadow-inner">
                <SaveEditorPage
                  parsedJson={parsedJson}
                  setJsonText={setJsonText}
                  fileName={fileName}
                  activeAutoSave={activeAutoSave}
                />
              </div>
            )}
          </section>

          <footer className="flex flex-wrap justify-center gap-4 border-t border-white/10 pt-6 text-xs text-white/70">
            <span>
              {t("UI_MADE_BY", "Made by")}
              {" "}
              <a
                href="https://github.com/br3zzly"
                className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
              >
                Br3zzly
              </a>
            </span>
            <span>
              {t("UI_WITH_HELP_FROM", "With help from")}
              {" "}
              <a
                href="https://github.com/theezeb"
                className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
              >
                theezeb
              </a>
              ,
              {" "}
              <a
                href="https://github.com/btastic"
                className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
              >
                btastic
              </a>
            </span>
            <a
              href="https://github.com/Br3zzly/hk-silksong-savegame-analyzer"
              className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
            >
              {t("UI_GITHUB_REPO", "GitHub Repo")}
            </a>
            <a
              href="https://steamcommunity.com/sharedfiles/filedetails/?id=3571462700"
              className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
            >
              {t("UI_STEAM_GUIDE", "Steam Guide")}
            </a>
            <a
              href="https://www.buymeacoffee.com/Br3zzly"
              className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
            >
              {t("UI_BUY_ME_A_COFFEE", "Buy me a coffee")}
            </a>
          </footer>
        </div>

        {showToast ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-10 flex justify-center px-4">
            <div className="pointer-events-auto rounded-full bg-emerald-500/90 px-5 py-2 text-sm font-semibold text-slate-950 shadow-xl">
              {t("UI_COPY_TO_CLIPBOARD", "Copied to Clipboard!")}
            </div>
          </div>
        ) : null}
      </div>
    </ResultFiltersProvider>
  );
}
