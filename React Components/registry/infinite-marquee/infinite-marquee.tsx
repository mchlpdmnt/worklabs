"use client";

import * as React from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";

export type InfiniteMarqueeProps = {
  items: string[];
  speed?: number;
  separator?: React.ReactNode;
  className?: string;
};

export function InfiniteMarquee({ items, speed = 56, separator = "✦", className }: InfiniteMarqueeProps) {
  const group = React.useRef<HTMLDivElement>(null);
  const direction = React.useRef(-1);
  const x = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 2) direction.current = event.deltaY > 0 ? -1 : 1;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useAnimationFrame((_time, delta) => {
    if (reduceMotion || !group.current) return;
    const width = group.current.offsetWidth;
    if (!width) return;
    let next = x.get() + direction.current * speed * (delta / 1000);
    if (next <= -width) next += width;
    if (next > 0) next -= width;
    x.set(next);
  });

  const content = (hidden = false) => (
    <div ref={hidden ? undefined : group} className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <React.Fragment key={`${item}-${index}`}>
          <span className="whitespace-nowrap px-[0.16em]">{item}</span>
          <span className="mx-[0.22em] text-[0.42em] opacity-50" aria-hidden="true">{separator}</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className={`w-full overflow-hidden ${className ?? ""}`} aria-label={items.join(", ")}>
      <motion.div className="flex w-max will-change-transform" style={{ x }}>
        {content()}{content(true)}
      </motion.div>
    </div>
  );
}
