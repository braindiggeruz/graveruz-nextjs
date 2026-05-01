import type { NextRequest } from 'next/server'
import config from '@/keystatic.config'

/**
 * Lazy-initialized Keystatic route handler.
 * makeRouteHandler() throws on module load if KEYSTATIC_GITHUB_* env vars are
 * missing. On Cloudflare Pages env vars are only available at RUNTIME (not at
 * the build-time `Collecting page data` step), so we defer handler creation
 * until the first request arrives.
 */
let cachedHandler: ((req: Request) => Promise<Response>) | null = null

async function getHandler(method: 'GET' | 'POST') {
  if (!cachedHandler) {
    const { makeRouteHandler } = await import('@keystatic/next/route-handler')
    const h = makeRouteHandler({ config })
    cachedHandler = async (req: Request) => {
      const fn = method === 'GET' ? h.GET : h.POST
      // Keystatic's wrappedHandler ignores the 2nd arg (route params)
      return fn(req as unknown as never, undefined as unknown as never)
    }
  }
  return cachedHandler
}

export async function GET(req: NextRequest) {
  const h = await getHandler('GET')
  return h(req as unknown as Request)
}

export async function POST(req: NextRequest) {
  const h = await getHandler('POST')
  return h(req as unknown as Request)
}
