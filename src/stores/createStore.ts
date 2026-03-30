import { create } from "zustand";
import type {
  FlowStep,
  InputType,
  MatchCutAnalysis,
  MatchCutStyleId,
  StylePreview,
  VideoFormat,
} from "@/types/matchcut";

interface CreateState {
  // Flow
  step: FlowStep;
  setStep: (step: FlowStep) => void;

  // Input
  inputType: InputType;
  setInputType: (type: InputType) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  imageBase64: string | null;
  imageMimeType: string | null;
  setImage: (base64: string, mimeType: string) => void;

  // Analysis
  analysis: MatchCutAnalysis | null;
  setAnalysis: (analysis: MatchCutAnalysis) => void;

  // Styles
  stylePreviews: StylePreview[];
  setStylePreviews: (previews: StylePreview[]) => void;
  updateStylePreview: (styleId: MatchCutStyleId, update: Partial<StylePreview>) => void;
  selectedStyle: MatchCutStyleId | null;
  setSelectedStyle: (id: MatchCutStyleId) => void;

  // Video
  format: VideoFormat;
  setFormat: (format: VideoFormat) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  step: "input" as FlowStep,
  inputType: "text" as InputType,
  textInput: "",
  imageBase64: null as string | null,
  imageMimeType: null as string | null,
  analysis: null as MatchCutAnalysis | null,
  stylePreviews: [] as StylePreview[],
  selectedStyle: null as MatchCutStyleId | null,
  format: "16:9" as VideoFormat,
};

export const useCreateStore = create<CreateState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setInputType: (inputType) => set({ inputType }),
  setTextInput: (textInput) => set({ textInput }),
  setImage: (imageBase64, imageMimeType) => set({ imageBase64, imageMimeType }),
  setAnalysis: (analysis) => set({ analysis }),
  setStylePreviews: (stylePreviews) => set({ stylePreviews }),
  updateStylePreview: (styleId, update) =>
    set((state) => ({
      stylePreviews: state.stylePreviews.map((p) =>
        p.styleId === styleId ? { ...p, ...update } : p,
      ),
    })),
  setSelectedStyle: (selectedStyle) => set({ selectedStyle }),
  setFormat: (format) => set({ format }),
  reset: () => set(initialState),
}));
