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

function faqSchema(locale: string) {
  const isRu = locale === 'ru'
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isRu ? 'Какие модели зажигалок доступны для гравировки?' : 'Gravyura uchun qanday zajigalka modellari mavjud?',
        acceptedAnswer: { '@type': 'Answer', text: isRu ? 'Доступны 4 модели: R-109, R-110, R-111, R-112. Каждая модель отличается формой и размером, но все подходят для лазерной гравировки логотипа, имени или фото.' : "4 ta model mavjud: R-109, R-110, R-111, R-112. Har bir model shakli va o'lchami bilan farqlanadi, lekin barchasi logotip, ism yoki foto lazer gravyurasi uchun mos." },
      },
      {
        '@type': 'Question',
        name: isRu ? 'Сколько стоит зажигалка с гравировкой?' : 'Gravyurali zajigalka qancha turadi?',
        acceptedAnswer: { '@type': 'Answer', text: isRu ? 'Цена зажигалки с лазерной гравировкой — от 140 000 до 170 000 сум в зависимости от модели. При заказе от 50 штук действуют скидки.' : "Lazer gravyurali zajigalka narxi — 140 000 dan 170 000 so'mgacha, modelga qarab. 50 donadan buyurtma berganda chegirmalar amal qiladi." },
      },
      {
        '@type': 'Question',
        name: isRu ? 'Можно ли заказать одну зажигалку с гравировкой?' : 'Bitta zajigalkaga gravyura buyurtma berish mumkinmi?',
        acceptedAnswer: { '@type': 'Answer', text: isRu ? 'Да, минимальный тираж — 1 штука. Мы выполняем как единичные заказы, так и крупные корпоративные партии.' : "Ha, minimal tiraj — 1 dona. Biz yakka buyurtmalarni ham, yirik korporativ partiyalarni ham bajaramiz." },
      },
      {
        '@type': 'Question',
        name: isRu ? 'Сколько времени занимает изготовление?' : 'Tayyorlash qancha vaqt oladi?',
        acceptedAnswer: { '@type': 'Answer', text: isRu ? 'Стандартный срок — 1–3 рабочих дня после утверждения макета. Срочные заказы выполняются за 24 часа.' : "Standart muddat — maket tasdiqlanganidan keyin 1–3 ish kuni. Shoshilinch buyurtmalar 24 soat ichida bajariladi." },
      },
    ],
  }
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
    url: `${base}/${locale}/products/lighters/`,
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
    { name: isRu ? 'Главная' : 'Bosh sahifa', url: `${base}/${locale}/` },
    { name: isRu ? 'Продукция' : 'Mahsulotlar', url: `${base}/${locale}/products/lighters/` },
    { name: isRu ? 'Зажигалки с гравировкой' : 'Gravyurali zajigalkalar', url: `${base}/${locale}/products/lighters/` },
  ]
  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />
      <SchemaOrg schema={productSchema(locale)} />
      <SchemaOrg schema={faqSchema(locale)} />
      <LightersLanding locale={locale} />
    </>
  )
}
