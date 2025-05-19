"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface PointerHighlightProps {
  children: React.ReactNode;
  rectangleClassName?: string;
  pointerClassName?: string;
  containerClassName?: string;
}

export const PointerHighlight = ({
  children,
  rectangleClassName,
  pointerClassName,
  containerClassName,
}: PointerHighlightProps) => {
  return (
    <div className={cn("relative", containerClassName)}>
      <div
        className={cn(
          "absolute -inset-1 rounded-lg border-2 border-dashed",
          rectangleClassName
        )}
      />
      <div className={cn("absolute -right-1 -top-1", pointerClassName)}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L11 11M11 1L1 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {children}
    </div>
  );
}; 