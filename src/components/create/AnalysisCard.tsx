"use client";

import { Card } from "@/components/ui/Card";
import type { MatchCutAnalysis } from "@/types/matchcut";

interface AnalysisCardProps {
  analysis: MatchCutAnalysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <h3 className="text-sm font-semibold font-display text-accent">AI Analysis</h3>
      </div>

      <p className="text-sm text-foreground/90 leading-relaxed">{analysis.subject}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted mb-2">Colors</p>
          <div className="flex gap-1.5">
            {analysis.dominantColors.map((color, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-lg border border-border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted mb-2">Mood</p>
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
            {analysis.mood}
          </span>
        </div>

        <div>
          <p className="text-xs text-muted mb-2">Shapes</p>
          <div className="flex flex-wrap gap-1">
            {analysis.shapes.map((shape, i) => (
              <span key={i} className="px-2 py-0.5 bg-surface-2 text-xs rounded-md text-muted">
                {shape}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted mb-2">Motion</p>
          <span className="text-xs text-foreground/70">{analysis.motionDirection}</span>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted mb-2">Match Cut Targets</p>
        <div className="space-y-1.5">
          {analysis.suggestedMatchTargets.slice(0, 3).map((target, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-foreground/70">
              <span className="text-accent mt-0.5">-</span>
              <span>{target}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
