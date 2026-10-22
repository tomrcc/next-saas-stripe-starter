# Phase 5: Build and test

Site: `next-saas-stripe-starter` (Next 16.3.4, App Router, pnpm 10.11, Fumadocs MDX). Production `pnpm build` stays a server build for a Node host; CloudCannon runs `pnpm build:cloudcannon`, a static export of the public pages to `out/`. Local Node 24.20, CloudCannon set to Node 22.

## Checklist

`build.md`:

- [x] Full build: `.next/` and `out/` deleted before each build; both builds run through their package scripts
- [x] Regions in the output (counts below; home and a content page spot-checked)
- [x] `npx @cloudcannon/cli validate` passes (config, 5 structure-value files, initial site settings)
- [x] Collection URLs match the build: all 21 files with a `url` (5 pages, 6 blog, 3 changelog, 7 docs) have `out/<url>index.html`
- [x] Schema keys resolve: `_schema` values (`page_builder`, `listing`, `legal`) and `add_options[].schema` are keys under `pages.schemas`; blog, changelog, docs use `default`
- [x] Search index: none (docs search route is left out of the editing build)
- [x] Schema round-trip: no file lacks a schema key (key diff of all 21 files against their schema files), so the current build is already the filled build. Cleared values: `optionalString` reads `null` as absent; dates have `instance_value: NOW`
- [ ] Hand off: CloudCannon-side checks below, for the user

`nextjs/build.md`:

- [x] Export settings: `output: "export"`, `images.unoptimized`, `trailingSlash: true`, gated on `CLOUDCANNON_EDITING_BUILD=1`; no `rewrites`/`redirects`/`headers`
- [x] Clean build
- [x] Every page in the output: every audit route for the editing build has an HTML file; `/pricing/`, `/login/` absent as intended
- [x] Region counts (grep over HTML only)
- [x] Images load: every `<img src>` is a file under `out/`; author avatars exist under `out/_static/avatars/`
- [x] Base path: none
- [x] Build settings: `build_command` `pnpm build:cloudcannon`, `install_command` `pnpm i`, `output_path` `out`, `node_version` `"22"`, `preserved_paths` `node_modules/,.next/`

Also requested for this run:

- [x] `pnpm install --frozen-lockfile`: lockfile matches `package.json`
- [x] `pnpm typecheck` passes
- [x] `pnpm lint`: one error, `components/marketing/panel-demo.tsx:192` (`react-hooks/set-state-in-effect`). Pre-existing: the file and `eslint.config.mjs` equal `HEAD`, and linting `git show HEAD:components/marketing/panel-demo.tsx` gives the same error
- [x] `pnpm modules:prune <module>` dry runs for `auth`, `billing`, `admin`, `docs`, `blog`, `changelog`: no errors; nothing applied
- [x] `out/` served locally (`python3 -m http.server`): every internal `href` in the export returns 200, or 301 to its trailing-slash folder
- [x] `git status`: only migration changes; nothing left in `.editing-build/`; no temp files

## Results

- `pnpm build` (production, no env vars): succeeds, 43 pages. Route table as the audit baseline, with `/privacy` and `/terms` as `●` under `/[slug]` (Phase 3).
- `pnpm build:cloudcannon`: succeeds, 27 pages. `out/` has `index.html`, `blog/` (listing + 6), `changelog/` (listing + 3), `docs/` (index + 6), `privacy/`, `terms/`, `404.html`, `robots.txt`, `sitemap.xml`, `opengraph-image`. Server route folders are back in `app/` afterwards.
- Region counts across `out/`: 167 `text`, 27 `array-item`, 9 `array`, 15 `component`, 9 `image`, 24 `_dynamic` (one root per page). Home: 34 `text`, 9 `array`, 27 `array-item`, 23 `<editable-text>`. Blog post: 10 `text`, 2 `component`, 1 `image`. Matches `visual-editing.md`.
- Spot-checked pages (`/`, `/blog/`, `/changelog/`, `/docs/`, `/docs/stripe/`, `/privacy/`, a blog post): correct `<title>` and `h1`; `/blog/` lists all 6 posts.
- Links without a trailing slash (configuration.md open question 3): four, all from markdown links in bodies: `/terms` (privacy), `/privacy` (terms), `/blog/stripe-billing-from-checkout-to-webhooks` (organizations-and-roles), `/blog/feature-flags-you-can-prune` (rebuilding-the-starter-as-modules). Docs body links already end in `/` (Fumadocs renders them through `<Link>`). A static server redirects each to its folder; CloudCannon Hosting's behaviour is check 9 below.

## Fixes made

- `cloudcannon.config.yml`: legal schema `new_preview_url` `/privacy` → `/privacy/`, the built path under `trailingSlash: true`. Validate passes.
- `.cloudcannon/migration/audit.md`, `content.md`, `visual-editing.md`: three lines quoted the docs and blog markers with their `//` comment prefix. `scripts/prune.ts` reads a prefixed marker in an `.md` file as real, so pruning `docs` or `blog` would have deleted those note lines. Each now quotes the marker without the prefix; the dry runs no longer list the notes under Edit. Quote markers that way in any note.

- `cloudcannon.config.yml`, `config/features.ts`: module markers and file lists (see Decisions).

## CloudCannon-side checks (for the user)

Run after the first CloudCannon build of this branch. Answer each with yes/no or the one line asked for.

1. On the Site Dashboard, **Builds** tab: did the latest build succeed? If not, paste the last 30 lines of its build output.
2. Site Settings → **Build configuration**: does **Build Command** read `pnpm build:cloudcannon`?
3. Site Settings → **Build configuration**: does **Output Path** read `out`?
4. Open `content/pages/index.md` in the **Visual Editor** and click the headline "One starter.": can you type into it?
5. Same page: do the sections (hero, stack marquee, modules showcase, why modular, closing CTA) each show controls to add, move and remove a section?
6. Open `content/blog/organizations-and-roles.mdx` in the **Visual Editor** and click the cover image: does the image picker open?
7. Same page: edit one word in the body, click **Save**, then **Save selected**. Paste the list of files in the resulting commit.
8. On any marketing page in the **Visual Editor**, edit the site name in the header and save. Paste the list of files in the resulting commit (expected: `data/site.json` only).
9. On the Testing Domain, open `/privacy` (no trailing slash). Does the Privacy Policy page load?
10. Open `content/pages/privacy.mdx` in the **Content Editor**: do the `<Section>` blocks and the opening `{/* */}` note show as snippets rather than raw text?
11. Same file: change one word inside a section, save, and paste the commit's diff line count (`+N -N`). Expected: one line changed.
12. Open `data/navigation.json` in the **Data Editor**, change the "Blog" title and save. After the build, does the header show the new title?

## Decisions and why

- **Both builds kept as they are.** Production `pnpm build` is unchanged for the Node host; CloudCannon runs the editing build. `nextjs/build.md` says `build_command` is `npm run build`; this site's split was the user's decision (audit), so `pnpm build:cloudcannon` stays.
- **`node_version: "22"` kept.** No `.nvmrc`, `.node-version` or `engines.node`; CI (`.github/workflows/prune.yml`) runs Node 22, and the editing build script needs Node 20.11+ for `import.meta.dirname`.
- **Schema round-trip without a scratch build.** No content file lacks a schema key, so a filled copy equals the current build.
- **Lint error left.** It is in the original commit and outside the migration.
- **Downloaded schema JSON files kept.** `.cloudcannon/migration/*.schema.json` are gitignored, as `cloudcannon-configuration/json-schemas.md` requires; later edits to the config can query them.
- **CloudCannon config follows the module system** (AGENTS.md). In `cloudcannon.config.yml`, `# module:<key>` markers (single-line or `start`/`end`) cover each module-only part: the `blog`, `changelog`, `docs` collections and their `collection_groups` entries, the `listing` schema, `content/docs/meta.json` in the `data` glob and its `file_config`, `data_config`/`file_config`/`_structures` for `authors` and `categories`, `pro_cta`, `paths.uploads`, the `callout` and `cards` snippets (docs content only), and each module's option in `_select_data.features`. Shared parts use `blog,changelog`. `config/features.ts` lists `.cloudcannon/schemas/docs-page.mdx` (docs), `blog-post.mdx` (blog), `changelog-entry.mdx` (changelog), and `listing.md`, `data/pro-cta.json`, `components/content/pro-cta-card.tsx` under both blog and changelog. The card reads the JSON, so the two go together. Checked: all six prune dry runs list the config and schema files as expected; the config as each prune would leave it (auth, billing, admin, docs, blog, changelog, blog+changelog, all three content modules) passes `cloudcannon validate --stdin` with no references to pruned collections, data or structures; both builds pass.
- **Trailing-slash body links left as written** (configuration.md default) until check 9 answers.

## Open questions

1. **Links without a trailing slash** in four MDX bodies (listed in Results). Default: leave them. If check 9 is no, add the slash to those four links; production serves both forms.
2. **pnpm version on CloudCannon** (configuration.md open question 4). Default: none set; check 1 shows whether install works.
3. **Docs search** has no results in the editing preview (route left out). Default: accept.
