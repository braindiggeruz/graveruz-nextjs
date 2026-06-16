#!/usr/bin/env node
/**
 * generate-alternate-slug-manifest.mjs
 *
 * Build-time manifest that maps every known RU/UZ URL to its alternate-locale
 * counterpart. Consumed by <LocaleSwitcher> at SSR-time so the source HTML
 * shipped to Googlebot already contains the *correct* alternate href for
 * cross-locale slug pairs (e.g. /ru/blog/chto-podarit-na-den-rozhdeniya/
 * <-> /uz/blog/tugilgan-kunga-sovgalar/).
 *
 * Sources (read at build time, zero runtime deps):
 *   1. content/blog/{ru,uz}/*.mdx — frontmatter `alternateSlug: { ru, uz }`
 *   2. content/pages/<slug>/index.yaml — `alternateSlug: { ru?, uz? }`
 *   3. Hardcoded landing-page pairs that live as dedicated app/ routes
 *      (e.g. /ru/podarochniy-nabor-s-chasami/ <-> /uz/soatli-sovga-toplami/).
 *
 * Output (committed JSON, consumed by both server and client bundles):
 *   lib/alternate-slug-manifest.generated.json
 *
 * Shape:
 *   {
 *     "/ru/blog/chto-podarit-na-den-rozhdeniya": {
 *       "uz": "/uz/blog/tugilgan-kunga-sovgalar"
 *     },
 *     ...
 *   }
 *
 * No keys are normalised with trailing slashes — LocaleSwitcher strips the
 * trailing slash from `usePathname()` before lookup.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BLOG_DIR = path.join(ROOT, 'content', 'blog')
const PAGES_DIR = path.join(ROOT, 'content', 'pages')
const OUT_FILE = path.join(ROOT, 'lib', 'alternate-slug-manifest.generated.json')

const LOCALES = ['ru', 'uz']

/**
 * Tiny dependency-free reader for the `alternateSlug:` block inside a
 * frontmatter / YAML file. We only need two scalar fields (ru, uz) so a
 * targeted regex pass is safer than pulling in a YAML parser at this layer.
 */
function readAlternateSlug(yamlText) {
  // Locate the block. Must be at the start of a line.
  const blockRe = /^alternateSlug\s*:\s*\n((?:[ \t]+[^\n]*\n?)+)/m
  const m = yamlText.match(blockRe)
  if (!m) return null
  const body = m[1]
  const out = {}
  for (const line of body.split(/\r?\n/)) {
    const kv = line.match(/^[ \t]+(ru|uz)\s*:\s*["']?([^"'\n#]+?)["']?\s*$/)
    if (kv) out[kv[1]] = kv[2].trim()
  }
  if (!out.ru && !out.uz) return null
  return out
}

function readFrontmatterYaml(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  // Match the first --- ... --- block.
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return fm ? fm[1] : ''
}

function readYamlFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

function listMdx(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace(/\.mdx$/, ''), file: path.join(dir, f) }))
}

function listPageYamls(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .map((name) => path.join(dir, name, 'index.yaml'))
    .filter((p) => fs.existsSync(p))
}

const manifest = {}

function addPair(currentLocale, currentSlug, alt, scope) {
  // scope: '' for landings, 'blog/' for blog posts
  const fromKey = `/${currentLocale}/${scope}${currentSlug}`
  const targets = {}
  for (const targetLocale of LOCALES) {
    if (targetLocale === currentLocale) continue
    const targetSlug = alt[targetLocale]
    if (!targetSlug) continue
    targets[targetLocale] = `/${targetLocale}/${scope}${targetSlug}`
  }
  if (Object.keys(targets).length === 0) return
  // Merge with whatever a previous source already produced — never overwrite
  // an existing alternate (frontmatter wins; CMS yaml stays as-is).
  manifest[fromKey] = { ...targets, ...(manifest[fromKey] || {}) }
}

// ─────────────────────────────────────────────────────────────────────────
// 1) Blog MDX (content/blog/{ru,uz}/*.mdx)
// ─────────────────────────────────────────────────────────────────────────
for (const locale of LOCALES) {
  for (const { slug, file } of listMdx(path.join(BLOG_DIR, locale))) {
    const fm = readFrontmatterYaml(file)
    if (!fm) continue
    const alt = readAlternateSlug(fm)
    if (!alt) continue
    addPair(locale, slug, alt, 'blog/')
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 2) CMS Pages (content/pages/<slug>/index.yaml)
// ─────────────────────────────────────────────────────────────────────────
for (const yamlPath of listPageYamls(PAGES_DIR)) {
  const text = readYamlFile(yamlPath)
  // Determine the page's own slug + locale from the YAML root keys we already
  // know are in there (no full YAML parser needed).
  const slugMatch = text.match(/^slug\s*:\s*["']?([^"'\n#]+?)["']?\s*$/m)
  const localeMatch = text.match(/^locale\s*:\s*["']?(ru|uz)["']?\s*$/m)
  const statusMatch = text.match(/^status\s*:\s*["']?([^"'\n#]+?)["']?\s*$/m)
  if (!slugMatch || !localeMatch) continue
  if (statusMatch && statusMatch[1].trim() !== 'published') continue
  const alt = readAlternateSlug(text)
  if (!alt) continue
  addPair(localeMatch[1], slugMatch[1].trim(), alt, '')
}

// ─────────────────────────────────────────────────────────────────────────
// 3) Hardcoded landing-pair safety net.
//    These routes exist as dedicated app/[locale]/<slug>/page.tsx files and
//    must always resolve to a real 200 page on the opposite locale, even if
//    CMS or MDX is missing/stale.
// ─────────────────────────────────────────────────────────────────────────
const HARDCODED_PAIRS = [
  { ru: 'podarochniy-nabor-s-chasami', uz: 'soatli-sovga-toplami' },
  { ru: 'lazernaya-gravirovka-tashkent', uz: 'toshkentda-lazer-gravyura' },
  { ru: 'korporativnye-podarki-tashkent', uz: 'toshkentda-korporativ-sovgalar' },
]
for (const pair of HARDCODED_PAIRS) {
  addPair('ru', pair.ru, { uz: pair.uz }, '')
  addPair('uz', pair.uz, { ru: pair.ru }, '')
}

// Stable key order = deterministic git diffs.
const sorted = {}
for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k]

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(sorted, null, 2) + '\n', 'utf-8')

const count = Object.keys(sorted).length
console.log(
  `[alternate-slug-manifest] wrote ${count} URL entries → ${path.relative(ROOT, OUT_FILE)}`,
)
