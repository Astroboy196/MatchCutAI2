"use client";

import { cn } from "@/lib/utils/cn";
import { useCreateStore } from "@/stores/createStore";
import type { InputType } from "@/types/matchcut";

const tabs: { id: InputType; label: string; icon: string }[] = [
  { id: "text", label: "Text", icon: "Aa" },
  { id: "image", label: "Image", icon: "img" },
  { id: "video", label: "Video", icon: "vid" },
];

export function InputSelector() {
  const { inputType, setInputType } = useCreateStore();

  return (
    <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setInputType(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
            inputType === tab.id
              ? "bg-primary text-white shadow-md"
              : "text-muted hover:text-foreground hover:bg-surface-2",
          )}
        >
          <span className="text-xs font-mono opacity-70">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
