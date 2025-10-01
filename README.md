# Hollow Knight Silksong 存档分析器

一款用于追踪《空洞骑士：丝之歌》游戏存档完成度的工具，支持 Web 和 Windows 桌面两种使用方式。

---

> **Fork Notice / Fork 说明**
>
> **EN**: This project is forked from [Br3zzly/hk-silksong-savegame-analyzer](https://github.com/Br3zzly/hk-silksong-savegame-analyzer) with enhancements focused on desktop experience and Chinese localization. Main improvements include: Electron-based Windows desktop app, automatic Steam save slot detection, backup/restore system, logging functionality, and improved Chinese translation. The original project provides a web version at [silksong-completionist.com](http://silksong-completionist.com/). This fork is released under GPL-3.0 license.
>
> **中文**：本项目 fork 自 [Br3zzly/hk-silksong-savegame-analyzer](https://github.com/Br3zzly/hk-silksong-savegame-analyzer)，是基于原项目的修改增强版本。
>
> **主要改进**：
> - ✨ 添加 Windows 桌面版支持（Electron）
> - 💾 自动检测 Steam 存档槽位
> - 🔄 存档备份与恢复系统
> - 📝 日志系统
> - 🌏 完善中文本地化
>
> 原项目提供 Web 在线版本：[silksong-completionist.com](http://silksong-completionist.com/)
>
> 本项目遵循 GPL-3.0 开源协议，所有修改和新增代码均以相同协议发布。

## 功能特性

- **完成度追踪**：自动计算游戏 100% 完成进度
- **物品清单**：涵盖所有面具碎片、线轴碎片、工具、升级道具等收集品
- **BOSS 与图鉴**：追踪已击败 BOSS 和猎人日志条目
- **存档编辑**：高级 JSON 编辑器，支持直接修改存档数据
- **自动备份**（桌面版）：自动检测 Steam 存档槽位，支持一键备份与恢复
- **多语言支持**：支持中文与英文界面

## 使用方法

### Windows 桌面版（本项目）

#### 下载安装包
前往 [Releases](../../releases) 页面下载最新版本的安装包或 portable 版本。

#### 从源代码构建

**环境要求**：
- Node.js 16+
- Windows 系统（用于 Electron 打包）

**构建步骤**：

```bash
# 1. 克隆仓库
git clone git@github.com:xhyrzldf/hk-silksong-savegame-analyzer.git
cd hk-silksong-savegame-analyzer

# 2. 安装依赖
npm install

# 3. 配置核心数据文件（必需）
# 复制示例文件并填入实际游戏数据
cp src/services/decryptor.example.ts src/services/decryptor.ts
cp src/parsers/dictionary.example.ts src/parsers/dictionary.ts
# 编辑 decryptor.ts 填入正确的 AES 密钥
# 编辑 dictionary.ts 填入完整的游戏物品数据

# 4. 开发调试
npm run dev              # Web 版开发服务器
npm run dev:electron     # 桌面版开发模式

# 5. 生产构建
npm run build            # 构建 Web 版
npm run build:electron   # 构建桌面版（生成安装包）
```

**注意事项**：
- 核心数据文件（`decryptor.ts` 和 `dictionary.ts`）可参考 `.example.ts` 示例文件和[原始项目](https://github.com/Br3zzly/hk-silksong-savegame-analyzer)自行配置
- 桌面版安装包输出至 `dist/` 目录
- 如需自定义图标，请替换 `build/icon.ico` 文件

### Web 在线版

如需使用 Web 版本，请访问[原始项目](https://github.com/Br3zzly/hk-silksong-savegame-analyzer)。

## 技术栈

- **前端框架**：React + TypeScript + Vite
- **UI 库**：TailwindCSS + shadcn/ui
- **桌面壳**：Electron (Windows)
- **加密解密**：crypto-js (AES-ECB)
- **部署**：GitHub Pages

## 开发指南

项目采用 Vite 构建，支持热更新和快速开发体验：

```bash
npm run dev             # 启动 Vite 开发服务器（Web 版）
npm run build           # 生产构建（TypeScript + Vite 打包）
npm run preview         # 预览生产构建结果
npm run lint            # 运行 ESLint（可选）
```

**目录结构**：
```
src/
├── services/        # 核心逻辑（加密、解析、数据操作）
├── parsers/         # 游戏数据字典
├── hooks/           # React Hooks（存档管理、过滤器等）
├── components/      # UI 组件
├── tabs/            # 分类标签页组件
└── i18n/            # 国际化翻译
```

## 许可证

本项目采用 [GPL-3.0](LICENSE) 许可证开源。

根据 GPL-3.0 许可证：
- ✅ 允许自由使用、修改和分发本软件
- ✅ 允许商业使用
- ⚠️ 修改后的衍生作品必须以相同的 GPL-3.0 协议开源
- ⚠️ 必须保留原作者的版权声明和许可证声明
- ⚠️ 修改后的代码必须明确标注修改内容

详细条款请参阅 [LICENSE](LICENSE) 文件。

## 致谢

- **原始项目**：[Br3zzly/hk-silksong-savegame-analyzer](https://github.com/Br3zzly/hk-silksong-savegame-analyzer) - 本项目的基础
- 灵感来源：[Hollow Knight Completion Check](https://reznormichael.github.io/hollow-knight-completion-check/) (RIP)
- 存档解密代码参考：[Silksaver](https://martinshift.github.io/silksaver/)
- 完成度计算参考：[Reddit 社区讨论](https://www.reddit.com/r/Silksong/comments/1ng54do/list_of_requirements_to_get_100_completion/)
