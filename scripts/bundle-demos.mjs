import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(projectRoot, "React Components", "playground", "out");
const distRoot = path.join(projectRoot, "dist");
const target = path.join(distRoot, "demos");

if (path.dirname(target) !== distRoot) {
  throw new Error(`Refusing to replace an unexpected demo target: ${target}`);
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

console.log(`Bundled playground export into ${path.relative(projectRoot, target)}.`);
