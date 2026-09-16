"use client";

import * as React from "react";
import { ArrowRight, Clock } from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  imageAlt: string;
  /** Optional avatar / publication logo shown top-left */
  logo?: React.ReactNode;
  title: string;
  /** Reading estimate, e.g. "6 min read" */
  readingTime: string;
  /** Publish date, e.g. "Jul 18, 2026" */
  datePublished: string;
  /** Short description of the post */
  excerpt: string;
  /** CTA label (default "Read") */
  ctaLabel?: string;
  onRead?: () => void;
}

const BlogCard = React.forwardRef<HTMLDivElement, BlogCardProps>(
  (
    {
      className,
      imageUrl,
      imageAlt,
      logo,
      title,
      readingTime,
      datePublished,
      excerpt,
      ctaLabel = "Read",
      onRead,
      onClick,
      ...props
    },
    ref,
  ) => {
    // Tailwind gates every `group-hover:` rule behind `@media (hover: hover)`,
    // so on touch devices the hover reveal never fires. There we drive the
    // same styles from `data-expanded`, toggled by tapping the card.
    const [canHover, setCanHover] = React.useState(true);
    const [expanded, setExpanded] = React.useState(false);

    React.useEffect(() => {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      const sync = () => setCanHover(mq.matches);
      sync();
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canHover) setExpanded((v) => !v);
      onClick?.(e);
    };

    return (
      <div
        ref={ref}
        data-expanded={expanded ? "true" : "false"}
        aria-expanded={canHover ? undefined : expanded}
        onClick={handleClick}
        className={cn(
          "group relative isolate h-[26rem] w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-lg sm:h-[30rem]",
          "transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl",
          "data-[expanded=true]:-translate-y-2 data-[expanded=true]:shadow-2xl",
          !canHover && "cursor-pointer",
          className,
        )}
        {...props}
      >
        {/* Background image with zoom on reveal — own GPU layer so its scale
            doesn't force the overlay above it to repaint every frame */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full transform-gpu object-cover [backface-visibility:hidden] transition-transform duration-500 ease-in-out will-change-transform group-hover:scale-110 group-data-[expanded=true]:scale-110"
        />

        {/* Gradient overlay for text readability — a smooth multi-stop ramp
            (solid black at the bottom, gently fading out by ~88% up). More
            stops than a 3-stop from/via/to avoids a visible slope-change line
            where the scrim meets a bright image, and the expanded dark base
            keeps the revealed elements seated on solid darkness. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#000_0%,rgba(0,0,0,0.88)_16%,rgba(0,0,0,0.65)_34%,rgba(0,0,0,0.4)_52%,rgba(0,0,0,0.18)_70%,transparent_88%)]" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-5 text-card-foreground sm:p-6">
          {/* Top: avatar / logo */}
          <div className="flex h-28 items-start sm:h-40">
            {logo && (
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white/50 bg-black/20 backdrop-blur-sm sm:h-12 sm:w-12">
                {logo}
              </div>
            )}
          </div>

          {/* Middle: title, date, excerpt (slides up on reveal) */}
          <div className="space-y-3 transition-transform duration-500 ease-in-out will-change-transform group-hover:-translate-y-16 group-data-[expanded=true]:-translate-y-16 sm:space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                {title}
              </h3>
              <p className="text-sm text-white/80">{datePublished}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white/90">ABOUT</h4>
              <p className="line-clamp-3 text-sm leading-relaxed text-white/70">
                {excerpt}
              </p>
            </div>
          </div>

          {/* Bottom: reading time + Read button (revealed on hover / tap).
              Slides on translate (compositor) + opacity — never `bottom`,
              which would relayout/repaint every frame and drag a dark band
              through the gradient above the zooming image. */}
          <div className="absolute bottom-0 left-0 w-full translate-y-full p-5 opacity-0 transition-[transform,opacity] duration-500 ease-in-out will-change-transform group-hover:translate-y-0 group-hover:opacity-100 group-data-[expanded=true]:translate-y-0 group-data-[expanded=true]:opacity-100 sm:p-6">
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">{readingTime}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  // don't let the tap bubble up and collapse the card
                  e.stopPropagation();
                  onRead?.();
                }}
                className="inline-flex shrink-0 items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 sm:px-5 sm:py-2.5"
              >
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
BlogCard.displayName = "BlogCard";

export { BlogCard };
