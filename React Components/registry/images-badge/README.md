# ImagesBadge

An interactive pill that presents a compact stack of image thumbnails, fans additional images out on hover, and optionally includes a text label.

## Dependencies

```bash
npm install motion
```

Requires Tailwind CSS. The component uses neutral utility colors and does not require shadcn theme tokens.

## Integration

```tsx
import { ImagesBadge } from "@/components/images-badge/images-badge";

const images = [
  { src: "/projects/alpha.jpg", alt: "Alpha project" },
  { src: "/projects/beta.jpg", alt: "Beta project" },
  { src: "/projects/gamma.jpg", alt: "Gamma project" },
];

<ImagesBadge images={images} size="sm" label="More works" />;
```

Wrap the badge in a link when it navigates somewhere. Pass `onClick` only when it performs an in-place action.

## Props

- `images` — thumbnail sources and alt text.
- `maxVisible` — thumbnails visible while collapsed; defaults to `3`.
- `revealCount` — additional thumbnails revealed on hover; defaults to `2`.
- `label` — optional text after the image stack.
- `size` — `sm`, `md`, or `lg`.
- `shape` — `circle`, `rounded`, or `square`.
- `className`, `imageClassName`, and `labelClassName` — targeted styling hooks.
- `onClick` — optional mouse and keyboard activation handler.

## Notes

- Respects `prefers-reduced-motion` by showing the full thumbnail strip without animation.
- Alt text belongs to each image; the parent link or button should still have an accessible action label.
