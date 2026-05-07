# 图片资源放置索引

所有要人工生成/绘制的资源都在本目录下的 5 个子目录里，按类型归类。每个子目录里都有一份 `PLACE_HERE.md`，告诉你那个目录需要哪几张图、文件名怎么取、放完之后还要不要改 JSON。

## 一句话索引

| 子目录 | 内容 | 数量 | 改 JSON？ |
|--------|------|------|----------|
| [`icons/`](./icons/PLACE_HERE.md) | 5 个技能 icon（SVG） | 5 | 是，改 `script/skills/definitions.json` 里 `icon.status` |
| [`cg/ch1/`](./cg/ch1/PLACE_HERE.md) | 第一章技能 CG（PNG） | 4 | 是，改对应 scene 里 line 的 `image.status` |
| [`sprites/kai/`](./sprites/kai/PLACE_HERE.md) | 凯恒 7 个情绪立绘（透明 PNG） | 7 | 否 |
| [`backgrounds/`](./backgrounds/PLACE_HERE.md) | 第一章 3 个场景背景（JPG） | 3 | 否 |
| [`bgm/`](./bgm/PLACE_HERE.md) | 第一章 3 段 BGM（MP3） | 3 | 否 |

合计 **22 项资源**（图 19 张 + BGM 3 段），全部 pending。

## 路径换算（避免踩坑）

剧本/技能定义 JSON 里写的路径都是**相对于 web 根**的，例如：

```json
"image": { "path": "assets/cg/ch1/s01_kai_finger_cup.png" }
```

对应项目里**物理文件路径**是：

```
public/assets/cg/ch1/s01_kai_finger_cup.png
```

也就是说：**JSON 里写的 `assets/...`，物理上要放到 `public/assets/...`**。Next.js 把 `public/` 当 web 根。

## 详细 prompt 在哪

`docs/skill-image-assets.md` —— 每张图都有中英双语生图 prompt + 风格备注。

## 规格通用约束

参考 `docs/DESIGN.md` §1.1：

- **主色调**：深樱花色 `#2D1B26` + 暖米白 `#F5ECD7` + 玫红 `#C9506A`
- **画风**：写实偏氛围，不卡通；电影感构图、自然景深、暖色调为主
- **避免**：浓艳饱和、夸张卡通、过曝高光、明显特效线

## 放图顺序建议（按对玩家的可见度排）

1. **凯恒 7 张立绘** — 影响所有对话节点，最优先
2. **3 张场景背景** — 影响所有场景观感
3. **5 个技能 icon** — 影响 ChoicePanel 选项标签
4. **4 张技能 CG** — 只在特定技能选项触发，最后做也不影响主线
5. **3 段 BGM** — 体验加分项，可以最后
