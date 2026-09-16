import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { joinUrl } from "../src/lib/format.ts";
import { fitPreview } from "../src/lib/previewFit.ts";
import { resolveDemoRequest } from "../scripts/demoRouting.ts";

test("demo links use directory URLs, preserving hashes, queries and overrides", () => {
  assert.equal(joinUrl("/demos", "/blog-card"), "/demos/blog-card/");
  assert.equal(joinUrl("/demos/", "/curved-menu/#contacts"), "/demos/curved-menu/#contacts");
  assert.equal(joinUrl("https://example.com/demos/", "curve/about?test=1#details"), "https://example.com/demos/curve/about/?test=1#details");
  assert.equal(joinUrl("/demos", "/"), "/demos/");
});

test("oversized preview viewports fit both axes without upscaling", () => {
  assert.deepEqual(fitPreview({ width: 1000, height: 1200 }, { width: 800, height: 600 }), { scale: 0.5, width: 500, height: 600 });
  assert.deepEqual(fitPreview({ width: 390, height: 800 }, { width: 320, height: 400 }), { scale: 0.5, width: 195, height: 400 });
  assert.deepEqual(fitPreview({ width: 300, height: 200 }, { width: 800, height: 600 }), { scale: 1, width: 300, height: 200 });
  assert.equal(fitPreview({ width: 0, height: 0 }, { width: 0, height: 0 }).scale, 0);
});

test("preview routing redirects real demo directories and never falls back to the registry", () => {
  const directory = mkdtempSync(join(tmpdir(), "worklabs-demo-routing-"));
  try {
    mkdirSync(join(directory, "curved-menu"));
    writeFileSync(join(directory, "index.html"), "demo hub");
    writeFileSync(join(directory, "curved-menu", "index.html"), "isolated demo");
    writeFileSync(join(directory, "asset.js"), "asset");
    assert.deepEqual(resolveDemoRequest("/demos/curved-menu?size=mobile", directory), { kind: "redirect", location: "/demos/curved-menu/?size=mobile" });
    assert.equal(resolveDemoRequest("/demos", directory).kind, "redirect");
    for (const url of ["/demos/curved-menu/", "/demos/asset.js", "/", "/components"]) {
      assert.equal(resolveDemoRequest(url, directory).kind, "pass");
    }
    for (const url of ["/demos/missing", "/demos/missing/", "/demos/%", "/demos/../outside", "/demos/%2e%2e/outside", "/demos/%5coutside"]) {
      assert.equal(resolveDemoRequest(url, directory).kind, "missing");
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
