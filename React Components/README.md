# Worklabs

Personal component lab. Portable UI components live in `registry/`; the `playground/` Next.js app is only for developing and previewing them.

The directory listing below shows published components only.

```
Worklabs/
├── registry/                  # portable components — copy these into real projects
│   ├── blog-card/
│   │   ├── blog-card.tsx      # poster card, details slide up on hover (CSS-only)
│   │   └── README.md
│   ├── button-with-icon/
│   │   ├── button-with-icon.tsx # animated pill button with circular icon
│   │   └── README.md
│   ├── card-stack/
│   │   ├── card-stack.tsx     # interactive stacked project cards
│   │   └── README.md
│   ├── contact-card/
│   │   ├── contact-card.tsx   # monochrome card, social links w/ brand gradients
│   │   └── README.md
│   ├── curve-page-transition/
│   │   ├── curve-page-transition.tsx
│   │   └── README.md          # needs AnimatePresence wiring in _app — see file
│   ├── curved-menu/
│   │   ├── curved-menu.tsx    # magnetic burger with curved navigation drawer
│   │   └── README.md
│   ├── flow-button/
│   │   ├── flow-button.tsx    # animated directional CTA
│   │   └── README.md
│   ├── gradient-pointer/
│   │   ├── gradient-pointer.tsx # pointer-following CSS color field
│   │   └── README.md
│   ├── images-badge/
│   │   ├── images-badge.tsx   # fanning image stack with optional text label
│   │   └── README.md
│   ├── infinite-marquee/
│   │   ├── infinite-marquee.tsx # scroll-direction-aware text rail
│   │   └── README.md
│   ├── landing-greet/
│   │   ├── landing-greet.tsx  # intro preloader — self-contained, no _app wiring
│   │   └── README.md
│   ├── magnetic-button/
│   │   ├── magnetic-button.tsx # pointer-responsive native button
│   │   └── README.md
│   ├── paint-reveal/
│   │   ├── paint-reveal.tsx   # pointer-driven canvas erase reveal
│   │   └── README.md
│   ├── project-showcase/
│   │   ├── project-showcase.tsx # responsive project list with image previews
│   │   └── README.md
│   └── text-scroll-reveal/
│       ├── text-scroll-reveal.tsx # word opacity driven by internal scroll
│       └── README.md
│
└── playground/                # Next.js (Pages Router) test app — never copied anywhere
    ├── pages/index.tsx        # separate collection hub
    ├── pages/card-stack.tsx   # isolated CardStack demo; other components have their own routes
    └── styles/globals.css     # Tailwind v4 + shadcn/ui theme tokens
```

## Workflow

**Develop:** run the playground and edit registry files with hot reload:

```bash
cd playground
npm run dev
```

**Add a component:** create `registry/<name>/<name>.tsx` plus a `README.md` listing its npm dependencies, then import it in a playground page via `@registry/<name>/<name>`.

**Preview isolation:** give every component its own demo route and register that route in `scripts/sync-worklabs.mjs` at the public registry root. Individual demos must not link to the collection hub or unrelated components. Navigation used to demonstrate a component should stay within that component's own route or route group.

**Integrate into another project:** copy the component's folder from `registry/` into the target project's components directory and install the deps listed in its README. Components assume Tailwind CSS with shadcn/ui theme tokens.

## Conventions

- Each registry component is self-contained in its own folder — including small helpers like `cn()` — so copying one folder is always enough.
- The playground reaches into `../registry` via the `@registry/*` tsconfig path alias, `turbopack.root` in `next.config.ts`, and an `@source` directive in `globals.css` (Tailwind must scan the registry for class names). If imports from the registry ever break, those are the three places to check.
