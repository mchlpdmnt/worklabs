# ProjectShowcase

A responsive project index with inline images on touch-sized screens and a spring-smoothed pointer-following preview on desktop.

## Dependencies

```bash
npm install motion lucide-react
```

Also assumes Next.js for `next/link` and Tailwind CSS. It uses plain neutral colors rather than shadcn theme tokens.

## Integration

```tsx
import {
  ProjectShowcase,
  type ProjectShowcaseItem,
} from "@/components/project-showcase/project-showcase";

const projects: ProjectShowcaseItem[] = [
  {
    title: "Hearth Coffee & Bakery",
    description: "A concept site for a neighborhood coffee shop.",
    year: "2026",
    link: "/works/hearth-coffee-bakery",
    image: "/works/hearth.webp",
  },
];

<ProjectShowcase projects={projects} />;
```

## Props

- `projects` — project title, destination, optional description/year, image, and responsive `imageSrcSet`.
- `className` — additional classes for the section shell.
- `emptyMessage` — copy displayed when no projects are supplied.

## Notes

- Desktop previews follow mouse input only. Touch and narrow layouts display each project image inline.
- Keyboard focus activates the same title, underline, and arrow state as hover.
- Respects `prefers-reduced-motion` and disables preview motion accordingly.
- To use outside Next.js, replace `Link` with a plain anchor.
