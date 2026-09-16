"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type LandingGreetProps = {
  /** Page content. When provided, it gets the same parallax settle as
   *  curve-page-transition: it rises into place as the sweep reveals it. */
  children?: React.ReactNode;

  /** Page background color behind the content (children mode) */
  backgroundColor?: string;

  /** Greetings to cycle through before the sweep */
  words?: string[];

  /** How long the first word holds (ms) */
  firstWordMs?: number;

  /** How long each subsequent word holds (ms) */
  wordMs?: number;

  /** Pause on the last word before the sweep starts (ms) */
  holdMs?: number;

  /** Overlay color */
  curveColor?: string;

  className?: string;

  /** Fires once the sweep finishes and the overlay unmounts */
  onComplete?: () => void;
};

const DEFAULT_WORDS = [
  "Hello",
  "Hola",
  "Bonjour",
  "Hei",
  "Dia dhuit",
  "Привет",
  "안녕하세요",
  "こんにちは",
  "你好",
  "Kamusta",
];

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// NOTE: the overlay animates `y` (a compositor-friendly transform), never
// `top` — animating layout properties on viewport-sized elements drops frames.

const opacity: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
};

const slideUp = (viewportH: number): Variants => ({
  initial: { y: 0 },
  exit: {
    y: -viewportH,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
});

const curve = (initialPath: string, targetPath: string): Variants => ({
  initial: { d: initialPath },
  exit: {
    d: targetPath,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
  },
});

// same parallax as curve-page-transition's content: the page settles upward
// into place while the sweep reveals it
const content: Variants = {
  covered: { y: 150 },
  revealed: {
    y: 0,
    transition: { duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Awwwards-style intro preloader, after Olivier Larose's landing page
 * tutorial: a dark cover cycles through greetings, then sweeps upward off the
 * page with a curved trailing edge. Self-contained — drop `<LandingGreet />`
 * anywhere in the page; no AnimatePresence wiring needed in _app.
 */
export function LandingGreet({
  children,
  backgroundColor,
  words = DEFAULT_WORDS,
  firstWordMs = 1000,
  wordMs = 150,
  holdMs = 400,
  curveColor = "black",
  className,
  onComplete,
}: LandingGreetProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [done, setDone] = React.useState(() => words.length === 0);
  const [dimensions, setDimensions] = React.useState<{
    width: number | null;
    height: number | null;
  }>({ width: null, height: null });

  useIsomorphicLayoutEffect(() => {
    const measure = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // reduced-motion users skip the intro entirely
  React.useEffect(() => {
    if (reduceMotion) setDone(true);
  }, [reduceMotion]);

  // cycle the greetings, then trigger the sweep
  React.useEffect(() => {
    if (done || !words.length) return;
    const last = index === words.length - 1;
    const t = window.setTimeout(
      () => (last ? setDone(true) : setIndex((i) => i + 1)),
      last ? holdMs : index === 0 ? firstWordMs : wordMs,
    );
    return () => window.clearTimeout(t);
  }, [index, done, words.length, firstWordMs, wordMs, holdMs]);

  // lock page scroll while the overlay is up
  React.useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  const { width, height } = dimensions;

  // same responsive treatment as curve-page-transition: lip depth scales
  // with viewport width, and paths overshoot 5px past both horizontal edges
  // so subpixel rounding never exposes a hairline gap
  const depth =
    width === null
      ? 300
      : Math.min(300, Math.round(width / (width < 640 ? 6 : 4)));

  const hasSize = width !== null && height !== null;
  const initialPath = hasSize
    ? `M-5 0 L${width + 5} 0 L${width + 5} ${height} Q${width / 2} ${
        height + depth
      } -5 ${height} L-5 0`
    : "";
  const targetPath = hasSize
    ? `M-5 0 L${width + 5} 0 L${width + 5} ${height} Q${width / 2} ${height} -5 ${height} L-5 0`
    : "";

  const overlay = (
    <AnimatePresence mode="wait" onExitComplete={() => onComplete?.()}>
      {!done && (
        <motion.div
          className={cn(
            "fixed inset-0 z-[99] flex items-center justify-center",
            children === undefined && className,
          )}
          style={{ backgroundColor: curveColor, willChange: "transform" }}
          variants={slideUp(height ?? 800)}
          initial="initial"
          exit="exit"
        >
          {hasSize && (
            <>
              {/* curved lip hanging below the viewport; flattens as it exits */}
              <svg
                className="pointer-events-none absolute"
                style={{
                  top: 0,
                  left: -5,
                  width: "calc(100vw + 10px)",
                  height: `calc(100vh + ${depth}px)`,
                }}
              >
                <motion.path
                  fill={curveColor}
                  variants={curve(initialPath, targetPath)}
                  initial="initial"
                  exit="exit"
                />
              </svg>
              <motion.p
                className="relative z-10 text-[length:clamp(1.5rem,5vw,2.875rem)] font-medium text-white"
                variants={opacity}
                initial="initial"
                animate="enter"
              >
                {words[index]}
              </motion.p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // overlay-only mode: drop the component next to your content
  if (children === undefined) return overlay;

  // children mode: wraps the page like curve-page-transition, so the content
  // settles upward into place while the sweep reveals it. overflow-y-clip
  // keeps the parallax offset from flashing a scrollbar (transformed boxes
  // count toward scrollable overflow).
  return (
    <div
      className={cn("relative min-h-screen overflow-y-clip", className)}
      style={{ backgroundColor }}
    >
      {overlay}
      <motion.div
        variants={content}
        initial={reduceMotion ? false : "covered"}
        animate={done ? "revealed" : "covered"}
      >
        {children}
      </motion.div>
    </div>
  );
}
