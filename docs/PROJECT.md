# 乙女 AI 视觉小说 — 项目全知文档

> 最后更新：2026-04-23 | 含角色人设、UI设计、剧情脚本
> 适合读者：开发者本人、接手的 agent、合作者、未来的自己
> **新 agent 快速上手：读完本文件即可接手，无需追溯历史对话**

---

## 一、产品定位（最重要的一段话）

**这不是"带 AI 功能的视觉小说"。这是"以 AI 对话为核心体验的乙女游戏"。**

AI 生成对话是产品的本质差异化，不是附加 feature。玩家和角色的关系建立在真实的、响应式的对话上，而不是从预设脚本里选 A/B/C。这个定位决定了后续所有技术和设计选择。

如果把 AI 对话做成可选项或备用路径，产品就退化成普通静态 VN——那条赛道里对手是有 5000 万美元美术预算的恋与深空，没有胜算。

---

## 二、目标用户

| 维度 | 描述 |
|------|------|
| 群体 | 华语圈女性玩家，18-30 岁 |
| 背景 | 有乙女游戏基础，玩过恋与深空、光与夜之恋等 |
| 偏好 | 希望与角色有真实互动感，不满足于纯选项式剧情 |
| 平台习惯 | **待验证** — 是否愿意在浏览器玩独立游戏（vs. 手机 App） |
| 审美标准 | 见过高质量手绘角色立绘，对美术有明确期待 |

**注意：** 前提 1-5（目标用户、市场空白、平台偏好、技术可行性、开发时间）均为未验证假设，MVP 的目的就是验证这些。

---

## 三、核心功能需求（MVP）

### 3.1 游戏机制
- 1 条完整路线作为 Demo（约 3-5 章节）
- 好感度系统：玩家选择/AI 对话影响好感度
- 分支剧情：关键节点 2-3 个选项
- 多结局：Good End / Normal End / Bad End
- **AI 实时对话**：核心卖点，部分场景由 Claude 生成角色台词，而非纯脚本

### 3.2 内容规模目标（MVP）
- 文本：30,000-50,000 字（含 AI 生成部分）
- 角色立绘：5-10 张（含多种情绪变体）
- 背景图：5-8 张
- 背景音乐：2-3 首

### 3.3 技术需求
- **平台**：Web 浏览器优先（桌面 + 平板响应式）
- **语言**：中文界面
- **存档**：localStorage（含 AI 对话历史，需压缩策略）
- **动画**：角色入场、情绪切换、场景转场（非可选项，是用户明确需求）
- **美工**：高质量（用户明确要求），AI 生成需解决风格一致性问题

---

## 四、技术栈（已确定）

**选型决定时间：2026-04-23，autoplan 三轮评审 + 用户确认**

| 技术 | 版本/说明 | 用途 |
|------|----------|------|
| Next.js | 14 App Router | 主框架，提供 Server Action 用于 API 转发 |
| TypeScript | 最新稳定版 | 类型安全，游戏状态管理 |
| React | 18+ | UI 组件 |
| Framer Motion | 最新稳定版 | 动画：角色入场、情绪切换、场景转场 |
| Zustand | 最新稳定版 | 游戏全局状态（好感度、剧情进度、AI历史） |
| Claude API | claude-sonnet-4-6 或以上 | AI 角色对话生成 |
| Vercel | Free Tier | 部署（Server Action 解决 Key 安全问题） |
| localStorage | — | 存档（含 AI 历史 JSON，需压缩） |
| JSON | — | 剧情脚本格式 |

### 为什么不用 Ren'Py（重要背景，别再考虑了）

Ren'Py 在 autoplan 评审中被三个独立视角一致否决，原因不可绕过：

1. **技术阻断**：Ren'Py Web 导出跑在 Emscripten/WASM 里，Python 的网络库无法在浏览器 WASM 内建立 TCP 连接。Claude API 调用根本不通，必须加独立后端代理服务器，"零成本"假设崩塌。
2. **动画做不到**：Ren'Py Web 渲染到 `<canvas>`，CSS/Framer Motion 级别的动画无法实现，自定义 UI 需要通过 `emscripten_run_script` 注入 JS，没有文档，极度脆弱。
3. **开发者不熟悉**：开发者有 Web 基础，Ren'Py 的 Python DSL 是新语言 + 新范式。React 反而是熟悉领域。

---

## 五、架构设计

### 5.1 组件依赖图

```
玩家浏览器（React + Framer Motion）
    |
    |-- 游戏状态（Zustand）
    |     |-- 好感度
    |     |-- 剧情进度（当前场景/分支）
    |     |-- AI 对话历史
    |     |-- 存档槽位
    |
    |-- 剧情引擎（JSON 脚本 → React 组件）
    |     |-- 场景渲染
    |     |-- 分支逻辑
    |     |-- 触发条件
    |
    |-- AI 对话层
    |     |-- 调用 Next.js Server Action（/api/claude）
    |     |-- 接收流式响应（streaming）
    |     |-- 情感分析 → 触发立绘情绪变体
    |
    |-- 动画层（Framer Motion）
          |-- 角色立绘入场/退场
          |-- 情绪切换（好感度阈值触发）
          |-- 场景转场
          |-- 文字打字机效果（AI 响应流式显示）

Next.js Server Action（/api/claude）
    |-- Claude API Key（只在服务端，永不暴露）
    |-- 系统 Prompt（角色人设，~800 token）
    |-- 上下文历史（滑动窗口，控制在 2k token 以内）
    |-- 流式转发给浏览器
```

### 5.2 AI 对话状态机（必须实现，不可省略）

```
玩家点击选项
    |
    v
LOADING（显示角色思考动画，禁止输入）
    |
    |-- API 调用开始 ──→ STREAMING（文字逐字出现，typewriter 效果）
    |                        |
    |                        v
    |                    COMPLETE（显示完整响应，启用输入）
    |
    |-- 超时/错误 ──→ ERROR（显示错误状态，不破坏叙事氛围）
    |                    |
    |                    v
    |                FALLBACK（使用预写脚本台词替代）
    |
    |-- 429 ──→ RETRY（指数退避，UI 显示"思考中..."不显示错误）
```

### 5.3 存档结构

```json
{
  "saveSlot": 1,
  "timestamp": "2026-04-23T12:00:00Z",
  "sceneId": "chapter1_scene3",
  "affection": { "kai": 45 },
  "flags": { "revealed_secret": false },
  "aiHistory": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "aiHistoryVersion": 1
}
```

**注意：** aiHistory 随对话增长，单存档可达 30-50KB，30 个存档槽 = 可能达到 localStorage 5MB 上限。需要实现 pruning 策略（保留最近 N 轮，压缩早期历史）。

---

## 六、UI/设计需求

**用户明确要求：自定义前端界面 + 高质量美工 + 动画。**

### 6.1 屏幕清单（待设计，优先级最高）

| 屏幕 | 说明 | 状态 |
|------|------|------|
| 标题屏 | 游戏标题、开始/继续/设置入口 | 待设计 |
| 角色介绍屏 | Demo 版只有 1 个角色，展示人设 | 待设计 |
| 对话主界面 | 背景图 + 角色立绘 + 对话框 + 选项 | 待设计（最复杂） |
| AI 响应状态 | loading/streaming/error/fallback 五态 | 待设计（最关键） |
| 好感度界面 | 当前好感度、解锁进度 | 待设计 |
| 存档/读档屏 | 最多 30 个存档槽 | 待设计 |
| 设置屏 | 音量、文字速度、语言 | 待设计 |
| 结局屏 | Good/Normal/Bad End | 待设计 |
| 错误屏 | 网络错误、API 失败的优雅降级 | 待设计 |

### 6.2 动画需求

| 动画 | 优先级 | 技术方案 |
|------|--------|---------|
| 角色立绘入场（从下滑入） | P0 | Framer Motion `AnimatePresence` |
| 情绪切换（淡入淡出不同立绘） | P0 | Framer Motion `animate` |
| 文字打字机（AI 响应流式） | P0 | 字符逐一渲染，速度可配置 |
| 场景转场（淡出淡入或横扫） | P1 | Framer Motion `variants` |
| 好感度上升动画 | P1 | CSS keyframe 或 Framer Motion |
| 角色说话时微动（idle 动画） | P2 | CSS 微动画，不需要 Live2D |

### 6.3 美工要求

**目标：** 不需要达到恋与深空水准，但需要风格统一、角色辨识度高。

| 资产类型 | 数量 | 方案 |
|---------|------|------|
| 角色立绘 | 5-10 张（含情绪变体） | AI 生成（固定 seed + LoRA + 风格指南）或外包（Pixiv/Lofter，500-2000 RMB/套） |
| 背景图 | 5-8 张 | AI 生成（Midjourney，写实或插画风） |
| UI 图标/装饰 | 若干 | 自绘或免费素材 |
| 背景音乐 | 2-3 首 | AI 生成（Suno/Udio）或 CC0 授权素材 |

**AI 生成美工注意事项：** 必须固定一套工作流（模型 + seed + LoRA 文件）并写成文档，否则第 3 张立绘的鼻子形状就会变。这是 Risk #1，需要在生成第一张图之前就确定工作流。

---

## 七、提示词工程（Claude API）

### 7.1 系统提示词结构（~800 token 预算）

```
你是[角色名]，[人设简介，200字以内]。
你的说话风格：[具体描述，举3-5个例子]。
你和玩家的关系现在是：[当前好感度描述]。
你记得：[玩家在本次对话中透露的关键信息]。
当前场景：[场景名称和氛围]。
约束：
- 每次回应控制在 80-120 字以内
- 不要出戏，不要扮演 AI
- 如果玩家说的话和场景无关，用角色的方式自然引回
```

### 7.2 上下文管理

- 最大输入预算：2,000 token（系统 prompt + 历史 + 当前输入）
- 滑动窗口：保留最近 10 轮对话
- 超出时：压缩早期历史（摘要形式），保留关键记忆标记
- 已在 test-plan.md 中覆盖：10 轮后的窗口滑动测试

---

## 八、测试清单

### 原始测试计划（docs/test-plan.md）

已覆盖：API mock、超时、429、窗口滑动、Key 暴露、prompt injection、存档、Safari、角色记忆、token 预算、并发。

### 补充（autoplan 发现的缺口）

| 测试项 | 优先级 |
|--------|--------|
| 后端代理 auth（Key 永不进浏览器） | P0 |
| 快速点击输入锁（API 调用中不能重复发送） | P0 |
| 断网/飞行模式优雅降级 | P0 |
| AI 历史序列化与反序列化（存档完整性） | P0 |
| localStorage 溢出处理（30 存档 × 50KB） | P1 |
| XSS：Claude 响应注入恶意 HTML | P1 |
| Persona drift 20+ 轮后的角色一致性 | P1 |
| 流式响应中途导航离开（内存泄漏） | P1 |
| 中文文字换行和字体渲染（CSS，非 canvas） | P1 |
| iOS Safari 完整流程 | P1 |

---

## 九、MVP 成功标准

- [ ] 1 条完整路线可在 PC 浏览器流畅游玩（无崩溃，无白屏）
- [ ] AI 对话响应时间 < 5 秒（P95）
- [ ] API Key 通过安全检查（grep + network inspector 均不可见）
- [ ] 存档/读档保留 AI 对话历史
- [ ] 获得 100 名真实玩家反馈
- [ ] 好评率 > 60%

---

## 十、已知风险与缓解

| 风险 | 概率 | 影响 | 缓解方案 |
|------|------|------|---------|
| AI 生成美术风格不一致 | 高 | 高 | 固定 seed+LoRA 工作流，或预算外包 |
| Persona drift（角色声音偏移） | 中 | 高 | 详细系统 prompt + 正则测试套件 |
| 开发周期超期（预计3-6月） | 高 | 中 | 锁定 MVP 范围，砍一切非核心 feature |
| 目标用户不接受 Web 版 | 中 | 高 | MVP 快速验证，100 人反馈 |
| Claude API 成本超预算 | 低 | 中 | 每次调用限 120 字输出 + token 监控 |

---

## 十一、开发者信息

- **开发者**：wei-xie（Java 后端背景，有 Web 开发基础，无游戏开发经验）
- **项目类型**：个人项目，近零成本启动
- **预算**：域名 + Vercel（免费层）+ Claude API 按量计费
- **商业模式（可选）**：免费 Demo + 付费完整路线（买断）

---

## 十二、项目文件结构

```
otome-ai-vn/
├── docs/
│   ├── PROJECT.md          ← 你正在读的这个文件（新 agent 从这里开始）
│   ├── DESIGN.md           ← UI 设计规格（9屏线框图 + AI状态机 + 组件清单）
│   ├── game-plan.md        ← 原始计划 + autoplan 完整决策日志
│   └── test-plan.md        ← 测试计划（原始 + autoplan 补充的10项缺口）
├── script/
│   ├── characters/
│   │   ├── kai-profile.md  ← 凯恒角色圣经（人格/台词规则/识别行为）
│   │   └── kai.json        ← 机器可读数据（Claude 系统提示词/情绪映射）
│   └── ch1/
│       ├── README.md       ← 第一章设计文档（弧光/好感度分支/结局条件）
│       ├── scene01.json    ← 第一幕：偶遇（3个AI节点）
│       ├── scene02.json    ← 第二幕：雨（4个AI节点，含情感高潮）
│       └── scene03.json    ← 第三幕：临走前（好感度三分支结局）
├── assets/
│   ├── backgrounds/        ← 背景图（待生成/外包）
│   └── sprites/            ← 角色立绘（待生成/外包，需7种情绪变体）
│
│   ── 以下为 Next.js 项目文件（初始化后生成）──
├── app/
│   ├── page.tsx            ← 入口，渲染 TitleScreen
│   ├── layout.tsx
│   └── api/claude/route.ts ← Claude API 转发（Key 在服务端）
├── components/
│   ├── GameLayout.tsx      ← 16:9 锁定比例外层容器
│   ├── Background.tsx      ← 全屏背景图切换
│   ├── CharacterSprite.tsx ← 角色立绘 + 情绪动画
│   ├── DialogueBox.tsx     ← 对话框 + 打字机效果
│   ├── ChoicePanel.tsx     ← 预设选项列表
│   ├── AIInputPanel.tsx    ← AI 自由输入框 + 状态机
│   ├── LoadingDots.tsx     ← 三点 loading 动画
│   └── screens/            ← 各屏幕组件
├── lib/
│   ├── gameEngine.ts       ← 脚本解析引擎
│   ├── gameStore.ts        ← Zustand 全局状态
│   └── saveLoad.ts         ← localStorage 存档逻辑
└── package.json            ← Next.js 14, Framer Motion, Zustand, Anthropic SDK

---

## 十三、下一步行动

按优先级排序：

1. ~~**设计 UI 规格和屏幕清单**~~ ✅ 完成 — 见 `docs/DESIGN.md`
   - 9 个屏幕的 ASCII 线框图
   - AI 响应状态机 5 态 UI 规格（loading/streaming/complete/error/fallback）
   - 前 3 分钟体验 Storyboard
   - 组件清单 17 个（P0/P1/P2 优先级）
   - 剧情脚本 JSON 格式规范

2. ~~**写角色人设和第一章剧情脚本**~~ ✅ 完成
   - `script/characters/kai-profile.md` — 角色圣经（人格/说话方式/5个识别行为）
   - `script/characters/kai.json` — 机器可读角色数据（含 Claude 系统提示词）
   - `script/ch1/scene01.json` — 第一幕：偶遇（3个AI对话节点）
   - `script/ch1/scene02.json` — 第二幕：雨（4个AI对话节点，含情感高潮）
   - `script/ch1/scene03.json` — 第三幕：临走前（好感度三分支结局）
   - `script/ch1/README.md` — 章节设计文档

3. **初始化 Next.js 项目** ← 当前进行中
   - 环境：Node 18.19.1，需用 Next.js 14（Next.js 16 要求 Node >=20）
   - 命令：`npx create-next-app@14 . --typescript --tailwind --app --no-eslint --import-alias "@/*" --use-npm`
   - 注意：assets/ 和 script/ 目录会被 create-next-app 报冲突，需先在 /tmp 初始化再复制回来
   - 额外安装：`npm install framer-motion zustand @anthropic-ai/sdk`

4. **搭建 P0 组件骨架**（见 docs/DESIGN.md 组件清单）
   - GameLayout（16:9 锁定）→ Background → CharacterSprite → DialogueBox → AIInputPanel

5. **验证 Claude API 集成**（Next.js Server Action → 流式响应 → 前端显示）

6. **生成第一套美术资产**（确定风格工作流，7种情绪×1角色+8背景图）
