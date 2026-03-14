import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, isValidLocale } from './lib/i18n'

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

  // No locale prefix — redirect to default locale with guaranteed 301.
  // We use a native Response with a Location header instead of
  // NextResponse.redirect() because some versions of OpenNext/Cloudflare
  // Workers override the custom status code and fall back to 302.
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  // Ensure trailing slash to match trailingSlash:true config
  if (!url.pathname.endsWith('/')) {
    url.pathname = url.pathname + '/'
  }
  return new Response(null, {
    status: 301,
    headers: {
      Location: url.toString(),
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}

export const config = {
  matcher: [
    // Match all paths except static files and API
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/).*)',
  ],
}
