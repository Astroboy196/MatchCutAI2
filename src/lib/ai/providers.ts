import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Gemini Singleton ──

let _genAI: GoogleGenerativeAI | null = null;

function getGemini(): GoogleGenerativeAI {
  if (!_genAI) {
    const key = process.env.GOOGLE_GEMINI_API_KEY;
    if (!key) throw new Error("GOOGLE_GEMINI_API_KEY not set");
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

// ── Models ──

export const MODELS = {
  FLASH_TEXT: "gemini-2.5-flash",
  FLASH_IMAGE: "gemini-3.1-flash-image-preview",
  PRO_IMAGE: "gemini-3-pro-image-preview",
} as const;

export type ImageModel = typeof MODELS.FLASH_IMAGE | typeof MODELS.PRO_IMAGE;

// ── Gemini: Image in → Image out ──

export async function geminiImage(
  base64: string,
  mimeType: string,
  prompt: string,
  model: string = MODELS.FLASH_IMAGE,
): Promise<string | null> {
  const genAI = getGemini();
  const m = genAI.getGenerativeModel({ model });

  const result = await m.generateContent({
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType, data: base64 } },
        { text: prompt },
      ],
    }],
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] } as Record<string, unknown>,
  });

  for (const part of result.response.candidates?.[0]?.content?.parts || []) {
    const p = part as unknown as { inlineData?: { data: string } };
    if (p.inlineData) return p.inlineData.data;
  }
  return null;
}

// ── Gemini: Image in → JSON out ──

export async function geminiJSON<T = unknown>(
  base64: string,
  mimeType: string,
  prompt: string,
  model: string = MODELS.FLASH_TEXT,
): Promise<T> {
  const genAI = getGemini();
  const m = genAI.getGenerativeModel({ model });

  const result = await m.generateContent({
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType, data: base64 } },
        { text: prompt },
      ],
    }],
    generationConfig: { responseMimeType: "application/json" } as Record<string, unknown>,
  });

  return JSON.parse(result.response.text()) as T;
}

// ── Gemini: Text only → Text out ──

export async function geminiText(
  prompt: string,
  model: string = MODELS.FLASH_TEXT,
): Promise<string> {
  const genAI = getGemini();
  const m = genAI.getGenerativeModel({ model });
  const result = await m.generateContent(prompt);
  return result.response.text();
}

// ── Gemini: Text only → JSON out ──

export async function geminiTextJSON<T = unknown>(
  prompt: string,
  model: string = MODELS.FLASH_TEXT,
): Promise<T> {
  const genAI = getGemini();
  const m = genAI.getGenerativeModel({ model });

  const result = await m.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" } as Record<string, unknown>,
  });

  return JSON.parse(result.response.text()) as T;
}

// ── Gemini: Text only → Image out ──

export async function geminiImageFromText(
  prompt: string,
  model: string = MODELS.FLASH_IMAGE,
): Promise<string | null> {
  const genAI = getGemini();
  const m = genAI.getGenerativeModel({ model });

  const result = await m.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] } as Record<string, unknown>,
  });

  for (const part of result.response.candidates?.[0]?.content?.parts || []) {
    const p = part as unknown as { inlineData?: { data: string } };
    if (p.inlineData) return p.inlineData.data;
  }
  return null;
}
