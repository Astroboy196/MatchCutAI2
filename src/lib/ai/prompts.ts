import type { MatchCutAnalysis } from "@/types/matchcut";

// ── Analysis Prompts ──

export const ANALYZE_IMAGE_PROMPT = `You are a cinematic match cut expert. Analyze this image and return a JSON object with:

{
  "subject": "brief description of the main subject and scene",
  "dominantColors": ["#hex1", "#hex2", "#hex3"] (top 3 colors),
  "mood": "one word mood (e.g. joyful, dramatic, serene, mysterious, energetic)",
  "shapes": ["dominant shapes in the scene (e.g. circular, angular, flowing, vertical, horizontal)"],
  "motionDirection": "implied motion direction (e.g. left-to-right, expanding, rising, static, spiraling)",
  "suggestedMatchTargets": ["5 creative match cut target scenes that would create a visually satisfying transition from this image. Each should be a DIFFERENT type of scene — vary widely between nature, urban, abstract, human, object close-ups."],
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
  "suggestedMatchTargets": ["5 creative match cut target scenes. Each MUST be a completely different type of scene — one nature, one urban, one abstract, one human/body, one object close-up."],
  "keywords": ["5 visual keywords"]
}

Be cinematic and creative. Think like a film director composing the perfect match cut transition.

User's description: `;

// ── Style Generation Prompts ──
// Each style gets a DIFFERENT match target and a clear visual direction.

export function getStylePrompt(
  analysis: MatchCutAnalysis,
  styleName: string,
  styleDescription: string,
  styleIndex: number,
): string {
  // Rotate through match targets so each style shows a different scene B
  const targetIndex = styleIndex % analysis.suggestedMatchTargets.length;
  const sceneB = analysis.suggestedMatchTargets[targetIndex];

  return `Generate a single photorealistic cinematic image.

The image shows a SPLIT COMPOSITION — the left half shows one scene, the right half shows another scene, with a smooth visual transition between them in the center.

LEFT HALF (Scene A): ${analysis.subject}
RIGHT HALF (Scene B): ${sceneB}

The transition between the two halves uses the "${styleName}" technique: ${styleDescription}

IMPORTANT RULES:
- Photorealistic quality, like a frame from a Hollywood film
- 16:9 aspect ratio, landscape orientation
- The split/transition should be clearly visible and dramatic
- Rich cinematic color grading matching the mood: ${analysis.mood}
- Dominant colors: ${analysis.dominantColors.join(", ")}
- NO text, NO watermarks, NO UI elements, NO borders
- The two scenes should feel connected through the transition`;
}
