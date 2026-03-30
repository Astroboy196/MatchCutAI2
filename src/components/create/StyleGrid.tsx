"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { MATCH_CUT_STYLES } from "@/lib/ai/styles";
import { useCreateStore } from "@/stores/createStore";

export function StyleGrid() {
  const { stylePreviews, selectedStyle, setSelectedStyle } = useCreateStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold font-display">Choose Your Style</h3>
        <span className="text-xs text-muted">
          {stylePreviews.filter((p) => !p.loading && p.imageBase64).length}/10 ready
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MATCH_CUT_STYLES.map((style) => {
          const preview = stylePreviews.find((p) => p.styleId === style.id);
          const isSelected = selectedStyle === style.id;
          const isLoading = preview?.loading ?? true;
          const hasImage = !!preview?.imageBase64;

          return (
            <Card
              key={style.id}
              hover
              selected={isSelected}
              onClick={() => hasImage && setSelectedStyle(style.id)}
              className={cn(
                "p-0 overflow-hidden",
                !hasImage && !isLoading && "opacity-50",
              )}
            >
              <div className="aspect-video relative bg-surface-2">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : hasImage ? (
                  <img
                    src={`data:image/png;base64,${preview!.imageBase64}`}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted">
                    Failed
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-2.5">
                <p className="text-xs font-medium truncate">{style.name}</p>
                <p className="text-[10px] text-muted truncate mt-0.5">{style.transitionType}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
