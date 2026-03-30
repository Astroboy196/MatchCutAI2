"use client";

import { useState, useCallback } from "react";
import { MATCH_CUT_STYLES } from "@/lib/ai/styles";
import type { MatchCutAnalysis, MatchCutStyleId, StylePreview } from "@/types/matchcut";

type Step = "input" | "analyzing" | "styles" | "preview";
type InputMode = "text" | "image" | "video";

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [textInput, setTextInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MatchCutAnalysis | null>(null);
  const [stylePreviews, setStylePreviews] = useState<StylePreview[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<MatchCutStyleId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze =
    (inputMode === "text" && textInput.trim().length > 0) ||
    ((inputMode === "image" || inputMode === "video") && !!imageBase64);

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith("video/")) {
      setInputMode("video");
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.onloadeddata = () => { video.currentTime = 1; };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")!.drawImage(video, 0, 0);
        setImageBase64(canvas.toDataURL("image/jpeg", 0.85).split(",")[1]);
        setImageMimeType("image/jpeg");
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    } else {
      setInputMode("image");
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageBase64(result.split(",")[1]);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  async function handleAnalyze() {
    if (!canAnalyze || step === "analyzing") return;
    setError(null);
    setStep("analyzing");

    try {
      const body =
        inputMode === "text"
          ? { type: "text", text: textInput }
          : { type: inputMode, imageBase64, imageMimeType };

      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data: MatchCutAnalysis = await res.json();
      setAnalysis(data);
      setStep("styles");
      generateStyles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  }

  async function generateStyles(a: MatchCutAnalysis) {
    setStylePreviews(
      MATCH_CUT_STYLES.map((s) => ({ styleId: s.id, imageBase64: null, loading: true })),
    );

    try {
      const res = await fetch("/api/ai/styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: a }),
      });

      if (!res.ok) throw new Error("Style generation failed");
      const { previews } = await res.json();
      setStylePreviews(previews);
    } catch {
      setStylePreviews(
        MATCH_CUT_STYLES.map((s) => ({
          styleId: s.id,
          imageBase64: null,
          loading: false,
          error: "Failed",
        })),
      );
    }
  }

  function handleReset() {
    setStep("input");
    setAnalysis(null);
    setStylePreviews([]);
    setSelectedStyle(null);
    setTextInput("");
    setImageBase64(null);
    setImageMimeType(null);
    setError(null);
    setInputMode("text");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col text-[#F5F0E8]">
      {/* Nav */}
      <nav className="px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#6C3CE0] to-[#00D4FF]" />
          <span className="text-base font-semibold tracking-tight">Matchhook</span>
        </div>
        {step !== "input" && step !== "analyzing" && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#8A8A9A] hover:text-white transition-colors cursor-pointer"
          >
            + New
          </button>
        )}
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16">

        {/* ═══ INPUT STEP ═══ */}
        {(step === "input" || step === "analyzing") && (
          <div className="w-full max-w-xl space-y-5">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Match cuts,<br />
              <span className="text-[#8A8A9A]">generated.</span>
            </h1>

            {/* Mode Tabs */}
            <div className="flex gap-1 p-1 bg-[#121218] rounded-xl border border-[#2A2A3A]">
              {(["text", "image", "video"] as InputMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setInputMode(m); setImageBase64(null); setError(null); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    inputMode === m
                      ? "bg-white text-black"
                      : "text-[#8A8A9A] hover:text-white"
                  }`}
                >
                  {m === "text" ? "Text" : m === "image" ? "Image" : "Video"}
                </button>
              ))}
            </div>

            {/* Text Input */}
            {inputMode === "text" && (
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && canAnalyze) {
                    e.preventDefault();
                    handleAnalyze();
                  }
                }}
                placeholder="Describe a scene... e.g. A coffee cup on marble, morning light hitting the rim"
                rows={4}
                autoFocus
                className="w-full bg-[#15151f] border border-[#2A2A3A] rounded-2xl px-5 py-4 text-white placeholder:text-[#555] resize-none focus:outline-none focus:border-[#6C3CE0] transition-colors text-base"
              />
            )}

            {/* Image/Video Upload */}
            {(inputMode === "image" || inputMode === "video") && (
              <>
                {imageBase64 ? (
                  <div className="relative group">
                    <img
                      src={`data:${imageMimeType || "image/jpeg"};base64,${imageBase64}`}
                      alt="Upload"
                      className="w-full h-56 object-cover rounded-2xl border border-[#2A2A3A]"
                    />
                    <button
                      type="button"
                      onClick={() => setImageBase64(null)}
                      className="absolute top-3 right-3 bg-black/70 text-white rounded-lg px-3 py-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[#2A2A3A] rounded-2xl cursor-pointer transition-all hover:border-[#555]">
                    <input
                      type="file"
                      className="hidden"
                      accept={inputMode === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/quicktime,video/webm"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />
                    <span className="text-3xl text-[#333] mb-2">+</span>
                    <span className="text-sm text-[#555]">
                      {inputMode === "image" ? "Click to upload image" : "Click to upload video"}
                    </span>
                    <span className="text-xs text-[#333] mt-1">
                      {inputMode === "image" ? "JPG, PNG, WebP" : "MP4, MOV, WebM"}
                    </span>
                  </label>
                )}
              </>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!canAnalyze || step === "analyzing"}
              className="w-full py-4 bg-white text-black rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e5e5e5] transition-all cursor-pointer active:scale-[0.98]"
            >
              {step === "analyzing" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Generate Match Cuts"
              )}
            </button>
          </div>
        )}

        {/* ═══ STYLES STEP ═══ */}
        {step === "styles" && analysis && (
          <div className="w-full max-w-4xl space-y-6">
            {/* Analysis Summary */}
            <div className="p-4 bg-[#121218] rounded-2xl border border-[#2A2A3A]">
              <p className="text-sm text-white/90 leading-relaxed">{analysis.subject}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex gap-1">
                  {analysis.dominantColors.map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-md border border-[#2A2A3A]" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-xs text-[#8A8A9A] px-2 py-0.5 bg-[#1A1A24] rounded-md">{analysis.mood}</span>
                <span className="text-xs text-[#8A8A9A]">{analysis.motionDirection}</span>
              </div>
            </div>

            {/* Style Grid */}
            <div>
              <p className="text-sm text-[#8A8A9A] mb-3">
                {stylePreviews.filter(p => !p.loading && p.imageBase64).length} of 10 styles generated
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {MATCH_CUT_STYLES.map((style) => {
                  const preview = stylePreviews.find((p) => p.styleId === style.id);
                  const isSelected = selectedStyle === style.id;
                  const isLoading = preview?.loading ?? true;
                  const hasImage = !!preview?.imageBase64;

                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => hasImage && setSelectedStyle(style.id)}
                      className={`rounded-xl border overflow-hidden transition-all text-left cursor-pointer ${
                        isSelected
                          ? "border-[#6C3CE0] ring-2 ring-[#6C3CE0]"
                          : "border-[#2A2A3A] hover:border-[#555]"
                      } ${!hasImage && !isLoading ? "opacity-30" : ""}`}
                    >
                      <div className="aspect-video bg-[#1A1A24] relative">
                        {isLoading ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-[#6C3CE0]/30 border-t-[#6C3CE0] rounded-full animate-spin" />
                          </div>
                        ) : hasImage ? (
                          <img
                            src={`data:image/png;base64,${preview!.imageBase64}`}
                            alt={style.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#555]">
                            failed
                          </div>
                        )}
                      </div>
                      <div className="px-2.5 py-2">
                        <p className="text-xs font-medium truncate">{style.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#8A8A9A] hover:text-white transition-colors cursor-pointer"
              >
                Start over
              </button>
              <button
                type="button"
                onClick={() => setStep("preview")}
                disabled={!selectedStyle}
                className="px-8 py-3 bg-white text-black rounded-xl text-sm font-semibold disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#e5e5e5] transition-all cursor-pointer"
              >
                Use This Style
              </button>
            </div>
          </div>
        )}

        {/* ═══ PREVIEW STEP ═══ */}
        {step === "preview" && (
          <div className="w-full max-w-xl text-center space-y-6">
            <p className="text-xl font-semibold">
              {MATCH_CUT_STYLES.find((s) => s.id === selectedStyle)?.name}
            </p>
            <p className="text-sm text-[#8A8A9A]">
              Video rendering coming next (Remotion).
            </p>
            <button
              type="button"
              onClick={() => setStep("styles")}
              className="text-sm text-[#8A8A9A] hover:text-white transition-colors cursor-pointer"
            >
              Back to styles
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
