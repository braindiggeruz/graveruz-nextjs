#!/usr/bin/env node
/**
 * Build-time CMS regression guard for homepage.
 *
 * Validates that content/homepage/index.yaml has every field the live
 * homepage renderer expects. Wired into `prebuild` so a broken save in
 * Keystatic cannot reach production undetected.
 *
 * Exit codes:
 *   0 — homepage YAML is healthy
 *   1 — critical field missing → block the build
 *
 * Soft warnings print to stderr but do not block.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')
const FILE = resolve(ROOT, 'content', 'homepage', 'index.yaml')

const errors = []
const warnings = []
const ok = []

function fail(msg) { errors.push(msg) }
function warn(msg) { warnings.push(msg) }
function pass(msg) { ok.push(msg) }

if (!existsSync(FILE)) {
  console.error(`✘ content/homepage/index.yaml not found at ${FILE}`)
  process.exit(1)
}

let doc
try {
  doc = parseYaml(readFileSync(FILE, 'utf8'))
} catch (err) {
  console.error('✘ YAML parse failed:', err.message)
  process.exit(1)
}

if (!doc || typeof doc !== 'object') {
  console.error('✘ homepage YAML root is empty or not an object')
  process.exit(1)
}

// ── Hero ──────────────────────────────────────────────────────────
const hero = doc.hero || {}
const heroFields = ['titleRu', 'titleUz', 'titleAccentRu', 'titleAccentUz']
for (const f of heroFields) {
  if (!hero[f] || String(hero[f]).trim() === '') fail(`hero.${f} is empty`)
  else pass(`hero.${f}`)
}
if (!hero.subtitleRu) warn('hero.subtitleRu is empty')
if (!hero.subtitleUz) warn('hero.subtitleUz is empty')
if (!hero.ctaPrimaryRu) warn('hero.ctaPrimaryRu is empty')
if (!hero.ctaPrimaryUz) warn('hero.ctaPrimaryUz is empty')

// ── Hero stats ────────────────────────────────────────────────────
const stats = Array.isArray(hero.stats) ? hero.stats : []
if (stats.length < 4) fail(`hero.stats must have >= 4 items (found ${stats.length})`)
else pass(`hero.stats has ${stats.length} items`)
stats.forEach((s, i) => {
  const hasValue = !!(s.value || s.valueRu || s.valueUz)
  if (!hasValue) fail(`hero.stats[${i}]: no value/valueRu/valueUz`)
  if (!s.labelRu) warn(`hero.stats[${i}].labelRu is empty`)
  if (!s.labelUz) warn(`hero.stats[${i}].labelUz is empty`)
})

// ── Services ──────────────────────────────────────────────────────
const services = Array.isArray(doc.services) ? doc.services : []
if (services.length < 5) fail(`services must have >= 5 items (found ${services.length})`)
else pass(`services has ${services.length} items`)
// SERVICE_HREF_BY_ICON fallback covers these icons (must stay in sync with app/[locale]/page.tsx)
const KNOWN_ICONS = new Set(['laser', 'gift', 'package', 'briefcase', 'trophy', 'star'])
services.forEach((s, i) => {
  for (const f of ['titleRu', 'titleUz', 'descriptionRu', 'descriptionUz']) {
    if (!s[f]) fail(`services[${i}].${f} is empty`)
  }
  const icon = s.icon || ''
  const hasExplicit = !!(s.hrefRu && s.hrefUz)
  const hasFallback = KNOWN_ICONS.has(icon)
  if (!hasExplicit && !hasFallback) {
    fail(`services[${i}]: icon='${icon}' has no fallback href and no explicit hrefRu/hrefUz`)
  }
  // Reject http://, full domains, or trailing-slash absent on internal links
  for (const k of ['hrefRu', 'hrefUz']) {
    const v = s[k]
    if (!v) continue
    if (/^https?:\/\//.test(v)) {
      // External link is allowed but unusual for service cards — warn only
      warn(`services[${i}].${k} is an external URL: ${v}`)
    } else {
      if (!v.startsWith('/')) fail(`services[${i}].${k} must start with / (got: ${v})`)
      if (!v.endsWith('/')) warn(`services[${i}].${k} is missing trailing slash (got: ${v})`)
    }
  }
})

// ── Portfolio ─────────────────────────────────────────────────────
const portfolio = Array.isArray(doc.portfolio) ? doc.portfolio : []
if (portfolio.length < 4) fail(`portfolio must have >= 4 items (found ${portfolio.length})`)
else pass(`portfolio has ${portfolio.length} items`)
portfolio.forEach((p, i) => {
  if (!p.image) warn(`portfolio[${i}].image is empty`)
  if (!p.titleRu && !p.titleUz) fail(`portfolio[${i}]: titleRu and titleUz both empty`)
})

// ── Process steps ─────────────────────────────────────────────────
const steps = Array.isArray(doc.processSteps) ? doc.processSteps : []
if (steps.length < 3) warn(`processSteps has only ${steps.length} item(s) — recommended 4`)

// ── FAQ ───────────────────────────────────────────────────────────
const faq = Array.isArray(doc.faq) ? doc.faq : []
if (faq.length < 5) fail(`faq must have >= 5 items (found ${faq.length})`)
else pass(`faq has ${faq.length} items`)

// ── SEO ───────────────────────────────────────────────────────────
const seo = doc.seo || {}
const hasTitleRu = !!(seo.titleRu || seo.title)
const hasTitleUz = !!(seo.titleUz || seo.titleRu || seo.title)
const hasDescRu = !!(seo.descriptionRu || seo.description)
const hasDescUz = !!(seo.descriptionUz || seo.descriptionRu || seo.description)
if (!hasTitleRu) fail('seo: no titleRu and no fallback title for RU')
if (!hasTitleUz) fail('seo: no titleUz and no titleRu/title fallback for UZ')
if (!hasDescRu) fail('seo: no descriptionRu and no fallback description for RU')
if (!hasDescUz) fail('seo: no descriptionUz fallback for UZ')
if (seo.titleRu) pass('seo.titleRu')
if (seo.titleUz) pass('seo.titleUz')
if (seo.descriptionRu) pass('seo.descriptionRu')
if (seo.descriptionUz) pass('seo.descriptionUz')
// OG is optional — covered by fallback chain to title/description, just inform
if (!seo.ogTitleRu) warn('seo.ogTitleRu empty (will fall back to titleRu)')
if (!seo.ogTitleUz) warn('seo.ogTitleUz empty (will fall back to titleUz)')
if (!seo.ogDescriptionRu) warn('seo.ogDescriptionRu empty (will fall back to descriptionRu)')
if (!seo.ogDescriptionUz) warn('seo.ogDescriptionUz empty (will fall back to descriptionUz)')
if (seo.noindex === true) fail('seo.noindex=true on homepage — homepage must be indexable')

// ── Report ────────────────────────────────────────────────────────
console.log(`[verify:homepage] ${ok.length} pass, ${warnings.length} warning(s), ${errors.length} error(s)`)
for (const w of warnings) console.warn(`  ⚠ ${w}`)
for (const e of errors) console.error(`  ✘ ${e}`)

if (errors.length > 0) {
  console.error('\n[verify:homepage] FAILED — fix the errors above in content/homepage/index.yaml (Keystatic Главная)')
  process.exit(1)
}
console.log('[verify:homepage] OK ✓')
process.exit(0)
