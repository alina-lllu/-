# 把这些角色基准参考图放在本目录

凯恒的「角色锁定包」，是整个游戏视觉一致性的根。**这 4 张必须最先出**，之后所有立绘和 CG 接单时，都要把对应的参考图作为 reference image 一并喂给 AI 或画手——不能只发文字 prompt，否则跨画面/跨画手/跨 batch 的脸型、手型、服装一定会漂。

详细 prompt 见 [docs/skill-image-assets.md](../../../../docs/skill-image-assets.md) §零。

| 文件名 | 用途 | 下游强依赖 | 占位状态 |
|--------|------|-----------|----------|
| `kai_turnaround.png` | 三视图：脸型 / 发型 / 身高比例锚点 | 所有立绘 + 所有带脸/带身体的 CG | pending |
| `kai_costume_sheet.png` | 三套服装设定（白衬衫 / 炭灰毛衣 / 长款大衣） | CG1/CG2 用白衬衫，CG3 用炭灰毛衣，CG4 用长款大衣，全部立绘用白衬衫 | pending |
| `kai_hand_study.png` | 手部专项（4 个角度） | CG1（指尖转杯）+ CG2（手骤停）+ 之后所有手部出镜 | pending |
| `kai_expression_sheet.png` | 7 个情绪表情合集 | 7 张立绘的情绪锚点（neutral / thinking / attentive / slight_smile / distant / caught / warm） | pending |

## 接单顺序（硬性要求）

1. **先出 `kai_turnaround.png`** → 锁脸型/发型/身高
2. **同步出 `kai_costume_sheet.png` 和 `kai_expression_sheet.png`** → 锁服装与情绪
3. **再出 `kai_hand_study.png`** → 锁手型与骨相
4. **以上 4 张全部 ready 后**，才能开始接 §二 CG 和 §三 立绘的单

## 放完后做什么

1. 文件丢到本目录（保持文件名一致）
2. 在 `docs/skill-image-assets.md` §零 把对应行的 `状态` 从 `pending` 改成 `ready`
3. 同步把 §四 汇总进度表的数字更新一下
4. 不需要改任何 JSON 或代码——这一批是「上游参考」，不会被运行时加载

## 规格

- PNG，灰底 #6B6B6B（无纹理、无氛围光，专门给画手/AI 当参考用）
- 尺寸见 §零 各条目「规格」字段（基本是 3:1 横版）
- 写实电影感画风，与最终 CG/立绘风格一致；只是光照统一为均匀柔光以便看清结构
- 三视图 / 服装 / 手部 / 表情合集都需要在图下加小标签文字标注每个分图的名字

---

## 出图后填表

成功落地后，除了上面"放完后做什么"里要改的 `docs/skill-image-assets.md` §零 状态，也请把本表对应行的 `pending` 改成 `ready`，并在文件名旁边备注实际生成模型与种子（便于补图与同风格延伸）：

```
| `kai_turnaround.png` | 三视图：脸型 / 发型 / 身高比例锚点 | 所有立绘 + 所有带脸/带身体的 CG | ready · MJ v6 / seed 12345 |
```
