import {
  ArrowSquareOut,
  Code,
  FileCode,
  FileText,
  Play,
} from "@phosphor-icons/react";
import { useMemo } from "react";
import type { DetailTab, RegistryComponent, RegistryFile } from "../domain";
import { joinUrl } from "../lib/format";
import { buildComponentPrompt } from "../lib/componentPrompt";
import { routeHref } from "../lib/routes";
import { ComponentMark } from "../components/ComponentMark";
import { CopyButton } from "../components/CopyButton";
import { MarkdownDocument } from "../components/MarkdownDocument";
import { ComponentPreview } from "../components/ComponentPreview";
import { BackButton } from "../components/BackButton";
import { FlowButton } from "../components/FlowButton";

interface ComponentPageProps {
  component: RegistryComponent;
  demoBaseUrl: string;
  tab: DetailTab;
  requestedFile?: string;
  onCopy: (content: string, label: string) => Promise<boolean>;
}

function SourceViewer({ file, onCopy }: { file: RegistryFile; onCopy: () => Promise<boolean> }) {
  return (
    <section className="source-viewer">
      <header>
        <div><FileCode size={16} aria-hidden /><span>{file.path}</span></div>
        <CopyButton key={file.path} label="Copy file" onCopy={onCopy} />
      </header>
      <pre tabIndex={0} aria-label={`${file.name} source code`} data-lenis-prevent><code>{file.content.split(/\r?\n/).map((line, index) => (
        <span className="source-line" key={`${index}-${line.slice(0, 12)}`}><em>{index + 1}</em><span>{line || " "}</span></span>
      ))}</code></pre>
    </section>
  );
}

export function ComponentPage({ component, demoBaseUrl, tab, requestedFile, onCopy }: ComponentPageProps) {
  const demoUrl = joinUrl(demoBaseUrl, component.demoPath);
  const sourceFiles = component.files.filter((file) => file.name.toLowerCase() !== "readme.md");
  const selectedFile = useMemo(
    () => sourceFiles.find((file) => file.path === requestedFile || file.name === requestedFile) ?? sourceFiles[0],
    [sourceFiles, requestedFile],
  );

  const tabs: Array<{ id: DetailTab; label: string; icon: React.ReactNode }> = [
    { id: "preview", label: "Preview", icon: <Play size={16} aria-hidden /> },
    { id: "readme", label: "README", icon: <FileText size={16} aria-hidden /> },
    { id: "source", label: "Source", icon: <Code size={16} aria-hidden /> },
  ];

  return (
    <main id="main-content" className="component-page">
      <div className="page-container">
        <BackButton href="/components" text="Back to components" />
        <header className="component-header">
          <div className="component-header__identity">
            <span className="component-mark component-mark--large"><ComponentMark category={component.category} size={26} /></span>
            <div>
              <p>Worklabs / registry / {component.slug}</p>
              <h1>{component.name}</h1>
            </div>
          </div>
          <FlowButton
            href={demoUrl}
            text="Open demo"
            shape="rectangle"
            className="flow-control"
            hoverIcon={<ArrowSquareOut size={16} aria-hidden />}
            target="_blank"
            rel="noopener noreferrer"
          />
        </header>
        <p className="component-summary">{component.summary}</p>

        <nav className="component-tabs" aria-label="Component views">
          {tabs.map((item) => (
            <a key={item.id} className={tab === item.id ? "is-active" : ""} href={routeHref({ kind: "component", slug: component.slug, tab: item.id })}>
              {item.icon}{item.label}
              {item.id === "source" && <span>{sourceFiles.length}</span>}
            </a>
          ))}
          <CopyButton
            key={component.slug}
            className="component-prompt-copy"
            label="AI prompt"
            accessibleLabel={`Copy AI prompt for ${component.name}`}
            onCopy={() => onCopy(buildComponentPrompt(component), `${component.name} AI prompt copied.`)}
          />
        </nav>

        <div className="component-content">
            {tab === "preview" && (
              <ComponentPreview key={demoUrl} name={component.name} demoUrl={demoUrl} />
            )}

            {tab === "readme" && (
              <div className="document-shell"><MarkdownDocument content={component.readme} /></div>
            )}

            {tab === "source" && selectedFile && (
              <div className="source-layout">
                <aside className="file-tree" aria-label="Component files" data-lenis-prevent>
                  <p>Files</p>
                  {sourceFiles.map((file) => (
                    <a
                      key={file.path}
                      className={selectedFile.path === file.path ? "is-active" : ""}
                      href={routeHref({ kind: "component", slug: component.slug, tab: "source", file: file.path })}
                    >
                      <FileCode size={15} aria-hidden /> {file.name}
                    </a>
                  ))}
                </aside>
                <SourceViewer file={selectedFile} onCopy={() => onCopy(selectedFile.content, `${selectedFile.name} copied.`)} />
              </div>
            )}
        </div>
      </div>
    </main>
  );
}
