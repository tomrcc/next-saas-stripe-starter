import site from "@/data/site.json"

// Absolute URL of the deployment, used by metadata, sitemap and robots.
// Set NEXT_PUBLIC_APP_URL in production; Vercel previews fall back to their
// own URL.
const url =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

const github = "https://github.com/mickasmt/next-saas-stripe-starter"

export const siteConfig = {
  // Name, default title and description are edited in data/site.json.
  name: site.name,
  title: site.title,
  description: site.description,
  url,
  links: {
    github,
    pricing: "/pricing",
    // The Pro page isn't part of this repository; this points at the
    // README section describing it, keyed to its "## Pro version" heading.
    pro: `${github}#pro-version`,
    terms: "/terms",
    privacy: "/privacy",
  },
}
