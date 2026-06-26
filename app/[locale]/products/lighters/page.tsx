import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata, resolveLocalizedSeo } from '@/lib/seo'
import CMSProductPage from '@/components/CMSProductPage'
import { getProduct } from '@/lib/cms'

const SLUG = 'lighters'

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
  return buildMetadata({
    locale,
    path: `products/${SLUG}`,
    title: resolveLocalizedSeo(seo, locale, { title: locale === 'ru' ? 'Зажигалки с гравировкой | Graver.uz' : 'Gravyurali zajigalkalar | Graver.uz' }).title,
    description: resolveLocalizedSeo(seo, locale, { title: '', description: '' }).description,
    ogImage: seo?.ogImage || undefined,
    noindex: seo?.noindex || product?.status !== 'published',
  })
}

export default async function Page({ params }: PageProps) {
  const { locale: l } = await params
  if (!isValidLocale(l)) notFound()
  return <CMSProductPage locale={l as Locale} slug={SLUG} />
}
