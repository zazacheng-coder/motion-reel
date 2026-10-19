export type ShapeSpec = {
  d: string;
  n: number;
  rot: number;
  r: number;
};

/** Superellipse |x|^n + |y|^n = 1, sampled as a closed polygon. */
export const superellipse = (
  cx: number,
  cy: number,
  radius: number,
  n: number,
  rotDeg: number,
  points = 200,
): string => {
  const rot = (rotDeg * Math.PI) / 180;
  const cr = Math.cos(rot);
  const sr = Math.sin(rot);
  const parts: string[] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const r =
      radius *
      Math.pow(Math.pow(Math.abs(c), n) + Math.pow(Math.abs(s), n), -1 / n);
    const x = c * r;
    const y = s * r;
    parts.push(`${(cx + x * cr - y * sr).toFixed(2)} ${(cy + x * sr + y * cr).toFixed(2)}`);
  }
  return `M${parts.join(" L ")} Z`;
};
