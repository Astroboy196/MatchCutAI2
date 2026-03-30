import type { MatchCutStyleId } from "@/types/matchcut";
import type { MatchCutTransition } from "./types";

export const STYLE_TO_TRANSITION: Record<MatchCutStyleId, MatchCutTransition> = {
  "silhouette-morph": "dissolve",
  "color-bleed": "color-dissolve",
  "scale-shift": "zoom-punch",
  "motion-flow": "whip-pan",
  "geometric-cut": "hard-cut",
  "texture-weave": "crossfade",
  "light-tunnel": "flash",
  "mirror-split": "split-wipe",
  "rhythm-pulse": "beat-synced",
  "dreamscape": "blur-morph",
};
