import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("registry and demos use the same uploaded PNG favicon", () => {
  const image = readFileSync(new URL("../public/favicon.png", import.meta.url));
  assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  for (const file of ["../index.html", "../React Components/playground/pages/_document.tsx"]) {
    const html = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.match(html, /<link rel="icon" type="image\/png" href="\/favicon\.png"\s*\/>/);
  }
});
