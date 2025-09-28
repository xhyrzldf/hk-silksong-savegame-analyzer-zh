# Repository Guidelines

## Project Structure & Module Organization
This Vite-powered React SPA keeps all source code in `src/`. `main.tsx` registers the root component. Common UI lives in `src/components/`, feature-specific panels and types under `src/tabs/`, and shared hooks in `src/hooks/`. Save parsing and crypto helpers reside in `src/services/decryptor.ts` and `src/parsers/dictionary.ts`. Static art belongs in `src/assets/`, site chrome in `public/`, and build artifacts in `dist/`.

## Build, Test, and Development Commands
Install dependencies with `npm install`. `npm run dev` starts the Vite dev server. `npm run build` performs a TypeScript project build then emits a production bundle into `dist/`. `npm run lint` executes ESLint with the TypeScript and React Hooks presets—resolve all warnings before opening a PR. `npm run preview` serves the compiled bundle for smoke testing. `npm run deploy` builds and publishes `dist/` to GitHub Pages (copies `dist/index.html` to `dist/404.html` for routing).

## Coding Style & Naming Conventions
Use TypeScript with functional React components. Follow the existing two-space indentation, trailing semicolons, and double-quoted strings. Components stay in PascalCase (`FileUpload`) and hooks in camelCase prefixed with `use`. Prefer named exports (`export const Foo`) over defaults and group imports by origin. Run `npm run lint` before committing to let ESLint enforce these rules.

## Testing Guidelines
There is no automated test harness yet, so document manual verification steps in PRs (e.g., upload a known save and confirm progress totals). When adding coverage, co-locate `*.test.ts` files near the code using Vitest + React Testing Library, and extend the `npm test` script accordingly. Keep fixtures anonymized and small.

## Commit & Pull Request Guidelines
Write commits in the imperative mood with short subjects (`Fix parser offsets`, `Add Relics tab styles`). Prefix with a tag such as `Fix:` or `Feat:` when it clarifies intent, mirroring recent history. Squash noisy work-in-progress commits before pushing. PRs should summarize the change, link related issues, list manual test results, and add screenshots or GIFs for UI tweaks. Ensure `npm run build` and `npm run lint` pass locally before requesting review.
Treat this as a local-only project: do not push to remote hosts, but keep the local repository healthy. After completing any task, create a commit immediately with a clear Chinese subject (e.g., `文档: 更新面板说明`). Never rewrite or delete commit history unless explicitly instructed.

## Save Data & Security Notes
Never commit personal or unreleased save files—use synthetic or sanitized samples. Treat decrypted output as sensitive: delete temporary JSON exports after debugging and avoid logging raw save contents to the console in production builds.
