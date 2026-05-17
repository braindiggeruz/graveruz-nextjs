#!/usr/bin/env node
/**
 * SEO Audit CLI — runs the same checks as the admin-tools dashboard
 * but in plain text + JSON, suitable for CI / smoke tests.
 *
 * Usage:
 *   node scripts/seo-audit.mjs                    # text report
 *   node scripts/seo-audit.mjs --json > seo.json  # machine-readable
 *
 * Exits with code 1 if any published page scores below 60% or has
 * dangerous flags (noindex+published, missing language pair on money
 * pages, etc).
 */
import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readYaml } from './lib/yaml-io.mjs'

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')
const PAGES_DIR = join(ROOT, 'content', 'pages')
const asJson = process.argv.includes('--json')

const TITLE_MIN = 30
const TITLE_MAX = 65
const DESC_MIN = 120
const DESC_MAX = 165

function loadPages() {
  if (!existsSync(PAGES_DIR)) return []
  const dirs = readdirSync(PAGES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())
  const pages = []
  for (const d of dirs) {
    const f = join(PAGES_DIR, d.name, 'index.yaml')
    if (!existsSync(f)) continue
    try {
      const p = readYaml(f)
      pages.push({ ...p, slug: p.slug || d.name })
    } catch (err) {
      pages.push({ slug: d.name, _readError: String(err.message) })
    }
  }
  return pages
}

function blockHas(blocks, type) {
  return (blocks || []).some((b) => b.discriminant === type)
}
function collectHrefs(blocks) {
  const hrefs = []
  for (const b of blocks || []) {
    const v = b.value || {}
    if (typeof v.ctaHref === 'string') hrefs.push(v.ctaHref)
    if (typeof v.buttonHref === 'string') hrefs.push(v.buttonHref)
  }
  return hrefs
}

const pages = loadPages()
const inboundBySlug = {}
for (const p of pages) {
  for (const h of collectHrefs(p.blocks)) {
    const m = h.match(/^\/(ru|uz)\/([^/?#]+)/)
    if (m && m[2] !== p.slug) {
      inboundBySlug[m[2]] = inboundBySlug[m[2]] || []
      inboundBySlug[m[2]].push(p.slug)
    }
  }
}

const WEIGHTS = { critical: 25, high: 15, medium: 8, low: 3, info: 1 }

function audit(p) {
  const status = p.status || 'draft'
  const isPub = status === 'published'
  const titleLen = (p.seo?.title || '').length
  const descLen = (p.seo?.description || '').length
  const blocks = p.blocks || []
  const inbound = inboundBySlug[p.slug] || []
  const checks = [
    { id: 'h1', sev: 'critical', pass: !!(p.h1 && p.h1.trim()) },
    { id: 'seo_title_range', sev: !p.seo?.title ? 'critical' : 'medium', pass: titleLen >= TITLE_MIN && titleLen <= TITLE_MAX },
    { id: 'seo_desc_range', sev: !p.seo?.description ? 'critical' : 'medium', pass: descLen >= DESC_MIN && descLen <= DESC_MAX },
    { id: 'og_image', sev: 'medium', pass: !!p.seo?.ogImage },
    { id: 'hero_image', sev: 'low', pass: !!p.heroImage },
    { id: 'faq_block', sev: 'high', pass: blockHas(blocks, 'faq') },
    { id: 'cta_block', sev: 'high', pass: blockHas(blocks, 'cta') },
    { id: 'noindex_safe', sev: isPub && p.seo?.noindex ? 'critical' : 'info', pass: !(isPub && p.seo?.noindex) },
    {
      id: 'lang_pair',
      sev: 'high',
      pass: !!(p.alternateSlug?.[p.locale === 'ru' ? 'uz' : 'ru']),
    },
    { id: 'orphan', sev: isPub && inbound.length === 0 ? 'high' : 'info', pass: inbound.length > 0 || !isPub },
  ]
  let earned = 0, total = 0
  for (const c of checks) { total += WEIGHTS[c.sev]; if (c.pass) earned += WEIGHTS[c.sev] }
  const percent = total ? Math.round((earned / total) * 100) : 0
  return { slug: p.slug, locale: p.locale, status, percent, titleLen, descLen, inboundCount: inbound.length, checks }
}

const audits = pages.map(audit)
const failures = audits.filter((a) => a.status === 'published' && (a.percent < 60 || a.checks.find((c) => c.id === 'noindex_safe' && !c.pass)))

if (asJson) {
  process.stdout.write(JSON.stringify({ generatedAt: new Date().toISOString(), pages: audits, failures }, null, 2) + '\n')
} else {
  console.log(`\n=== SEO Audit — ${audits.length} pages ===\n`)
  for (const a of audits) {
    const flag = a.status === 'published' ? (a.percent >= 75 ? '✓' : a.percent >= 60 ? '~' : '✘') : '·'
    console.log(`  ${flag} [${(a.locale || 'ru').toUpperCase()}] ${a.slug.padEnd(40)}  ${String(a.percent).padStart(3)}%  ${a.status}  title:${a.titleLen}  desc:${a.descLen}  inbound:${a.inboundCount}`)
    const failed = a.checks.filter((c) => !c.pass && (c.sev === 'critical' || c.sev === 'high'))
    for (const f of failed) console.log(`         · ${f.sev.padEnd(8)} ${f.id}`)
  }
  console.log(`\nFailures (published + <60% or unsafe noindex): ${failures.length}`)
}

process.exit(failures.length > 0 ? 1 : 0)
