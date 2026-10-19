import { Easing, spring } from "remotion";
import { FPS } from "../theme";

export const SP = {
  /** long, controlled settle — type, camera */
  soft: { damping: 200, mass: 1.1, stiffness: 110 },
  /** small overshoot — pills, stamps, dots */
  snap: { damping: 17, mass: 0.6, stiffness: 190 },
  /** a little more spring — the payoff */
  pop: { damping: 12, mass: 0.55, stiffness: 210 },
  /** very slow drift */
  slow: { damping: 200, mass: 1, stiffness: 55 },
} as const;

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  expoOut: Easing.bezier(0.19, 1, 0.22, 1),
  expoIn: Easing.bezier(0.7, 0, 0.84, 0),
};

export const sp = (
  frame: number,
  start: number,
  config: { damping: number; mass: number; stiffness: number } = SP.soft,
  durationInFrames?: number,
) =>
  spring({
    frame: Math.max(0, frame - start),
    fps: FPS,
    config,
    durationInFrames,
  });

/** 0..1 progress with clamping */
export const prog = (frame: number, start: number, duration: number) =>
  Math.min(1, Math.max(0, (frame - start) / duration));
