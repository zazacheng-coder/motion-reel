import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BASELINE, C, FONT, W, clamp } from "../theme";
import { EASE, SP, prog, sp } from "../lib/anim";

const SIZE = 340;
const TITLE = "MOTION";
const GROUP_BOTTOM = 1080 - BASELINE;

const TickRow: React.FC<{
  baseline: number;
  target: number;
  delay: number;
  opacity: number;
  f: number;
}> = ({ baseline, target, delay, opacity, f }) => {
  const slide =
    f < 184 ? EASE.out(prog(f, 158 + delay, 26)) : 1 - 0.92 * EASE.inOut(prog(f, 188, 12));
  const enter = EASE.out(prog(f, 154 + delay, 16));
  const x = target * slide;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: baseline - 280,
        height: 280,
        overflow: "hidden",
        opacity: opacity * enter,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: `translateX(calc(-50% + ${x}px))`,
          display: "flex",
          alignItems: "flex-end",
          whiteSpace: "nowrap",
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: SIZE,
          lineHeight: 0.68,
          letterSpacing: "-0.055em",
          color: C.paper,
        }}
      >
        {[0, 1, 2].map((i) => (
          <React.Fragment key={i}>
            <span style={{ display: "block" }}>{TITLE}</span>
            {i < 2 && (
              <span
                style={{
                  display: "block",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: C.accent,
                  marginLeft: 52,
                  marginRight: 52,
                  marginBottom: 82,
                  flexShrink: 0,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const S1Signal: React.FC<{ f: number }> = ({ f }) => {
  // dot -> rule
  const grow = sp(f, 30, SP.snap, 30);
  const retract = sp(f, 104, SP.soft, 22);
  const sx = f < 104 ? grow : 1 - retract;
  const ruleH =
    f < 104 ? interpolate(grow, [0, 1], [14, 2], clamp) : interpolate(retract, [0, 1], [2, 14], clamp);
  const ruleOpacity = f < 30 ? 0 : 1 - interpolate(retract, [0.9, 1], [0, 1], clamp);

  // the opening dot exists until the rule takes over
  const dotOpacity = 1 - prog(f, 28, 8);
  const breath = 1 + 0.14 * Math.sin((Math.PI * 2 * f) / 30) * (f > 2 ? 1 : 0);
  const ringT = EASE.out(prog(f, 2, 34));
  const ringScale = 1 + ringT * 11;

  const letters = TITLE.split("");

  // wordmark hold: a 1.2% camera push + period pulse
  const hold = interpolate(f, [120, 156], [0, 1], clamp);
  const push = 1 + hold * 0.012;
  const beatPulse = f > 120 ? Math.exp(-((f % 30) / 5)) * 0.08 : 0;

  // ticker collapse into the dot
  const collapse = EASE.in(prog(f, 198, 10));
  const tickerOpacity = 1 - prog(f, 204, 7);
  const returnDot = sp(f, 200, SP.pop, 10);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${push})`,
          transformOrigin: `50% ${BASELINE}px`,
        }}
      >
        {/* the rule + word + period live in one measured group */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: GROUP_BOTTOM,
            height: 340,
            opacity: f < 154 ? 1 : 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 0,
              transform: "translateX(-50%)",
              height: 340,
              width: "max-content",
            }}
          >
            {/* invisible sizer gives the absolutely-positioned mask its width */}
            <div
              style={{
                visibility: "hidden",
                fontFamily: FONT.display,
                fontWeight: 700,
                fontSize: SIZE,
                lineHeight: 0.68,
                letterSpacing: "-0.055em",
                whiteSpace: "nowrap",
              }}
            >
              {TITLE}
            </div>

            {/* mask: letters rise from behind the baseline */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 340,
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
                  letterSpacing: "-0.055em",
                  color: C.paper,
                  whiteSpace: "nowrap",
                }}
              >
                {letters.map((ch, i) => (
                  <span
                    key={i}
                    style={{
                      display: "block",
                      transform: `translateY(${(1 - sp(f, 66 + i * 4, SP.soft, 34)) * 360}px)`,
                    }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            {/* the rule: dot at 30, full line at 60, retracts into the period at 126 */}
            <div
              style={{
                position: "absolute",
                right: -23,
                left: 0,
                bottom: 0,
                height: ruleH,
                borderRadius: ruleH / 2,
                background: C.accent,
                transform: `scaleX(${Math.max(0, sx)})`,
                transformOrigin: "right center",
                opacity: ruleOpacity,
              }}
            />

            {/* period dot */}
            <div
              style={{
                position: "absolute",
                left: "100%",
                bottom: -2,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: C.accent,
                marginLeft: 14,
                transform: `scale(${(f < 104 ? 0 : sp(f, 104, SP.snap, 18)) * (1 + beatPulse)})`,
                opacity: f < 154 ? 1 : 0,
              }}
            />
          </div>
        </div>
      </div>

      {/* opening dot + ring, centred */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: BASELINE,
          width: 0,
          height: 0,
          opacity: dotOpacity,
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
            transform: `scale(${breath})`,
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
            transform: `scale(${ringScale})`,
            opacity: f < 2 ? 0 : (1 - ringT) * 0.55,
          }}
        />
      </div>

      {/* ticker: the title multiplies, slides, then compresses back to the dot */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scaleY(${1 - 0.985 * collapse})`,
          transformOrigin: `50% ${BASELINE}px`,
          opacity: tickerOpacity,
        }}
      >
        <TickRow f={f} baseline={230} target={-190} delay={6} opacity={0.32} />
        <TickRow f={f} baseline={560} target={230} delay={0} opacity={1} />
        <TickRow f={f} baseline={890} target={-150} delay={12} opacity={0.32} />
      </div>

      {/* the dot the type collapses into */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: BASELINE,
          width: 0,
          height: 0,
          transform: `scale(${returnDot})`,
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
            transform: `scale(${1 + 8 * EASE.out(prog(f, 202, 26))})`,
            opacity: 0.5 * (1 - prog(f, 202, 26)),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
