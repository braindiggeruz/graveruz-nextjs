'use client'

import { useEffect } from 'react'
import { trackPhoneClick, trackTelegramContact } from '@/lib/tracking'

/**
 * Global event-delegation component for tracking phone and Telegram clicks.
 * Listens for clicks on elements with data-track="tel" or data-track="tg".
 * Mount once in the locale layout.
 */
export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const tracked = target.closest('[data-track]') as HTMLElement | null
      if (!tracked) return

      const trackType = tracked.getAttribute('data-track')
      const placement = tracked.getAttribute('data-placement') || tracked.closest('section')?.id || 'unknown'

      if (trackType === 'tel') {
        trackPhoneClick(placement)
      } else if (trackType === 'tg') {
        trackTelegramContact(placement)
      }
    }

    document.addEventListener('click', handleClick, { passive: true })
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return <>{children}</>
}
