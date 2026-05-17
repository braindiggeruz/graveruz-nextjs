/**
 * Admin Tools auth — query-param + cookie token gate.
 *
 * /admin-tools/* routes are protected by a shared secret token.
 * Token sources (in order):
 *   1. ?token=<value> in URL — sets a cookie and redirects (handled in page)
 *   2. graver_admin_tools_token cookie
 *
 * Token value: process.env.ADMIN_TOOLS_TOKEN. If unset on the server,
 * the routes return 503 with a clear "configure env" message.
 *
 * This is INTENTIONALLY simple. The endpoint is already gated by:
 *   • not linked anywhere public
 *   • robots disallow
 *   • token-gated read access
 *   • content shown is publicly visible anyway (slugs, titles)
 * If you need true auth — front it with Cloudflare Access on the route.
 */
import { cookies } from 'next/headers'

export const ADMIN_TOKEN_COOKIE = 'graver_admin_tools_token'

export function getServerToken(): string | null {
  const t = process.env.ADMIN_TOOLS_TOKEN
  return t && t.trim().length >= 8 ? t : null
}

export async function isAuthed(searchParamsToken?: string): Promise<boolean> {
  const server = getServerToken()
  if (!server) return false
  if (searchParamsToken && searchParamsToken === server) return true
  const store = await cookies()
  const c = store.get(ADMIN_TOKEN_COOKIE)?.value
  return !!c && c === server
}
