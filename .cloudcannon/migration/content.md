# Phase 3: Content

Site: `next-saas-stripe-starter` (Next 16.3.4, App Router, Fumadocs MDX macro API). Follows `audit.md`, `configuration.md` and the user's decisions: legal `<Section>` wrappers stay as a snippet, home sections migrate as they are into page-builder blocks, pricing stays code.

## Checklist

`content.md` review checklist:

- [x] Required fields present in every file (blog, changelog, docs, pages; checked key by key)
- [x] Defaults written into files (`link_label: Learn more` on every feature card, `highlighted` on every approach, `external`/`feature` on every link)
- [x] Every key in the schema files; no `draft` field on this site
- [x] Dates: one format per collection (quoted `"YYYY-MM-DD"`, parsed by `z.coerce.date()`); left as they are
- [x] Image paths: `/_static/...` from `public/`, as the templates read them
- [x] Field naming matches component props (block props are the structure keys)
- [x] Mixed-type fields: none
- [x] String references (`authors`, `author`, `categories`, `related`): select inputs from Phase 2; no content change
- [x] Body components: `Callout`, `Cards`/`Card`, `Section`, MDX comments unchanged (snippets from Phase 2)
- [x] Styled HTML in front matter: none. Responsive `<br>` became line arrays; `<Code>` became markdown backticks
- [x] Page-builder field completeness: every block in `content/pages/index.md` cross-referenced against its structure value, nested `button`, `showcase_features`, `showcase_facts`, `approaches` included
- [x] One field per visual slot (listing `description` = intro, `meta_description` = search description)
- [x] API-driven content: GitHub stars stay a build-time fetch (live stats, not content)
- [x] Settings in code → data files (`site`, `navigation`, `footer`, `authors`, `categories`)
- [x] Data files: valid JSON, top-level arrays of like-shaped items, max 2 levels of nesting

Addendum:

- [x] Field completeness (CRITICAL)
- [x] Fields the original page didn't pass hold the resolved default (`link_label`), or empty (`href:` on the fourth feature card)
- [x] No block-level HTML in front matter strings
- [x] Every array in a structure value links its `_structures` entry (Phase 2, validated)
- [x] Visible values in data-file consumers are in the data files, except those listed under Open questions
- [x] This note records every structural change

## What changed

### `content/pages/` (new Fumadocs collection, `lib/content/pages.ts`)

- `index.md` — `_schema: page_builder`, `title`/`description` (the home page's `<title>` and meta description), `content_blocks` with the five sections in today's order and today's text.
- `blog.md`, `changelog.md` — `_schema: listing`, `title` (h1), `description` (intro), `meta_description`.
- `privacy.mdx`, `terms.mdx` — moved from `content/legal/` with `_schema: legal` added; bodies unchanged.

`pagesSource` (baseUrl `/`) validates a Zod discriminated union on `_schema`. `getSitePage(slug, schema)` throws on a missing file or a different `_schema`, so either fails the build. Block contents are loose objects typed by each component.

### Routes

- `app/(marketing)/page.tsx` — reads `index` and renders `<Blocks>`. Metadata from `index.md` with `fullTitle` (absolute title), so the `<title>` is unchanged.
- `app/(marketing)/[slug]/page.tsx` (new) — every one-segment `pages` file except `listing` ones: `legal` → `LegalPage`, `page_builder` → `Blocks`. `dynamicParams = false`, so production 404s unknown slugs.
- `app/(marketing)/privacy/`, `terms/` and `lib/content/legal.ts` deleted.
- `/blog`, `/changelog` read their `listing` file for the h1, intro and metadata.
- `app/sitemap.ts` lists legal and page-builder pages from `pagesSource` (same entries today).

### Blocks

- `app/cloudcannon/componentMap.ts` — `blockMap` keyed by `_type` (`hero`, `stack-marquee`, `modules-showcase`, `why-modular`, `closing-cta`), spread into `componentMap`.
- `components/marketing/blocks.tsx` — renders each block from `blockMap`, throws on an unknown `_type`. No `data-editable` wrappers yet (they would add divs to the markup); Phase 4 adds the array and array-item wrappers per `nextjs/page-building.md § Blocks`.
- Section components take their block's fields as props and guard on null: `HeroStarter`, `StackMarquee`, `ModulesShowcase`, `WhyModular`, `ClosingCta`.
- `components/marketing/lines.tsx` — renders `*_lines` arrays with `<br className="hidden sm:block" />` between lines, matching the old markup.
- `components/marketing/secondary-button.tsx` — the violet "About Pro" button shared by hero and closing CTA; opens in a new tab for `http(s)` links (today's link is one).
- `ModulesShowcase` maps `eyebrow_icon`/`facts[].icon` to Lucide icons and `features[].visual` to the illustration components (`overflows` derives from `prune_terminal`). Feature descriptions are inline markdown rendered by a small `InlineMarkdown` (backticks → `<Code>`, `**`, `*`/`_`, backslash escapes), so no `<p>` is nested.

### Data files (`data/`, JSON)

- `site.json` — `name`, `title`, `description`; `config/site.ts` reads them into `siteConfig`, so every consumer is unchanged. `url` and `links` stay in code.
- `navigation.json` — header links; `site-header.tsx` reads it.
- `footer.json` — footer columns; `site-footer.tsx` reads it.
- `authors.json`, `categories.json` — top-level arrays with `slug`; `config/blog.ts` builds `blogAuthors`/`blogCategories` records from them (same API, keys now `string`).

### Schemas

`lib/content/schema.ts`: `optionalString` (`.nullish()` transformed to `undefined`) and `pageFields` (Fumadocs `pageSchema` with that description). Used by blog, changelog (`image`, `author`), docs and pages. Plain `.nullish()` collapses Fumadocs' collection type to `PageData` and fails the typecheck.

### Modules (`config/features.ts`)

- `blog` files: `+ content/pages/blog.md`, `data/authors.json`, `data/categories.json`
- `changelog` files: `+ content/pages/changelog.md`, `data/authors.json`, `data/categories.json` (config/blog.ts, listed by both, reads both)

`pnpm modules:prune blog`, `changelog`, `docs` (dry runs) list the new files correctly and keep the shared data files while the other module remains.

### Small cross-phase fixes

- `cloudcannon.config.yml`: `data/site.json` `title` input relabelled "Default title"; the home page's title is in `index.md`. `cloudcannon validate` passes.
- `lib/metadata.ts`: `buildMetadata` takes `fullTitle` for an absolute title.
- `next.config.ts`: comment names site pages instead of legal pages.

## Verification

- **HTML parity:** built the editing export (`pnpm build:cloudcannon`) before any change and after, and compared every exported HTML file (24: home, 404s, blog listing + 6 posts, changelog listing + 3 entries, docs 7, privacy, terms) with `<script>` tags, `<!-- -->` text separators and hashed asset names removed. All 24 identical, `<head>` included. `sitemap.xml` (ignoring `lastmod`) and `robots.txt` identical. Spot-checked the home `<title>`, the hero `<br>` markup, the `<code>` in a feature card and the blog meta description in the new build.
- `pnpm build:cloudcannon`: succeeds, 27 static pages; `/privacy` and `/terms` now come from `/[slug]`.
- `pnpm build`: succeeds, 43 pages; route table as before except `/privacy`, `/terms` are `●` under `/[slug]`.
- `pnpm typecheck` passes. `pnpm lint`: only the existing `panel-demo.tsx` error.

## Decisions and why

- **One Fumadocs collection for `content/pages/`** with a Zod union on `_schema` (Phase 2 shape): legal bodies need Fumadocs' MDX pipeline and TOC, and one loader serves every page file. Fumadocs compiles `.md` too.
- **Listing pages are excluded from `[slug]` by schema, not by name**, so a renamed or new listing file never gets a second route.
- **`site.json` feeds `siteConfig`** rather than each consumer importing JSON: many files read `siteConfig`, and none change.
- **Home `<title>` comes from `index.md`**: the page's title is edited on the page. `site.json` `title` stays the layout default for pages without one (404).
- **GitHub stats, primary CTA ("Get the code"/"Try the demo"), the GitHub card, demos, logos and illustrations stay code**, computed inside `HeroStarter`/`ClosingCta` as before (Phase 2 decision).
- **Blocks render without region wrappers** to keep the markup identical in this phase.
- **Data files listed in both `blog` and `changelog` modules**, mirroring `config/blog.ts`, so pruning one module keeps what the other reads.
- **Dates left as quoted `"YYYY-MM-DD"`**: consistent in every file; CloudCannon's date input and `z.coerce.date()` both handle them.

## Handoff to Phase 4

- `HeroStarter` and `ClosingCta` are async server components that fetch GitHub stats and read flags. To re-render in the editor they need those values computed in the route and passed as props (audit § Server and client components). All five block components are server components today.
- `Blocks` needs the `data-editable="array"` / `array-item` wrappers; expect one wrapper div per block in the HTML after that.
- `Reveal` and the slide-up animations still apply to re-rendered content (audit § 6).
- Listing intros (`/blog`, `/changelog`) and the `[slug]` legal/page-builder pages read `content/pages`; the home `index.md` drives `/`.

## Open questions

1. **Links in content after a module prune.** The `module:docs` markers on the feature cards' `/docs/modules` links are gone: the links live in `content/pages/index.md`, and `pnpm modules:prune docs` neither strips nor reports them (unquoted YAML values aren't matched by its dead-link check; JSON isn't scanned). Header/footer items for a pruned module hide themselves (unknown `feature`). Default: leave; after pruning `docs`, clear those `href`s. Alternative: extend `scripts/prune.ts` to scan `content/pages` values and `data/*.json`.
2. **Prune dead-link check reads `.cloudcannon/migration/*.md`** and reports every route these notes mention. Default: leave (notes are for the migration). Alternative: skip `.cloudcannon/` in `scripts/prune.ts`.
3. **Footer copyright line** ("© {year} {name}. Open source under the MIT license.") and the header's "Pro" link stay code; `footer.json` is a top-level array with no room for text. Default: leave. Alternative: make `footer.json` an object with `columns` and `copyright` (config change).
4. **Secondary button opens in a new tab only for `http(s)` links.** Today's "About Pro" link is external, so nothing changes. Default: keep.
