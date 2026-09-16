export interface ViewportSize { width: number; height: number }

/** Fit the iframe itself, leaving fixed-position demo content viewport-relative. */
export function fitPreview(content: ViewportSize, available: ViewportSize) {
  const width = Math.max(1, content.width);
  const height = Math.max(1, content.height);
  const scale = Math.max(0, Math.min(1, available.width / width, available.height / height));
  return { scale, width: width * scale, height: height * scale };
}
