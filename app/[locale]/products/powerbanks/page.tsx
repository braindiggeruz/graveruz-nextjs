
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
    return buildMetadata({ locale, path: 'products/powerbanks', title: 'Повербанки с гравировкой логотипа — корпоративный подарок | Graver.uz', description: 'Повербанки с лазерной гравировкой логотипа. Корпоративные подарки в Ташкенте. Тираж от 10 штук.' })
  }
  return buildMetadata({ locale, path: 'products/powerbanks', title: "Logotip o'ymakorligi bilan powerbank — korporativ sovg'a | Graver.uz", description: "Logotipning lazer o'ymakorligi bilan powerbank. Toshkentda korporativ sovg'alar." })
}

const PRODUCT = {
  slug: 'powerbanks',
  nameRu: 'Повербанки с гравировкой',
  nameUz: "O'ymakorlik bilan powerbank",
  descRu: 'Портативные зарядные устройства с лазерной гравировкой логотипа. Практичный корпоративный подарок для современного бизнеса.',
  descUz: "Logotipning lazer o'ymakorligi bilan ko'chma zaryadlovchi qurilmalar. Zamonaviy biznes uchun amaliy korporativ sovg'a.",
  icon: '🔋',
  featuresRu: ["Лазерная гравировка логотипа на корпусе", "Ёмкость от 5000 до 20000 мАч", "Быстрая зарядка (Quick Charge)", "Тираж от 10 штук", "Подарочная упаковка", "Сертификат безопасности"],
  featuresUz: ["Korpusda logotipning lazer o'ymakorligi", "5000 dan 20000 mAh gacha sig'im", "Tezkor zaryadlash (Quick Charge)", "10 donadan boshlab", "Sovg'a qadoqlash", "Xavfsizlik sertifikati"],
}


function productSchema(locale: string) {
  const isRu = locale === 'ru'
  const base = 'https://graver-studio.uz'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isRu ? 'Повербанки с лазерной гравировкой логотипа' : "Logotip lazer gravyurali powerbank",
    description: isRu
      ? 'Портативные зарядные устройства с лазерной гравировкой логотипа. Еёмкость 5000–20000 мАч. Тираж от 10 штук.'
      : "Logotipning lazer o'ymakorligi bilan ko'chma zaryadlovchi qurilmalar. 10 donadan boshlab.",
    image: `${base}/images/products/powerbanks/powerbank-hero.jpg`,
    url: `${base}/${locale}/products/powerbanks`,
    brand: { '@type': 'Brand', name: 'Graver.uz' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'UZS',
      lowPrice: '120000',
      highPrice: '280000',
      offerCount: '3',
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
