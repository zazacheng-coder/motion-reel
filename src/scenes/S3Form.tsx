import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { C, FONT, W } from "../theme";
import { EASE, SP, prog, sp } from "../lib/anim";
import { superellipse } from "../lib/shapes";

const CX = 960;
const CY = 560;
const COLS = 34;
const ROWS = 19;
const GAP = 56;

const clampNum = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** shape state at any frame, so ghosts can look backwards without state */
const shapeAt = (f: number) => {
  const grow = sp(f, 342, SP.snap, 36);
  const seg1 = sp(f, 376, SP.soft, 28);
  const seg2 = sp(f, 402, SP.soft, 28);
  const seg3 = sp(f, 424, SP.soft, 30);

  const n = 2 + 2.2 * seg1 + 5.3 * seg2 - 7.5 * seg3;
  const rot = 14 * seg1 + 28 * seg2 + 48 * seg3;
  const base = 7 + 203 * grow;
  const r = base - (base - 32) * seg3;
  return { n, rot, r, grow, seg3 };
};

const Grid: React.FC<{ f: number }> = ({ f }) => {
  const dots: React.ReactNode[] = [];
  const startX = CX - ((COLS - 1) * GAP) / 2;
  const startY = CY - ((ROWS - 1) * GAP) / 2;
  const phase = (f - 318) / 7.5;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = startX + col * GAP;
      const y = startY + row * GAP;
      const d = Math.hypot(x - CX, y - CY);
      const w = Math.max(0, Math.sin(d / 96 - phase)) * Math.exp(-d / 1250);
      const r = 2.4 + w * 4.6;
      const o = 0.13 + w * 0.17;
      dots.push(<circle key={`${row}-${col}`} cx={x} cy={y} r={r} fill={C.void} opacity={o} />);
    }
  }
  return (
    <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
      {dots}
    </svg>
  );
};

export const S3Form: React.FC<{ f: number }> = ({ f }) => {
  const shape = shapeAt(f);
  const path = superellipse(CX, CY, Math.max(0.5, shape.r), Math.max(2, shape.n), shape.rot);

  const ghosts = [6, 12, 18].map((back) => {
    const s = shapeAt(Math.max(342, f - back));
    return {
      d: superellipse(CX, CY, Math.max(0.5, s.r), Math.max(2, s.n), s.rot),
      o: [0.09, 0.06, 0.035][back / 6 - 1],
    };
  });

  const slide = EASE.inOut(prog(f, 454, 26));
  const travellerOn = f < 468 ? 1 : 0;
  const orbitAngle = -90 + (f - 342) * 3;
  const orbitRad = 262;

  const labelIn = EASE.out(prog(f, 344, 18));
  const readoutIn = EASE.out(prog(f, 352, 18));
  const sheetFade = 1 - prog(f, 476, 6);

  return (
    <AbsoluteFill>
      {/* paper sheet: grid, labels and orbit ride up and off */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${-slide * 1080}px)`,
          backgroundColor: C.paper,
          backgroundImage: `url(${staticFile("textures/paper.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: sheetFade,
        }}
      >
        <Grid f={f} />

        <div
          style={{
            position: "absolute",
            top: 316,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONT.mono,
            fontSize: 21,
            letterSpacing: "0.32em",
            color: C.void,
            opacity: 0.5 * labelIn,
            transform: `translateY(${(1 - labelIn) * 14}px)`,
          }}
        >
          SUPERELLIPSE
        </div>
        <div
          style={{
            position: "absolute",
            top: 348,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 64 * labelIn,
              height: 1,
              background: C.void,
              opacity: 0.35,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 812,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 28,
            fontFamily: FONT.mono,
            fontSize: 21,
            letterSpacing: "0.16em",
            color: C.void,
            opacity: 0.55 * readoutIn,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>n = {clampNum(shape.n, 2, 9.5).toFixed(2)}</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span>ROT = {shape.rot.toFixed(1)}°</span>
        </div>

        <div
          style={{
            position: "absolute",
            right: 64,
            top: 548,
            transform: "rotate(90deg)",
            transformOrigin: "right center",
            fontFamily: FONT.mono,
            fontSize: 15,
            letterSpacing: "0.3em",
            color: C.void,
            opacity: 0.35 * labelIn,
            whiteSpace: "nowrap",
          }}
        >
          CONTINUOUS FORM / 120 BPM
        </div>

        {/* orbit path and rider */}
        <svg width={W} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle
            cx={CX}
            cy={CY}
            r={orbitRad}
            fill="none"
            stroke={C.void}
            strokeWidth={1}
            strokeDasharray="2 7"
            opacity={0.28 * labelIn}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: CX + Math.cos((orbitAngle * Math.PI) / 180) * orbitRad - 5,
            top: CY + Math.sin((orbitAngle * Math.PI) / 180) * orbitRad - 5,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: C.accent,
            opacity: labelIn,
          }}
        />
      </div>

      {/* ghost trails of the morph */}
      <svg
        width={W}
        height={1080}
        style={{ position: "absolute", inset: 0, opacity: travellerOn }}
      >
        {ghosts.map((g, i) => (
          <path key={i} d={g.d} fill="none" stroke={C.void} strokeWidth={1.4} opacity={g.o} />
        ))}
        <path d={path} fill={C.void} />
      </svg>

    </AbsoluteFill>
  );
};
