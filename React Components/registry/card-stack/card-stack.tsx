"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Easing,
} from "motion/react";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  /** Longer text shown on the card's back face (falls back to description) */
  details?: string;
  imageSrc?: string;
  href?: string;
  /** CTA label on the back face (default "Take me there") */
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card sizing */
  cardWidth?: number;
  cardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion — tween with exponential ease-out by default */
  switchDurationSec?: number;
  switchEase?: Easing;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;

  /** Custom renderer for the flipped back face (optional) */
  renderCardBack?: (item: T, state: { active: boolean }) => React.ReactNode;
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,

  cardWidth = 520,
  cardHeight = 320,

  overlap = 0.48,
  spreadDeg = 48,

  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 0,

  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,

  switchDurationSec = 0.65,
  switchEase = [0.16, 1, 0.3, 1],

  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,

  showDots = true,
  className,

  onChangeIndex,
  renderCard,
  renderCardBack,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);
  const [flipped, setFlipped] = React.useState(false);
  const draggingRef = React.useRef(false);

  // close the back face whenever the selection moves
  React.useEffect(() => {
    setFlipped(false);
  }, [active]);

  // measure the container and scale the whole fan down when it can't fit a card
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number | null>(
    null,
  );

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fitScale =
    containerWidth === null
      ? 1
      : Math.min(1, Math.max(0.2, (containerWidth - 24) / cardWidth));
  const w = Math.round(cardWidth * fitScale);
  const h = Math.round(cardHeight * fitScale);

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));

  const cardSpacing = Math.max(10, Math.round(w * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  // Side cards arc downward and their rotated corners (plus shadows) extend
  // below the card box; reserve that spill inside the stage, because the
  // edge-fade mask clips anything painted outside the stage's own box.
  // (offsets can't exceed what the item count actually produces)
  const maxRealOffset = Math.min(maxOffset, loop ? Math.floor(len / 2) : len - 1);
  let bottomSpill = 40 * fitScale;
  for (let k = 1; k <= maxRealOffset; k++) {
    const rad = (stepDeg * k * Math.PI) / 180;
    const cornerDrop =
      (w / 2) * Math.sin(rad) + (h / 2) * Math.cos(rad) - h / 2;
    bottomSpill = Math.max(
      bottomSpill,
      30 * fitScale * k + cornerDrop + 20 * fitScale,
    );
  }
  bottomSpill = Math.round(bottomSpill);

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Enter") setFlipped((f) => !f);
    if (e.key === "Escape") setFlipped(false);
  };

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage — breaks out of the content column to full viewport width, so
          side cards spill past the column and only clip (with a soft fade) at
          the actual screen edges. Card sizing still measures the column. */}
      <div
        className="relative overflow-x-clip"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          height: Math.max(240, h + 80) + bottomSpill,
          // fade clipped side cards out at the edges instead of hard cutoffs
          maskImage:
            "linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)",
        }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* background wash / spotlight (unique feel) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-black/5 blur-3xl dark:bg-white/5"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/10 blur-3xl dark:bg-black/30"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              // hide far-away cards cleanly
              if (!visible) return null;

              // fan geometry
              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 30 * fitScale; // arc-down, keeps rotated corners below the active card's top edge
              const z = -abs * depthPx * fitScale;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx * fitScale : 0;

              const rotateX = isActive ? 0 : tiltXDeg;

              const zIndex = 100 - abs;

              // Growing a rotated card on hover raises its top corner by
              // scaleBump * cornerHeight; push the card down by the same
              // amount so it never peeks above the active card's top edge.
              const hoverScaleBump = isActive ? 0.02 : 0.04;
              const rotRad = (Math.abs(rotateZ) * Math.PI) / 180;
              const cornerRise =
                (w / 2) * Math.sin(rotRad) + (h / 2) * Math.cos(rotRad);
              const hoverYComp = isActive
                ? -8 * fitScale
                : cornerRise * hoverScaleBump + 2;

              // drag only on the active card
              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragStart: () => {
                      draggingRef.current = true;
                    },
                    onDragEnd: (
                      _e: unknown,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      // let the trailing click see that this was a drag
                      window.setTimeout(() => {
                        draggingRef.current = false;
                      }, 0);
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, w * 0.22);

                      // swipe logic
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute will-change-transform select-none",
                    isActive
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer",
                  )}
                  style={{
                    width: w,
                    height: h,
                    bottom: bottomSpill,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    // framer doesn't support translateZ directly in animate on all setups,
                    // so we use a custom transform via style below.
                    scale,
                  }}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: y + lift + hoverYComp,
                          scale: scale + hoverScaleBump,
                          rotateX: isActive ? 0 : tiltXDeg * 0.5,
                          transition: {
                            duration: 0.3,
                            ease: switchEase,
                          },
                        }
                  }
                  transition={{
                    duration: switchDurationSec,
                    ease: switchEase,
                  }}
                  // translateZ via style transform (kept stable w/ motion values above)
                  // We apply translateZ by using a CSS transform in a child wrapper.
                  onClick={() => {
                    if (!isActive) {
                      setActive(i);
                      return;
                    }
                    if (draggingRef.current) return;
                    setFlipped((f) => !f);
                  }}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                      perspective: `${perspectivePx}px`,
                    }}
                  >
                    <motion.div
                      className="relative h-full w-full"
                      style={{ transformStyle: "preserve-3d" }}
                      animate={{ rotateY: isActive && flipped ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: switchEase }}
                    >
                      {/* front */}
                      <div
                        className="@container absolute inset-0 overflow-hidden rounded-2xl border-4 border-black/10 shadow-xl dark:border-white/10"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        {renderCard ? (
                          renderCard(item, { active: isActive })
                        ) : (
                          <DefaultFanCard item={item} active={isActive} />
                        )}
                      </div>
                      {/* back */}
                      <div
                        className="@container absolute inset-0 overflow-hidden rounded-2xl border-4 border-black/10 shadow-xl dark:border-white/10"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        {renderCardBack ? (
                          renderCardBack(item, { active: isActive })
                        ) : (
                          <DefaultCardBack item={item} />
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots navigation centered at bottom */}
      {showDots ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    on
                      ? "bg-foreground"
                      : "bg-foreground/30 hover:bg-foreground/50",
                  )}
                  aria-label={`Go to ${it.title}`}
                />
              );
            })}
          </div>
          {activeItem.href ? (
            <Link
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition"
              aria-label="Open link"
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultCardBack({ item }: { item: CardStackItem }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-900 text-white">
      {/* dimmed image backdrop */}
      {item.imageSrc ? (
        <img
          src={item.imageSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          draggable={false}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col p-4 @sm:p-6">
        {item.tag ? (
          <span className="mb-2 w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80">
            {item.tag}
          </span>
        ) : null}
        <div className="text-lg font-semibold @sm:text-xl">{item.title}</div>
        <p className="mt-2 flex-1 overflow-hidden text-xs leading-relaxed text-white/75 @sm:text-sm">
          {item.details ?? item.description}
        </p>
        {item.href ? (
          <div className="mt-3 flex justify-end @sm:mt-4">
            <Link
              href={item.href}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-white/90 @sm:px-4 @sm:py-2 @sm:text-sm"
            >
              {item.ctaLabel ?? "Take me there"}
              <SquareArrowOutUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DefaultFanCard({ item }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="relative h-full w-full">
      {/* image */}
      <div className="absolute inset-0">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* subtle gradient overlay at bottom for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-4 @sm:p-5">
        <div className="truncate text-base font-semibold text-white @sm:text-lg">
          {item.title}
        </div>
        {item.description ? (
          <div className="mt-1 line-clamp-2 text-xs text-white/80 @sm:text-sm">
            {item.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}
