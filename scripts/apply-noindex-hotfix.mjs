#!/usr/bin/env node
/**
 * One-shot SEO hotfix: mark thin/duplicate seasonal articles as noindex
 * with canonicalOverride to the strongest canonical for that cluster.
 *
 * Idempotent: skips files that already declare noindex: true.
 * Run: node scripts/apply-noindex-hotfix.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

// Narrow 8-marta / seasonal duplicates that cannibalize canonical pages.
// All of these appeared in GSC "Crawled but not indexed" (May 2026 report).
const HOTFIXES = [
  // ── RU narrow 8-marta cannibalizers → canonical: podarki-8-marta-20-idej ──
  { file: 'content/blog/ru/chto-podarit-devushke-na-8-marta.mdx',                canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/ru/chto-podarit-mame-na-8-marta.mdx',                    canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/ru/chto-podarit-rukovoditelyu-na-8-marta.mdx',           canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/ru/chto-podarit-na-8-marta-devushke-mame-kollege.mdx',   canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/ru/korporativnye-podarki-na-8-marta-v-tashkente.mdx',    canonical: 'https://graver-studio.uz/ru/blog/podarki-na-8-marta-sotrudnitsam/' },

  // ── UZ -uz suffixed RU-text duplicates (sit in /uz/ but are not real UZ) ──
  { file: 'content/blog/uz/chto-podarit-devushke-na-8-marta-uz.mdx',             canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/uz/chto-podarit-kollege-na-8-marta-uz.mdx',              canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/uz/chto-podarit-mame-na-8-marta-uz.mdx',                 canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/uz/chto-podarit-rukovoditelyu-na-8-marta-uz.mdx',        canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/uz/chto-podarit-na-8-marta-devushke-mame-kollege-uz.mdx',canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/uz/originalnye-podarki-na-8-marta-uz.mdx',               canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/uz/nedorogie-podarki-na-8-marta-uz.mdx',                 canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/uz/gravirovka-v-tashkente-na-8-marta-uz.mdx',            canonical: 'https://graver-studio.uz/ru/blog/podarki-8-marta-20-idej/' },
  { file: 'content/blog/uz/korporativnye-podarki-na-8-marta-v-tashkente-uz.mdx', canonical: 'https://graver-studio.uz/ru/blog/podarki-na-8-marta-sotrudnitsam/' },

  // ── UZ -uz suffix duplicates of redirected/noindex RU cases ─────────────
  { file: 'content/blog/uz/keys-welcome-pack-povysil-enps-v-it-kompanii-uz.mdx', canonical: 'https://graver-studio.uz/ru/blog/keys-welcome-pack-enps-uzbekistan/' },
]

let changed = 0
let skipped = 0
let missing = 0

for (const { file, canonical } of HOTFIXES) {
  const full = path.join(ROOT, file)
  if (!fs.existsSync(full)) {
    console.warn(`[noindex-hotfix] MISSING: ${file}`)
    missing++
    continue
  }
  let raw = fs.readFileSync(full, 'utf-8')
  if (!raw.startsWith('---')) {
    console.warn(`[noindex-hotfix] not a frontmatter mdx: ${file}`)
    continue
  }
  // Find the second '---' line that closes frontmatter
  const lines = raw.split('\n')
  let endIdx = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') { endIdx = i; break }
  }
  if (endIdx < 0) continue

  const fm = lines.slice(1, endIdx)
  const body = lines.slice(endIdx).join('\n')

  // Idempotency: detect existing noindex/canonicalOverride
  const hasNoindexTrue = fm.some(l => /^noindex:\s*true\s*$/.test(l))
  const hasCanonical = fm.some(l => /^canonicalOverride:/.test(l))

  if (hasNoindexTrue && hasCanonical) {
    skipped++
    continue
  }

  // Remove any existing noindex / canonicalOverride lines, then append ours
  const filtered = fm.filter(l => !/^noindex:/.test(l) && !/^canonicalOverride:/.test(l))
  filtered.push('noindex: true')
  filtered.push(`canonicalOverride: "${canonical}"`)

  const newRaw = ['---', ...filtered, body].join('\n')
  fs.writeFileSync(full, newRaw, 'utf-8')
  changed++
  console.log(`[noindex-hotfix] noindex+canonical -> ${file}  ->  ${canonical}`)
}

console.log(`\n[noindex-hotfix] done. changed=${changed} skipped=${skipped} missing=${missing}`)
