import { Sparkles } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ButtonContent = { label?: string | null; href?: string | null }

// The violet outline button beside a section's main call to action. `prop` is
// the button's path in the block, for the label's text region.
export function SecondaryButton({
  label,
  href,
  prop,
}: ButtonContent & { prop: string }) {
  if (!href) return null
  const external = /^https?:/.test(href)

  return (
    <Link
      href={href}
      {...(external && { target: "_blank", rel: "noreferrer" })}
      className={cn(
        buttonVariants({ variant: "outline", size: "lg" }),
        "px-5 shadow-sm hover:ring-4 hover:ring-neutral-200",
        "dark:border-violet-400/40 dark:bg-violet-400/10 dark:text-violet-100 dark:hover:bg-violet-400/20 dark:hover:ring-violet-400/20"
      )}
    >
      <Sparkles className="text-violet-500 dark:text-violet-300" />
      <editable-text data-prop={`${prop}.label`}>{label}</editable-text>
    </Link>
  )
}
