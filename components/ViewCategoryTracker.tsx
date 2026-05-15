'use client'

import { useEffect } from 'react'
import { trackViewCategory } from '@/lib/tracking'

interface Props {
  categoryId: string
  categoryName: string
}

/**
 * Client-side trigger for Meta `ViewCategory` custom event on commercial
 * category / product pages (catalog, engraved-gifts, products/*, etc).
 * Fires exactly once on mount per page render.
 */
export default function ViewCategoryTracker({ categoryId, categoryName }: Props) {
  useEffect(() => {
    trackViewCategory(categoryId, categoryName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
