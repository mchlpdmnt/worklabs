export const worklabsGithubRepoUrl = "https://github.com/mchlpdmnt/worklabs";

/** Only repository URLs are valid destinations; missing configuration stays disabled. */
export function githubRepoUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port || url.username || url.password) return undefined;
    const match = url.pathname.match(/^\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/);
    if (!match || match.slice(1).some((part) => part === "." || part === "..")) return undefined;
    return `https://github.com/${match[1]}/${match[2]}`;
  } catch { return undefined; }
}
