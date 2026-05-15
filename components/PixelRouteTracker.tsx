'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Fires fbq('track', 'PageView') + gtag page_view on Next.js App Router
 * client-side navigations.
 *
 * The initial PageView is fired by the inline pixel snippet in
 * [locale]/layout.tsx (it runs once when the script first loads). This
 * component skips the very first effect invocation so we do not double-fire
 * on the initial render.
 *
 * For subsequent SPA navigations the inline snippet does not re-execute,
 * therefore Meta sees no PageView events and event optimization breaks —
 * this fixes that by re-firing PageView on every pathname change.
 *
 * Query string is read from window.location.search at fire time to avoid
 * requiring a Suspense boundary (useSearchParams forces CSR bail-out
 * during static export).
 */
export default function PixelRouteTracker() {
  const pathname = usePathname()
  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    if (typeof window === 'undefined') return

    // Meta Pixel — track PageView for SPA navigation
    if (typeof window.fbq === 'function') {
      const eventID = `pv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
      window.fbq('track', 'PageView', {}, { eventID })
    }

    // GA4 — manual page_view for SPA navigation
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pathname + window.location.search,
        page_location: window.location.href,
        page_title: document.title,
      })
    }
  }, [pathname])

  return null
}
