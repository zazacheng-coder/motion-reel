export const W = 1920;
export const H = 1080;
export const FPS = 60;
export const DURATION = 900;
export const BPM = 120;
export const BEAT = 30;
export const TOTAL_BEATS = 30;

export const C = {
  void: "#0A0A0B",
  voidLift: "#111114",
  paper: "#F2ECDF",
  paperDeep: "#DDD3BF",
  accent: "#FF4A1C",
  paper70: "rgba(242,236,223,0.70)",
  paper55: "rgba(242,236,223,0.55)",
  paper38: "rgba(242,236,223,0.38)",
  paper24: "rgba(242,236,223,0.24)",
  paper16: "rgba(242,236,223,0.16)",
  paper08: "rgba(242,236,223,0.08)",
  void70: "rgba(10,10,11,0.70)",
  void55: "rgba(10,10,11,0.55)",
  void24: "rgba(10,10,11,0.24)",
  void16: "rgba(10,10,11,0.16)",
  void08: "rgba(10,10,11,0.08)",
} as const;

export const FONT = {
  display: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif',
  serif: '"Instrument Serif", "Times New Roman", serif',
  mono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
} as const;

/** 96px content margin; chrome sits outside it on a 64px frame. */
export const MARGIN = 96;
export const CHROME = 64;
export const RIGHT = W - MARGIN; // 1824
export const BASELINE = 560;

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const p = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${p[0]},${p[1]},${p[2]})`;
};

/** deterministic 0..1 noise for grain offsets and dot jitter */
export const hash01 = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};
