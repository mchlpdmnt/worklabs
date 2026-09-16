"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export type MagneticButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onPointerMove" | "onPointerLeave"> & {
  strength?: number;
};

export function MagneticButton({ strength = 0.3, className, children, ...props }: MagneticButtonProps) {
  const xTarget = useMotionValue(0);
  const yTarget = useMotionValue(0);
  const x = useSpring(xTarget, { stiffness: 210, damping: 18, mass: 0.35 });
  const y = useSpring(yTarget, { stiffness: 210, damping: 18, mass: 0.35 });
  const reduceMotion = useReducedMotion();

  const reset = () => { xTarget.set(0); yTarget.set(0); };
  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    xTarget.set((event.clientX - bounds.left - bounds.width / 2) * strength);
    yTarget.set((event.clientY - bounds.top - bounds.height / 2) * strength);
  };

  return (
    <motion.span className="inline-block" style={{ x, y }}>
      <button
        {...props}
        type={props.type ?? "button"}
        className={`inline-flex min-h-11 items-center justify-center rounded-md bg-white px-7 py-3 text-sm font-semibold text-black outline-none ring-white/70 transition-colors hover:bg-neutral-200 focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
        onPointerMove={move}
        onPointerLeave={reset}
        onBlur={reset}
      >
        {children}
      </button>
    </motion.span>
  );
}
