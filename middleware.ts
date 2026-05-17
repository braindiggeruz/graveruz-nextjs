import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, isValidLocale } from './lib/i18n'

/**
 * Middleware responsibilities:
 *
 * 1. Keystatic admin (`/keystatic/*`): strip trailing slash so the
 *    client-side Keystatic router matches (trailing slash breaks it and
 *    shows "Not found" for collection / singleton list views).
 *
 * 2. Public pages: enforce trailing slash (canonical form) for SEO.
 *    This used to be handled by Next.js automatic redirect from
 *    `trailingSlash: true`, but we disabled that via
 *    `skipTrailingSlashRedirect: true` so we can opt-out Keystatic.
 *
 * 3. Root `/` → `/ru/` locale redirect (unchanged).
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

  // ── 3. Locale prefix check ──────────────────────────────────────────────
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

  // ── 4. No locale prefix — redirect to default locale WITH trailing slash ─
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
