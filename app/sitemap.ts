import type { MetadataRoute } from 'next'
import { getAllPostsMeta } from '@/lib/blog'
import { SUPPORTED_LOCALES, getLocaleUrl } from '@/lib/i18n'

const BASE_URL = 'https://graver-studio.uz'

// Static pages (non-blog) with their paths
const STATIC_PAGES = [
  '',                          // homepage
  'engraved-gifts',
  'catalog-products',
  'products/neo-watches',
  'products/lighters',
  'products/pens',
  'products/powerbanks',
  'products/notebooks',
  'guarantees',
  'contacts',
  'blog',
]

// Pages that should NOT appear in sitemap
const EXCLUDED_PAGES = new Set(['thanks'])

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
    const ruSlug = post.alternateSlug?.ru || post.slug.replace(/-uz$/, '')
    const ruUrl = getLocaleUrl('ru', `blog/${ruSlug}`)

    const languages: Record<string, string> = {
      uz: uzUrl,
      ru: ruUrl,
      'x-default': ruUrl,
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
