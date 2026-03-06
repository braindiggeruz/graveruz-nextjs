import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'

interface ProductPageProps {
  locale: Locale
  product: {
    slug: string
    nameRu: string
    nameUz: string
    descRu: string
    descUz: string
    featuresRu: string[]
    featuresUz: string[]
    icon: string
  }
}

export default function ProductPage({ locale, product }: ProductPageProps) {
  const isRu = locale === 'ru'
  const name = isRu ? product.nameRu : product.nameUz
  const desc = isRu ? product.descRu : product.descUz
  const features = isRu ? product.featuresRu : product.featuresUz

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}` },
    { name: isRu ? 'Каталог' : 'Katalog', url: `https://graver-studio.uz/${locale}/catalog-products` },
    { name, url: `https://graver-studio.uz/${locale}/products/${product.slug}` },
  ]

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400 flex-wrap gap-y-1">
            <li><Link href={`/${locale}`} className="hover:text-teal-500">Graver.uz</Link></li>
            <li className="text-gray-600">/</li>
            <li><Link href={`/${locale}/catalog-products`} className="hover:text-teal-500">{isRu ? 'Каталог' : 'Katalog'}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-gray-300">{name}</li>
          </ol>
        </nav>

        <div className="flex items-center space-x-4 mb-6">
          <span className="text-5xl">{product.icon}</span>
          <h1 className="text-4xl font-bold text-white">{name}</h1>
        </div>

        <p className="text-xl text-gray-300 mb-10">{desc}</p>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {isRu ? 'Особенности' : 'Xususiyatlar'}
          </h2>
          <ul className="space-y-2">
            {features.map((f, i) => (
              <li key={i} className="flex items-start space-x-3 text-gray-300">
                <span className="text-teal-500 mt-1 flex-shrink-0">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://t.me/GraverAdm"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition text-center"
          >
            {isRu ? 'Заказать с гравировкой' : "O'ymakorlik bilan buyurtma berish"}
          </a>
          <Link
            href={`/${locale}/catalog-products`}
            className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-teal-500 hover:text-white transition text-center"
          >
            {isRu ? '← Весь каталог' : '← Butun katalog'}
          </Link>
        </div>
      </div>
    </>
  )
}
