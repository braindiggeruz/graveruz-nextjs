import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '@/keystatic.config'

/**
 * Keystatic admin API route.
 *
 * `force-dynamic` + `nodejs` runtime are required so that Next.js does NOT try
 * to statically render this endpoint at build time on Cloudflare Pages /
 * OpenNext (where KEYSTATIC_GITHUB_* env vars are only injected at runtime).
 */
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const { GET, POST } = makeRouteHandler({ config })
