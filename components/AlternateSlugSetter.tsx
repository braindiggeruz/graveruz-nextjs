'use client'

import { useEffect } from 'react'
import { useAlternateSlug } from '@/components/AlternateSlugContext'
import type { Locale } from '@/lib/i18n'

interface AlternateSlugSetterProps {
  alternateSlug?: Partial<Record<Locale, string>>
}

/**
 * Invisible client component rendered by blog article pages.
 * Registers the article's alternateSlug map into context so LocaleSwitcher can use it.
 */
export default function AlternateSlugSetter({ alternateSlug }: AlternateSlugSetterProps) {
  const { setAlternateSlug } = useAlternateSlug()

  useEffect(() => {
    setAlternateSlug(alternateSlug ?? null)
    return () => setAlternateSlug(null)
  }, [alternateSlug, setAlternateSlug])

  return null
}
