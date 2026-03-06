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
    alternateSlug,
  } = params

  const canonicalUrl = getLocaleUrl(locale, path)

  // Build hreflang alternates
  const languages: Record<string, string> = {}
  for (const loc of SUPPORTED_LOCALES) {
    const altPath = alternateSlug?.[loc]
      ? path.replace(/[^/]*$/, alternateSlug[loc]!)  // replace slug part
      : path
    languages[getHreflang(loc)] = getLocaleUrl(loc, altPath)
  }
  // x-default points to the Russian version
  languages['x-default'] = getLocaleUrl('ru', path)

  const metadata: Metadata = {
    title,
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
  const canonicalUrl = getLocaleUrl(params.locale, params.path ?? '')

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: params.publishedTime,
      authors: params.author ? [params.author] : ['Graver.uz'],
    },
  }
}
