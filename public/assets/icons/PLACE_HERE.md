# 把这些 icon 放在本目录

技能选项前的小标签，5 张。详细 prompt 见 [docs/skill-image-assets.md](../../../docs/skill-image-assets.md) §一。

| 文件名 | 技能 | 占位状态 |
|--------|------|----------|
| `skill_observe.svg` | 观察 | pending |
| `skill_empathy.svg` | 共情 | pending |
| `skill_probe.svg` | 追问 | pending |
| `skill_boundary.svg` | 边界感 | pending |
| `skill_direct.svg` | 直球 | pending |

## 放完后做什么

1. 文件丢到本目录（保持文件名一致）
2. 改 `script/skills/definitions.json` 和 `public/script/skills/definitions.json` 里对应 `icon.status` 从 `"pending"` 改成 `"ready"`
3. 不需要动任何代码

## 规格

- SVG，单色描边，24×24 视觉尺寸
- 颜色不重要（CSS 会染成 `#C9506A`），主要看形状能在深色背景看清

---

## 出图后填表

成功落地后，除了上面"放完后做什么"里要改的 `definitions.json` `icon.status`，也请把本表对应行的 `pending` 改成 `ready`，并在文件名旁边备注作者/工具来源（便于后续替换或风格统一）：

```
| `skill_observe.svg` | 观察 | ready · 自绘 / Figma |
```
