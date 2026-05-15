'use client'

import { useEffect } from 'react'
import { trackViewContent } from '@/lib/tracking'

interface Props {
  contentId: string
  contentName: string
  contentCategory?: string
}

/**
 * Client-side trigger for Meta `ViewContent` event on article-style pages.
 * Fires exactly once on mount per page render.
 */
export default function ViewContentTracker({ contentId, contentName, contentCategory }: Props) {
  useEffect(() => {
    trackViewContent(contentId, contentName, contentCategory)
    // Intentionally no deps — fire once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
