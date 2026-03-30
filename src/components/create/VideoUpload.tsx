"use client";

import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useCreateStore } from "@/stores/createStore";

export function VideoUpload() {
  const { imageBase64, setImage } = useCreateStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const extractFrame = useCallback(
    (file: File) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;

      video.onloadeddata = () => {
        video.currentTime = 1;
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64 = dataUrl.split(",")[1];
        setImage(base64, "image/jpeg");
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);
    },
    [setImage],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      extractFrame(file);
    },
    [extractFrame],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".webm"] },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
  });

  return (
    <div className="space-y-3">
      <label className="text-sm text-muted font-medium">
        Upload a video — we'll extract the best frame
      </label>

      {imageBase64 ? (
        <div className="relative group">
          <img
            src={`data:image/jpeg;base64,${imageBase64}`}
            alt="Video frame"
            className="w-full h-56 object-cover rounded-xl border border-border"
          />
          <div className="absolute bottom-3 left-3 bg-black/60 text-white rounded-lg px-3 py-1.5 text-xs font-medium">
            Extracted Frame
          </div>
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
            {isDragActive ? "Drop your video here" : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-muted/50 mt-1">MP4, MOV, WebM up to 100MB</p>
        </div>
      )}

      <video ref={videoRef} className="hidden" />
    </div>
  );
}
