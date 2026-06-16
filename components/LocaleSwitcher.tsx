'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAlternateSlug } from '@/components/AlternateSlugContext'
import alternateManifest from '@/lib/alternate-slug-manifest.generated.json'
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
 * Build-time manifest map: stripped pathname (no trailing slash) →
 * { ru?: '/ru/.../', uz?: '/uz/.../' }.
 *
 * Populated by scripts/generate-alternate-slug-manifest.mjs which reads:
 *  • content/blog/{ru,uz}/*.mdx (frontmatter alternateSlug)
 *  • content/pages/<slug>/index.yaml (CMS alternateSlug)
 *  • hardcoded landing-pair safety net
 *
 * This is imported statically so SSR (server render of this client
 * component) and the client bundle both see the *same* data, ensuring the
 * `<a href="…">` in raw HTML/View-Source is already correct without waiting
 * for hydration. Googlebot follows that link, no more cross-locale 404s.
 */
const MANIFEST = alternateManifest as Record<string, Partial<Record<Locale, string>>>

function stripTrailingSlash(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

/**
 * Compute the URL for a given target locale on the current pathname.
 *
 * Priority (alternate-link contract — must NEVER 404):
 * 1. Build-time manifest hit                 → use mapped URL (SSR-correct).
 * 2. AlternateSlugProvider context (client)  → late override, e.g. CMS pages
 *    whose alternateSlug pair was added after the last build.
 * 3. Blog article without any mapping        → fallback to /<locale>/blog
 *    (never blind-swap blog slugs — they differ per locale).
 * 4. Same locale already                     → swap segment safely.
 * 5. Single-segment slug page WITHOUT a known alternate → fallback to
 *    /<locale>/ (never blind-swap landing slugs — they differ per locale
 *    and a blind swap is the exact bug that produced GSC 404s).
 * 6. Multi-segment non-blog page             → safe locale-segment swap
 *    (covers /<locale>/products/<slug>, /<locale>/about, /<locale>/blog,
 *    etc. — slugs in these branches are locale-agnostic).
 * 7. Root /<locale>                          → switch locale root.
 * 8. Anything else                           → /<locale>/ home.
 */
function getLocaleUrl(
  pathname: string,
  targetLocale: Locale,
  alternateSlug: Partial<Record<Locale, string>> | null,
): string {
  const stripped = stripTrailingSlash(pathname)

  // 1) Build-time manifest hit — the SSR-correct answer.
  const manifestEntry = MANIFEST[stripped]
  if (manifestEntry && manifestEntry[targetLocale]) {
    // Always emit canonical trailing slash to avoid 308 redirect hops in
    // crawler eyes (next.config.mjs uses trailingSlash: true).
    const u = manifestEntry[targetLocale] as string
    return u.endsWith('/') ? u : u + '/'
  }

  const localePrefix = /^\/(ru|uz)(\/|$)/
  const match = stripped.match(localePrefix)
  const currentLocale = match ? (match[1] as Locale) : null
  const blogArticleMatch = stripped.match(/^\/(ru|uz)\/blog\/([^/]+)$/)
  const singleSegmentMatch = stripped.match(/^\/(ru|uz)\/([^/]+)$/)

  // 2) Late context override (post-hydration only; SSR has null context).
  if (alternateSlug && alternateSlug[targetLocale]) {
    if (blogArticleMatch) {
      return `/${targetLocale}/blog/${alternateSlug[targetLocale]}/`
    }
    if (singleSegmentMatch) {
      return `/${targetLocale}/${alternateSlug[targetLocale]}/`
    }
  }

  // 3) Blog article without a known alternate → safe fallback to blog index.
  //    Never blind-swap the slug — RU/UZ blog slugs differ.
  if (blogArticleMatch) {
    return `/${targetLocale}/blog/`
  }

  // 4) Already on the target locale (defensive — no-op switch).
  if (currentLocale === targetLocale) {
    return stripped + '/'
  }

  // 5) Single-segment landing /<locale>/<slug>/ without a known alternate →
  //    locale home (avoid producing /<targetLocale>/<same-ru-or-uz-slug>/
  //    which is the exact 404 generator we are fixing).
  if (singleSegmentMatch) {
    return `/${targetLocale}/`
  }

  // 6) Multi-segment paths where slugs are locale-agnostic
  //    (products/*, blog index, about, contacts, guarantees, …).
  if (match && currentLocale) {
    return stripped.replace(`/${currentLocale}`, `/${targetLocale}`) + '/'
  }

  // 7) /ru or /uz root.
  if (stripped === '/ru' || stripped === '/uz') {
    return `/${targetLocale}/`
  }

  // 8) Last-resort fallback.
  return `/${targetLocale}/`
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
