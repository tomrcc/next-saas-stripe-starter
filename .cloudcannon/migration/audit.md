# Phase 1: Audit

Site: `next-saas-stripe-starter` — Next 16.3.4 (Turbopack), React 19.2.8, App Router only, pnpm 10, Fumadocs MDX 15.4.1 (macro API), Better Auth + Stripe + Neon/Drizzle, Tailwind 4.

## Checklist

- [x] Quick checks run and recorded
- [x] §1 Router and export readiness — every blocker recorded with file, purpose, editing-build avoidance
- [x] §1 Versions, `output`, `distDir`, `trailingSlash`, `basePath`, `src/`
- [x] §1 Earlier CloudCannon setup — none
- [x] §2 Content sources, front matter, loader, MDX setup, MDX component census
- [x] §3 Pages and routing — every route
- [x] §4 Layouts and components, header/footer with auth/billing off, links to absent routes
- [x] Census table + primitive-vs-computed + front matter co-location
- [x] §5 Build pipeline
- [x] §6 Flags and special patterns
- [x] §7 Sizing evaluated (not tripped, no `plan.md`)

## User decision (already made)

The site needs a server: Better Auth, Stripe, server actions, `headers()`/`cookies()`, `/api` route handlers, the dashboard.

**Production stays as-is on a Node host. CloudCannon gets a separate static "editing build"** of the public pages (home, blog, changelog, docs, legal). Server-only routes (`app/(app)`, `app/(auth)`, `app/api/*`, `app/(marketing)/pricing`) are left out of that build only. `pnpm build` for production must keep working unchanged, so every change for the editing build is gated on the editing build.

CloudCannon is editing-only: editors save to git, production deploys from git on its own host.

## Quick checks

Run from the site root on 2026-10-22.

- **Router:** `app/` only. No `src/`, no `pages/`.
- **Pages Router blockers / `pages/api`:** none (no Pages Router).
- **Earlier CloudCannon setup:** none. No `@cloudcannon/*` or `@bookshop/*` packages, no `CloudCannonConnect`/`data-cms-bind`/`_bookshop_name`, no `.cloudcannon/prebuild|postbuild`, no `component-library/`.
- **Next config:** `next.config.ts`. Only match: `images` (`dangerouslyAllowSVG`, `contentDispositionType`, `contentSecurityPolicy`). No `output`, `distDir`, `trailingSlash`, `basePath`, `rewrites`, `redirects`, `headers`, `i18n`. Wrapped by `createMDX()` from `fumadocs-mdx/next`.
- **Middleware/proxy:** none. (The doc's `ls middleware.* proxy.* …` aborts in zsh with `no matches found`; rerun under `bash -c` printed nothing.)
- **Server-only features in `app/`:** `app/(app)/dashboard/billing/page.tsx:32` `headers()`. The same grep across `lib/`, `modules/`, `components/` finds the rest — see the blocker table.
- **Route handlers:** `app/api/search/route.ts`, `app/api/auth/[...all]/route.ts`.
- **Dynamic routes:** `app/(marketing)/blog/[slug]`, `app/(marketing)/changelog/[slug]`, `app/(docs)/docs/[[...slug]]`, `app/api/auth/[...all]`. All three page routes have `generateStaticParams`.
- **`next/image`:** `components/shared/blur-image.tsx`, `components/content/mdx-components.tsx` (registered as `Image`, unused in content), `components/dashboard/pro/pro-shot.tsx` (dashboard only).
- **Content and data files:** `content/blog/*.mdx` (6), `content/changelog/*.mdx` (3), `content/docs/*.mdx` (7) + `content/docs/meta.json`, `content/legal/*.mdx` (2). The rest are tooling (`components.json`, `drizzle/meta/*`, `.github/workflows/prune.yml`, …).
- **Content tooling grep:** no match. The site uses `fumadocs-mdx` / `fumadocs-core`, which the grep list doesn't include.
- **Fetches:** `lib/github.ts` — GitHub API (repo stars/forks), `next: { revalidate: 3600 }`, wrapped in try/catch, returns `null` on failure.

### Baseline build

`pnpm build` with no `.env*` and no service env vars (what the editing build sees): **succeeds**. Route table:

- Static `○`: `/`, `/privacy`, `/terms`, `/pricing`, `/admin`, `/admin/sentry`, several `/dashboard/*`, `/opengraph-image`, `/robots.txt`, `/sitemap.xml`
- SSG `●`: `/blog/[slug]` ×6, `/changelog/[slug]` ×3, `/docs/[[...slug]]` ×7
- Dynamic `ƒ`: **`/blog`, `/changelog`**, `/api/auth/[...all]`, `/api/search`, `/dashboard`, `/dashboard/billing`, `/dashboard/organization/general`, `/dashboard/settings/profile`, `/login`, `/register`
- `/` shows Revalidate 1h (from the GitHub fetch)

With auth/billing/admin off, `/pricing` and `/admin` prerender as `notFound()` output. Under export that writes `pricing.html` holding 404 content at a live URL, so those routes are removed from the editing build, not left to 404.

## 1. Router and export readiness

- **Next** 16.3.4, **React** 19.2.8 (≥ 18, fine for `@cloudcannon/editable-regions/react`), Turbopack is the default builder.
- **Node:** no `.nvmrc`, no `engines`. CI (`.github/workflows/prune.yml`) uses Node 22; `lib/db/index.ts` relies on Node 22's global `WebSocket`. Use Node 22 on CloudCannon.
- **`output`:** unset. Production keeps it unset; the editing build sets `output: "export"` behind its gate.
- **`distDir`:** unset → editing build writes `out/`.
- **`trailingSlash`:** unset (off). Pages export as `blog/<slug>.html`. No internal links ending in `/` outside `<Link>` (checked `content/`, `components/marketing`, `components/content`, `components/shared`).
- **`basePath`:** unset.
- **`src/`:** no.
- **`images`:** default loader with optimisation. Editing build needs `images.unoptimized: true` behind the gate; production keeps optimisation.

### Export blockers

Verified in a throwaway export app on Next 16.3.4 (deleted after):
- a page that awaits `searchParams` fails the export: ``Route / with `dynamic = "error"` couldn't be rendered statically because it used `await searchParams` ``
- a `"use server"` module imported by a client component, even one rendered only when `NODE_ENV === "development"`, fails the export: `Server Actions are not supported with static export.`
- `fetch(…, { next: { revalidate: 3600 } })` builds fine under export; the value is fetched once at build
- `notFound()` in a static page exports `<route>.html` with the 404 content

| # | File | What it does | Editing build avoids it by |
|---|------|--------------|----------------------------|
| 1 | `app/(app)/**` (layout + 12 pages) | Dashboard, admin, billing pages. `requireFeature("auth")`, `getActiveOrganization()` → `headers()`; billing page calls `headers()` directly | Prebuild removes `app/(app)` |
| 2 | `app/(auth)/**` (layout, `/login`, `/register`) | Sign-in/up; layout reads the session (`headers()`) and redirects | Prebuild removes `app/(auth)` |
| 3 | `app/api/auth/[...all]/route.ts` | Better Auth GET/POST handler; reads the request | Prebuild removes `app/api` |
| 4 | `app/api/search/route.ts` | Fumadocs search, `GET` reads the query string | Prebuild removes `app/api`. Docs search box in the editing preview then returns nothing (acceptable for editing). Fumadocs `staticGET` + `export const dynamic = "force-static"` is the static alternative if wanted |
| 5 | `app/(marketing)/pricing/page.tsx` | Pricing; `requireFeature("billing")`, `getPlanPrices()` (`unstable_cache` + Stripe API), `getBillingViewer()` (`headers()` in `modules/billing/viewer.ts`) | Prebuild removes `app/(marketing)/pricing`. With billing off it would only export a 404 page |
| 6 | `app/layout.tsx` → `components/dev/dev-toolbar.tsx` → `components/dev/modules-panel.tsx` → `lib/features/dev-actions.ts` (`"use server"`, `cookies()`) | Dev-only module panel; renders `null` outside development, but the import is in every build's module graph | **Blocks the editing build even after route removal.** Gate the import: e.g. a `turbopack.resolveAlias` (and `webpack` alias) in the gated `next.config` mapping `@/components/dev/dev-toolbar` to a stub that renders `null`. Production unchanged. Phase 2 confirms the alias applies under Turbopack |
| 7 | `app/(marketing)/blog/page.tsx` | Listing; awaits `searchParams` for `?category=` tabs and `?page=` pagination | Gate the read: in the editing build use `{}` instead of awaiting `searchParams`, so the page renders "All", page 1. Production keeps the query-string filter. (6 posts, page size 9: one page today) |
| 8 | `app/(marketing)/changelog/page.tsx` | Listing; awaits `searchParams` for `?page=` | Same gate as #7. (3 entries, page size 10: one page) |
| 9 | `app/(marketing)/layout.tsx`, `components/marketing/site-header.tsx` → `lib/auth/session.ts` `getSession()` → `headers()` | Reads the session for Google One Tap and the header's user menu | Not reached: both call it only when `auth` resolves on. Auth resolves off without `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (`config/foundation.ts`, `lib/features/resolve.ts`). Importing `lib/auth/server.ts`, `lib/db`, `lib/stripe.ts` without env vars is safe by design (placeholder secret/key, pool connects lazily) — the baseline build proves it |
| 10 | `lib/features/resolve.ts` `getDevOverrides()` → `cookies()` | Dev-only feature override cookie | Returns before `cookies()` unless `NODE_ENV === "development"` |
| 11 | `lib/github.ts` `fetch` with `next: { revalidate: 3600 }` | GitHub stars/forks on home hero and closing CTA | Builds under export (tested); counts are baked at build. Falls back to "Open source on GitHub" / no stats if GitHub is unreachable or rate-limited |
| 12 | `modules/billing/prices.ts` (`unstable_cache`), `lib/auth/server.ts` (`revalidateTag`), `modules/admin/preview*.ts` (`cookies()`, `"use server"`) | Billing/admin server logic | Only reachable from removed routes (#1, #3, #5) |

**Gating:** don't rely on missing env vars alone. If someone adds `DATABASE_URL`/`BETTER_AUTH_*` to CloudCannon, auth turns on, `getSession()` calls `headers()` and the export fails. Recommend an explicit editing-build env var (name for Phase 2, e.g. `CLOUDCANNON_EDITING_BUILD=1`) set by a separate script (e.g. `build:cloudcannon`) used as CloudCannon's build command, which:
- sets `output: "export"` and `images.unoptimized: true` in `next.config.ts`
- aliases the dev toolbar to a stub (#6)
- forces `auth`, `billing`, `admin` off in `lib/features/resolve.ts` (shared code, no module marker)
- skips `searchParams` in the two listings (#7, #8)

`.cloudcannon/prebuild` (runs on CloudCannon only) removes `app/(app)`, `app/(auth)`, `app/api`, `app/(marketing)/pricing`. `pnpm modules:prune` is not a substitute: the `auth` module lists no `files`, and pruning edits shared files.

### Earlier CloudCannon setup

None found.

## 2. Content sources

### MDX setup — Fumadocs MDX, macro API

Not in the skill's MDX setup table. How it works here:

- `next.config.ts` wraps the config with `createMDX()` from `fumadocs-mdx/next`. No `source.config.ts`, no generated `.source/` folder.
- Collections are declared in `lib/content/*.ts` with `defineCollections`/`defineDocs` from `fumadocs-mdx/macro`, each with a Zod schema extending Fumadocs' `pageSchema` (`title: string`, `description?: string`, `icon?: string`, `full?: boolean`).
- Each file exports a `loader()` source (`blogSource`, `changelogSource`, `docsSource`, `legalSource`) with a `baseUrl`. Slugs come from file paths.
- Bodies are compiled MDX components (`page.data.body`), rendered with `getMDXComponents()` (`components/content/mdx-components.tsx`): Fumadocs defaults + `Image` + `Callout`, plus per-site overrides (`createRelativeLink` in docs; `h2`, `Section` in legal).
- Headings get IDs and a `toc` from Fumadocs; code fences use Fumadocs' highlighter.
- Front matter is parsed by fumadocs-mdx; Zod `z.coerce.date()` turns quoted date strings into `Date`. Only server components read the data; client components get primitives.

### Collections

| Collection | Folder | Files | Loader | URL | Route |
|---|---|---|---|---|---|
| blog | `content/blog/*.mdx` | 6 | `lib/content/blog.ts` | `/blog/<filename>` | `app/(marketing)/blog/[slug]/page.tsx` |
| changelog | `content/changelog/*.mdx` | 3 | `lib/content/changelog.ts` | `/changelog/<filename>` (also all rendered in full on `/changelog`) | `app/(marketing)/changelog/[slug]/page.tsx` |
| docs | `content/docs/*.mdx` + `meta.json` | 7 | `lib/content/docs.ts` | `/docs/<filename>`, `index.mdx` → `/docs` | `app/(docs)/docs/[[...slug]]/page.tsx` |
| legal | `content/legal/*.mdx` | 2 | `lib/content/legal.ts` | `/<filename>` | `app/(marketing)/privacy/page.tsx`, `app/(marketing)/terms/page.tsx` (one route file per page) |

**blog** front matter (all present in every file):
- `title` string (required) — header, cards, metadata
- `description` string — header, cards, metadata
- `image` string, path under `/public` (`/_static/blog/cover-*.webp`) — cover; blur placeholder via `sharp` at build (`lib/content/blur.ts`)
- `date` quoted `"YYYY-MM-DD"` string — sort, display
- `authors` string[] (min 1), keys of `blogAuthors` in `config/blog.ts`
- `categories` string[] (default `[]`), keys of `blogCategories` (`news`, `education`)
- `related` string[] (default `[]`), slugs of other posts (first 3 shown)

**changelog** front matter: `title`, `description` (optional in schema, present in all), `image` (optional, reuses blog covers), `date` (quoted string), `author` (optional, key of `blogAuthors`).

**docs** front matter: `title`, `description`. `full` and `icon` allowed but unused. `content/docs/meta.json` `{ "pages": [...] }` orders the sidebar. A new docs page missing from `pages` won't appear in the sidebar, so editors need `meta.json` as a data file.

**legal** front matter: `title`, `description`, `updatedAt` (quoted date string, shown as "Last updated").

### MDX components in bodies

| Component | Props | Files using it | Where | Classification |
|---|---|---|---|---|
| `Callout` | `type` (`warn`, absent = info; also `info`/`warning`/`error`/`success`/`tip`/`idea` aliases), markdown children | docs: deployment 1, google-oauth 2, modules 1, stripe 1 | mid-prose | Inline/prose → snippet |
| `Cards` > `Card` | `Card`: `title`, `href` (`description`, `icon` supported, unused) | docs/index 1 (5 cards) | end | Inline navigation → snippet with nested children (repeating parser) |
| `Section` | markdown children (one `##` heading + content) | legal: privacy 12, terms 14 | wraps every `##` section | Presentational wrapper → snippet; see open question |
| `{/* … */}` MDX comment | — | legal: privacy, terms | top of body | Must survive editing; Phase 2 snippet config for comments |

Blog and changelog bodies are plain markdown + fenced code (some fences contain `export …` lines; inside fences, not MDX exports). No `import`/`export` statements in any body. No raw HTML.

### Data in code

| Data | File | Read by | Proposed |
|---|---|---|---|
| Authors (`name`, `role`, `image`, `twitter`) | `config/blog.ts` `blogAuthors` | blog listing, blog post, changelog entry | `authors` data file (shared-UI "Author card"), `slug` key; select inputs on `authors`/`author` |
| Blog categories (`title`, `description`) | `config/blog.ts` `blogCategories` | blog listing tabs, post badges | data file; select input on `categories` |
| Site name, description, title, links | `config/site.ts` | layout metadata, header, footer, OG image, closing CTA | `site` data file for name/title/description; `url` stays env-derived |
| Header links (`title`, `href`, `feature`) | `components/marketing/site-header.tsx` `links` | header | `navigation` data file; items keep a `feature` key |
| Footer columns (`title`, `links[{title, href, feature}]`) | `components/marketing/site-footer.tsx` `columns` | footer | `footer` data file, `columns[{title, links[]}]`, items keep `feature` |
| Pricing plans, comparison, FAQ | `components/marketing/pricing/*` | `/pricing` only | Leave as code (page absent from editing build) — open question |
| Dashboard nav | `config/nav.ts` | dashboard | Leave as code (server-only) |

**Module constraint (AGENTS.md):** any new data/content file used by one module must be listed in that module's `files` in `config/features.ts`, and module-specific lines in shared files need `module:<key>` markers. `scripts/prune.ts` reads markers in `.ts/.tsx/.js/.css/.md/.mdx/.yml/.yaml` and `.env.example`, **not `.json`**. So data files holding module-specific items (nav/footer links for blog/docs/changelog) should be YAML with `# module:<key>` comments. Whether CloudCannon keeps YAML comments on save needs checking in Phase 2/5.

### Fetches

`lib/github.ts` → `https://api.github.com/repos/mickasmt/next-saas-stripe-starter`, fields `stargazers_count`, `forks_count`. Live stats, not editor content; keep as a build-time fetch (no Phase 3 change).

## 3. Pages and routing

Route groups: `(marketing)`, `(docs)`, `(auth)`, `(app)` — none appear in URLs.

**In the editing build (public):**

| Route | File | Content from | Type |
|---|---|---|---|
| `/` | `app/(marketing)/page.tsx` | Hardcoded section components | static |
| `/blog` | `app/(marketing)/blog/page.tsx` | blog collection + hardcoded intro; `?category=`, `?page=` | listing (dynamic today, blocker #7) |
| `/blog/<slug>` ×6 | `app/(marketing)/blog/[slug]/page.tsx` | blog collection; params from filenames | SSG |
| `/changelog` | `app/(marketing)/changelog/page.tsx` | changelog collection + hardcoded intro; `?page=` | listing (dynamic today, blocker #8) |
| `/changelog/<slug>` ×3 | `app/(marketing)/changelog/[slug]/page.tsx` | changelog collection | SSG |
| `/docs`, `/docs/<slug>` ×7 | `app/(docs)/docs/[[...slug]]/page.tsx` + `app/(docs)/docs/layout.tsx` (Fumadocs `DocsLayout`, sidebar from page tree) | docs collection; `docsSource.generateParams()` | SSG |
| `/privacy`, `/terms` | `app/(marketing)/privacy/page.tsx`, `app/(marketing)/terms/page.tsx` → `components/marketing/legal-page.tsx` | legal collection | static |
| `/sitemap.xml` | `app/sitemap.ts` | enabled modules' pages (pricing omitted when billing off) | generated |
| `/robots.txt` | `app/robots.ts` | — | generated |
| `/opengraph-image` | `app/opengraph-image.tsx` | `siteConfig` | generated |
| 404 | Next default (no `not-found.tsx`) | — | — |

**Left out of the editing build:** `/pricing`; `/login`, `/register`; `/dashboard`, `/dashboard/billing`, `/dashboard/billing/invoices`, `/dashboard/email-templates`, `/dashboard/emails`, `/dashboard/onboarding`, `/dashboard/organization/general`, `/dashboard/organization/members`, `/dashboard/settings/profile`, `/dashboard/settings/security`, `/admin`, `/admin/sentry`; `/api/auth/*`, `/api/search`.

No intercepting routes, no parallel routes, no `not-found.tsx`, no `loading.tsx`.

## 4. Layouts and components

- **`app/layout.tsx`** — fonts (`next/font/google` Inter, Geist Mono), metadata, `ThemeProvider` (next-themes), `Toaster`, `DevToolbar` (dev only, blocker #6).
- **`app/(marketing)/layout.tsx`** — async server component. Satoshi CSS from Fontshare, `GoogleOneTap` (only with auth on and a Google client ID), `SiteHeader`, `<main>`, `SiteFooter`.
- **`app/(docs)/docs/layout.tsx`** — Fumadocs `RootProvider` + `DocsLayout`; `requireFeature("docs")`. Docs pages don't use the marketing header/footer.

### Marketing header/footer with auth and billing off

`SiteHeader` and `SiteFooter` are async server components that call `getFeatures()` and filter links by `feature`.

- **Header:** shows Logo, **Blog**, **Docs**, **Pro** (external README link). **Pricing** is hidden (billing). The right side renders **nothing**: with auth off there's no "Log in"/"Sign up" and no user menu (`!features.auth ? null`).
- **Footer:** **Product** column (Pricing, Dashboard) disappears entirely — both links gated. Resources (Blog, Changelog, Docs, GitHub) and Legal (Terms, Privacy) remain.
- **Home CTAs** (`components/marketing/starter-cta.ts`): with auth off the hero and closing CTA show **"Get the code"** → GitHub (external) instead of "Try the demo" → `/login`.
- **Blog tabs:** Changelog tab shown (changelog on).

**Links to routes absent from the editing build:** none rendered. Every link to `/pricing`, `/login`, `/register`, `/dashboard*`, `/admin` is behind an auth/billing flag that resolves off. MDX content links only to `/blog/*`, `/docs/*`, `/privacy`, `/terms`; `/api/auth/...` appears only as code text in docs.

**Consequence for editors:** the editing preview differs from production — no Pricing link, no Log in/Sign up, no Product footer column, and the hero CTA reads "Get the code". When header/footer links become data files, items for flagged modules (Pricing, Dashboard) stay in the data but don't show in the preview. Phase 2 should add a comment on the `feature` field saying so.

### Server and client components

- Server (async, read data or flags): `SiteHeader`, `SiteFooter`, `HeroStarter` (GitHub fetch + `getStarterCta`), `ClosingCta` (same), all route pages, `LegalPage`.
- Server (sync, data in module constants): `StackMarquee`, `ModulesShowcase`, `WhyModular`, `GridSection`.
- Client: `ModuleDeck`, `PanelDemo`, `OnboardingDemo`, `Reveal`, `SiteHeaderBackdrop`, `CategoryTabs`/`CategoryMenu`, `TableOfContents`, `ShareRow`, `BlurImage`, `ThemeSwitcher`, `HeaderUserMenu`.
- Providers: `ThemeProvider` (next-themes) in root; Fumadocs `RootProvider` in docs.

Phase 4: section components that re-render in the editor run in the browser and get data only from props. `HeroStarter`/`ClosingCta` read flags and fetch GitHub themselves; the GitHub stats and CTA must be computed in the route and passed as props (or kept outside the editable region).

### Section components (home)

| Component | Content now | Visual-editing candidate |
|---|---|---|
| `HeroStarter` | GitHub badge (computed), h1 + subtitle with `<br>`, primary CTA (computed by flag), "About Pro" button, `ModuleDeck` demo (code) | Yes — text, button labels |
| `StackMarquee` | caption with `<br>`; logos from `stack-logos.tsx` (SVG code) | Yes — caption; logo list stays code |
| `ModulesShowcase` | heading (eyebrow/title/description), `PanelDemo` (code), 4 feature cards (title, rich description with `<Code>`, visual component, optional "Learn more" href `/docs/modules` marked `module:docs`), 4 facts (icon, title, description) | Yes — headings, card text, facts; visuals stay code, chosen by key |
| `WhyModular` | heading, subtitle, 2 approach cards (title, points[], highlighted) | Yes |
| `ClosingCta` | heading, paragraph, CTAs, GitHub repo card (computed stats) | Yes — text; stats stay computed |

Sidebar rather than visual: navigation, footer, site settings, authors, categories, docs `meta.json`.

## Census

Pages not already in a collection.

| Page file | Distinct content sections | Layout repeated on other pages? | Editor will add similar pages? | Recommended pattern | Needs editable region? |
|---|---|---|---|---|---|
| `app/(marketing)/page.tsx` (home) | hero, stack marquee, modules showcase, why modular, closing CTA | No (sections could be reused on landing pages) | Maybe (landing pages) | Page builder — `content/pages/index.*` with `content_blocks` | Yes |
| `app/(marketing)/blog/page.tsx` (listing) | intro (h1 + description), category tabs (computed), post grid (collection) | Shares intro band with changelog | No | Pages collection file with a `listing` schema (title, description); grid stays computed | Yes — intro title, description |
| `app/(marketing)/changelog/page.tsx` (listing) | intro (h1 + description), entries (collection) | Shares intro band with blog | No | Pages collection file with the same `listing` schema | Yes — intro title, description |
| `app/(marketing)/privacy/page.tsx`, `terms/page.tsx` | title, long MDX body with `Section`s, updated date | Yes (each other) | Rarely | Already content (`content/legal`). Pages collection with a `legal` schema (markdown body + `updatedAt`), per the Next.js table — see decisions | Body only (title + body) |
| `app/(marketing)/pricing/page.tsx` | plans, comparison, FAQ, CTA | No | No | Leave as code — not in the editing build | No |
| `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` | — | — | — | Leave as code | No |
| `app/(app)/**`, `app/(auth)/**` | app UI | — | — | Leave as code — not in the editing build | No |

Collection detail routes (blog post, changelog entry, docs page) are fixed-schema collections already; they need editable regions for title, description, image and body in Phase 4.

### Primitive-vs-computed

- `app/(marketing)/page.tsx` — no values; every section computes or hard-codes its own (flags, GitHub fetch, module constants). Target: route reads the home entry and passes each block's fields as props; GitHub stats and starter CTA computed in the route, passed down.
- `blog/page.tsx` — title/description hard-coded (→ primitives from the listing file); tabs computed from categories + changelog flag (stay computed, outside regions); post cards map over the collection (computed, a listing — not editable).
- `changelog/page.tsx` — same as blog; entries render each collection body in full (not editable from here — edit the entry).
- `blog/[slug]/page.tsx` — title, description, date, image are primitives; categories → lookup in `blogCategories`; authors → lookup in `blogAuthors`; related → lookups in the collection. Lookups move to data files with `select` inputs; render stays computed.
- `changelog/[slug]/page.tsx` — primitives plus `author` lookup.
- `docs/[[...slug]]/page.tsx` — all primitives (`title`, `description`, body) through Fumadocs components.
- `LegalPage` — `title`, body primitive; section list for the TOC computed from headings; `updatedAt` formatted.

### Front matter co-location

None of the home section components take props today. Each needs reshaping to take one block object (`content_blocks[n]`) before it can re-render in the editor. Visual components inside (`ModuleDeck`, `PanelDemo`, `PruneTerminal`, `DependencyGraph`, `ConfigFile`, `ServicesCheck`, stack logos) stay code, selected by a key where a block needs to vary them.

## 5. Build pipeline

- `build`: `next build`. Nothing before or after. Fumadocs compiles MDX inside the bundler (no separate content step). Blur placeholders use `sharp` at build (allowed in `pnpm-workspace.yaml` `allowBuilds`).
- Env vars read: `NEXT_PUBLIC_APP_URL` (site URL; falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:3000`), `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID/SECRET`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `STRIPE_*` (6), `GITHUB_TOKEN` (optional, GitHub rate limit), `DEMO_MODE`, `NODE_ENV`. The editing build should set none of the service vars. `NEXT_PUBLIC_APP_URL` only affects canonical/OG URLs; optional.
- Hosting config: no `vercel.json`/`netlify.toml`. `.github/workflows/prune.yml` prunes modules and builds (no env vars) — it already proves the site builds with auth/billing off.
- Husky `pre-commit`/`commit-msg` hooks and commitlint exist; CloudCannon saves are commits, unaffected by local hooks.
- No `.cloudcannon/` hooks yet.

## 6. Flags and special patterns

- **Positional selectors:** blog listing grid uses `nth-child` for dividers — it's a collection listing, not an array region. `ModulesShowcase` feature cards use index-based classes in JS (`index > 0`, `index % 2`), which recompute on re-render; fine for an array region. `LegalSection` uses `last:` (rail stops at the last section); legal bodies aren't array regions.
- **Global DOM scripts:** none binding once. `PanelDemo` (`IntersectionObserver`, `querySelector` on its own panel) and `TableOfContents` are self-contained client components.
- **Numbers as text:** GitHub stars/forks (computed, not editable). No editable numeric stats.
- **Styled HTML in strings:** layout `<br className="hidden sm:block" />` inside hero h1/subtitle and the marquee caption; `ModulesShowcase` descriptions are JSX with inline `<Code>`. Phase 3 needs a convention (markdown inline code for `<Code>`, and a way to keep the responsive breaks, e.g. split title lines or drop them).
- **Scroll-reveal/entrance animations:** `Reveal` (IntersectionObserver, `.reveal` → `[data-revealed]`) in `ClosingCta`, `WhyModular`, `ModulesShowcase`; CSS `animate-slide-up-fade` with delays on hero and pricing; marquee `animate-infinite-scroll`. Phase 4 must make re-rendered content visible without waiting for a scroll intersection.

## 7. Sizing

- Total pages: 21 in the editing build (home, blog listing + 6, changelog listing + 3, docs 7, legal 2). 36 page routes in the whole app; the 15 server-only routes aren't migrated. Threshold >30: **ok**.
- Hardcoded → YAML conversions: 3 (home page builder, blog listing intro, changelog listing intro). Threshold >15: **ok**.
- Distinct collections: 4 (pages, blog, changelog, docs) — legal folds into pages; data files (authors, categories, site, navigation, footer, docs `meta.json`) are data, not collections. Threshold >5: **ok**.
- Tripped: 0/3. No `plan.md`.

## Decisions and why

- **Hybrid build:** production `pnpm build` untouched; CloudCannon runs a separate gated build (user decision). Gate on an explicit env var set by a dedicated script, not on missing service env vars alone, so adding a database URL to CloudCannon can't break the export.
- **Route removal in `.cloudcannon/prebuild`:** `app/(app)`, `app/(auth)`, `app/api`, `app/(marketing)/pricing`. Removing them beats letting flags `notFound()` them: export would write 404 HTML at `/pricing`, `/admin` etc. and still trip on dynamic routes (`/login`, `/dashboard`). `modules:prune` doesn't cover auth and edits shared files.
- **Dev toolbar alias:** the root layout's dev-only import chain contains a server action, which fails any export. Alias it to a stub in the gated config, not by editing the root layout for both builds.
- **Listings render unfiltered in the editing build:** gate the `searchParams` read in `/blog` and `/changelog`; production keeps query-string filtering and pagination.
- **Docs search:** dropped in the editing build (route removed); editors don't need it.
- **GitHub fetch:** kept; it builds under export and falls back when offline.
- **`images.unoptimized`** only in the editing build.
- **Home → page builder** (`content/pages/index.*`, `content_blocks`): five distinct sections, project owns the templates, sections could build landing pages. Visual demos stay code inside blocks.
- **Listing intros → `pages` collection files with a `listing` schema**, read by the existing `/blog` and `/changelog` routes (not by a `[slug]` catch-all). Each file belongs to its module, so add it to that module's `files` in `config/features.ts`.
- **Legal → `pages` collection, `legal` schema** (markdown body + `updatedAt`), rendered by a top-level `[slug]` route that also serves future page-builder pages. One `pages` collection, multiple schemas, per the skill. The two per-page route files go.
- **Blog, changelog, docs stay fixed-schema collections** in place; Fumadocs loaders keep reading them.
- **Authors and categories → data files** (shared-UI author card); front matter keys become `select` inputs.
- **Navigation and footer → data files**, items keep a `feature` key; YAML so `# module:<key>` markers work with `scripts/prune.ts`.
- **Snippets (Phase 2):** `Callout`, `Cards`/`Card`, `Section`, and the MDX comment block.
- **Pricing content stays code** — the page isn't in the editing build, so editors couldn't preview it.
- **Node 22** on CloudCannon (CI and `lib/db` need it).

## Open questions

1. **Pricing content editable?** Plans, comparison and FAQ live in `components/marketing/pricing/data.ts` and the page isn't in the editing build. Default: leave as code. Alternative: a data file editors change in the data editor without a preview.
2. **Legal `<Section>` wrappers:** every `##` in privacy/terms is wrapped in `<Section>` (12 and 14 times). Default: keep them as a snippet. Alternative: wrap sections automatically in `LegalPage` (rehype/remark) and drop `<Section>` from the files, so editors write plain markdown. Changes content files — user's call.
3. **Legal into `pages`:** default moves `content/legal` into the `pages` collection with a `legal` schema. Alternative: keep `content/legal` as its own collection and keep one route file per page (editors can't add a legal page without a developer).
4. **Home starter content:** `app/(marketing)/page.tsx` has a TODO saying these sections present the starter and should be replaced after cloning. Default: migrate them as they are, as blocks.
5. **Responsive `<br>` in headings:** default: split headings into lines in the block data and keep the break in the component. Alternative: drop the breaks.
6. **Editing-build env var name and script name:** default `CLOUDCANNON_EDITING_BUILD=1` and `build:cloudcannon`; Phase 2 may rename.
