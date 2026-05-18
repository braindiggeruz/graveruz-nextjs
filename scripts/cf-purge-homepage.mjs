#!/usr/bin/env node
/**
 * Cloudflare cache purge — homepage RU/UZ only.
 *
 * Safe scope: only the canonical homepage URLs. Does NOT do "purge everything".
 * Use after a Cloudflare deploy completes but live still serves a stale homepage.
 *
 * Requires env:
 *   CLOUDFLARE_API_TOKEN  — token with "Cache Purge" permission on the zone
 *   CLOUDFLARE_ZONE_ID    — graver-studio.uz zone id
 *
 * Never logs the token. Never writes it anywhere.
 */
const TOKEN = process.env.CLOUDFLARE_API_TOKEN
const ZONE = process.env.CLOUDFLARE_ZONE_ID

const URLS = [
  'https://graver-studio.uz/',
  'https://graver-studio.uz/ru/',
  'https://graver-studio.uz/uz/',
  'https://graver-studio.uz/sitemap.xml',
  'https://graver-studio.uz/robots.txt',
]

if (!TOKEN || !ZONE) {
  console.error('[cf:purge:home] CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID missing.')
  console.error('Set them as repo / CI secrets, then run:')
  console.error('  CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... npm run cf:purge:home')
  console.error('You can find the zone id at Cloudflare → graver-studio.uz → Overview → API.')
  process.exit(2) // 2 = config error, not a deploy failure
}

const body = JSON.stringify({ files: URLS })

try {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE}/purge_cache`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.success) {
    console.error(`[cf:purge:home] FAILED (${res.status}): ${JSON.stringify(json.errors || json)}`)
    process.exit(1)
  }
  console.log('[cf:purge:home] OK ✓ purged:')
  for (const u of URLS) console.log('  •', u)
  process.exit(0)
} catch (err) {
  console.error('[cf:purge:home] network error:', err.message)
  process.exit(1)
}
