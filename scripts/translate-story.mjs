#!/usr/bin/env node
/**
 * Graver Studio — RU → UZ story (blog) translator.
 *
 * Reads content/blog/ru/<slug>.mdx, splits YAML frontmatter from
 * markdown body, sends the WHOLE thing to Gemini in ONE batched call
 * (fits in free-tier 20 RPM quota when running one story at a time),
 * writes content/blog/uz/<target>.mdx, and optionally updates the
 * source RU file's alternateSlug.uz.
 *
 * Usage:
 *   node scripts/translate-story.mjs --source=<ru-slug> \
 *     [--target=<uz-slug>] [--overwrite] [--link-source]
 *
 * Env: GEMINI_API_KEY required.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import { translateBatch } from './lib/translator-gemini.mjs'
import { slugifyUz } from './lib/slugify-uz.mjs'

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    if (!a.startsWith('--')) return [a, true]
    const i = a.indexOf('=')
    return i > -1 ? [a.slice(2, i), a.slice(i + 1)] : [a.slice(2), true]
  })
)
const source = args.source
const targetCli = args.target
const overwrite = !!args.overwrite
const linkSource = !!args['link-source']

if (!source) {
  console.error('Usage: node scripts/translate-story.mjs --source=<ru-slug> [--target=<uz-slug>] [--overwrite] [--link-source]')
  process.exit(2)
}

const RU_FILE = join(ROOT, 'content', 'blog', 'ru', `${source}.mdx`)
if (!existsSync(RU_FILE)) {
  console.error(`✘ Source not found: ${RU_FILE}`)
  process.exit(1)
}

console.log(`→ Reading: content/blog/ru/${source}.mdx`)
const raw = readFileSync(RU_FILE, 'utf8')
if (!raw.startsWith('---')) { console.error('✘ No frontmatter.'); process.exit(1) }
const fmEnd = raw.indexOf('\n---', 3)
if (fmEnd < 0) { console.error('✘ Unterminated frontmatter.'); process.exit(1) }
const fmRaw = raw.slice(3, fmEnd).trim()
const body = raw.slice(fmEnd + 4).replace(/^\n/, '')
const fm = parseYaml(fmRaw) || {}

// Translate frontmatter strings + body in a SINGLE Gemini call.
const FM_TEXT_FIELDS = ['title', 'description', 'ogTitle', 'ogDescription', 'category']
const flat = {}
for (const k of FM_TEXT_FIELDS) {
  if (typeof fm[k] === 'string' && fm[k].trim()) flat[`fm.${k}`] = fm[k]
}
if (Array.isArray(fm.faq)) {
  fm.faq.forEach((item, i) => {
    if (typeof item.q === 'string' && item.q.trim()) flat[`fm.faq.${i}.q`] = item.q
    if (typeof item.a === 'string' && item.a.trim()) flat[`fm.faq.${i}.a`] = item.a
  })
}
if (body.trim().length > 0) flat['body'] = body

console.log(`→ Translating ${Object.keys(flat).length} strings (body ${body.length} chars)…`)
const translated = await translateBatch(flat, { targetLocale: 'uz' })

function setPath(obj, path, value) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (cur[p] === undefined) cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {}
    cur = cur[p]
  }
  cur[parts[parts.length - 1]] = value
}
const targetFm = JSON.parse(JSON.stringify(fm))
for (const [k, v] of Object.entries(translated)) {
  if (k.startsWith('fm.')) setPath(targetFm, k.slice(3), v)
}
let translatedBody = translated.body || body

// Rewrite /ru/ internal links → /uz/
translatedBody = translatedBody
  .replace(/\]\(\/ru\//g, '](/uz/')
  .replace(/href="\/ru\//g, 'href="/uz/')
  .replace(/href='\/ru\//g, "href='/uz/")
  .replace(/\(\/ru\//g, '(/uz/')

const translatedTitle = targetFm.title || ''
const targetSlug = targetCli || slugifyUz(translatedTitle) || `${source}-uz`
console.log(`→ Target slug: ${targetSlug}`)

targetFm.slug = targetSlug
targetFm.locale = 'uz'
targetFm.author = targetFm.author || 'Graver.uz'
targetFm.alternateSlug = targetFm.alternateSlug || {}
targetFm.alternateSlug.ru = source
targetFm.alternateSlug.uz = targetSlug
targetFm.noindex = false
delete targetFm.canonicalOverride
delete targetFm.previousSlugs

const UZ_FILE = join(ROOT, 'content', 'blog', 'uz', `${targetSlug}.mdx`)
if (existsSync(UZ_FILE) && !overwrite) {
  console.error(`✘ Target already exists: ${UZ_FILE}\n  Pass --overwrite to replace or --target=<other-slug>.`)
  process.exit(1)
}

mkdirSync(dirname(UZ_FILE), { recursive: true })
const out = '---\n' + stringifyYaml(targetFm, { lineWidth: 0 }).trimEnd() + '\n---\n\n' + translatedBody.trimEnd() + '\n'
writeFileSync(UZ_FILE, out, 'utf8')
console.log(`✓ Wrote ${UZ_FILE.slice(ROOT.length + 1)}`)

if (linkSource) {
  const srcFm = parseYaml(fmRaw) || {}
  srcFm.alternateSlug = srcFm.alternateSlug || {}
  if (srcFm.alternateSlug.uz !== targetSlug || srcFm.alternateSlug.ru !== source) {
    srcFm.alternateSlug.ru = source
    srcFm.alternateSlug.uz = targetSlug
    const newRu = '---\n' + stringifyYaml(srcFm, { lineWidth: 0 }).trimEnd() + '\n---\n' + raw.slice(fmEnd + 4)
    writeFileSync(RU_FILE, newRu, 'utf8')
    console.log(`✓ Updated source alternateSlug.uz = ${targetSlug}`)
  }
}

console.log(`\n✅ Translation done.`)
console.log(`   Live URL after deploy: https://graver-studio.uz/uz/blog/${targetSlug}/`)
console.log(`content/blog/uz/${targetSlug}.mdx (status: draft)`)
