import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../theme";
import { EASE, SP, prog, sp } from "../lib/anim";

const SIZE = 300;

const Line: React.FC<{
  f: number;
  text: string;
  baseline: number;
  align: "left" | "right";
  start: number;
  exit: number;
  drift: number;
}> = ({ f, text, baseline, align, start, exit, drift }) => {
  const s = sp(f, start, SP.soft, 30);
  const out = EASE.in(prog(f, exit, 12));
  const y = (1 - s) * 330 + out * 330;
  const x = drift * (s - out * 0.6);

  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 96,
        bottom: 1080 - baseline,
        height: 286,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateY(${y}px) translateX(${x}px)`,
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: SIZE,
          lineHeight: 0.68,
          letterSpacing: "-0.05em",
          color: C.void,
          textAlign: align,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const S2Statement: React.FC<{ f: number }> = ({ f }) => {
  // flood: burst out at 210, hold, then contract into the dot
  const floodIn = EASE.expoOut(prog(f, 210, 26));
  const floodOut = EASE.inOut(prog(f, 314, 28));
  const radius = f < 314 ? 1210 * floodIn : 1210 * (1 - floodOut);

  const label = EASE.out(prog(f, 238, 16)) * (1 - prog(f, 308, 10));

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.accent,
          clipPath: `circle(${Math.max(0, radius)}px at 960px 560px)`,
          WebkitClipPath: `circle(${Math.max(0, radius)}px at 960px 560px)`,
        }}
      />

      <div style={{ position: "absolute", inset: 0, opacity: label }}>
        <Line
          f={f}
          text="MOVE"
          baseline={330}
          align="left"
          start={240}
          exit={306}
          drift={-6}
        />
        <Line
          f={f}
          text="WITH"
          baseline={590}
          align="right"
          start={248}
          exit={310}
          drift={8}
        />
        <Line
          f={f}
          text="INTENT"
          baseline={850}
          align="left"
          start={256}
          exit={314}
          drift={-4}
        />
      </div>
    </AbsoluteFill>
  );
};
