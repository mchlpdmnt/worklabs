import { MagnifyingGlass } from "@phosphor-icons/react";
import type { RegistryComponent, WorklabsSnapshot } from "../domain";
import { RegistryCard } from "../components/RegistryCard";
import { formatDate } from "../lib/format";
import { BackButton } from "../components/BackButton";

interface RegistryPageProps {
  snapshot: WorklabsSnapshot;
  query: string;
  onQueryChange: (query: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

function matches(component: RegistryComponent, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return true;
  return [
    component.name,
    component.slug,
    component.summary,
    component.category,
    ...component.tags,
    ...component.dependencies,
  ].join(" ").toLocaleLowerCase().includes(normalized);
}

export function RegistryPage({ snapshot, query, onQueryChange, category, onCategoryChange }: RegistryPageProps) {
  const categories = [...new Set(snapshot.components.map((component) => component.category))].sort();
  const visible = snapshot.components.filter((component) => matches(component, query) && (category === "All" || component.category === category));
  return (
    <main id="main-content" className="library-page">
      <section className="library-header page-container">
        <BackButton href="/" text="Back to home" />
        <p>Worklabs / components</p>
        <h1>Component library</h1>
        <div className="library-header__copy">
          <p>Browse every reusable interface in Worklabs. Each entry includes a live preview, integration README, and complete source.</p>
          <a className="text-link" href="/templates">Explore templates instead</a>
        </div>
      </section>

      <section className="registry-browser page-container" aria-labelledby="registry-title">
        <div className="registry-heading">
          <div>
            <h2 id="registry-title">All components</h2>
            <p>A growing collection of portable interfaces from the Worklabs registry. Last updated {formatDate(snapshot.syncedAt)}.</p>
          </div>
          <div className="registry-tools">
            <label className="registry-search">
              <MagnifyingGlass size={16} aria-hidden />
              <span className="sr-only">Search components</span>
              <input
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search components"
              />
            </label>
            <span>{visible.length} of {snapshot.components.length}</span>
          </div>
        </div>

        <div className="category-filter" aria-label="Filter by category">
          {["All", ...categories].map((item) => (
            <button key={item} type="button" className={category === item ? "is-active" : ""} onClick={() => onCategoryChange(item)}>
              {item}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="registry-grid">
            {visible.map((component) => <RegistryCard key={component.slug} component={component} />)}
          </div>
        ) : (
          <div className="registry-empty">
            <h2>No components found</h2>
            <p>Try a different component name, dependency, or category.</p>
            <button type="button" onClick={() => onCategoryChange("All")}>Show all components</button>
          </div>
        )}
      </section>
    </main>
  );
}
