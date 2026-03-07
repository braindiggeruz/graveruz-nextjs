import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import ProductPage from '@/components/ProductPage'

export const runtime = 'edge'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale
  if (locale === 'ru') {
    return buildMetadata({ locale, path: 'products/notebooks', title: 'Блокноты с гравировкой логотипа — корпоративный подарок | Graver.uz', description: 'Блокноты с лазерной гравировкой логотипа. Корпоративные подарки в Ташкенте. Тираж от 10 штук.' })
  }
  return buildMetadata({ locale, path: 'products/notebooks', title: "Logotip o'ymakorligi bilan daftarlar — korporativ sovg'a | Graver.uz", description: "Logotipning lazer o'ymakorligi bilan daftarlar. Toshkentda korporativ sovg'alar." })
}

const PRODUCT = {
  slug: 'notebooks',
  nameRu: 'Блокноты с гравировкой',
  nameUz: "O'ymakorlik bilan daftarlar",
  descRu: 'Кожаные и деревянные блокноты с лазерной гравировкой логотипа. Элегантный корпоративный подарок для деловых встреч и конференций.',
  descUz: "Logotipning lazer o'ymakorligi bilan teri va yog'och daftarlar. Biznes uchrashuvlari va konferentsiyalar uchun elegant korporativ sovg'a.",
  icon: '📓',
  featuresRu: ["Гравировка логотипа на обложке", "Натуральная кожа или дерево", "Бумага 80 г/м² или выше", "Форматы A5 и A6", "Тираж от 10 штук", "Ручка в комплекте по запросу"],
  featuresUz: ["Muqovada logotipning o'ymakorligi", "Tabiiy teri yoki yog'och", "80 g/m² yoki undan yuqori qog'oz", "A5 va A6 formatlari", "10 donadan boshlab", "So'rov bo'yicha to'plamda ruchka"],
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  return <ProductPage locale={resolvedParams.locale as Locale} product={PRODUCT} />
}
