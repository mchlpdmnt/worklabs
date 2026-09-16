"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";

export type CurvedMenuItem = {
  title: string;
  href: string;
  target?: string;
};

export type CurvedMenuProps = {
  items?: CurvedMenuItem[];
  homepagePath?: string;
  revealAfterTarget?: string | null;
  navigationLabel?: string;
};

export const defaultCurvedMenuItems: CurvedMenuItem[] = [
  { title: "Home", href: "/", target: "home" },
  { title: "Work", href: "/works" },
  { title: "About", href: "/#about", target: "about" },
  { title: "Contact", href: "/contact" },
];

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const MENU_COLOR = "#0c0c0e";
const MAGNET_SPRING = { stiffness: 260, damping: 20, mass: 0.35 };

const menuSlide: Variants = {
  initial: { x: "calc(100% + 120px)" },
  enter: {
    x: 0,
    transition: { duration: 0.8, ease: EASE },
  },
  exit: {
    x: "calc(100% + 120px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const backdrop: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.35, delay: 0.15 } },
};

function createLinkSlide(itemCount: number): Variants {
  return {
    initial: { x: 72, opacity: 0 },
    enter: (index: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.65,
        delay: 0.2 + index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    exit: (index: number) => ({
      x: 36,
      opacity: 0,
      transition: {
        duration: 0.3,
        delay: (itemCount - index - 1) * 0.025,
        ease: EASE,
      },
    }),
  };
}

const curve: Variants = {
  initial: { d: "M100 0 L100 100 Q-100 50 100 0" },
  enter: {
    d: "M100 0 L100 100 Q100 50 100 0",
    transition: { duration: 0.9, ease: EASE },
  },
  exit: {
    d: "M100 0 L100 100 Q-100 50 100 0",
    transition: { duration: 0.7, ease: EASE },
  },
};

function hrefPath(href: string) {
  return href.split("#")[0]?.split("?")[0] || "/";
}

function currentNavHref(
  pathname: string,
  asPath: string,
  items: CurvedMenuItem[],
  homepagePath: string,
) {
  if (pathname === homepagePath) {
    const hash = asPath.split("#")[1]?.split("?")[0];
    if (hash) {
      return items.find((item) => item.target === hash)?.href ?? homepagePath;
    }
    return (
      items.find(
        (item) => hrefPath(item.href) === homepagePath && item.target === "home",
      )?.href ?? homepagePath
    );
  }

  const candidates = items
    .filter((item) => hrefPath(item.href) !== homepagePath)
    .sort((a, b) => hrefPath(b.href).length - hrefPath(a.href).length);

  return (
    candidates.find((item) => {
      const path = hrefPath(item.href);
      return pathname === path || pathname.startsWith(`${path}/`);
    })?.href ?? null
  );
}

function targetTop(target: string) {
  if (target === "home") return 0;
  return document.getElementById(target)?.offsetTop ?? null;
}

function scrollToTarget(target: string, behavior: ScrollBehavior) {
  const top = targetTop(target);
  if (top === null) return false;
  window.scrollTo({ top, behavior });
  return true;
}

function CurvedEdge({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-full top-0 h-full w-[clamp(84px,12vw,120px)] overflow-visible"
      style={{ color: MENU_COLOR }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <motion.path
        fill="currentColor"
        variants={reduceMotion ? undefined : curve}
        initial={reduceMotion ? false : "initial"}
        animate={reduceMotion ? undefined : "enter"}
        exit={reduceMotion ? undefined : "exit"}
        d={reduceMotion ? "M100 0 L100 100 Q35 50 100 0" : undefined}
      />
    </svg>
  );
}

export function CurvedMenu({
  items = defaultCurvedMenuItems,
  homepagePath = "/",
  revealAfterTarget = "works",
  navigationLabel = "Navigation",
}: CurvedMenuProps) {
  const router = useRouter();
  const reduceMotion = Boolean(useReducedMotion());
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasReachedTrigger, setHasReachedTrigger] = React.useState(false);
  const [activeHref, setActiveHref] = React.useState<string | null>(() =>
    currentNavHref(router.pathname, router.asPath, items, homepagePath),
  );
  const [selectedHref, setSelectedHref] = React.useState<string | null>(
    activeHref,
  );
  const toggleRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLElement | null>(null);
  const wasOpenRef = React.useRef(false);
  const pendingTargetRef = React.useRef<string | null>(null);
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springX = useSpring(magneticX, MAGNET_SPRING);
  const springY = useSpring(magneticY, MAGNET_SPRING);
  const linkSlide = React.useMemo(() => createLinkSlide(items.length), [items.length]);

  const resetTogglePosition = React.useCallback(() => {
    magneticX.set(0);
    magneticY.set(0);
  }, [magneticX, magneticY]);

  const handleTogglePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (reduceMotion || event.pointerType !== "mouse") return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - (bounds.left + bounds.width / 2);
      const offsetY = event.clientY - (bounds.top + bounds.height / 2);

      magneticX.set(offsetX * 0.28);
      magneticY.set(offsetY * 0.28);
    },
    [magneticX, magneticY, reduceMotion],
  );

  React.useEffect(() => {
    if (!router.isReady) return;
    const next = currentNavHref(
      router.pathname,
      router.asPath,
      items,
      homepagePath,
    );
    setActiveHref(next);
    setSelectedHref(next);
  }, [homepagePath, items, router.asPath, router.isReady, router.pathname]);

  React.useEffect(() => {
    if (router.pathname !== homepagePath || revealAfterTarget === null) {
      setHasReachedTrigger(true);
      return;
    }

    setHasReachedTrigger(false);
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let attempts = 0;

    const attach = () => {
      const trigger = document.getElementById(revealAfterTarget);
      if (!trigger) {
        if (attempts < 180) {
          attempts += 1;
          frame = window.requestAnimationFrame(attach);
        }
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          setHasReachedTrigger(
            entry.isIntersecting || entry.boundingClientRect.top < 0,
          );
        },
        { threshold: 0.01 },
      );
      observer.observe(trigger);
    };

    frame = window.requestAnimationFrame(attach);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [homepagePath, revealAfterTarget, router.pathname]);

  React.useEffect(() => {
    const close = () => setIsOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  React.useEffect(() => {
    if (router.pathname !== homepagePath || !pendingTargetRef.current) return;

    let frame = 0;
    let attempts = 0;
    const land = () => {
      const target = pendingTargetRef.current;
      if (target && scrollToTarget(target, "auto")) {
        pendingTargetRef.current = null;
        return;
      }

      if (attempts < 180) {
        attempts += 1;
        frame = window.requestAnimationFrame(land);
      }
    };

    frame = window.requestAnimationFrame(land);
    return () => window.cancelAnimationFrame(frame);
  }, [homepagePath, router.asPath, router.pathname]);

  React.useEffect(() => {
    if (!isOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const focusables = (): HTMLElement[] =>
      [
        toggleRef.current,
        ...Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? [],
        ),
      ].filter((node): node is HTMLElement => Boolean(node));

    const focusFrame = window.requestAnimationFrame(() => {
      const currentLink = panelRef.current?.querySelector<HTMLElement>(
        'a[aria-current="page"]',
      );
      const firstLink = panelRef.current?.querySelector<HTMLElement>("a[href]");
      (currentLink ?? firstLink)?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusableItems = focusables();
      if (!focusableItems.length) return;

      const first = focusableItems[0];
      const last = focusableItems[focusableItems.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen && wasOpenRef.current) toggleRef.current?.focus();
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: CurvedMenuItem,
  ) => {
    setActiveHref(item.href);
    setSelectedHref(item.href);

    if (router.pathname === homepagePath && item.target) {
      event.preventDefault();
      setIsOpen(false);
      const targetUrl = new URL(window.location.href);
      targetUrl.hash = item.target === "home" ? "" : item.target;
      window.history.replaceState(
        window.history.state,
        "",
        targetUrl,
      );

      window.setTimeout(
        () => scrollToTarget(item.target!, reduceMotion ? "auto" : "smooth"),
        reduceMotion ? 0 : 360,
      );
      return;
    }

    pendingTargetRef.current = item.target ?? null;
    setIsOpen(false);
  };

  const motionState = reduceMotion
    ? { initial: false as const }
    : { initial: "initial", animate: "enter", exit: "exit" };
  const showToggle =
    router.pathname !== homepagePath ||
    revealAfterTarget === null ||
    hasReachedTrigger ||
    isOpen;

  return (
    <>
      <div
        className={`fixed right-5 top-5 z-[82] h-14 w-14 transition duration-300 motion-reduce:duration-0 sm:right-7 sm:top-7 sm:h-16 sm:w-16 ${
          showToggle
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-3 scale-90 opacity-0"
        }`}
      >
        <motion.button
          ref={toggleRef}
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="site-navigation"
          aria-hidden={!showToggle}
          tabIndex={showToggle ? 0 : -1}
          onPointerMove={handleTogglePointerMove}
          onPointerLeave={resetTogglePosition}
          onPointerCancel={resetTogglePosition}
          onBlur={resetTogglePosition}
          onClick={() => setIsOpen((open) => !open)}
          style={reduceMotion ? undefined : { x: springX, y: springY }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className="group relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-[#0c0c0e] text-[#fffafa] shadow-lg shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0e]"
        >
          <span className="sr-only">
            {isOpen ? "Close navigation" : "Open navigation"}
          </span>
          <span
            aria-hidden="true"
            className={`absolute -left-1/4 -top-1/2 h-[200%] w-[150%] rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0 ${
              isOpen
                ? "translate-y-0"
                : "-translate-y-[78%] group-hover:translate-y-0 group-focus-visible:translate-y-0"
            }`}
          />
          <span aria-hidden="true" className="relative z-10 block h-4 w-6">
            <span
              className={`absolute left-0 top-[5px] h-px w-6 transition duration-300 motion-reduce:duration-0 ${
                isOpen
                  ? "translate-y-[3px] rotate-45 bg-[#0c0c0e]"
                  : "bg-current group-hover:bg-[#0c0c0e] group-focus-visible:bg-[#0c0c0e]"
              }`}
            />
            <span
              className={`absolute left-0 top-[11px] h-px w-6 transition duration-300 motion-reduce:duration-0 ${
                isOpen
                  ? "-translate-y-[3px] -rotate-45 bg-[#0c0c0e]"
                  : "bg-current group-hover:bg-[#0c0c0e] group-focus-visible:bg-[#0c0c0e]"
              }`}
            />
          </span>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isOpen ? (
          <>
            <motion.div
              aria-hidden="true"
              className="fixed inset-0 z-[80] bg-black/25 backdrop-blur-[2px]"
              onPointerDown={() => setIsOpen(false)}
              variants={reduceMotion ? undefined : backdrop}
              {...motionState}
            />

            <motion.aside
              ref={panelRef}
              id="site-navigation"
              aria-label="Site navigation"
              className="fixed inset-y-0 right-0 z-[81] h-[100dvh] w-[min(460px,calc(100vw-44px))] bg-[#0c0c0e] text-[#fffafa] shadow-2xl shadow-black/25"
              variants={reduceMotion ? undefined : menuSlide}
              {...motionState}
            >
              <CurvedEdge reduceMotion={reduceMotion} />

              <div className="flex h-full flex-col overflow-x-hidden overflow-y-auto px-8 pb-8 pt-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-12 sm:pb-10 sm:pt-32">
                <nav
                  className="flex flex-1 flex-col justify-center"
                  onMouseLeave={() => setSelectedHref(activeHref)}
                >
                  <p className="border-b border-white/20 pb-4 text-xs uppercase tracking-[0.16em] text-white/55">
                    {navigationLabel}
                  </p>
                  <ul className="mt-7 space-y-1">
                    {items.map((item, index) => {
                      const selected = selectedHref === item.href;
                      return (
                        <motion.li
                          key={item.href}
                          custom={index}
                          variants={reduceMotion ? undefined : linkSlide}
                          {...motionState}
                        >
                          <Link
                            href={item.href}
                            scroll={false}
                            onClick={(event) => handleNavigation(event, item)}
                            onMouseEnter={() => setSelectedHref(item.href)}
                            onFocus={() => setSelectedHref(item.href)}
                            aria-current={
                              activeHref === item.href ? "page" : undefined
                            }
                            className="group flex items-center gap-4 py-2 text-[length:clamp(2.4rem,8vw,4.4rem)] leading-[1.05] text-white/90 outline-none transition-colors hover:text-white focus-visible:text-white"
                          >
                            <motion.span
                              aria-hidden="true"
                              className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#fffafa]"
                              animate={{
                                opacity: selected ? 1 : 0,
                                scale: selected ? 1 : 0,
                              }}
                              transition={{ duration: reduceMotion ? 0 : 0.25 }}
                            />
                            <span>{item.title}</span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default CurvedMenu;
