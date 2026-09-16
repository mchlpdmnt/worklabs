import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";

interface ScrollControls {
  scrollBy: (delta: number, immediate?: boolean) => void;
  scrollTo: (target: number | HTMLElement, immediate?: boolean) => void;
}

const ScrollContext = createContext<ScrollControls | null>(null);

export function SmoothScrollProvider({ children, routeKey }: { children: ReactNode; routeKey: string }) {
  const instance = useRef<Lenis | null>(null);

  useEffect(() => {
    const restoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      autoToggle: true,
      respectReducedMotion: true,
    });
    instance.current = lenis;
    return () => {
      instance.current = null;
      lenis.destroy();
      window.history.scrollRestoration = restoration;
    };
  }, []);

  const scrollTo = useCallback((target: number | HTMLElement, immediate = false) => {
    if (instance.current) instance.current.scrollTo(target, { immediate });
    else window.scrollTo({ top: typeof target === "number" ? target : target.offsetTop, behavior: "instant" });
  }, []);

  const scrollBy = useCallback((delta: number, immediate = false) => {
    scrollTo((instance.current?.targetScroll ?? window.scrollY) + delta, immediate);
  }, [scrollTo]);

  useLayoutEffect(() => {
    scrollTo(0, true);
    const frame = requestAnimationFrame(() => {
      instance.current?.resize();
      scrollTo(0, true);
    });
    return () => cancelAnimationFrame(frame);
  }, [routeKey, scrollTo]);

  const controls = useMemo(() => ({ scrollBy, scrollTo }), [scrollBy, scrollTo]);
  return <ScrollContext.Provider value={controls}>{children}</ScrollContext.Provider>;
}

export function useSmoothScroll() {
  const controls = useContext(ScrollContext);
  if (!controls) throw new Error("Smooth scrolling requires SmoothScrollProvider");
  return controls;
}

export function SkipLink() {
  const { scrollTo } = useSmoothScroll();
  return <a className="skip-link" href="#main-content" onClick={(event) => {
    event.preventDefault();
    const main = document.getElementById("main-content");
    if (!main) return;
    main.tabIndex = -1;
    main.focus({ preventScroll: true });
    scrollTo(main);
  }}>Skip to content</a>;
}
