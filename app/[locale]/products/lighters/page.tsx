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

function productSchema(locale: string) {
  const isRu = locale === 'ru'
  const base = 'https://graver-studio.uz'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isRu ? 'Металлические зажигалки с лазерной гравировкой' : 'Lazer gravyurasi bilan metall zajigalkalar',
    description: isRu
      ? 'Зажигалки с лазерной гравировкой логотипа или имени. 4 модели: R-109, R-110, R-111, R-112. Тираж от 1 штуки. Срок 1–3 дня.'
      : "Logotip yoki ism bilan lazer gravyurali zajigalkalar. 4 model. 1 donadan boshlab.",
    image: `${base}/images/products/lighters/lighter-r109.jpg`,
    url: `${base}/${locale}/products/lighters`,
    brand: {
      '@type': 'Brand',
      name: 'Graver.uz',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '92',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'UZS',
      lowPrice: '140000',
      highPrice: '170000',
      offerCount: '4',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Graver.uz',
        url: base,
      },
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Organization', name: 'IT Park Tashkent' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: isRu
          ? 'Заказали 100 зажигалок с логотипом для конференции. Гравировка чёткая, доставка вовремя.'
          : "Konferensiya uchun 100 dona logotipli zajigalka buyurtma berdik. Gravyura aniq, yetkazib berish o'z vaqtida.",
      },      {
        '@type': 'Review',
        author: { '@type': 'Organization', name: 'Artel Electronics' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: isRu
          ? 'Используем зажигалки Graver как корпоративные подарки. Качество стабильно высокое.'
          : "Graver zajigalkalarini korporativ sovg'a sifatida ishlatamiz. Sifat barqaror yuqori.",
      },
    ],
  }
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
      <SchemaOrg schema={productSchema(locale)} />
      <LightersLanding locale={locale} />
    </>
  )
}
