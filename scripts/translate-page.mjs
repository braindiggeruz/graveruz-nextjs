#!/usr/bin/env node
/**
 * Graver Studio — RU → UZ page translation CLI
 *
 * Usage:
 *   node scripts/translate-page.mjs --source=lazernaya-gravirovka-tashkent \
 *     [--from=ru] [--to=uz] [--target=toshkentda-lazer-gravyura] \
 *     [--dry-run] [--overwrite]
 *
 *   npm run translate:page -- --source=lazernaya-gravirovka-tashkent
 *
 * What it does:
 *   1. Reads /content/pages/<source>/index.yaml (must be locale=ru).
 *   2. Translates every user-facing text field RU → UZ via Gemini API.
 *   3. Generates a SEO-friendly Latin UZ slug from the translated H1
 *      (unless --target is provided).
 *   4. Copies all images (heroImage, block images, og image) verbatim.
 *   5. Writes /content/pages/<target>/index.yaml as a Draft.
 *   6. Sets alternateSlug on BOTH source (if missing) and target.
 *   7. Never overwrites source. Refuses to overwrite target unless
 *      --overwrite is passed.
 *
 * Env (one is required):
 *   GEMINI_API_KEY   — Google AI Studio key
 *   GOOGLE_API_KEY   — fallback name
 *
 * Safety:
 *   - source file is read-only except for alternateSlug.uz update;
 *   - alternateSlug update on source is OFF by default; pass
 *     --link-source to enable;
 *   - target status is always "draft" — human must review and publish.
 */
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readYaml, writeYaml, copyDir } from './lib/yaml-io.mjs'
import { translateBatch, translateOne } from './lib/translator-gemini.mjs'
import { slugifyUz } from './lib/slugify-uz.mjs'

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')

// ── CLI args ───────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { _: [] }
  for (const a of argv.slice(2)) {
    if (a.startsWith('--')) {
      const eq = a.indexOf('=')
      if (eq > -1) args[a.slice(2, eq)] = a.slice(eq + 1)
      else args[a.slice(2)] = true
    } else args._.push(a)
  }
  return args
}

const args = parseArgs(process.argv)
const source = args.source
const from = args.from || 'ru'
const to = args.to || 'uz'
const dryRun = Boolean(args['dry-run'])
const overwrite = Boolean(args.overwrite)
const linkSource = Boolean(args['link-source'])
const targetCli = args.target

if (!source) {
  console.error('Usage: node scripts/translate-page.mjs --source=<slug> [--target=<slug>] [--dry-run] [--overwrite] [--link-source]')
  process.exit(2)
}
if (from !== 'ru' || to !== 'uz') {
  console.error('Only --from=ru --to=uz is supported right now.')
  process.exit(2)
}

const PAGES_DIR = join(ROOT, 'content', 'pages')
const SOURCE_DIR = join(PAGES_DIR, source)
const SOURCE_YAML = join(SOURCE_DIR, 'index.yaml')

if (!existsSync(SOURCE_YAML)) {
  console.error(`✘ Source not found: ${SOURCE_YAML}`)
  process.exit(1)
}

console.log(`→ Reading source: content/pages/${source}/index.yaml`)
const src = readYaml(SOURCE_YAML)
if (src.locale && src.locale !== from) {
  console.error(`✘ Source locale is "${src.locale}", expected "${from}".`)
  process.exit(1)
}

// ── Collect translatable fields ───────────────────────────────────────
/**
 * We flatten all RU strings into a single object with stable keys, then
 * translate as one batched LLM call. This keeps context across fields
 * (better tone consistency) and minimises latency/cost.
 *
 * Path encoding: 'h1', 'intro', 'seo.title', 'blocks.0.value.title',
 * 'blocks.0.value.items.2.title', etc.
 */
const flat = {}
function collect(prefix, val) {
  if (val == null) return
  if (typeof val === 'string') {
    if (val.trim().length > 0) flat[prefix] = val
    return
  }
  if (Array.isArray(val)) {
    val.forEach((v, i) => collect(`${prefix}.${i}`, v))
    return
  }
  if (typeof val === 'object') {
    for (const [k, v] of Object.entries(val)) {
      collect(prefix ? `${prefix}.${k}` : k, v)
    }
  }
}

// Whitelist of top-level keys to translate.
// Excludes structural/non-text fields like locale, status, slug, alternateSlug,
// previousSlugs, noindex, ogImage, heroImage paths, ctaHref, image paths, etc.
const TRANSLATABLE_TOP = ['h1', 'intro', 'blocks', 'seo']

// In nested objects we MUST skip certain key names:
const SKIP_KEYS = new Set([
  'image', 'ogImage', 'heroImage',
  'imageSide',
  'discriminant',
  'ctaHref', 'buttonHref', 'href',
  'icon',
  'slug',
  'noindex',
  'status',
  'locale',
])

function collectFiltered(prefix, val) {
  if (val == null) return
  if (typeof val === 'string') {
    // strings are added only via parent (we get here only if explicitly walked)
    flat[prefix] = val
    return
  }
  if (Array.isArray(val)) {
    val.forEach((v, i) => collectFiltered(`${prefix}.${i}`, v))
    return
  }
  if (typeof val === 'object') {
    for (const [k, v] of Object.entries(val)) {
      if (SKIP_KEYS.has(k)) continue
      const childPath = prefix ? `${prefix}.${k}` : k
      if (typeof v === 'string') {
        if (v.trim().length === 0) continue
        flat[childPath] = v
      } else {
        collectFiltered(childPath, v)
      }
    }
  }
}

for (const top of TRANSLATABLE_TOP) {
  if (src[top] !== undefined) collectFiltered(top, src[top])
}

console.log(`→ Collected ${Object.keys(flat).length} translatable strings`)
if (Object.keys(flat).length === 0) {
  console.error('✘ Nothing to translate.')
  process.exit(1)
}

// ── Translate ─────────────────────────────────────────────────────────
console.log('→ Translating via Gemini (this may take 10-30s)...')

let translated
try {
  // Gemini occasionally truncates very large JSON; chunk if > 80 keys.
  const keys = Object.keys(flat)
  if (keys.length <= 80) {
    translated = await translateBatch(flat, { targetLocale: 'uz' })
  } else {
    translated = {}
    const CHUNK = 60
    for (let i = 0; i < keys.length; i += CHUNK) {
      const part = {}
      for (const k of keys.slice(i, i + CHUNK)) part[k] = flat[k]
      const out = await translateBatch(part, { targetLocale: 'uz' })
      Object.assign(translated, out)
    }
  }
} catch (err) {
  console.error('✘ Translation failed:', err.message)
  process.exit(1)
}

console.log(`✓ Got ${Object.keys(translated).length} translated strings`)

// Post-process: convert /ru/... internal links to /uz/... in markdown bodies.
// We do this conservatively — only inside markdown text (richText body etc).
function rewriteLinks(s) {
  if (typeof s !== 'string') return s
  // Convert (/ru/path) to (/uz/path), [text](/ru/...) too
  return s
    .replace(/\(\/ru\//g, '(/uz/')
    .replace(/href="\/ru\//g, 'href="/uz/')
    .replace(/href='\/ru\//g, "href='/uz/")
    .replace(/]\(\/ru\//g, '](/uz/')
}
for (const k of Object.keys(translated)) {
  translated[k] = rewriteLinks(translated[k])
}

// ── Build target document by deep-cloning source and overlaying values ──
function setByPath(obj, path, value) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (cur[p] === undefined) cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {}
    cur = cur[p]
  }
  cur[parts[parts.length - 1]] = value
}

const target = JSON.parse(JSON.stringify(src))
for (const [path, val] of Object.entries(translated)) {
  setByPath(target, path, val)
}

// Determine target slug
const translatedH1 = translated.h1 || translated['seo.title'] || ''
let targetSlug = targetCli || slugifyUz(translatedH1) || `${source}-uz`
if (!targetSlug) targetSlug = `${source}-uz`
console.log(`→ Target slug: ${targetSlug}`)

// Overlay target-specific fields
target.slug = targetSlug
target.locale = to
target.status = 'draft'
target.alternateSlug = {
  ru: source,
  uz: targetSlug,
}
target.previousSlugs = []
// Preserve noindex from source unless source is published (in which case force false for the new draft)
if (src.seo?.noindex && src.status === 'published') {
  target.seo = target.seo || {}
  target.seo.noindex = false
}

// Rewrite image paths inside the target YAML to point to the new directory.
// Pages directory is /public/images/pages/<slug>/...
const SRC_IMG_PREFIX = `/images/pages/${source}/`
const DST_IMG_PREFIX = `/images/pages/${targetSlug}/`
function rewriteImageRefs(node) {
  if (node == null) return
  if (typeof node === 'string') return node.startsWith(SRC_IMG_PREFIX)
    ? DST_IMG_PREFIX + node.slice(SRC_IMG_PREFIX.length)
    : node
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) node[i] = rewriteImageRefs(node[i])
    return node
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'string' && v.startsWith(SRC_IMG_PREFIX)) {
        node[k] = DST_IMG_PREFIX + v.slice(SRC_IMG_PREFIX.length)
      } else {
        rewriteImageRefs(v)
      }
    }
    return node
  }
}
// Also OG images live under /images/og/<slug>/...
const SRC_OG_PREFIX = `/images/og/${source}/`
const DST_OG_PREFIX = `/images/og/${targetSlug}/`
function rewriteOgRefs(node) {
  if (node == null) return
  if (Array.isArray(node)) { node.forEach((v) => rewriteOgRefs(v)); return }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'string' && v.startsWith(SRC_OG_PREFIX)) {
        node[k] = DST_OG_PREFIX + v.slice(SRC_OG_PREFIX.length)
      } else {
        rewriteOgRefs(v)
      }
    }
  }
}
rewriteImageRefs(target)
rewriteOgRefs(target)

// ── Write target ──────────────────────────────────────────────────────
const TARGET_DIR = join(PAGES_DIR, targetSlug)
const TARGET_YAML = join(TARGET_DIR, 'index.yaml')
if (existsSync(TARGET_YAML) && !overwrite) {
  console.error(`✘ Target already exists: ${TARGET_YAML}\n  Pass --overwrite to replace it (DANGEROUS) or use --target=<other-slug>.`)
  process.exit(1)
}

// Copy images
const SRC_IMG_DIR = join(ROOT, 'public', 'images', 'pages', source)
const DST_IMG_DIR = join(ROOT, 'public', 'images', 'pages', targetSlug)
const SRC_OG_DIR = join(ROOT, 'public', 'images', 'og', source)
const DST_OG_DIR = join(ROOT, 'public', 'images', 'og', targetSlug)

if (dryRun) {
  console.log('— DRY RUN — not writing files. Target YAML preview:')
  console.log('────────────────────────────────────────────')
  console.log(JSON.stringify(target, null, 2).slice(0, 2000))
  console.log('────────────────────────────────────────────')
  process.exit(0)
}

console.log(`→ Writing target: content/pages/${targetSlug}/index.yaml`)
writeYaml(TARGET_YAML, target)

if (existsSync(SRC_IMG_DIR)) {
  console.log(`→ Copying images: ${relative(ROOT, SRC_IMG_DIR)} → ${relative(ROOT, DST_IMG_DIR)}`)
  copyDir(SRC_IMG_DIR, DST_IMG_DIR)
}
if (existsSync(SRC_OG_DIR)) {
  console.log(`→ Copying og:   ${relative(ROOT, SRC_OG_DIR)} → ${relative(ROOT, DST_OG_DIR)}`)
  copyDir(SRC_OG_DIR, DST_OG_DIR)
}

// Update source alternateSlug to point at target (optional — gated by --link-source)
if (linkSource) {
  const srcOnDisk = readYaml(SOURCE_YAML)
  srcOnDisk.alternateSlug = srcOnDisk.alternateSlug || {}
  if (srcOnDisk.alternateSlug.uz !== targetSlug || srcOnDisk.alternateSlug.ru !== source) {
    srcOnDisk.alternateSlug.uz = targetSlug
    srcOnDisk.alternateSlug.ru = source
    writeYaml(SOURCE_YAML, srcOnDisk)
    console.log(`✓ Source alternateSlug updated: ru=${source}, uz=${targetSlug}`)
  }
} else {
  console.log('ℹ Source alternateSlug NOT modified (pass --link-source to enable).')
}

console.log('\n✅ Translation complete.')
console.log(`   Target: content/pages/${targetSlug}/index.yaml (status: draft)`)
console.log(`   Preview URL after deploy: https://graver-studio.uz/uz/${targetSlug}/`)
console.log(`\nNext steps:`)
console.log(`   1. Open Keystatic → Страницы → "${targetSlug}" — review every block.`)
console.log(`   2. If everything is OK, change status: draft → published and save.`)
console.log(`   3. On the source RU page, make sure alternateSlug.uz = "${targetSlug}".`)
