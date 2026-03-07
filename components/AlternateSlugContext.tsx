'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'

type AlternateSlugMap = Partial<Record<Locale, string>> | null

interface AlternateSlugContextValue {
  alternateSlug: AlternateSlugMap
  setAlternateSlug: (map: AlternateSlugMap) => void
}

const AlternateSlugContext = createContext<AlternateSlugContextValue>({
  alternateSlug: null,
  setAlternateSlug: () => {},
})

export function AlternateSlugProvider({ children }: { children: ReactNode }) {
  const [alternateSlug, setAlternateSlug] = useState<AlternateSlugMap>(null)
  return (
    <AlternateSlugContext.Provider value={{ alternateSlug, setAlternateSlug }}>
      {children}
    </AlternateSlugContext.Provider>
  )
}

export function useAlternateSlug() {
  return useContext(AlternateSlugContext)
}
