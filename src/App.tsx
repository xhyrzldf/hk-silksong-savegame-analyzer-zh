import { useCallback, useEffect, useState } from "react";
import type { DragEvent } from "react";

import HornetBackground from "./assets/HornetBackground.png";
import { FileUpload } from "./components/FileUpload";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { ResultFilterBar } from "./components/ResultFilterBar";
import { AutoSaveCards } from "./components/AutoSaveCards";
import { TabBar } from "./components/TabBar";
import { TotalProgress } from "./components/TotalProgress";
import { useSaveFile } from "./hooks/useSaveFile";
import { ResultFiltersProvider } from "./hooks/useResultFilters";
import { useWindowsSaves, type AutoSaveSummary } from "./hooks/useWindowsSaves";
import { useI18n } from "./i18n/I18nContext";
import { tabDefinitions } from "./tabs";
import type { TabId } from "./tabs/types";

type PlatformId = "Steam" | "Gamepass(PC)" | "macOS" | "Linux(Steamdeck)" | "Switch";

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

export default function App() {
  const { t } = useI18n();
  const {
    fileName,
    decrypted,
    jsonText,
    setJsonText,
    parsedJson,
    handleFile: handleFileInternal,
    handleDrop: handleDropInternal,
    handleDragOver,
    saveEncrypted,
    savePlain,
  } = useSaveFile();
  const [activeTab, setActiveTab] = useState<TabId>("Stats");
  const [showToast, setShowToast] = useState(false);
  const [activePlatformId, setActivePlatformId] = useState<PlatformId>("Steam");
  const [activeAutoSaveId, setActiveAutoSaveId] = useState<string | null>(null);

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
    setActiveAutoSaveId(null);
    handleDropInternal(event);
  }, [handleDropInternal]);

  const handleAutoSaveSelect = useCallback((save: AutoSaveSummary) => {
    setActiveAutoSaveId(save.id);
    handleFileInternal(save.file);
  }, [handleFileInternal]);

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
        className="min-h-screen flex justify-center items-start p-4"
        style={{
          backgroundImage: `url(${HornetBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-4xl bg-[#1a1313cc] rounded-lg shadow-lg p-5 mt-0 space-y-5 backdrop-blur-sm">
          <div className="flex justify-end">
            <LanguageSwitch />
          </div>
          <h1 className="text-2xl font-bold text-white text-center">
            {t("UI_APP_TITLE", "Hollow Knight Silksong Savegame Analyzer")}
          </h1>

        <div className="text-center text-sm">
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {PLATFORM_OPTIONS.map(platform => {
              const isActive = platform.id === activePlatform.id;

              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setActivePlatformId(platform.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded border transition-colors ${
                    isActive
                      ? "bg-green-600 border-green-500 text-white"
                      : "bg-transparent border-white/30 text-white/80 hover:border-white hover:text-white"
                  }`}
                >
                  {t(platform.labelKey, platform.label)}
                </button>
              );
            })}
          </div>

          <p className="font-bold text-white mb-4">
            <span
              className="text-green-500 hover:underline cursor-pointer"
              onClick={handleCopyPath}
              title={t("UI_COPY_PATH", "Copy path")}
            >
              {activePlatform.path}
            </span>
            <br />
            {activePlatform.noteKey ? (
              <span className="font-light italic text-white mb-4">
                {t(activePlatform.noteKey, activePlatform.noteFallback ?? "")}
                {activePlatform.noteLink ? (
                  <>
                    {activePlatform.noteLink.wrap ? " (" : " "}
                    <a
                      className="underline text-green-300 hover:text-green-200"
                      href={activePlatform.noteLink.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {t(activePlatform.noteLink.labelKey, activePlatform.noteLink.fallback)}
                    </a>
                    {activePlatform.noteLink.wrap ? ")" : ""}
                  </>
                ) : null}
              </span>
            ) : null}
          </p>
        </div>

        <AutoSaveCards
          saves={autoSaves.saves}
          isLoading={autoSaves.isLoading}
          error={autoSaves.error}
          isSupported={autoSaves.isSupported}
          activeSaveId={activeAutoSaveId}
          onSelect={handleAutoSaveSelect}
        />

        <FileUpload
          fileName={fileName}
          onFileSelected={handleManualFileSelected}
          onDrop={handleManualDrop}
          onDragOver={handleDragOver}
        />

        {showToast && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#454d5c] text-white px-4 py-2 rounded shadow-lg z-50">
            {t("UI_COPY_TO_CLIPBOARD", "Copied to Clipboard!")}
          </div>
        )}

        <TotalProgress parsedJson={parsedJson} />

        <TabBar
          tabs={tabDefinitions}
          activeTab={activeTab}
          onSelect={tab => setActiveTab(tab)}
          parsedJson={parsedJson}
          decrypted={decrypted}
        />

        <ResultFilterBar disabled={!decrypted || !parsedJson} />

        <div className="mt-4">
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
            <div className="text-white text-center">
              {t("UI_NO_SAVE_LOADED", "No Savefile loaded")}
            </div>
          )}
        </div>
        <footer className="w-full mt-8 py-4  text-white text-center text-sm  ">
          {t("UI_MADE_BY", "Made by")} <a href="https://github.com/br3zzly" className="underline">Br3zzly</a><br />
          {t("UI_WITH_HELP_FROM", "With help from")} <a href="https://github.com/theezeb" className="underline">theezeb</a>, <a href="https://github.com/btastic" className="underline">btastic</a><br />
          <a href="https://github.com/Br3zzly/hk-silksong-savegame-analyzer" className="underline">{t("UI_GITHUB_REPO", "GitHub Repo")}</a><br />
          <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3571462700" className="underline">{t("UI_STEAM_GUIDE", "Steam Guide")}</a><br />
          <a href="https://www.buymeacoffee.com/Br3zzly" className="underline">{t("UI_BUY_ME_A_COFFEE", "Buy me a coffee")}</a>
        </footer>
        </div>
      </div>
    </ResultFiltersProvider>
  );
}

