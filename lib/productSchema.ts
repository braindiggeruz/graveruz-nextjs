/**
 * Product schema auto-generated from Keystatic CMS fields.
 * Editor never writes JSON-LD — they fill structured pricing/reviews/FAQ
 * and this function assembles the full schema graph.
 */
import type { Locale } from '@/lib/i18n'

interface CMSPricingTier {
  price?: number | null
  priceDisplay?: string | null
  nameRu?: string
  nameUz?: string
}

interface CMSReview {
  authorName?: string
  rating?: number | null
  textRu?: string
  textUz?: string
}

interface CMSFaq {
  qRu?: string
  qUz?: string
  aRu?: string
  aUz?: string
}

export interface CMSProduct {
  slug: string
  nameRu?: string
  nameUz?: string
  descriptionRu?: string
  descriptionUz?: string
  heroImage?: string | null
  brand?: string | null
  availability?: 'InStock' | 'PreOrder' | 'OutOfStock'
  pricingTiers?: readonly CMSPricingTier[]
  aggregateRating?: { value?: string; count?: string } | null
  reviews?: readonly CMSReview[]
  faq?: readonly CMSFaq[]
}

const BASE = 'https://graver-studio.uz'

export function productSchemaFromCMS(product: CMSProduct, locale: Locale) {
  const isRu = locale === 'ru'
  const name = (isRu ? product.nameRu : product.nameUz) || product.nameRu || ''
  const description = (isRu ? product.descriptionRu : product.descriptionUz) || product.descriptionRu || ''

  // Collect numeric prices for AggregateOffer
  const prices = (product.pricingTiers || [])
    .map((t) => (typeof t.price === 'number' ? t.price : null))
    .filter((p): p is number => typeof p === 'number' && p > 0)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url: `${BASE}/${locale}/products/${product.slug}/`,
  }

  if (product.heroImage) {
    schema.image = product.heroImage.startsWith('http') ? product.heroImage : `${BASE}${product.heroImage}`
  }
  if (product.brand) {
    schema.brand = { '@type': 'Brand', name: product.brand }
  }

  if (prices.length > 0) {
    schema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'UZS',
      lowPrice: String(Math.min(...prices)),
      highPrice: String(Math.max(...prices)),
      offerCount: String(prices.length),
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: { '@type': 'Organization', name: 'Graver.uz', url: BASE },
    }
  }

  // AggregateRating ONLY if we have real reviews AND a rating value.
  // Google penalizes fake AggregateRating with no reviews.
  const hasReviews = (product.reviews || []).length > 0
  const rv = product.aggregateRating?.value
  const rc = product.aggregateRating?.count
  if (hasReviews && rv && rc) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rv,
      reviewCount: rc,
      bestRating: '5',
      worstRating: '1',
    }
  }

  if (hasReviews) {
    schema.review = (product.reviews || []).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Organization', name: r.authorName || 'Customer' },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(r.rating ?? 5),
        bestRating: '5',
      },
      reviewBody: (isRu ? r.textRu : r.textUz) || r.textRu || '',
    }))
  }

  return schema
}

export function faqSchemaFromCMS(faq: readonly CMSFaq[] | undefined, locale: Locale) {
  if (!faq || faq.length === 0) return null
  const isRu = locale === 'ru'
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: (isRu ? item.qRu : item.qUz) || item.qRu || '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: (isRu ? item.aRu : item.aUz) || item.aRu || '',
      },
    })),
  }
}
