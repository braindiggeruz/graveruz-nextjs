import fs from 'node:fs'
import path from 'node:path'
import type { MetadataRoute } from 'next'
import { getAllPostsMeta } from '@/lib/blog'
import { SUPPORTED_LOCALES, getLocaleUrl, type Locale } from '@/lib/i18n'
import { getAllPages } from '@/lib/cms'

const BASE_URL = 'https://graver-studio.uz'

/**
 * Parse public/_redirects and return the set of blog slugs that are
 * permanently redirected away (i.e. they are the SOURCE of a 301).
 *
 * Single source of truth: instead of hand-maintaining REDIRECTED_*_SLUGS
 * (which drifted — only 3 of ~44 redirected duplicates were listed), we
 * derive the exclusion set directly from the redirect file so the sitemap
 * can never emit a URL that 301s to another canonical. Prevents wasted crawl
 * budget and cannibalization signals from duplicate/merged blog posts.
 */
function parseRedirectedBlogSlugs(): { ru: Set<string>; uz: Set<string> } {
  const ru = new Set<string>()
  const uz = new Set<string>()
  try {
    const file = path.join(process.cwd(), 'public', '_redirects')
    const text = fs.readFileSync(file, 'utf8')
    for (const raw of text.split('\n')) {
      const line = raw.trim()
      if (!line || line.startsWith('#')) continue
      const [source, , status] = line.split(/\s+/)
      if (!source) continue
      if (status && status !== '301' && status !== '308') continue
      const m = source.match(/^\/(ru|uz)\/blog\/([a-z0-9-]+)\/?$/)
      if (!m) continue
      const [, locale, slug] = m
      if (locale === 'ru') ru.add(slug)
      else uz.add(slug)
    }
  } catch (err) {
    console.warn('[sitemap] could not parse _redirects:', err)
  }
  return { ru, uz }
}

const REDIRECTED_FROM_FILE = parseRedirectedBlogSlugs()

// Static pages (non-blog) with their paths
const STATIC_PAGES = [
  '',                          // homepage
  'engraved-gifts',
  // 'korporativnye-podarki' moved to LOCALIZED_PAIRED_PAGES — its UZ money page
  // uses a localized slug (toshkentda-korporativ-sovgalar). Emitting it here
  // wrongly produced /uz/korporativnye-podarki/ which now 301-redirects.
  'welcome-packs',
  'vip-podarki',
  'catalog-products',
  'products/neo-watches',
  'products/lighters',
  'products/pens',
  'products/powerbanks',
  'products/notebooks',
  'guarantees',
  'contacts',
  'about',
  'blog',
]

// Pages with different slugs per locale — they need explicit per-locale
// sitemap entries with cross-language hreflang pairing.
// { locale, path } pairs that should appear in the sitemap as-is.
const LOCALIZED_PAIRED_PAGES: Array<{ ru: string; uz: string }> = [
  { ru: 'podarochniy-nabor-s-chasami', uz: 'soatli-sovga-toplami' },
  // RU corporate landing (static route) ↔ UZ corporate money page (CMS, localized slug).
  { ru: 'korporativnye-podarki', uz: 'toshkentda-korporativ-sovgalar' },
]

// Pages that should NOT appear in sitemap
const EXCLUDED_PAGES = new Set(['thanks'])

// CMS-managed slugs whose page route is redirected elsewhere (next.config.mjs
// /redirects or middleware). They must NOT appear in the sitemap.
const REDIRECTED_CMS_SLUGS = new Set<string>([
  'korporativnye-podarki-tashkent', // → /ru/korporativnye-podarki/ (intentional, owner config)
])

// Final-canonical mapping for CMS slugs referenced by *other* pages'
// alternateSlug field. Without this, sitemap hreflang/alternate entries
// would point at a redirected URL (308) instead of the live canonical.
const CMS_ALT_SLUG_REWRITES: Record<string, string> = {
  'korporativnye-podarki-tashkent': 'korporativnye-podarki',
}

// RU blog slugs that are permanently redirected to a different canonical slug.
// These must NOT appear in the sitemap — they would send Googlebot to a 308 redirect.
// Hand-listed legacy entries are kept for clarity; the authoritative set is
// merged from _redirects (parseRedirectedBlogSlugs) so this can never drift.
const REDIRECTED_RU_SLUGS = new Set<string>([
  'chto-podarit-kollege-na-8-marta',             // -> podarki-8-marta-20-idej
  'keys-welcome-pak-it-kompaniya-tashkent',       // -> keys-welcome-pack-enps-uzbekistan
  'podarki-na-8-marta-sotrudnicam',               // -> podarki-8-marta-20-idej
  ...REDIRECTED_FROM_FILE.ru,
])

// UZ blog slugs that are permanently redirected or otherwise should not appear in sitemap.
const REDIRECTED_UZ_SLUGS = new Set<string>([
  ...REDIRECTED_FROM_FILE.uz,
])

/**
 * Safely parse a date string. Returns a valid Date or `new Date()` if parsing fails.
 * Prevents RangeError: Invalid time value from breaking the sitemap build.
 */
function safeDate(input?: string): Date {
  if (!input) return new Date()
  const d = new Date(input)
  if (isNaN(d.getTime())) {
    console.warn(`[sitemap] invalid date "${input}", falling back to now`)
    return new Date()
  }
  return d
}

/**
 * Determines whether a post's canonicalOverride points to itself (safe) or to
 * another URL (means this post is a duplicate that should not be in sitemap).
 */
function canonicalPointsElsewhere(locale: Locale, slug: string, canonicalOverride?: string): boolean {
  if (!canonicalOverride) return false
  const selfUrl = getLocaleUrl(locale, `blog/${slug}`)
  // Normalize trailing slash for comparison
  const normalize = (u: string) => u.replace(/\/+$/, '')
  return normalize(canonicalOverride) !== normalize(selfUrl)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // ── Static pages ──
  for (const pagePath of STATIC_PAGES) {
    if (EXCLUDED_PAGES.has(pagePath)) continue

    const languages: Record<string, string> = {}
    for (const locale of SUPPORTED_LOCALES) {
      languages[locale === 'uz' ? 'uz' : 'ru'] = getLocaleUrl(locale, pagePath)
    }
    languages['x-default'] = getLocaleUrl('ru', pagePath)

    entries.push({
      url: getLocaleUrl('ru', pagePath),
      lastModified: new Date(),
      changeFrequency: pagePath === '' ? 'weekly' : 'monthly',
      priority: pagePath === '' ? 1.0 : 0.8,
      alternates: { languages },
    })

    // Also add UZ version as separate entry
    entries.push({
      url: getLocaleUrl('uz', pagePath),
      lastModified: new Date(),
      changeFrequency: pagePath === '' ? 'weekly' : 'monthly',
      priority: pagePath === '' ? 0.9 : 0.7,
      alternates: { languages },
    })
  }

  // ── Locale-paired commercial landings (RU/UZ have different slugs) ──
  for (const pair of LOCALIZED_PAIRED_PAGES) {
    const ruUrl = getLocaleUrl('ru', pair.ru)
    const uzUrl = getLocaleUrl('uz', pair.uz)
    const languages: Record<string, string> = {
      ru: ruUrl,
      uz: uzUrl,
      'x-default': ruUrl,
    }
    entries.push({
      url: ruUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages },
    })
    entries.push({
      url: uzUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages },
    })
  }

  // ── Blog posts ──
  const ruPosts = getAllPostsMeta('ru')
  const uzPosts = getAllPostsMeta('uz')

  // Build RU slug set for existence checks (prevents fake hreflang pointing to 404)
  const ruSlugSet = new Set(ruPosts.map((p) => p.slug))
  const uzSlugSet = new Set(uzPosts.map((p) => p.slug))

  // Build UZ slug lookup for cross-referencing
  const uzSlugByRu: Record<string, string> = {}
  for (const uzPost of uzPosts) {
    if (uzPost.alternateSlug?.ru) {
      uzSlugByRu[uzPost.alternateSlug.ru] = uzPost.slug
    }
    // Also try -uz suffix pattern
    const ruEquivalent = uzPost.slug.replace(/-uz$/, '')
    if (ruEquivalent !== uzPost.slug) {
      uzSlugByRu[ruEquivalent] = uzPost.slug
    }
  }

  for (const post of ruPosts) {
    // Skip noindex posts — they should not appear in sitemap
    if (post.noindex) continue
    // Skip posts whose canonicalOverride points to a different URL — sitemap must only
    // contain canonical (self-referencing) URLs.
    if (canonicalPointsElsewhere('ru', post.slug, post.canonicalOverride)) continue
    // Skip slugs that are permanently redirected to a different canonical — sitemap must only
    // contain final 200 URLs. Redirecting URLs in sitemap waste crawl budget and confuse Google.
    if (REDIRECTED_RU_SLUGS.has(post.slug)) continue

    const ruUrl = getLocaleUrl('ru', `blog/${post.slug}`)
    // Resolve UZ counterpart: prefer the value declared on the RU post; fall back to
    // a UZ post that points back via alternateSlug.ru.
    const declaredUzSlug = post.alternateSlug?.uz
    const inferredUzSlug = uzSlugByRu[post.slug]
    const candidateUzSlug = declaredUzSlug || inferredUzSlug
    // Counterpart is valid only if the file exists AND it is not itself
    // permanently redirected (else hreflang would point at a 301).
    const confirmedUzSlug =
      candidateUzSlug && uzSlugSet.has(candidateUzSlug) && !REDIRECTED_UZ_SLUGS.has(candidateUzSlug)
        ? candidateUzSlug
        : null

    // Only include UZ hreflang if a real UZ counterpart exists
    const languages: Record<string, string> = { ru: ruUrl, 'x-default': ruUrl }
    if (confirmedUzSlug) {
      languages['uz'] = getLocaleUrl('uz', `blog/${confirmedUzSlug}`)
    }

    entries.push({
      url: ruUrl,
      lastModified: safeDate(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages },
    })
  }

  for (const post of uzPosts) {
    // Skip noindex posts — they should not appear in sitemap
    if (post.noindex) continue
    // Skip posts whose canonicalOverride points to a different URL
    if (canonicalPointsElsewhere('uz', post.slug, post.canonicalOverride)) continue
    if (REDIRECTED_UZ_SLUGS.has(post.slug)) continue

    const uzUrl = getLocaleUrl('uz', `blog/${post.slug}`)

    // Determine the RU counterpart slug:
    //   1. Explicit alternateSlug.ru in frontmatter (most reliable)
    //   2. -uz suffix removal (e.g. "my-post-uz" -> "my-post") — only if that RU slug actually exists
    //   3. No fallback to UZ slug — that would generate /ru/blog/uz-slug/ which 404s
    const candidateRuSlug = post.alternateSlug?.ru ?? (
      post.slug.endsWith('-uz') ? post.slug.replace(/-uz$/, '') : null
    )
    // Counterpart is valid only if the file exists AND is not itself redirected
    // (else hreflang would point at a 301).
    const confirmedRuSlug =
      candidateRuSlug && ruSlugSet.has(candidateRuSlug) && !REDIRECTED_RU_SLUGS.has(candidateRuSlug)
        ? candidateRuSlug
        : null

    const languages: Record<string, string> = { uz: uzUrl }
    if (confirmedRuSlug) {
      const ruUrl = getLocaleUrl('ru', `blog/${confirmedRuSlug}`)
      languages['ru'] = ruUrl
      languages['x-default'] = ruUrl
    } else {
      // UZ-only post: x-default points to the UZ page itself (no RU counterpart exists)
      languages['x-default'] = uzUrl
    }

    entries.push({
      url: uzUrl,
      lastModified: safeDate(post.date),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages },
    })
  }

  // ── CMS-managed commercial pages (created via Keystatic admin) ──
  // Skip noindex pages and reserved slugs (already covered by STATIC_PAGES or
  // by LOCALIZED_PAIRED_PAGES above).
  const cmsReservedSlugs = new Set<string>([
    ...STATIC_PAGES.map((p) => p.split('/')[0]),
    ...LOCALIZED_PAIRED_PAGES.flatMap((p) => [p.ru, p.uz]),
  ])
  try {
    const cmsPages = await getAllPages()
    for (const page of cmsPages) {
      if (page.status !== 'published') continue
      if (page.seo?.noindex) continue
      if (cmsReservedSlugs.has(page.slug)) continue
      if (REDIRECTED_CMS_SLUGS.has(page.slug)) continue
      const locale = (page.locale as Locale) || 'ru'

      const altSlugs: Partial<Record<Locale, string>> = {}
      if (page.alternateSlug?.ru) {
        const s = page.alternateSlug.ru
        altSlugs.ru = CMS_ALT_SLUG_REWRITES[s] ?? s
      }
      if (page.alternateSlug?.uz) {
        const s = page.alternateSlug.uz
        altSlugs.uz = CMS_ALT_SLUG_REWRITES[s] ?? s
      }

      const languages: Record<string, string> = {
        [locale]: getLocaleUrl(locale, page.slug),
      }
      for (const otherLocale of SUPPORTED_LOCALES) {
        const altSlug = altSlugs[otherLocale]
        if (altSlug) languages[otherLocale] = getLocaleUrl(otherLocale, altSlug)
      }
      languages['x-default'] = languages.ru || languages[locale]

      entries.push({
        url: getLocaleUrl(locale, page.slug),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages },
      })
    }
  } catch (err) {
    console.warn('[sitemap] failed to read CMS pages:', err)
  }

  return entries
}
