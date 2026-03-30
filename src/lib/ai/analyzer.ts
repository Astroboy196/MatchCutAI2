import type { MatchCutAnalysis, UserInput } from "@/types/matchcut";
import { geminiJSON, geminiTextJSON } from "./providers";
import { ANALYZE_IMAGE_PROMPT, ANALYZE_TEXT_PROMPT } from "./prompts";

export async function analyzeInput(input: UserInput): Promise<MatchCutAnalysis> {
  switch (input.type) {
    case "text":
      return analyzeText(input.text!);
    case "image":
      return analyzeImage(input.imageBase64!, input.imageMimeType!);
    case "video":
      return analyzeImage(input.videoFrames![0], "image/jpeg");
    default:
      throw new Error(`Unknown input type: ${input.type}`);
  }
}

async function analyzeText(text: string): Promise<MatchCutAnalysis> {
  return geminiTextJSON<MatchCutAnalysis>(ANALYZE_TEXT_PROMPT + text);
}

async function analyzeImage(base64: string, mimeType: string): Promise<MatchCutAnalysis> {
  return geminiJSON<MatchCutAnalysis>(base64, mimeType, ANALYZE_IMAGE_PROMPT);
}
