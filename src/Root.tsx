import { Composition } from "remotion";
import { MotionReel } from "./MotionReel";
import { DURATION, FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MotionReel"
      component={MotionReel}
      durationInFrames={DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
