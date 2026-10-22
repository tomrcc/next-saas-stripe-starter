import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import { ThemeSwitcher } from "@/components/shared/theme-switcher"
import type { FeatureKey } from "@/config/features"
import { siteConfig } from "@/config/site"
import footer from "@/data/footer.json"
import { getFeatures } from "@/lib/features/resolve"

type FooterColumn = {
  title: string
  // Hidden while this flag is off, or once its module is pruned.
  links: { title: string; href: string; feature: string | null }[]
}

const columns: FooterColumn[] = footer

export async function SiteFooter() {
  const features = await getFeatures()
  // Keeps each column's and link's index in the file for its region path.
  const visibleColumns = columns
    .map((column, index) => ({
      ...column,
      index,
      links: column.links
        .map((link, linkIndex) => ({ ...link, index: linkIndex }))
        .filter(
          (link) => !link.feature || features[link.feature as FeatureKey]
        ),
    }))
    .filter((column) => column.links.length > 0)

  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p
            data-editable="text"
            data-prop="@data[site].description"
            className="mt-3 text-sm text-muted-foreground"
          >
            {siteConfig.description}
          </p>
        </div>

        {visibleColumns.map((column) => (
          <div key={column.title}>
            <p
              data-editable="text"
              data-prop={`@data[footer].${column.index}.title`}
              className="text-sm font-medium"
            >
              {column.title}
            </p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <editable-text
                      data-prop={`@data[footer].${column.index}.links.${link.index}.title`}
                    >
                      {link.title}
                    </editable-text>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <editable-text data-prop="@data[site].name">
              {siteConfig.name}
            </editable-text>
            . Open source under the MIT license.
          </p>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  )
}
