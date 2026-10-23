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

    // Clicking a text region inside a link would navigate away mid-edit.
    // next/link skips navigation for a click that is already defaultPrevented.
    const blockLinkClicks = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (target?.closest("a editable-text, a [data-editable='text']")) {
        event.preventDefault()
      }
    }
    document.addEventListener("click", blockLinkClicks, true)
    return () => document.removeEventListener("click", blockLinkClicks, true)
  }, [])

  return null
}
