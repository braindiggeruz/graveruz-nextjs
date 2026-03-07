import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import LightersLanding from '@/components/LightersLanding'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale
  if (locale === 'ru') {
    return buildMetadata({
      locale,
      path: 'products/lighters',
      title: 'Металлические зажигалки с лазерной гравировкой — Graver.uz',
      description: 'Зажигалки с лазерной гравировкой в Ташкенте. 4 модели: R-109, R-110, R-111, R-112. Гравировка имени, логотипа, фото. Цены от 140 000 сум. Тираж от 1 штуки.',
    })
  }
  return buildMetadata({
    locale,
    path: 'products/lighters',
    title: 'Lazer gravyurasi bilan metall zajigalkalar – Graver.uz',
    description: "Toshkentda lazer gravyurasi bilan zajigalkalar. 4 model: R-109, R-110, R-111, R-112. Ism, logotip, foto gravyurasi. Narxlar 140 000 so'mdan.",
  })
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const isRu = locale === 'ru'
  const base = 'https://graver-studio.uz'
  const breadcrumbs = [
    { name: isRu ? 'Главная' : 'Bosh sahifa', url: `${base}/${locale}` },
    { name: isRu ? 'Продукция' : 'Mahsulotlar', url: `${base}/${locale}/products/lighters` },
    { name: isRu ? 'Зажигалки с гравировкой' : 'Gravyurali zajigalkalar', url: `${base}/${locale}/products/lighters` },
  ]
  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />
      <LightersLanding locale={locale} />
    </>
  )
}
