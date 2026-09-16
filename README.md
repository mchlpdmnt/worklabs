# Worklabs

This project is the public Worklabs component registry. It presents the components stored in `React Components/registry` through a focused repository interface: every component has an overview, rendered README, live playground demo, and source-code browser.

## Phase 1

- Registry index generated from the real Worklabs component folders
- Curated homepage with featured work and separate library destinations
- Dedicated Components and Templates pages
- Search and category filters
- Dedicated page for every component
- Clean history-based URLs with automatic upgrades for old `#/` bookmarks
- Live demos embedded from the local Worklabs playground
- Rendered Markdown documentation
- Multi-file source browser with line numbers and copy support
- One-click, component-specific AI integration prompts beside the Source tab (README, dependencies, and source included)
- Responsive desktop and mobile layouts
- Viewport-height homepage sections, black auto-fitted demo canvases, hidden scrollbar rails, and reduced-motion-aware smooth scrolling
- Branded navbar on all registry pages except Home, with our FlowButton GitHub link and matching low-radius Back buttons
- Static generated data that can be deployed without exposing the local drive

## Local setup

Install the registry and playground dependencies once:

```bash
cd G:\Projects\Worklabs
npm install
npm --prefix "React Components" install
```

Then sync the component catalog and start the complete site:

```bash
npm run sync:worklabs
npm run dev
```

Open `http://127.0.0.1:5173`. The registry is the only browser-facing site. During development, Vite proxies `/demos/*` to the internally running Next.js playground.

Each registry preview opens a dedicated component demo, such as `/demos/card-stack/`. The collection hub at `/demos/` is separate and is never embedded as a component preview.

The navbar's **GitHub** action opens [mchlpdmnt/worklabs](https://github.com/mchlpdmnt/worklabs) in a new tab by default, with no star action or count. No environment configuration is required. To override the destination, set `VITE_WORKLABS_GITHUB_URL` to an HTTPS GitHub repository URL before building (locally or in Netlify's environment settings); an invalid override disables the action. The navbar is not included inside isolated demo canvases.

The navbar and Back controls reuse the published `React Components/registry/flow-button` source, with a 6px rounded-rectangle variant. No Originkit component or API key is needed.

## How the local source becomes a website

Browsers and production servers cannot read the component workspace directly. The `npm run sync:worklabs` command safely copies the README and supported files from `React Components/registry` into `src/generated/worklabs.json`. The public Worklabs interface imports that static snapshot at build time.

Run the sync command whenever a component is added or updated.

The sync script's `unpublishedComponents` set excludes retired components from the public catalog while preserving their local registry source. Retired demo examples belong in `React Components/playground/archive/`, outside the exported Pages Router routes.

Override the source location when needed:

```bash
$env:WORKLABS_SOURCE = "D:\another\component-workspace"
npm run sync:worklabs
```

The override must point to a workspace containing `registry/` and `README.md`.

The sync only reads component folders inside `registry` and supported documentation/source extensions. It does not copy environment files, dependencies, build output, or repository history.

## Quality checks

```bash
npm test
npm run typecheck
npm run build
```

## Production setup

The production build creates one deployable static site:

```bash
npm run build
```

This command refreshes the registry snapshot, exports the Next.js playground, builds the Vite registry, and bundles every demo under `dist/demos/`. Deploy the resulting `dist/` directory to a static host. Registry pages and live demos then share the same domain.

Registry routes use clean paths such as `/components` and `/components/button-with-icon`. Preview is the default view; README and Source use `?tab=readme` and `?tab=source`. Existing root `#/` bookmarks are replaced with their clean equivalents in the browser without adding a history entry.

The root `netlify.toml` checks the separate playground workspace against its lockfile, installs it with `npm ci` only when missing or out of sync, runs the complete build, and publishes `dist/`. This avoids a local Windows `EPERM` error when a development server holds Lightning CSS open during a production deploy; a fresh hosted Netlify build still gets a clean install. `public/_redirects` is copied into the published folder and rewrites only registry routes to `/index.html`, so direct links and refreshes work without swallowing `/demos/*` or missing assets. Other static hosts need the equivalent scoped registry rewrites.

For an already built local artifact, create a draft with `npx netlify deploy --dir=dist --no-build`, verify the registry and demo URLs, then publish the same artifact with `npx netlify deploy --prod --dir=dist --no-build`. Do not run `build:registry` alone when deploying: Vite replaces `dist/` and the demos must be bundled afterward.

Use directory-index routing for `/demos/*` (for example `/demos/blog-card/` serves `dist/demos/blog-card/index.html`). Never rewrite missing demo paths to the root registry's `index.html`: that embeds the whole registry recursively. The local `npm run preview` server redirects valid slashless demo directories and returns a real 404 for missing demos.

Homepage sections have a minimum height of one screen; short/mobile viewports can grow to keep their content readable. Scrollbar rails are hidden, not page scrolling. Documentation and source remain keyboard-scrollable. Embedded demos fit their measured content by scaling the iframe, keeping fixed menus and pointer-based interactions intact. Standalone demos retain normal scrolling where necessary. Demo canvas backgrounds are white; intrinsic component colors are preserved. On phones, the BlogCard sample shows one card and the ProjectShowcase sample uses compact thumbnails to avoid unreadably small previews; portable registry components are unchanged.

`VITE_WORKLABS_DEMO_BASE_URL` remains available as an optional override if the demos ever need to be hosted elsewhere.

A Render API, PostgreSQL, and Cloudflare R2 are achievable later, but they are not required for the current read-only portfolio. They become useful when adding accounts, an admin upload flow, dynamic metadata, screenshots, or other user-managed files.
