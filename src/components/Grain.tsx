import React from "react";
import { staticFile } from "remotion";
import { hash01 } from "../theme";

/**
 * Film grain. A single 1024² tile stretched to 1980², shifted every other
 * frame by a deterministic hash, so it boils like 35mm rather than TV static.
 * Frozen to offset 0 for the last 12 frames so frame 899 matches frame 0.
 */
export const Grain: React.FC<{ f: number }> = ({ f }) => {
  const phase = f >= 888 ? 0 : Math.floor(f / 2) % 60;
  const ox = Math.round(hash01(phase * 7 + 1) * 120);
  const oy = Math.round(hash01(phase * 13 + 5) * 120);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `url(${staticFile("textures/grain.png")})`,
        backgroundSize: "1980px 1980px",
        backgroundPosition: `${-ox}px ${-oy}px`,
        opacity: 0.55,
      }}
    />
  );
};
