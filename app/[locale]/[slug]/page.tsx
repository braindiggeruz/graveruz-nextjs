import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { breadcrumbSchema, faqSchema } from '@/components/SchemaOrg'
import { getAllPages, getPage } from '@/lib/cms'
import PageBlocks from '@/components/PageBlocks'
import AlternateSlugSetter from '@/components/AlternateSlugSetter'

/**
 * Reserved top-level URL segments that already exist as static routes under
 * app/[locale]/ — Next.js will route to those folders automatically; we still
 * keep this list so generateStaticParams doesn't try to pre-render duplicates.
 */
const RESERVED_SLUGS = new Set([
  'about',
  'blog',
  'catalog-products',
  'contacts',
  'engraved-gifts',
  'guarantees',
  'korporativnye-podarki',
  'podarochniy-nabor-s-chasami',
  'products',
  'soatli-sovga-toplami',
  'thanks',
  'vip-podarki',
  'welcome-packs',
])

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const all = await getAllPages()
  const params: Array<{ locale: string; slug: string }> = []
  for (const p of all) {
    if (p.status !== 'published') continue
    if (RESERVED_SLUGS.has(p.slug)) continue
    const locale = (p.locale as Locale) || 'ru'
    params.push({ locale, slug: p.slug })
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) return {}
  const locale = rawLocale as Locale
  const page = await getPage(slug).catch(() => null)
  if (!page || page.status !== 'published') return {}

  const seo = page.seo
  const title = seo?.title || page.h1 || ''
  const description = seo?.description || page.intro || ''

  // Build hreflang alternateSlug from page.alternateSlug
  const altSlug: Partial<Record<Locale, string>> = {}
  if (page.alternateSlug?.ru) altSlug.ru = page.alternateSlug.ru
  if (page.alternateSlug?.uz) altSlug.uz = page.alternateSlug.uz

  return buildMetadata({
    locale,
    path: slug,
    title,
    description,
    ogImage: seo?.ogImage
      ? (seo.ogImage.startsWith('http') ? seo.ogImage : `https://graver-studio.uz${seo.ogImage}`)
      : undefined,
    noindex: !!seo?.noindex,
    alternateSlug: Object.keys(altSlug).length > 0 ? altSlug : undefined,
  })
}

export default async function CommercialPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) notFound()
  const locale = rawLocale as Locale

  if (RESERVED_SLUGS.has(slug)) notFound()

  const page = await getPage(slug).catch(() => null)
  if (!page || page.status !== 'published') notFound()

  // Locale guard: a page authored as RU must not render at /uz/<slug>
  if (page.locale && page.locale !== locale) notFound()

  // Aggregate FAQ items from any FAQ blocks → JSON-LD
  const faqItems: Array<{ q: string; a: string }> = []
  for (const b of page.blocks || []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const block = b as any
    if (block.discriminant === 'faq' && block.value?.items) {
      faqItems.push(...block.value.items)
    }
  }

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}/` },
    { name: page.h1 || slug, url: `https://graver-studio.uz/${locale}/${slug}/` },
  ]

  const schemas = [
    breadcrumbSchema(breadcrumbs),
    ...(faqItems.length > 0 ? [faqSchema(faqItems)] : []),
  ]

  // Build alternateSlug map for LocaleSwitcher (so /ru/<slug>/ ↔ /uz/<other-slug>/
  // works for CMS pages that have different slugs per locale).
  const altSlugMap: Partial<Record<Locale, string>> = {
    [locale]: slug,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...((page as any).alternateSlug || {}),
  }

  return (
    <>
      <SchemaOrg schema={schemas} />
      <AlternateSlugSetter alternateSlug={altSlugMap} />
      <main data-testid="cms-commercial-page" className="min-h-screen bg-black">
        {page.h1 && (!page.blocks || page.blocks.length === 0 || page.blocks[0]?.discriminant !== 'hero') && (
          <header className="border-b border-gray-900 px-4 py-16">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                {page.h1}
              </h1>
              {page.intro && (
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
                  {page.intro}
                </p>
              )}
            </div>
          </header>
        )}
        <PageBlocks blocks={page.blocks} />
      </main>
    </>
  )
}
