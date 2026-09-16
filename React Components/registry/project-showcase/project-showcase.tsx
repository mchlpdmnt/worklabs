"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

export type ProjectShowcaseItem = {
  title: string;
  link: string;
  description?: string | null;
  year?: string | null;
  image?: string | null;
  imageSrcSet?: string;
};

export type ProjectShowcaseProps = {
  projects?: ProjectShowcaseItem[];
  className?: string;
  emptyMessage?: string;
};

const PREVIEW_WIDTH = 320;
const PREVIEW_HEIGHT = 200;
const FOLLOW_SPRING = { stiffness: 230, damping: 28, mass: 0.45 };

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function ProjectShowcase({
  projects = [],
  className = "",
  emptyMessage = "No projects have been published yet.",
}: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const smoothX = useSpring(previewX, FOLLOW_SPRING);
  const smoothY = useSpring(previewY, FOLLOW_SPRING);

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion || event.pointerType !== "mouse") return;

      previewX.set(
        clamp(event.clientX + 24, 16, window.innerWidth - PREVIEW_WIDTH - 16),
      );
      previewY.set(
        clamp(
          event.clientY - PREVIEW_HEIGHT / 2,
          16,
          window.innerHeight - PREVIEW_HEIGHT - 16,
        ),
      );
    },
    [previewX, previewY, reducedMotion],
  );

  const handlePointerEnter = (
    event: React.PointerEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    setHoveredIndex(index);
    if (event.pointerType === "mouse" && !reducedMotion) {
      setPreviewVisible(true);
    }
  };

  const clearPointerPreview = () => {
    setHoveredIndex(null);
    setPreviewVisible(false);
  };

  if (!projects.length) {
    return (
      <section
        aria-label="Projects"
        className={`mx-auto w-full max-w-[1200px] px-6 pb-28 sm:px-10 sm:pb-36 lg:px-12 ${className}`}
      >
        <p className="border-t border-neutral-900/20 py-10 text-base text-neutral-600">
          {emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Projects"
      onPointerMove={handlePointerMove}
      className={`relative mx-auto w-full max-w-[1200px] px-6 pb-28 sm:px-10 sm:pb-36 lg:px-12 ${className}`}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden overflow-hidden rounded-xl bg-[#0c0c0e] shadow-[0_24px_70px_rgba(0,0,0,0.42)] lg:block"
        style={{
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          x: reducedMotion ? previewX : smoothX,
          y: reducedMotion ? previewY : smoothY,
        }}
        initial={false}
        animate={{
          opacity: previewVisible ? 1 : 0,
          scale: previewVisible ? 1 : 0.92,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.28,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {projects.map((project, index) =>
          project.image ? (
            <motion.img
              key={project.title}
              src={project.image}
              srcSet={project.imageSrcSet}
              sizes={`${PREVIEW_WIDTH}px`}
              alt=""
              width={PREVIEW_WIDTH}
              height={PREVIEW_HEIGHT}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              animate={{
                opacity: hoveredIndex === index ? 1 : 0,
                scale: hoveredIndex === index && !reducedMotion ? 1 : 1.06,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ) : null,
        )}
      </motion.div>

      <div className="border-b border-neutral-900/20">
        {projects.map((project, index) => {
          const active = hoveredIndex === index;

          return (
            <Link
              key={project.title}
              href={project.link}
              scroll={false}
              onPointerEnter={(event) => handlePointerEnter(event, index)}
              onPointerLeave={clearPointerPreview}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              className="group relative block border-t border-neutral-900/20 py-7 outline-none transition-[padding] duration-300 motion-reduce:duration-0 focus-visible:px-3 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900/75 sm:py-9 lg:hover:px-3"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-0 bg-black/[0.035] transition-opacity duration-300 motion-reduce:duration-0 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />

              {project.image ? (
                <img
                  src={project.image}
                  srcSet={project.imageSrcSet}
                  sizes="(min-width: 1024px) 0px, calc(100vw - 48px)"
                  alt=""
                  width={960}
                  height={600}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="relative mb-6 aspect-[16/10] w-full rounded-xl object-cover lg:hidden"
                />
              ) : null}

              <div className="relative flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-3">
                    <h2 className="text-2xl leading-tight text-neutral-900 sm:text-4xl">
                      <span className="relative inline-block">
                        {project.title}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-0 -bottom-1 h-px origin-left bg-neutral-900 transition-transform duration-300 motion-reduce:duration-0 ${
                            active ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </span>
                    </h2>
                    <ArrowUpRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className={`h-5 w-5 shrink-0 text-neutral-900/65 transition duration-300 motion-reduce:duration-0 ${
                        active
                          ? "translate-x-0 translate-y-0 opacity-100"
                          : "-translate-x-2 translate-y-2 opacity-0"
                      }`}
                    />
                  </div>
                  {project.description ? (
                    <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-neutral-600 sm:text-base">
                      {project.description}
                    </p>
                  ) : null}
                </div>

                {project.year ? (
                  <span className="shrink-0 pt-1 text-xs tabular-nums text-neutral-500 sm:text-sm">
                    {project.year}
                  </span>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default ProjectShowcase;
