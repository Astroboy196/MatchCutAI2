"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
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
    (inputMode === "text" && textInput.trim().length > 5) ||
    ((inputMode === "image" || inputMode === "video") && !!imageBase64);

  // ── Image Drop ──
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const file = files[0];
      if (!file) return;

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
    },
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
      "video/*": [".mp4", ".mov", ".webm"],
    },
    maxFiles: 1,
    noClick: true,
  });

  // ── Analyze ──
  async function handleAnalyze() {
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

  // ── Generate Styles ──
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

  // ── Reset ──
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
    <div className="min-h-screen bg-background flex flex-col" {...getRootProps()}>
      <input {...getInputProps()} />

      {/* Nav */}
      <nav className="px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-accent" />
          <span className="text-base font-display font-semibold tracking-tight">Matchhook</span>
        </div>
        {step !== "input" && step !== "analyzing" && (
          <button onClick={handleReset} className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer">
            New
          </button>
        )}
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        {/* ═══ INPUT ═══ */}
        {(step === "input" || step === "analyzing") && (
          <div className="w-full max-w-xl space-y-5">
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight leading-tight">
              Match cuts,<br />
              <span className="text-muted">generated.</span>
            </h1>

            {/* Mode Tabs */}
            <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border">
              {(["text", "image", "video"] as InputMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setInputMode(m); setImageBase64(null); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    inputMode === m
                      ? "bg-foreground text-background"
                      : "text-muted hover:text-foreground"
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
                className="w-full bg-[#15151f] border border-[#333] rounded-2xl px-5 py-4 text-white placeholder:text-[#666] resize-none focus:outline-none focus:border-[#6C3CE0] transition-colors text-base"
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
                      className="w-full h-56 object-cover rounded-2xl border border-border"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setImageBase64(null); }}
                      className="absolute top-3 right-3 bg-black/70 text-white rounded-lg px-3 py-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                    isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-muted"
                  }`}>
                    <input
                      type="file"
                      className="hidden"
                      accept={inputMode === "image" ? "image/*" : "video/*"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (inputMode === "video") {
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
                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result as string;
                            setImageBase64(result.split(",")[1]);
                            setImageMimeType(file.type);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <span className="text-2xl text-muted/30 mb-2">+</span>
                    <span className="text-sm text-muted/60">
                      {inputMode === "image" ? "Drop image or click" : "Drop video or click"}
                    </span>
                  </label>
                )}
              </>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || step === "analyzing"}
              className="w-full py-4 bg-white text-black rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 transition-all cursor-pointer"
            >
              {step === "analyzing" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Analyzing with Gemini...
                </span>
              ) : (
                "Generate Match Cuts"
              )}
            </button>

            <p className="text-[11px] text-muted/30 text-center">
              Drop an image or video anywhere on the page
            </p>
          </div>
        )}

        {/* ═══ STYLES ═══ */}
        {step === "styles" && analysis && (
          <div className="w-full max-w-4xl space-y-6">
            {/* Analysis Summary */}
            <div className="flex items-start gap-4 p-4 bg-surface rounded-2xl border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/90 leading-relaxed">{analysis.subject}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex gap-1">
                    {analysis.dominantColors.map((c, i) => (
                      <div key={i} className="w-5 h-5 rounded-md border border-border" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-xs text-muted px-2 py-0.5 bg-surface-2 rounded-md">{analysis.mood}</span>
                  <span className="text-xs text-muted">{analysis.motionDirection}</span>
                </div>
              </div>
            </div>

            {/* Style Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {MATCH_CUT_STYLES.map((style) => {
                const preview = stylePreviews.find((p) => p.styleId === style.id);
                const isSelected = selectedStyle === style.id;
                const isLoading = preview?.loading ?? true;
                const hasImage = !!preview?.imageBase64;

                return (
                  <button
                    key={style.id}
                    onClick={() => hasImage && setSelectedStyle(style.id)}
                    className={`rounded-xl border overflow-hidden transition-all text-left cursor-pointer ${
                      isSelected
                        ? "border-primary shadow-lg shadow-primary/20 ring-1 ring-primary"
                        : "border-border hover:border-muted"
                    } ${!hasImage && !isLoading ? "opacity-40" : ""}`}
                  >
                    <div className="aspect-video bg-surface-2 relative">
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                      ) : hasImage ? (
                        <img
                          src={`data:image/png;base64,${preview!.imageBase64}`}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted">
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

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button onClick={handleReset} className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer">
                Start over
              </button>
              <button
                onClick={() => setStep("preview")}
                disabled={!selectedStyle}
                className="px-8 py-3 bg-foreground text-background rounded-xl text-sm font-medium disabled:opacity-20 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Use This Style
              </button>
            </div>
          </div>
        )}

        {/* ═══ PREVIEW ═══ */}
        {step === "preview" && (
          <div className="w-full max-w-xl text-center space-y-6">
            <p className="text-xl font-display font-semibold">
              {MATCH_CUT_STYLES.find((s) => s.id === selectedStyle)?.name}
            </p>
            <p className="text-sm text-muted">
              Video rendering coming in Phase 3 (Remotion).
            </p>
            <button onClick={() => setStep("styles")} className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer">
              Back to styles
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
