/**
 * CMS Reader — reads Keystatic content at build time.
 *
 * This module is the bridge between Keystatic YAML/MDX files and Next.js pages.
 * All reads happen at build time (SSG) — no runtime CMS calls.
 *
 * Usage in page.tsx:
 *   const settings = await getSettings()
 *   const home = await getHomepage()
 *   const product = await getProduct('neo-watches')
 */
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

export const reader = createReader(process.cwd(), keystaticConfig)

/** One source of truth for brand/contacts/schema-critical data */
export async function getSettings() {
  const data = await reader.singletons.settings.read()
  return data
}

/** Homepage content (hero, benefits, services, portfolio, process, FAQ) */
export async function getHomepage() {
  const data = await reader.singletons.homepage.read()
  return data
}

/** All products */
export async function getAllProducts() {
  const slugs = await reader.collections.products.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const data = await reader.collections.products.read(slug)
      return data ? { slug, ...data } : null
    })
  )
  return items.filter(Boolean) as Array<NonNullable<(typeof items)[number]>>
}

/** Single product by slug */
export async function getProduct(slug: string) {
  const data = await reader.collections.products.read(slug)
  return data ? { slug, ...data } : null
}

/** All CMS-managed pages (commercial landings, trust, about) */
export async function getAllPages() {
  const slugs = await reader.collections.pages.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const data = await reader.collections.pages.read(slug)
      return data ? { slug, ...data } : null
    })
  )
  return items.filter(Boolean) as Array<NonNullable<(typeof items)[number]>>
}
