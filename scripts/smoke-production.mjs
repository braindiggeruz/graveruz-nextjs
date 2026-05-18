#!/usr/bin/env node
/**
 * Production smoke check for Graver.uz.
 *
 * Runs after Cloudflare deploy. Hits a curated list of money pages,
 * blog posts, homepage RU/UZ, sitemap/robots, admin-tools root, and
 * checks both HTTP status AND key content/SEO signals:
 *   - homepage hero contains the CMS-driven copy (RU + UZ)
 *   - <title>, <meta description>, <link rel=canonical>, <meta og:title>,
 *     <link rel=alternate hreflang> are present per locale
 *   - sitemap.xml lists the money pages
 *   - robots.txt does not block the whole site
 *   - every service-card href on /ru/ and /uz/ resolves to 200
 *   - every CTA href in the hero resolves to 200 (or is an anchor / tg link)
 *
 * Usage:
 *   node scripts/smoke-production.mjs               # checks https://graver-studio.uz
 *   BASE_URL=https://x.pages.dev node scripts/smoke-production.mjs
 *
 * Exit:
 *   0 — all required checks passed (warnings allowed)
 *   1 — at least one FATAL failure (broken URL, missing critical SEO signal)
 */
const BASE = (process.env.BASE_URL || 'https://graver-studio.uz').replace(/\/$/, '')
const STORY_RU_1 = '/ru/blog/welcome-pack-dlya-sotrudnikov/'
const STORY_RU_2 = '/ru/blog/podarki-sotrudnikam-hr-gayd/'
const STORY_UZ_1 = '/uz/blog/xodimlar-uchun-welcome-pack/'
const STORY_UZ_2 = '/uz/blog/xodimlar-uchun-sovgalar-hr-qollanma/'

const RU_PAGES = [
  '/',
  '/ru/',
  '/ru/lazernaya-gravirovka-tashkent/',
  '/ru/korporativnye-podarki/',
  '/ru/welcome-packs/',
  '/ru/vip-podarki/',
  '/ru/engraved-gifts/',
  '/ru/catalog-products/',
  STORY_RU_1,
  STORY_RU_2,
]
const UZ_PAGES = [
  '/uz/',
  '/uz/toshkentda-lazer-gravyura/',
  '/uz/toshkentda-korporativ-sovgalar/',
  '/uz/welcome-packs/',
  '/uz/vip-podarki/',
  '/uz/engraved-gifts/',
  '/uz/catalog-products/',
  STORY_UZ_1,
  STORY_UZ_2,
]
const SYSTEM_PAGES = ['/robots.txt', '/sitemap.xml']

const fatal = []
const warn = []
const pass = []
const seenHtmlCache = new Map()

async function fetchText(url, accept = 'text/html') {
  if (seenHtmlCache.has(url)) return seenHtmlCache.get(url)
  const res = await fetch(url, { headers: { Accept: accept, 'User-Agent': 'graver-smoke/1.0' }, redirect: 'manual' })
  const text = res.ok ? await res.text() : ''
  const out = { status: res.status, headers: Object.fromEntries(res.headers), text }
  seenHtmlCache.set(url, out)
  return out
}
async function head(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual', headers: { 'User-Agent': 'graver-smoke/1.0' } })
    return res.status
  } catch (e) {
    return 0
  }
}

function check(condition, okMsg, failMsg, severity = 'fatal') {
  if (condition) pass.push(okMsg)
  else (severity === 'fatal' ? fatal : warn).push(failMsg)
}

async function check200(path) {
  const url = `${BASE}${path}?v=smoke-${Date.now()}`
  const r = await fetchText(url)
  // Root `/` is allowed to return 301/308 to the default locale.
  const okStatus = path === '/' ? [200, 301, 308].includes(r.status) : r.status === 200
  check(okStatus, `${r.status} ${path}`, `expected 200 for ${path}, got ${r.status}`)
  return r
}

function metaContent(html, prop) {
  const m = html.match(new RegExp(`<meta[^>]*(?:name|property)=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i'))
  return m ? m[1] : ''
}
function tagContent(html, regex) {
  const m = html.match(regex)
  return m ? m[1] : ''
}
function allMatches(html, regex) {
  const out = []
  let m
  while ((m = regex.exec(html)) !== null) out.push(m[1])
  return out
}

async function checkHomepage(locale) {
  const r = await check200(`/${locale}/`)
  if (r.status !== 200) return
  const html = r.text

  if (locale === 'ru') {
    check(
      /Корпоративные подарки, welcome pack и VIP-наборы/.test(html),
      'RU hero H1 from CMS',
      'RU hero H1 missing CMS copy "Корпоративные подарки, welcome pack и VIP-наборы"',
    )
    check(/с персонализацией/.test(html), 'RU hero accent from CMS', 'RU hero accent missing "с персонализацией"')
  } else {
    check(
      /Korporativ sovg.alar, welcome pack va VIP-to.plamlar/.test(html),
      'UZ hero H1 from CMS',
      'UZ hero H1 missing CMS copy "Korporativ sovg‘alar, welcome pack va VIP-to‘plamlar"',
    )
    check(/personalizatsiya bilan/.test(html), 'UZ hero accent from CMS', 'UZ hero accent missing "personalizatsiya bilan"')
  }

  const title = tagContent(html, /<title[^>]*>([^<]+)<\/title>/i)
  const desc = metaContent(html, 'description')
  const ogTitle = metaContent(html, 'og:title')
  const canonical = tagContent(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  const hreflangRu = tagContent(html, /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']ru["'][^>]+href=["']([^"']+)["']/i)
  const hreflangUz = tagContent(html, /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']uz["'][^>]+href=["']([^"']+)["']/i)

  check(!!title, `<title> on /${locale}/`, `<title> missing on /${locale}/`)
  check(!!desc, `<meta description> on /${locale}/`, `<meta description> missing on /${locale}/`)
  check(!!ogTitle, `<og:title> on /${locale}/`, `<og:title> missing on /${locale}/`, 'warn')
  check(!!canonical, `<canonical> on /${locale}/`, `<link rel=canonical> missing on /${locale}/`)
  check(!!hreflangRu && !!hreflangUz, `hreflang ru+uz on /${locale}/`, `hreflang ru/uz missing on /${locale}/`)

  if (locale === 'ru') {
    check(/гравиров|корпоратив|подарк/i.test(title), 'RU title is in Russian', `RU title looks non-RU: ${title}`)
  } else {
    check(/lazer|gravyura|sovg|brendlash/i.test(title), 'UZ title is in Uzbek', `UZ title looks non-UZ: ${title}`)
  }

  // Service hrefs on this homepage
  const serviceHrefs = allMatches(
    html,
    /<a\s+href="(\/[^"]+)"\s+class="block bg-gray-800\/50/g,
  )
  if (serviceHrefs.length === 0) warn.push(`no service cards detected on /${locale}/`)
  for (const h of serviceHrefs) {
    const url = `${BASE}${h}`
    const code = await head(url)
    check(
      code === 200 || code === 301 || code === 308,
      `service link 200 ${h}`,
      `service link ${h} returned ${code}`,
    )
  }

  // CTA hrefs from hero: primary + secondary
  const primaryCta = tagContent(
    html,
    /<a\s+href="([^"]+)"\s+class="w-full sm:w-auto bg-gradient-to-r from-teal-500/i,
  )
  const secondaryCta = tagContent(
    html,
    /<a\s+href="([^"]+)"\s+data-track="tg"/i,
  )
  for (const [label, href] of [['primary', primaryCta], ['secondary', secondaryCta]]) {
    if (!href) {
      warn.push(`hero ${label} CTA href not detected on /${locale}/`)
      continue
    }
    if (href.startsWith('#')) { pass.push(`hero ${label} CTA is anchor: ${href}`); continue }
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://t.me/') || href.startsWith('https://wa.me/')) {
      pass.push(`hero ${label} CTA is external safe link: ${href}`); continue
    }
    if (href.startsWith('/')) {
      const code = await head(`${BASE}${href}`)
      check(code === 200, `hero ${label} CTA 200 ${href}`, `hero ${label} CTA ${href} returned ${code}`)
    } else if (href.startsWith('http')) {
      const code = await head(href)
      check(code < 400, `hero ${label} CTA external ok ${href}`, `hero ${label} CTA ${href} returned ${code}`, 'warn')
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────
console.log(`[smoke:prod] base=${BASE}`)

const allPages = [...RU_PAGES, ...UZ_PAGES]
for (const p of allPages) {
  await check200(p)
}

// System
const robots = await fetchText(`${BASE}/robots.txt`, 'text/plain')
check(robots.status === 200, 'robots.txt 200', `robots.txt returned ${robots.status}`)
check(
  robots.status === 200 && !/^Disallow:\s*\/\s*$/m.test(robots.text || ''),
  'robots.txt does not block whole site',
  'robots.txt disallows entire site',
)

const sitemap = await fetchText(`${BASE}/sitemap.xml`, 'application/xml')
check(sitemap.status === 200, 'sitemap.xml 200', `sitemap.xml returned ${sitemap.status}`)
const MUST_SITEMAP = [
  '/ru/lazernaya-gravirovka-tashkent/',
  '/ru/korporativnye-podarki/',
  '/ru/welcome-packs/',
  '/uz/toshkentda-lazer-gravyura/',
  '/uz/toshkentda-korporativ-sovgalar/',
]
for (const p of MUST_SITEMAP) {
  check(
    (sitemap.text || '').includes(p),
    `sitemap.xml lists ${p}`,
    `sitemap.xml is missing ${p}`,
  )
}

// Homepage deep checks
await checkHomepage('ru')
await checkHomepage('uz')

// Admin tools — must respond, must not leak secrets in body
const adminPaths = ['/admin-tools/', '/admin-tools/health/', '/admin-tools/publish-checklist/', '/admin-tools/redirects/']
for (const p of adminPaths) {
  const r = await fetchText(`${BASE}${p}`)
  // Admin tools are token-gated; 200 (TokenForm) and 401 (auth gate) are both acceptable.
  // 404 is acceptable only on a freshly-deployed branch before the route is built.
  const okStatus = [200, 401].includes(r.status)
  check(okStatus, `admin ${p} responds (${r.status})`, `admin ${p} returned ${r.status}`, 'warn')
  if (r.text && /ADMIN_TOOLS_TOKEN[^<]*=\s*[A-Za-z0-9]/i.test(r.text)) {
    fatal.push(`admin ${p} appears to leak ADMIN_TOOLS_TOKEN value in HTML`)
  }
}

// ── Report ─────────────────────────────────────────────────────────
console.log(`\n[smoke:prod] ${pass.length} pass · ${warn.length} warning(s) · ${fatal.length} fatal`)
for (const w of warn) console.warn(`  ⚠ ${w}`)
for (const f of fatal) console.error(`  ✘ ${f}`)

if (fatal.length > 0) {
  console.error('\n[smoke:prod] FAILED. Fix above before sending URLs to GSC.')
  process.exit(1)
}
console.log('[smoke:prod] OK ✓ (warnings only)')
process.exit(0)
