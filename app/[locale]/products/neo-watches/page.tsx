import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import ProductPage from '@/components/ProductPage'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale
  if (locale === 'ru') {
    return buildMetadata({ locale, path: 'products/neo-watches', title: 'Часы NEO с гравировкой логотипа — корпоративный подарок | Graver.uz', description: 'Часы NEO с лазерной гравировкой логотипа. Корпоративные подарки для VIP-клиентов в Ташкенте. Тираж от 10 штук.' })
  }
  return buildMetadata({ locale, path: 'products/neo-watches', title: "Logotip o'ymakorligi bilan NEO soatlar — korporativ sovg'a | Graver.uz", description: "Logotipning lazer o'ymakorligi bilan NEO soatlar. Toshkentda VIP-mijozlar uchun korporativ sovg'alar." })
}

const PRODUCT = {
  slug: 'neo-watches',
  nameRu: 'Часы NEO с гравировкой',
  nameUz: "NEO soatlar o'ymakorlik bilan",
  descRu: 'Премиальные наручные часы NEO с лазерной гравировкой логотипа. Идеальный корпоративный подарок для VIP-клиентов и топ-менеджеров.',
  descUz: "Logotipning lazer o'ymakorligi bilan premium NEO qo'l soatlari. VIP-mijozlar va top-menejerlar uchun ideal korporativ sovg'a.",
  icon: '⌚',
  heroImage: '/images/products/neo/neo-watch-black-gold.jpg',
  galleryImages: [
    '/images/products/neo/neo-watch-black-gold.jpg',
    '/images/products/neo/neo-watch-black-silver.jpg',
    '/images/products/neo/neo-watch-white-gold.jpg',
    '/images/products/neo/neo-watch-white-silver.jpg',
  ],
  featuresRu: ["Лазерная гравировка логотипа на крышке или задней крышке", "Японский кварцевый механизм", "Сапфировое стекло", "Тираж от 10 штук", "Подарочная упаковка включена", "Доставка по всему Узбекистану"],
  featuresUz: ["Qopqoq yoki orqa qopqoqda logotipning lazer o'ymakorligi", "Yaponiya kvarts mexanizmi", "Safir oyna", "10 donadan boshlab", "Sovg'a qadoqlash kiritilgan", "O'zbekiston bo'ylab yetkazib berish"],
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  return <ProductPage locale={resolvedParams.locale as Locale} product={PRODUCT} />
}
