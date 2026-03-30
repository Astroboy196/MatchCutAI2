"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputSelector } from "@/components/create/InputSelector";
import { TextInput } from "@/components/create/TextInput";
import { ImageUpload } from "@/components/create/ImageUpload";
import { VideoUpload } from "@/components/create/VideoUpload";
import { AnalysisCard } from "@/components/create/AnalysisCard";
import { StyleGrid } from "@/components/create/StyleGrid";
import { ProgressTimeline } from "@/components/create/ProgressTimeline";
import { useCreateStore } from "@/stores/createStore";
import type { MatchCutAnalysis, StylePreview } from "@/types/matchcut";
import { MATCH_CUT_STYLES } from "@/lib/ai/styles";

export default function CreatePage() {
  const {
    step,
    setStep,
    inputType,
    textInput,
    imageBase64,
    imageMimeType,
    analysis,
    setAnalysis,
    setStylePreviews,
    selectedStyle,
    reset,
  } = useCreateStore();

  const [error, setError] = useState<string | null>(null);

  const canAnalyze =
    (inputType === "text" && textInput.trim().length > 5) ||
    ((inputType === "image" || inputType === "video") && !!imageBase64);

  async function handleAnalyze() {
    setError(null);
    setStep("analyzing");

    try {
      const body =
        inputType === "text"
          ? { type: "text" as const, text: textInput }
          : { type: inputType, imageBase64, imageMimeType };

      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data: MatchCutAnalysis = await res.json();
      setAnalysis(data);
      setStep("styles");
      generateStyles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  }

  async function generateStyles(analysisData: MatchCutAnalysis) {
    const loading: StylePreview[] = MATCH_CUT_STYLES.map((s) => ({
      styleId: s.id,
      imageBase64: null,
      loading: true,
    }));
    setStylePreviews(loading);

    try {
      const res = await fetch("/api/ai/styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: analysisData }),
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <h1 className="text-lg font-display font-semibold">Matchhook</h1>
          </div>
          <ProgressTimeline />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Step: Input */}
        {(step === "input" || step === "analyzing") && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-bold">
                Create a Match Cut
              </h2>
              <p className="text-sm text-muted">
                Start with text, an image, or a video. Our AI will analyze it and generate
                10 cinematic match cut styles.
              </p>
            </div>

            <InputSelector />

            {inputType === "text" && <TextInput />}
            {inputType === "image" && <ImageUpload />}
            {inputType === "video" && <VideoUpload />}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              disabled={!canAnalyze || step === "analyzing"}
              onClick={handleAnalyze}
            >
              {step === "analyzing" ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Analyze & Generate Styles"
              )}
            </Button>
          </div>
        )}

        {/* Step: Styles */}
        {step === "styles" && analysis && (
          <div className="space-y-8">
            <div className="max-w-xl mx-auto">
              <AnalysisCard analysis={analysis} />
            </div>

            <StyleGrid />

            <div className="flex items-center justify-between max-w-xl mx-auto">
              <Button variant="ghost" onClick={() => { reset(); setStep("input"); }}>
                Start Over
              </Button>
              <Button
                size="lg"
                disabled={!selectedStyle}
                onClick={() => setStep("preview")}
              >
                Continue with Style
              </Button>
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === "preview" && (
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-display font-bold">Preview & Export</h2>
            <p className="text-sm text-muted">
              Remotion video preview coming in Phase 3.
              Selected style: <span className="text-primary font-medium">{selectedStyle}</span>
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setStep("styles")}>
                Back to Styles
              </Button>
              <Button>Export Video (Coming Soon)</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
