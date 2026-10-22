import { loader } from "fumadocs-core/source"
import { defineCollections } from "fumadocs-mdx/macro"
import { z } from "zod"

import { optionalString, pageFields } from "@/lib/content/schema"

// Every entry is rendered in full on /changelog, newest first, and also gets
// its own permalink at /changelog/[slug] (see that route for the single-entry
// page with the author/share row).
const changelog = defineCollections({
  type: "doc",
  dir: "content/changelog",
  schema: pageFields.extend({
    date: z.coerce.date(),
    image: optionalString,
    // Key of config/blog.ts's authors.
    author: optionalString,
  }),
})

export const changelogSource = loader({
  baseUrl: "/changelog",
  source: changelog.toFumadocsSource(),
})
