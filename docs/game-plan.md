# 少女乙女恋爱向流程游戏 — 项目计划

<!-- /autoplan restore point: /home/wei-xie/.gstack/projects/frnde-omiwfs-1.0/feature-product_release_stage_merged-autoplan-restore-20260423-120224.md -->

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

## 技术选型（待定）

### 候选方案 A：使用专业 VN 引擎
- **Ren'Py**（Python，导出 PC/Android/Web）
- **Naninovel**（Unity 插件）
- 优点：内置 VN 功能，开发快
- 缺点：开发者 Java 背景，学习曲线陡

### 候选方案 B：Web 原生开发
- **React + TypeScript**：前端逻辑
- **JSON/YAML**：剧情数据定义
- 优点：技术栈熟悉（后端转 web）
- 缺点：需自建 VN 引擎基础功能

### 候选方案 C：现有 Web VN 框架
- **Ink（Inkle Studios）**：叙事脚本语言
- **Twine**：可视化交互故事工具
- **Narrat**：专为 Web 设计的 VN 框架

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

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|---------|
| 1 | CEO | Mode: SELECTIVE EXPANSION | Mechanical | P1 | 计划有明确方向，需补全缺口 | SCOPE EXPANSION |
| 2 | CEO | 方案选择: Ren'Py + Claude API | Mechanical | P1+P3+P5 | 最快到可玩demo，处理VN基础设施 | React自建, 纯AI伴侣 |
| 3 | CEO | 启用跨项目learnings | Mechanical | P1 | 完整性：更多上下文 | 项目隔离 |
| 4 | CEO | 前提2（玩家偏好）标记为未验证 | Mechanical | P6 | 需要demo验证，不能假设 | 接受假设继续 |
| 5 | CEO | 发布渠道(§7)标记为关键缺口 | Mechanical | P2 | blast radius内，无额外infra | 忽略 |

---

## GSTACK REVIEW REPORT

| Review | Runs | Status | Findings |
|--------|------|--------|---------|
| CEO Review | 0 | NO REVIEWS YET | — |
| Codex Review | 0 | NO REVIEWS YET | — |
| Eng Review | 0 | NO REVIEWS YET | — |
| Design Review | 0 | NO REVIEWS YET | — |
| DX Review | 0 | NO REVIEWS YET | — |

Verdict: **NO REVIEWS YET — run `/autoplan`**
