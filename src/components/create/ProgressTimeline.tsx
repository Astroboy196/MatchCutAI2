"use client";

import { cn } from "@/lib/utils/cn";
import { useCreateStore } from "@/stores/createStore";
import type { FlowStep } from "@/types/matchcut";

const steps: { id: FlowStep; label: string }[] = [
  { id: "input", label: "Input" },
  { id: "analyzing", label: "Analyze" },
  { id: "styles", label: "Styles" },
  { id: "preview", label: "Preview" },
  { id: "done", label: "Export" },
];

const stepOrder: FlowStep[] = ["input", "analyzing", "styles", "preview", "exporting", "done"];

export function ProgressTimeline() {
  const { step } = useCreateStore();
  const currentIndex = stepOrder.indexOf(step);

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const sIndex = stepOrder.indexOf(s.id);
        const isActive = sIndex === currentIndex;
        const isDone = sIndex < currentIndex;

        return (
          <div key={s.id} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all",
                  isActive && "bg-primary text-white",
                  isDone && "bg-primary/20 text-primary",
                  !isActive && !isDone && "bg-surface-2 text-muted",
                )}
              >
                {isDone ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  isActive ? "text-foreground" : "text-muted",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-6 h-px",
                  sIndex < currentIndex ? "bg-primary/50" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
