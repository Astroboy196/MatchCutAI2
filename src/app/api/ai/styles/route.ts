import { NextRequest, NextResponse } from "next/server";
import { geminiImageFromText } from "@/lib/ai/providers";
import { getStylePrompt } from "@/lib/ai/prompts";
import { MATCH_CUT_STYLES } from "@/lib/ai/styles";
import type { MatchCutAnalysis } from "@/types/matchcut";

export async function POST(req: NextRequest) {
  try {
    const { analysis } = (await req.json()) as { analysis: MatchCutAnalysis };

    if (!analysis) {
      return NextResponse.json({ error: "Missing analysis" }, { status: 400 });
    }

    const results = await Promise.allSettled(
      MATCH_CUT_STYLES.map(async (style) => {
        const prompt = getStylePrompt(analysis, style.name, style.description);
        const imageBase64 = await geminiImageFromText(prompt);
        return { styleId: style.id, imageBase64 };
      }),
    );

    const previews = results.map((result, i) => {
      if (result.status === "fulfilled") {
        return {
          styleId: MATCH_CUT_STYLES[i].id,
          imageBase64: result.value.imageBase64,
          loading: false,
        };
      }
      return {
        styleId: MATCH_CUT_STYLES[i].id,
        imageBase64: null,
        loading: false,
        error: "Generation failed",
      };
    });

    return NextResponse.json({ previews });
  } catch (error) {
    console.error("[styles]", error);
    return NextResponse.json(
      { error: "Style generation failed" },
      { status: 500 },
    );
  }
}
