import { useCallback, useEffect, useRef, useState } from "react";
import snapshotData from "./generated/worklabs.json";
import type { WorklabsSnapshot } from "./domain";
import { useRoute } from "./lib/routes";
import { AboutPage } from "./pages/AboutPage";
import { ComponentPage } from "./pages/ComponentPage";
import { HomePage } from "./pages/HomePage";
import { RegistryPage } from "./pages/RegistryPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { SkipLink, SmoothScrollProvider } from "./components/SmoothScroll";
import { SiteNavbar } from "./components/SiteNavbar";
import { BackButton } from "./components/BackButton";

const snapshot = snapshotData as WorklabsSnapshot;
const demoBaseUrl = import.meta.env.VITE_WORKLABS_DEMO_BASE_URL ?? "/demos";

export default function App() {
  const route = useRoute();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const copy = async (content: string, message: string) => {
    try {
      await navigator.clipboard.writeText(content);
      notify(message);
      return true;
    } catch {
      notify("Couldn't copy. Allow clipboard access and try again.");
      return false;
    }
  };

  const component = route.kind === "component"
    ? snapshot.components.find((item) => item.slug === route.slug)
    : undefined;

  return (
    <SmoothScrollProvider routeKey={route.kind === "component" ? `component:${route.slug}` : route.kind}>
    <div className="site-shell">
      <SkipLink />
      {route.kind !== "home" && <SiteNavbar />}
      {route.kind === "home" && <HomePage snapshot={snapshot} />}
      {route.kind === "components" && (
        <RegistryPage
          snapshot={snapshot}
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
        />
      )}
      {route.kind === "templates" && <TemplatesPage />}
      {route.kind === "about" && <AboutPage snapshot={snapshot} />}
      {route.kind === "component" && component && (
        <ComponentPage
          component={component}
          demoBaseUrl={demoBaseUrl}
          tab={route.tab}
          requestedFile={route.file}
          onCopy={copy}
        />
      )}
      {route.kind === "component" && !component && (
        <main id="main-content" className="page-container not-found">
          <p>Component not found</p>
          <h1>That registry path does not exist.</h1>
          <BackButton href="/components" text="Back to components" />
        </main>
      )}

      <footer className="site-footer page-container">
        <span>Worklabs</span>
        <p>Portable React components with live demos, documentation, and source.</p>
        <p className="footer-signature">© 2026 · Michael Pedemonte</p>
      </footer>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
    </SmoothScrollProvider>
  );
}
