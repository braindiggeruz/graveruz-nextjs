'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAlternateSlug } from '@/components/AlternateSlugContext'
import type { Locale } from '@/lib/i18n'

interface LocaleSwitcherProps {
  locale: Locale
  /** 'sm' = header pill (h-10), 'lg' = mobile-menu pill (h-12, full width) */
  size?: 'sm' | 'lg'
  /** Optional extra wrapper classes (kept for backward compatibility with old call sites) */
  className?: string
  /** Legacy props (unused by the new pill design, kept so existing imports still compile) */
  activeClassName?: string
  inactiveClassName?: string
}

/**
 * Compute the URL for a given target locale on the current pathname.
 *
 * Priority (unchanged contract — language switch must never 404):
 * 1. Blog article with alternateSlug in context → use mapped slug
 * 2. Blog article WITHOUT alternateSlug → fallback to /locale/blog
 * 3. Any single-segment slug page (/ru/<slug>/) with alternateSlug in
 *    context → swap the slug for the locale-specific mapping
 *    (covers landings whose RU/UZ slugs differ — e.g. the watch gift
 *    set lives at /ru/podarochniy-nabor-s-chasami/ and
 *    /uz/soatli-sovga-toplami/).
 * 4. Any other page with /ru/ or /uz/ prefix → replace locale segment
 * 5. Root /ru or /uz → switch root
 * 6. Fallback → target locale root
 */
function getLocaleUrl(
  pathname: string,
  targetLocale: Locale,
  alternateSlug: Partial<Record<Locale, string>> | null,
): string {
  const localePrefix = /^\/(ru|uz)(\/|$)/
  const match = pathname.match(localePrefix)
  const currentLocale = match ? match[1] : null

  const blogArticleMatch = pathname.match(/^\/(ru|uz)\/blog\/([^/]+)$/)
  if (blogArticleMatch) {
    if (alternateSlug && alternateSlug[targetLocale]) {
      return `/${targetLocale}/blog/${alternateSlug[targetLocale]}`
    }
    return `/${targetLocale}/blog`
  }

  // Single-segment slug page with alternateSlug in context (CMS pages or
  // dedicated landings whose slug differs per locale).
  const slugPageMatch = pathname.match(/^\/(ru|uz)\/([^/]+)\/?$/)
  if (slugPageMatch && alternateSlug && alternateSlug[targetLocale]) {
    return `/${targetLocale}/${alternateSlug[targetLocale]}/`
  }

  if (match && currentLocale) {
    return pathname.replace(`/${currentLocale}`, `/${targetLocale}`)
  }
  if (pathname === '/ru' || pathname === '/uz') {
    return `/${targetLocale}`
  }
  return `/${targetLocale}`
}

export default function LocaleSwitcher({
  locale,
  size = 'sm',
  className,
}: LocaleSwitcherProps) {
  const pathname = usePathname()
  const { alternateSlug } = useAlternateSlug()

  const ruUrl = getLocaleUrl(pathname, 'ru', alternateSlug)
  const uzUrl = getLocaleUrl(pathname, 'uz', alternateSlug)

  // Pill geometry per size
  const wrapHeight = size === 'lg' ? 'h-12' : 'h-10'
  const wrapWidth = size === 'lg' ? 'w-full max-w-[260px]' : 'w-auto'
  const itemPad = size === 'lg' ? 'px-6 text-base' : 'px-5 text-sm'

  const activeCls =
    'bg-teal-500 text-black font-bold shadow-[0_0_0_1px_rgba(94,234,212,0.4)]'
  const inactiveCls = 'text-gray-300 hover:text-white'

  return (
    <div
      role="group"
      aria-label={locale === 'ru' ? 'Переключатель языка' : 'Til almashtirgich'}
      className={`inline-flex ${wrapHeight} ${wrapWidth} items-center rounded-full border border-teal-500/30 bg-black/40 p-1 backdrop-blur-sm ${className ?? ''}`}
      data-testid="locale-switcher"
    >
      <Link
        href={ruUrl}
        aria-label="Switch to Russian"
        aria-current={locale === 'ru' ? 'true' : undefined}
        prefetch={false}
        data-testid="locale-switch-ru"
        className={`flex h-full ${size === 'lg' ? 'flex-1' : ''} items-center justify-center rounded-full ${itemPad} font-semibold tracking-wide transition-colors duration-150 ${locale === 'ru' ? activeCls : inactiveCls}`}
      >
        RU
      </Link>
      <Link
        href={uzUrl}
        aria-label="Tilni o'zbekchaga o'tkazish"
        aria-current={locale === 'uz' ? 'true' : undefined}
        prefetch={false}
        data-testid="locale-switch-uz"
        className={`flex h-full ${size === 'lg' ? 'flex-1' : ''} items-center justify-center rounded-full ${itemPad} font-semibold tracking-wide transition-colors duration-150 ${locale === 'uz' ? activeCls : inactiveCls}`}
      >
        UZ
      </Link>
    </div>
  )
}
