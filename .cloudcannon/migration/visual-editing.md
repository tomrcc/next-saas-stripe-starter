# Phase 4: Visual editing

Site: `next-saas-stripe-starter` (Next 16.3.4, App Router, React 19.2, Fumadocs MDX macro API). Follows `audit.md`, `configuration.md`, `content.md` and the user's decisions: production `pnpm build` unchanged on a Node host, CloudCannon runs `pnpm build:cloudcannon`; home is a page builder; legal `<Section>` is a snippet; pricing is code.

## Section census

Written before any region attribute. Paths are relative to the file the Visual Editor has open unless they start with `@data`.

| Page | Section | Treatment | Binding plan | Data completeness | Justification |
|---|---|---|---|---|---|
| All marketing pages | Header logo name | data-file text | `<editable-text data-prop="@data[site].name">` inside `LogoMark` (also the docs nav) | Name in `site.json` | — |
| All marketing pages | Header links | data-file text, by index | `@data[navigation].<i>.title` on each visible link's label, `<i>` = index in the file | Title, href, external, feature in `navigation.json` | No array region: links are filtered by module flag, so rendered positions differ from file positions (Pricing is hidden in the editing build). An array region maps children by position. Add/remove/reorder in the data editor |
| All marketing pages | Header "Pro" link | — (code) | — | Label and styling in code | Carried from content.md open question 3 |
| All marketing pages | Footer site description | data-file text | `@data[site].description` | In `site.json` | — |
| All marketing pages | Footer columns and links | data-file text, by index | `@data[footer].<c>.title`, `@data[footer].<c>.links.<l>.title` | All in `footer.json` | No array region: links and whole columns are filtered by module flag (Product column hidden). Same reason as header links |
| All marketing pages | Footer copyright | data-file text (name only) | `@data[site].name` on the name | Year computed; sentence in code | Sentence carried from content.md open question 3 |
| Home `/` (and page-builder pages) | Blocks list | array + component | `Blocks`: `data-editable="array" data-prop="content_blocks" data-component-key="_type"`; each block `data-editable="array-item" data-component={_type}`; computed values as `data-literal-<key>` | — | — |
| Home | Hero | component + array + text | `title_lines`, `subtitle_lines` arrays (each line `<editable-text data-prop="">`); `secondary_button.label` text; GitHub badge and primary CTA from the route (`github`, `cta` literals) | Badge wording ("stars on GitHub", "Star us") and CTA labels in code | Badge/CTA wording carried from configuration.md open question 2 |
| Home | Stack marquee | component + array | `caption_lines` array | Logos are code | Logos: design, no field |
| Home | Modules showcase | component + text + arrays | `eyebrow`, `title`, `description` text; `features` array (`title`, `description` rich text, `link_label`); `facts` array (`title`, `description`) | Icons and illustrations are selects → sidebar; panel demo is code | Selects re-render the block from the sidebar |
| Home | Why modular | component + text + arrays | `title`, `description`; `approaches` array (`title`, `points` string array with `data-prop=""`) | `highlighted` switch → sidebar | — |
| Home | Closing CTA | component + text | `title`, `description`, `secondary_button.label`; repo card from `github` literal | Card labels ("Public", "TypeScript", "Star on GitHub", "License MIT") in code; card text is `site.json` description | Card wording carried as an open question |
| `/blog` | Intro | text | `title`, `description` (content/pages/blog.md) | — | — |
| `/blog` | Category tabs | — (computed) | — | Category titles in `categories.json` | Tabs are computed from the categories file plus the changelog flag; edit in the data editor |
| `/blog` | Post cards | — (computed listing) | — | Each post's own page | Each post has its own page with full regions; the grid is sorted, filtered and paginated with build-time blur placeholders (audit primitive-vs-computed) |
| `/blog/<slug>` | Categories badges | component (select lookup) + data-file text | `<div data-editable="component" data-component="post-categories" data-prop-categories="categories">`; each title `@data[categories].<i>.title` | Titles in `categories.json` | — |
| `/blog/<slug>` | Date | sidebar | — | — | Dates are not text regions (skill rule); input comment says it shows after the next build |
| `/blog/<slug>` | Title, description | text | `title`, `description` | — | — |
| `/blog/<slug>` | Cover image | image | `data-editable="image" data-prop-src="image"` on the image frame | Alt is the title | — |
| `/blog/<slug>` | Body | text (@content) | `<article data-editable="text" data-type="block" data-prop="@content">` around `<MDX />` | — | — |
| `/blog/<slug>` | Authors ("Written by") | component (select lookup) + data-file text | `post-authors` with `data-prop-authors="authors"`; `@data[authors].<i>.name`, `.role` | Name, role, avatar in `authors.json` | Avatar has no image region: Base UI `Avatar` renders its `<img>` only after the image loads in the browser, so the server HTML has none to bind. Change it in the data editor |
| `/blog/<slug>` | Table of contents | — (computed) | — | From body headings | Derived from the body |
| `/blog/<slug>` | Pro card | data-file text | `@data[pro_cta].eyebrow`, `.title`, `.description` | New `data/pro-cta.json`; link stays `siteConfig.links.pro` | — |
| `/blog/<slug>` | "Read more" related posts | — (computed) | — | Slugs in `related` multiselect | Lookup into the blog collection with build-time blur placeholders (sharp); each post has its own page. Changes show after the next build |
| `/changelog` | Intro | text | `title`, `description` (content/pages/changelog.md) | — | — |
| `/changelog` | Entries | — (computed listing) | — | Each entry's own page | Same as blog post cards |
| `/changelog/<slug>` | Title, description, image, body | text, image, @content | as blog; description and image only when set | — | Image/description absent → add them in the sidebar |
| `/changelog/<slug>` | Author | component (select lookup) + data-file text | `post-authors` with `data-prop-author="author"` | In `authors.json` | Avatar as blog |
| `/changelog/<slug>` | Share row | — | — | Icons only, no text | Nothing visible to edit |
| `/changelog/<slug>` | Pro card, ToC, date | as blog | as blog | — | as blog |
| `/docs/*` | Title, description, body | text, @content | `DocsTitle` `title`, `DocsDescription` `description`, `DocsBody` `@content` | — | — |
| `/docs/*` | Sidebar tree, page ToC, nav logo | computed / data-file text | Logo name `@data[site].name` | Order in `content/docs/meta.json` | Fumadocs `DocsLayout` builds the tree internally from the collection and `meta.json` (third-party, no attribute passthrough); edit order in the data editor |
| `/privacy`, `/terms` | Title, body | text, @content | `title`; `<article data-editable="text" data-type="block" data-prop="@content">` | `<Section>` is a snippet | — |
| `/privacy`, `/terms` | Last updated | sidebar | — | — | Date, see blog date |
| Template labels | "Last updated ·", "Written by", "Read more", "Changelog" badge, legal "Last updated:" | — (code) | — | In route files | Route files can't host source regions in Next.js (skill rule); moving them to a data file is a config change → open question |

## Checklist

Infrastructure (`nextjs/visual-editing.md`):

- [x] `@cloudcannon/editable-regions` 0.0.22 in `dependencies`
- [x] `output: "export"` in the gated editing-build config (production keeps a server build)
- [x] `app/layout.tsx` has one `<EditableRegions tag="div">` around `children`; the marketing header/footer and the docs layout render inside it
- [x] `<CloudCannonEditor />` rendered in `app/layout.tsx`, `"use client"`, imports `./registerComponents` with a relative path inside the `inEditorMode` check
- [x] No `pages/`; no `@cloudcannon/react-connector` / `CloudCannonConnect`
- [x] No client component imports `registerReactComponent` or the map at the top level
- [x] Both builds pass

Universal (`visual-editing.md`):

- [x] Editor enablement: `visual` in `_enabled_editors` for `pages` schemas, `blog`, `changelog`, `docs`
- [x] Census coverage: every row has regions or a justification
- [x] Array containers and items; per-loop census; nested text on every item; relative paths inside items; containers hold only items
- [x] Image editables: blog and changelog covers (`data-prop-src="image"`); author avatars justified
- [x] Child component labels: block labels come from content; template labels listed as an exception and an open question
- [x] Shared partials backed by data: header, footer, logo, Pro card (`@data[...]`)
- [x] Data file completeness: header/footer/Pro card text in data files; exceptions carried from content.md open question 3
- [x] Cross-collection select wiring: `post-categories`, `post-authors` registered, lookups inside, wrapped at the call site
- [x] `_inputs` audit: every `data-prop` has an input of the matching type (text/textarea → span regions; feature `description` is `markdown` → `data-type="text"` on a `<p>`; bodies → `@content`; covers `type: image`)
- [x] Schema-file seeds: every wired field is in its schema file
- [x] Markdown body content: `@content` on blog, changelog, docs, legal
- [x] Source editables: none (route files can't host them in Next.js)
- [x] Conditional guards: optional `description` and changelog `image` render only when set
- [x] Component prop contract: blocks take their block's fields; lookup components take named props through `data-prop-<name>`
- [x] `<template>` blueprints: none needed (every array sits inside a registered block)
- [x] Data file input config: `data/pro-cta.json` has a `file_config` entry

Next.js items:

- [x] Regions inside the root
- [x] Every `componentMap` key is used as a `data-component`: `hero`, `stack-marquee`, `modules-showcase`, `why-modular`, `closing-cta`, `post-categories`, `post-authors`
- [x] Registered components are client-safe: sync, no `server-only`/`next/headers`/router hooks; GitHub fetch and flag read moved out (the build fails if a `server-only` module reaches the client graph; it passes)
- [x] Rich text hosts: feature `description` through `dangerouslySetInnerHTML` on its `<p>`; MDX bodies render inside the `@content` host
- [x] Spread props: `<Block {...block} {...extras} />`

Page builder:

- [x] `data-editable="array" data-prop="content_blocks" data-component-key="_type"` on the `Blocks` wrapper
- [x] `data-editable="array-item"` + `data-component={_type}` on each block's wrapper; `Blocks` renders from `blockMap`, `componentMap` spreads it
- [x] Widget nested editables, sub-arrays (`title_lines`, `subtitle_lines`, `caption_lines`, `features`, `facts`, `approaches`, `points`)
- [x] Keys match `_type`; every `_type` in `content/pages/index.md` has an entry (`Blocks` throws otherwise)
- [x] Build output contains `data-component-key`, `data-component=`, `data-editable="array-item"`

Pre-handoff sweep:

- [x] Census walk-through: every row implemented or justified
- [x] Shared-UI table: header → `navigation.json` (text by index, no component: it reads flags on the server); footer columns → `footer.json` (text by index); footer credits → copyright sentence stays code (content.md OQ3), name bound; CTA banner → none above the footer; the post sidebar Pro card → `pro-cta.json`; share block → icons only, no text; author card → `authors.json` + `post-authors`; announcement bar → none on this site
- [x] Build grep (counts below)

## What changed

- **Setup:** `app/layout.tsx` wraps `children` in `EditableRegions` and renders `CloudCannonEditor`; `app/cloudcannon/cloudcannon-editor.tsx` (gated import), `app/cloudcannon/registerComponents.ts`.
- **`componentMap`** adds `post-categories` (`module:blog` marker) and `post-authors` (`module:blog,changelog` marker); `config/features.ts` lists the two files under those modules. `pnpm modules:prune blog` / `blog changelog` dry runs delete them and strip the map lines.
- **`Blocks`** wraps the blocks in the array region and each block in an array-item div, and takes `extras` (props per `_type`) which it passes as props and as `data-literal-<key>` attributes.
- **`getBlockExtras()`** (`components/marketing/block-extras.ts`, `server-only`): GitHub repo stats and the starter CTA, for `hero` and `closing-cta`. Called by `app/(marketing)/page.tsx` and the page-builder branch of `app/(marketing)/[slug]/page.tsx`.
- **`HeroStarter`, `ClosingCta`** are sync and take `github` and `cta` props; each renders the primary CTA only when `cta` is set (a block added in the editor has none until the next build). `formatStars`/`getGithubStars` folded into the hero; `lib/github.ts` exports `GithubRepo`.
- **Block regions:** `Lines` renders each line as an array item with `<editable-text data-prop="">` (empty lines render too, so positions match); `SecondaryButton` takes `prop` for its label path; `Reveal` passes extra attributes to its `<div>` (approach cards are array items). `ModulesShowcase` renders the feature description to an HTML string on its region host; `code` is styled from the host (`[&_code]:…`), since markup inside a region can't keep attributes.
- **Detail pages:** blog and changelog get title, description, cover image and `@content` regions, and the lookup components `PostCategories`/`PostAuthors` (`components/content/`). Docs: `DocsTitle`, `DocsDescription` (only when set), `DocsBody` as `@content`. Legal: title and `@content` on the `<article>`.
- **Listings:** `/blog` and `/changelog` intro `title`/`description`.
- **Shared UI:** `LogoMark` name, header link labels, footer description, column titles, link labels and copyright name bind to `@data[...]`. Header and footer keep each item's index in the file through the flag filter.
- **Pro card:** text moved to `data/pro-cta.json` (`eyebrow`, `title`, `description`), registered as `pro_cta` with a `file_config` entry; the link stays `siteConfig.links.pro`.
- **Editor CSS** (`app/globals.css`, under `.cms-editor-active`): `.reveal` shown at rest, `animate-slide-up-fade` off, `min-width`/`min-height` on array regions for the Add button.
- **Config (cross-phase):** `data_config.pro_cta`, its `file_config`, and a comment on the blog/changelog `date` and legal `updatedAt` inputs saying the page shows a new date after the next build. `cloudcannon validate` passes.

## Verification

- `pnpm build:cloudcannon`: succeeds, 27 pages. `pnpm build`: succeeds, 43 pages, route table as the baseline (`/` revalidates hourly, `/blog` and `/changelog` dynamic, `/pricing` static).
- `pnpm typecheck` passes; `pnpm lint` reports only the existing `panel-demo.tsx` error.
- Visible text of every exported HTML page compared before and after this phase (scripts, `<head>` and tags removed): identical, apart from `'` no longer escaped in one feature description.
- Region counts in `out/` (`grep -oE`): home — 1 root, 9 `array`, 27 `array-item`, 34 `text` plus `editable-text` elements, 5 `data-component`, 2 `data-literal-github`, 2 `data-literal-cta`, `data-component-key="_type"`; blog post — 2 `component`, 1 `image`, 8 `text`, `@content`, `@data[categories].1.title`, `@data[authors].0/1.name/role`, `@data[pro_cta].*`; changelog entry — 1 `component`, 1 `image`, `@content`; docs — `title`, `description`, `@content`, `@data[site].name`; legal — `title`, `@content`; every marketing page — `@data[site].name` ×3, `@data[site].description`, `@data[navigation].1/2.title`, `@data[footer].1.*`, `@data[footer].2.*`.
- **What production gets:** the same region attributes in its HTML, and a 4.4 KB shared chunk holding `CloudCannonEditor`, the `EditableRegions` root and `registerReactComponent` from `@cloudcannon/editable-regions/react` (the module also adds a `cloudcannon:load` listener). The registered components load in a separate chunk that no page references; only the gated `import()` requests it, inside the Visual Editor.

## Decisions and why

- **Computed block values travel as `data-literal-<key>`:** the editor re-renders a block from its `content_blocks` entry only. The route computes the GitHub stats and CTA once and writes them on the array-item host, which the runtime merges into the props (`Editable.getNewValue`). The attribute is `data-literal-<key>`, not the `data-literal-prop-*` the skill documents: the runtime reads the name after `literal`. Keys are lowercase because the runtime lowercases them.
- **Header and footer bind by index, no array regions:** both filter by module flag, and an array region binds DOM children by position. Add, remove and reorder links in the data editor. Header and footer stay unregistered async server components: they read flags (and the session in production).
- **Lookup components bind with `data-prop-<name>`** on a `<div data-editable="component">`: `data-prop="categories"` would hand React the array as `{0: …, 1: …}`; the named form passes `{ categories }`. One `PostAuthors` serves `authors` (blog) and `author` (changelog).
- **Lookups import the JSON data files** (`data/authors.json`, `data/categories.json`) directly, so they run in the browser and give each item's file index for its `@data` text regions.
- **Feature description is a `data-type="text"` region** on its `<p>`, matching its inline `markdown` input; `code` styling moved to the host.
- **Listing cards, changelog entries on `/changelog`, related posts and the docs sidebar stay computed:** each entry has its own page with full regions; the lists are sorted, filtered, paginated or built by Fumadocs.
- **Pro card text → data file** per the shared-UI table; link left in `config/site.ts` with the other links (Phase 2 decision).
- **CloudCannon files in `app/cloudcannon/`:** `componentMap.ts` was already there (Phase 3); the loader sits beside the registration it imports.

## Known editor behaviour

- After a block re-renders, its client demos (`ModuleDeck`, `PanelDemo`) are static until the page reloads; the re-render mounts them in a detached root. Scroll reveals and slide-up entrances are off in the editor.
- A hero or closing CTA added in the editor shows no primary button or GitHub stats until the next build.
- Dates, the hero/closing GitHub badge and card, icons, illustrations, `highlighted`, `href`s and `feature` keys are sidebar edits.

## Open questions

1. **Template labels** — "Last updated ·", "Written by", "Read more", the "Changelog" badge, legal "Last updated:", the GitHub badge/card wording and the header "Pro" link are code. Default: leave. Alternative: a `labels` data file with `@data[labels]` regions (config change).
2. **Listing cards** — post cards on `/blog`, entries on `/changelog` and "Read more" related posts could get `@file[/content/blog/<file>].title`/`description` regions. Default: none; edit each entry on its own page.
3. **Header/footer link order** — reorder and add in the data editor only (see Decisions). Default: keep. Alternative: render every link and hide flagged ones with CSS so the lists can be array regions (changes production markup).
