import {
  Bot,
  Braces,
  Check,
  ChevronDown,
  CreditCard,
  KeyRound,
  LayoutGrid,
  Scale,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

import { GridSection } from "@/components/marketing/grid-section"
import { PanelDemo } from "@/components/marketing/panel-demo"
import { Reveal } from "@/components/marketing/reveal"
import { cn } from "@/lib/utils"

// The landing page's case for the module system: a heading over a playable
// copy of the dev panel, a 2x2 grid of feature cards, then a row of facts.

const icons: Record<string, LucideIcon> = {
  "layout-grid": LayoutGrid,
  scale: Scale,
  braces: Braces,
  bot: Bot,
  zap: Zap,
}

// Taller-than-the-frame visuals fade out at the bottom.
const visuals: Record<
  string,
  { Visual: () => React.ReactNode; overflows?: boolean }
> = {
  prune_terminal: { Visual: PruneTerminal, overflows: true },
  dependency_graph: { Visual: DependencyGraph },
  config_file: { Visual: ConfigFile },
  services_check: { Visual: ServicesCheck },
}

type Feature = {
  title?: string | null
  // Markdown: inline code, bold and italic.
  description?: string | null
  visual?: string | null
  href?: string | null
  link_label?: string | null
}

type Fact = {
  icon?: string | null
  title?: string | null
  description?: string | null
}

export type ModulesShowcaseBlock = {
  eyebrow_icon?: string | null
  eyebrow?: string | null
  title?: string | null
  description?: string | null
  features?: Feature[] | null
  facts?: Fact[] | null
}

export function ModulesShowcase({
  eyebrow_icon,
  eyebrow,
  title,
  description,
  features,
  facts,
}: ModulesShowcaseBlock) {
  return (
    <GridSection innerClassName="px-0 sm:px-0">
      <div className="px-4 pt-20 text-center sm:px-12">
        <SectionHeading
          icon={eyebrow_icon ? icons[eyebrow_icon] : undefined}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </div>

      <div className="relative mt-12 overflow-hidden border-t border-grid-border bg-[linear-gradient(to_bottom,var(--background),var(--muted))] px-4 py-12 sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-lines mask-[radial-gradient(60%_70%_at_50%_40%,black,transparent)] text-grid-border/50"
        />
        <div className="relative">
          <PanelDemo />
        </div>
      </div>

      <div
        data-editable="array"
        data-prop="features"
        data-direction="row"
        className="grid grid-cols-1 border-t border-grid-border md:grid-cols-2"
      >
        {(features ?? []).map((feature, index) => (
          <FeatureCard
            key={index}
            feature={feature}
            className={cn(
              index > 0 && "max-md:border-t",
              index > 1 && "md:border-t",
              index % 2 === 1 && "md:border-l"
            )}
          />
        ))}
      </div>

      <div
        data-editable="array"
        data-prop="facts"
        data-direction="row"
        className="grid grid-cols-1 gap-px border-t border-grid-border bg-grid-border text-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        {(facts ?? []).map((fact, index) => {
          const Icon = fact.icon ? icons[fact.icon] : undefined
          return (
            <div
              key={index}
              data-editable="array-item"
              className="flex flex-col items-start gap-2 bg-background p-8 text-left lg:px-9 lg:py-10"
            >
              {Icon && (
                <Icon className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              )}
              <h3
                data-editable="text"
                data-prop="title"
                className="font-medium"
              >
                {fact.title}
              </h3>
              <p
                data-editable="text"
                data-prop="description"
                className="text-pretty text-muted-foreground"
              >
                {fact.description}
              </p>
            </div>
          )
        })}
      </div>
    </GridSection>
  )
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon?: LucideIcon
  eyebrow?: string | null
  title?: string | null
  description?: string | null
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex items-center gap-2 text-base font-medium text-muted-foreground">
        {Icon && <Icon className="size-5" />}
        <editable-text data-prop="eyebrow">{eyebrow}</editable-text>
      </span>
      <h2
        data-editable="text"
        data-prop="title"
        className="mt-3 max-w-lg font-display text-3xl font-medium text-pretty sm:text-4xl md:text-5xl"
      >
        {title}
      </h2>
      <p
        data-editable="text"
        data-prop="description"
        className="mt-3 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg"
      >
        {description}
      </p>
    </div>
  )
}

function FeatureCard({
  feature,
  className,
}: {
  feature: Feature
  className?: string
}) {
  const visual = feature.visual ? visuals[feature.visual] : undefined

  return (
    <div
      data-editable="array-item"
      className={cn(
        "border-grid-border px-4 py-6 sm:px-10 sm:py-14",
        className
      )}
    >
      <Reveal className="flex flex-col gap-10">
        <div
          aria-hidden
          className={cn(
            "relative h-80 overflow-hidden select-none",
            // Only visuals taller than the frame fade out; the others fit whole.
            visual?.overflows && "mask-[linear-gradient(black_80%,transparent)]"
          )}
        >
          {visual && <visual.Visual />}
        </div>
        <div className="flex flex-col text-left text-base">
          <h3 data-editable="text" data-prop="title" className="font-medium">
            {feature.title}
          </h3>
          <p
            data-editable="text"
            data-type="text"
            data-prop="description"
            className="mt-1 text-pretty text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground"
            dangerouslySetInnerHTML={{
              __html: inlineMarkdown(feature.description),
            }}
          />
          {feature.href && (
            <Link
              href={feature.href}
              className="mt-6 w-fit rounded-lg border bg-background px-3 py-2 text-sm leading-none font-medium transition-colors hover:bg-muted"
            >
              <editable-text data-prop="link_label">
                {feature.link_label}
              </editable-text>
            </Link>
          )}
        </div>
      </Reveal>
    </div>
  )
}

// The inline markdown a feature description allows: `code`, **bold**, *italic*.
// Returns HTML for the description's rich text region; the region host styles
// `code`, since markup inside a region can't keep attributes.
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/
const ESCAPE = /\\([\\`*_{}[\]()#+\-.!>])/g

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function inlineMarkdown(text?: string | null) {
  if (!text) return ""
  return text
    .split(INLINE)
    .map((part, index) => {
      if (index % 2 === 0) return escapeHtml(part.replace(ESCAPE, "$1"))
      if (part.startsWith("`")) {
        return `<code>${escapeHtml(part.slice(1, -1))}</code>`
      }
      if (part.startsWith("**")) {
        return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`
      }
      return `<em>${escapeHtml(part.slice(1, -1))}</em>`
    })
    .join("")
}

// Card visuals. Decorative mocks built from real output and config, so they
// stay believable.

function PruneTerminal() {
  const deleted = [
    "app/(marketing)/blog",
    "app/(marketing)/changelog",
    "content/blog",
    "content/changelog",
    "lib/content/blog.ts",
    "components/marketing/category-tabs.tsx",
  ]
  const edited = [
    ["config/features.ts", "-36 lines"],
    ["components/marketing/site-header.tsx", "-2 lines"],
    [".env.example", "-2 lines"],
  ]

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-[12px] leading-relaxed text-neutral-400 shadow-xl shadow-neutral-900/10">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2.5 rounded-full bg-white/15" />
        ))}
        <span className="ml-2 text-[11px] text-neutral-500">zsh</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-neutral-100">
          <span className="text-emerald-400">$</span> pnpm modules:prune blog
          changelog
        </p>
        <p className="mt-2 text-neutral-200">Would prune: blog, changelog</p>
        <p className="mt-2 text-neutral-200">Delete:</p>
        {deleted.map((path) => (
          <p key={path} className="truncate pl-3 text-rose-300/90">
            {path}
          </p>
        ))}
        <p className="mt-2 text-neutral-200">Edit:</p>
        {edited.map(([file, change]) => (
          <p key={file} className="truncate pl-3">
            {file} <span className="text-neutral-500">({change})</span>
          </p>
        ))}
        <p className="mt-2 text-neutral-200">
          Uninstall:{" "}
          <span className="text-neutral-400">fumadocs-core, fumadocs-mdx…</span>
        </p>
      </div>
    </div>
  )
}

function DependencyGraph() {
  const children = [
    { label: "Billing", icon: CreditCard },
    { label: "Admin", icon: ShieldCheck },
  ]

  return (
    <div className="flex size-full flex-col items-center justify-center max-sm:scale-[0.85]">
      <GraphNode icon={KeyRound} label="Auth" on={false} />

      <svg
        viewBox="0 0 336 56"
        fill="none"
        className="h-14 w-[336px] text-neutral-300 dark:text-neutral-700"
      >
        <path
          d="M168 0v16c0 8-6 14-14 14H94c-8 0-14 6-14 14v12M168 16c0 8 6 14 14 14h60c8 0 14 6 14 14v12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      <div className="flex gap-4">
        {children.map((child) => (
          <GraphNode
            key={child.label}
            icon={child.icon}
            label={child.label}
            paused
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg border bg-background py-1 pr-3 pl-1 text-xs shadow-sm">
        <span className="rounded-md bg-muted px-2 py-1 font-medium">
          Auth off
        </span>
        <span className="text-muted-foreground">
          pauses <span className="font-medium text-foreground">2 modules</span>
        </span>
      </div>
    </div>
  )
}

function GraphNode({
  icon: Icon,
  label,
  on = true,
  paused = false,
}: {
  icon: LucideIcon
  label: string
  on?: boolean
  paused?: boolean
}) {
  return (
    <div className="flex w-40 items-center gap-2.5 rounded-xl border bg-background p-2.5 text-left shadow-sm">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          on && !paused
            ? "bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300"
            : "bg-neutral-100 text-neutral-400 dark:bg-white/5 dark:text-neutral-500"
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{label}</p>
        <p
          className={cn(
            "text-[11px]",
            paused
              ? "text-amber-600 dark:text-amber-400"
              : "text-muted-foreground"
          )}
        >
          {paused ? "Paused" : on ? "On" : "Off"}
        </p>
      </div>
    </div>
  )
}

function ConfigFile() {
  const lines: [string, string, boolean][] = [
    ["auth", "true", false],
    ["billing", "false", true],
    ["admin", "true", false],
    ["docs", "true", false],
    ["blog", "false", true],
    ["changelog", "false", true],
  ]

  return (
    <div className="relative mx-auto flex h-full max-w-md flex-col justify-center">
      <div className="overflow-hidden rounded-xl border bg-background font-mono text-[12.5px] shadow-lg shadow-neutral-900/5 dark:shadow-black/30">
        <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-2 font-sans text-xs">
          <span className="font-medium">config/features.ts</span>
          <span className="text-muted-foreground">Defaults</span>
        </div>
        <ol className="py-2">
          {lines.map(([name, value, changed], index) => (
            <li
              key={name}
              className={cn(
                "flex gap-4 px-3 py-0.5",
                changed && "bg-blue-500/[0.06]"
              )}
            >
              <span className="w-4 text-right text-muted-foreground/50 tabular-nums">
                {index + 1}
              </span>
              <span className="truncate">
                {name}
                <span className="text-muted-foreground">: default: </span>
                <span
                  className={
                    value === "false"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }
                >
                  {value}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="absolute top-1 right-2 flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 font-sans text-xs font-medium shadow-md">
        <Check className="size-3 text-emerald-600" />
        Copied 3 lines from the panel
      </div>
    </div>
  )
}

function ServicesCheck() {
  const services = [
    { label: "Database", provider: "Neon", configured: true },
    { label: "Auth", provider: "Better Auth", configured: true },
    { label: "Payments", provider: "Stripe", configured: false },
  ]

  return (
    <div className="mx-auto flex h-full max-w-sm flex-col justify-center">
      <div className="overflow-hidden rounded-xl border bg-popover p-1.5 text-left shadow-lg shadow-neutral-900/5 dark:shadow-black/30">
        <p className="px-2.5 pt-1 pb-1 text-[11px] font-medium text-muted-foreground">
          Services
        </p>
        {services.map((service) => (
          <div
            key={service.label}
            className={cn("rounded-lg", !service.configured && "bg-muted/60")}
          >
            <div className="flex items-center gap-3 px-2.5 py-1.5">
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  service.configured
                    ? "bg-emerald-500"
                    : "bg-amber-500 shadow-[0_0_0_3px] shadow-amber-500/20"
                )}
              />
              <span className="min-w-0 flex-1 truncate text-sm">
                {service.label}{" "}
                <span className="text-muted-foreground">
                  · {service.provider}
                </span>
              </span>
              {service.configured ? (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="size-3" />
                  Configured
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  3 missing
                  <ChevronDown className="size-3.5 rotate-180" />
                </span>
              )}
            </div>
            {!service.configured && (
              <div className="px-2.5 pb-2.5 pl-6">
                <div className="overflow-hidden rounded-md border bg-background">
                  <div className="flex items-center justify-between border-b px-3 py-1.5 text-xs">
                    <span className="font-medium">
                      Stripe{" "}
                      <span className="font-normal text-muted-foreground">
                        · .env.local
                      </span>
                    </span>
                    <span className="text-muted-foreground">Get keys ↗</span>
                  </div>
                  <ul className="grid gap-0.5 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                    <li>STRIPE_SECRET_KEY=</li>
                    <li>STRIPE_WEBHOOK_SECRET=</li>
                    <li>STRIPE_PRO_MONTHLY_PRICE_ID=</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
