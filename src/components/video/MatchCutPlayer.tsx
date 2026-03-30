"use client";

import { Player } from "@remotion/player";
import { MatchCutVideo } from "@/lib/remotion/compositions/MatchCutVideo";
import type { MatchCutTransition } from "@/lib/remotion/types";

interface MatchCutPlayerProps {
  sceneA: string;
  sceneB: string;
  transition: MatchCutTransition;
  format?: "16:9" | "9:16" | "1:1";
}

const DIMS = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
};

export function MatchCutPlayer({
  sceneA,
  sceneB,
  transition,
  format = "16:9",
}: MatchCutPlayerProps) {
  const { width, height } = DIMS[format];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#2A2A3A] bg-black">
      <Player
        component={MatchCutVideo}
        inputProps={{ sceneA, sceneB, transition }}
        durationInFrames={150}
        fps={30}
        compositionWidth={width}
        compositionHeight={height}
        style={{ width: "100%" }}
        controls
        loop
        autoPlay
      />
    </div>
  );
}
