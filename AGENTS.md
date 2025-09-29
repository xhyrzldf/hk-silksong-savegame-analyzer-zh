# Repository Guidelines

## Project Structure & Module Organization
This Vite-powered React SPA keeps all source code in `src/`. `main.tsx` registers the root component. Common UI lives in `src/components/`, feature-specific panels and types under `src/tabs/`, and shared hooks in `src/hooks/`. Save parsing and crypto helpers reside in `src/services/decryptor.ts` and `src/parsers/dictionary.ts`. Static art belongs in `src/assets/`, site chrome in `public/`, and build artifacts in `dist/`.

## Build, Test, and Development Commands
Install dependencies with `npm install`. `npm run dev` starts the Vite dev server. `npm run build` performs a TypeScript project build then emits a production bundle into `dist/`. 日常验证仅需执行 `npm run build`，无需额外运行 `npm run lint`。`npm run lint` 依旧提供 ESLint 检查结果；`npm run preview` serves the compiled bundle for smoke testing. `npm run deploy` builds and publishes `dist/` to GitHub Pages (copies `dist/index.html` to `dist/404.html` for routing).

## Coding Style & Naming Conventions
Use TypeScript with functional React components. Follow the existing two-space indentation, trailing semicolons, and double-quoted strings. Components stay in PascalCase (`FileUpload`) and hooks in camelCase prefixed with `use`. Prefer named exports (`export const Foo`) over defaults and group imports by origin. 如需静态检查可手动执行 `npm run lint`，但常规提交流程不再强制运行。

## Internationalization
UI 文案必须经过 `useI18n`，不要再出现硬编码字符串。原始翻译对照存放在 `src/translations/*.xml`，由 `src/i18n/` 下的 loader 在运行时解析；新增文案时，请同步更新 `customTranslations.ts` 或补齐 XML 词条，并确保英文/中文同时完善。调试缺失翻译时，可借助控制台输出或临时日志，但提交前务必清理。

## Testing Guidelines
There is no automated test harness yet, so document manual verification steps in PRs (e.g., upload a known save and confirm progress totals). When adding coverage, co-locate `*.test.ts` files near the code using Vitest + React Testing Library, and extend the `npm test` script accordingly. Keep fixtures anonymized and small.

## Commit & Pull Request Guidelines
Write commits in the imperative mood with short subjects (`Fix parser offsets`, `Add Relics tab styles`). Prefix with a tag such as `Fix:` or `Feat:` when it clarifies intent, mirroring recent history. Squash noisy work-in-progress commits before pushing. PRs should summarize the change, link related issues, list manual test results, and add screenshots or GIFs for UI tweaks. Ensure `npm run build` passes locally before requesting review；`npm run lint` 可按需执行。
Treat this as a local-only project: do not push to remote hosts, but keep the local repository healthy. After completing any task, create a commit immediately with a clear Chinese subject (e.g., `文档: 更新面板说明`). Never rewrite or delete commit history unless explicitly instructed.
All报告、答复与 PR 描述应使用中文，便于原始开发者查阅。

## Save Data & Security Notes
Never commit personal or unreleased save files—use synthetic or sanitized samples. Treat decrypted output as sensitive: delete temporary JSON exports after debugging and avoid logging raw save contents to the console in production builds.
