"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

export type BadgeImage = {
  src: string;
  alt: string;
};

export type ImagesBadgeProps = {
  images: BadgeImage[];
  maxVisible?: number;
  revealCount?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "rounded" | "square";
  className?: string;
  imageClassName?: string;
  labelClassName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const CONFIG = {
  sm: {
    pixels: 32,
    gap: 8,
    pill: "h-9 gap-2 pl-2 pr-3.5 text-[11px]",
    count: "text-[9px]",
  },
  md: {
    pixels: 42,
    gap: 10,
    pill: "h-11 gap-2.5 pl-2.5 pr-4 text-xs",
    count: "text-[10px]",
  },
  lg: {
    pixels: 56,
    gap: 12,
    pill: "h-14 gap-3 pl-3 pr-5 text-sm",
    count: "text-xs",
  },
} as const;

const SHAPES = {
  circle: "rounded-full",
  rounded: "rounded-[10px]",
  square: "rounded-[4px]",
} as const;

const SPRING = { type: "spring" as const, stiffness: 280, damping: 24 };
const REST_ROTATION = [-14, -7, -2, 5, 11, -9, 3, -5] as const;
const HOVER_ROTATION = [-8, -4, -1, 2, 6, -6, 2, -3] as const;

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function arcOffset(index: number, total: number, pixels: number) {
  if (total <= 1) return 0;
  const middle = (total - 1) / 2;
  const position = (index - middle) / middle;
  return position * position * (pixels * 0.22);
}

export function ImagesBadge({
  images,
  maxVisible = 3,
  revealCount = 2,
  label,
  size = "md",
  shape = "rounded",
  className,
  imageClassName,
  labelClassName,
  onClick,
}: ImagesBadgeProps) {
  const [hovered, setHovered] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const { pixels, gap, pill, count } = CONFIG[size];

  const rendered = images.slice(0, maxVisible + revealCount);
  const overflow = Math.max(0, images.length - maxVisible - revealCount);
  const slots: Array<BadgeImage | null> =
    overflow > 0 ? [...rendered, null] : rendered;
  const total = slots.length;
  const peek = Math.round(pixels * 0.32);
  const collapsedWidth =
    total > 0 ? pixels + (Math.min(maxVisible, total) - 1) * peek : 0;
  const spreadWidth =
    total > 0 ? total * pixels + (total - 1) * gap : 0;

  const spreadX = (index: number) => index * (pixels + gap);
  const collapsedX = (index: number) =>
    index >= maxVisible ? (maxVisible - 1) * peek : index * peek;

  if (!total) return null;

  return (
    <motion.div
      className={classes(
        "inline-flex select-none items-center rounded-full border border-neutral-900/15 bg-[#fffafa] text-neutral-800 transition-[border-color] duration-300 motion-reduce:duration-0 hover:border-neutral-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffafa]",
        pill,
        onClick && "cursor-pointer",
        className,
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { y: -2, scale: 1.015 }}
      transition={SPRING}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.currentTarget.click();
              }
            }
          : undefined
      }
    >
      <motion.div
        className="relative shrink-0"
        style={{ height: pixels + 12 }}
        animate={{
          width: reducedMotion
            ? spreadWidth
            : hovered
              ? spreadWidth
              : collapsedWidth,
        }}
        transition={SPRING}
      >
        {slots.map((image, index) => {
          const hidden = index >= maxVisible && image !== null;
          const isOverflow = image === null;
          const x = hovered ? spreadX(index) : collapsedX(index);
          const y = hovered ? arcOffset(index, total, pixels) : 0;
          const rotation = reducedMotion
            ? 0
            : hovered
              ? (HOVER_ROTATION[index] ?? 0)
              : (REST_ROTATION[index] ?? 0);

          return (
            <motion.div
              key={image?.src ?? `overflow-${overflow}`}
              className={classes(
                "absolute left-0 top-0 flex shrink-0 items-center justify-center border-2 border-[#fffafa] shadow-[0_3px_9px_rgba(23,23,23,0.24)]",
                !isOverflow && "overflow-hidden",
                SHAPES[isOverflow ? "circle" : shape],
                isOverflow && "bg-neutral-200",
                imageClassName,
              )}
              style={{
                width: pixels,
                height: pixels,
                zIndex: hovered ? index + 1 : total - index,
              }}
              animate={{
                x: reducedMotion ? spreadX(index) : x,
                y: reducedMotion ? 0 : y,
                rotate: rotation,
                opacity: hidden ? (hovered ? 1 : 0) : 1,
                scale: hidden ? (hovered ? 1 : 0.6) : 1,
              }}
              transition={{
                ...SPRING,
                delay:
                  !reducedMotion && hidden ? (index - maxVisible) * 0.06 : 0,
              }}
            >
              {isOverflow ? (
                <span className={classes("font-semibold text-neutral-600", count)}>
                  +{overflow}
                </span>
              ) : (
                <img
                  src={image.src}
                  alt={image.alt}
                  width={pixels}
                  height={pixels}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {label ? (
        <span
          className={classes(
            "whitespace-nowrap font-medium leading-none text-neutral-700",
            labelClassName,
          )}
        >
          {label}
        </span>
      ) : null}
    </motion.div>
  );
}

export default ImagesBadge;
