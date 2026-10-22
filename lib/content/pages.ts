import { loader } from "fumadocs-core/source"
import { defineCollections } from "fumadocs-mdx/macro"
import { z } from "zod"

import { optionalString, pageFields } from "@/lib/content/schema"

// Site pages, one schema each by `_schema`: the home page builder
// (index.md), listing intros read by their own routes (blog.md,
// changelog.md) and legal pages.
const pages = defineCollections({
  type: "doc",
  dir: "content/pages",
  schema: z.discriminatedUnion("_schema", [
    pageFields.extend({
      _schema: z.literal("page_builder"),
      // Each block's fields are typed by its component in components/marketing.
      content_blocks: z.array(z.looseObject({ _type: z.string() })),
    }),
    pageFields.extend({
      _schema: z.literal("listing"),
      meta_description: optionalString,
    }),
    // Each `## heading` becomes a numbered section (see LegalPage).
    pageFields.extend({
      _schema: z.literal("legal"),
      updatedAt: z.coerce.date(),
    }),
  ]),
})

export const pagesSource = loader({
  baseUrl: "/",
  source: pages.toFumadocsSource(),
})

type SitePage = NonNullable<ReturnType<typeof pagesSource.getPage>>
type PageSchema = SitePage["data"]["_schema"]

export type SitePageOf<Schema extends PageSchema> = SitePage & {
  data: Extract<SitePage["data"], { _schema: Schema }>
}

export function isSchema<Schema extends PageSchema>(
  page: SitePage,
  schema: Schema
): page is SitePageOf<Schema> {
  return page.data._schema === schema
}

// Throws on a missing file or another `_schema`, so either fails the build.
export function getSitePage<Schema extends PageSchema>(
  slug: string,
  schema: Schema
): SitePageOf<Schema> {
  const page = pagesSource.getPage(slug === "index" ? [] : [slug])
  if (!page) throw new Error(`Missing content/pages/${slug}`)
  if (!isSchema(page, schema)) {
    throw new Error(`content/pages/${slug} must use _schema: ${schema}`)
  }
  return page
}
