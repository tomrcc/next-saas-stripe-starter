"use client"

import { useEffect } from "react"

// Loads component registration inside CloudCannon's Visual Editor only, so
// production pages never request the registered components' chunk.
export function CloudCannonEditor() {
  useEffect(() => {
    if (!(window as { inEditorMode?: boolean }).inEditorMode) return
    import("./registerComponents").catch((error) => {
      console.warn("Failed to load CloudCannon component registration:", error)
    })
  }, [])

  return null
}
