# 少女乙女恋爱向流程游戏 — 项目计划

<!-- /autoplan restore point: /home/wei-xie/.gstack/projects/otome-ai-vn/master-autoplan-restore-20260423-121923.md -->

## 概念概述

面向女性玩家的恋爱向视觉小说/流程游戏（Otome Visual Novel）。玩家扮演女主角，与多位男性角色发展感情，推进剧情。

## 核心功能需求

### 游戏机制
- **多路线剧情系统**：2-4 位男性角色，每位有独立恋爱路线（约 3-5 章节/路线）
- **好感度系统**：玩家选择影响角色好感度，触发不同事件和结局
- **分支对话**：关键节点提供 2-3 个对话选项，影响剧情走向
- **多结局**：每条路线有 Good End / Normal End / Bad End
- **章节解锁**：按顺序解锁剧情，或满足条件后解锁隐藏路线

### 内容规模（MVP 目标）
- 1 条完整路线（作为 Demo）
- 约 30,000-50,000 字文本
- 5-10 张立绘（角色图）
- 5-8 张背景图
- 背景音乐 2-3 首

### 技术需求
- **目标平台**：Web 优先（浏览器可玩），后续考虑移动端
- **存档系统**：本地存档（localStorage）或云存档
- **语言**：中文界面
- **响应式布局**：支持桌面和平板

## 技术选型（已确定）

**选定方案：React + TypeScript + Next.js**（autoplan 评审后决定，2026-04-23）

| 技术 | 用途 |
|------|------|
| Next.js 14 App Router | 框架，API Route 用于 Claude API 转发（Key 不暴露） |
| TypeScript | 类型安全，游戏状态管理 |
| Framer Motion | 角色立绘入场/情绪切换/场景转场动画 |
| Zustand | 游戏状态（好感度、剧情分支、AI对话历史） |
| Claude API via Next.js Server Action | AI对话，Key在服务端，从不进浏览器 |
| JSON | 剧情脚本格式（场景、分支、触发条件） |
| Vercel | 部署（免费层覆盖MVP） |
| localStorage | 存档（含AI对话历史，含压缩策略） |

**放弃 Ren'Py 的原因（不可绕过的技术阻断）：**
- Ren'Py Web 导出在 Emscripten/WASM 中，Python 网络库无法建立 TCP 连接，Claude API 调用根本不通
- 动画需求（自定义 CSS/Framer Motion）在 Ren'Py canvas 渲染模型中无法实现
- API Key 无法在 Ren'Py Web bundle 中安全存放

### ~~候选方案 A（已排除）~~
- Ren'Py：WASM网络限制+自定义UI困难，技术阻断，排除

### ~~候选方案 C（已排除）~~
- Narrat：可行但生态小，文档少，开发者优势不明显

## 开发团队

- **开发者**：1 人（wei-xie，Java 后端出身，无游戏开发经验，有 Web 开发基础）
- **美术**：AI 生成或外包（预算有限）
- **剧本**：自行撰写

## 预算与时间

- **预算**：个人项目，近零成本启动（域名 + 托管 ~100元/年）
- **目标**：3-6 个月内完成 MVP（单路线 Demo）
- **商业模式**（可选）：免费基础 + 付费完整路线（买断制）

## 目标用户

- 中国大陆/台湾/华语圈女性玩家，18-30 岁
- 有乙女游戏基础（玩过恋与深空、光与夜之恋等）
- 偏好有深度剧情的独立游戏

## 竞品分析

| 产品 | 类型 | 优势 | 劣势 |
|------|------|------|------|
| 恋与深空 | 3D 手游 | 高质量、沉浸感强 | 重度付费，氪金压力大 |
| 光与夜之恋 | 2D 手游 | 剧情优秀 | 已进入中期，更新慢 |
| 皇室恋情 | 海外乙女 | 英文市场 | 非中文 |
| 独立 VN（itch.io）| Web/PC | 多样性强 | 质量参差 |

**差异化机会**：中文独立乙女游戏市场空白较大，中小团队/个人作品有生存空间。

## 风险

1. 美术资源获取（AI 生成风格一致性问题）
2. 剧本质量（非专业写手）
3. 技术选型学习成本
4. 完成率（个人项目容易烂尾）

## 成功标准（MVP）

- [ ] 完成 1 条完整路线，可在浏览器游玩
- [ ] 获得 100 名玩家的真实反馈
- [ ] 好评率 > 60%

---

## P0 实现完成状态（2026-04-23）

P0 全部完成，编译零错误，dev server HTTP 200。

### 已实现

| 模块 | 文件 | 状态 |
|------|------|------|
| 类型定义 | `lib/types.ts` | ✅ Emotion×7, AIResponseState×6, ScriptLine union |
| 游戏状态 | `lib/gameStore.ts` | ✅ Zustand+persist, aiHistory 滑动窗口20条 |
| 游戏引擎 | `lib/gameEngine.ts` | ✅ 场景加载、分支、顺序fallback、情绪检测 |
| 存档系统 | `lib/saveLoad.ts` | ✅ localStorage, quota fallback, slot 0=自动存档 |
| API 路由 | `app/api/claude/route.ts` | ✅ SSE流式, haiku-4-5, max_tokens=200 |
| 主控制器 | `components/GameLayout.tsx` | ✅ 场景/行加载, AI提交, 情绪同步 |
| 背景组件 | `components/Background.tsx` | ✅ AnimatePresence crossfade 0.8s |
| 角色立绘 | `components/CharacterSprite.tsx` | ✅ fade+slide入场, 自动路由到KaiCharacter |
| 对话框 | `components/DialogueBox.tsx` | ✅ AI状态感知, loading dots, ▼指示 |
| 选项面板 | `components/ChoicePanel.tsx` | ✅ stagger动画 |
| AI输入框 | `components/AIInputPanel.tsx` | ✅ Enter发送, Shift+Enter换行, 状态禁用 |
| 凯恒立绘 | `components/KaiCharacter.tsx` | ✅ SVG 300×860, 7情绪, Framer Motion动画 |
| 场景背景 | `components/SceneBackground.tsx` | ✅ 3个SVG场景(午后/雨天/傍晚), 动画粒子/雨滴 |
| 第一章脚本 | `public/script/ch1/` | ✅ scene01+02, 凯恒角色数据 |

### P0 已知缺口（下轮修复）

- 无标题屏（直接进入游戏）
- 无顶栏（无法手动存档，调试HUD替代）
- 无章节结算/结局屏
- 无BGM
- 未部署到Vercel

---

## P1 开发计划（当前评审对象）

### 优先级排序（对玩家体验影响从高到低）

| 优先级 | 功能 | 组件 | 估计复杂度 |
|--------|------|------|-----------|
| P1-A | 标题屏 | `TitleScreen.tsx` | 中（含存档检测） |
| P1-A | 顶栏（存档/菜单） | `TopBar.tsx` | 中 |
| P1-A | 章节结局屏 | `EndingScreen.tsx` | 中（含统计数据） |
| P1-B | 存档/读档屏 | `SaveLoadScreen.tsx` | 高（UI复杂） |
| P1-B | BGM系统 | 内嵌于GameLayout | 中（HTML Audio API） |
| P1-C | 好感度详情屏 | `AffinityScreen.tsx` | 低（展示为主） |
| P1-C | 设置屏 | `SettingsScreen.tsx` | 中（状态持久化） |
| P1-C | 错误屏 | `ErrorScreen.tsx` | 低 |
| P1-D | 第二章剧情 | `script/ch2/` | 高（内容创作） |
| P1-D | Vercel部署 | CI/CD config | 低（一次性） |

### 技术约束（继承自P0）

- Node 18.19.1 → 只能用 Next.js 14
- localStorage 5MB 上限 → AI历史必须控制
- SVG 纯代码美术（不依赖外部图片文件）
- API Key 永不进前端

---

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|---------|
| 1 | CEO | Mode: SELECTIVE EXPANSION | Mechanical | P1 | 计划有明确方向，需补全缺口 | SCOPE EXPANSION |
<!-- P1 autoplan decisions below -->
| 13 | CEO | Vercel 部署提前到 P1-A（非 P1-D）| Mechanical | P1+P2 | 未部署=无法收集玩家反馈，MVP目标100人无法达成 | 保留在P1-D |
| 14 | CEO | 添加 Vercel Analytics + 第一个分享URL附带WeChat问卷 | Mechanical | P1 | 反馈收集机制完全缺失，MVP成功标准无法度量 | 忽略 |
| 15 | Eng | `export const runtime = 'nodejs'` 立即写入 route.ts | Mechanical | P1 | BLOCKER：Vercel默认10s超时会截断SSE流 | 等部署时再加 |
| 16 | Eng | res.body !== null 检查 + reader null guard | Mechanical | P1 | 非null断言在部分浏览器/条件下会崩溃 | 保留! |
| 17 | Eng | 添加简易内存 rate limiter（Map + 10次/分钟）| Mechanical | P3 | API Key无保护，恶意调用会耗尽额度 | 无限制 |
| 18 | Eng | Zustand hydration boundary（useEffect 等待 hydrate）| Mechanical | P1 | SSR/CSR不一致保证白屏，必须加边界 | 忽略 |
| 19 | Eng | loadScene 添加 in-memory Map 缓存 | Mechanical | P3 | 重复加载同场景产生无意义网络请求 | 无缓存 |
| 20 | Design | ChoicePanel 处理 ai_input option 为内嵌展开（非独立屏）| Mechanical | P5 | 预设选项+AI输入必须并列显示，设计文档明确要求 | 独立AIInputPanel屏 |
| 21 | Design | Error state D 脱离 fallback：独立 'error' 状态 + 重试/换话题按钮 | Mechanical | P1 | 当前所有错误直接走 fallback，error 状态永远不触发 | 保留fallback覆盖 |
| 22 | Design | 角色立绘在 choices 期间保持可见（移除 !isChoice 条件）| Mechanical | P5 | 玩家选择时凯恒情绪是关键情感节点，隐藏是错误 | 继续隐藏 |
| 23 | Design | 情绪检测提前到流式前20字（非完成后）| Mechanical | P1 | 响应完成后切情绪=设计文档明确要求的实时感消失 | 保留完成后 |
| 24 | Design | DialogueBox 添加打字机效果（msPerChar 可配置）| Mechanical | P1 | SettingsScreen 文字速度滑块无法实现的前提=打字机存在 | 保留即时显示 |
| 25 | Design | TitleScreen 作为路由门控（page.tsx 检查 hasSeenTitle flag）| Mechanical | P1 | 无标题屏=任何用户分享URL后新访客直接进入对话感到困惑 | 保持直接进入 |
| 26 | Design | SaveLoadScreen 截图缩略图：DROP（改为场景图标+时间戳）| Mechanical | P3 | html2canvas 是未审查的依赖，对MVP无已验证价值 | 保留缩略图 |
| 27 | Design | BGM AudioContext 在 TitleScreen "开始游戏" 点击时初始化 | Mechanical | P5 | iOS/Chrome 禁止无用户手势的 audio.play()，将静默失败 | 组件挂载时播放 |
| 28 | Eng | layout.tsx 添加 viewport meta（width=device-width, initial-scale=1）| Mechanical | P5 | 缺失会导致移动端缩放异常 | 保持现状 |
| 2 | CEO | 方案选择: Ren'Py + Claude API | Mechanical | P1+P3+P5 | 最快到可玩demo，处理VN基础设施 | React自建, 纯AI伴侣 |
| 3 | CEO | 启用跨项目learnings | Mechanical | P1 | 完整性：更多上下文 | 项目隔离 |
| 4 | CEO | 前提2（玩家偏好）标记为未验证 | Mechanical | P6 | 需要demo验证，不能假设 | 接受假设继续 |
| 5 | CEO | 发布渠道(§7)标记为关键缺口 | Mechanical | P2 | blast radius内，无额外infra | 忽略 |
| 6 | CEO | 架构核心定位：AI对话是产品本体，非feature | User Confirmed | — | 用户在前提门明确确认 | 当作附加功能处理 |
| 7 | Eng | Ren'Py WASM无法直接调用Claude API → 必须backend proxy | Mechanical | P1 | BLOCKER级，技术栈问题 | 忽略/假设能调通 |
| 8 | Eng | API Key不能打包进web bundle → 必须服务端转发 | Mechanical | P1 | 安全硬性要求 | 客户端直调 |
| 9 | Design | AI响应状态机（loading/streaming/error/fallback）必须设计 | Mechanical | P1 | 核心交互路径，缺失=产品失败 | 上线后再加 |
| 10 | CEO+Design+Eng | Ren'Py与产品需求矛盾（自定义UI+动画+异步API） | USER CHALLENGE | — | 三个独立评审均指向同一问题 | 维持Ren'Py |
| 11 | Phase 4 Gate | 技术栈从Ren'Py换为React+TypeScript+Next.js | User Confirmed | P1+P5 | 用户接受全部三阶段的评审建议 | 坚持Ren'Py |
| 12 | Phase 4 Gate | 下一步：先设计UI规格和屏幕清单 | User Confirmed | P5 | 设计先行，避免边实现边改架构 | 直接开始写代码 |

---

## GSTACK REVIEW REPORT

| Review | Runs | Status | Findings |
|--------|------|--------|---------|
| CEO Review | 1 | issues_open | 2 critical, 3 high, 1 medium — 技术栈与产品定位矛盾 |
| Design Review | 1 | issues_open | 2 critical (UI规格缺失, AI状态机缺失), 3 high |
| Eng Review | 1 | issues_open | 2 blocker (WASM+API key), 1 critical, 2 high |
| DX Review | 0 | skipped | 非开发者工具产品，跳过 |
| Voices | 1 | subagent-only | Codex不可用，Claude子代理×3完成 |

**跨阶段共识主题（3个独立评审均发现）：**
1. Ren'Py与自定义UI+动画+异步Claude API需求根本矛盾 → USER CHALLENGE
2. AI响应状态机（loading/streaming/error）完全缺失 → CRITICAL
3. 后端代理层是架构必须项，计划中完全不存在

Verdict: **NEEDS DECISION — 见Phase 4决策门**
