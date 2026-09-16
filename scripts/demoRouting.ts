import { statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

export function resolveDemoRequest(requestUrl: string, demoDirectory: string) {
  const queryAt = requestUrl.indexOf("?");
  const rawPath = queryAt === -1 ? requestUrl : requestUrl.slice(0, queryAt);
  const query = queryAt === -1 ? "" : requestUrl.slice(queryAt);
  if (rawPath !== "/demos" && !rawPath.startsWith("/demos/")) return { kind: "pass" } as const;
  let path: string;
  try { path = decodeURIComponent(rawPath); } catch { return { kind: "missing" } as const; }
  if (path.includes("\\") || path.includes("\0")) return { kind: "missing" } as const;
  const directory = resolve(demoDirectory);
  const target = resolve(directory, `.${path.slice("/demos".length) || "/"}`);
  const inside = relative(directory, target);
  if (inside === ".." || inside.startsWith(`..${sep}`) || isAbsolute(inside)) return { kind: "missing" } as const;
  try {
    const stat = statSync(target);
    if (stat.isDirectory()) {
      if (!statSync(resolve(target, "index.html")).isFile()) return { kind: "missing" } as const;
      if (!rawPath.endsWith("/")) return { kind: "redirect", location: `${rawPath}/${query}` } as const;
    } else if (!stat.isFile()) return { kind: "missing" } as const;
    return { kind: "pass" } as const;
  } catch { return { kind: "missing" } as const; }
}

/** Protect exported demos from the registry's SPA fallback in local production preview. */
export function demoRouting(): Plugin {
  return {
    name: "worklabs-demo-routing",
    configurePreviewServer(server) {
      const directory = resolve(server.config.root, server.config.build.outDir, "demos");
      server.middlewares.use((request: IncomingMessage, response: ServerResponse, next: () => void) => {
        const result = resolveDemoRequest(request.url ?? "/", directory);
        if (result.kind === "pass") { next(); return; }
        if (result.kind === "redirect") {
          response.writeHead(308, { Location: result.location });
          response.end();
        } else {
          response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("This Worklabs demo does not exist.");
        }
      });
    },
  };
}
