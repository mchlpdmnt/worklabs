import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.join(projectRoot, "React Components");

export async function missingPlaygroundDependencies(root = workspaceRoot) {
  const playground = JSON.parse(await readFile(path.join(root, "playground", "package.json"), "utf8"));
  const lock = JSON.parse(await readFile(path.join(root, "package-lock.json"), "utf8"));
  const names = Object.keys({ ...playground.dependencies, ...playground.devDependencies });
  const missing = [];

  for (const name of names) {
    const expected = lock.packages[`node_modules/${name}`]?.version;
    let installed;
    try {
      const installedPackage = JSON.parse(await readFile(path.join(root, "node_modules", name, "package.json"), "utf8"));
      installed = installedPackage.version;
    } catch {
      // An interrupted npm ci can leave the package directory absent or incomplete.
    }
    if (!expected || installed !== expected) missing.push(name);
  }

  return missing;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const missing = await missingPlaygroundDependencies();
  if (missing.length === 0) {
    console.log("Playground dependencies match the lockfile; skipping npm ci.");
  } else {
    console.log(`Installing playground dependencies (${missing.join(", ")} missing or out of sync).`);
    const command = process.platform === "win32" ? "npm.cmd" : "npm";
    const result = spawnSync(command, ["--prefix", workspaceRoot, "ci"], {
      cwd: projectRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (result.error) throw result.error;
    process.exit(result.status ?? 1);
  }
}
