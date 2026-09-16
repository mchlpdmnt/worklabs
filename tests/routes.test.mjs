import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { isRegistryPath, legacyRouteHref, parseRoute, routeHref } from "../src/lib/routes.ts";

const location = (href) => {
  const url = new URL(href, "https://worklabs.example");
  return { pathname: url.pathname, search: url.search, hash: url.hash };
};

test("clean routes preserve component views and encoded file names", () => {
  for (const kind of ["home", "components", "templates", "about"]) {
    const route = { kind };
    assert.deepEqual(parseRoute(location(routeHref(route))), route);
  }
  assert.equal(routeHref({ kind: "component", slug: "button-with-icon", tab: "preview" }), "/components/button-with-icon");
  const source = { kind: "component", slug: "curved-menu", tab: "source", file: "nested/my component.tsx" };
  assert.deepEqual(parseRoute(location(routeHref(source))), source);
  assert.deepEqual(parseRoute(location("/components/blog-card/?tab=readme")), { kind: "component", slug: "blog-card", tab: "readme", file: undefined });
  assert.equal(parseRoute(location("/components/blog-card?tab=invalid")).tab, "preview");
  assert.doesNotThrow(() => parseRoute(location("/components/%")));
});

test("legacy root bookmarks upgrade without hijacking anchors or demo URLs", () => {
  const old = location("/#/components/button-with-icon?tab=source&file=button.tsx");
  assert.equal(legacyRouteHref(old), "/components/button-with-icon?tab=source&file=button.tsx");
  assert.deepEqual(parseRoute(old), parseRoute(location(legacyRouteHref(old))));
  assert.equal(legacyRouteHref(location("/#/")), "/");
  for (const href of ["/#main-content", "/demos/curved-menu/#contacts", "/demos/#/components", "/#//evil.example", "/#/demos/blog-card/"]) {
    assert.equal(legacyRouteHref(location(href)), undefined);
  }
});

test("only app paths qualify for history navigation", () => {
  for (const href of ["/", "/components", "/components/", "/components/blog-card", "/templates/", "/about"]) assert.equal(isRegistryPath(href), true);
  for (const href of ["//", "/demos", "/demos/blog-card/", "/assets/file.js", "/components/a/b"]) assert.equal(isRegistryPath(href), false);
});

test("Netlify serves clean app routes without a demo-swallowing catch-all", () => {
  const redirects = readFileSync(new URL("../public/_redirects", import.meta.url), "utf8").split(/\r?\n/).filter((line) => line.trim() && !line.startsWith("#")).map((line) => line.trim().split(/\s+/));
  assert.ok(redirects.some(([from, to, status]) => from === "/components/*" && to === "/index.html" && status === "200"));
  assert.ok(redirects.every(([from, to, status]) => !from.startsWith("/demos") && from !== "/*" && to === "/index.html" && status === "200"));
  const config = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");
  assert.match(config, /node scripts\/ensure-playground-deps\.mjs && npm run build/);
  assert.match(config, /publish = "dist"/);
});
