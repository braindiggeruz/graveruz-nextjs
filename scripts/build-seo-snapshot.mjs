#!/usr/bin/env node
/**
 * Build-time SEO snapshot generator.
 *
 * Reads Keystatic content (pages, products) from disk at build time
 * and emits a JSON file that the runtime admin dashboard imports
 * directly. This avoids runtime fs access — Cloudflare Workers don't
 * ship the `content/` tree, so `getAllPages()` from lib/cms.ts cannot
 * be used inside server components that run with `force-dynamic`.
 *
 * Output: lib/_seo-snapshot.generated.json (gitignored — regenerated
 * on every build).
 */
import { existsSync, readdirSync, mkdirSync, writeFileSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readYaml } from './lib/yaml-io.mjs'
import { parse as parseYaml } from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')

function listEntries(absDir) {
  if (!existsSync(absDir)) return []
  const out = []
  for (const d of readdirSync(absDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue
    const yamlFile = join(absDir, d.name, 'index.yaml')
    if (!existsSync(yamlFile)) continue
    try {
      const data = readYaml(yamlFile)
      out.push({ ...data, slug: data.slug || d.name })
    } catch (err) {
      console.warn(`[seo-snapshot] skip ${yamlFile}: ${err.message}`)
    }
  }
  return out
}

// ── Stories (blog) — MDX files under content/blog/{locale}/*.mdx ──
// Stories live as flat MDX files with frontmatter, NOT folders. Parse
// the frontmatter (YAML between leading `---` fences) using the same
// `yaml` package the project already ships.
function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return {}
  const end = raw.indexOf('\n---', 3)
  if (end < 0) return {}
  const fm = raw.slice(3, end).trim()
  try {
    return parseYaml(fm) || {}
  } catch {
    return {}
  }
}

function listStories(absDir) {
  if (!existsSync(absDir)) return []
  const out = []
  for (const locale of ['ru', 'uz']) {
    const dir = join(absDir, locale)
    if (!existsSync(dir)) continue
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.mdx')) continue
      const file = join(dir, f)
      try {
        const raw = readFileSync(file, 'utf8')
        const fm = parseFrontmatter(raw)
        const slug = fm.slug || f.replace(/\.mdx$/, '')
        const body = raw.replace(/^---[\s\S]*?\n---\n/, '')
        const wordCount = (body.match(/\b[\wа-яА-ЯёЁ’ʻ`'-]+\b/g) || []).length
        const alt = fm.alternateSlug || {}
        out.push({
          slug,
          locale,
          title: fm.title || '',
          description: fm.description || '',
          date: fm.date || '',
          category: fm.category || '',
          tags: Array.isArray(fm.tags) ? fm.tags : [],
          relatedSlugs: Array.isArray(fm.relatedSlugs) ? fm.relatedSlugs : [],
          ogImage: fm.ogImage || '',
          noindex: fm.noindex === true,
          canonicalOverride: fm.canonicalOverride || '',
          alternateRu: alt.ru || '',
          alternateUz: alt.uz || '',
          previousSlugs: Array.isArray(fm.previousSlugs) ? fm.previousSlugs : [],
          hasFaq: Array.isArray(fm.faq) && fm.faq.length > 0,
          wordCount,
          file: file.slice(ROOT.length + 1),
          mtime: statSync(file).mtime.toISOString(),
        })
      } catch (err) {
        console.warn(`[seo-snapshot] skip story ${file}: ${err.message}`)
      }
    }
  }
  return out
}

const pages = listEntries(join(ROOT, 'content', 'pages'))
const products = listEntries(join(ROOT, 'content', 'products'))
const stories = listStories(join(ROOT, 'content', 'blog'))

const snapshot = {
  generatedAt: new Date().toISOString(),
  pages,
  products,
  stories,
}

const outPath = join(ROOT, 'lib', '_seo-snapshot.generated.json')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')

console.log(`[seo-snapshot] wrote ${pages.length} pages + ${products.length} products + ${stories.length} stories → lib/_seo-snapshot.generated.json`)
