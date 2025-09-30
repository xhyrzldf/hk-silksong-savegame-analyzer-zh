# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Hollow Knight Silksong** savegame analyzer and editor built as a dual-platform application:
- **Web version**: Vite + React SPA deployed to GitHub Pages at https://silksong-completionist.com/
- **Desktop version**: Electron wrapper for Windows with native save file access and backup management

The tool decrypts and analyzes Silksong save files, tracking 100% completion progress across collectables, upgrades, bosses, and journal entries. It also provides a JSON editor for advanced save manipulation.

## Build and Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start Vite dev server (web version)
- `npm run build` - Full production build (TypeScript + Vite bundle)
- `npm run lint` - Run ESLint (optional, not required for routine commits)
- `npm run preview` - Serve production bundle for smoke testing
- `npm run deploy` - Build and deploy to GitHub Pages

### Electron Desktop Version (Windows only)

- `npm run dev:electron` - Start both Vite dev server and Electron in development mode
- `npm run build:electron` - Build production Electron app (generates NSIS installer + portable)
- `npm run build:electron:main` - Compile Electron main process only
- `npm run build:renderer:electron` - Build renderer with Electron-specific settings

**Important**: Electron builds require Windows environment. Output goes to `dist-electron/` and packaged apps to `dist/`.

## Architecture

### Save File Cryptography

**Core module**: `src/services/decryptor.ts`

- Hollow Knight Silksong saves use a custom format: C# binary header + Base64-encoded AES-ECB encrypted JSON
- `decodeSave(bytes)`: Strips header → Base64 decode → AES-ECB decrypt (hardcoded key) → JSON string
- `encodeSave(jsonString)`: Reverse process to regenerate valid `.dat` files
- `downloadFile()`: Browser-based file download helper

### Save Data Parsing

**Dictionary**: `src/parsers/dictionary.ts` (1000+ lines)

Defines `CATEGORIES[]` - the master list of all trackable items organized by type:
- Mask Shards (20 items @ 0.25% each)
- Spool Fragments (18 items @ 0.5% each)
- Tools, Upgrades, Crests, Keys, Relics, Fleas, etc. (various percentages)
- Bosses and Hunter's Journal entries (tracked but may not count toward 100%)

Each item has a `ParsingInfo` object that specifies how to extract its state from the JSON:
- `flag` - Simple boolean in `playerData`
- `flagInt` - Numeric counter (e.g., needle upgrades)
- `tool` - Array of tool objects with `IsUnlocked` status
- `sceneData` - Scene-specific persistent bools (e.g., collectables in specific rooms)
- `journal` - Enemy kill counts
- `crest`, `collectable`, `relict`, `quest` - Various structured data

**Summary calculation**: `src/services/saveSummary.ts`
- `calculateCompletionPercent()`: Sums up `completionPercent` for all unlocked items vs. total
- `extractSaveDisplayName()`: Searches multiple possible JSON paths for the save slot's display name

### Save Mutations (Editor)

**Module**: `src/services/saveMutations.ts`

Provides read/write API for manipulating save data:
- `getItemValue(parsedJson, parsingInfo)`: Reads current state of any item
- `applyItemValue(save, parsingInfo, value)`: Writes new state, creating missing structures as needed
- `cloneSave()`: Deep clone for mutation isolation
- Handles normalization between boolean and numeric representations

### React Hooks

**useSaveFile** (`src/hooks/useSaveFile.ts`):
- Manages file upload, drag-drop, decryption, and JSON state
- Exposes `saveEncrypted()` and `savePlain()` for exporting

**useWindowsSaves** (`src/hooks/useWindowsSaves.ts`):
- Electron-only: Auto-discovers Steam save slots via IPC
- Polls for changes, provides `AutoSaveSummary[]` with display names and completion %

**useResultFilters** (`src/hooks/useResultFilters.tsx`):
- Context for filtering displayed items: all/missing/collected, per-category visibility

### Electron IPC Architecture

**Main process**: `electron/main.ts`

- `auto-saves:list` - Scans `%USERPROFILE%/AppData/LocalLow/Team Cherry/Hollow Knight Silksong/*/user[1-4].dat`
- `auto-saves:write-slot` - Overwrites save file with backup (stored in `tool_bak/`)
- `auto-saves:copy-slot` - Copies one slot to another
- `auto-saves:list-backups` - Lists all `tool_bak/*.dat` files
- `auto-saves:restore-backup` - Restores a specific backup to a slot

**Preload**: `electron/preload.ts`

Exposes `window.ElectronAPI` with typed IPC handlers (contextBridge).

**Renderer**: Checks `window.ElectronAPI` presence to enable auto-save UI

### UI Structure

**Main App**: `src/App.tsx`

Two view modes:
1. **Analysis**: TabBar with category tabs (Stats, Mask Shards, Tools, etc.) + result filters
2. **Editor**: `SaveEditorPage` with inline editing controls and slot management

**Components**:
- `FileUpload` - Manual file upload area
- `AutoSaveCards` - Grid of auto-detected save slots (Electron only)
- `SaveSlotActions` - Save/overwrite/backup controls with toast feedback
- `TotalProgress` - Circular progress ring showing completion %
- `TabBar` - Category tabs with unlock counts
- `ResultFilterBar` - Show all/missing/collected toggle

**Tabs** (`src/tabs/*.tsx`):
Each category has a dedicated tab component that renders items from `dictionary.ts` based on filters.

### Internationalization

**Module**: `src/i18n/`

- **Context**: `I18nContext.tsx` provides `useI18n()` hook with `t(key, fallback)` and `translate(english)`
- **Loader**: `translations.ts` parses XML files from `src/translations/*.xml` (original game strings)
- **Custom overrides**: `customTranslations.ts` for UI-specific strings not in game files
- **Storage**: Language preference saved to `localStorage` key `hk-silksong-language`
- **Auto-detect**: Defaults to `zh` if browser language starts with "zh", else `en`

**Important**: All UI strings MUST use `t()` or `translate()` - no hardcoded text. When adding new strings, update `customTranslations.ts` with both `en` and `zh` entries.

## Code Style

- TypeScript with strict mode
- Functional React components (hooks, no classes)
- Two-space indentation, double quotes, trailing semicolons
- PascalCase for components, camelCase for hooks/functions
- Named exports preferred over default exports
- Import grouping: external libraries → internal modules → types/assets

## Commit Conventions and Communication

- **All communication in Chinese**: Reports, responses, PR descriptions, and commit messages must be in Chinese for the original developer
- Write commits in Chinese with prefix tags: `修复:`, `功能:`, `界面:`, `国际化:`, `文档:`, `布局:`, etc.
- Examples: `文档: 更新面板说明`, `修复: 存档解析偏移`, `功能: 新增存档编辑备份`
- Create commits immediately after completing any task
- Squash noisy WIP commits before pushing
- **Never push to remote** - treat as local-only project but keep repository healthy
- Never rewrite or delete commit history unless explicitly instructed

## Build Configuration

- **Vite config**: `vite.config.ts` sets `base: './'` for Electron, `base: '/'` for web
- **TypeScript**: Split configs - `tsconfig.app.json` (renderer), `tsconfig.node.json` (Vite), `tsconfig.electron.json` (main process as CommonJS)
- **Electron builder**: Configured in `package.json` `build` section - outputs to `dist/` with custom installer script `build/installer.nsh` (default install to D: drive if available)
- **Icon**: `build/icon.ico` (512×512 single resolution)

## Testing

No automated test suite yet. Manual verification required:
- Upload a known save file and confirm progress totals
- Test save editing and re-import
- Verify auto-save detection in Electron build
- Check backup/restore functionality

When adding tests, co-locate `*.test.ts` files and use Vitest + React Testing Library.

## Security Notes

- **Never commit real save files** - use synthetic samples only
- Decrypted JSON may contain personal data - avoid logging in production
- AES key is hardcoded (game constant, not a security concern)
- Electron IPC has path traversal protection (`assertInsideRoot`)

## Current Development State

- Electron desktop version fully functional with auto-save detection, backup system, and slot management
- Web version supports manual file upload/download
- All major collectables tracked except some boss/journal entries (may not count toward 100%)
- Build baseline: `npm run build` passes; `npm run lint` is optional
- Windows-only packaging due to save file path assumptions