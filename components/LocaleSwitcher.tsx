'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAlternateSlug } from '@/components/AlternateSlugContext'
import type { Locale } from '@/lib/i18n'

interface LocaleSwitcherProps {
  locale: Locale
  className?: string
  activeClassName?: string
  inactiveClassName?: string
}

/**
 * Computes the target URL when switching to a given locale.
 *
 * Priority:
 * 1. Blog article with alternateSlug in context → use mapped slug
 * 2. Blog article WITHOUT alternateSlug → fallback to /locale/blog (NOT homepage)
 * 3. Any other page with /ru/ or /uz/ prefix → replace locale segment, keep rest of path
 * 4. Root /ru or /uz → switch root
 * 5. Fallback → target locale root
 */
function getLocaleUrl(
  pathname: string,
  targetLocale: Locale,
  alternateSlug: Partial<Record<Locale, string>> | null
): string {
  const localePrefix = /^\/(ru|uz)(\/|$)/
  const match = pathname.match(localePrefix)
  const currentLocale = match ? match[1] : null

  // Detect if we're on a blog article page: /ru/blog/some-slug or /uz/blog/some-slug
  const blogArticleMatch = pathname.match(/^\/(ru|uz)\/blog\/([^/]+)$/)

  if (blogArticleMatch) {
    // 1. Has explicit alternateSlug for target locale
    if (alternateSlug && alternateSlug[targetLocale]) {
      return `/${targetLocale}/blog/${alternateSlug[targetLocale]}`
    }
    // 2. No counterpart — safe fallback to blog index (not homepage)
    return `/${targetLocale}/blog`
  }

  // 3. Any other page with locale prefix — replace locale segment
  // This also handles the same-locale case (active locale link) — replace /ru with /ru = same path
  if (match && currentLocale) {
    return pathname.replace(`/${currentLocale}`, `/${targetLocale}`)
  }

  // 4. Exact root locale
  if (pathname === '/ru' || pathname === '/uz') {
    return `/${targetLocale}`
  }

  // 5. Fallback
  return `/${targetLocale}`
}

export default function LocaleSwitcher({
  locale,
  className,
  activeClassName = 'text-teal-500',
  inactiveClassName = 'text-gray-400 hover:text-white',
}: LocaleSwitcherProps) {
  const pathname = usePathname()
  const { alternateSlug } = useAlternateSlug()

  const ruUrl = getLocaleUrl(pathname, 'ru', alternateSlug)
  const uzUrl = getLocaleUrl(pathname, 'uz', alternateSlug)

  return (
    <div className={className ?? 'flex items-center space-x-2'}>
      <Link
        href={ruUrl}
        className={`text-sm font-medium transition ${locale === 'ru' ? activeClassName : inactiveClassName}`}
        data-testid="locale-switch-ru"
      >
        RU
      </Link>
      <span className="text-gray-600">/</span>
      <Link
        href={uzUrl}
        className={`text-sm font-medium transition ${locale === 'uz' ? activeClassName : inactiveClassName}`}
        data-testid="locale-switch-uz"
      >
        UZ
      </Link>
    </div>
  )
}
