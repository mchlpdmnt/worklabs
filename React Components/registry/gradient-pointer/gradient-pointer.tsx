"use client";

import * as React from "react";

export type GradientPointerProps = {
  children?: React.ReactNode;
  className?: string;
  glow?: string;
  base?: string;
};

export function GradientPointer({ children, className, glow = "#f0ff8c", base = "#5528ff" }: GradientPointerProps) {
  const surface = React.useRef<HTMLDivElement>(null);
  const setPosition = (x: number, y: number) => {
    surface.current?.style.setProperty("--pointer-x", `${x}%`);
    surface.current?.style.setProperty("--pointer-y", `${y}%`);
  };
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition(((event.clientX - bounds.left) / bounds.width) * 100, ((event.clientY - bounds.top) / bounds.height) * 100);
  };

  return (
    <div
      ref={surface}
      className={`relative isolate overflow-hidden rounded-2xl ${className ?? ""}`}
      style={{
        "--pointer-x": "50%", "--pointer-y": "50%",
        background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), ${glow} 0%, ${base} 38%, #090909 78%)`,
      } as React.CSSProperties}
      onPointerMove={move}
      onPointerLeave={() => setPosition(50, 50)}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
