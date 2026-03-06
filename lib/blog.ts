import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Locale } from './i18n'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

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

function getPostFilePath(locale: Locale, slug: string): string {
  return path.join(CONTENT_DIR, locale, `${slug}.mdx`)
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/** Returns all slugs for a given locale */
export function getAllSlugs(locale: Locale): string[] {
  const dir = path.join(CONTENT_DIR, locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

/** Returns post metadata + content for a single post */
export function getPost(locale: Locale, slug: string): BlogPost | null {
  const filePath = getPostFilePath(locale, slug)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    ...(data as BlogPostFrontmatter),
    slug,
    locale,
    content,
    readingTime: estimateReadingTime(content),
  }
}

/** Returns metadata only (no content) for all posts in a locale, sorted by date desc */
export function getAllPostsMeta(locale: Locale): BlogPostMeta[] {
  const slugs = getAllSlugs(locale)
  const posts: BlogPostMeta[] = []

  for (const slug of slugs) {
    const filePath = getPostFilePath(locale, slug)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)
    posts.push({ ...(data as BlogPostFrontmatter), slug, locale })
  }

  return posts.sort((a, b) => {
    const da = new Date(a.date ?? '2000-01-01').getTime()
    const db = new Date(b.date ?? '2000-01-01').getTime()
    return db - da
  })
}

/** Returns related posts metadata given a list of slugs */
export function getRelatedPosts(locale: Locale, slugs: string[]): BlogPostMeta[] {
  const result: BlogPostMeta[] = []
  for (const slug of slugs.slice(0, 4)) {
    const filePath = getPostFilePath(locale, slug)
    if (!fs.existsSync(filePath)) continue
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)
    result.push({ ...(data as BlogPostFrontmatter), slug, locale })
  }
  return result
}
