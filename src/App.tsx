import { useCallback, useEffect, useMemo, useState } from "react";
import type { DragEvent } from "react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const [activePlatformId, setActivePlatformId] = useState<PlatformId>("Steam");
  const [activeAutoSaveId, setActiveAutoSaveId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewId>("analysis");

  const autoSaves = useWindowsSaves();

  const activePlatform =
    PLATFORM_OPTIONS.find(platform => platform.id === activePlatformId) ?? PLATFORM_OPTIONS[0];

  const handleCopyPath = () => {
    navigator.clipboard.writeText(activePlatform.path);
    toast.success(t("UI_COPY_TO_CLIPBOARD", "Copied to Clipboard!"));
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
        className="relative isolate flex min-h-screen overflow-hidden bg-background text-foreground animate-fadeIn"
        style={{
          backgroundImage: `url(${HornetBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
        <div className="absolute inset-0 gradient-mesh opacity-60" />

        {/* 左侧边栏 - 响应式：移动端隐藏，平板以上显示 */}
        <aside className="animate-slideInLeft relative z-10 hidden w-full flex-shrink-0 border-r border-border/30 bg-card/30 backdrop-blur-xl lg:block lg:w-[500px]">
          <div className="flex h-full flex-col space-y-4 overflow-y-auto p-4 lg:p-5">
            {/* 标题和语言切换 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl font-bold tracking-tight text-white/95">
                  {t("UI_APP_TITLE", "Hollow Knight Silksong Savegame Analyzer")}
                </h1>
                <LanguageSwitch />
              </div>

              {/* 视图切换 */}
              <div className="flex gap-2">
                {VIEW_OPTIONS.map(option => {
                  const isActive = option.id === activeView;
                  return (
                    <Button
                      key={option.id}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => setActiveView(option.id)}
                      className="flex-1"
                    >
                      {t(option.labelKey, option.fallback)}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* 文件上传区 */}
            <Card className="card-hover transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/10">
              <CardContent className="p-4">
                <FileUpload
                  fileName={fileName}
                  onFileSelected={handleManualFileSelected}
                  onDrop={handleManualDrop}
                  onDragOver={handleDragOver}
                />
              </CardContent>
            </Card>

            {/* 自动存档卡片 */}
            <Card className="card-hover">
              <CardContent className="p-4">
                <AutoSaveCards
                  saves={autoSaves.saves}
                  isLoading={autoSaves.isLoading}
                  error={autoSaves.error}
                  isSupported={autoSaves.isSupported}
                  activeSaveId={activeAutoSaveId}
                  onSelect={handleAutoSaveSelect}
                />
              </CardContent>
            </Card>

            {/* 进度显示 */}
            <Card className="card-hover border-primary/20 bg-gradient-to-br from-primary/5 to-card/60">
              <CardContent className="space-y-3 p-4">
                <TotalProgress parsedJson={parsedJson} />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-white/80">
                    <span className="text-xs uppercase tracking-wide text-white/50">
                      {t("UI_CURRENT_FILE", "当前文件")}
                    </span>
                    <span className="truncate font-medium ml-2">
                      {fileName || t("UI_NO_SAVE_LOADED", "未加载存档")}
                    </span>
                  </div>
                  {activeAutoSave && (
                    <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs text-primary">
                      {t("UI_AUTO_SAVES_SLOT", "槽位 {index}").replace("{index}", String(activeAutoSave.slotIndex))} - {activeAutoSave.displayName}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 平台选择（可折叠，精简版） */}
            <details className="card-hover group rounded-xl border border-white/10 bg-slate-950/50 shadow-xl">
              <summary className="cursor-pointer p-3 text-sm font-semibold text-white/80 transition-colors hover:text-white">
                <span className="inline-flex items-center gap-2">
                  <span>⚙️</span>
                  {t("UI_PLATFORM_SETTINGS", "平台设置")}
                </span>
              </summary>
              <div className="space-y-3 px-3 pb-3">
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORM_OPTIONS.map(platform => {
                    const isActive = platform.id === activePlatform.id;
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => setActivePlatformId(platform.id)}
                        className={`${
                          isActive
                            ? "bg-emerald-500 text-slate-950 shadow-md"
                            : "border border-white/20 bg-white/5 text-white/70 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-white"
                        } rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-200`}
                      >
                        {t(platform.labelKey, platform.label)}
                      </button>
                    );
                  })}
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-slate-900/50 p-3">
                  <button
                    type="button"
                    onClick={handleCopyPath}
                    title={t("UI_COPY_PATH", "复制路径")}
                    className="w-full text-left font-mono text-xs text-emerald-300/90 transition-colors hover:text-emerald-200 break-all"
                  >
                    {activePlatform.path}
                  </button>
                  {activePlatform.noteKey && (
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      {t(activePlatform.noteKey, activePlatform.noteFallback ?? "")}
                      {activePlatform.noteLink && (
                        <>
                          {" "}
                          <a
                            className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
                            href={activePlatform.noteLink.href}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {t(activePlatform.noteLink.labelKey, activePlatform.noteLink.fallback)}
                          </a>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </details>

            {/* Footer - 精简版 */}
            <div className="mt-auto space-y-2 border-t border-white/5 pt-3 text-xs text-white/40">
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <a
                  href="https://github.com/Br3zzly/hk-silksong-savegame-analyzer"
                  className="text-emerald-400/80 transition-colors hover:text-emerald-300"
                >
                  GitHub
                </a>
                <span>·</span>
                <a
                  href="https://steamcommunity.com/sharedfiles/filedetails/?id=3571462700"
                  className="text-emerald-400/80 transition-colors hover:text-emerald-300"
                >
                  Steam
                </a>
                <span>·</span>
                <a
                  href="https://www.buymeacoffee.com/Br3zzly"
                  className="text-emerald-400/80 transition-colors hover:text-emerald-300"
                >
                  Coffee
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* 右侧主内容区 - 响应式布局 */}
        <main className="animate-slideInRight relative z-10 flex flex-1 flex-col overflow-hidden">
          <div className="flex h-full flex-col p-3 sm:p-4 lg:p-5">
            {/* 移动端顶部栏 */}
            <div className="mb-3 lg:hidden">
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 shadow-xl backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-bold text-white/95">
                    {t("UI_APP_TITLE", "Silksong 存档分析")}
                  </h1>
                  <LanguageSwitch />
                </div>
                <div className="mt-3 flex gap-2">
                  {VIEW_OPTIONS.map(option => {
                    const isActive = option.id === activeView;
                    return (
                      <Button
                        key={option.id}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => setActiveView(option.id)}
                        className="flex-1"
                      >
                        {t(option.labelKey, option.fallback)}
                      </Button>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <FileUpload
                    fileName={fileName}
                    onFileSelected={handleManualFileSelected}
                    onDrop={handleManualDrop}
                    onDragOver={handleDragOver}
                  />
                </div>
                {parsedJson && <TotalProgress parsedJson={parsedJson} />}
              </div>
            </div>

            {/* 存档操作工具栏 - 精简版 */}
            <div className="animate-scaleIn mb-3 flex-shrink-0 rounded-xl border border-white/10 bg-slate-900/50 p-3 shadow-xl backdrop-blur-lg">
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

            {/* 主内容区 - 占满剩余空间 */}
            <div className="animate-scaleIn flex h-full flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900/30 shadow-2xl backdrop-blur-lg transition-all duration-300">
              {activeView === "analysis" ? (
                <div className="flex h-full flex-col overflow-hidden">
                  <div className="flex-shrink-0 space-y-3 p-4">
                    <TabBar
                      tabs={tabDefinitions}
                      activeTab={activeTab}
                      onSelect={tab => setActiveTab(tab)}
                      parsedJson={parsedJson}
                      decrypted={decrypted}
                    />
                    <ResultFilterBar disabled={!decrypted || !parsedJson} />
                  </div>

                  <div className="flex-1 overflow-y-auto rounded-t-xl border-t border-white/5 bg-slate-950/50 px-4 py-5 shadow-inner">
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
                      <div className="flex h-full items-center justify-center text-center text-lg text-white/50">
                        {t("UI_NO_SAVE_LOADED", "未加载存档文件")}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto rounded-xl border border-white/5 bg-slate-950/50 p-4 shadow-inner">
                  <SaveEditorPage
                    parsedJson={parsedJson}
                    setJsonText={setJsonText}
                    fileName={fileName}
                    activeAutoSave={activeAutoSave}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ResultFiltersProvider>
  );
}
