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
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold tracking-tight text-white/95">
                    {t("UI_APP_TITLE", "Hollow Knight Silksong Savegame Analyzer")}
                  </h1>
                  <span className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-0.5 shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/70 hover:scale-110 animate-pulse">
                    <span className="relative inline-flex items-center justify-center rounded-full bg-slate-950 px-3 py-1 transition-all duration-300 group-hover:bg-slate-900">
                      <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-xs font-bold tracking-wider text-transparent animate-[shimmer_2s_ease-in-out_infinite]">
                        v2.0
                      </span>
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/0 via-purple-500/50 to-blue-500/0 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100"></span>
                    </span>
                  </span>
                </div>
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

            {/* Apple 风格功能说明 */}
            <Card className="card-hover border-white/10 bg-gradient-to-br from-blue-950/30 to-purple-950/20">
              <CardContent className="p-4">
                <h3 className="mb-3 text-sm font-semibold text-white/90">
                  {t("UI_FEATURES_TITLE", "强大功能")}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-400">✦</span>
                    <span className="text-white/70">{t("UI_FEATURE_ANALYZE", "实时存档进度分析，一键掌握100%完成度")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-purple-400">✦</span>
                    <span className="text-white/70">{t("UI_FEATURE_EDIT", "专业存档编辑器，精确修改每一项数据")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-400">✦</span>
                    <span className="text-white/70">{t("UI_FEATURE_BACKUP", "智能备份系统，一键复制与恢复存档")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-amber-400">✦</span>
                    <span className="text-white/70">{t("UI_FEATURE_IMPORT", "压缩包导入导出，支持ZIP/RAR/7z格式")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 二次开发作者展示 - 超炫酷版 */}
            <div className="group/card relative mt-auto overflow-hidden rounded-xl border-2 border-transparent bg-gradient-to-br from-emerald-950/60 via-blue-950/50 to-purple-950/60 p-[2px] shadow-2xl shadow-emerald-500/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-emerald-500/40 animate-[borderGlow_3s_ease-in-out_infinite]">
              {/* 动态渐变边框 */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 opacity-50 blur-sm animate-[spin_8s_linear_infinite]" />

              {/* 粒子流动背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/5 via-transparent to-cyan-500/5 animate-[pulse_4s_ease-in-out_infinite]" />

              {/* 内容区域 */}
              <div className="relative rounded-xl bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 p-4 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-3">
                  {/* 头像 - 悬停旋转和发光 */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 opacity-0 blur-md transition-opacity duration-500 group-hover/card:opacity-70 group-hover/card:animate-pulse" />
                    <img
                      src="/avatar.png"
                      alt="Developer Avatar"
                      className="relative h-12 w-12 rounded-full border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/30 transition-all duration-500 group-hover/card:scale-110 group-hover/card:rotate-[360deg] group-hover/card:border-purple-400"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="bg-gradient-to-r from-white via-emerald-100 to-blue-100 bg-clip-text text-sm font-bold text-transparent">
                        {t("UI_ENHANCED_BY", "增强版作者")}
                      </h4>
                      {/* 徽章 - 脉冲动画 */}
                      <span className="relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-lg animate-[pulse_2s_ease-in-out_infinite]">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
                        <span className="relative">{t("UI_MAJOR_UPDATE", "大幅改进")}</span>
                      </span>
                    </div>

                    {/* B站链接 - 超炫渐变 */}
                    <a
                      href="https://space.bilibili.com/26786884?spm_id_from=333.40164.0.0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link mt-1.5 flex items-center gap-1.5 text-sm font-bold transition-all duration-300"
                    >
                      <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-[gradient_3s_ease-in-out_infinite] bg-[length:200%_auto]">
                          皮一下就很凡@BiliBili
                        </span>
                        <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 transition-all duration-300 group-hover/link:w-full" />
                      </span>
                      <svg className="h-4 w-4 text-purple-400 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:scale-110 group-hover/link:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* 成就说明 */}
                <p className="text-xs leading-relaxed text-white/70 transition-colors duration-300 group-hover/card:text-white/90">
                  <span className="inline-flex items-center gap-1">
                    <span className="text-emerald-400">★</span>
                    {t("UI_ENHANCED_DESC", "全新Electron桌面版 · 智能备份系统 · 压缩包导入导出 · 多项UI/UX优化")}
                  </span>
                </p>
              </div>
            </div>

            {/* 原作者信息 */}
            <div className="space-y-2 border-t border-white/5 pt-3 text-xs text-white/40">
              <div className="mb-1 text-white/50">
                {t("UI_ORIGINAL_AUTHOR", "原作者")}: <span className="text-emerald-400/70">Br3zzly</span>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <a
                  href="https://github.com/Br3zzly/hk-silksong-savegame-analyzer"
                  className="text-emerald-400/60 transition-colors hover:text-emerald-300"
                >
                  GitHub
                </a>
                <span>·</span>
                <a
                  href="https://steamcommunity.com/sharedfiles/filedetails/?id=3571462700"
                  className="text-emerald-400/60 transition-colors hover:text-emerald-300"
                >
                  Steam
                </a>
                <span>·</span>
                <a
                  href="https://www.buymeacoffee.com/Br3zzly"
                  className="text-emerald-400/60 transition-colors hover:text-emerald-300"
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
