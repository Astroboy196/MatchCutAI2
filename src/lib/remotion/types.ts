export type MatchCutTransition =
  | "dissolve"
  | "color-dissolve"
  | "zoom-punch"
  | "whip-pan"
  | "hard-cut"
  | "crossfade"
  | "flash"
  | "split-wipe"
  | "beat-synced"
  | "blur-morph";

export type VideoFormat = "16:9" | "9:16" | "1:1";

export const FORMAT_DIMS: Record<VideoFormat, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
};

export interface MatchCutVideoProps {
  sceneA: string; // base64 image
  sceneB: string; // base64 image
  transition: MatchCutTransition;
  durationInSeconds?: number;
}
