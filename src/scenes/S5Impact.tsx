import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, W } from "../theme";
import { EASE, prog } from "../lib/anim";

const COLS = 5;
const ROWS = 7;
const CELL_W = 900;
const CELL_H = 320;
const PLANE_W = COLS * CELL_W;
const PLANE_H = ROWS * CELL_H;

const ROW_OPACITY = [0.16, 0.26, 0.38, 0.52, 0.68, 0.85, 1];

export const S5Impact: React.FC<{ f: number }> = ({ f }) => {
  const phase = (f - 600) * 0.11;
  const settle = EASE.out(prog(f, 600, 26));
  const amp = (95 + 210 * (1 - settle)) * (1 + 0.38 * Math.exp(-((f - 600) % 30) / 7));

  const dolly =
    1 + 0.5 * EASE.in(prog(f, 636, 46)) + 0.85 * EASE.in(prog(f, 682, 20));
  const slam = 1 + 0.055 * (1 - EASE.out(prog(f, 600, 9)));
  const scale = dolly * slam;

  const edge = 1080 * EASE.inOut(prog(f, 690, 12));
  const lineOn = prog(f, 690, 2) * (1 - prog(f, 700, 2));

  const rot = -9 + 2.2 * Math.sin((f - 600) / 54);
  const driftX = 34 * Math.sin((f - 600) / 46);
  const driftY = 26 * Math.sin((f - 600) / 61 + 1);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(${edge}px 0 0 0)`,
          WebkitClipPath: `inset(${edge}px 0 0 0)`,
          background: C.void,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            perspective: 2400,
            perspectiveOrigin: "50% 52%",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 560,
              width: 0,
              height: 0,
              transform: `translate(${driftX}px, ${driftY}px) scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -PLANE_W / 2,
                top: -PLANE_H / 2,
                width: PLANE_W,
                height: PLANE_H,
                transformStyle: "preserve-3d",
                transform: `rotateX(54deg) rotateZ(${rot}deg)`,
              }}
            >
              {Array.from({ length: ROWS }).map((_, row) =>
                Array.from({ length: COLS }).map((__, col) => {
                  const z =
                    amp *
                    Math.sin(col * 1.25 + row * 0.92 - phase) *
                    Math.cos(row * 0.45 + phase * 0.35);
                  const accent = row === col;
                  return (
                    <div
                      key={`${row}-${col}`}
                      style={{
                        position: "absolute",
                        left: col * CELL_W,
                        top: row * CELL_H,
                        width: CELL_W,
                        height: CELL_H,
                        transform: `translateZ(${z}px)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: ROW_OPACITY[row],
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT.display,
                          fontWeight: 700,
                          fontSize: 238,
                          lineHeight: 0.7,
                          letterSpacing: "-0.06em",
                          color: accent ? C.accent : C.paper,
                          whiteSpace: "nowrap",
                        }}
                      >
                        MOTION
                      </span>
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* the scan edge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: edge,
          width: W,
          height: 2,
          background: C.accent,
          opacity: lineOn,
        }}
      />
    </AbsoluteFill>
  );
};
