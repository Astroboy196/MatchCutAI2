"use client";

import { useCreateStore } from "@/stores/createStore";

export function TextInput() {
  const { textInput, setTextInput } = useCreateStore();

  return (
    <div className="space-y-3">
      <label className="text-sm text-muted font-medium">
        Describe a scene for your match cut
      </label>
      <textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="A golden retriever running on a beach at sunset..."
        className="w-full h-36 bg-surface-2 border border-border rounded-xl p-4 text-foreground placeholder:text-muted/50 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
      />
      <p className="text-xs text-muted">
        Be descriptive — include colors, shapes, movement, and mood for better results.
      </p>
    </div>
  );
}
