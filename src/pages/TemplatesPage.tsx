import { ArrowRight, Browsers } from "@phosphor-icons/react";
import { BackButton } from "../components/BackButton";

export function TemplatesPage() {
  return (
    <main id="main-content" className="library-page">
      <section className="library-header page-container">
        <BackButton href="/" text="Back to home" />
        <p>Worklabs / templates</p>
        <h1>Website templates</h1>
        <div className="library-header__copy">
          <p>Complete websites and page systems will live here with the same live demo, README, and source-code experience.</p>
          <a className="text-link" href="/components">Browse components instead</a>
        </div>
      </section>

      <section className="templates-empty page-container">
        <span className="templates-empty__mark"><Browsers size={28} aria-hidden /></span>
        <p>Templates / 0 published</p>
        <h2>No templates published yet.</h2>
        <p>The layout is ready. Once the database-backed publisher is built, new templates will appear here without changing the frontend.</p>
        <a className="button button--secondary" href="/components">Explore components <ArrowRight size={16} aria-hidden /></a>
      </section>
    </main>
  );
}
