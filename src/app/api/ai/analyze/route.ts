import { NextRequest, NextResponse } from "next/server";
import { analyzeInput } from "@/lib/ai/analyzer";
import type { UserInput } from "@/types/matchcut";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as UserInput;

    if (!body.type) {
      return NextResponse.json({ error: "Missing input type" }, { status: 400 });
    }

    if (body.type === "text" && !body.text?.trim()) {
      return NextResponse.json({ error: "Missing text input" }, { status: 400 });
    }

    if (body.type === "image" && !body.imageBase64) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const analysis = await analyzeInput(body);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("[analyze]", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 },
    );
  }
}
