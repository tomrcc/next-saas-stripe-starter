# Phase 2: Configuration

Site: `next-saas-stripe-starter` (Next 16.3.4, App Router, Fumadocs MDX macro API). Follows `audit.md` and the user's decisions: production unchanged on a Node host, CloudCannon builds a separate static editing build; legal `<Section>` stays a snippet; home sections become page-builder blocks as they are; pricing stays code; other audit questions take their defaults.

## Checklist

Shared (`cloudcannon-configuration/configuration.md`):

- [x] Structures: four rules pass (field completeness is for Phase 3 content to meet; every array/object input is linked by full path; every value has `preview` + `picker_preview`; nested objects have `type: object` + preview icon)
- [x] `npx @cloudcannon/cli validate` passes (config, 5 structure-value files, initial site settings)
- [x] `cloudcannon.config.yml` exists, valid YAML, no `source`, no anchors (grep clean)
- [x] Build settings nested under `build` in `.cloudcannon/initial-site-settings.json`
- [x] The build command alone produces the complete output (`pnpm build:cloudcannon` → `out/`)
- [x] `.cloudcannon/README.md` written
- [x] `collections_config` entry for every audit collection: `pages` (incl. legal), `blog`, `changelog`, `docs`, `data`
- [x] No defunct keys; no collection over `app/`, `components/`, `drizzle/`
- [x] No single-file collection (legal folds into `pages`; `meta.json` goes in `data`)
- [x] `collection_groups`: Pages / Content / Site
- [x] Every page collection has a `url` with the right trailing slash; `data` has `disable_url: true`
- [x] Computed URL = built path for every existing file (6 blog, 3 changelog, 7 docs) and for every planned `pages` file (`/`, `/blog/`, `/changelog/`, `/privacy/`, `/terms/`), against `out/**/index.html`
- [x] Index pages with different fields have their own schema (`listing`)
- [x] Explicit `_inputs` for every field; dates `type: date`; images `type: image`; `_schema` hidden
- [x] Every select/multiselect has options (`data.authors`, `data.categories`, `collections.blog`, `collections.docs`, `_select_data.features`, `_select_data.lucide_icons`, inline lists)
- [x] Enum-like keys in structure values (`icon`, `eyebrow_icon`, `visual`, `feature`, `type`) have inputs on the value itself
- [x] `paths.static: public`, `paths.uploads: public/_static/blog` (where covers live; avatars upload to `public/_static/avatars` via the input's `options.paths`)
- [x] `_enabled_editors` visual first on page collections; `data` only on the data collection
- [x] `markdown.options.table: true` (tables in docs/deployment, docs/modules, legal/privacy); `escape_snippets_in_code_blocks: true`
- [x] Every `type: markdown` has its own `options`
- [x] `add_options` limit Add to page builder + legal (pages), one option each elsewhere; `new_preview_url` on creatable `pages` schemas, `editor: content` on blog/changelog/docs adds
- [x] Every `_schema` value used (`page_builder`, `listing`, `legal`) is a key under `pages.schemas`
- [x] Page builder schema exists (5 block types, split co-located structure files)
- [x] Responsive `<br>` handled: heading lines are arrays (`title_lines`, `subtitle_lines`, `caption_lines`)

Next.js (`cloudcannon-configuration/nextjs/configuration.md`):

- [x] `"ssg": "nextjs"`, `output_path: out`, no `next export`
- [x] `next.config.ts` sets `output: "export"` and `images.unoptimized`, gated on the editing build
- [x] Every data file a template reads is JSON (Phase 3 creates them; shapes below)

Snippets (`cloudcannon-snippets`):

- [x] Every component tag in content has a `_snippets` entry: `Callout`, `Cards`/`Card` (one raw snippet, `repeating`), `Section`; plus `{/* */}` comments
- [x] `snippet: true` in `_editables.content`; `picker_preview` uses literals
- [ ] Round-trip of each snippet in the Content Editor — Phase 5 (needs CloudCannon)

## Editing build (implemented and tested)

- `scripts/build-cloudcannon.js` (`pnpm build:cloudcannon`): moves `app/(app)`, `app/(auth)`, `app/api`, `app/(marketing)/pricing` into gitignored `.editing-build/`, runs `next build` with `CLOUDCANNON_EDITING_BUILD=1`, moves them back in `finally`; on start it restores anything a killed run left behind. Plain JS so it runs on any Node 22 minor (no type stripping needed).
- `next.config.ts`: under the env var, `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`, and a Turbopack alias from `@/components/dev/dev-toolbar` to `components/dev/dev-toolbar-stub.tsx` (returns `null`). Alias confirmed to apply under Turbopack: the export no longer hits the server-action error.
- `lib/editing-build.ts` exports `isEditingBuild`. Used by `lib/features/resolve.ts` (forces `auth` off, so `billing` and `admin` follow through `dependsOn`, even if CloudCannon gets DB/auth env vars) and the `/blog` and `/changelog` pages (skip `searchParams`: "All", page 1).
- `app/opengraph-image.tsx`, `app/robots.ts`, `app/sitemap.ts`: `export const dynamic = "force-static"`. Export requires it; production already prerendered them as static, route table unchanged.
- `.gitignore`: `/.editing-build/`, `.cloudcannon/migration/*.schema.json`.

Results:

- `pnpm build:cloudcannon`: succeeds, 27 static pages; `out/` has `index.html` plus `blog/`, `changelog/`, `docs/` (incl. `docs/index.html`), `privacy/`, `terms/` folder pages, `robots.txt`, `sitemap.xml`, `opengraph-image`. Home shows "Get the code", no Log in. `git status` shows no route folder changes afterwards (also after a run that failed mid-build).
- `pnpm build` (no env vars): succeeds, 43 pages, same route table as the audit baseline (`/blog`, `/changelog` still `ƒ`, `/pricing` `○`).
- `pnpm typecheck` passes. `pnpm lint` reports 1 error in `components/marketing/panel-demo.tsx` (untouched, pre-existing).

## Files

Created: `cloudcannon.config.yml`, `.cloudcannon/initial-site-settings.json`, `.cloudcannon/README.md`, `.cloudcannon/schemas/{page-builder.md, listing.md, legal.mdx, blog-post.mdx, changelog-entry.mdx, docs-page.mdx}`, `components/marketing/{hero, stack-marquee, modules-showcase, why-modular, closing-cta}.cloudcannon.structure-value.yml`, `scripts/build-cloudcannon.js`, `lib/editing-build.ts`, `components/dev/dev-toolbar-stub.tsx`.

Changed: `next.config.ts`, `package.json` (`build:cloudcannon`), `lib/features/resolve.ts`, `app/(marketing)/blog/page.tsx`, `app/(marketing)/changelog/page.tsx`, `app/opengraph-image.tsx`, `app/robots.ts`, `app/sitemap.ts`, `.gitignore`.

No content files moved or changed.

## For Phase 3: what the config expects

### `content/pages/` (collection `pages`, `url: /[slug]/`)

Every file sets `_schema`. The loader can discriminate on it.

- `index.md` — `_schema: page_builder`, `title`, `description`, `content_blocks` (the five blocks below, in today's order). Read by `app/(marketing)/page.tsx`. Values for `title`/`description` from `siteConfig.title`/`description`.
- `blog.md`, `changelog.md` — `_schema: listing`, `title` (h1), `description` (intro paragraph), `meta_description` (today's `buildMetadata` description; differs from the intro on `/blog`). Read by the existing listing routes. Add each to its module's `files` (`blog`, `changelog`) in `config/features.ts`.
- `privacy.mdx`, `terms.mdx` — moved from `content/legal/`, `_schema: legal`, `title`, `description`, `updatedAt`, body unchanged (keep `<Section>` and the `{/* */}` note). Rendered by a new `app/(marketing)/[slug]/page.tsx` that also renders `page_builder` pages; it leaves out `index`, `blog`, `changelog`. Delete `app/(marketing)/privacy` and `terms` and `lib/content/legal.ts`; point `sitemap.ts` and links at the new source.
- `[slug]` route needs `generateStaticParams` returning at least one page (it will: privacy, terms).

New file `create.path` is `{title|slugify}.[ext]`; `[ext]` comes from the schema file (`.md` page builder, `.mdx` legal).

### Block data (`content_blocks[]`, discriminator `_type`, keys = `blockMap` keys)

- `hero`: `title_lines: [One starter., Any project.]`, `subtitle_lines: [A modular Next.js foundation., Begin with a blog, end up with a SaaS.]`, `secondary_button: {label: About Pro, href: <siteConfig.links.pro>}`. Primary CTA and GitHub badge stay computed in the route and passed as props.
- `stack-marquee`: `caption_lines: [Built on a modern,, production-ready stack]`. Logos stay code.
- `modules-showcase`: `eyebrow_icon: layout-grid`, `eyebrow`, `title`, `description`, `features[]` `{title, description (markdown, inline code as backticks), visual (prune_terminal | dependency_graph | config_file | services_check), href, link_label: Learn more}`, `facts[]` `{icon (scale | braces | bot | zap), title, description}`. `overflows` is derived from `visual` in code (only `prune_terminal`), not data. The fourth feature has no link: `href:` empty. Panel demo stays code.
- `why-modular`: `title`, `description`, `approaches[]` `{title, points: [..], highlighted}`.
- `closing-cta`: `title`, `description`, `secondary_button {label, href}`. Primary CTA and repo card stay computed.

Join `title_lines` etc. with `<br className="hidden sm:block" />` plus a space. Lucide icon keys: the component maps exactly the ids in `_select_data.lucide_icons`.

### Data files (`data/`, JSON, collection `data`, all in `data_config`)

- `data/authors.json` — top-level array `[{slug, name, role, image, twitter}]` from `blogAuthors`. Add to `blog` and `changelog` `files`.
- `data/categories.json` — `[{slug, title, description}]` from `blogCategories`. Add to `blog` `files`.
- `data/site.json` — `{name, title, description}` from `siteConfig`; `url` and `links` stay in `config/site.ts`.
- `data/navigation.json` — `[{title, href, external, feature}]`: Pricing (`/pricing`, `billing`), Blog (`blog`), Docs (`docs`); `external: false`, `feature` null where none.
- `data/footer.json` — `[{title, links: [{title, href, feature}]}]`: Product, Resources, Legal as today.
- `content/docs/meta.json` stays where it is; it is edited through the `data` collection.

`config/blog.ts` and the header/footer constants read these files. `prune.ts` can't strip markers from JSON; a pruned module's `feature` key no longer resolves, so the existing `!link.feature || features[link.feature]` filter hides the item, and the prune's link check reports it.

### Zod schemas

CloudCannon writes `null` for cleared fields and new files start with empty keys. Make optional front matter fields `.nullish()` (changelog `image`, `author`; every `description` from `pageSchema`; page-builder block fields) and guard on value. Blog `image` and `authors` are `required` inputs, so they stay required in Zod.

## Decisions and why

- **Route exclusion in a build script, not `.cloudcannon/prebuild`:** the skill forbids hook files (CloudCannon-only steps). The script restores the folders, so a local run leaves the tree clean.
- **Gate on `CLOUDCANNON_EDITING_BUILD=1` set by the script** (audit default name), not on missing service env vars. Forcing only `auth` off is enough: `billing` and `admin` depend on it, and naming `admin` in shared code would need a module marker.
- **`trailingSlash: true` in the editing build only:** `content/docs/index.mdx` builds at `/docs`, and no URL template gives `/docs` for the index and `/docs/<slug>` for the rest; `/docs/` would 404 with `trailingSlash` off. With folders per page every collection URL ends in `/` and matches. Production keeps its URLs. `<Link>` hrefs adapt; markdown links without a slash rely on the host redirecting to the folder.
- **Dev toolbar via Turbopack alias** (audit decision); no webpack alias because the script always runs Turbopack `next build`.
- **`force-static` on the three metadata routes:** required by export; no production change.
- **Data files are JSON in `data/`**, not YAML with `# module:` markers as the audit proposed: the Next.js skill writes new data files as JSON, and CloudCannon drops comments when it saves a file, so markers in an edited YAML file would vanish on the first save.
- **One `data` collection at the repo root with a two-pattern glob** so `content/docs/meta.json` (which Fumadocs needs in place) sits beside the `data/` files without a single-file collection. The `docs` collection's `*.mdx` glob leaves `meta.json` to it.
- **Every `pages` file sets `_schema`; no `default` schema:** three shapes in one Fumadocs collection; an explicit key lets the Zod union discriminate.
- **Listing schema has `meta_description`:** keeps `/blog`'s search description, which differs from its intro text.
- **Heading lines as arrays** (audit default for `<br>`).
- **Primary CTA, GitHub badge/card, demos and logos stay computed/code:** flag- and fetch-dependent, or design.
- **Page-builder structures co-located in `components/marketing/`** next to the section components they describe; `_type` values match the file prefixes (kebab-case).
- **Icons and illustrations are `_select_data`/inline selects without `allow_create`:** each value needs a code mapping.
- **Uploads go to `public/_static/blog`** (where covers already live; blog and changelog both list it); avatars to `public/_static/avatars`.
- **`timezone: Etc/UTC`:** the site sets none; dates are date-only.
- **`node_version: "22"`**, install `pnpm i` (CLI baseline).
- **`markdown.engine: commonmark` with `gfm`, `table`, `strikethrough`**: content uses GFM tables.

## Open questions

1. **Timezone:** the site sets none; default `Etc/UTC`. Give an IANA zone if editors work in one.
2. **Primary CTA labels** ("Try the demo"/"Get the code") and the GitHub badge/card text stay code. Default: leave as code. Alternative: label fields in `site.json`.
3. **Markdown links without a trailing slash** (`/docs/stripe`, `/terms` in MDX bodies) in the editing preview depend on CloudCannon Hosting redirecting to `/docs/stripe/`. Default: leave links as they are; check in Phase 5.
4. **pnpm on CloudCannon:** `package.json` has no `packageManager`; the build image's pnpm version may differ from local 10.11. Default: none set; add `"packageManager": "pnpm@10.11.0"` if the first CloudCannon build fails on install.
5. **MDX comment snippet** round-trip is untested. Default: keep it; Phase 5 confirms on the legal pages.
6. **Docs search** has no results in the editing preview (route removed). Default: accept.
