# 把这些 CG 放在本目录

第一章技能节点触发的特写画面，4 张。详细 prompt 见 [docs/skill-image-assets.md](../../../../docs/skill-image-assets.md) §二。

| 文件名 | 触发场景 | 触发节点 | 占位状态 |
|--------|---------|---------|----------|
| `s01_kai_finger_cup.png` | scene01 | `s01_kai_question2`（凯恒问"最近还好吗"前的旁白） | pending |
| `s01_kai_hand_stop.png` | scene01 | `s01_observe_extra`（[观察] Lv1 解锁选项触发） | pending |
| `s02_quiet_understanding.png` | scene02 | `s02_empathy_moment`（[共情] 选项触发） | pending |
| `s03_kai_back_red_ear.png` | scene03 | `s03_good_end4`（Good End 收尾） | pending |

## 放完后做什么

1. 文件丢到本目录（保持文件名一致）
2. 改 `script/ch1/scene0*.json` 和 `public/script/ch1/scene0*.json` 对应 line 的 `image.status` 从 `"pending"` 改成 `"ready"`
3. 不需要动任何代码——`GameLayout` 已经在 `image.status === "ready"` 时自动叠加显示

## 规格

- PNG，16:9，建议 1920×1080 或更高
- 写实/电影感，暖色调；避免卡通和过曝
- 详细风格基调见 `docs/DESIGN.md` §1.1

---

## 出图后填表

成功落地后，除了上面"放完后做什么"里要改的 JSON `image.status`，也请把本表对应行的 `pending` 改成 `ready`，并在文件名旁边备注实际生成模型与种子（便于同风格补图）：

```
| `s01_kai_finger_cup.png` | scene01 | `s01_kai_question2`（凯恒问"最近还好吗"前的旁白） | ready · MJ v6 / seed 12345 |
```
