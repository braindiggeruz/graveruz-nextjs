import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'

export const runtime = 'edge'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const revalidate = 3600 // 1 hour

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale

  if (locale === 'ru') {
    return buildMetadata({
      locale,
      path: 'catalog-products',
      title: 'Каталог продукции для гравировки — Graver.uz',
      description: 'Каталог продукции для лазерной гравировки: часы, зажигалки, ручки, повербанки, блокноты. Корпоративные подарки с логотипом в Ташкенте.',
    })
  }

  return buildMetadata({
    locale,
    path: 'catalog-products',
    title: "O'ymakorlik uchun mahsulotlar katalogi — Graver.uz",
    description: "Lazer o'ymakorlik uchun mahsulotlar katalogi: soatlar, zажигalkalar, ruchkalar, powerbank, daftarlar. Toshkentda logotip bilan korporativ sovg'alar.",
  })
}

const PRODUCTS = [
  { slug: 'neo-watches', icon: '⌚', ru: { name: 'Часы NEO', desc: 'Премиальные наручные часы с гравировкой логотипа' }, uz: { name: 'NEO soatlar', desc: 'Logotip o\'ymakorligi bilan premium qo\'l soatlari' } },
  { slug: 'lighters', icon: '🔥', ru: { name: 'Зажигалки', desc: 'Металлические зажигалки с персонализированной гравировкой' }, uz: { name: 'Zажигalkalar', desc: 'Shaxsiylashtirilgan o\'ymakorlik bilan metall zажигalkalar' } },
  { slug: 'pens', icon: '✒️', ru: { name: 'Ручки', desc: 'Деловые ручки с гравировкой имени или логотипа' }, uz: { name: 'Ruchkalar', desc: 'Ism yoki logotip o\'ymakorligi bilan biznes ruchkalar' } },
  { slug: 'powerbanks', icon: '🔋', ru: { name: 'Повербанки', desc: 'Портативные зарядные устройства с брендингом' }, uz: { name: 'Powerbank', desc: 'Brendlash bilan ko\'chma zaryadlovchi qurilmalar' } },
  { slug: 'notebooks', icon: '📓', ru: { name: 'Блокноты', desc: 'Кожаные и деревянные блокноты с гравировкой' }, uz: { name: 'Daftarlar', desc: 'O\'ymakorlik bilan teri va yog\'och daftarlar' } },
]

export default async function CatalogProductsPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const messages = getMessages(locale)
  const isRu = locale === 'ru'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}` },
    { name: messages.nav.products, url: `https://graver-studio.uz/${locale}/catalog-products` },
  ]

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><Link href={`/${locale}`} className="hover:text-teal-500">Graver.uz</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-gray-300">{messages.nav.products}</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold text-white mb-4">
          {isRu ? 'Каталог продукции' : 'Mahsulotlar katalogi'}
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          {isRu
            ? 'Выберите изделие для лазерной гравировки с логотипом вашей компании'
            : "Kompaniyangiz logotipi bilan lazer o'ymakorlik uchun buyumni tanlang"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => {
            const info = isRu ? product.ru : product.uz
            return (
              <Link
                key={product.slug}
                href={`/${locale}/products/${product.slug}`}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition group"
              >
                <div className="text-4xl mb-4">{product.icon}</div>
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-500 transition">
                  {info.name}
                </h2>
                <p className="text-gray-400">{info.desc}</p>
                <div className="mt-4 text-teal-500 text-sm">
                  {isRu ? 'Подробнее →' : 'Batafsil →'}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
