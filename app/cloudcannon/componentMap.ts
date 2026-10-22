import type { ComponentType } from "react"

import { PostAuthors } from "@/components/content/post-authors" // module:blog,changelog
import { PostCategories } from "@/components/content/post-categories" // module:blog
import { ClosingCta } from "@/components/marketing/closing-cta"
import { HeroStarter } from "@/components/marketing/hero-starter"
import { ModulesShowcase } from "@/components/marketing/modules-showcase"
import { StackMarquee } from "@/components/marketing/stack-marquee"
import { WhyModular } from "@/components/marketing/why-modular"

// Each component types its own props; content arrives untyped.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>

// Keys are the `_type` values in content_blocks, and the prefixes of the
// *.cloudcannon.structure-value.yml files beside each component.
export const blockMap: Record<string, AnyComponent> = {
  hero: HeroStarter,
  "stack-marquee": StackMarquee,
  "modules-showcase": ModulesShowcase,
  "why-modular": WhyModular,
  "closing-cta": ClosingCta,
}

// Every component a `data-component` names. Each must render from its props
// alone: the Visual Editor re-renders it in the browser.
export const componentMap: Record<string, AnyComponent> = {
  ...blockMap,
  "post-categories": PostCategories, // module:blog
  "post-authors": PostAuthors, // module:blog,changelog
}
