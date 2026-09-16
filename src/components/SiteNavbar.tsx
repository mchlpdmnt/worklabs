import { GithubLogo } from "@phosphor-icons/react";
import { githubRepoUrl, worklabsGithubRepoUrl } from "../lib/githubRepo";
import { FlowButton } from "./FlowButton";

const repository = githubRepoUrl(import.meta.env.VITE_WORKLABS_GITHUB_URL ?? worklabsGithubRepoUrl);

export function SiteNavbar() {
  return <header className="site-navbar">
    <nav className="site-navbar__inner page-container" aria-label="Worklabs">
      <a className="site-navbar__brand" href="/" aria-label="Worklabs home">
        <img src="/favicon.png" width={40} height={40} alt="" />
        <span>Worklabs</span>
      </a>
      <div className="site-navbar__github" title={repository ? "Open the repository on GitHub" : "GitHub repository URL hasn't been configured yet"}>
        <FlowButton
          text="GitHub"
          shape="rectangle"
          className="flow-control"
          hoverIcon={<GithubLogo size={16} aria-hidden />}
          {...(repository ? { href: repository, target: "_blank", rel: "noopener noreferrer" } : { disabled: true })}
        />
      </div>
    </nav>
  </header>;
}
