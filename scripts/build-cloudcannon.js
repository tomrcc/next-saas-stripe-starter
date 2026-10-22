// CloudCannon's editing build: a static export of the public pages to out/.
// Production keeps `pnpm build`.
//
// Server-only routes can't be exported, so they are moved out of app/ for the
// build and moved back afterwards, even when the build fails or is interrupted.
// A run that was killed before restoring is repaired by the next run.
//
//   pnpm build:cloudcannon

import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, renameSync, rmdirSync } from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
// Gitignored.
const stash = path.join(root, ".editing-build")

const serverRoutes = [
  "app/(app)",
  "app/(auth)",
  "app/api",
  "app/(marketing)/pricing",
]

const stashPath = (route) =>
  path.join(stash, route.replaceAll("/", "__").replaceAll(/[()]/g, ""))

function restore() {
  for (const route of serverRoutes) {
    const from = stashPath(route)
    if (!existsSync(from)) continue
    const to = path.join(root, route)
    if (existsSync(to)) {
      throw new Error(
        `Both ${route} and its stashed copy exist; merge by hand.`
      )
    }
    renameSync(from, to)
  }
  if (existsSync(stash)) rmdirSync(stash)
}

function stashRoutes() {
  mkdirSync(stash, { recursive: true })
  for (const route of serverRoutes) {
    const from = path.join(root, route)
    if (existsSync(from)) renameSync(from, stashPath(route))
  }
}

restore()

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    restore()
    process.exit(1)
  })
}

let status = 1
try {
  stashRoutes()
  const result = spawnSync("next", ["build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, CLOUDCANNON_EDITING_BUILD: "1" },
  })
  status = result.status ?? 1
} finally {
  restore()
}
process.exit(status)
