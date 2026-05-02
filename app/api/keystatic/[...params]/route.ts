import type { NextRequest } from 'next/server'
import config from '@/keystatic.config'

/**
 * Keystatic admin API route — runtime-only initialization.
 *
 * `makeRouteHandler` from @keystatic/next reads KEYSTATIC_GITHUB_* env vars
 * synchronously on construction.  On Cloudflare Pages those vars are NOT
 * available during `next build` (only at runtime), so we MUST defer the
 * factory call until the first request.
 *
 * `force-dynamic` + `nodejs` runtime ensure Next.js never tries to pre-render
 * this endpoint.
 */
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: { GET: (req: Request) => Promise<Response>; POST: (req: Request) => Promise<Response> } | null = null

async function getHandlers() {
  if (!cached) {
    const { makeRouteHandler } = await import('@keystatic/next/route-handler')
    cached = makeRouteHandler({ config }) as typeof cached
  }
  return cached!
}

export async function GET(req: NextRequest) {
  const h = await getHandlers()
  return h.GET(req as unknown as Request)
}

export async function POST(req: NextRequest) {
  const h = await getHandlers()
  return h.POST(req as unknown as Request)
}
