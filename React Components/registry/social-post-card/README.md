# SocialPostCard

A minimal social/blog post card: rounded cover image, title, and a small indigo accent tag, with a gentle hover lift. Also exports `SocialPostCardGrid` — a centered "Latest Blog" section that lays out a set of cards in a wrapping row.

## Dependencies

None. Tailwind CSS with **shadcn/ui theme tokens** (`text-foreground`, `text-muted-foreground`, `bg-card`). Swap those for plain colors if the target project doesn't use shadcn tokens.

## Integration

```tsx
import { SocialPostCard, SocialPostCardGrid } from "@/components/social-post-card/social-post-card";

// Single card — size it via className (the component itself is width-fluid)
<SocialPostCard
  className="max-w-72"
  imageUrl="/cover.jpg"
  imageAlt="Sketching wireframes"
  title="Color Psychology in UI: How to Choose the Right Palette"
  category="UI/UX design"
  onClick={() => router.push("/blog/color-psychology")}
/>

// Or the full section with heading + wrapping grid
<SocialPostCardGrid posts={posts} />
```

## Props

### SocialPostCard

- `imageUrl` / `imageAlt` — cover image (rendered `aspect-[3/2] object-cover`).
- `title` — post title.
- `category` — small accent label under the title (indigo, e.g. `"Branding"`).
- `description` — optional paragraph; pairs well with boxed chrome — pass `className="bg-card rounded-lg p-4 shadow"` for a filled-card look.
- Forwards a `ref` and spreads any extra `div` props (`onClick`, `role`, ...).

### SocialPostCardGrid

- `posts` — array of `SocialPostCardProps`.
- `heading` — section title, default `"Latest Blog"`; pass `""` to hide.
- `description` — line under the heading; pass `""` to hide.
- Spreads any extra `section` props. Cards are capped at `max-w-72` and wrap centered with `gap-8`.

## Notes

- The original demo loaded Poppins through a global `<style>` tag with a `* { font-family }` override; that was dropped because it leaks into the whole document. Load the font in the host app instead (e.g. `next/font/google`) and apply it on a wrapper.
- The card is deliberately chrome-less: sizing and background live on the caller (`className`), so the same component renders as a bare post or a boxed card.
- Hover lift is CSS-only (`-translate-y-0.5`, 300ms) — no JS animation library.
