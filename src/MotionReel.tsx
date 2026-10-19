import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { Chrome } from "./components/Chrome";
import { FontLoader } from "./components/FontLoader";
import { Grain } from "./components/Grain";
import { C, FONT, clamp } from "./theme";
import { S1Signal } from "./scenes/S1Signal";
import { S2Statement } from "./scenes/S2Statement";
import { S3Form } from "./scenes/S3Form";
import { S4Interface } from "./scenes/S4Interface";
import { S5Impact } from "./scenes/S5Impact";
import { S6Outro } from "./scenes/S6Outro";

const Vignette: React.FC<{ f: number }> = ({ f }) => {
  // paper and orange worlds want a softer vignette than the void
  const light = interpolate(f, [300, 330, 444, 468], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(118% 96% at 50% 44%, rgba(0,0,0,0) 36%, rgba(0,0,0,${0.36 - light * 0.2}) 100%)`,
      }}
    />
  );
};

const RoomLight: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        "radial-gradient(62% 52% at 50% 42%, rgba(242,236,223,0.055) 0%, rgba(242,236,223,0.018) 48%, rgba(0,0,0,0) 78%)",
    }}
  />
);

export const MotionReel: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.void, overflow: "hidden", fontFamily: FONT.display }}>
      <FontLoader />
      <Audio src={staticFile("audio/reel-mix.wav")} />

      <RoomLight />

      {/* scenes, back to front */}
      {f >= 460 && f < 600 && <S4Interface f={f} />}
      {f >= 688 && <S6Outro f={f} />}
      {f >= 600 && f < 702 && <S5Impact f={f} />}
      {f >= 312 && f < 486 && <S3Form f={f} />}
      {f < 240 && <S1Signal f={f} />}
      {f >= 208 && f < 344 && <S2Statement f={f} />}

      <Chrome f={f} />
      <Grain f={f} />
      <Vignette f={f} />
    </AbsoluteFill>
  );
};
