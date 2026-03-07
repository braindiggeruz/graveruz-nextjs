import type { Locale } from './i18n'
import {
  getAllSlugsServer,
  getPostServer,
  getAllPostsMetaServer,
  getRelatedPostsServer,
} from './blog-server'

export interface BlogPostFrontmatter {
  slug: string
  locale: Locale
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  date: string
  author?: string
  alternateSlug?: Partial<Record<Locale, string>>
  relatedSlugs?: string[]
  faq?: Array<{ q: string; a: string }>
  category?: string
  tags?: string[]
}

export interface BlogPost extends BlogPostFrontmatter {
  content: string
  readingTime?: number
}

export interface BlogPostMeta extends BlogPostFrontmatter {
  // No content — used for listing pages
}

/** Returns all slugs for a given locale (build-time only) */
export function getAllSlugs(locale: Locale): string[] {
  return getAllSlugsServer(locale)
}

/** Returns post metadata + content for a single post (build-time only) */
export function getPost(locale: Locale, slug: string): BlogPost | null {
  return getPostServer(locale, slug)
}

/** Returns metadata only (no content) for all posts in a locale, sorted by date desc (build-time only) */
export function getAllPostsMeta(locale: Locale): BlogPostMeta[] {
  return getAllPostsMetaServer(locale)
}

/** Returns related posts metadata given a list of slugs (build-time only) */
export function getRelatedPosts(locale: Locale, slugs: string[]): BlogPostMeta[] {
  return getRelatedPostsServer(locale, slugs)
}
