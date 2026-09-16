import { FolderOpen } from "@phosphor-icons/react";
import type { WorklabsSnapshot } from "../domain";
import { MarkdownDocument } from "../components/MarkdownDocument";
import { BackButton } from "../components/BackButton";

interface AboutPageProps {
  snapshot: WorklabsSnapshot;
}

export function AboutPage({ snapshot }: AboutPageProps) {
  return (
    <main id="main-content" className="page-container document-page">
      <BackButton href="/" text="Back to home" />
      <header className="document-header">
        <span className="component-mark component-mark--large"><FolderOpen size={25} aria-hidden /></span>
        <div>
          <p>Workspace README</p>
          <h1>{snapshot.name}</h1>
          <span>Component registry documentation</span>
        </div>
      </header>
      <div className="document-shell">
        <MarkdownDocument content={snapshot.readme} />
      </div>
    </main>
  );
}
