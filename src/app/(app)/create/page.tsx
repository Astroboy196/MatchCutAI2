"use client";

import { useState } from "react";
import Link from "next/link";
import { InputSelector } from "@/components/create/InputSelector";
import { TextInput } from "@/components/create/TextInput";
import { ImageUpload } from "@/components/create/ImageUpload";
import { VideoUpload } from "@/components/create/VideoUpload";
import { AnalysisCard } from "@/components/create/AnalysisCard";
import { StyleGrid } from "@/components/create/StyleGrid";
import { useCreateStore } from "@/stores/createStore";
import type { MatchCutAnalysis, StylePreview } from "@/types/matchcut";
import { MATCH_CUT_STYLES } from "@/lib/ai/styles";

export default function CreatePage() {
  const store = useCreateStore();
  const [error, setError] = useState<string | null>(null);

  const canAnalyze =
    (store.inputType === "text" && store.textInput.trim().length > 5) ||
    ((store.inputType === "image" || store.inputType === "video") &&
      !!store.imageBase64);

  async function handleAnalyze() {
    setError(null);
    store.setStep("analyzing");

    try {
      const body =
        store.inputType === "text"
          ? { type: "text" as const, text: store.textInput }
          : {
              type: store.inputType,
              imageBase64: store.imageBase64,
              imageMimeType: store.imageMimeType,
            };

      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data: MatchCutAnalysis = await res.json();
      store.setAnalysis(data);
      store.setStep("styles");
      generateStyles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      store.setStep("input");
    }
  }

  async function generateStyles(analysisData: MatchCutAnalysis) {
    store.setStylePreviews(
      MATCH_CUT_STYLES.map((s) => ({
        styleId: s.id,
        imageBase64: null,
        loading: true,
      })),
    );

    try {
      const res = await fetch("/api/ai/styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: analysisData }),
      });

      if (!res.ok) throw new Error("Style generation failed");
      const { previews } = await res.json();
      store.setStylePreviews(previews);
    } catch {
      store.setStylePreviews(
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-border/50">
        <Link
          href="/"
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-accent" />
          <span className="text-base font-display font-semibold tracking-tight">
            Matchhook
          </span>
        </Link>

        {store.step !== "input" && store.step !== "analyzing" && (
          <button
            onClick={() => {
              store.reset();
              store.setStep("input");
            }}
            className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            New
          </button>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 py-8 max-w-5xl mx-auto w-full">
        {/* ─── Input Step ─── */}
        {(store.step === "input" || store.step === "analyzing") && (
          <div className="max-w-xl mx-auto space-y-5">
            <InputSelector />

            {store.inputType === "text" && <TextInput />}
            {store.inputType === "image" && <ImageUpload />}
            {store.inputType === "video" && <VideoUpload />}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || store.step === "analyzing"}
              className="w-full py-3.5 bg-foreground text-background rounded-xl text-sm font-medium disabled:opacity-20 hover:opacity-90 transition-opacity cursor-pointer"
            >
              {store.step === "analyzing" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Generate Match Cuts"
              )}
            </button>
          </div>
        )}

        {/* ─── Styles Step ─── */}
        {store.step === "styles" && store.analysis && (
          <div className="space-y-8">
            <AnalysisCard analysis={store.analysis} />
            <StyleGrid />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => store.setStep("preview")}
                disabled={!store.selectedStyle}
                className="px-8 py-3 bg-foreground text-background rounded-xl text-sm font-medium disabled:opacity-20 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Use This Style
              </button>
            </div>
          </div>
        )}

        {/* ─── Preview Step (placeholder) ─── */}
        {store.step === "preview" && (
          <div className="max-w-xl mx-auto space-y-6 text-center py-20">
            <p className="text-2xl font-display font-semibold">
              {store.selectedStyle}
            </p>
            <p className="text-sm text-muted">
              Video preview + export coming in Phase 3 (Remotion).
            </p>
            <button
              onClick={() => store.setStep("styles")}
              className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Back to styles
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
