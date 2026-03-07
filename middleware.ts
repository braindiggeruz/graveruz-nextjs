import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLocale } from './lib/i18n'

export const runtime = 'edge'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // Check if pathname already starts with a valid locale
  const segments = pathname.split('/')
  const firstSegment = segments[1]

  if (firstSegment && isValidLocale(firstSegment)) {
    // Valid locale prefix — pass through
    return NextResponse.next()
  }

  // No locale prefix — redirect to default locale
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url, { status: 302 })
}

export const config = {
  matcher: [
    // Match all paths except static files and API
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/).*)',
  ],
}
