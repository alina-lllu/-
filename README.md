# 凯恒 · 乙女视觉小说

一款中文乙女视觉小说。玩家与建筑设计师凯恒在固定剧情和分支选项中推进关系，每一句回应都来自预设脚本。

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple)

---

## 核心特色

- **固定剧情分支** — 玩家通过预设选项推进对话，保证角色语气和剧情节奏稳定
- **情绪联动立绘** — 凯恒根据剧情节点切换 7 种情绪表情（思考 / 专注 / 微笑 / 温柔…）
- **好感度系统** — 你的每一次选择都影响关系走向，触发不同剧情分支
- **沉浸式美术** — 3 个手绘风 SVG 场景（咖啡馆午后 / 雨天 / 傍晚），含粒子动画和雨滴效果
- **中文优先** — 专为华语玩家设计的剧情与角色

---

## 技术架构

```
浏览器
────────
Next.js 14 App Router
Framer Motion 动画
Zustand 游戏状态
localStorage 存档
SVG 纯代码美术
```

**为什么不用 Ren'Py？** 当前版本需要自定义 UI、动画和网页部署体验，React + Next.js 更适合快速迭代。

---

## 本地运行

**环境要求：** Node.js 18+

```bash
# 1. 克隆
git clone git@github.com:wei-xie24/otome-ai-vn-.git
cd otome-ai-vn-

# 2. 安装依赖
npm install

# 3. 启动
npm run dev
# 访问 http://localhost:3000
```

---

## 项目结构

```
app/
  layout.tsx            # 根布局
  page.tsx              # 入口

components/
  GameLayout.tsx        # 主控制器（状态机、场景加载、剧情推进）
  KaiCharacter.tsx      # 凯恒 SVG 立绘（7 种情绪，Framer Motion 动画）
  SceneBackground.tsx   # 3 个 SVG 场景背景（含粒子/雨滴动画）
  DialogueBox.tsx       # 对话框
  ChoicePanel.tsx       # 选项面板
  Background.tsx        # 场景淡入淡出切换
  CharacterSprite.tsx   # 立绘入场动画

lib/
  types.ts              # 全局 TypeScript 类型
  gameStore.ts          # Zustand 游戏状态（好感度、剧情进度、存档）
  gameEngine.ts         # 脚本引擎（场景加载、分支解析）
  saveLoad.ts           # 本地存档（localStorage）

public/script/          # 剧情脚本 JSON（浏览器直接 fetch）
  ch1/                  # 第一章（3 个场景，固定剧情分支）
  characters/kai.json   # 凯恒角色数据（立绘资源）
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

- [x] P0 — 核心引擎（场景 / 分支 / 存档）
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
