
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import ProductPage from '@/components/ProductPage'
import SchemaOrg from '@/components/SchemaOrg'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}


interface PageProps { params: Promise<{ locale: string }> }


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale
  if (locale === 'ru') {
    return buildMetadata({ locale, path: 'products/pens', title: 'Ручки с гравировкой имени или логотипа | Graver.uz', description: 'Ручки с лазерной гравировкой имени или логотипа. Корпоративные подарки в Ташкенте. Тираж от 10 штук.' })
  }
  return buildMetadata({ locale, path: 'products/pens', title: "Ism yoki logotip o'ymakorligi bilan ruchkalar | Graver.uz", description: "Ism yoki logotipning lazer o'ymakorligi bilan ruchkalar. Toshkentda korporativ sovg'alar." })
}

const PRODUCT = {
  slug: 'pens',
  nameRu: 'Ручки с гравировкой',
  nameUz: "O'ymakorlik bilan ruchkalar",
  descRu: 'Деловые ручки с лазерной гравировкой имени или логотипа. Классический корпоративный подарок для сотрудников и партнёров.',
  descUz: "Ism yoki logotipning lazer o'ymakorligi bilan biznes ruchkalar. Xodimlar va hamkorlar uchun klassik korporativ sovg'a.",
  icon: '✒️',
  featuresRu: ["Гравировка имени, логотипа или слогана", "Металлический корпус", "Немецкий стержень Parker или аналог", "Тираж от 10 штук", "Подарочная коробка или чехол", "Именная персонализация для каждого"],
  featuresUz: ["Ism, logotip yoki shiorning o'ymakorligi", "Metall korpus", "Nemis Parker qalami yoki analog", "10 donadan boshlab", "Sovg'a qutisi yoki qobi", "Har biri uchun shaxsiy personalizatsiya"],
}


function productSchema(locale: string) {
  const isRu = locale === 'ru'
  const base = 'https://graver-studio.uz'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isRu ? 'Ручки с лазерной гравировкой' : "Lazer gravyurali ruchkalar",
    description: isRu
      ? 'Деловые ручки с лазерной гравировкой имени или логотипа. Металлический корпус, немецкий стержень. Тираж от 10 штук.'
      : "Ism yoki logotipning lazer o'ymakorligi bilan biznes ruchkalar. 10 donadan boshlab.",
    image: `${base}/images/products/pens/pen-hero.jpg`,
    url: `${base}/${locale}/products/pens`,
    brand: { '@type': 'Brand', name: 'Graver.uz' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      price: '45000',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Graver.uz', url: base },
    },
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  return (
    <>
      <SchemaOrg schema={productSchema(locale)} />
      <ProductPage locale={locale} product={PRODUCT} />
    </>
  )
}
