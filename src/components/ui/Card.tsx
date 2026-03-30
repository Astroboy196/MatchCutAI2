"use client";

import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  selected?: boolean;
}

export function Card({ className, hover, selected, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface border border-border p-5",
        hover && "transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer",
        selected && "border-primary shadow-lg shadow-primary/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
