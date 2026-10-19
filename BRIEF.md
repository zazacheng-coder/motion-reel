# MOTION. — 15s showreel

**Archetype:** showreel (capacity proof, no product story)
**Deliverable:** one 15.000s film, 1920×1080, 60fps, original score, seamless loop.

---

## <inputs>

| Input | Value | Source |
|---|---|---|
| Brand | "MOTION." — the reel is the résumé | DECISION (user gave no brand) |
| On-screen copy | MOTION / motion is a language. / MOVE WITH INTENT / ready when you are. / SENT / brief received / a reel in six movements / 100% CODE-DRAWN / OPEN TO WORK | DECISION |
| Claimed numbers | 60 fps, 900 frames, 120 BPM, 6 movements | **Real.** True of this file. |
| Palette | void `#0A0A0B`, paper `#F2ECDF`, vermilion `#FF4A1C` | DECISION |
| Type | Space Grotesk 300–700 (display), Instrument Serif Italic (counterpoint), JetBrains Mono (spec labels) | DECISION, bundled locally |
| Assets | none. Every mark is SVG/CSS. No footage, no stock, no third-party logo. | — |
| Music | original synthesized track + sound design, generated in-project at 120 BPM | DECISION |

No invented client, metric, quote, or logo. "OPEN TO WORK" is the reel's in-fiction sign-off, not a claim about a real person.

## <direction>

Format 16:9, 1920×1080, 60fps, 900 frames. Aspect stays full-bleed; no letterboxing.

Look: a near-black screening room, warm paper type, one vermilion accent, 35mm-ish grain. Typography is the hero: 300px+ display, tight optical tracking, mono spec labels as texture. Composition is architectural — 96px margins, hairline rules, asymmetric blocks.

**One rule:** the reel is one object. A single vermilion dot opens the film, becomes a rule, becomes the period of the title, becomes a flood, becomes a form study, becomes a button, becomes the dot that closes the loop. No crossfades, no scene cards.

Bans:
1. no crossfade or dissolve between scenes;
2. no blur-in entrances;
3. no particles, sparks, glows, lens flares;
4. no gradients on UI chrome;
5. no bouncy cartoon easing;
6. no 3D flips or stock transitions;
7. no stock footage, UI kits, or template cards;
8. no fake identity, client, or metric.

Motion vocabulary: masked type rises, spring overshoot ≤4%, circle flood/contract, sheet slide, scan wipe, CSS-3D type terrain, path morph with ghost trails, print-misregistration impact split.

## <structure>

120 BPM. 1 beat = 0.5s = 30 frames. 30 beats.

| Movement | Time | Frames | Job |
|---|---|---|---|
| 01 SIGNAL | 0.00–4.00 | 0–240 | dot → rule → MOTION → kinetic type → collapse |
| 02 STATEMENT | 4.00–5.70 | 240–342 | orange flood, MOVE WITH INTENT, contract |
| 03 FORM | 5.70–8.00 | 342–480 | dot grid, superellipse morph, sheet lift |
| 04 INTERFACE | 7.83–10.00 | 470–600 | card, cursor, click, success, line |
| 05 IMPACT | 10.00–11.50 | 600–690 | hard cut to 3D type terrain, dolly, scan wipe |
| 06 OUTRO | 11.50–15.00 | 690–900 | title, résumé block, period flight, loop |

Most expensive beat: **10.00s / beat 21 / frame 600 — the drop**, landing on a chord change after a half-second of near-silence. Followed by a named 1.7s résumé hold from 12.50 to 14.27.

## <build>

Remotion 4 + React 19 + TypeScript. All styles are pure functions of the frame. `spring()` for physical moves; `interpolate()` + cubic beziers for camera and masks. No CSS animation, no timers, no `Math.random`, seeded hash only. Fonts loaded through `FontFace` + `delayRender`. Grain is a generated PNG tile with a frame-hashed offset, frozen for the last 8 frames so the loop is pixel-exact in composition; the final dot state is pinned to the frame-0 state. Audio: a single 48kHz stereo WAV, synthesized with numpy (kick, clap, hats, sub bass, pad, arp, risers, impacts, UI ticks), mastered with true-peak headroom, muxed at 256k.

Render: H.264, CRF 18, yuv420p, 60fps, 900 frames. Verify with ffprobe and a first/last-frame diff.

## <gotchas>

- Huge type at 300px can clip inside rise masks; each glyph needs its own mask with a little headroom, and the mask bottom must sit exactly on the rule.
- Ticker rows must be long enough to never show an edge while sliding.
- The paper→void handoff needs the traveller shape to read on both grounds; the button becomes an outline, not a fill.
- The circle flood must cover the corners (radius ≥ 1101px) before the next scene's type enters.
- The terrain must not turn into mush at the dolly peak; cap the scale and fade by depth.
- The 15s loop: no section label, no breath, no grain offset mismatch at frame 0 / frame 899.

## <start>

Beat map in `BEATS.md`. Four named stills before the full render:
- **A · SIGNAL** frame 130 — the settled wordmark with its period.
- **B · STATEMENT** frame 275 — MOVE WITH INTENT on orange.
- **D · INTERFACE** frame 505 — the card, SEND, cursor arriving.
- **F · OUTRO** frame 800 — title + serif + résumé block.
