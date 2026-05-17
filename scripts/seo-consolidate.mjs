#!/usr/bin/env node
/**
 * SEO Consolidation Pass — read-only analysis report.
 *
 * Generates SEO_CONSOLIDATION_REPORT.md with two sections:
 *
 *   1. NOINDEX classification — cross-references next.config.mjs
 *      blog redirects to classify each noindex story as `redirected`
 *      (safe to leave), `thin-orphan` (consider merge/delete), or
 *      `review` (substantial content — operator decides).
 *
 *   2. Cannibalization candidates — clusters stories per locale at
 *      threshold 0.5 and lists weak duplicates that could safely get
 *      `canonicalOverride` to the canonical (strongest) member.
 *
 * Read-only by default. No frontmatter is rewritten. Operator opens
 * the report and applies edits via Keystatic.
 *
 * Usage: node scripts/seo-consolidate.mjs
 *        Requires `npm run prebuild` to refresh lib/_seo-snapshot.generated.json.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')

const snap = JSON.parse(readFileSync(join(ROOT, 'lib/_seo-snapshot.generated.json'), 'utf8'))
const stories = snap.stories || []

// ── 1. NOINDEX classification ──────────────────────────────────────
const nextConfig = readFileSync(join(ROOT, 'next.config.mjs'), 'utf8')
const redirectMap = new Map()
const re = /\.\.\.r\(\s*'\/(?:ru|uz)\/blog\/([^']+)'\s*,\s*'\/(?:ru|uz)\/blog\/([^']+)'/g
let m
while ((m = re.exec(nextConfig))) redirectMap.set(m[1].replace(/\/$/, ''), m[2].replace(/\/$/, ''))

const noindexStories = stories.filter((s) => s.noindex)
const noindexRows = noindexStories.map((s) => {
  const redirectTarget = redirectMap.get(s.slug)
  let classification, action
  if (redirectTarget) {
    classification = 'redirected'
    action = `OK — redirects to /${s.locale}/blog/${redirectTarget}/. Keep noindex.`
  } else if ((s.wordCount || 0) < 100) {
    classification = 'thin-orphan'
    action = 'Likely safe (very thin). Consider deleting MDX or merging into canonical.'
  } else {
    classification = 'review'
    action = 'No redirect. If valuable — un-noindex; if duplicate — set canonicalOverride.'
  }
  return { s, redirectTarget, classification, action }
})

// ── 2. Cannibalization clusters ────────────────────────────────────
const STOPWORDS = new Set(['и','в','на','с','по','для','от','до','из','за','к','о','об','при','что','как','то','же','уже','или','но','а','без','над','под','между','это','эта','этот','эти','тот','та','те','такой','такая','такие','va','bilan','uchun','yoki','ammo','lekin','agar','chunki','shu','bu','u','ham','qanday','qachon','nima','kim','the','a','an','of','in','on','for','to','and','or','with','as','at','by'])
function tokenize(t) {
  if (!t) return []
  return (t.toLowerCase().match(/[a-zа-яёʻʼ\u2019\u02BB0-9]+/giu) || []).filter((x) => x.length >= 3 && !STOPWORDS.has(x))
}
function jaccard(a, b) {
  if (!a.length || !b.length) return 0
  const sa = new Set(a), sb = new Set(b)
  let i = 0
  for (const t of sa) if (sb.has(t)) i++
  return i / (sa.size + sb.size - i)
}
function clusterStories(items, threshold = 0.5) {
  const toks = items.map((it) => tokenize(it.title))
  const parent = items.map((_, i) => i)
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x] } return x }
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb }
  for (let i = 0; i < items.length; i++)
    for (let j = i + 1; j < items.length; j++)
      if (jaccard(toks[i], toks[j]) >= threshold) union(i, j)
  const groups = new Map()
  for (let i = 0; i < items.length; i++) {
    const r = find(i)
    if (!groups.has(r)) groups.set(r, [])
    groups.get(r).push(items[i])
  }
  return [...groups.values()].filter((g) => g.length >= 2).sort((a, b) => b.length - a.length)
}
function pickCanonical(members) {
  return [...members].sort((a, b) => {
    if (!!a.noindex !== !!b.noindex) return a.noindex ? 1 : -1
    const wa = a.wordCount || 0, wb = b.wordCount || 0
    if (wa !== wb) return wb - wa
    return (b.date || '').localeCompare(a.date || '')
  })[0]
}

const consolidationActions = []
for (const locale of ['ru', 'uz']) {
  const scope = stories.filter((s) => s.locale === locale && !s.canonicalOverride && !s.noindex)
  const clusters = clusterStories(scope, 0.5).slice(0, 8)
  for (const cluster of clusters) {
    const canonical = pickCanonical(cluster)
    if ((canonical.wordCount || 0) < 300) continue
    for (const member of cluster) {
      if (member.slug === canonical.slug) continue
      if ((member.wordCount || 0) >= 350) continue
      consolidationActions.push({ story: member, canonical, locale, canonicalUrl: `https://graver-studio.uz/${locale}/blog/${canonical.slug}/` })
    }
  }
}

// ── Report ─────────────────────────────────────────────────────────
const lines = []
lines.push('# SEO Consolidation Report')
lines.push(`Generated: ${new Date().toISOString()}`)
lines.push('Mode: DRY-RUN (analysis only — no frontmatter rewrites)')
lines.push('')
lines.push('## 1. Noindex stories — classification')
lines.push(`Total noindex stories: ${noindexStories.length}`)
lines.push('')
lines.push('| Locale | Slug | Words | Redirect | Classification | Recommended action |')
lines.push('|---|---|---|---|---|---|')
for (const r of noindexRows) {
  lines.push(`| ${r.s.locale} | \`${r.s.slug}\` | ${r.s.wordCount || 0} | ${r.redirectTarget ? '→ ' + r.redirectTarget : '—'} | **${r.classification}** | ${r.action} |`)
}

lines.push('')
lines.push('## 2. Cannibalization candidates — suggested canonicalOverride')
lines.push('Top clusters per locale · threshold 0.5 · only weak duplicates (<350 words) listed as auto-mergeable.')
lines.push('')
if (consolidationActions.length === 0) {
  lines.push('_No safe auto-merge candidates found._')
} else {
  lines.push('| Locale | Weak slug | Words | → Canonical slug | Canonical words |')
  lines.push('|---|---|---|---|---|')
  for (const a of consolidationActions) {
    lines.push(`| ${a.locale} | \`${a.story.slug}\` | ${a.story.wordCount || 0} | \`${a.canonical.slug}\` | ${a.canonical.wordCount || 0} |`)
  }
  lines.push('')
  lines.push('### How to apply (per row, in Keystatic)')
  lines.push('1. Open the weak story.')
  lines.push('2. Set frontmatter field `canonicalOverride` = the canonical URL shown above.')
  lines.push('3. Save. Cloudflare deploy will route Google authority to the canonical.')
  lines.push('4. Reversible — clear the field to undo.')
}

lines.push('')
lines.push('## 3. NOT auto-applied (require human decision)')
lines.push('- Cannibalization clusters where multiple members each have ≥350 words — needs human merge.')
lines.push('- Noindex stories in `review` classification (no redirect + substantial content).')
lines.push('- Deletion of any MDX file — never auto-deletes.')
lines.push('- 301 redirects — never auto-creates.')

writeFileSync(join(ROOT, 'SEO_CONSOLIDATION_REPORT.md'), lines.join('\n') + '\n')
console.log(`\n[seo-consolidate] noindex classified: ${noindexRows.length}, canonicalOverride candidates: ${consolidationActions.length}`)
console.log(`Report written: SEO_CONSOLIDATION_REPORT.md`)
