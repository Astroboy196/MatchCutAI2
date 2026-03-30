import type { MatchCutStyle, MatchCutStyleId } from "@/types/matchcut";

export const MATCH_CUT_STYLES: MatchCutStyle[] = [
  {
    id: "silhouette-morph",
    name: "Silhouette Morph",
    description: "Subject outline morphs into a new scene through shape-based dissolve",
    transitionType: "dissolve",
    icon: "ghost",
  },
  {
    id: "color-bleed",
    name: "Color Bleed",
    description: "Dominant color bridges two scenes through a color-matching dissolve",
    transitionType: "color-dissolve",
    icon: "palette",
  },
  {
    id: "scale-shift",
    name: "Scale Shift",
    description: "Macro to wide or reverse — a zoom punch that reframes the world",
    transitionType: "zoom-punch",
    icon: "search",
  },
  {
    id: "motion-flow",
    name: "Motion Flow",
    description: "Movement direction carries through the cut — a whip pan bridge",
    transitionType: "whip-pan",
    icon: "wind",
  },
  {
    id: "geometric-cut",
    name: "Geometric Cut",
    description: "Circles, lines, and arcs match across scenes in a hard cut",
    transitionType: "hard-cut",
    icon: "hexagon",
  },
  {
    id: "texture-weave",
    name: "Texture Weave",
    description: "Surface texture patterns link scenes through a crossfade",
    transitionType: "crossfade",
    icon: "layers",
  },
  {
    id: "light-tunnel",
    name: "Light Tunnel",
    description: "Exposure-based bridge — bright flash or blown-out light transition",
    transitionType: "flash",
    icon: "sun",
  },
  {
    id: "mirror-split",
    name: "Mirror Split",
    description: "Symmetrical composition flips into the next scene",
    transitionType: "split-wipe",
    icon: "flip-horizontal",
  },
  {
    id: "rhythm-pulse",
    name: "Rhythm Pulse",
    description: "Beat-synced cuts that pulse with musical rhythm",
    transitionType: "beat-synced",
    icon: "music",
  },
  {
    id: "dreamscape",
    name: "Dreamscape",
    description: "Surreal blur-morph with AI-hallucinated intermediate frames",
    transitionType: "blur-morph",
    icon: "sparkles",
  },
];

export function getStyleById(id: MatchCutStyleId): MatchCutStyle | undefined {
  return MATCH_CUT_STYLES.find((s) => s.id === id);
}
