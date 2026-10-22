// TODO: after cloning, replace these sections with your own landing page. They
// present the starter itself, not your product. Edit them in
// content/pages/index.md; once no page uses a block, you can delete its
// component (hero-starter.tsx, module-deck.tsx, stack-marquee.tsx,
// stack-logos.tsx, modules-showcase.tsx, panel-demo.tsx, why-modular.tsx,
// closing-cta.tsx), its structure file and its blockMap entry.
import { getBlockExtras } from "@/components/marketing/block-extras"
import { Blocks } from "@/components/marketing/blocks"
import { getSitePage } from "@/lib/content/pages"
import { buildMetadata } from "@/lib/metadata"

export function generateMetadata() {
  const { data } = getSitePage("index", "page_builder")
  return buildMetadata({
    fullTitle: data.title,
    description: data.description,
    path: "/",
  })
}

export default async function HomePage() {
  const { data } = getSitePage("index", "page_builder")
  return <Blocks blocks={data.content_blocks} extras={await getBlockExtras()} />
}
