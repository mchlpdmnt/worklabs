"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { useRouter } from "next/router";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CurvePageTransitionProps = {
  children: React.ReactNode;

  /** Map of pathname -> label shown while the curve covers the page.
   *  Unmapped paths fall back to the capitalized last URL segment. */
  routes?: Record<string, string>;

  /** Page background color behind the content */
  backgroundColor?: string;

  /** Color of the sweeping overlay curve (and its label backdrop) */
  curveColor?: string;

  className?: string;
};

/** Spread helper: wires a variants object to the standard three states. */
const anim = (variants: Variants) => ({
  variants,
  initial: "initial",
  animate: "enter",
  exit: "exit",
});

// NOTE: everything animates `y` (a compositor-friendly transform), never
// `top` — animating layout properties on viewport-sized elements forces a
// relayout every frame and visibly drops frames.

const text = (viewportH: number): Variants => ({
  initial: { opacity: 1, y: 0 },
  enter: {
    opacity: 0,
    y: -(viewportH * 0.5 + 150),
    transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
    transitionEnd: { y: 60 },
  },
  exit: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.4, ease: [0.33, 1, 0.68, 1] },
  },
});

const translate = (depth: number, viewportH: number): Variants => ({
  initial: { y: -depth },
  enter: {
    y: -viewportH,
    transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
    transitionEnd: { y: viewportH },
  },
  exit: {
    y: -depth,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
});

// page content parallax: eases upward while the sheet covers it on exit,
// and settles upward into place as the sheet peels away on enter
const content: Variants = {
  initial: { y: 150 },
  enter: {
    y: 0,
    // long exponential ease-out: most travel early, feathered landing
    transition: { duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    y: -120,
    // gentler in-out than the sheet's curve, slightly longer, so the
    // content glides rather than snaps while being covered
    transition: { duration: 0.85, ease: [0.65, 0, 0.35, 1] },
  },
};

const curve = (initialPath: string, targetPath: string): Variants => ({
  initial: { d: initialPath },
  enter: {
    d: targetPath,
    transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    d: initialPath,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
});

function defaultLabel(path: string) {
  if (path === "/") return "Home";
  const seg = path.split("/").filter(Boolean).pop() ?? "";
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

/**
 * Curve page-transition layout for the Pages Router, after Olivier Larose's
 * "Next.js Page Transition Guide". Wrap each page's content in this component
 * and mount <AnimatePresence mode="wait"> around <Component> in _app (see the
 * README) — on navigation a colored sheet with a curved edge sweeps over the
 * outgoing page, shows the route label, then peels away from the new page.
 */
export function CurvePageTransition({
  children,
  routes,
  backgroundColor,
  curveColor = "black",
  className,
}: CurvePageTransitionProps) {
  const router = useRouter();
  const [dimensions, setDimensions] = React.useState<{
    width: number | null;
    height: number | null;
  }>({ width: null, height: null });

  React.useEffect(() => {
    function resize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const label =
    routes?.[router.route] ??
    routes?.[router.asPath] ??
    defaultLabel(router.route);

  return (
    <div
      // overflow-y-clip: the content parallax translates the page down during
      // enter, and transformed boxes count toward scrollable overflow — without
      // the clip, a scrollbar flashes in for the duration of the transition
      className={cn("relative min-h-screen overflow-y-clip", className)}
      style={{ backgroundColor }}
    >
      {/* solid cover shown until the window is measured, so the first
          paint never flashes unstyled content before the SVG mounts */}
      <div
        className="pointer-events-none fixed top-0"
        style={{
          left: -5,
          width: "calc(100vw + 10px)",
          height: "calc(100vh + 600px)",
          backgroundColor: curveColor,
          opacity: dimensions.width === null ? 1 : 0,
          transition: "opacity 0s linear 0.1s",
          zIndex: 2,
        }}
      />
      <motion.p
        className="pointer-events-none absolute left-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 text-center text-[length:clamp(1.5rem,5vw,2.875rem)] font-medium text-white"
        style={{ top: "50%" }}
        {...anim(text(dimensions.height ?? 800))}
      >
        {label}
      </motion.p>
      {dimensions.width !== null && dimensions.height !== null && (
        <SVG
          width={dimensions.width}
          height={dimensions.height}
          curveColor={curveColor}
        />
      )}
      <motion.div {...anim(content)}>{children}</motion.div>
    </div>
  );
}

function SVG({
  width,
  height,
  curveColor,
}: {
  width: number;
  height: number;
  curveColor: string;
}) {
  // The curved lip is 300px deep on desktop, but a fixed depth turns into a
  // deep bowl on narrow screens — scale it with the viewport width, and use
  // an even gentler ratio on phones.
  const depth = Math.min(300, Math.round(width / (width < 640 ? 6 : 4)));

  // The svg element is positioned 5px past both horizontal viewport edges
  // (see the style below) and the path fills that entire widened box —
  // subpixel rounding on scaled displays can otherwise leave a hairline gap
  // at the viewport edge, since the path clips to the svg's own bounds.
  const L = 0;
  const R = width + 10;

  // covering state: curved lips bulge `depth`px past the top and bottom edges
  const initialPath = `
    M${L} ${depth}
    Q${width / 2} 0 ${R} ${depth}
    L${R} ${height + depth}
    Q${width / 2} ${height + depth * 2} ${L} ${height + depth}
    L${L} 0
  `;

  // revealed state: bottom edge flattens against the viewport bottom
  const targetPath = `
    M${L} ${depth}
    Q${width / 2} 0 ${R} ${depth}
    L${R} ${height}
    Q${width / 2} ${height} ${L} ${height}
    L${L} 0
  `;

  return (
    <motion.svg
      className="pointer-events-none fixed"
      style={{
        top: 0,
        left: -5,
        width: "calc(100vw + 10px)",
        height: `calc(100vh + ${depth * 2}px)`,
        zIndex: 2,
        willChange: "transform",
      }}
      {...anim(translate(depth, height))}
    >
      <motion.path fill={curveColor} {...anim(curve(initialPath, targetPath))} />
    </motion.svg>
  );
}
