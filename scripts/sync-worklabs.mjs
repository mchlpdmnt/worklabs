import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.resolve(process.env.WORKLABS_SOURCE ?? path.join(projectRoot, "React Components"));
const registryRoot = path.join(sourceRoot, "registry");
const outputPath = path.join(projectRoot, "src", "generated", "worklabs.json");
// Keep local source available without publishing it again on the next sync.
const unpublishedComponents = new Set(["social-post-card"]);

const catalog = {
  "blog-card": { category: "Content", tags: ["Card", "Responsive", "CSS motion"], demoPath: "/blog-card" },
  "button-with-icon": { category: "Actions", tags: ["Button", "Hover", "Micro-interaction"], demoPath: "/button-with-icon" },
  "card-stack": { category: "Collections", tags: ["Carousel", "Drag", "Keyboard"], demoPath: "/card-stack" },
  "contact-card": { category: "Social", tags: ["Card", "Touch", "Reveal"], demoPath: "/contact-card" },
  "curve-page-transition": { category: "Transitions", tags: ["Motion", "Routing", "Next.js"], demoPath: "/curve" },
  "curved-menu": { category: "Navigation", tags: ["Menu", "Motion", "Accessibility"], demoPath: "/curved-menu" },
  "flow-button": { category: "Actions", tags: ["Button", "Hover", "Arrows"], demoPath: "/flow-button" },
  "gradient-pointer": { category: "Mouse", tags: ["Pointer", "Gradient", "CSS variables"], demoPath: "/gradient-pointer" },
  "images-badge": { category: "Media", tags: ["Images", "Badge", "Hover"], demoPath: "/images-badge" },
  "infinite-marquee": { category: "Typography", tags: ["Marquee", "Scroll direction", "Motion"], demoPath: "/infinite-marquee" },
  "landing-greet": { category: "Transitions", tags: ["Preloader", "Motion", "Reduced motion"], demoPath: "/landing-greet" },
  "magnetic-button": { category: "Actions", tags: ["Button", "Pointer", "Spring"], demoPath: "/magnetic-button" },
  "paint-reveal": { category: "Canvas", tags: ["Canvas", "Pointer", "Reveal"], demoPath: "/paint-reveal" },
  "project-showcase": { category: "Collections", tags: ["Portfolio", "Pointer", "Responsive"], demoPath: "/project-showcase" },
  "text-scroll-reveal": { category: "Typography", tags: ["Scroll", "Text", "Opacity"], demoPath: "/text-scroll-reveal" },
};

function summaryFromReadme(readme) {
  const lines = readme.split(/\r?\n/);
  let inCode = false;
  for (const line of lines.slice(1)) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    const value = line.trim();
    if (!inCode && value && !value.startsWith("#") && !value.startsWith("-") && !value.startsWith(">")) {
      return value.replace(/\*\*/g, "").replace(/`/g, "");
    }
  }
  return "A portable component from the Worklabs registry.";
}

function dependencyList(readme) {
  const section = readme.match(/## Dependencies([\s\S]*?)(?=\n## |$)/i)?.[1] ?? "";
  const install = section.match(/npm install\s+([^\r\n`]+)/i)?.[1]?.trim();
  if (!install) return [];
  return install.split(/\s+/).filter((value) => value && !value.startsWith("-"));
}

function languageFor(fileName) {
  const extension = path.extname(fileName).slice(1).toLowerCase();
  return { tsx: "tsx", ts: "typescript", css: "css", md: "markdown", json: "json" }[extension] ?? "text";
}

const directoryEntries = await readdir(registryRoot, { withFileTypes: true });
const componentDirectories = directoryEntries
  .filter((entry) => entry.isDirectory() && !unpublishedComponents.has(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name));
const components = [];

for (const directory of componentDirectories) {
  const componentRoot = path.join(registryRoot, directory.name);
  const entries = (await readdir(componentRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && [".tsx", ".ts", ".css", ".md", ".json"].includes(path.extname(entry.name).toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = [];
  let modifiedAt = 0;

  for (const entry of entries) {
    const absolutePath = path.join(componentRoot, entry.name);
    const fileStat = await stat(absolutePath);
    modifiedAt = Math.max(modifiedAt, fileStat.mtimeMs);
    files.push({
      name: entry.name,
      path: `registry/${directory.name}/${entry.name}`,
      language: languageFor(entry.name),
      content: await readFile(absolutePath, "utf8"),
    });
  }

  const readme = files.find((file) => file.name.toLowerCase() === "readme.md")?.content ?? `# ${directory.name}`;
  const name = readme.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? directory.name;
  const metadata = catalog[directory.name] ?? { category: "Component", tags: ["React"], demoPath: `/${directory.name}` };

  components.push({
    slug: directory.name,
    name,
    summary: summaryFromReadme(readme),
    category: metadata.category,
    tags: metadata.tags,
    dependencies: dependencyList(readme),
    demoPath: metadata.demoPath,
    modifiedAt: new Date(modifiedAt).toISOString(),
    readme,
    files,
  });
}

const workspaceReadme = await readFile(path.join(sourceRoot, "README.md"), "utf8");
const snapshot = {
  version: 1,
  name: "Worklabs",
  sourceLabel: path.relative(projectRoot, sourceRoot).replaceAll(path.sep, "/") || ".",
  syncedAt: new Date().toISOString(),
  readme: workspaceReadme,
  components,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Synced ${components.length} components to ${path.relative(projectRoot, outputPath)}.`);
