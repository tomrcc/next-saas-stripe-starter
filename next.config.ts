import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

// CloudCannon's editing build (scripts/build-cloudcannon.js): a static export
// of the public pages. Production builds leave this off.
const editingBuild = process.env.CLOUDCANNON_EDITING_BUILD === "1"

const nextConfig: NextConfig = {
  // Keep the bottom-left corner free for the dashboard user menu.
  devIndicators: { position: "bottom-right" },
  images: {
    // Blog cover images are self-authored SVGs (no user-supplied content),
    // so allow next/image to serve them with scripts disabled.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // A static export has no image optimization server.
    unoptimized: editingBuild,
  },
  ...(editingBuild && {
    output: "export",
    // A folder per page, so the docs index exports to docs/index.html and
    // CloudCannon's /docs/ URL for content/docs/index.mdx resolves.
    trailingSlash: true,
    turbopack: {
      resolveAlias: {
        // The dev toolbar imports server actions, which a static export rejects
        // even when the toolbar never renders.
        "@/components/dev/dev-toolbar": "./components/dev/dev-toolbar-stub.tsx",
      },
    },
  }),
}

const plugins: ((config: NextConfig) => NextConfig)[] = [
  // Content collections (site pages, docs, blog, changelog) are declared with
  // the macro API in lib/content, so no source.config.ts or generated files
  // are needed.
  createMDX(),
]

export default plugins.reduce((config, plugin) => plugin(config), nextConfig)
