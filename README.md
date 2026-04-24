# 凯恒 · AI 乙女游戏

一款以 **AI 对话为核心体验**的中文乙女视觉小说。玩家与建筑设计师凯恒展开真实的对话——每一句回应都由 Claude AI 实时生成，不是预设台词。

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple) ![Claude](https://img.shields.io/badge/Claude-Haiku-orange)

---

## 核心特色

- **真实 AI 对话** — 凯恒的每一句回应由 Claude Haiku 实时生成，理解你说的每一句话
- **情绪联动立绘** — 凯恒根据对话内容实时切换 7 种情绪表情（思考 / 专注 / 微笑 / 温柔…）
- **好感度系统** — 你的每一次选择都影响关系走向，触发不同剧情分支
- **沉浸式美术** — 3 个手绘风 SVG 场景（咖啡馆午后 / 雨天 / 傍晚），含粒子动画和雨滴效果
- **中文优先** — 专为华语玩家设计的剧情与角色

---

## 技术架构

```
浏览器                          服务端（Vercel）
────────                        ────────────────
Next.js 14 App Router           API Route /api/claude
Framer Motion 动画              ↕ SSE 流式输出
Zustand 游戏状态                 Anthropic SDK
localStorage 存档                Claude Haiku
SVG 纯代码美术                   API Key 安全隔离
```

**为什么不用 Ren'Py？** Ren'Py 的 WASM 导出无法建立 TCP 连接，Claude API 调不通；自定义动画在 canvas 渲染模型里极度受限。React + Next.js 是唯一能同时满足 AI 对话 + 自定义动画 + Key 安全隔离的方案。

---

## 本地运行

**环境要求：** Node.js 18+，Anthropic API Key

```bash
# 1. 克隆
git clone git@github.com:wei-xie24/otome-ai-vn-.git
cd otome-ai-vn-

# 2. 安装依赖
npm install

# 3. 配置 API Key
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 ANTHROPIC_API_KEY

# 4. 启动
npm run dev
# 访问 http://localhost:3000
```

> **没有 API Key？** 也可以运行——AI 对话节点会自动使用凯恒的备用台词，剧情主线完全可玩。

---

## 项目结构

```
app/
  api/claude/route.ts   # Claude SSE 代理（API Key 永不进浏览器）
  layout.tsx            # 根布局
  page.tsx              # 入口

components/
  GameLayout.tsx        # 主控制器（状态机、场景加载、AI 流程）
  KaiCharacter.tsx      # 凯恒 SVG 立绘（7 种情绪，Framer Motion 动画）
  SceneBackground.tsx   # 3 个 SVG 场景背景（含粒子/雨滴动画）
  DialogueBox.tsx       # 对话框（支持流式 AI 输出）
  ChoicePanel.tsx       # 选项面板（含内嵌 AI 自由输入）
  Background.tsx        # 场景淡入淡出切换
  CharacterSprite.tsx   # 立绘入场动画

lib/
  types.ts              # 全局 TypeScript 类型
  gameStore.ts          # Zustand 游戏状态（好感度、AI 历史、存档）
  gameEngine.ts         # 脚本引擎（场景加载、分支解析、情绪检测）
  saveLoad.ts           # 本地存档（localStorage，含压缩策略）

public/script/          # 剧情脚本 JSON（浏览器直接 fetch）
  ch1/                  # 第一章（3 个场景，7 个 AI 对话节点）
  characters/kai.json   # 凯恒角色数据（系统提示词、情绪关键词）
```

---

## 角色介绍

**凯恒** · 28岁 · 建筑设计师

冷静克制，外表疏离，内心藏着温柔。不轻易开口，但每一句话都有重量。他不会说甜言蜜语，却会在你不注意的时候，默默记住你说过的每一件小事。

> *"…你来了。"*

---

## 第一章剧情

| 场景 | 地点 | 核心事件 |
|------|------|---------|
| 初遇 | 咖啡馆 · 午后 | 偶然同桌，第一次对话 |
| 雨中 | 咖啡馆 · 雨天 | 再次相遇，关系悄然变化 |
| 临别 | 咖啡馆 · 傍晚 | 好感度分支，三种走向 |

---

## 开发路线图

- [x] P0 — 核心引擎（场景 / 分支 / AI 对话 / 存档）
- [x] P0 — SVG 美术（凯恒立绘 × 7 情绪，场景背景 × 3）
- [x] P0 — 第一章剧情脚本
- [ ] P1 — 标题屏 / 顶栏 / 存档界面
- [ ] P1 — 章节结算画面
- [ ] P1 — BGM 系统
- [ ] P1 — Vercel 部署
- [ ] P2 — 第二章剧情
- [ ] P2 — 打字机效果 / 设置页面

---

## License

MIT © 2026 wei-xie24
