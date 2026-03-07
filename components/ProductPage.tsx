import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'

interface PricingTier {
  nameRu: string
  nameUz: string
  price: string
  descRu: string
  descUz: string
  highlight?: boolean
}

interface FAQItem {
  qRu: string
  qUz: string
  aRu: string
  aUz: string
}

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
    heroImage?: string
    galleryImages?: string[]
    pricingTiers?: PricingTier[]
    faq?: FAQItem[]
    processStepsRu?: string[]
    processStepsUz?: string[]
    trustBadgesRu?: string[]
    trustBadgesUz?: string[]
  }
}

export default function ProductPage({ locale, product }: ProductPageProps) {
  const isRu = locale === 'ru'
  const name = isRu ? product.nameRu : product.nameUz
  const desc = isRu ? product.descRu : product.descUz
  const features = isRu ? product.featuresRu : product.featuresUz
  const processSteps = isRu ? (product.processStepsRu ?? []) : (product.processStepsUz ?? [])
  const trustBadges = isRu ? (product.trustBadgesRu ?? []) : (product.trustBadgesUz ?? [])

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}` },
    { name: isRu ? 'Каталог' : 'Katalog', url: `https://graver-studio.uz/${locale}/catalog-products` },
    { name, url: `https://graver-studio.uz/${locale}/products/${product.slug}` },
  ]

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />

      {/* ── Hero Section ── */}
      <section className="relative bg-gradient-to-b from-black to-gray-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-400 flex-wrap gap-y-1">
              <li><Link href={`/${locale}`} className="hover:text-teal-500 transition">Graver.uz</Link></li>
              <li className="text-gray-600">/</li>
              <li><Link href={`/${locale}/catalog-products`} className="hover:text-teal-500 transition">{isRu ? 'Каталог' : 'Katalog'}</Link></li>
              <li className="text-gray-600">/</li>
              <li className="text-gray-300">{name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-400 px-4 py-2 rounded-full text-sm mb-6">
                <span>✦</span>
                {isRu ? 'Лазерная гравировка' : "Lazer o'ymakorlik"}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{name}</h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">{desc}</p>

              {trustBadges.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {trustBadges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700">
                      <span className="text-teal-500 flex-shrink-0">✓</span>
                      <span className="text-gray-300 text-sm">{badge}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://t.me/GraverAdm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition text-center"
                >
                  {isRu ? 'Заказать с гравировкой' : "O'ymakorlik bilan buyurtma berish"}
                </a>
                <a
                  href="tel:+998770802288"
                  className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-teal-500 hover:text-white transition text-center"
                >
                  +998 77 080 22 88
                </a>
              </div>
            </div>

            {product.heroImage && (
              <div className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800/50 shadow-2xl">
                <Image
                  src={product.heroImage}
                  alt={name}
                  width={600}
                  height={500}
                  className="w-full object-cover max-h-[500px]"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      {product.galleryImages && product.galleryImages.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              {isRu ? 'Галерея работ' : 'Ishlar galereyasi'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {product.galleryImages.map((src, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-700 bg-gray-800/50 aspect-square group">
                  <Image
                    src={src}
                    alt={`${name} — ${i + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Features + Pricing ── */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                {isRu ? 'Характеристики' : 'Xususiyatlar'}
              </h2>
              <ul className="space-y-4">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-teal-500 text-xs">✓</span>
                    </span>
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {product.pricingTiers && product.pricingTiers.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">
                  {isRu ? 'Цены' : 'Narxlar'}
                </h2>
                <div className="space-y-4">
                  {product.pricingTiers.map((tier, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-5 border transition ${
                        tier.highlight
                          ? 'bg-teal-500/10 border-teal-500/50'
                          : 'bg-gray-800/50 border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {isRu ? tier.nameRu : tier.nameUz}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            {isRu ? tier.descRu : tier.descUz}
                          </p>
                        </div>
                        <span className={`font-bold text-xl ml-4 flex-shrink-0 ${tier.highlight ? 'text-teal-400' : 'text-orange-400'}`}>
                          {tier.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  {isRu ? '* Цены указаны за единицу. Скидки от 10+ штук.' : '* Narxlar birlik uchun. 10+ donadan chegirmalar.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      {processSteps.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              {isRu ? 'Как сделать заказ' : 'Qanday buyurtma berish'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <div key={i} className="relative bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-lg">
                    {i + 1}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {product.faq && product.faq.length > 0 && (
        <section className="py-16 bg-black">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">
              {isRu ? 'Частые вопросы' : "Ko'p so'raladigan savollar"}
            </h2>
            <div className="space-y-4">
              {product.faq.map((item, i) => (
                <details key={i} className="bg-gray-800/50 rounded-xl border border-gray-700 group">
                  <summary className="px-6 py-5 cursor-pointer text-white font-medium hover:text-teal-500 transition list-none flex justify-between items-center">
                    {isRu ? item.qRu : item.qUz}
                    <span className="text-teal-500 ml-4 flex-shrink-0 text-xl">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                    {isRu ? item.aRu : item.aUz}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ── */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isRu ? 'Готовы сделать заказ?' : 'Buyurtma berishga tayyormisiz?'}
          </h2>
          <p className="text-gray-400 mb-8">
            {isRu
              ? 'Напишите нам — ответим в течение 30 минут и подберём оптимальное решение.'
              : "Bizga yozing — 30 daqiqa ichida javob beramiz va optimal yechim topamiz."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/GraverAdm"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {isRu ? 'Написать в Telegram' : "Telegramga yozish"}
            </a>
            <Link
              href={`/${locale}/catalog-products`}
              className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-teal-500 hover:text-white transition"
            >
              {isRu ? '← Весь каталог' : '← Butun katalog'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
