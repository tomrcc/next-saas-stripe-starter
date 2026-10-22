import { loader } from "fumadocs-core/source"
import { defineDocs } from "fumadocs-mdx/macro"

import { pageFields } from "@/lib/content/schema"

const docs = defineDocs({
  dir: "content/docs",
  docs: { schema: pageFields },
})

export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
})
