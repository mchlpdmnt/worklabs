# CardStack

A 3D fanned card carousel with drag/swipe, keyboard navigation, click-to-flip detail backs, autoplay, and dots navigation. Built with `motion` (Framer Motion) and Tailwind CSS.

## Dependencies

Install in the target project:

```bash
npm install motion lucide-react
```

Also assumes:

- **Next.js** — uses `next/link` for the active card's external-link icon. To use outside Next.js, replace `Link` with a plain `<a>`.
- **Tailwind CSS** with **shadcn/ui theme tokens** (`bg-foreground`, `text-muted-foreground`, `bg-secondary`). If the target project doesn't use shadcn tokens, swap those classes for plain colors.

## Integration

Copy this folder into the target project (e.g. `components/card-stack/`) and import:

```tsx
import { CardStack, type CardStackItem } from "@/components/card-stack/card-stack";

const items: CardStackItem[] = [
  { id: 1, title: "Card one", description: "...", imageSrc: "/img.jpg", href: "https://..." },
];

<CardStack items={items} autoAdvance loop />
```

## Notes

- Clicking the active card flips it to a back face showing `details` (falls back to `description`) with a CTA (`ctaLabel`, default "Take me there") linking to `href`. Override the back with `renderCardBack`.
- `renderCard` prop lets you fully replace the default card body.
- Responsive: `cardWidth`/`cardHeight` are the ideal size; the component measures its container and scales the whole fan down to fit narrower screens. The stage breaks out to full viewport width, so side cards spill past the content column and fade out at the actual screen edges. Default faces adapt padding/type via Tailwind container queries.
- Respects `prefers-reduced-motion` (disables autoplay and entry animations).
- Keyboard: focus the stage, then ArrowLeft / ArrowRight to navigate, Enter to flip, Escape to unflip.
