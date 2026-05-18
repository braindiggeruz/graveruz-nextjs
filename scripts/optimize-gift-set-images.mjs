#!/usr/bin/env node
/**
 * One-off image optimization for premium watch gift set landing.
 * Converts source PNGs (~2MB each) to optimized WebP (~150-300KB)
 * and downsizes to sensible max dimensions for landing-page usage.
 *
 * Run: node scripts/optimize-gift-set-images.mjs
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.join(process.cwd(), 'public', 'images', 'products', 'gift-set-watch')

/**
 * Per-image targets. WebP is the primary output for the landing component.
 * We also overwrite the source PNG with a downsized + max-compressed version
 * so any legacy reference still loads fast.
 */
const TARGETS = [
  { name: 'hero',           maxW: 1600 },
  { name: 'composition',    maxW: 1400 },
  { name: 'packaging',      maxW: 1400 },
  { name: 'engraving',      maxW: 1400 },
  { name: 'executive-gift', maxW: 1400 },
  { name: 'welcome-pack',   maxW: 1400 },
  { name: 'cta',            maxW: 1600 },
  { name: 'watch',          maxW: 900  },
  { name: 'wallet',         maxW: 900  },
  { name: 'pen',            maxW: 900  },
]

async function processOne({ name, maxW }) {
  const srcPng = path.join(ROOT, `${name}.png`)
  try {
    await fs.access(srcPng)
  } catch {
    console.warn(`[skip] ${name}.png not found`)
    return null
  }
  const buf = await fs.readFile(srcPng)
  const beforeKB = Math.round(buf.length / 1024)

  const base = sharp(buf).resize({ width: maxW, withoutEnlargement: true })

  // 1) WebP — primary
  const webpOut = path.join(ROOT, `${name}.webp`)
  await base.clone().webp({ quality: 78, effort: 5 }).toFile(webpOut)

  // 2) Optimized PNG (used as legacy/OG fallback)
  await base.clone().png({ compressionLevel: 9, palette: true, quality: 80 }).toFile(srcPng + '.tmp')
  await fs.rename(srcPng + '.tmp', srcPng)

  const afterWebpKB = Math.round((await fs.stat(webpOut)).size / 1024)
  const afterPngKB = Math.round((await fs.stat(srcPng)).size / 1024)
  console.log(
    `${name.padEnd(15)} | PNG ${beforeKB}KB → ${afterPngKB}KB | WebP ${afterWebpKB}KB`
  )
  return { name, beforeKB, afterPngKB, afterWebpKB }
}

const results = []
for (const t of TARGETS) {
  results.push(await processOne(t))
}

const totalBefore = results.filter(Boolean).reduce((s, r) => s + r.beforeKB, 0)
const totalAfterWebp = results.filter(Boolean).reduce((s, r) => s + r.afterWebpKB, 0)
console.log('---')
console.log(`Total PNG before: ${(totalBefore / 1024).toFixed(2)}MB`)
console.log(`Total WebP after: ${(totalAfterWebp / 1024).toFixed(2)}MB`)
