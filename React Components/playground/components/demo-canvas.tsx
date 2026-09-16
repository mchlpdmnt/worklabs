import Lenis from "lenis";
import { useEffect } from "react";
import type { ReactNode } from "react";

/** A black, untransformed canvas: menus and hover previews retain viewport coordinates. */
export function DemoCanvas({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.self === window.top) {
      const lenis = new Lenis({ autoRaf: true, lerp: 0.09, syncTouch: false, anchors: false,
        autoToggle: true, allowNestedScroll: true, respectReducedMotion: true });
      return () => lenis.destroy();
    }

    const html = document.documentElement;
    html.dataset.worklabsEmbedded = "true";
    let parentOrigin = window.location.origin;
    try { if (document.referrer) parentOrigin = new URL(document.referrer).origin; } catch { /* Same-domain default. */ }
    const send = (message: Record<string, number | boolean | string>) => {
      window.parent.postMessage({ type: "worklabs:preview-scroll", ...message }, parentOrigin);
    };
    const nativeRegion = (target: EventTarget | null) => {
      if (html.style.overflow === "hidden" || document.body.style.overflow === "hidden") return true;
      if (!(target instanceof Element)) return false;
      if (target.closest("input, textarea, select, [contenteditable='true'], [data-lenis-prevent]")) return true;
      for (let element: Element | null = target; element && element !== document.body; element = element.parentElement) {
        const overflow = getComputedStyle(element).overflowY;
        if ((overflow === "auto" || overflow === "scroll") && element.scrollHeight > element.clientHeight + 1) return true;
      }
      return false;
    };
    const wheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.shiftKey || nativeRegion(event.target)) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      send({ delta: event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1) });
    };
    let touch: { x: number; y: number } | null = null;
    const start = (event: TouchEvent) => {
      const point = event.touches[0];
      touch = point && !nativeRegion(event.target) ? { x: point.clientX, y: point.clientY } : null;
    };
    const move = (event: TouchEvent) => {
      const point = event.touches[0];
      if (!touch || !point || event.defaultPrevented || nativeRegion(event.target)) return;
      const delta = touch.y - point.clientY;
      const horizontal = Math.abs(touch.x - point.clientX) > Math.abs(delta);
      touch = { x: point.clientX, y: point.clientY };
      if (horizontal) return;
      event.preventDefault();
      send({ delta, touch: true });
    };
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || nativeRegion(event.target)) return;
      // Keep button activation, card keyboard navigation, and focus traversal native.
      const deltas: Record<string, number> = { ArrowDown: 48, ArrowUp: -48, PageDown: window.innerHeight * 0.8, PageUp: -window.innerHeight * 0.8 };
      if (event.key in deltas) { event.preventDefault(); send({ delta: deltas[event.key] }); }
      else if (event.key === "Home" || event.key === "End") {
        event.preventDefault(); send({ edge: event.key === "Home" ? "start" : "end" });
      }
    };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("keydown", key);
    return () => {
      delete html.dataset.worklabsEmbedded;
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("keydown", key);
    };
  }, []);

  return <div id="worklabs-demo-content" className="demo-canvas">{children}</div>;
}
