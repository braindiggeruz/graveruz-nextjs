import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Diagnostic: dump which KEYSTATIC_* env vars are visible at runtime (no values). */
export async function GET(_req: NextRequest) {
  const probe: Record<string, unknown> = {
    processEnvKeys: Object.keys(process.env).filter((k) => /KEYSTATIC|NEXT_PUBLIC|TELEMETRY|NODE/.test(k)),
    processEnvValuePresence: {} as Record<string, boolean>,
  }
  for (const k of [
    'KEYSTATIC_GITHUB_CLIENT_ID',
    'KEYSTATIC_GITHUB_CLIENT_SECRET',
    'KEYSTATIC_SECRET',
    'KEYSTATIC_STORAGE',
    'KEYSTATIC_URL',
    'KEYSTATIC_GITHUB_REPO_NAME',
    'KEYSTATIC_GITHUB_REPO_OWNER',
    'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  ]) {
    ;(probe.processEnvValuePresence as Record<string, boolean>)[k] = !!process.env[k]
  }

  try {
    const mod = await import('@opennextjs/cloudflare')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = (mod as any).getCloudflareContext?.()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (ctx?.env || {}) as Record<string, any>
    probe.cloudflareCtxAvailable = !!ctx
    probe.cloudflareEnvKeys = Object.keys(env).filter((k) => /KEYSTATIC|NEXT_PUBLIC|NODE/.test(k))
    probe.cloudflareEnvValuePresence = Object.fromEntries(
      [
        'KEYSTATIC_GITHUB_CLIENT_ID',
        'KEYSTATIC_GITHUB_CLIENT_SECRET',
        'KEYSTATIC_SECRET',
        'KEYSTATIC_STORAGE',
        'KEYSTATIC_URL',
        'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
      ].map((k) => [k, typeof env[k] === 'string' && env[k].length > 0])
    )
  } catch (e) {
    probe.cloudflareCtxAvailable = false
    probe.cloudflareCtxError = String(e)
  }

  return new Response(JSON.stringify(probe, null, 2), {
    headers: { 'content-type': 'application/json' },
  })
}
