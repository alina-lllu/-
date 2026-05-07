# 把这些立绘放在本目录

凯恒的 7 张情绪立绘，是整个游戏对话主界面最常出现的资源。详细 prompt 见 [docs/skill-image-assets.md](../../../../docs/skill-image-assets.md) §三 和 [script/characters/kai-profile.md](../../../../script/characters/kai-profile.md) §情绪立绘状态。

| 文件名 | 情绪标签 | 触发场景 | 占位状态 |
|--------|---------|---------|----------|
| `kai_neutral.png` | neutral | 默认/日常对话 | pending |
| `kai_thinking.png` | thinking | 等待/思考/AI 响应中 | pending |
| `kai_attentive.png` | attentive | 认真倾听玩家说话 | pending |
| `kai_slight_smile.png` | slight_smile | 玩家说了出乎他意料的话 | pending |
| `kai_distant.png` | distant | 触碰到他的伤口 | pending |
| `kai_caught.png` | caught | 玩家问到他意想不到的问题 | pending |
| `kai_warm.png` | warm | 好感度高时，私下相处 | pending |

## 放完后做什么

1. 文件丢到本目录（保持文件名一致，路径已经写在 `script/characters/kai.json` 的 `sprites` 里）
2. **不需要改 JSON**——这一批和 CG/icon 不一样，没有 `status` 字段，路径直接生效
3. 不需要动任何代码

## 规格

- PNG 透明背景，9:16 半身或全身（推荐 1080×1920）
- 同一姿势/服装/光照，仅表情和眼神变化（情绪切换时不跳）
- 风格基调见 `docs/DESIGN.md` §1.1

---

## 出图后填表

立绘没有 JSON 里的 `status` 字段（路径直接生效），但请把本表对应行的 `pending` 改成 `ready`，并在文件名旁边备注实际生成模型与种子（便于同风格补图、补情绪）：

```
| `kai_neutral.png` | neutral | 默认/日常对话 | ready · MJ v6 / seed 12345 |
```
