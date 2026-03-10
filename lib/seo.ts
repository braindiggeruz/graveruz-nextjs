import type { Metadata } from 'next'
import { type Locale, getLocaleUrl, getHreflang, SUPPORTED_LOCALES } from './i18n'

const SITE_NAME = 'Graver.uz'
const BASE_URL = 'https://graver-studio.uz'

interface SeoParams {
  locale: Locale
  path?: string           // e.g. '' for homepage, 'blog/my-slug' for article
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  noindex?: boolean
  canonicalOverride?: string  // full URL to override canonical (for duplicate posts)
  alternateSlug?: Partial<Record<Locale, string>>  // for blog posts with different slugs per locale
}

/**
 * Builds a complete Next.js Metadata object with:
 * - title / description
 * - canonical (self-referencing)
 * - hreflang alternates
 * - OG tags
 * - noindex when needed
 */
export function buildMetadata(params: SeoParams): Metadata {
  const {
    locale,
    path = '',
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage = `${BASE_URL}/images/og/og-home.jpg`,
    noindex = false,
    canonicalOverride,
    alternateSlug,
  } = params

  // Use canonicalOverride if provided (e.g. for duplicate/thin posts that should point to the canonical version)
  const canonicalUrl = canonicalOverride ?? getLocaleUrl(locale, path)

  // Build hreflang alternates
  // For blog articles: only add a locale alternate if a true counterpart exists.
  // If alternateSlug is provided (non-null), it means this page has locale-specific slugs.
  // Only include a locale if: (a) it's the current locale, OR (b) alternateSlug[loc] is explicitly set.
  // This prevents fake hreflang links that would 404 for Googlebot.
  const languages: Record<string, string> = {}
  const isBlogArticle = alternateSlug !== undefined  // alternateSlug presence signals blog article
  for (const loc of SUPPORTED_LOCALES) {
    if (isBlogArticle) {
      // Only add alternate for this locale if it's the current locale OR has an explicit alternateSlug
      if (loc === locale) {
        languages[getHreflang(loc)] = getLocaleUrl(loc, path)
      } else if (alternateSlug?.[loc]) {
        const altPath = path.replace(/[^/]*$/, alternateSlug[loc]!)
        languages[getHreflang(loc)] = getLocaleUrl(loc, altPath)
      }
      // else: skip — no fake hreflang for missing counterpart
    } else {
      // Non-article pages: always include all locales (same path structure)
      languages[getHreflang(loc)] = getLocaleUrl(loc, path)
    }
  }
  // x-default: for articles with no RU alternate, point to current page; otherwise point to RU
  if (isBlogArticle) {
    const ruPath = alternateSlug?.['ru'] ? path.replace(/[^/]*$/, alternateSlug['ru']!) : (locale === 'ru' ? path : null)
    languages['x-default'] = ruPath ? getLocaleUrl('ru', ruPath) : getLocaleUrl(locale, path)
  } else {
    languages['x-default'] = getLocaleUrl('ru', path)
  }

  const metadata: Metadata = {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: locale === 'uz' ? 'uz_UZ' : 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [ogImage],
    },
  }

  if (noindex) {
    metadata.robots = { index: false, follow: false }
  }

  return metadata
}

/**
 * Builds metadata for a blog article page.
 */
export function buildArticleMetadata(params: SeoParams & {
  publishedTime: string
  author?: string
}): Metadata {
  const base = buildMetadata(params)
  const canonicalUrl = params.canonicalOverride ?? getLocaleUrl(params.locale, params.path ?? '')

  return {
    ...base,
    // Override to template title (not absolute) so layout appends "| Graver.uz" consistently
    title: params.title,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: params.publishedTime,
      authors: params.author ? [params.author] : ['Graver.uz'],
    },
  }
}
