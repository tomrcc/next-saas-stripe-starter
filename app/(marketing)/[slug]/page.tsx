import { notFound } from "next/navigation"

import { getBlockExtras } from "@/components/marketing/block-extras"
import { Blocks } from "@/components/marketing/blocks"
import { getLegalMetadata, LegalPage } from "@/components/marketing/legal-page"
import { isSchema, pagesSource } from "@/lib/content/pages"
import { buildMetadata } from "@/lib/metadata"

// Every page in content/pages except the home page and the listing intros,
// which their own routes read.

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

function getPage(slug: string) {
  const page = pagesSource.getPage([slug])
  if (!page || page.slugs.length !== 1 || isSchema(page, "listing")) {
    notFound()
  }
  return page
}

export default async function SitePage({ params }: Props) {
  const page = getPage((await params).slug)
  if (isSchema(page, "legal")) return <LegalPage page={page} />
  if (isSchema(page, "page_builder")) {
    return (
      <Blocks
        blocks={page.data.content_blocks}
        extras={await getBlockExtras()}
      />
    )
  }
  notFound()
}

export function generateStaticParams() {
  return pagesSource
    .getPages()
    .filter((page) => page.slugs.length === 1 && !isSchema(page, "listing"))
    .map((page) => ({ slug: page.slugs[0] }))
}

export async function generateMetadata({ params }: Props) {
  const page = getPage((await params).slug)
  if (isSchema(page, "legal")) return getLegalMetadata(page)

  return buildMetadata({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
  })
}
