# ContactCard

A monochrome gradient card. At rest the title sits centre-left; on hover it travels to the top-right while nested frosted panels cascade in from the bottom-left corner, staggered. Each panel fades to its **own brand gradient** when hovered individually — Facebook, Instagram, LinkedIn, GitHub by default.

## Dependencies

None beyond React and Tailwind CSS. Icons are inline SVG (no icon package), so this folder is fully self-contained.

## Integration

```tsx
import { ContactCard } from "@/components/contact-card/contact-card";

<ContactCard />
```

With your own links:

```tsx
import { ContactCard, defaultContactLinks } from "@/components/contact-card/contact-card";

<ContactCard
  title="Reach me"
  subtitle="Anywhere, anytime"
  links={defaultContactLinks.map((l) => ({ ...l, href: "https://…" }))}
/>
```

## Props

- `title` — heading (default `"Contact me"`).
- `subtitle` — smaller line under it (default `"Let's work together"`); pass `""` to hide.
- `links` — array of `ContactLink`; defaults to Facebook / Instagram / LinkedIn / GitHub.
- `indicator` — affordance shown bottom-right at rest, fading out once engaged. Defaults to a cursor arrow; pass `null` to hide, or any node to replace it.
- Spreads any extra `div` props.

### `ContactLink`

- `href`, `label` (used as the accessible name), `icon` (React node).
- `brandClassName` — Tailwind class for the gradient revealed on hover.
- `delay` — stagger for the reveal, e.g. `"0.08s"`.

## Notes

- **Hover on desktop, tap on mobile.** Tailwind gates `group-hover:` behind `@media (hover: hover)`, so on touch devices the links would be permanently hidden — i.e. unreachable. The component detects this with `matchMedia("(hover: hover) and (pointer: fine)")` and, on touch, reveals the links when the card is tapped. Tapping a link doesn't collapse the card.
- On desktop each panel takes its brand colour on its **own** hover. On touch there is no hover, and tapping a panel navigates — so all the brand colours come up together with the panels when the card is tapped open.
- The reveal and retract staggers run in **opposite** order (largest panel in first, smallest out first), and the title trails the panels on the way back. This works because a transition takes its `transition-delay` from the state it moves *toward*: the base rule carries the retract timing, the hover/expanded rule the reveal timing.
- Brand colors fade in as a **separate layered element whose opacity animates** — `background-image` is not an animatable property, so cross-fading gradients any other way would snap instead of transition.
- Reveal animates only `transform`/`opacity` (never layout properties), so it stays compositor-smooth.
- Swapping `brandClassName` is all that's needed to add a service; any `bg-[linear-gradient(...)]` works.
- The card is a **fixed size** and the title block's travel is tuned to it (the block widths are chosen so the inner-width remainder is a constant 24px at both breakpoints). If you resize the card or use a much longer title, retune the `translate-x`/`translate-y` values on the title block.
