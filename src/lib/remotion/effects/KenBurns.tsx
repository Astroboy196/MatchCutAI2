import React from "react";
import { Img, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

type CameraMode = "pan" | "zoom" | "orbit" | "dolly" | "reveal" | "static";

interface KenBurnsProps {
  src: string;
  mode?: CameraMode;
}

const PRESETS: Record<CameraMode, { s0: number; s1: number; x0: number; x1: number; y0: number; y1: number }> = {
  zoom:   { s0: 1.0,  s1: 1.25, x0: 0,  x1: 0,  y0: 0,  y1: 0 },
  pan:    { s0: 1.15, s1: 1.15, x0: -8, x1: 8,  y0: 0,  y1: 0 },
  orbit:  { s0: 1.1,  s1: 1.2,  x0: -5, x1: 5,  y0: -3, y1: 3 },
  dolly:  { s0: 1.3,  s1: 1.0,  x0: 0,  x1: 0,  y0: 0,  y1: 0 },
  reveal: { s0: 1.5,  s1: 1.0,  x0: 5,  x1: 0,  y0: 5,  y1: 0 },
  static: { s0: 1.05, s1: 1.05, x0: 0,  x1: 0,  y0: 0,  y1: 0 },
};

export const KenBurns: React.FC<KenBurnsProps> = ({ src, mode = "zoom" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const p = PRESETS[mode];

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [p.s0, p.s1]);
  const tx = interpolate(progress, [0, 1], [p.x0, p.x1]);
  const ty = interpolate(progress, [0, 1], [p.y0, p.y1]);

  return (
    <div style={{ width, height, overflow: "hidden", position: "relative" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};
