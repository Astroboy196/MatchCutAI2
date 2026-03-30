"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCreateStore } from "@/stores/createStore";

export function ImageUpload() {
  const { imageBase64, setImage } = useCreateStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        setImage(base64, file.type);
      };
      reader.readAsDataURL(file);
    },
    [setImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  return (
    <div className="space-y-3">
      <label className="text-sm text-muted font-medium">
        Upload an image for your match cut
      </label>

      {imageBase64 ? (
        <div className="relative group">
          <img
            src={`data:image/jpeg;base64,${imageBase64}`}
            alt="Uploaded"
            className="w-full h-56 object-cover rounded-xl border border-border"
          />
          <button
            onClick={() => setImage("", "")}
            className="absolute top-3 right-3 bg-black/60 text-white rounded-lg px-3 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-surface-2"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-4xl mb-3 opacity-40">+</div>
          <p className="text-sm text-muted">
            {isDragActive ? "Drop your image here" : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-muted/50 mt-1">JPG, PNG, WebP up to 20MB</p>
        </div>
      )}
    </div>
  );
}
