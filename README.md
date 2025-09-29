# Hollow Knight Silksong Savegame Analyzer
  
For all the completionists out there: I created a tool to check the progress on you savefile:  
  
http://silksong-completionist.com/  
  
Currently everything needed for 100% completion is taken into account.  
In the future I also want to add all bosses and hunters journal entries + other stuff you might miss to the tool. And who knows, maybe even 112% when DLCs drop ;)

## Electron 桌面版打包

项目已提供 Electron 壳，支持在 Windows 上生成免依赖的可执行程序：

1. 安装依赖：`npm install`
2. 开发调试（自动启动 Vite 与 Electron）：`npm run dev:electron`
3. 生产打包（生成 NSIS 安装包与 portable 包）：`npm run build:electron`

> ⚠️ 构建命令需要在 Windows 环境执行，产物默认输出至 `dist/` 与 `dist-electron/`。如需自定义图标，请将 `build/icon.ico` 替换为目标图标后再运行打包。

Big thank you to:  
Greatly inspired by: https://reznormichael.github.io/hollow-knight-completion-check/ (RIP)  
Savegame decypher code from: https://martinshift.github.io/silksaver/  
Huge help for what counts towards the 100%: https://www.reddit.com/r/Silksong/comments/1ng54do/list_of_requirements_to_get_100_completion/
