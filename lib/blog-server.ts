'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Locale } from './i18n'
import type { BlogPostFrontmatter, BlogPostMeta, BlogPost } from './blog'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

function getPostFilePath(locale: Locale, slug: string): string {
  return path.join(CONTENT_DIR, locale, `${slug}.mdx`)
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/** Server-only: Returns all slugs for a given locale */
export function getAllSlugsServer(locale: Locale): string[] {
  const dir = path.join(CONTENT_DIR, locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

/** Server-only: Returns post metadata + content for a single post */
export function getPostServer(locale: Locale, slug: string): BlogPost | null {
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

/** Server-only: Returns metadata only (no content) for all posts in a locale, sorted by date desc */
export function getAllPostsMetaServer(locale: Locale): BlogPostMeta[] {
  const slugs = getAllSlugsServer(locale)
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

/** Server-only: Returns related posts metadata given a list of slugs */
export function getRelatedPostsServer(locale: Locale, slugs: string[]): BlogPostMeta[] {
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
