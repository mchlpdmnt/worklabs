export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function lineCount(content: string): number {
  return content ? content.split(/\r?\n/).length : 0;
}

export function joinUrl(base: string, route: string): string {
  const cleanBase = base.replace(/\/$/, "");
  const suffixIndex = route.search(/[?#]/);
  const path = suffixIndex === -1 ? route : route.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : route.slice(suffixIndex);
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  return `${cleanBase}/${cleanPath ? `${cleanPath}/` : ""}${suffix}`;
}
