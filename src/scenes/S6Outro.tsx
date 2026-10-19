import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../theme";
import { EASE, SP, prog, sp } from "../lib/anim";

const SIZE = 320;
const BASE = 520;
const PERIOD_OFF = 560; // half the word + optical gap, tuned against the still
const DOT_Y = BASE - 11;

const Col: React.FC<{
  f: number;
  x: number;
  align: "left" | "right";
  start: number;
  primary: string;
  secondary: string;
  orange?: boolean;
}> = ({ f, x, align, start, primary, secondary, orange }) => {
  const s = sp(f, start, SP.soft, 22);
  const out = EASE.in(prog(f, 856 + (start - 750) / 3, 14));
  return (
    <div
      style={{
        position: "absolute",
        top: 796,
        left: align === "left" ? x : undefined,
        right: align === "right" ? 96 : undefined,
        width: align === "left" ? 520 : undefined,
        textAlign: align,
        transform: `translateY(${(1 - s) * 44 + out * 44}px)`,
        opacity: s * (1 - out),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: align === "right" ? "flex-end" : "flex-start",
          gap: 12,
          fontFamily: FONT.mono,
          fontSize: 26,
          letterSpacing: "0.16em",
          color: C.paper,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {orange && (
          <span style={{ width: 7, height: 7, background: C.accent, display: "block" }} />
        )}
        {primary}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: FONT.mono,
          fontSize: 17,
          letterSpacing: "0.18em",
          color: C.paper38,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {secondary}
      </div>
    </div>
  );
};

export const S6Outro: React.FC<{ f: number }> = ({ f }) => {
  const letters = "MOTION".split("");

  const titleIn = sp(f, 690, SP.soft, 34);
  const titleScale = 1 + 0.045 * (1 - titleIn);
  const titleY = 18 * (1 - titleIn);
  const subIn = sp(f, 716, SP.soft, 30);
  const subOut = EASE.in(prog(f, 858, 14));
  const hair = EASE.out(prog(f, 748, 22));
  const hairOut = EASE.in(prog(f, 858, 14));
  const hairScale = f < 858 ? hair : 1 - hairOut;

  const pulse = f > 724 && f < 862 ? 1 + 0.1 * Math.exp(-((f % 30) / 6)) : 1;
  const periodOp = f < 866 ? 1 : 0;

  // the period detaches and travels to the loop point
  const travelT = EASE.inOut(prog(f, 866, 26));
  const fx = (1 - travelT) * (1 - travelT) * (960 + PERIOD_OFF) + 2 * (1 - travelT) * travelT * 1250 + travelT * travelT * 960;
  const fy = (1 - travelT) * (1 - travelT) * DOT_Y + 2 * (1 - travelT) * travelT * 300 + travelT * travelT * 560;
  const fSize = 22 - 8 * EASE.out(prog(f, 866, 26));
  const travelOn = f >= 866;

  const ghosts = travelOn
    ? [0.14, 0.09, 0.05].map((o, i) => {
        const t = EASE.inOut(prog(f - (i + 1) * 2, 866, 26));
        const gx =
          (1 - t) * (1 - t) * (960 + PERIOD_OFF) + 2 * (1 - t) * t * 1250 + t * t * 960;
        const gy = (1 - t) * (1 - t) * DOT_Y + 2 * (1 - t) * t * 300 + t * t * 560;
        return { x: gx, y: gy, o, size: 22 - 8 * EASE.out(prog(f - (i + 1) * 2, 866, 26)) };
      })
    : [];

  const finalDot = f >= 892;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* the word and its period share one optical transform */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          transformOrigin: `50% ${BASE}px`,
        }}
      >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 140,
          height: 380,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: SIZE,
            lineHeight: 0.68,
            letterSpacing: `${-0.055 + 0.006 * EASE.inOut(prog(f, 748, 110))}em`,
            color: C.paper,
            whiteSpace: "nowrap",
          }}
        >
          {letters.map((ch, i) => (
            <span
              key={i}
              style={{
                display: "block",
                transform: `translateY(${EASE.in(prog(f, 864, 22)) * 430}px)`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* period dot, framed independently so it can leave the word */}
      {!travelOn && (
        <div
          style={{
            position: "absolute",
            left: 960 + PERIOD_OFF - 11,
            top: DOT_Y - 11,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: C.accent,
            transform: `scale(${pulse * periodOp})`,
          }}
        />
      )}
      </div>

      {travelOn &&
        ghosts.map((g, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: g.x - g.size / 2,
              top: g.y - g.size / 2,
              width: g.size,
              height: g.size,
              borderRadius: "50%",
              background: C.accent,
              opacity: g.o,
            }}
          />
        ))}

      {travelOn && !finalDot && (
        <div
          style={{
            position: "absolute",
            left: fx - fSize / 2,
            top: fy - fSize / 2,
            width: fSize,
            height: fSize,
            borderRadius: "50%",
            background: C.accent,
          }}
        />
      )}

      {finalDot && (
        <div
          style={{
            position: "absolute",
            left: 960 - 7,
            top: 560 - 7,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: C.accent,
          }}
        />
      )}

      {/* serif line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 606,
          textAlign: "center",
          overflow: "hidden",
          height: 92,
          transform: `translateY(${subOut * 100}px)`,
          opacity: 1 - subOut,
        }}
      >
        <div
          style={{
            transform: `translateY(${(1 - subIn) * 92}px)`,
            fontFamily: FONT.serif,
            fontStyle: "italic",
            fontSize: 60,
            lineHeight: "86px",
            color: "rgba(242,236,223,0.62)",
            letterSpacing: `${0.005 + 0.008 * EASE.inOut(prog(f, 748, 110))}em`,
          }}
        >
          motion is a language.
        </div>
      </div>

      {/* résumé block */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 770,
          height: 1,
          background: C.paper,
          opacity: 0.16,
          transform: `scaleX(${Math.max(0, hairScale)})`,
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 768,
          width: 26 * hair,
          height: 2,
          background: C.accent,
          opacity: hair * (1 - hairOut),
        }}
      />

      <Col
        f={f}
        x={96}
        align="left"
        start={750}
        primary="100% CODE-DRAWN"
        secondary="NO FOOTAGE · NO STOCK"
        orange
      />
      <Col
        f={f}
        x={720}
        align="left"
        start={754}
        primary="REEL 2026"
        secondary="SIX MOVEMENTS · 900 FRAMES"
      />
      <Col
        f={f}
        x={1824}
        align="right"
        start={758}
        primary="OPEN TO WORK"
        secondary="MOTION · TYPE · INTERFACE"
      />
    </AbsoluteFill>
  );
};
