import type { MetadataRoute } from 'next'
import { getAllPostsMeta } from '@/lib/blog'
import { SUPPORTED_LOCALES, getLocaleUrl } from '@/lib/i18n'

const BASE_URL = 'https://graver-studio.uz'

// Static pages (non-blog) with their paths
const STATIC_PAGES = [
  '',                          // homepage
  'engraved-gifts',
  'korporativnye-podarki',
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

// Pages that should NOT appear in sitemap
const EXCLUDED_PAGES = new Set(['thanks'])

// RU blog slugs that are permanently redirected to a different canonical slug.
// These must NOT appear in the sitemap — they would send Googlebot to a 308 redirect.
const REDIRECTED_RU_SLUGS = new Set([
  'chto-podarit-kollege-na-8-marta',             // -> podarki-8-marta-20-idej
  'keys-welcome-pak-it-kompaniya-tashkent',       // -> keys-welcome-pack-enps-uzbekistan
  'podarki-na-8-marta-sotrudnicam',               // -> podarki-8-marta-20-idej
])

export default function sitemap(): MetadataRoute.Sitemap {
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

  // ── Blog posts ──
  const ruPosts = getAllPostsMeta('ru')
  const uzPosts = getAllPostsMeta('uz')

  // Build RU slug set for existence checks (prevents fake hreflang pointing to 404)
  const ruSlugSet = new Set(ruPosts.map((p) => p.slug))

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
    // Skip slugs that are permanently redirected to a different canonical — sitemap must only
    // contain final 200 URLs. Redirecting URLs in sitemap waste crawl budget and confuse Google.
    if (REDIRECTED_RU_SLUGS.has(post.slug)) continue

    const ruUrl = getLocaleUrl('ru', `blog/${post.slug}`)
    const uzSlug = uzSlugByRu[post.slug] || post.alternateSlug?.uz

    // Only include UZ hreflang if a real UZ counterpart exists
    const languages: Record<string, string> = { ru: ruUrl, 'x-default': ruUrl }
    if (uzSlug) {
      languages['uz'] = getLocaleUrl('uz', `blog/${uzSlug}`)
    }

    entries.push({
      url: ruUrl,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages },
    })
  }

  for (const post of uzPosts) {
    const uzUrl = getLocaleUrl('uz', `blog/${post.slug}`)

    // Determine the RU counterpart slug:
    //   1. Explicit alternateSlug.ru in frontmatter (most reliable)
    //   2. -uz suffix removal (e.g. "my-post-uz" -> "my-post") — only if that RU slug actually exists
    //   3. No fallback to UZ slug — that would generate /ru/blog/uz-slug/ which 404s
    const candidateRuSlug = post.alternateSlug?.ru ?? (
      post.slug.endsWith('-uz') ? post.slug.replace(/-uz$/, '') : null
    )
    const confirmedRuSlug = candidateRuSlug && ruSlugSet.has(candidateRuSlug) ? candidateRuSlug : null

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
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages },
    })
  }

  return entries
}
