import { ArrowRight, Browsers, Package, Stack } from "@phosphor-icons/react";
import type { WorklabsSnapshot } from "../domain";
import { RegistryCard } from "../components/RegistryCard";
import { FlowButton } from "../components/FlowButton";

interface HomePageProps {
  snapshot: WorklabsSnapshot;
}

const featuredSlugs = ["card-stack", "button-with-icon", "landing-greet", "contact-card"];

export function HomePage({ snapshot }: HomePageProps) {
  const featured = featuredSlugs
    .map((slug) => snapshot.components.find((component) => component.slug === slug))
    .filter((component) => component !== undefined);
  const categories = new Set(snapshot.components.map((component) => component.category)).size;

  return (
    <main id="main-content" className="home-page">
      <section className="home-hero page-container">
        <div className="hero-brand">
          <img src="/favicon.png" alt="" width={44} height={44} />
          <span>Worklabs</span>
        </div>
        <h1>Interfaces worth<br />building with.</h1>
        <p>Worklabs is a growing collection of React components and website templates. Preview the real interaction, read the notes, and inspect every line of source.</p>
        <div className="hero-actions">
          <FlowButton href="/components" text="Browse components" shape="rectangle" className="flow-control" />
          <FlowButton href="/templates" text="Explore templates" shape="rectangle" className="flow-control flow-control--light" />
        </div>
        <dl className="registry-stats">
          <div><dt><Package size={16} aria-hidden /> Components</dt><dd>{snapshot.components.length}</dd></div>
          <div><dt><Stack size={16} aria-hidden /> Categories</dt><dd>{categories}</dd></div>
          <div><dt><Browsers size={16} aria-hidden /> Live demos</dt><dd>{snapshot.components.length}</dd></div>
        </dl>
      </section>

      <section className="featured-section page-container" aria-labelledby="featured-title">
        <header className="section-heading">
          <div>
            <p>Selected work</p>
            <h2 id="featured-title">Featured components</h2>
          </div>
          <a className="text-link" href="/components">View all {snapshot.components.length} components <ArrowRight size={15} aria-hidden /></a>
        </header>
        <div className="registry-grid home-featured-grid">
          {featured.map((component) => <RegistryCard key={component.slug} component={component} />)}
        </div>
      </section>

      <section className="library-paths page-container" aria-labelledby="library-paths-title">
        <header className="section-heading section-heading--stacked">
          <p>Browse Worklabs</p>
          <h2 id="library-paths-title">Choose what you need.</h2>
        </header>
        <div className="library-paths__grid">
          <a href="/components" className="library-path">
            <span>01</span>
            <div>
              <p>{snapshot.components.length} published</p>
              <h3>Components</h3>
              <p>Focused interface pieces you can preview, understand, and copy into a project.</p>
            </div>
            <ArrowRight size={22} aria-hidden />
          </a>
          <a href="/templates" className="library-path library-path--quiet">
            <span>02</span>
            <div>
              <p>Publishing next</p>
              <h3>Templates</h3>
              <p>Complete page systems with demos, setup notes, and browseable project source.</p>
            </div>
            <ArrowRight size={22} aria-hidden />
          </a>
        </div>
      </section>
    </main>
  );
}
