# LandingGreet

An Awwwards-style intro preloader, after [Olivier Larose's landing page tutorial](https://blog.olivierlarose.com/tutorials/awwwards-landing-page): on first load a dark cover cycles through multilingual greetings ("Hello", "Bonjour", "Ciao", …), then sweeps upward off the page with a curved trailing edge that flattens as it leaves.

## Dependencies

```bash
npm install motion
```

Tailwind CSS for utility classes (no theme tokens required). Works in any React/Next.js setup — unlike `curve-page-transition`, it needs **no** `AnimatePresence` wiring in `_app`; the component manages its own lifecycle.

## Integration

Wrap the page content (recommended — the content gets the same parallax settle as `curve-page-transition`, rising into place as the sweep reveals it):

```tsx
import { LandingGreet } from "@/components/landing-greet/landing-greet";

export default function Home() {
  return (
    <LandingGreet backgroundColor="white">
      {/* page content */}
    </LandingGreet>
  );
}
```

Or drop it next to your content as a pure overlay (no parallax):

```tsx
<>
  <LandingGreet />
  {/* page content */}
</>
```

## Props

- `children` — page content; when provided, it rises ~150px into place while the sweep reveals it (same timing/easing as `curve-page-transition`'s content parallax).
- `backgroundColor` — page background behind the content (children mode).
- `words` — greetings to cycle (default: Hello, Hola, Bonjour, Hei, Dia dhuit, Привет, 안녕하세요, こんにちは, 你好, Kamusta).
- `firstWordMs` / `wordMs` — hold time for the first word (default 1000) and each following word (default 150).
- `holdMs` — pause on the last word before the sweep (default 400).
- `curveColor` — overlay color (default `black`, matching `curve-page-transition`).
- `onComplete` — callback after the sweep finishes and the overlay unmounts.
- `className` — extra classes for the wrapper (children mode) or the overlay (overlay mode).

## Notes

- Animates only transforms/opacity (plus the SVG lip morph), so the sweep stays compositor-smooth; the lip depth scales with viewport width like `curve-page-transition`.
- Page scroll is locked while the overlay is up and restored when it leaves.
- Respects `prefers-reduced-motion` by skipping the intro entirely.
- The greeting text inherits `font-family` — wrap the component (or the page) in your font provider's className.
- In children mode the content wrapper animates `transform`, so `position: fixed` elements inside are repositioned relative to it during the settle — keep persistent fixed UI outside the component.
- Plays on every mount. To show it only once per visit, gate it in the page (e.g. render it conditionally on a `sessionStorage` flag set in `onComplete`).
