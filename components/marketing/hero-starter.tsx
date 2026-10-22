import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { GridSection } from "@/components/marketing/grid-section"
import { Lines } from "@/components/marketing/lines"
import { ModuleDeck } from "@/components/marketing/module-deck"
import {
  SecondaryButton,
  type ButtonContent,
} from "@/components/marketing/secondary-button"
import type { StarterCta } from "@/components/marketing/starter-cta"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import type { GithubRepo } from "@/lib/github"
import { cn } from "@/lib/utils"

export type HeroBlock = {
  title_lines?: string[] | null
  subtitle_lines?: string[] | null
  secondary_button?: ButtonContent | null
  // From the route (block extras), not content.
  github?: GithubRepo | null
  cta?: StarterCta | null
}

export function HeroStarter({
  title_lines,
  subtitle_lines,
  secondary_button,
  github,
  cta,
}: HeroBlock) {
  const stars = github?.stars
    ? new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(github.stars)
    : null

  return (
    <GridSection
      lines
      innerClassName="pt-16 pb-8"
      background={
        // Wash rising with the grid, between the rails only. Same colors as
        // the closing CTA's wash for a consistent hue across the page.
        <div className="absolute top-0 -left-1/4 h-full w-[150%] opacity-15 dark:opacity-25">
          <div className="size-full bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#d946ef)] mask-[linear-gradient(transparent_25%,black)]" />
        </div>
      }
    >
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="group flex animate-slide-up-fade divide-neutral-300 rounded-full border border-neutral-300 bg-background text-xs font-medium drop-shadow-sm transition-colors hover:bg-muted motion-reduce:animate-none sm:divide-x dark:divide-border dark:border-border"
        >
          <span className="py-1.5 pl-4 sm:pr-2.5">
            {stars ? `${stars} stars on GitHub` : "Open source on GitHub"}
          </span>
          <span className="flex items-center gap-1.5 p-1.5 pl-2.5 text-muted-foreground">
            <span className="hidden sm:block">Star us</span>
            <span className="rounded-full bg-muted p-0.5">
              <ArrowUpRight className="size-2.5 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
            </span>
          </span>
        </a>

        <h1
          data-editable="array"
          data-prop="title_lines"
          className="mt-5 animate-slide-up-fade font-display text-4xl font-medium text-balance [--offset:20px] [animation-delay:100ms] motion-reduce:animate-none sm:text-5xl sm:leading-[1.15]"
        >
          <Lines lines={title_lines} />
        </h1>

        <p
          data-editable="array"
          data-prop="subtitle_lines"
          className="mt-5 animate-slide-up-fade text-base text-balance text-muted-foreground [animation-delay:200ms] motion-reduce:animate-none sm:text-xl"
        >
          <Lines lines={subtitle_lines} />
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-fit animate-slide-up-fade gap-4 [--offset:5px] [animation-delay:300ms] motion-reduce:animate-none">
        {cta && (
          <Link
            href={cta.href}
            {...(cta.external && { target: "_blank", rel: "noreferrer" })}
            className={cn(
              buttonVariants({ size: "lg" }),
              "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200 dark:hover:ring-white/10"
            )}
          >
            {cta.label}
          </Link>
        )}
        {secondary_button && (
          <SecondaryButton {...secondary_button} prop="secondary_button" />
        )}
      </div>

      <div className="mt-12 animate-slide-up-fade [animation-delay:400ms] motion-reduce:animate-none">
        <ModuleDeck />
      </div>
    </GridSection>
  )
}
