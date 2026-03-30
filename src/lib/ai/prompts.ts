import type { MatchCutAnalysis } from "@/types/matchcut";

// ── Analysis Prompts ──

export const ANALYZE_IMAGE_PROMPT = `You are a cinematic match cut expert. Analyze this image and return a JSON object with:

{
  "subject": "brief description of the main subject and scene",
  "dominantColors": ["#hex1", "#hex2", "#hex3"] (top 3 colors),
  "mood": "one word mood (e.g. joyful, dramatic, serene, mysterious, energetic)",
  "shapes": ["dominant shapes in the scene (e.g. circular, angular, flowing, vertical, horizontal)"],
  "motionDirection": "implied motion direction (e.g. left-to-right, expanding, rising, static, spiraling)",
  "suggestedMatchTargets": ["5 creative match cut target scenes that would create a visually satisfying transition from this image"],
  "keywords": ["5 visual keywords describing the image"]
}

Be creative with match targets — think like a film editor. Match cuts should connect through shape, color, movement, or conceptual similarity.`;

export const ANALYZE_TEXT_PROMPT = `You are a cinematic match cut expert. The user described a scene with text. Based on this description, return a JSON object with:

{
  "subject": "the described scene",
  "dominantColors": ["#hex1", "#hex2", "#hex3"] (imagined colors for this scene),
  "mood": "one word mood",
  "shapes": ["dominant shapes you'd expect in this scene"],
  "motionDirection": "implied motion direction",
  "suggestedMatchTargets": ["5 creative match cut target scenes"],
  "keywords": ["5 visual keywords"]
}

Be cinematic and creative. Think like a film director composing the perfect match cut transition.

User's description: `;

// ── Style Generation Prompts ──

export function getStylePrompt(
  analysis: MatchCutAnalysis,
  styleName: string,
  styleDescription: string,
): string {
  return `Create a cinematic match cut image pair. This is a split-frame composition showing Scene A transitioning into Scene B.

SCENE A (left side): ${analysis.subject}
- Colors: ${analysis.dominantColors.join(", ")}
- Mood: ${analysis.mood}
- Key shapes: ${analysis.shapes.join(", ")}

SCENE B (right side): ${analysis.suggestedMatchTargets[0]}

MATCH CUT STYLE: "${styleName}" — ${styleDescription}

The image should show both scenes in a single frame with a visible transition point in the center.
The transition should demonstrate the "${styleName}" match cut technique.
Aspect ratio: 16:9. Cinematic color grading, professional film quality.
No text, no watermarks, no UI elements.`;
}
