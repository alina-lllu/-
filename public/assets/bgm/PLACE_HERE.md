# 把这些 BGM 放在本目录

第一章场景音乐，3 段。MVP 阶段不放也能跑，纯背景音补足氛围。

| 文件名 | 用在场景 | 占位状态 |
|--------|---------|----------|
| `warm_afternoon.mp3` | scene01 | pending |
| `rain_outside.mp3` | scene02（建议混入雨声） | pending |
| `quiet_evening.mp3` | scene03 | pending |

## 放完后做什么

1. 文件丢到本目录（保持文件名一致，路径已经写在 `script/ch1/scene0*.json` 的 `bgm` 字段里）
2. 当前 BGM 播放组件还没接入，等做的时候会自动从 scene.bgm 读路径

## 规格

- MP3，循环友好（首尾衔接平滑）
- 时长 1-3 分钟即可，loop 即可
- 音量已经在前端设置里有调节，原始素材不要太响

---

## 出图后填表

成功落地后，把上面表格里对应行的 `pending` 改成 `ready`，并在文件名旁边备注实际生成模型与种子（便于同风格补曲）：

```
| `warm_afternoon.mp3` | scene01 | ready · Suno v4 / seed 12345 |
```
