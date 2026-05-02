import type { NextRequest } from 'next/server'
import config from '@/keystatic.config'

/**
 * Keystatic admin API route — runtime-only initialization.
 *
 * @keystatic/core/api/generic reads KEYSTATIC_GITHUB_* env vars synchronously
 * from process.env on construction. On Cloudflare Pages env bindings need to
 * be explicitly hoisted into process.env (compatibility flag does it for vars
 * declared in wrangler.toml [vars], but Pages dashboard env vars on some
 * setups arrive only as Worker bindings via `env`, so we hoist them manually
 * for safety).
 */
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const KEYS_TO_HOIST = [
  'KEYSTATIC_GITHUB_CLIENT_ID',
  'KEYSTATIC_GITHUB_CLIENT_SECRET',
  'KEYSTATIC_SECRET',
  'KEYSTATIC_STORAGE',
  'KEYSTATIC_URL',
  'KEYSTATIC_GITHUB_REPO_NAME',
  'KEYSTATIC_GITHUB_REPO_OWNER',
  'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
] as const

async function hoistEnvFromCloudflare() {
  // Only hoist what's missing — avoid overriding values already in process.env
  if (KEYS_TO_HOIST.every((k) => process.env[k])) return
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const ctx = getCloudflareContext()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (ctx?.env || {}) as Record<string, any>
    for (const k of KEYS_TO_HOIST) {
      if (!process.env[k] && typeof env[k] === 'string') {
        process.env[k] = env[k]
      }
    }
  } catch {
    /* ignore — getCloudflareContext only available in CF runtime */
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: { GET: (req: Request) => Promise<Response>; POST: (req: Request) => Promise<Response> } | null = null

async function getHandlers() {
  await hoistEnvFromCloudflare()
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
