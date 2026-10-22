import { Check, Minus } from "lucide-react"

import { GridSection } from "@/components/marketing/grid-section"
import { Reveal } from "@/components/marketing/reveal"
import { cn } from "@/lib/utils"

// The case for modules against all-in-one kits. It compares approaches and
// never names another kit.

type Approach = {
  title?: string | null
  points?: string[] | null
  highlighted?: boolean | null
}

export type WhyModularBlock = {
  title?: string | null
  description?: string | null
  approaches?: Approach[] | null
}

export function WhyModular({
  title,
  description,
  approaches,
}: WhyModularBlock) {
  return (
    <GridSection className="bg-muted/40" innerClassName="py-16 sm:py-20">
      <div className="mx-auto max-w-xl text-center">
        {title && (
          <h2
            data-editable="text"
            data-prop="title"
            className="font-display text-3xl font-medium text-balance sm:text-4xl"
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            data-editable="text"
            data-prop="description"
            className="mt-3 text-lg text-pretty text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>

      <div
        data-editable="array"
        data-prop="approaches"
        data-direction="row"
        className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2"
      >
        {(approaches ?? []).map((approach, index) => (
          <Reveal
            key={index}
            data-editable="array-item"
            delay={index * 60}
            className={cn(
              "rounded-2xl p-6 text-left",
              approach.highlighted
                ? "border border-violet-500/30 bg-background shadow-xl ring-4 shadow-violet-500/10 ring-violet-500/10"
                : "border bg-background/60"
            )}
          >
            <h3
              data-editable="text"
              data-prop="title"
              className={cn(
                "font-medium",
                approach.highlighted
                  ? "text-violet-700 dark:text-violet-300"
                  : "text-muted-foreground"
              )}
            >
              {approach.title}
            </h3>
            <ul
              data-editable="array"
              data-prop="points"
              className="mt-5 grid gap-4 text-sm"
            >
              {(approach.points ?? []).map((point, pointIndex) => (
                <li
                  key={pointIndex}
                  data-editable="array-item"
                  className="flex gap-3"
                >
                  {approach.highlighted ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-violet-600 dark:text-violet-400" />
                  ) : (
                    <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                  )}
                  <span
                    data-editable="text"
                    data-prop=""
                    className={cn(
                      !approach.highlighted && "text-muted-foreground"
                    )}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </GridSection>
  )
}
