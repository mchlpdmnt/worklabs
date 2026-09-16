import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("retired SocialPostCard is unpublished while its local source remains available", async () => {
  const snapshot = JSON.parse(await readFile(new URL("../src/generated/worklabs.json", import.meta.url), "utf8"));
  assert.ok(snapshot.components.length > 0);
  assert.ok(!snapshot.components.some((component) => component.slug === "social-post-card"));
  assert.ok(!snapshot.readme.includes("social-post-card"));
  await access(new URL("../React Components/registry/social-post-card/social-post-card.tsx", import.meta.url));
  await access(new URL("../React Components/playground/archive/social-post-card.tsx", import.meta.url));
  await assert.rejects(access(new URL("../React Components/playground/pages/social-post-card.tsx", import.meta.url)));
});

test("the Olivier Larose-inspired expansion publishes source and demo entries", async () => {
  const snapshot = JSON.parse(await readFile(new URL("../src/generated/worklabs.json", import.meta.url), "utf8"));
  const additions = ["gradient-pointer", "infinite-marquee", "magnetic-button", "paint-reveal", "text-scroll-reveal"];

  for (const slug of additions) {
    const component = snapshot.components.find((entry) => entry.slug === slug);
    assert.ok(component, `${slug} should be published`);
    assert.equal(component.demoPath, `/${slug}`);
    assert.match(component.readme, /blog\.olivierlarose\.com/);
    await access(new URL(`../React Components/registry/${slug}/${slug}.tsx`, import.meta.url));
    await access(new URL(`../React Components/playground/pages/${slug}.tsx`, import.meta.url));
  }
});
