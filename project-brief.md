# Worklabs Project Brief

## Product definition

Worklabs is a public component registry and portfolio for the work maintained in `G:\Projects\Worklabs\React Components`.

It should feel like a more visual, curated GitHub repository. A visitor can discover a component, understand what it does, see its documentation, interact with a working demo, and inspect the exact source without leaving the site.

> Browse the component. Read how it works. Try it live. Inspect the source.

## Source of truth

The Worklabs repository remains the source of truth.

```text
G:\Projects\Worklabs
├── React Components\
│   ├── registry\
│   │   └── component-name\
│   │       ├── README.md
│   │       └── component-name.tsx
│   └── playground\
│       └── demo routes
├── scripts\
│   └── sync-worklabs.mjs
└── src\
    └── generated\worklabs.json
```

The public interface does not edit those components in Phase 1. A local sync script reads the safe, public files in `registry` and creates a deployable JSON snapshot. This avoids pretending that a browser or hosted static site can directly access a local Windows drive.

## Core experience

### Homepage

- Centered Worklabs introduction and clear library entry points
- A curated selection of featured work rather than the complete registry
- Separate paths into Components and Templates
- Published counts supplied by static data now and the database later

### Registry index

- Display all published Worklabs components
- Search by component name, summary, category, or tag
- Filter by category
- Show useful metadata such as file count, source line count, and update date
- Link each card to its component detail page

### Component page

Each component page has three primary tabs:

1. **Preview** — an embedded route from the Worklabs playground, with desktop, tablet, and mobile viewport controls
2. **README** — the component's Markdown documentation rendered as readable content
3. **Source** — a file selector and line-numbered code viewer with copy support

The page also shows category, dependencies, tags, file count, source size, update date, and original registry path.

### About page

Render the root Worklabs README so visitors understand the broader component lab and its conventions.

## Phase 1: local validation

Phase 1 validates the browsing experience before any backend is introduced.

- React, TypeScript, Vite, and Tailwind CSS
- Hash-based routing suitable for static hosting
- Generated static registry snapshot
- Worklabs registry interface at `http://127.0.0.1:5173`
- Next.js playground running internally at `http://127.0.0.1:3000` and exposed through the registry at `/demos/*`
- No authentication
- No database
- No browser localStorage
- No cloud storage
- No editing or uploading through the public registry interface

### Phase 1 completion criteria

- All current registry components appear automatically after sync
- Every item has README and source views
- Every configured playground route loads in Preview
- Search, category filters, tabs, file selection, copy, and responsive layouts work
- Production build succeeds
- The generated snapshot contains no secrets or unrelated project files

## Content workflow

```text
Build or update a component in Worklabs
                 ↓
Run npm run sync:worklabs in the registry interface
                 ↓
Review the README, preview, and source locally
                 ↓
Build and deploy the Worklabs interface
```

New registry folders can be discovered by the sync automatically. Curated category, tag, and demo-route details live in the sync catalog and can be expanded as Worklabs grows.

## Production architecture

The first production version remains static and deploys as one site:

```text
Worklabs component registry ──sync──> registry snapshot
             │
             └──export──> playground routes under /demos/*
                                      │
                         Vite registry build
                                      │
                            one static dist/ site
```

The registry and its embedded previews share one origin. `VITE_WORKLABS_DEMO_BASE_URL` is only needed if a future deployment intentionally separates them.

## Optional cloud phase

Render plus Cloudflare R2 is achievable, with one important distinction:

- **Render Node.js API** — authentication, admin operations, sync jobs, and business logic
- **PostgreSQL on Render** — component metadata, users, tags, versions, and searchable records
- **Cloudflare R2** — screenshots, downloadable bundles, generated archives, and other binary assets

R2 is object storage, not the primary searchable database. This cloud phase is only warranted if Worklabs becomes dynamically managed through the browser, supports multiple users, or needs uploaded assets. It is deliberately deferred until the local experience passes testing.

## Visual direction

- Repository-like clarity without copying GitHub's interface
- Minimal, editorial, developer-focused presentation
- Neutral surfaces with a cobalt accent
- Geist for UI text and JetBrains Mono for paths, metadata, and code
- Spacious layout, crisp borders, restrained motion, and strong focus states
- Mobile layouts that preserve full access to preview, documentation, and source

## Out of scope for Phase 1

- Bookmark or resource CRUD
- Collections and favorites
- User accounts
- Admin dashboard
- Direct filesystem access from the browser
- Automatic GitHub import
- Render, PostgreSQL, or R2 integration
- Component package publishing

## Future enhancements

- Syntax highlighting and raw-file download
- Component version history and changelogs
- Props/API extraction from TypeScript
- Accessibility and test-status badges
- Shareable preview configurations
- Screenshot generation for social cards
- GitHub links and automated CI synchronization
- Admin publishing workflow backed by Render, PostgreSQL, and R2
