// ── Core Analysis Types ──

export interface MatchCutAnalysis {
  subject: string;
  dominantColors: string[];
  mood: string;
  shapes: string[];
  motionDirection: string;
  suggestedMatchTargets: string[];
  keywords: string[];
}

// ── Input Types ──

export type InputType = "text" | "image" | "video";

export interface UserInput {
  type: InputType;
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
  videoFrames?: string[];
}

// ── Style Types ──

export type MatchCutStyleId =
  | "silhouette-morph"
  | "color-bleed"
  | "scale-shift"
  | "motion-flow"
  | "geometric-cut"
  | "texture-weave"
  | "light-tunnel"
  | "mirror-split"
  | "rhythm-pulse"
  | "dreamscape";

export interface MatchCutStyle {
  id: MatchCutStyleId;
  name: string;
  description: string;
  transitionType: string;
  icon: string;
}

export interface StylePreview {
  styleId: MatchCutStyleId;
  imageA: string | null;  // Scene A — user's scene
  imageB: string | null;  // Scene B — match target
  loading: boolean;
  error?: string;
}

// ── Video Types ──

export type VideoFormat = "9:16" | "16:9" | "1:1";

export const FORMAT_DIMENSIONS: Record<VideoFormat, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
};

// ── Flow State ──

export type FlowStep = "input" | "analyzing" | "styles" | "preview" | "exporting" | "done";
