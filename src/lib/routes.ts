import { useEffect, useState } from "react";
import type { AppRoute, DetailTab } from "../domain";

const validTabs = new Set<DetailTab>(["preview", "readme", "source"]);

type RouteLocation = Pick<Location, "pathname" | "search" | "hash">;

export function isRegistryPath(pathname: string): boolean {
  return pathname === "/" || /^\/(?:components(?:\/[^/?#]+)?|templates|about)\/?$/.test(pathname);
}

/** Upgrade existing bookmarks without treating demo/section anchors as app routes. */
export function legacyRouteHref(location: RouteLocation): string | undefined {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;
  if (!location.hash.startsWith("#/")) return;
  const href = location.hash.slice(1);
  const pathname = href.split("?")[0];
  if (isRegistryPath(pathname)) return href;
}

export function parseRoute(location: RouteLocation = window.location): AppRoute {
  const href = legacyRouteHref(location) ?? `${location.pathname}${location.search}`;
  const [path, query = ""] = href.split("?");
  const pathname = path.replace(/\/$/, "") || "/";
  if (pathname === "/") return { kind: "home" };
  if (pathname === "/components") return { kind: "components" };
  if (pathname === "/templates") return { kind: "templates" };
  if (pathname === "/about") return { kind: "about" };
  const match = pathname.match(/^\/components\/([^/]+)$/);
  if (match) {
    const params = new URLSearchParams(query);
    const requestedTab = params.get("tab") as DetailTab | null;
    let slug: string;
    try { slug = decodeURIComponent(match[1]); } catch { return { kind: "home" }; }
    return {
      kind: "component",
      slug,
      tab: requestedTab && validTabs.has(requestedTab) ? requestedTab : "preview",
      file: params.get("file") ?? undefined,
    };
  }
  return { kind: "home" };
}

export function routeHref(route: AppRoute): string {
  if (route.kind === "home") return "/";
  if (route.kind === "components") return "/components";
  if (route.kind === "templates") return "/templates";
  if (route.kind === "about") return "/about";
  if (route.kind === "component") {
    const params = new URLSearchParams();
    if (route.tab !== "preview") params.set("tab", route.tab);
    if (route.file) params.set("file", route.file);
    const query = params.toString();
    return `/components/${encodeURIComponent(route.slug)}${query ? `?${query}` : ""}`;
  }
  return "/";
}

export function useRoute(): AppRoute {
  const [route, setRoute] = useState<AppRoute>(parseRoute);
  useEffect(() => {
    const update = () => {
      const legacyHref = legacyRouteHref(window.location);
      if (legacyHref) window.history.replaceState(window.history.state, "", legacyHref);
      setRoute(parseRoute());
    };
    const handleLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href);
      // Native links, external destinations, and all /demos routes remain untouched.
      if (url.origin !== window.location.origin || url.hash || !isRegistryPath(url.pathname)) return;
      event.preventDefault();
      const href = `${url.pathname}${url.search}`;
      if (href === `${window.location.pathname}${window.location.search}`) return;
      window.history.pushState(null, "", href);
      update();
    };
    update();
    document.addEventListener("click", handleLink);
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    return () => {
      document.removeEventListener("click", handleLink);
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);
  return route;
}
