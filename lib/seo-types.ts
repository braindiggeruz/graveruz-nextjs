/**
 * Minimal shapes for CMS snapshot. Intentionally loose — the YAML is
 * user-edited and may have missing fields. Use optional everywhere.
 */
export interface CMSPageBlock {
  discriminant: string
  value?: Record<string, any>
}

export interface CMSPage {
  slug: string
  locale?: 'ru' | 'uz'
  status?: 'draft' | 'published'
  h1?: string
  intro?: string
  heroImage?: string
  blocks?: CMSPageBlock[]
  alternateSlug?: { ru?: string; uz?: string }
  previousSlugs?: string[]
  seo?: {
    title?: string
    description?: string
    ogImage?: string
    noindex?: boolean
  }
}

export interface CMSProduct {
  slug: string
  status?: 'draft' | 'published'
  nameRu?: string
  nameUz?: string
  descriptionRu?: string
  descriptionUz?: string
  heroImage?: string
  pricingTiers?: any[]
  reviews?: any[]
  faq?: any[]
  seo?: {
    title?: string
    description?: string
    ogImage?: string
    noindex?: boolean
  }
}
