import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const playgroundRoot = path.join(projectRoot, "React Components", "playground");

const processes = [
  spawn(
    process.execPath,
    [path.join(projectRoot, "React Components", "node_modules", "next", "dist", "bin", "next"), "dev", "--hostname", "127.0.0.1", "--port", "3000"],
    { cwd: playgroundRoot, stdio: "inherit" },
  ),
  spawn(
    process.execPath,
    [path.join(projectRoot, "node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", "5173"],
    { cwd: projectRoot, stdio: "inherit" },
  ),
];

let shuttingDown = false;

function shutdown(exitCode) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of processes) {
    if (!child.killed) child.kill("SIGTERM");
  }
  process.exit(exitCode);
}

for (const child of processes) {
  child.on("error", (error) => {
    console.error(error);
    shutdown(1);
  });
  child.on("exit", (code, signal) => {
    if (!shuttingDown) {
      console.error(`A development server stopped (${signal ?? `exit ${code ?? 1}`}).`);
      shutdown(code ?? 1);
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
