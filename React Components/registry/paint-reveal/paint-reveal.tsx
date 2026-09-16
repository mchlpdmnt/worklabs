"use client";

import * as React from "react";

export type PaintRevealProps = {
  children?: React.ReactNode;
  cover?: string;
  brushSize?: number;
  className?: string;
};

export function PaintReveal({ children, cover = "#f4f0e8", brushSize = 72, className }: PaintRevealProps) {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const drawing = React.useRef(false);
  const previous = React.useRef<{ x: number; y: number } | null>(null);

  const reset = React.useCallback(() => {
    const node = canvas.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    node.width = Math.max(1, Math.round(bounds.width * ratio));
    node.height = Math.max(1, Math.round(bounds.height * ratio));
    const context = node.getContext("2d");
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.globalCompositeOperation = "source-over";
    context.fillStyle = cover;
    context.fillRect(0, 0, bounds.width, bounds.height);
  }, [cover]);

  React.useEffect(() => {
    reset();
    const observer = new ResizeObserver(reset);
    if (canvas.current) observer.observe(canvas.current);
    return () => observer.disconnect();
  }, [reset]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };
  const erase = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const node = event.currentTarget;
    const context = node.getContext("2d");
    if (!context) return;
    const next = point(event);
    const last = previous.current ?? next;
    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = brushSize;
    context.beginPath();
    context.moveTo(last.x, last.y);
    context.lineTo(next.x, next.y);
    context.stroke();
    previous.current = next;
  };
  const finish = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    previous.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className={`relative isolate min-h-80 overflow-hidden rounded-2xl bg-black ${className ?? ""}`}>
      <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-white">{children}</div>
      <canvas
        ref={canvas}
        className="absolute inset-0 size-full cursor-crosshair touch-none"
        aria-label="Paint away the cover to reveal the content"
        onPointerDown={(event) => { drawing.current = true; previous.current = point(event); event.currentTarget.setPointerCapture(event.pointerId); erase(event); }}
        onPointerMove={erase}
        onPointerUp={finish}
        onPointerCancel={finish}
      />
      <button type="button" className="absolute right-4 top-4 z-10 min-h-11 rounded-md bg-black px-4 text-xs font-semibold text-white ring-white/70 focus-visible:outline-none focus-visible:ring-4" onClick={reset}>Reset</button>
    </div>
  );
}
