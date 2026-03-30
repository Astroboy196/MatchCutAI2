"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MATCH_CUT_STYLES } from "@/lib/ai/styles";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="text-xl font-display font-bold">Matchhook</span>
          </div>
          <Link href="/create">
            <Button size="sm">Start Creating</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
            AI-Powered Match Cut Generator
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight">
            Turn anything into
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              cinematic match cuts
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-xl mx-auto leading-relaxed">
            Text, image, or video in — 10 unique styles out. The first multi-modal AI match cut generator that works on every device.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/create">
              <Button size="lg" className="w-full sm:w-auto px-10">
                Create Match Cut — Free
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              See Examples
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-muted">
            <span>No sign-up required</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>10 styles</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Export in HD</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold">How It Works</h2>
            <p className="text-muted mt-3">Three steps to cinematic perfection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Input",
                desc: "Type a scene description, upload an image, or drop in a video clip.",
              },
              {
                step: "02",
                title: "AI Generates 10 Styles",
                desc: "Our AI analyzes your input and creates 10 unique match cut style previews.",
              },
              {
                step: "03",
                title: "Export",
                desc: "Choose your favorite style, preview the video, and export in any format.",
              },
            ].map((item) => (
              <Card key={item.step} className="text-center space-y-3">
                <div className="inline-flex w-10 h-10 rounded-xl bg-primary/10 items-center justify-center text-primary text-sm font-bold font-display">
                  {item.step}
                </div>
                <h3 className="text-lg font-display font-semibold">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Styles */}
      <section className="py-20 px-4 sm:px-6 bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold">10 Match Cut Styles</h2>
            <p className="text-muted mt-3">From subtle to surreal — every transition tells a story</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {MATCH_CUT_STYLES.map((style) => (
              <Card key={style.id} hover className="text-center space-y-2 p-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-lg">{style.icon === "ghost" ? "\u{1F47B}" : style.icon === "palette" ? "\u{1F3A8}" : style.icon === "search" ? "\u{1F50D}" : style.icon === "wind" ? "\u{1F4A8}" : style.icon === "hexagon" ? "\u{2B21}" : style.icon === "layers" ? "\u{1F4DA}" : style.icon === "sun" ? "\u{2600}" : style.icon === "flip-horizontal" ? "\u{1F500}" : style.icon === "music" ? "\u{1F3B5}" : "\u{2728}"}</span>
                </div>
                <h3 className="text-sm font-medium">{style.name}</h3>
                <p className="text-[10px] text-muted leading-tight">{style.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Ready to create?
          </h2>
          <p className="text-muted">
            No account needed. Start with text, an image, or a video — and let AI do the rest.
          </p>
          <Link href="/create">
            <Button size="lg" className="px-12">
              Start Creating — It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">M</span>
            </div>
            <span>Matchhook</span>
          </div>
          <p>Built with Gemini AI + Remotion</p>
        </div>
      </footer>
    </div>
  );
}
