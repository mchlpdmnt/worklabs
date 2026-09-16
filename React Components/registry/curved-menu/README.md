# CurvedMenu

A magnetic burger button paired with a curved, animated navigation sidebar. It tracks the active route, focuses the current link when opened, traps keyboard focus, and hides scrollbar rails without disabling short-screen scrolling.

## Dependencies

```bash
npm install motion
```

Also assumes the **Next.js Pages Router** (`next/router`, `next/link`) and Tailwind CSS.

## Integration

Mount the component once in `pages/_app.tsx`, outside page-transition wrappers:

```tsx
import type { AppProps } from "next/app";
import { CurvedMenu } from "@/components/curved-menu/curved-menu";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CurvedMenu />
      <Component {...pageProps} />
    </>
  );
}
```

Custom navigation:

```tsx
const items = [
  { title: "Home", href: "/", target: "home" },
  { title: "Work", href: "/work" },
  { title: "About", href: "/#about", target: "about" },
  { title: "Contact", href: "/contact" },
];

<CurvedMenu items={items} revealAfterTarget="work" />;
```

## Props

- `items` — link labels, destinations, and optional same-page target IDs.
- `homepagePath` — homepage pathname; defaults to `/`.
- `revealAfterTarget` — homepage element ID after which the burger becomes visible; defaults to `works`. Pass `null` to show it immediately.
- `navigationLabel` — sidebar eyebrow text; defaults to `Navigation`.

## Notes

- Same-page targets use native smooth scrolling. If the host app uses Lenis or another scroll controller, replace the small `scrollToTarget` helper with that controller's API.
- The component uses `#0c0c0e` and `#fffafa` directly. Change `MENU_COLOR` and the matching Tailwind color utilities together to retheme it.
- The sidebar remains vertically scrollable on short screens, but its scrollbar rail is hidden.
- Respects `prefers-reduced-motion` and disables the magnetic and entrance motion.
