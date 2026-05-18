import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, isValidLocale } from './lib/i18n'

/**
 * Cross-locale slug pairs for landings whose RU/UZ slugs differ.
 * If a user lands on the wrong-locale variant of one of these slugs,
 * we 301 them to the correct locale-specific slug. This guarantees a
 * 200 language switch even when the LocaleSwitcher's SSR-rendered
 * href is stale (alternateSlug context only hydrates on the client).
 *
 * Format: each pair lists slug-by-locale. Extend as new landings are added.
 */
const LOCALE_SLUG_PAIRS: Array<Record<'ru' | 'uz', string>> = [
  { ru: 'podarochniy-nabor-s-chasami', uz: 'soatli-sovga-toplami' },
]
const SLUG_TO_LOCALE = new Map<string, 'ru' | 'uz'>()
for (const pair of LOCALE_SLUG_PAIRS) {
  SLUG_TO_LOCALE.set(pair.ru, 'ru')
  SLUG_TO_LOCALE.set(pair.uz, 'uz')
}
const SLUG_PAIR_BY_SLUG = new Map<string, Record<'ru' | 'uz', string>>()
for (const pair of LOCALE_SLUG_PAIRS) {
  SLUG_PAIR_BY_SLUG.set(pair.ru, pair)
  SLUG_PAIR_BY_SLUG.set(pair.uz, pair)
}

/**
 * Middleware responsibilities:
 *
 * 1. Keystatic admin (`/keystatic/*`): strip trailing slash so the
 *    client-side Keystatic router matches (trailing slash breaks it and
 *    shows "Not found" for collection / singleton list views).
 *
 * 2. Cross-locale slug redirect: /uz/<ru-slug>/ → /uz/<uz-slug>/ (and vice
 *    versa) for landings that have different slugs per locale. Prevents
 *    language-switcher 404s on dedicated landings.
 *
 * 3. Public pages: enforce trailing slash (canonical form) for SEO.
 *    This used to be handled by Next.js automatic redirect from
 *    `trailingSlash: true`, but we disabled that via
 *    `skipTrailingSlashRedirect: true` so we can opt-out Keystatic.
 *
 * 4. Root `/` → `/ru/` locale redirect (unchanged).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Keystatic admin: strip trailing slash ────────────────────────────
  // Client-side Keystatic router only matches URLs WITHOUT trailing slash.
  // `/keystatic` (root) stays as-is; only sub-paths are normalized.
  if (pathname.startsWith('/keystatic/') && pathname !== '/keystatic/' && pathname.endsWith('/')) {
    const stripped = pathname.replace(/\/+$/, '')
    const target = new URL(stripped + request.nextUrl.search, request.url)
    return new Response(null, {
      status: 308,
      headers: { Location: target.toString() },
    })
  }

  // ── 2. Skip static, API, Keystatic (handled above), admin-tools, images ──
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/keystatic') ||
    pathname.startsWith('/admin-tools') ||
    pathname.startsWith('/images') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // ── 3. Cross-locale slug redirect ───────────────────────────────────────
  // /(ru|uz)/<slug>/ where slug exists in another locale: rewrite to the
  // current locale's variant of that slug.
  const slugMatch = pathname.match(/^\/(ru|uz)\/([^/]+)\/?$/)
  if (slugMatch) {
    const reqLocale = slugMatch[1] as 'ru' | 'uz'
    const reqSlug = slugMatch[2]
    const pair = SLUG_PAIR_BY_SLUG.get(reqSlug)
    if (pair && pair[reqLocale] !== reqSlug) {
      const correctSlug = pair[reqLocale]
      const target = new URL(
        `/${reqLocale}/${correctSlug}/` + request.nextUrl.search,
        request.url,
      )
      return new Response(null, {
        status: 301,
        headers: {
          Location: target.toString(),
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }
  }

  // ── 4. Locale prefix check ──────────────────────────────────────────────
  const segments = pathname.split('/')
  const firstSegment = segments[1]

  if (firstSegment && isValidLocale(firstSegment)) {
    // Valid locale prefix — enforce trailing slash for public pages (SEO).
    if (!pathname.endsWith('/')) {
      const target = new URL(pathname + '/' + request.nextUrl.search, request.url)
      return new Response(null, {
        status: 308,
        headers: { Location: target.toString() },
      })
    }
    return NextResponse.next()
  }

  // ── 5. No locale prefix — redirect to default locale WITH trailing slash ─
  let targetPath = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  if (!targetPath.endsWith('/')) targetPath += '/'
  const target = new URL(targetPath + request.nextUrl.search, request.url)
  return new Response(null, {
    status: 301,
    headers: {
      Location: target.toString(),
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}

export const config = {
  matcher: [
    // Match all paths except static files and API internals
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/).*)',
  ],
}
