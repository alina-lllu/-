# 把这些背景放在本目录

第一章场景背景，3 张。当前游戏在没有背景图时已经有 `SceneBackground` 组件做程序化绘制（见 `components/SceneBackground.tsx`），所以这一批属于"有更好，没有也能跑"。

| 文件名 | 用在场景 | 占位状态 |
|--------|---------|----------|
| `cafe_afternoon.jpg` | scene01（深秋午后咖啡馆） | pending |
| `cafe_rain.jpg` | scene02（同一家咖啡馆，雨天） | pending |
| `cafe_exit_evening.jpg` | scene03（咖啡馆门口，傍晚） | pending |

## 放完后做什么

1. 文件丢到本目录（保持文件名一致，路径已经写在 `script/ch1/scene0*.json` 的 `background` 字段里）
2. 不需要动任何代码——`Background` 组件会优先用图片，找不到再回退到程序化背景

## 规格

- JPG，16:9，建议 2560×1440
- 不要有人物，仅环境
- 风格基调见 `docs/DESIGN.md` §1.1
- 调色板锚点：深樱花色 `#2D1B26`、暖米白 `#F5ECD7`、玫红 `#C9506A`（出现在窗外、灯罩、椅垫等点缀处即可，不要喧宾夺主）
- 视觉中线（角色立绘会落在画面中偏右）请保持负空间，不要把视觉重心堆在右侧 1/3
- 画面下方约 30% 处会被对话框遮住，主要叙事元素往中上部安排

---

## 通用风格 prompt（拼在每张前面）

**中文**

> 日式乙女 galgame 视觉小说背景插画，电影感构图，柔和的赛璐璐+厚涂混合，写实环境质感但保留手绘笔触；细腻的体积光与空气感；干净构图，不要任何人物、不要文字、不要 UI、不要水印；16:9 横构图 2560×1440；浅景深，主体清晰，远景轻度虚化；色彩克制内敛，整体偏深樱花色 #2D1B26 与暖米白 #F5ECD7 的氛围基调，玫红 #C9506A 作为点缀色。

**English**

> Japanese-style otome / visual-novel background illustration, cinematic composition, soft cel-shading mixed with painterly textures, realistic environment but with visible brushwork; delicate volumetric light and atmospheric haze; clean uncluttered framing, NO people, NO characters, NO text, NO UI, NO watermark; 16:9 horizontal, 2560×1440; shallow depth of field with subtle background blur; restrained palette anchored on deep sakura `#2D1B26` and warm cream `#F5ECD7`, with rose `#C9506A` only as small accent.

---

## 1. `cafe_afternoon.jpg` — scene01 深秋午后咖啡馆（室内·靠窗座位）

**剧本要点**：阳光从玻璃窗斜切进来照亮木桌；靠窗的位子；翻开的书放在桌上；窗外梧桐叶被风吹落几片；BGM 是 `warm_afternoon.mp3`。

**中文 prompt**

> 深秋午后的小型独立咖啡馆室内，从靠窗的二人桌视角望过去：温暖的阳光以约 30° 斜切角从画面左侧大玻璃窗洒进来，在原木色长桌上拉出一道清晰的光带，可见漂浮的细小尘埃在光里游动；桌面是有岁月感的橡木，靠近窗边放着一本翻开的精装书（不要写出书名）、一只白瓷咖啡杯、一只小陶罐插着两枝深红色枯叶；窗外可以看到一棵梧桐树，金黄与赭红的叶子，几片正被风吹落；远处街道用大焦外光斑虚化处理；室内墙面是奶咖色与暖米白 #F5ECD7，木质书架上摆着旧书与小绿植；整体色调暖琥珀+蜂蜜金，光比柔和，阴影偏紫红 #2D1B26；电影画幅 16:9，胶片质感的微微噪点，淡淡漏光；安静、私密、文学感；不要人物，不要文字招牌，不要 logo。

**English prompt**

> Interior of a small independent café on a late-autumn afternoon, viewed from a window-side two-person table: warm sunlight cuts in from a large window on the left at roughly a 30° angle, drawing a clear band of light across a long oak table, with fine dust motes drifting visibly through the beam; the wooden tabletop shows soft age, with an opened hardcover book (no readable title) near the window, a single white porcelain coffee cup, and a small ceramic pot holding two dried crimson leaves; outside the window, a Chinese parasol tree with golden-amber and rust-red foliage, a few leaves caught mid-fall in the breeze; the distant street dissolved into large bokeh; interior walls in milky cream `#F5ECD7`, a wooden bookshelf with old books and a small potted plant; overall palette in warm amber and honey-gold, soft contrast, shadows tinted toward deep sakura `#2D1B26`; cinematic 16:9, subtle film grain and faint lens flare; quiet, intimate, literary mood; no people, no readable signage, no logo.

---

## 2. `cafe_rain.jpg` — scene02 同一家咖啡馆·雨天（室内·光线变暗）

**剧本要点**：同一家咖啡馆，但窗外开始下雨；天色变暗；室内壁灯/吊灯亮起来；BGM 是 `rain_outside.mp3`。要和 scene01 是"同一空间"的可识别延续。

**中文 prompt**

> 与上一张同一家咖啡馆室内、同样的靠窗二人桌视角，但时间往后推、外面下起了雨：天光被压暗，窗外是灰蓝色的雨幕，玻璃上有清晰的水痕和顺势滑落的水滴，远处街道仅剩朦胧的暖色橱窗光晕；室内壁灯与吊灯刚亮起，灯罩是黄铜+暖米白 #F5ECD7 玻璃罩，洒下小范围的蜂蜜色光池，与窗外冷蓝形成强烈对比；木桌上仍是那本翻开的书、白瓷咖啡杯（杯口有淡淡热气）、桌角一只玫红 #C9506A 色的小陶杯作为点缀；木地板隐约反射出灯光；色调主基调蓝灰 + 局部暖橘 + 阴影偏深樱花 #2D1B26；空气里有水汽感，画面带电影感的微弱蓝青阴影 + 暖光高光；16:9 横构图，胶片质感；安静克制、被雨困住的温柔感；不要人物，不要文字，不要 logo。

**English prompt**

> Same café interior as the previous image, same window-side two-person table viewpoint, but time has shifted and rain has begun outside: the daylight has dimmed, the window now shows a curtain of cool blue-grey rain, with clear streaks and droplets sliding down the glass, the distant street reduced to soft warm shop-window halos; inside, the wall sconces and a hanging pendant have just been switched on, brass fittings with warm cream `#F5ECD7` glass shades casting tight pools of honey-colored light that contrast strongly against the cold blue outside; on the wooden table, the same opened book, a white porcelain cup with a faint thread of steam, and a small rose-pink `#C9506A` ceramic cup at the corner as a single accent; the wooden floor faintly reflects the lamps; overall palette: blue-grey dominant, warm orange in pockets, shadows tinted deep sakura `#2D1B26`; humid atmosphere, cinematic teal-and-orange micro-grading; 16:9 horizontal, subtle film grain; quiet, restrained, the tenderness of being held in place by rain; no people, no text, no logo.

---

## 3. `cafe_exit_evening.jpg` — scene03 咖啡馆门口·傍晚（室外·雨后）

**剧本要点**：雨刚停；天色暗下来；街角咖啡馆门口；路灯亮起；地面湿润反光；秋天梧桐落叶；这是 Good End CG 的舞台，要"安静、清冷、有一点点期待"的氛围。

**中文 prompt**

> 雨后初晴的傍晚，街角一家温馨小咖啡馆的门口，从街对面玩家视角斜望过去：天空是深紫到墨蓝的渐变，几颗最早的星点缀其间；咖啡馆是两层的米色老建筑，落地窗里透出暖黄的灯光与隐约的木质内饰，木门上方挂着一盏黄铜壁灯（不要任何文字招牌或 logo），门口台阶下摆着一块小黑板架（板面留白）和一盆秋色绿植；街道是青石板路面，因为刚下过雨而湿润反光，把路灯的暖光、橱窗的金光拉成长长的水面倒影；画面左侧立着一根锈黑色的复古路灯，发出蜂蜜金色的光晕，光晕里能看到悬浮的细小水汽；地上散落着几片金色与赭红的梧桐叶，其中一两片正被晚风轻轻掀起；整体色调：深紫蓝夜色 + 暖橘黄灯光 + 深樱花 #2D1B26 阴影 + 一点玫红 #C9506A 点缀（如门内座椅或窗帘）；电影感 16:9 横构图，画面下半部留出空旷的湿润街面以承载对话框；安静、清冷、带一丝克制的期待感；不要人物、不要文字、不要 logo、不要可读招牌。

**English prompt**

> Early evening just after the rain has stopped, looking diagonally from across the street at the entrance of a small warm corner café: the sky is a gradient from deep violet to ink-blue with a few of the earliest stars; the café is a two-story old cream-colored building, large floor-to-ceiling windows glowing with warm amber light and hinting at wooden interiors, a brass wall sconce above the wooden door (NO signage text, NO logo), a small empty A-frame chalkboard at the bottom of the steps and a single autumnal potted plant; the street is wet flagstone, freshly rained on, mirroring the lamp and shop-window glow into long liquid reflections; on the left edge of the frame stands a tall vintage cast-iron streetlamp in rust-black, casting a honey-gold halo with fine mist hanging visibly inside it; a few golden and rust-red Chinese parasol leaves scatter on the wet pavement, one or two lifted by a soft evening breeze; overall palette: deep violet-blue night, warm orange-gold lamps, shadows tinted deep sakura `#2D1B26`, with a single rose `#C9506A` accent (e.g. an interior chair or curtain glimpsed through the window); cinematic 16:9, leaving the lower half of the frame as open wet pavement to host the dialogue box; quiet, cool, with a thin restrained note of anticipation; no people, no text, no logo, no readable signage.

---

## 出图后填表

成功落地后，把上面表格里对应行的 `pending` 改成 `ready`，并在文件名旁边备注实际生成模型与种子（便于同风格补图）：

```
| `cafe_afternoon.jpg` | scene01（深秋午后咖啡馆） | ready · MJ v6 / seed 12345 |
```
