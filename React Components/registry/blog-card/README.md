# BlogCard

A poster-style blog card: full-bleed cover image with a gradient overlay, the details slide up on hover to reveal the reading time and a **Read** button, and the image zooms slightly. Adapted from a travel-card layout for blog content (reading time, publish date, excerpt — no price).

## Dependencies

```bash
npm install lucide-react
```

Assumes Tailwind CSS with **shadcn/ui theme tokens** (`bg-card`, `border-border`, `text-card-foreground`). Swap those classes for plain colors if the target project doesn't use shadcn tokens.

## Integration

```tsx
import { BlogCard } from "@/components/blog-card/blog-card";

<BlogCard
  imageUrl="/cover.jpg"
  imageAlt="Aurora over the fjords"
  title="Chasing the Northern Lights"
  readingTime="6 min read"
  datePublished="Jul 18, 2026"
  excerpt="A field guide to catching the aurora over the Lofoten islands."
  onRead={() => router.push("/blog/northern-lights")}
/>
```

## Props

- `imageUrl` / `imageAlt` — cover image.
- `logo` — optional node shown top-left (author avatar or publication mark).
- `title` — post title.
- `readingTime` — e.g. `"6 min read"` (shown bottom-left on hover, with a clock icon).
- `datePublished` — e.g. `"Jul 18, 2026"` (shown under the title).
- `excerpt` — short description, under the "ABOUT" label.
- `ctaLabel` — button text (default `"Read"`).
- `onRead` — click handler for the button.
- Forwards a `ref` and spreads any extra `div` props.

## Notes

- **Hover on desktop, tap on mobile.** Tailwind gates `group-hover:` behind `@media (hover: hover)`, so the reveal never fires on touch devices. The component detects that with `matchMedia("(hover: hover) and (pointer: fine)")` and, on touch, toggles the same styles via a `data-expanded` attribute when the card is tapped. Tapping **Read** doesn't collapse the card (the click stops propagating).
- Responsive: `26rem` tall on mobile, `30rem` from `sm:` up, with padding, title size, and avatar scaled to match. The excerpt is clamped to 3 lines so cards stay uniform.
- Animation is CSS-only (no JS animation library). Everything animates `transform`/`opacity` — never layout properties — so the reveal stays compositor-smooth.
- Override the height with `className` (e.g. `className="h-[34rem]"`).
