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

// ── Scene A Prompt — generates the user's original scene as a standalone image ──

export function getSceneAPrompt(analysis: MatchCutAnalysis, originalText?: string): string {
  // Use the user's exact words if available, fall back to AI analysis
  const sceneDescription = originalText?.trim() || analysis.subject;

  return `Generate a single photorealistic cinematic image of EXACTLY this scene:

"${sceneDescription}"

Mood: ${analysis.mood}
Color palette: ${analysis.dominantColors.join(", ")}

IMPORTANT RULES:
- Generate EXACTLY what is described above — do not change, reinterpret, or add elements
- ONE single scene, NOT a split, collage, or side-by-side
- Photorealistic, like a frame from a Hollywood film
- 16:9 landscape orientation
- Cinematic color grading
- NO text, NO watermarks, NO UI elements, NO borders`;
}

// ── Scene B Prompt — generates the match cut target scene ──

export function getSceneBPrompt(
  analysis: MatchCutAnalysis,
  styleIndex: number,
): string {
  const targetIndex = styleIndex % analysis.suggestedMatchTargets.length;
  const target = analysis.suggestedMatchTargets[targetIndex];

  return `Generate a single photorealistic cinematic image of this scene:

${target}

This scene should visually connect to: "${analysis.subject}"
The connection is through matching ${analysis.shapes[0] || "shapes"} and ${analysis.mood} mood.
Color palette should echo: ${analysis.dominantColors.join(", ")}

RULES:
- ONE single scene, NOT a split or collage
- Photorealistic, like a frame from a film
- NO text, NO watermarks, NO UI elements
- Landscape 16:9 orientation`;
}
