"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

export type TextScrollRevealProps = {
  text: string;
  className?: string;
  height?: number;
};

export function TextScrollReveal({ text, className, height = 620 }: TextScrollRevealProps) {
  const words = React.useMemo(() => text.trim().split(/\s+/), [text]);
  const [progress, setProgress] = React.useState(0);
  const reduceMotion = useReducedMotion();
  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const node = event.currentTarget;
    const range = node.scrollHeight - node.clientHeight;
    setProgress(range > 0 ? node.scrollTop / range : 1);
  };

  return (
    <div
      className={`relative overflow-y-auto overscroll-contain ${className ?? ""}`}
      style={{ height }}
      onScroll={onScroll}
      tabIndex={0}
      data-lenis-prevent
      aria-label={`${text}. Scroll to reveal the text.`}
    >
      <div className="h-[220%]">
        <p className="sticky top-0 flex min-h-full flex-wrap content-center px-6 py-20 text-[clamp(2rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.04em]" aria-hidden="true">
          {words.map((word, index) => {
            const start = (index / Math.max(words.length, 1)) * 0.72;
            const opacity = reduceMotion ? 1 : Math.max(0.16, Math.min(1, (progress - start) * 7 + 0.16));
            return <span key={`${word}-${index}`} className="mr-[0.22em] transition-opacity duration-150" style={{ opacity }}>{word}</span>;
          })}
        </p>
      </div>
    </div>
  );
}
