import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { missingPlaygroundDependencies } from "../scripts/ensure-playground-deps.mjs";

test("Netlify dependency check skips matching installs and flags missing or stale packages", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "worklabs-deploy-deps-"));
  try {
    await mkdir(path.join(root, "playground"));
    await mkdir(path.join(root, "node_modules", "next"), { recursive: true });
    await mkdir(path.join(root, "node_modules", "motion"), { recursive: true });
    await writeFile(path.join(root, "playground", "package.json"), JSON.stringify({
      dependencies: { next: "1.0.0", motion: "2.0.0" },
    }));
    await writeFile(path.join(root, "package-lock.json"), JSON.stringify({
      packages: { "node_modules/next": { version: "1.0.0" }, "node_modules/motion": { version: "2.0.0" } },
    }));
    await writeFile(path.join(root, "node_modules", "next", "package.json"), JSON.stringify({ version: "1.0.0" }));
    await writeFile(path.join(root, "node_modules", "motion", "package.json"), JSON.stringify({ version: "2.0.0" }));

    assert.deepEqual(await missingPlaygroundDependencies(root), []);
    await writeFile(path.join(root, "node_modules", "motion", "package.json"), JSON.stringify({ version: "1.0.0" }));
    assert.deepEqual(await missingPlaygroundDependencies(root), ["motion"]);
    await rm(path.join(root, "node_modules", "motion", "package.json"));
    assert.deepEqual(await missingPlaygroundDependencies(root), ["motion"]);

    const config = await readFile(new URL("../netlify.toml", import.meta.url), "utf8");
    assert.match(config, /node scripts\/ensure-playground-deps\.mjs && npm run build/);
  } finally {
    if (path.dirname(path.resolve(root)) !== path.resolve(tmpdir())) throw new Error("Unexpected test temp directory");
    await rm(root, { recursive: true, force: true });
  }
});

test("production demo type checks exclude Next's generated dev-only types", async () => {
  const config = JSON.parse(await readFile(new URL("../React Components/playground/tsconfig.json", import.meta.url), "utf8"));
  assert.ok(config.include.includes(".next/types/**/*.ts"));
  assert.ok(config.exclude.includes(".next/dev/types"));
});
