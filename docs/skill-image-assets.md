# 技能系统 · 图片资源需求清单

> 本文档汇总「技能系统第一版」涉及的所有图片资源占位。所有占位都已写入对应 JSON 的 `image` 字段，状态为 `"status": "pending"`。
>
> **接单流程**：
>
> 1. 美工根据 `prompt` 生成图片
> 2. 把成品放到 `path` 指定的位置
> 3. 把对应 JSON 里的 `"status": "pending"` 改成 `"status": "ready"`
> 4. UI 会自动叠加显示，不需要改任何代码

---

## 全局风格基调

参考 [docs/DESIGN.md](DESIGN.md) §1.1：

- **主色调**：深樱花色 `#2D1B26`（背景底色）+ 暖米白 `#F5ECD7`（文字/对话框）+ 玫红 `#C9506A`（强调色）
- **画风**：写实偏氛围向，不卡通；电影感构图、自然景深、暖色调为主
- **避免**：浓艳饱和、夸张卡通、过曝高光、明显特效线
- **比例**：CG 用 16:9（1920×1080 或 2560×1440 都可）；立绘用 9:16 半身/全身均可；icon 用 1:1（推荐 SVG）

---

## 零、角色基准参考（4 张，最高优先级）

> **这是所有其他资源的视觉锚点，必须最先生成。**
>
> 凯恒会出现在 7 张立绘 + 多张 CG 里，每张 CG 角度/服装/景别都不一样（手部特写、俯视、背影……）。如果只靠文字 prompt，跨画面/跨画手/跨 batch 一定会漂——脸型、手型、身高比例、服装细节都对不上。
>
> 这 4 张参考图就是「凯恒长什么样」的唯一答案。**之后所有立绘和 CG 接单时，必须把这里对应的参考图作为 reference image 一并提供给 AI 或画手**，不能只发文字 prompt。

### REF 1 — `kai_turnaround.png`（三视图）

| 项 | 内容 |
|----|------|
| 路径 | `assets/reference/kai/kai_turnaround.png` |
| 用途 | **所有立绘和带脸/带身体的 CG 的脸型、发型、身高比例锚点** |
| 中文 prompt | 角色设定三视图，单张图横向并列三个 9:16 半身像（正面 / 四分之三侧面 / 背面），同一人物、同一光照、同一服装、同一表情；28 岁建筑设计师，身高约 183cm 偏瘦高，肩线挺拔但不夸张；深色头发偏长、有自然层次、可别在耳后；眉骨清晰、眼型偏狭长、双眼皮极浅、虹膜深棕近黑、目光沉静无表情；鼻梁挺直、唇线分明但偏薄、下颌线干净；皮肤偏冷白、几乎不带血色、近距离可见极淡的青色血管；统一中性表情、平视镜头；统一基础服装：干净白色长袖衬衫领口扣到第二颗、袖口未卷起、深色简约长裤、腕间一只极简银表、无任何戒指或项链；纯灰色无纹理背景 #6B6B6B、三向均匀柔光以便清晰呈现轮廓和体积、无强阴影、无氛围光；写实电影感画风、细腻胶片颗粒、高质感乙游角色设定稿；图片下方留小一行文字标注「FRONT / 3/4 SIDE / BACK」 |
| English prompt | character design turnaround sheet, single horizontal image with three 9:16 half-body portraits side by side (front / three-quarter side / back), same character, same lighting, same outfit, same expression; 28-year-old male architect, around 183cm and lean, broad-shouldered but not exaggerated; dark longish hair with natural layering, can be tucked behind one ear; defined brow, narrow eye shape with very subtle double eyelid, deep dark brown irises near black, calm gaze with no expression; straight nose bridge, defined but thin lip line, clean jawline; cool pale skin almost without warmth, faint blue veins visible at close range; uniform neutral expression facing camera; uniform base outfit: clean white long-sleeve shirt buttoned to the second button, sleeves not rolled, simple dark trousers, a thin minimalist silver watch on wrist, no rings or necklaces; flat neutral grey #6B6B6B background with no texture, even three-point soft lighting to clearly show silhouette and volume, no harsh shadows, no atmospheric light; realistic cinematic illustration style, fine film grain, premium otome character reference sheet quality; small text label at bottom reading "FRONT / 3/4 SIDE / BACK" |
| 规格 | PNG，横版 3:1 或 16:9（推荐 2700×900 或 2880×960），灰底 |
| 状态 | pending |

### REF 2 — `kai_costume_sheet.png`（服装设定图）

| 项 | 内容 |
|----|------|
| 路径 | `assets/reference/kai/kai_costume_sheet.png` |
| 用途 | **锁定三套服装的版型/材质/细节，CG1-4 全程会混用这三套** |
| 中文 prompt | 角色服装设定稿，单张图横向并列三个全身正面像，同一人物、同一姿势（自然站姿、双手松垂在身侧）、同一中性表情、同一光照；左：日常白衬衫造型——干净白色长袖衬衫袖口微微卷至前臂、领口扣到第二颗、深色简约长裤、腕间极简银表，对应咖啡馆日常场景；中：炭灰色毛衣造型——深炭灰色细针织圆领或低 V 领羊毛衫、袖口被推到精瘦的腕骨处露出腕表、内搭白色 T 恤领口若隐若现、深色长裤，对应安静私下场景；右：长款大衣造型——长款及膝深炭灰色羊毛大衣未系腰带敞开、内搭清爽白衬衫领口立起、深色长裤、深棕皮鞋，对应秋冬外出场景；三套服装版型保持精瘦合身、面料质感分明（衬衫挺括、毛衣细腻起绒、羊毛大衣垂坠）；纯灰色无纹理背景 #6B6B6B、三向均匀柔光、无强阴影；写实电影感画风、高质感乙游服装设定稿、细腻胶片颗粒；图片下方留小一行文字标注「DAILY SHIRT / CHARCOAL KNIT / LONG COAT」 |
| English prompt | character costume reference sheet, single horizontal image with three full-body front-view portraits side by side, same character, same pose (natural standing with hands loose at sides), same neutral expression, same lighting; left: daily white shirt look — clean white long-sleeve shirt with sleeves softly rolled to mid-forearm, buttoned to the second button, simple dark trousers, thin minimalist silver watch on wrist, used for cafe daytime scenes; middle: charcoal knitwear look — deep charcoal grey fine-knit crewneck or low-V wool sweater with sleeves pushed back to reveal lean wrist bone and the silver watch, faint glimpse of a white tee neckline underneath, dark trousers, used for quiet private scenes; right: long overcoat look — knee-length deep charcoal grey wool overcoat worn open without belt, crisp white shirt collar standing inside, dark trousers, dark brown leather shoes, used for autumn-winter outdoor scenes; all three outfits keep a lean tailored silhouette with distinct fabric textures (crisp shirt, fine napped knit, draping wool coat); flat neutral grey #6B6B6B background with no texture, even three-point soft lighting, no harsh shadows; realistic cinematic illustration style, premium otome costume reference sheet quality, fine film grain; small text label at bottom reading "DAILY SHIRT / CHARCOAL KNIT / LONG COAT" |
| 规格 | PNG，横版 3:1（推荐 2700×900），灰底 |
| 状态 | pending |

### REF 3 — `kai_hand_study.png`（手部专项设定）

| 项 | 内容 |
|----|------|
| 路径 | `assets/reference/kai/kai_hand_study.png` |
| 用途 | **CG1（指尖转杯）和 CG2（手骤停）强依赖；之后所有手部出镜场景都靠它** |
| 中文 prompt | 手部设定研究稿，单张图横向并列四个手部特写，同一只右手、同一光照；从左至右依次：①手背舒展平放——修长清瘦、骨节分明、指节线条清晰、皮肤偏冷白、手背浮一道极淡的青色血管、指甲修剪干净不上色、腕间露出极简银表与白衬衫袖口边；②手心半握——掌心纹路清晰但不深、虎口干净、五指自然微弯；③侧视握白瓷咖啡杯——食指与拇指轻扣杯耳、其他三指自然贴合杯身、指尖与瓷面接触点焦点清晰；④紧绷状态——五指收拢握拳但未完全握死、指节因用力而泛白、肌腱清晰浮起、手背血管比平时更明显，对应"被看穿瞬间"的细节；统一参考凯恒人物设定（28 岁男性、修长清瘦、无戒指、银表、白衬衫袖口）；纯灰色无纹理背景 #6B6B6B、柔和侧光便于看清骨相和血管走向、无强阴影；写实电影感、细腻胶片颗粒、高质感乙游设定稿；图片下方留小一行文字标注「RELAXED BACK / OPEN PALM / HOLDING CUP / TENSE GRIP」 |
| English prompt | hand study reference sheet, single horizontal image with four hand close-ups side by side, same right hand, same lighting; from left to right: (1) relaxed back of hand laid flat — long lean fingers with defined knuckles and clear tendon lines, cool pale skin, a single faint blue vein across the back of the hand, neatly trimmed unpolished nails, edge of a thin minimalist silver watch and white shirt cuff visible at the wrist; (2) open palm half-curled — clear but not deep palm lines, clean thumb webbing, fingers naturally slightly bent; (3) side view holding a white porcelain coffee cup — index and thumb hooking the handle, the other three fingers resting against the cup body, sharp focus at the contact point between fingertip and porcelain; (4) tense state — fingers drawn into a fist but not fully clenched, knuckles whitening from tension, prominent raised tendons, veins on the back of the hand more visible than usual, used for the "caught seen-through" moment; consistent with Kai's character spec (28-year-old male, long and lean, no rings, silver watch, white shirt cuff); flat neutral grey #6B6B6B background with no texture, soft side lighting to clearly show bone structure and vein paths, no harsh shadows; realistic cinematic style, fine film grain, premium otome reference sheet quality; small text label at bottom reading "RELAXED BACK / OPEN PALM / HOLDING CUP / TENSE GRIP" |
| 规格 | PNG，横版 4:1（推荐 3200×800），灰底 |
| 状态 | pending |

### REF 4 — `kai_expression_sheet.png`（表情合集）

| 项 | 内容 |
|----|------|
| 路径 | `assets/reference/kai/kai_expression_sheet.png` |
| 用途 | **7 张立绘的情绪锚点；分批出立绘时确保表情之间不跳** |
| 中文 prompt | 角色表情设定稿，单张图分两排展示七个头肩特写，同一人物、同一光照、同一发型、同一基础白衬衫领口、仅表情和眼神变化；上排四个：①neutral 平静微微低眸、不带表情、嘴线放松；②thinking 侧目、视线偏向画面外、眉头极轻微皱起、嘴线略微抿起；③attentive 直视镜头、瞳孔聚焦、眉峰微微上扬、嘴线放松；④slight_smile 嘴角极轻微上扬几乎察觉不到、眼神稍稍温下来；下排三个：⑤distant 视线飘向画面远处、像在想别的事、眉眼之间有一层薄薄的疏离感；⑥caught 微愣、瞳孔轻微放大、嘴唇微微张开像是被看穿的瞬间；⑦warm 眼神比平时柔和、眼角放松、但嘴角并没有真正笑起来；所有表情都保持克制、内敛、电影感、绝不夸张外放；纯灰色无纹理背景 #6B6B6B、统一柔和正面光、无强阴影；写实电影感画风、细腻胶片颗粒、高质感乙游表情设定稿；每个头像下方留小标签「neutral / thinking / attentive / slight_smile / distant / caught / warm」 |
| English prompt | character expression reference sheet, single image showing seven head-and-shoulder portraits in two rows, same character, same lighting, same hairstyle, same base white shirt collar, only expression and gaze varying; top row of four: (1) neutral — calm with slightly lowered gaze, no expression, relaxed mouth line; (2) thinking — eyes turned to the side looking off-frame, brow very faintly furrowed, mouth slightly pressed; (3) attentive — looking straight at camera, pupils focused, brow peak subtly raised, mouth relaxed; (4) slight_smile — corner of the mouth raised so faintly it's almost imperceptible, gaze warming a touch; bottom row of three: (5) distant — gaze drifting toward the distance as if thinking of something else, a thin layer of detachment between brow and eye; (6) caught — momentarily stunned, pupils slightly dilated, lips parted a fraction as if seen through; (7) warm — gaze softer than usual, eye corners relaxed, but the mouth has not actually smiled; all expressions remain restrained, internalized, cinematic, never exaggerated; flat neutral grey #6B6B6B background with no texture, uniform soft frontal lighting, no harsh shadows; realistic cinematic illustration style, fine film grain, premium otome expression reference sheet quality; small text label below each head reading "neutral / thinking / attentive / slight_smile / distant / caught / warm" |
| 规格 | PNG，横版 4:2（推荐 3200×1600），灰底 |
| 状态 | pending |

> **接单顺序硬性要求**：
>
> 1. 先出 REF 1（三视图）→ 锁脸型/发型/身高
> 2. 同步出 REF 2（服装）和 REF 4（表情）→ 锁服装与情绪
> 3. 再出 REF 3（手部）→ 锁手型与骨相
> 4. 以上 4 张全部 ready 后，才开始接 §二 CG 和 §三 立绘的单

---

## 一、技能 icon（5 张）

用在 `ChoicePanel` 选项前的小标签。极简单色，能在深色背景上看清即可。

| 路径 | 技能 | 中文 prompt | English prompt | 风格备注 | 状态 |
|------|------|-------------|----------------|----------|------|
| `assets/icons/skill_observe.svg` | observe | 极简线描眼睛 icon，单色，搭配一颗小光点表示察觉 | minimal line-art eye icon, monochrome, with a small dot of light indicating awareness | SVG，24×24，单色描边，能在 #F5ECD7 上看清 | pending |
| `assets/icons/skill_empathy.svg` | empathy | 两条柔和的弧线交汇成心形的极简 icon，单色 | minimal icon of two soft arcs meeting in a heart shape, monochrome | SVG，24×24 | pending |
| `assets/icons/skill_probe.svg` | probe | 极简箭头穿过一道半圆的 icon，单色，表示推进过界 | minimal icon of an arrow piercing through a semicircle, monochrome, suggesting crossing a line | SVG，24×24 | pending |
| `assets/icons/skill_boundary.svg` | boundary | 两条平行短竖线 icon，单色，表示尊重的留白 | minimal icon of two parallel short vertical lines, monochrome, suggesting a respectful gap | SVG，24×24 | pending |
| `assets/icons/skill_direct.svg` | direct | 极简实心圆点 + 一道直线穿过的 icon，单色，表示直击 | minimal icon of a solid dot pierced by a straight line, monochrome, suggesting directness | SVG，24×24 | ready |

> 占位字段同步在 [script/skills/definitions.json](../script/skills/definitions.json) 各 skill 的 `icon` 子字段。

---

## 二、剧情 CG（4 张）

技能节点触发的特写画面，仅在对应分支出现，不强制每次都看到。

> **接单前必读**：开工前请先确认 §零 的 4 张 `assets/reference/kai/*.png` 已经 ready，并把对应参考图作为 reference image 一并喂给 AI / 画手。CG1、CG2 强依赖 REF 3（手部），CG4 强依赖 REF 2（长款大衣造型）。

### CG 1 — `s01_kai_finger_cup.png`

| 项 | 内容 |
|----|------|
| 路径 | `assets/cg/ch1/s01_kai_finger_cup.png` |
| 触发场景 | ch1_scene01 |
| 触发节点 | `s01_kai_question2`（凯恒问"最近还好吗"前的旁白） |
| 中文 prompt | 乙女游戏 CG，电影感极近特写：28 岁男主修长苍白、骨节分明的手指缓缓转动一只白瓷咖啡杯，置于暖色木桌之上；干净白衬衫袖口微微卷起，腕间一只极简银表泛着细微反光，手背上隐约浮现的青筋透出克制的男性气息；动作停在半途，表达欲言又止的迟疑——一个尚未问出口的问题悬在空气里，安静的情绪张力压在表层之下；85mm 人像镜头、极浅景深、低位侧角度构图，对角线运镜，焦点精准落在指尖与杯沿的接触点，背景虚化为一片琥珀色光晕；午后金色斜光从画面左侧打来，在指节上勾出细腻明暗交界，半透明咖啡蒸汽在轮廓光中若隐若现，瓷釉光泽与木纹反光层次丰富；柔和暖色电影调色，细腻颗粒感，乙游绘本风高级感插画，超精细，亲密内省的氛围 |
| English prompt | otome game CG, cinematic extreme close-up of a 28-year-old male love interest's slender, pale, well-defined fingers slowly rotating a white porcelain coffee cup on a warm-toned wooden table; crisp white shirt cuff slightly rolled at the wrist, a thin minimalist silver watch glinting subtly, no rings, faint visible veins on the back of the hand suggesting restrained masculinity; the gesture caught mid-motion to convey suppressed hesitation, an unspoken question hovering before it is asked, quiet emotional tension just beneath the surface; shot on 85mm portrait lens, razor-thin shallow depth of field, low side angle with diagonal composition, focal point precisely on the fingertip meeting the porcelain rim, soft bokeh dissolving the background into amber haze; warm late-afternoon golden-hour side light streaming from camera left, sculpting the knuckles with delicate chiaroscuro, faint translucent coffee steam catching the rim light, glossy porcelain glaze and rich wood grain reflections; muted warm cinematic color grading, gentle film grain, painterly otome visual novel illustration style, ultra-detailed, intimate and contemplative atmosphere |
| 用途 | 凯恒紧张/思考时的小动作特写。强化「观察」技能的伏笔。 |
| 状态 | pending |

### CG 2 — `s01_kai_hand_stop.png`

| 项 | 内容 |
|----|------|
| 路径 | `assets/cg/ch1/s01_kai_hand_stop.png` |
| 触发场景 | ch1_scene01 |
| 触发节点 | `s01_observe_extra`（[观察] Lv1 解锁选项「你的手指在抖」触发） |
| 中文 prompt | 乙女游戏 CG，电影感微距特写：28 岁男主握住白瓷咖啡杯的手在木桌面上骤然停住的瞬间；修长优雅的手指、指节因紧绷而微微泛白、肌腱清晰浮起，皮肤偏冷白调，手背一道淡青血管隐约可见，画面边缘可见整洁的白衬衫袖口；这只手被定格在"被看穿"的精确瞬间——一丝几乎压住的微颤、不自觉屏住的呼吸，一个极度自我封闭的男人的从容只裂开一毫米的、不设防的瞬间；低角度微距镜头、极浅景深、偏离中心的对角构图，焦点死死锁在紧绷的指节上，杯身则虚化为柔光，杯底与桌面之间挤压出一道极窄的硬阴影，把"凝固"放大；午后掠射光从画面左侧斜入，在指节上刻出锐利的明暗交界，阴影一侧渗入一丝冷调暗示克制，瓷面反射一道细高光，背后木纹温润发光；浓郁电影感调色搭配轻微暗角，细腻胶片颗粒，高质感乙游插画风，超精细，张力十足、屏息般的氛围 |
| English prompt | otome game CG, cinematic macro close-up of a 28-year-old male love interest's hand abruptly frozen mid-grip around a white porcelain coffee cup on a wooden cafe table; long elegant fingers, defined knuckles whitening under tension, prominent tendons, cool pale skin with a single faint vein raised across the back of the hand, edge of a clean white shirt cuff at frame border; the hand caught in the precise instant of being seen through — a micro-tremor barely held still, breath unconsciously held, the unguarded moment of a deeply private man whose composure has just cracked one millimeter; shot at low macro angle with razor-thin depth of field, off-center diagonal composition, focus locked on the tense knuckles while the cup softens into bokeh, a hard narrow shadow trapped tightly between cup base and table to amplify the stillness; warm afternoon raking light from camera left carving sharp light-shadow boundaries across the knuckles, a faint cool undertone bleeding into the shadow side to suggest emotional restraint, glossy porcelain reflecting a thin highlight, warm wood grain glowing softly behind; rich cinematic color grading with subtle vignette, delicate film grain, premium otome visual novel illustration style, ultra-detailed, charged and breathless atmosphere |
| 用途 | 玩家「真的看见了」的瞬间，紧接凯恒罕见的承认台词。 |
| 状态 | pending |

### CG 3 — `s02_quiet_understanding.png`

| 项 | 内容 |
|----|------|
| 路径 | `assets/cg/ch1/s02_quiet_understanding.png` |
| 触发场景 | ch1_scene02 |
| 触发节点 | `s02_empathy_moment`（[共情] 选项触发） |
| 中文 prompt | 乙女游戏 CG，电影感俯瞰构图：雨天午后安静咖啡馆窗边座位，两只白瓷咖啡杯分别放在暖色木桌的两端；画面下方是女主纤细柔和的双手轻轻托住杯身，柔软针织衫袖口隐约可见；画面上方是 28 岁男主修长有力的双手沉静地握着杯子，深炭灰色毛衣袖口被推到精瘦的腕骨处；两人视线刻意没有交汇，没有任何台词，靠沉默传递心照不宣的脆弱亲密——"不说话"本身就是一种把对方接住的方式；近乎对称的俯视构图但保留一丝刻意的不对称，女主的杯子稍稍向他的一侧倾近一分，桌面留出大片留白，把情绪上的距离与温柔同时放大；俯拍视角、大光圈镜头、轻柔暗角，柔焦在两只杯子之间游移；暖色钨丝室内灯光从右上倾入，与雨痕斑驳玻璃后透出的冷蓝灰色日光形成色温对比，木纹反射出细微高光，落在水珠上的环境虚化柔和；柔和暖色电影调色中带一丝忧郁的冷蓝底，细腻胶片颗粒，绘本质感的高级乙游 CG 风，超精细，安静而温柔的氛围 |
| English prompt | otome game CG, cinematic overhead bird's-eye view of a quiet rainy-afternoon cafe window seat, two white porcelain coffee cups placed at opposite ends of a warm-toned wooden table; on the lower side of the frame a young woman's slender, delicate feminine hands lightly cradle her cup, soft knit sleeve cuffs visible; on the upper side, the 28-year-old male love interest's long, elegant masculine hands hold his cup with quiet composure, dark charcoal sweater sleeves pushed back to reveal lean wrists; gazes deliberately not meeting, no spoken words, conveying the fragile intimacy of mutual understanding through silence — the kind of moment where not speaking is itself a form of holding the other person; near-symmetrical overhead composition with deliberate subtle asymmetry as her cup tilts a fraction closer to his, generous negative space across the table to amplify emotional distance and tenderness; shot top-down on a wide-aperture lens with gentle vignette, soft selective focus drifting between the two cups; warm tungsten interior lamp glow pouring in from upper right contrasting with cool blue-grey daylight bleeding through rain-streaked window glass at frame edge, faint reflective highlights along the wood grain, soft ambient bokeh on falling water droplets; muted warm cinematic color palette with melancholic blue undertone, fine film grain, painterly premium otome visual novel art style, ultra-detailed, hushed and tender atmosphere |
| 用途 | 表现「没说话也是一种承接」的瞬间。 |
| 状态 | pending |

### CG 4 — `s03_kai_back_red_ear.png`

| 项 | 内容 |
|----|------|
| 路径 | `assets/cg/ch1/s03_kai_back_red_ear.png` |
| 触发场景 | ch1_scene03 |
| 触发节点 | `s03_good_end4`（Good End 收尾，对应「也许是冷的。也许不是。」） |
| 中文 prompt | 乙女游戏 CG，电影感中远景背影：28 岁男主在秋天傍晚的安静城市街道上向远处走去，从玩家视角略微靠后并稍高的角度看过去；高瘦修长、肩线挺拔的剪影裹在一件长款炭灰色羊毛大衣里，里面露出干净的白色衬衫领子，深色偏长的头发被别在一侧耳后，露出侧颈线条与耳廓的弧度；唯一的焦点细节是耳廓边缘和侧颈处那一抹柔软而明显的微红——一种他自己都不知道正在被人看见的脆弱，一种他不愿命名的暖意；步伐不快，双手松垂在身侧，头微微低下一寸，传达出"该走却不舍走"压在惯常克制之下；50mm 镜头、略高的三七背向角度，鹅卵石路面与延伸的路灯排列形成引导线把视线带向他，前景的梧桐落叶散虚化为柔焦，中景锐利落在他的侧颈与耳朵上，远景溶解成琥珀色雾气；夕阳金光从画面左侧打来，沿肩线和发梢勾出温暖的轮廓光，钨丝路灯一串串暖橘色光晕沿街道形成安静的节奏，散落在湿润鹅卵石上的橙黄梧桐叶映出细碎反光，淡淡宽银幕镜头光斑；柔和暖色电影调色搭配深青色阴影做对比，细腻胶片颗粒，高级乙游 CG 风，超精细，绵长而隐隐发疼的氛围 |
| English prompt | otome game CG, cinematic medium-long back shot of a 28-year-old male love interest walking away down a quiet autumn evening city street, viewed from the player's perspective slightly behind and a little above; tall, lean, broad-shouldered silhouette in a long charcoal wool overcoat over a clean white shirt collar, dark longish hair tucked behind one ear leaving the side of his neck and the curve of his ear exposed; the singular focal detail — a soft, unmistakable flush of red blooming along the rim of his ear and the side of his neck, the kind of vulnerability he doesn't know is being witnessed, the warmth he refuses to name; his pace unhurried, hands loose at his sides, head tilted a fraction down, conveying restrained reluctance to leave layered under his usual composure; shot on 50mm lens at slightly elevated three-quarter back angle, leading lines of cobblestone pavement and a receding row of streetlamps drawing the eye to him, foreground autumn plane tree leaves blurred in soft bokeh, mid-ground sharp on his neck and ear, background dissolving into amber haze; golden-hour dusk light from camera left edging his shoulder and hair with a warm rim, chains of tungsten streetlamp halos forming a quiet rhythm down the street, scattered orange-yellow plane tree leaves on damp cobblestones catching specular highlights, faint anamorphic lens flare; muted warm cinematic color grading with deep teal-shadow contrast, gentle film grain, premium otome visual novel CG style, ultra-detailed, lingering and quietly aching atmosphere |
| 用途 | Good End 限定 CG，与最后一句旁白同时出现。 |
| 状态 | pending |

> 实际共 4 张 CG（plan 里写的是 3 张 + scene01 加了 1 张观察解锁特写）。

---

## 三、凯恒立绘（7 张情绪）

定义见 [script/characters/kai.json](../script/characters/kai.json)。立绘在很多场景都会用，这一批不属于"技能系统新增"，而是整个游戏的基础资源——但 `assets/sprites/kai/` 目录目前是空的，所以一并列在这里供人工生成。

> **接单前必读**：开工前请先确认 §零 的 REF 1（三视图）+ REF 2（白衬衫造型）+ REF 4（表情合集）已经 ready，并把这三张参考图一并喂给 AI / 画手。立绘的脸型/发型/服装锁定靠 REF 1+2，七个表情的细微差异锁定靠 REF 4。

| 路径 | 情绪 | 触发场景 | 中文 prompt 关键词 | English prompt 关键词 | 状态 |
|------|------|---------|-------------------|----------------------|------|
| `assets/sprites/kai/kai_neutral.png` | neutral | 默认/日常对话 | 28岁建筑师，深色偏长头发，整洁素衣，平静微微低眸，不带表情 | 28-year-old architect, dark longish hair, tidy plain clothes, calm with slightly lowered gaze, no expression | pending |
| `assets/sprites/kai/kai_thinking.png` | thinking | 等待/思考/AI 响应中 | 同上，侧目，眉头极轻微皱起 | same character, eyes turned slightly aside, brow very faintly furrowed | pending |
| `assets/sprites/kai/kai_attentive.png` | attentive | 认真倾听玩家说话 | 同上，直视前方，眼神专注 | same character, looking straight ahead, focused gaze | pending |
| `assets/sprites/kai/kai_slight_smile.png` | slight_smile | 玩家说了出乎他意料的话 | 同上，嘴角极轻微上扬，不明显 | same character, corner of the mouth very faintly raised, almost imperceptible | pending |
| `assets/sprites/kai/kai_distant.png` | distant | 触碰到他的伤口 | 同上，眼神飘向别处，像在想别的事 | same character, gaze drifting elsewhere as if thinking of something else | pending |
| `assets/sprites/kai/kai_caught.png` | caught | 玩家问到他意想不到的问题 | 同上，微愣，像是被看穿 | same character, momentarily stunned, as if seen through | pending |
| `assets/sprites/kai/kai_warm.png` | warm | 好感度高时，私下相处 | 同上，眼神比平时柔和，但没有笑 | same character, gaze softer than usual, but not smiling | pending |

**立绘统一要求**：

- 9:16 半身或全身竖图（推荐 1080×1920），透明 PNG
- 同一姿势/服装/光照，仅表情和眼神变化（这样情绪切换时不跳）
- 角色背景透明，能贴到任意场景上
- 风格参考 [script/characters/kai-profile.md](../script/characters/kai-profile.md) §第 67 行情绪表

---

## 四、汇总进度

| 类别 | 总数 | pending | ready |
|------|------|---------|-------|
| **角色基准参考（必须最先出）** | **4** | **4** | **0** |
| 技能 icon | 5 | 4 | 1 |
| 剧情 CG | 4 | 4 | 0 |
| 凯恒立绘 | 7 | 7 | 0 |
| **合计** | **20** | **19** | **1** |

---

## 五、本批资源不在范围

- 场景背景图（`cafe_afternoon.jpg` / `cafe_rain.jpg` / `cafe_exit_evening.jpg`）：已在 scene*.json 占位，但属于"基础场景"非技能新增，单独排期
- BGM（`warm_afternoon.mp3` / `rain_outside.mp3` / `quiet_evening.mp3`）：同上
- AI 响应状态机的额外 UI 资源（loading 三点动画等）：纯前端实现，不需要美术接单

---

## 六、变更记录

| 日期 | 变更 | 关联文件 |
|------|------|----------|
| 2026-04-29 | 初始建档（技能系统第一版） | scene01/02/03.json + skills/definitions.json |
| 2026-04-29 | 新增 §零 角色基准参考 4 张（三视图 / 服装 / 手部 / 表情合集），作为所有立绘和 CG 的视觉锚点；§二、§三 增加"接单前必读"提示；汇总进度顺手修正 icon 已 ready 1 张 | docs/skill-image-assets.md + public/assets/reference/kai/ |
