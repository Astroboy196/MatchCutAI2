import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { KenBurns } from "../effects/KenBurns";
import {
  Dissolve, ColorDissolve, ZoomPunch, WhipPan, HardCut,
  Crossfade, Flash, SplitWipe, BeatSynced, BlurMorph,
} from "../effects/transitions";
import type { MatchCutTransition, MatchCutVideoProps } from "../types";

const TRANSITION_MAP: Record<MatchCutTransition, React.FC<{ sceneA: string; sceneB: string }>> = {
  "dissolve": Dissolve,
  "color-dissolve": ColorDissolve,
  "zoom-punch": ZoomPunch,
  "whip-pan": WhipPan,
  "hard-cut": HardCut,
  "crossfade": Crossfade,
  "flash": Flash,
  "split-wipe": SplitWipe,
  "beat-synced": BeatSynced,
  "blur-morph": BlurMorph,
};

export const MatchCutVideo: React.FC<MatchCutVideoProps> = ({
  sceneA,
  sceneB,
  transition,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // Scene A: first 40% with KenBurns
  // Transition: middle 20%
  // Scene B: last 40% with KenBurns
  const sceneAFrames = Math.floor(durationInFrames * 0.4);
  const transitionFrames = Math.floor(durationInFrames * 0.2);
  const sceneBStart = sceneAFrames + transitionFrames;
  const sceneBFrames = durationInFrames - sceneBStart;

  const TransitionComponent = TRANSITION_MAP[transition] || Crossfade;

  const srcA = sceneA.startsWith("data:") ? sceneA : `data:image/png;base64,${sceneA}`;
  const srcB = sceneB.startsWith("data:") ? sceneB : `data:image/png;base64,${sceneB}`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Scene A with KenBurns */}
      <Sequence from={0} durationInFrames={sceneAFrames + transitionFrames}>
        <KenBurns src={srcA} mode="zoom" />
      </Sequence>

      {/* Transition */}
      <Sequence from={sceneAFrames} durationInFrames={transitionFrames}>
        <TransitionComponent sceneA={srcA} sceneB={srcB} />
      </Sequence>

      {/* Scene B with KenBurns */}
      <Sequence from={sceneBStart} durationInFrames={sceneBFrames}>
        <KenBurns src={srcB} mode="dolly" />
      </Sequence>
    </AbsoluteFill>
  );
};
