# CurvePageTransition

A route-transition layout for the **Next.js Pages Router**: on navigation, a colored sheet with a curved edge sweeps over the outgoing page, shows the route's label, then peels away to reveal the new page. Port of the "Curve" transition from [Olivier Larose's Next.js Page Transition Guide](https://blog.olivierlarose.com/articles/nextjs-page-transition-guide).

## Dependencies

```bash
npm install motion
```

Also assumes **Next.js Pages Router** (`useRouter` from `next/router`) and Tailwind CSS (only utility classes; no theme tokens required).

## Integration

Two steps — the component wraps each page, and `_app.tsx` provides the enter/exit orchestration:

**1. `pages/_app.tsx`** — mount `AnimatePresence` around the page component and key it by route:

```tsx
import { AnimatePresence } from "motion/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <AnimatePresence mode="wait">
      <Component key={router.route} {...pageProps} />
    </AnimatePresence>
  );
}
```

**2. Each page** — wrap the content:

```tsx
import { CurvePageTransition } from "@/components/curve-page-transition/curve-page-transition";

const routes = { "/": "Home", "/about": "About" };

export default function About() {
  return (
    <CurvePageTransition routes={routes} backgroundColor="var(--background)">
      {/* page content */}
    </CurvePageTransition>
  );
}
```

## Props

- `routes` — map of pathname → label shown mid-transition. Unmapped paths fall back to the capitalized last URL segment.
- `backgroundColor` — page background behind the content.
- `curveColor` — the sweeping sheet's color (default `black`).
- `className` — extra classes for the page wrapper.

## Notes

- Page content gets a parallax slide (à la dennissnellenberg.com): it eases ~120px upward while the sheet covers it on exit, and settles upward into place from ~150px below as the sheet peels away on enter. Tune the `content` variants in the file to adjust the distances.
- Because the content wrapper animates `transform`, `position: fixed` elements inside the page are repositioned relative to it *during* the transition — keep persistent fixed UI (navbars etc.) outside the component.

- The label inherits `font-family` from its ancestors — wrap the component in your font provider's className to brand it.
- The overlay plays once on first load too (initial reveal). Pass `initial={false}` to `AnimatePresence` in `_app` to skip that.
- Pages should be at least viewport-height (the wrapper enforces `min-h-screen`); the label is centered and its size clamps between 24px and 46px with the viewport.
- The curve's depth scales with viewport width (capped at the original 300px), so phones get a gentle arc instead of a deep bowl.
