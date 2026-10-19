# MOTION. — 15 秒代码生成的动态设计 Showreel

[English README](README.md) · [GitHub 仓库](https://github.com/zazacheng-coder/motion-reel) · [Release v1.0.0](https://github.com/zazacheng-coder/motion-reel/releases/tag/v1.0.0)

一支 15 秒、1920×1080、60fps 的动态设计作品集短片。全片由代码绘制：字体、点阵、超椭圆形变、CSS 3D 字体地形、界面微交互、颗粒与纸张纹理，以及 120 BPM 的原创配乐，全部在工程内生成。没有实拍、图库素材或第三方音乐。

一个朱红色圆点贯穿全片：开场是圆点，拉成横线，收成标题的句点，扩张成橙色洪流，收缩成形态研究的实体，变成按钮，变成全屏的字体地形，最后成为标题的句号，飞回画面中心。第 899 帧与第 0 帧重合，可以无缝循环。

**成片：** `out/motion-reel-1080p.mp4`（31.8 MB） · **海报：** `out/motion-reel-poster.jpg`

## 规格

| 项目 | 参数 |
|---|---|
| 时长 | 15.000 s（视频轨 900 帧） |
| 画幅 | 1920 × 1080（16:9） |
| 帧率 | 60 fps |
| 节奏 | 120 BPM，30 拍；drop 在 10.000 s |
| 声音 | 48 kHz 立体声原创配乐 + 音效；MP4 内 AAC 256k |
| 编码 | H.264，CRF 18，yuv420p，60fps |
| 循环 | 是 — 首帧与末帧是同一状态（圆点在 960,560，14px） |
| 字体 | Space Grotesk 300–700、Instrument Serif 400 + italic、JetBrains Mono 400–700（SIL OFL） |
| 文件 | 38 个文件；成片 31.8 MB |

## 六个乐章

1. **01 SIGNAL**（0–4.0s）— 圆点 → 横线 → MOTION → 动态字墙 → 收缩 → 橙色洪流。
2. **02 STATEMENT**（4.0–5.7s）— 橙色画面上的 MOVE / WITH / INTENT；画面随后收缩。
3. **03 FORM**（5.7–8.0s）— 纸张世界、点阵波纹、超椭圆形变与残影；形态缩成按钮，纸张抬起。
4. **04 INTERFACE**（7.83–10.0s）— 卡片、光标、点击、加载、对勾、SENT；按钮拉成贯穿画面的横线。
5. **05 IMPACT**（10.0–11.5s）— 硬切到 CSS 3D 字体地形，推进，扫描线揭开标题。
6. **06 OUTRO**（11.5–15.0s）— 标题、衬线副标题、简历信息块；句点脱离并飞回中心。

## 运行

```bash
npm install
npx tsc                       # 类型检查
npm run dev                   # Remotion Studio，选择 MotionReel
npx remotion still MotionReel out/frame.png --frame=800
npm run render                # 渲染 1080p60 MP4（含音频）
```

`out/` 里已经提交了成片和海报，不安装依赖也可以直接看片。

重新生成程序化素材：

```bash
python3 tools/gen_assets.py   # grain.png, paper.jpg
python3 tools/gen_audio.py    # public/audio/reel-mix.wav
```

需要 Python 3 + numpy + Pillow。

## 源码结构

```
src/
  MotionReel.tsx          合成、场景层叠、灯光、音频
  Root.tsx                Remotion 注册（900f, 60fps）
  theme.ts                色板、字号、边距、基线、工具函数
  lib/anim.ts             弹簧、贝塞尔缓动、进度函数
  lib/shapes.ts           超椭圆路径采样
  components/
    FontLoader.tsx        本地 FontFace + delayRender
    Chrome.tsx            裁切标记、规格栏、实时乐章标签
    Grain.tsx             确定性颗粒漂移
  scenes/
    S1Signal.tsx          0–240    圆点、横线、标题、字墙、收缩
    S2Statement.tsx       208–344  橙色洪流、MOVE WITH INTENT、收缩
    S3Form.tsx            312–486  纸张、点阵、形变、纸张抬起
    S4Interface.tsx       460–600  卡片、光标、点击、成功、横线
    S5Impact.tsx          600–702  字体地形、推进、扫描转场
    S6Outro.tsx           688–900  标题、简历信息、句点飞行、循环
public/                   字体、纹理、配乐
tools/                    纹理与音频生成脚本
BRIEF.md                  六段式创作 brief
BEATS.md                  30 拍 beat map 与音效事件
```

## 技术要点

- 所有可见属性都由 `useCurrentFrame()` 计算；没有 CSS transition、timer、`Math.random()` 或跨帧状态。
- 弹簧用 Remotion `spring()`；相机、遮罩、洪流用 cubic-bezier。
- 字体通过 `FontFace` + `delayRender` 本地加载，渲染时不需要网络。
- 颗粒是程序生成的 1024² 贴图，按帧哈希偏移；最后 12 帧冻结偏移，确保首帧/末帧一致。
- 配乐用 numpy 合成：kick、clap、hat、sub bass、pad、arp、riser、impact、UI click；MP4 内 AAC 256k。

## 真实声明

`60 FPS`、`900 FRAMES`、`120 BPM`、`SIX MOVEMENTS`、`100% CODE-DRAWN`、`NO FOOTAGE · NO STOCK` 都是这个文件的真实属性。`OPEN TO WORK` 是短片里的虚构署名。没有编造客户、数据、引语或第三方 logo。

## 发布备注（中文）

- **发布方式：** 本机到 `github.com:443` 不通，`git push` 失败，因此仓库内容通过 GitHub REST API 发布。远端 `main` 的提交历史是 `Initial commit` + `MOTION. — 15s code-drawn showreel`（以及后续的中文说明提交）；仓库文件树与本地一致。如果之后要在这台机器上正常 push，需要能访问 github.com。
- **时长：** 视频轨道是 15.000 s / 900 帧；容器显示 15.019 s 是 AAC 帧填充造成的，不是画面多了 19 ms。
- **响度：** −15.1 LUFS integrated / −1.04 dBTP（AAC 母版测量）。目标约 −14 LUFS，稍低一点以保留 true peak 余量。
- **配乐：** 程序合成，未经过人耳试听；我用响度、波形包络和事件时间对齐做了校验。
- **字体授权：** SIL OFL 1.1，版权与来源见 [FONT-LICENSES.md](FONT-LICENSES.md) 与 [OFL.txt](OFL.txt)。
- **代码许可：** 代码和影片本身暂未声明开源许可，默认保留所有权利。
- **改成你自己的简历：** 把 `MOTION.` 换成你的名字，修改 `src/components/Chrome.tsx`（页眉/页脚）和 `src/scenes/S6Outro.tsx`（结尾标题）；`OPEN TO WORK` 也在 `S6Outro.tsx` 的简历信息块里。

## 许可

- 字体：SIL OFL 1.1，见 [FONT-LICENSES.md](FONT-LICENSES.md)。
- 影片、配乐、纹理和动效：本仓库作者原创。
