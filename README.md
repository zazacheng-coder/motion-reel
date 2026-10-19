# MOTION. — a 15s showreel built in code

A 15.000-second, 1920×1080, 60fps motion-design showreel. One vermilion dot opens the film, becomes a rule, a period, a flood, a form study, a button and the full stop, then returns to the same dot — frame 899 matches frame 0.

Everything is generated in the project: typography is set from bundled local fonts, the dot grid, type terrain, morphs and UI are React/CSS/SVG driven by the frame number, the film grain and paper textures are procedurally generated, and the score is synthesized from oscillators and noise. No footage, no stock, no third-party audio.

**▶ [Watch the film](out/motion-reel-1080p.mp4)** · [Poster frame](out/motion-reel-poster.jpg)

[![MOTION. end card](out/motion-reel-poster.jpg)](out/motion-reel-1080p.mp4)

## Specs

| | |
|---|---|
| Duration | 15.000 s |
| Frame | 1920 × 1080 (16:9) |
| FPS | 60 (900 frames) |
| Edit | 120 BPM, 30 beats, drop at 10.000 s |
| Audio | 48 kHz stereo original score + sound design, AAC 256k in the MP4 |
| Codec | H.264, CRF 18, yuv420p, 60fps |
| Loop | yes — first and last frame are the same state (dot at 960,560, 14px) |
| Type | Space Grotesk 300–700, Instrument Serif 400 + italic, JetBrains Mono 400–700 (all SIL OFL) |

## Movements

1. **01 SIGNAL** (0–4.0s) — dot → rule → MOTION → kinetic ticker → collapse → flood.
2. **02 STATEMENT** (4.0–5.7s) — MOVE / WITH / INTENT on vermilion; the field contracts.
3. **03 FORM** (5.7–8.0s) — paper field, dot-grid wave, a superellipse morph with ghost trails, the form shrinks to a button and the paper lifts.
4. **04 INTERFACE** (7.83–10.0s) — card, cursor, click, spinner, check, SENT, the button becomes a full-width rule.
5. **05 IMPACT** (10.0–11.5s) — hard cut to a CSS-3D terrain of MOTION, dolly, scan wipe.
6. **06 OUTRO** (11.5–15.0s) — the title, the serif line, the résumé block, the period detaches and loops home.

## Run it

```bash
npm install                   # Remotion 4, React 19, TypeScript
npx tsc                       # typecheck
npm run dev                   # Remotion Studio (choose MotionReel)
npx remotion still MotionReel out/frame.png --frame=800
npm run render                # 1080p60 MP4 with audio
```

The rendered film and poster are already committed under `out/`, so you can watch it without installing anything.

Regenerate the procedural assets:

```bash
python3 tools/gen_assets.py   # grain.png, paper.jpg
python3 tools/gen_audio.py    # public/audio/reel-mix.wav
```

The Python scripts need Python 3 with `numpy` and `Pillow`.

## Source map

```
src/
  MotionReel.tsx          composition, scene stack, lighting, audio
  Root.tsx                Remotion registration (900f, 60fps)
  theme.ts                palette, type scale, margins, baseline, helpers
  lib/anim.ts             springs, bezier easings, progress helpers
  lib/shapes.ts           superellipse path sampler
  components/
    FontLoader.tsx        local FontFace loading with delayRender
    Chrome.tsx            crop marks, spec rails, live movement label
    Grain.tsx             deterministic film-grain tile drift
  scenes/
    S1Signal.tsx          0–240    dot, rule, title, ticker, collapse
    S2Statement.tsx       208–344  flood, MOVE WITH INTENT, contract
    S3Form.tsx            312–486  paper, dot grid, morph, sheet lift
    S4Interface.tsx       460–600  card, cursor, click, success, line
    S5Impact.tsx          600–702  type terrain, dolly, scan wipe
    S6Outro.tsx           688–900  title, résumé, period flight, loop
public/
  fonts/                  four WOFF2 files (latin subsets)
  textures/grain.png      generated 1024² grain tile
  textures/paper.jpg      generated 2048² paper
  audio/reel-mix.wav      15s 48kHz stereo score + SFX
tools/
  gen_assets.py
  gen_audio.py
BRIEF.md                  the six-block brief
BEATS.md                  the 30-beat map with sound events
```

## Determinism

Every visible property is computed from `useCurrentFrame()`. There are no CSS transitions, timers, `Math.random()` calls or frame-to-frame state. Grain offsets come from a hashed phase; the terrain wave is a pure sine of the frame. Fonts load through `delayRender`.

## Honest claims in the film

`60 FPS`, `900 FRAMES`, `120 BPM`, `SIX MOVEMENTS`, `100% CODE-DRAWN`, `NO FOOTAGE · NO STOCK` are all true of this file. `OPEN TO WORK` is the reel's in-fiction sign-off. No client, metric, quote or third-party logo is invented.

## Repository notes

`out/` contains the final 15s film, the poster and a four-still sheet. `node_modules/` is intentionally ignored. The bundled font files are OFL; see [FONT-LICENSES.md](FONT-LICENSES.md). The film itself is an original work by the repository owner.

## Credits / licences

- Type: Space Grotesk (Florian Karsten), Instrument Serif (Rodrigo Fuenzalida), JetBrains Mono (JetBrains) — SIL Open Font License.
- Score, sound design, textures and every moving mark: generated for this project.
