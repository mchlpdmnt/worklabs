import { FileCode, FolderSimple, GitBranch } from "@phosphor-icons/react";
import type { RegistryComponent } from "../domain";
import { lineCount } from "../lib/format";
import { routeHref } from "../lib/routes";

interface RegistryCardProps {
  component: RegistryComponent;
}

function plainSummary(summary: string): string {
  return summary
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "");
}

export function RegistryCard({ component }: RegistryCardProps) {
  const sourceFiles = component.files.filter((file) => file.name.toLowerCase() !== "readme.md");
  const sourceLines = sourceFiles.reduce((total, file) => total + lineCount(file.content), 0);

  return (
    <a
      className="registry-card"
      href={routeHref({ kind: "component", slug: component.slug, tab: "preview" })}
    >
      <header className="registry-card__header">
        <div className="registry-card__title"><GitBranch size={16} aria-hidden /><h2>{component.name}</h2></div>
        <span className="registry-card__badge">{component.category}</span>
      </header>
      <p className="registry-card__description">{plainSummary(component.summary)}</p>
      <footer>
        <span><i aria-hidden /> TypeScript</span>
        <span><FileCode size={13} aria-hidden /> {sourceLines} lines</span>
        <span><FolderSimple size={13} aria-hidden /> {sourceFiles.length} {sourceFiles.length === 1 ? "file" : "files"}</span>
      </footer>
    </a>
  );
}
