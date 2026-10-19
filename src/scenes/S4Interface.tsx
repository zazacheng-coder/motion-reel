import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, W } from "../theme";
import { EASE, SP, prog, sp } from "../lib/anim";

const CX = 960;
const CY = 560;

const CARD_W = 760;
const CARD_H = 400;
const CARD_L = CX - CARD_W / 2;
const CARD_T = CY - CARD_H / 2;

const Cursor: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <svg
    width={34}
    height={40}
    viewBox="0 0 34 40"
    style={{ position: "absolute", left: x, top: y, opacity }}
  >
    <path
      d="M1 1 L1 29 L8.6 21.8 L13.2 33.6 L18.6 31.4 L14 19.9 L24.6 19.9 Z"
      fill={C.paper}
      stroke={C.void}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);

export const S4Interface: React.FC<{ f: number }> = ({ f }) => {
  // card border draws on, then unwinds into the line
  const drawIn = EASE.out(prog(f, 470, 24));
  const drawOut = EASE.inOut(prog(f, 566, 12));
  const draw = f < 566 ? drawIn : 1 - drawOut;
  const contentOp = 1 - EASE.inOut(prog(f, 564, 10));

  // pill geometry: 64 ring -> SEND -> 64 -> SENT -> full-width line
  const p1 = sp(f, 478, SP.snap, 20);
  const p2 = sp(f, 514, SP.snap, 12);
  const p3 = sp(f, 538, SP.snap, 16);
  const lineT = EASE.inOut(prog(f, 566, 18));
  let pw = 64 + 166 * p1 - 166 * p2 + 216 * p3;
  let ph = 64;
  let pr = 32;
  if (lineT > 0) {
    pw = 280 + (1920 - 280) * lineT;
    ph = 64 - 62 * lineT;
    pr = 32 - 31 * lineT;
  }
  pw = Math.max(2, pw);
  ph = Math.max(2, ph);

  const fillT = EASE.out(prog(f, 512, 6));
  const hover = EASE.out(prog(f, 504, 8)) * (1 - prog(f, 512, 4));
  const dip =
    f >= 512 ? 1 - 0.028 * EASE.out(prog(f, 512, 3)) * (1 - EASE.out(prog(f, 515, 4))) : 1;

  // cursor path: enters at 490, clicks at 508, leaves at 548
  const arrive = sp(f, 490, SP.soft, 24);
  const ax = 1280;
  const ay = 860;
  const cx = 1140;
  const cy = 730;
  const tx = 1040;
  const ty = 560;
  // quadratic through control point
  const bx = (1 - arrive) * (1 - arrive) * ax + 2 * (1 - arrive) * arrive * cx + arrive * arrive * tx;
  const by = (1 - arrive) * (1 - arrive) * ay + 2 * (1 - arrive) * arrive * cy + arrive * arrive * ty;
  const wob = f > 509 ? Math.exp(-(f - 509) / 7) * Math.sin((f - 509) / 2.6) * 6 : 0;
  const leave = EASE.inOut(prog(f, 534, 18));
  const cursorX = (bx + wob) * (1 - leave) + 1180 * leave;
  const cursorY = (by + wob) * (1 - leave) + 760 * leave;
  const cursorOp = (f >= 490 ? 1 : 0) * (1 - prog(f, 540, 14));
  const clickRing = f >= 512 ? prog(f, 512, 16) : 0;

  // spinner + check
  const spinOp = prog(f, 516, 4) * (1 - prog(f, 530, 5));
  const spinRot = (f - 516) * 26;
  const checkDraw = EASE.out(prog(f, 530, 9));
  const checkOp = f >= 530 ? 1 - prog(f, 538, 6) : 0;

  const sendOp = prog(f, 486, 8) * (1 - prog(f, 512, 5));
  const sentIn = sp(f, 540, SP.soft, 14);

  const copySwap = EASE.inOut(prog(f, 538, 9));
  const statusOn = EASE.out(prog(f, 538, 8)) * 0.6 + 0.4;
  const dotPulse = 1 + (f > 582 ? Math.exp(-((f % 30) / 5)) * 0.08 : 0);
  const lineDot = sp(f, 582, SP.pop, 12);
  const serifIn = sp(f, 480, SP.soft, 20);

  return (
    <AbsoluteFill>
      {/* card border */}
      <svg
        width={CARD_W}
        height={CARD_H}
        viewBox={`0 0 ${CARD_W} ${CARD_H}`}
        style={{ position: "absolute", left: CARD_L, top: CARD_T }}
      >
        <rect
          x={0.5}
          y={0.5}
          width={CARD_W - 1}
          height={CARD_H - 1}
          rx={24}
          fill="none"
          stroke={C.paper}
          strokeWidth={1}
          opacity={0.22}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
        />
      </svg>

      {/* card content */}
      <div style={{ position: "absolute", inset: 0, opacity: contentOp }}>
        <div
          style={{
            position: "absolute",
            left: CARD_L + 40,
            top: CARD_T + 38,
            fontFamily: FONT.mono,
            fontSize: 18,
            letterSpacing: "0.26em",
            color: C.paper,
            opacity: 0.45 * EASE.out(prog(f, 482, 14)),
          }}
        >
          NEW BRIEF
        </div>
        <div
          style={{
            position: "absolute",
            left: CARD_L + CARD_W - 48,
            top: CARD_T + 42,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: C.accent,
            opacity: 0.55 * statusOn,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: CARD_L + 40,
            width: CARD_W - 80,
            top: CARD_T + CARD_H - 60,
            height: 1,
            background: C.paper,
            opacity: 0.1 * EASE.out(prog(f, 486, 12)),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: CARD_L + 40,
            top: CARD_T + CARD_H - 40,
            fontFamily: FONT.mono,
            fontSize: 14,
            letterSpacing: "0.24em",
            color: C.paper,
            opacity: 0.28 * EASE.out(prog(f, 488, 12)),
          }}
        >
          MOTION / INTERFACE
        </div>
        <div
          style={{
            position: "absolute",
            right: W - (CARD_L + CARD_W - 40),
            top: CARD_T + CARD_H - 40,
            fontFamily: FONT.mono,
            fontSize: 14,
            letterSpacing: "0.24em",
            color: C.paper,
            opacity: 0.28 * EASE.out(prog(f, 490, 12)),
          }}
        >
          120 BPM
        </div>

        {/* serif copy with a mask swap on success */}
        <div
          style={{
            position: "absolute",
            left: CARD_L + 40,
            top: CARD_T + 70,
            width: CARD_W - 80,
            height: 100,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              height: 100,
              transform: `translateY(${(1 - serifIn) * 100}px)`,
              fontFamily: FONT.serif,
              fontStyle: "italic",
              fontSize: 58,
              lineHeight: "70px",
              color: C.paper,
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: -copySwap * 70,
                opacity: 1 - copySwap,
              }}
            >
              ready when you are.
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: (1 - copySwap) * 70,
                opacity: copySwap,
              }}
            >
              brief received.
            </div>
          </div>
        </div>
      </div>

      {/* the button: ring -> pill -> paper -> line */}
      <div
        style={{
          position: "absolute",
          left: CX - pw / 2,
          top: CY - ph / 2,
          width: pw,
          height: ph,
          borderRadius: pr,
          border: `1.6px solid ${C.paper}`,
          borderColor: `rgba(242,236,223,${0.55 + 0.45 * hover})`,
          background: `rgba(242,236,223,${fillT})`,
          transform: `scale(${dip})`,
          overflow: "hidden",
        }}
      >
        {/* SEND */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT.mono,
            fontSize: 20,
            letterSpacing: "0.28em",
            textIndent: "0.28em",
            color: C.paper,
            opacity: sendOp,
            transform: `translateY(${(1 - prog(f, 486, 10)) * 14}px)`,
          }}
        >
          SEND
        </div>

        {/* spinner */}
        <svg
          width={40}
          height={40}
          viewBox="0 0 40 40"
          style={{
            position: "absolute",
            left: 12,
            top: 12,
            opacity: spinOp,
            transform: `rotate(${spinRot}deg)`,
          }}
        >
          <circle
            cx={20}
            cy={20}
            r={9}
            fill="none"
            stroke={C.void}
            strokeWidth={2.4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.22 1"
          />
        </svg>

        {/* check */}
        <svg
          width={40}
          height={40}
          viewBox="0 0 40 40"
          style={{ position: "absolute", left: 12, top: 12, opacity: checkOp }}
        >
          <path
            d="M11 20.5 L17 26 L29 13.5"
            fill="none"
            stroke={C.void}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - checkDraw}
          />
        </svg>

        {/* SENT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT.mono,
            fontSize: 20,
            letterSpacing: "0.28em",
            textIndent: "0.28em",
            color: C.void,
            opacity: sentIn,
            transform: `translateY(${(1 - sentIn) * 14}px)`,
          }}
        >
          SENT
        </div>
      </div>

      {/* click feedback */}
      {clickRing > 0 && clickRing < 1 && (
        <div
          style={{
            position: "absolute",
            left: tx - 10 - clickRing * 24,
            top: ty - 10 - clickRing * 24,
            width: 20 + clickRing * 48,
            height: 20 + clickRing * 48,
            borderRadius: "50%",
            border: `1px solid ${C.accent}`,
            opacity: 0.6 * (1 - clickRing),
          }}
        />
      )}

      <Cursor x={cursorX} y={cursorY} opacity={cursorOp} />

      {/* the dot at the line, just before the drop */}
      <div
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          width: 0,
          height: 0,
          transform: `scale(${lineDot})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -7,
            top: -7,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: C.accent,
            transform: `scale(${dotPulse})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -7,
            top: -7,
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: `1px solid ${C.accent}`,
            transform: `scale(${1 + 10 * EASE.out(prog(f, 584, 26))})`,
            opacity: 0.45 * (1 - prog(f, 584, 26)),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
