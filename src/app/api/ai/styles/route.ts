import { NextRequest, NextResponse } from "next/server";
import { geminiImageFromText } from "@/lib/ai/providers";
import { getSceneAPrompt, getSceneBPrompt } from "@/lib/ai/prompts";
import { MATCH_CUT_STYLES } from "@/lib/ai/styles";
import type { MatchCutAnalysis } from "@/types/matchcut";

export async function POST(req: NextRequest) {
  try {
    const { analysis, originalText } = (await req.json()) as {
      analysis: MatchCutAnalysis;
      originalText?: string;
    };

    if (!analysis) {
      return NextResponse.json({ error: "Missing analysis" }, { status: 400 });
    }

    // Generate Scene A once (same for all styles)
    // Use original user text if available — it's more accurate than AI's reinterpretation
    const sceneAPrompt = getSceneAPrompt(analysis, originalText);
    const sceneAImage = await geminiImageFromText(sceneAPrompt);

    // Generate Scene B for each style in parallel (different match target per style)
    const results = await Promise.allSettled(
      MATCH_CUT_STYLES.map(async (_style, index) => {
        const sceneBPrompt = getSceneBPrompt(analysis, index);
        const sceneBImage = await geminiImageFromText(sceneBPrompt);
        return sceneBImage;
      }),
    );

    const previews = results.map((result, i) => ({
      styleId: MATCH_CUT_STYLES[i].id,
      imageA: sceneAImage,
      imageB: result.status === "fulfilled" ? result.value : null,
      loading: false,
      error: result.status === "rejected" ? "Generation failed" : undefined,
    }));

    return NextResponse.json({ previews });
  } catch (error) {
    console.error("[styles]", error);
    return NextResponse.json(
      { error: "Style generation failed" },
      { status: 500 },
    );
  }
}
