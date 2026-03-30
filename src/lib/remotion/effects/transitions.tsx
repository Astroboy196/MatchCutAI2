import React from "react";
import { Img, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

interface TransitionProps {
  sceneA: string;
  sceneB: string;
}

// ── 1. Dissolve (Silhouette Morph) ──
export const Dissolve: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const opacity = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ width, height, position: "relative" }}>
      <Img src={sceneA} style={{ ...full(width, height), opacity: 1 - opacity }} />
      <Img src={sceneB} style={{ ...full(width, height), opacity, position: "absolute", top: 0, left: 0 }} />
    </div>
  );
};

// ── 2. Color Dissolve ──
export const ColorDissolve: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  const colorOpacity = progress < 0.5
    ? interpolate(progress, [0, 0.5], [0, 1])
    : interpolate(progress, [0.5, 1], [1, 0]);
  const showB = progress > 0.4;

  return (
    <div style={{ width, height, position: "relative" }}>
      <Img src={showB ? sceneB : sceneA} style={full(width, height)} />
      <div style={{
        ...abs(width, height),
        background: "radial-gradient(circle, rgba(108,60,224,0.8), rgba(0,212,255,0.6))",
        opacity: colorOpacity * 0.7,
        mixBlendMode: "overlay",
      }} />
    </div>
  );
};

// ── 3. Zoom Punch (Scale Shift) ──
export const ZoomPunch: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateRight: "clamp",
  });

  const scaleA = interpolate(progress, [0, 0.5], [1, 3], { extrapolateRight: "clamp" });
  const scaleB = interpolate(progress, [0.5, 1], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showB = progress > 0.45;

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      {!showB ? (
        <Img src={sceneA} style={{ ...full(width, height), transform: `scale(${scaleA})`, transformOrigin: "center" }} />
      ) : (
        <Img src={sceneB} style={{ ...full(width, height), transform: `scale(${scaleB})`, transformOrigin: "center" }} />
      )}
    </div>
  );
};

// ── 4. Whip Pan (Motion Flow) ──
export const WhipPan: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateRight: "clamp",
  });

  const offsetA = interpolate(progress, [0, 0.5], [0, -width], { extrapolateRight: "clamp" });
  const offsetB = interpolate(progress, [0.5, 1], [width, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = progress > 0.2 && progress < 0.8 ? interpolate(progress, [0.2, 0.5, 0.8], [0, 20, 0]) : 0;

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <Img src={sceneA} style={{ ...full(width, height), transform: `translateX(${offsetA}px)`, filter: `blur(${blur}px)` }} />
      <Img src={sceneB} style={{ ...abs(width, height), transform: `translateX(${offsetB}px)`, filter: `blur(${blur}px)` }} />
    </div>
  );
};

// ── 5. Hard Cut (Geometric) ──
export const HardCut: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const showB = frame >= Math.floor(durationInFrames / 2);

  return (
    <div style={{ width, height }}>
      <Img src={showB ? sceneB : sceneA} style={full(width, height)} />
    </div>
  );
};

// ── 6. Crossfade (Texture Weave) ──
export const Crossfade: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateRight: "clamp",
  });

  const scaleA = interpolate(progress, [0, 1], [1, 1.08]);
  const scaleB = interpolate(progress, [0, 1], [1.08, 1]);

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <Img src={sceneA} style={{ ...full(width, height), opacity: 1 - progress, transform: `scale(${scaleA})`, transformOrigin: "center" }} />
      <Img src={sceneB} style={{ ...abs(width, height), opacity: progress, transform: `scale(${scaleB})`, transformOrigin: "center" }} />
    </div>
  );
};

// ── 7. Flash (Light Tunnel) ──
export const Flash: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  const flashOpacity = progress < 0.5
    ? interpolate(progress, [0.3, 0.5], [0, 1], { extrapolateLeft: "clamp" })
    : interpolate(progress, [0.5, 0.7], [1, 0], { extrapolateRight: "clamp" });
  const showB = progress > 0.5;

  return (
    <div style={{ width, height, position: "relative" }}>
      <Img src={showB ? sceneB : sceneA} style={full(width, height)} />
      <div style={{ ...abs(width, height), backgroundColor: "white", opacity: flashOpacity }} />
    </div>
  );
};

// ── 8. Split Wipe (Mirror Split) ──
export const SplitWipe: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <Img src={sceneA} style={full(width, height)} />
      <div style={{
        position: "absolute", top: 0, left: 0, width, height,
        clipPath: `inset(0 ${100 - progress}% 0 0)`,
      }}>
        <Img src={sceneB} style={full(width, height)} />
      </div>
    </div>
  );
};

// ── 9. Beat Synced (Rhythm Pulse) ──
export const BeatSynced: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  const beat = Math.sin(progress * Math.PI * 6) * 0.5 + 0.5;
  const scale = 1 + beat * 0.04;
  const showB = progress > 0.5;
  const opacity = showB
    ? interpolate(progress, [0.45, 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden", backgroundColor: "#000" }}>
      <Img
        src={showB ? sceneB : sceneA}
        style={{ ...full(width, height), transform: `scale(${scale})`, transformOrigin: "center", opacity }}
      />
    </div>
  );
};

// ── 10. Blur Morph (Dreamscape) ──
export const BlurMorph: React.FC<TransitionProps> = ({ sceneA, sceneB }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  const blurA = interpolate(progress, [0, 0.5], [0, 30], { extrapolateRight: "clamp" });
  const blurB = interpolate(progress, [0.5, 1], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(progress, [0.3, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = 1 + Math.sin(progress * Math.PI) * 0.1;

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <Img src={sceneA} style={{
        ...full(width, height),
        filter: `blur(${blurA}px)`,
        opacity: 1 - opacityB * 0.8,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }} />
      <Img src={sceneB} style={{
        ...abs(width, height),
        filter: `blur(${blurB}px)`,
        opacity: opacityB,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }} />
    </div>
  );
};

// ── Helpers ──
function full(w: number, h: number): React.CSSProperties {
  return { width: w, height: h, objectFit: "cover" as const };
}

function abs(w: number, h: number): React.CSSProperties {
  return { position: "absolute" as const, top: 0, left: 0, width: w, height: h, objectFit: "cover" as const };
}
