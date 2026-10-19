import React from "react";
import { interpolate } from "remotion";
import { CHROME, C, FONT, clamp, mix } from "../theme";
import { EASE, prog } from "../lib/anim";

const SECTIONS = [
  { at: 14, n: "01", name: "SIGNAL" },
  { at: 240, n: "02", name: "STATEMENT" },
  { at: 342, n: "03", name: "FORM" },
  { at: 468, n: "04", name: "INTERFACE" },
  { at: 600, n: "05", name: "IMPACT" },
  { at: 712, n: "06", name: "OUTRO" },
] as const;

const LABEL_SIZE = 20;
const LABEL_LINE = 26;

/** Spec-sheet chrome: crop marks, static reel data, live movement number. */
export const Chrome: React.FC<{ f: number }> = ({ f }) => {
  // chrome turns ink-dark over the orange and paper worlds
  const inkT = interpolate(f, [214, 228, 478, 488], [0, 1, 1, 0], clamp);
  const color = mix(C.paper, C.void, inkT);
  const markColor = inkT > 0.35 ? C.void : C.accent;
  const dim = 0.42;

  let idx = -1;
  for (let i = 0; i < SECTIONS.length; i++) {
    if (f >= SECTIONS[i].at) idx = i;
  }
  const cur = idx >= 0 ? SECTIONS[idx] : null;
  const prev = idx > 0 ? SECTIONS[idx - 1] : null;
  const swap = cur ? EASE.out(prog(f, cur.at, 9)) : 1;
  const enter = EASE.out(prog(f, 14, 12));
  const leave = 1 - EASE.inOut(prog(f, 876, 12));
  const labelOpacity = enter * leave;

  const mark = (v?: number) => ({
    position: "absolute" as const,
    width: 16,
    height: 16,
    borderColor: color,
    opacity: (v ?? 0.18) * 1.4,
    borderStyle: "solid",
    borderWidth: 0,
  });

  // the type wall in movement 01 takes over the frame; let the chrome recede
  const recession =
    1 -
    0.55 * EASE.inOut(prog(f, 154, 8)) * (1 - EASE.inOut(prog(f, 198, 10)));
  // the paper sheet reveals a new world: chrome steps out while the ground changes
  const frameDip =
    1 - EASE.inOut(prog(f, 458, 10)) * (1 - EASE.inOut(prog(f, 480, 12)));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        color,
        opacity: recession * frameDip,
      }}
    >
      {/* crop marks */}
      <div style={{ ...mark(), left: 36, top: 36, borderLeftWidth: 1, borderTopWidth: 1 }} />
      <div style={{ ...mark(), right: 36, top: 36, borderRightWidth: 1, borderTopWidth: 1 }} />
      <div style={{ ...mark(), left: 36, bottom: 36, borderLeftWidth: 1, borderBottomWidth: 1 }} />
      <div style={{ ...mark(), right: 36, bottom: 36, borderRightWidth: 1, borderBottomWidth: 1 }} />

      {/* top left identity */}
      <div
        style={{
          position: "absolute",
          left: CHROME,
          top: 50,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: FONT.mono,
          fontSize: 19,
          letterSpacing: "0.26em",
          lineHeight: 1,
        }}
      >
        <span
          style={{
            display: "block",
            width: 7,
            height: 7,
            background: markColor,
            flexShrink: 0,
          }}
        />
        <span>MOTION DESIGNER</span>
        <span style={{ opacity: dim }}>/ REEL 2026</span>
      </div>

      {/* top right format */}
      <div
        style={{
          position: "absolute",
          right: CHROME,
          top: 51,
          fontFamily: FONT.mono,
          fontSize: 17,
          letterSpacing: "0.22em",
          opacity: dim,
          lineHeight: 1,
        }}
      >
        60 FPS / 1920 × 1080
      </div>

      {/* bottom left movement */}
      <div
        style={{
          position: "absolute",
          left: CHROME,
          bottom: 48,
          height: LABEL_LINE,
          overflow: "hidden",
          opacity: labelOpacity,
        }}
      >
        {cur && (
          <div
            style={{
              position: "relative",
              height: LABEL_LINE,
              fontFamily: FONT.mono,
              fontSize: LABEL_SIZE,
              letterSpacing: "0.24em",
              lineHeight: `${LABEL_LINE}px`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                background: markColor,
                display: "block",
                flexShrink: 0,
              }}
            />
            <div style={{ position: "relative", height: LABEL_LINE, width: 360 }}>
              {prev && swap < 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: -swap * LABEL_LINE,
                    opacity: 1 - swap,
                  }}
                >
                  {prev.n} / {prev.name}
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: (1 - swap) * LABEL_LINE,
                  opacity: swap,
                }}
              >
                {cur.n} / {cur.name}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* bottom right duration */}
      <div
        style={{
          position: "absolute",
          right: CHROME,
          bottom: 49,
          fontFamily: FONT.mono,
          fontSize: 17,
          letterSpacing: "0.22em",
          opacity: dim * labelOpacity,
          lineHeight: 1,
        }}
      >
        15.00 S / 900 FR
      </div>

      {/* a hairline tick on the right edge that runs at the beat */}
      <div
        style={{
          position: "absolute",
          right: 36,
          top: 980,
          width: 16,
          height: 1,
          background: markColor,
          opacity: 0.5 * labelOpacity,
          transform: `scaleX(${0.35 + 0.65 * Math.abs(Math.sin((Math.PI * (f >= 888 ? 0 : f)) / 30))})`,
          transformOrigin: "right center",
        }}
      />
    </div>
  );
};
