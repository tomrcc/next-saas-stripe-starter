import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

// Generated once at build; the static export requires saying so.
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/admin/", // module:admin
      ],
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  }
}
