import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import ProductPage from '@/components/ProductPage'
export const runtime = 'edge'


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

export const revalidate = 3600 // ISR: revalidate every 1 hour

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  return <ProductPage locale={resolvedParams.locale as Locale} product={PRODUCT} />
}
