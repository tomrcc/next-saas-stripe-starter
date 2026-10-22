import "server-only"

import type { BlockExtras } from "@/components/marketing/blocks"
import { getStarterCta } from "@/components/marketing/starter-cta"
import { getGithubRepo } from "@/lib/github"

// Values blocks show but can't read from their content: build-time GitHub
// stats and the flag-dependent call to action. Keyed by `_type`.
export async function getBlockExtras(): Promise<BlockExtras> {
  const [github, cta] = await Promise.all([getGithubRepo(), getStarterCta()])
  return {
    hero: { github, cta },
    "closing-cta": { github, cta },
  }
}
