import { Desktop, DeviceMobile, Monitor } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { fitPreview } from "../lib/previewFit";
import type { ViewportSize } from "../lib/previewFit";
import { useSmoothScroll } from "./SmoothScroll";

type PreviewSize = "desktop" | "tablet" | "mobile";
const presets = [
  { id: "desktop", label: "Desktop preview", Icon: Desktop },
  { id: "tablet", label: "Tablet preview", Icon: Monitor },
  { id: "mobile", label: "Mobile preview", Icon: DeviceMobile },
] as const;

export function ComponentPreview({ name, demoUrl }: { name: string; demoUrl: string }) {
  const [size, setSize] = useState<PreviewSize>("desktop");
  const [available, setAvailable] = useState<ViewportSize>({ width: 1, height: 1 });
  const [content, setContent] = useState<ViewportSize>({ width: 1, height: 1 });
  const [loaded, setLoaded] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const contentObserver = useRef<ResizeObserver | null>(null);
  const pendingFrame = useRef(0);
  const { scrollBy, scrollTo } = useSmoothScroll();
  const fit = fitPreview(content, available);

  const measure = useCallback(() => {
    cancelAnimationFrame(pendingFrame.current);
    pendingFrame.current = requestAnimationFrame(() => {
      try {
        const doc = iframe.current?.contentDocument;
        const canvas = doc?.getElementById("worklabs-demo-content");
        if (!doc || !canvas) return;
        // Layout dimensions ignore intentional masked carousel paint and fixed overlays.
        const width = Math.ceil(canvas.scrollWidth);
        const height = Math.ceil(canvas.scrollHeight);
        setContent((previous) => width > previous.width + 1 || height > previous.height + 1
          ? { width: Math.max(previous.width, width), height: Math.max(previous.height, height) }
          : previous);
      } catch { /* A cross-origin override cannot expose layout dimensions. */ }
    });
  }, []);

  useEffect(() => {
    if (!stage.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.max(1, Math.floor(entry.contentRect.width));
      const height = Math.max(1, Math.floor(entry.contentRect.height));
      setAvailable({ width, height });
      setContent({ width: size === "mobile" ? Math.min(width, 390) : size === "tablet" ? Math.min(width, 768) : width, height });
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [size]);

  useEffect(() => { if (loaded) measure(); }, [available, size, loaded, measure]);
  useEffect(() => () => {
    contentObserver.current?.disconnect();
    cancelAnimationFrame(pendingFrame.current);
  }, []);

  useEffect(() => {
    const origin = new URL(demoUrl, window.location.href).origin;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.current?.contentWindow || event.origin !== origin) return;
      const message = event.data;
      if (!message || message.type !== "worklabs:preview-scroll") return;
      if (message.edge === "start") scrollTo(0);
      else if (message.edge === "end") scrollTo(document.documentElement.scrollHeight);
      else if (typeof message.delta === "number" && Number.isFinite(message.delta)) {
        const delta = Math.max(-2000, Math.min(2000, message.delta));
        scrollBy(message.touch ? delta * fit.scale : delta, Boolean(message.touch));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [demoUrl, fit.scale, scrollBy, scrollTo]);

  const onLoad = () => {
    setLoaded(true);
    contentObserver.current?.disconnect();
    try {
      const canvas = iframe.current?.contentDocument?.getElementById("worklabs-demo-content");
      if (canvas) {
        const observer = new ResizeObserver(measure);
        observer.observe(canvas);
        // Font/image loading can change descendants without changing the viewport.
        canvas.querySelectorAll("main, img").forEach((element) => observer.observe(element));
        contentObserver.current = observer;
      }
    } catch { /* Keep the responsive viewport for cross-origin demos. */ }
    measure();
  };

  return <section className="preview-section">
    <div className="preview-toolbar">
      <div className="preview-address"><span>Demo</span><code>{demoUrl}</code></div>
      <div className="preview-sizes" aria-label="Preview size">
        {presets.map(({ id, label, Icon }) => <button key={id} className={size === id ? "is-active" : ""}
          onClick={() => setSize(id)} aria-label={label} aria-pressed={size === id}><Icon size={17} aria-hidden /></button>)}
      </div>
    </div>
    <div ref={stage} className={`preview-stage preview-stage--${size}`} aria-busy={!loaded}>
      {!loaded && <div className="preview-skeleton"><span /><span /><span /></div>}
      <div className="preview-frame" data-preview-scale={fit.scale.toFixed(4)}
        style={{ width: fit.width, height: fit.height, visibility: loaded ? "visible" : "hidden" }}>
        <iframe ref={iframe} title={`${name} interactive demo`} src={demoUrl} loading="eager" onLoad={onLoad}
          style={{ width: content.width, height: content.height, transform: `scale(${fit.scale})` }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
      </div>
    </div>
    <p className="preview-note">This interactive preview is served from the bundled Worklabs playground.</p>
  </section>;
}
