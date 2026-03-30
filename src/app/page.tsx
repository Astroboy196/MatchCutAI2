"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateStore } from "@/stores/createStore";

export default function Home() {
  const router = useRouter();
  const { setTextInput, setInputType } = useCreateStore();
  const [input, setInput] = useState("");

  function handleGo() {
    if (!input.trim()) return;
    setInputType("text");
    setTextInput(input.trim());
    router.push("/create");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav — minimal */}
      <nav className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
          <span className="text-lg font-display font-semibold tracking-tight">
            Matchhook
          </span>
        </div>
        <button
          onClick={() => router.push("/create")}
          className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          Open Studio
        </button>
      </nav>

      {/* Hero — the product IS the landing page */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="w-full max-w-2xl space-y-10">
          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-[1.08]">
              Match cuts,
              <br />
              <span className="text-muted">generated.</span>
            </h1>
          </div>

          {/* Input — this IS the product */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGo();
                  }
                }}
                placeholder="Describe a scene. A coffee cup on a marble table, morning light..."
                rows={3}
                className="w-full bg-surface border border-border rounded-2xl px-5 py-4 pr-24 text-foreground text-base placeholder:text-muted/40 resize-none focus:outline-none focus:border-primary/40 transition-colors"
              />
              <button
                onClick={handleGo}
                disabled={!input.trim()}
                className="absolute right-3 bottom-3 px-5 py-2 bg-foreground text-background rounded-xl text-sm font-medium disabled:opacity-20 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Generate
              </button>
            </div>

            {/* Or upload */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted/60">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setInputType("image");
                  router.push("/create");
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-surface border border-border rounded-xl text-sm text-muted hover:text-foreground hover:border-primary/30 transition-all cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
                Upload Image
              </button>
              <button
                onClick={() => {
                  setInputType("video");
                  router.push("/create");
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-surface border border-border rounded-xl text-sm text-muted hover:text-foreground hover:border-primary/30 transition-all cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                Upload Video
              </button>
            </div>
          </div>

          {/* Subtle info */}
          <p className="text-xs text-muted/40 text-center">
            Text, image, or video in — 10 cinematic styles out. No account needed.
          </p>
        </div>
      </main>
    </div>
  );
}
