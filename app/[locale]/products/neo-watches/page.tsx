import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import CMSProductPage from '@/components/CMSProductPage'
import { getProduct } from '@/lib/cms'

const SLUG = 'neo-watches'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: l } = await params
  if (!isValidLocale(l)) return {}
  const locale = l as Locale
  const product = await getProduct(SLUG).catch(() => null)
  const seo = product?.seo
  const title = seo?.title || (locale === 'ru' ? 'Часы NEO с гравировкой | Graver.uz' : 'NEO soatlar gravyura bilan | Graver.uz')
  const description = seo?.description || ''
  return buildMetadata({
    locale,
    path: `products/${SLUG}`,
    title,
    description,
    ogImage: seo?.ogImage || undefined,
    noindex: seo?.noindex || product?.status !== 'published',
  })
}

export default async function Page({ params }: PageProps) {
  const { locale: l } = await params
  if (!isValidLocale(l)) notFound()
  return <CMSProductPage locale={l as Locale} slug={SLUG} />
}
