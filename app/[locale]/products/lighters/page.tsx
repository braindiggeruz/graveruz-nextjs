import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import ProductPage from '@/components/ProductPage'

interface PageProps { params: { locale: string } }

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isValidLocale(params.locale)) return {}
  const locale = params.locale as Locale
  if (locale === 'ru') {
    return buildMetadata({ locale, path: 'products/lighters', title: 'Зажигалки с гравировкой логотипа — корпоративный сувенир | Graver.uz', description: 'Зажигалки с лазерной гравировкой логотипа. Корпоративные сувениры в Ташкенте. Тираж от 10 штук.' })
  }
  return buildMetadata({ locale, path: 'products/lighters', title: "Logotip o'ymakorligi bilan zажигalkalar — korporativ suvenir | Graver.uz", description: "Logotipning lazer o'ymakorligi bilan zажигalkalar. Toshkentda korporativ suvenirlari." })
}

const PRODUCT = {
  slug: 'lighters',
  nameRu: 'Зажигалки с гравировкой',
  nameUz: "O'ymakorlik bilan zажигalkalar",
  descRu: 'Металлические зажигалки с персонализированной лазерной гравировкой. Популярный корпоративный сувенир для мужской аудитории.',
  descUz: "Shaxsiylashtirilgan lazer o'ymakorligi bilan metall zажигalkalar. Erkak auditoriyasi uchun mashhur korporativ suvenir.",
  icon: '🔥',
  featuresRu: ["Лазерная гравировка логотипа или текста", "Нержавеющая сталь или хром", "Ветрозащитное пламя", "Тираж от 10 штук", "Индивидуальная упаковка", "Быстрое изготовление от 1 дня"],
  featuresUz: ["Logotip yoki matnning lazer o'ymakorligi", "Zanglamaydigan po'lat yoki xrom", "Shamolga chidamli alanga", "10 donadan boshlab", "Individual qadoqlash", "1 kundan boshlab tezkor ishlab chiqarish"],
}

export default function Page({ params }: PageProps) {
  if (!isValidLocale(params.locale)) notFound()
  return <ProductPage locale={params.locale as Locale} product={PRODUCT} />
}
