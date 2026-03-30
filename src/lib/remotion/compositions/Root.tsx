import React from "react";
import { Composition } from "remotion";
import { MatchCutVideo } from "./MatchCutVideo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MC = MatchCutVideo as React.FC<any>;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MatchCut-16-9"
        component={MC}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ sceneA: "", sceneB: "", transition: "crossfade" }}
      />
      <Composition
        id="MatchCut-9-16"
        component={MC}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ sceneA: "", sceneB: "", transition: "crossfade" }}
      />
      <Composition
        id="MatchCut-1-1"
        component={MC}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ sceneA: "", sceneB: "", transition: "crossfade" }}
      />
    </>
  );
};
