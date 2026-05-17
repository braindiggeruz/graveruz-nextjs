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
import { existsSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readYaml } from './lib/yaml-io.mjs'

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

const pages = listEntries(join(ROOT, 'content', 'pages'))
const products = listEntries(join(ROOT, 'content', 'products'))

const snapshot = {
  generatedAt: new Date().toISOString(),
  pages,
  products,
}

const outPath = join(ROOT, 'lib', '_seo-snapshot.generated.json')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')

console.log(`[seo-snapshot] wrote ${pages.length} pages + ${products.length} products → lib/_seo-snapshot.generated.json`)
