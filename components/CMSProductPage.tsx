import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'
import ViewCategoryTracker from '@/components/ViewCategoryTracker'
import { getProduct, getSettings } from '@/lib/cms'
import { productSchemaFromCMS, faqSchemaFromCMS } from '@/lib/productSchema'

interface Props {
  locale: Locale
  slug: string
}

/**
 * Server component: reads product data from Keystatic CMS at build time.
 * Editor changes YAML → next build → UI + schema both reflect the change.
 */
export default async function CMSProductPage({ locale, slug }: Props) {
  const product = await getProduct(slug)
  if (!product) notFound()

  const settings = await getSettings().catch(() => null)
  const phone = settings?.phone1 || '+998770802288'
  const phoneDisplay = settings?.phone1Display || '+998 77 080 22 88'
  const telegramUrl = settings?.telegramUrl || 'https://t.me/GraverAdm'

  const isRu = locale === 'ru'
  const name = (isRu ? product.nameRu : product.nameUz) || product.nameRu || ''
  const desc = (isRu ? product.descriptionRu : product.descriptionUz) || product.descriptionRu || ''
  const features = isRu ? (product.featuresRu || []) : (product.featuresUz || [])
  const processSteps = isRu ? (product.processStepsRu || []) : (product.processStepsUz || [])
  const trustBadges = isRu ? (product.trustBadgesRu || []) : (product.trustBadgesUz || [])

  const breadcrumbs = [
    { name: isRu ? 'Главная' : 'Bosh sahifa', url: `https://graver-studio.uz/${locale}/` },
    { name: isRu ? 'Каталог' : 'Katalog', url: `https://graver-studio.uz/${locale}/catalog-products/` },
    { name, url: `https://graver-studio.uz/${locale}/products/${slug}/` },
  ]

  const productLd = productSchemaFromCMS(product, locale)
  const faqLd = faqSchemaFromCMS(product.faq, locale)

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />
      <SchemaOrg schema={productLd} />
      {faqLd && <SchemaOrg schema={faqLd} />}
      <ViewCategoryTracker
        categoryId={`product_${slug}`}
        categoryName={name || slug}
      />

      <section className="relative bg-gradient-to-b from-black to-gray-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb" className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-400 flex-wrap gap-y-1">
              <li><Link href={`/${locale}/`} className="hover:text-teal-500 transition">Graver.uz</Link></li>
              <li className="text-gray-600">/</li>
              <li><Link href={`/${locale}/catalog-products/`} className="hover:text-teal-500 transition">{isRu ? 'Каталог' : 'Katalog'}</Link></li>
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" data-testid="product-h1">{name}</h1>
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
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition text-center"
                >
                  {isRu ? 'Заказать с гравировкой' : "O'ymakorlik bilan buyurtma berish"}
                </a>
                <a
                  href={`tel:${phone}`}
                  className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-teal-500 hover:text-white transition text-center"
                >
                  {phoneDisplay}
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

      {product.gallery && product.gallery.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              {isRu ? 'Галерея работ' : 'Ishlar galereyasi'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {product.gallery.map((src, i) => src && (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-700 bg-gray-800/50 aspect-square group">
                  <Image src={src} alt={`${name} — ${i + 1}`} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {features.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">{isRu ? 'Характеристики' : 'Xususiyatlar'}</h2>
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
            )}

            {product.pricingTiers && product.pricingTiers.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">{isRu ? 'Цены' : 'Narxlar'}</h2>
                <div className="space-y-4">
                  {product.pricingTiers.map((tier, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-5 border transition ${
                        tier.highlight ? 'bg-teal-500/10 border-teal-500/50' : 'bg-gray-800/50 border-gray-700'
                      }`}
                      data-testid={`pricing-tier-${i}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{isRu ? tier.nameRu : tier.nameUz}</h3>
                          <p className="text-gray-400 text-sm mt-1">{isRu ? tier.descRu : tier.descUz}</p>
                        </div>
                        <span className={`font-bold text-xl ml-4 flex-shrink-0 ${tier.highlight ? 'text-teal-400' : 'text-orange-400'}`} data-testid={`pricing-price-${i}`}>
                          {tier.priceDisplay || (tier.price ? `${tier.price.toLocaleString('ru-RU')} сум` : '')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mt-4">{isRu ? '* Цены за единицу. Скидки от 10+ штук.' : '* Narxlar birlik uchun. 10+ donadan chegirmalar.'}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {processSteps.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">{isRu ? 'Как сделать заказ' : 'Qanday buyurtma berish'}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <div key={i} className="relative bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-lg">{i + 1}</div>
                  <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {product.faq && product.faq.length > 0 && (
        <section className="py-16 bg-black">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">{isRu ? 'Частые вопросы' : "Ko'p so'raladigan savollar"}</h2>
            <div className="space-y-4">
              {product.faq.map((item, i) => (
                <details key={i} className="bg-gray-800/50 rounded-xl border border-gray-700 group">
                  <summary className="px-6 py-5 cursor-pointer text-white font-medium hover:text-teal-500 transition list-none flex justify-between items-center">
                    {isRu ? item.qRu : item.qUz}
                    <span className="text-teal-500 ml-4 flex-shrink-0 text-xl">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-gray-400 leading-relaxed">{isRu ? item.aRu : item.aUz}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Useful articles & related money pages (internal-link booster) ── */}
      <RelatedArticlesBlock locale={locale} slug={slug} />

      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{isRu ? 'Готовы сделать заказ?' : 'Buyurtma berishga tayyormisiz?'}</h2>
          <p className="text-gray-400 mb-8">{isRu ? 'Напишите нам — ответим в течение 30 минут.' : '30 daqiqa ichida javob beramiz.'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition">
              {isRu ? 'Написать в Telegram' : 'Telegramga yozish'}
            </a>
            <Link href={`/${locale}/catalog-products/`} className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-teal-500 hover:text-white transition">
              {isRu ? '← Весь каталог' : '← Butun katalog'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// ── Per-product internal link map ────────────────────────────────────────────
// Each product gets 2-3 blog links + 1-2 money page links per locale.
// All slugs verified to exist in content/blog/{ru,uz}/ at time of editing.
type ProductLink = { href: string; label: string }

const PRODUCT_BLOG_LINKS: Record<string, { ru: ProductLink[]; uz: ProductLink[] }> = {
  notebooks: {
    ru: [
      { href: '/ru/blog/welcome-pack-dlya-sotrudnikov/', label: 'Welcome-пак для сотрудников: полный гид' },
      { href: '/ru/blog/brendirovanie-suvenirov/', label: 'Брендирование сувениров: гравировка, УФ-печать, тампопечать' },
      { href: '/ru/blog/korporativnye-podarki-uzbekistan/', label: 'Корпоративные подарки в Узбекистане' },
    ],
    uz: [
      { href: '/uz/blog/xodimlar-uchun-welcome-pack/', label: "Xodimlar uchun welcome-pak: to'liq qo'llanma" },
      { href: '/uz/blog/suvenir-brendlash/', label: 'Suvenirlarni brendlash: gravyura, UF va tampo-pechat' },
      { href: '/uz/blog/korporativ-sovgalar-ozbekiston/', label: "O'zbekistonda korporativ sovg'alar" },
    ],
  },
  pens: {
    ru: [
      { href: '/ru/blog/welcome-pack-dlya-sotrudnikov/', label: 'Welcome-пак для сотрудников: полный гид' },
      { href: '/ru/blog/brendirovanie-suvenirov/', label: 'Брендирование сувениров: гравировка, УФ-печать, тампопечать' },
      { href: '/ru/blog/podarochnye-nabory-s-logotipom/', label: 'Подарочные наборы с логотипом' },
    ],
    uz: [
      { href: '/uz/blog/xodimlar-uchun-welcome-pack/', label: "Xodimlar uchun welcome-pak: to'liq qo'llanma" },
      { href: '/uz/blog/suvenir-brendlash/', label: 'Suvenirlarni brendlash' },
      { href: '/uz/blog/logotipli-sovga-setlari/', label: "Logotipli sovg'a setlari" },
    ],
  },
  'neo-watches': {
    ru: [
      { href: '/ru/blog/idei-vip-podarkov/', label: 'Идеи VIP-подарков для топ-менеджмента' },
      { href: '/ru/blog/kak-vybrat-vip-podarok-partneru-uzbekistan/', label: 'Как выбрать VIP-подарок партнёру в Узбекистане' },
      { href: '/ru/blog/korporativnye-podarki-uzbekistan/', label: 'Корпоративные подарки в Узбекистане' },
    ],
    uz: [
      { href: '/uz/blog/vip-sovga-goyalari/', label: "VIP sovg'a g'oyalari" },
      { href: '/uz/blog/vip-hamkor-uchun-sovgani-qanday-tanlash-ozbekiston/', label: "VIP hamkor uchun sovg'ani qanday tanlash" },
      { href: '/uz/blog/korporativ-sovgalar-ozbekiston/', label: "O'zbekistonda korporativ sovg'alar" },
    ],
  },
  lighters: {
    ru: [
      { href: '/ru/blog/brendirovannye-zazhigalki-i-chasy-s-logotipom/', label: 'Брендированные зажигалки и часы с логотипом' },
      { href: '/ru/blog/idei-vip-podarkov/', label: 'Идеи VIP-подарков для бизнес-партнёров' },
      { href: '/ru/blog/korporativnye-podarki-uzbekistan/', label: 'Корпоративные подарки в Узбекистане' },
    ],
    uz: [
      { href: '/uz/blog/logotipli-zajigalka-va-soat/', label: "Logotipli zajigalka va soat" },
      { href: '/uz/blog/vip-sovga-goyalari/', label: "VIP sovg'a g'oyalari" },
      { href: '/uz/blog/korporativ-sovgalar-ozbekiston/', label: "O'zbekistonda korporativ sovg'alar" },
    ],
  },
  powerbanks: {
    ru: [
      { href: '/ru/blog/welcome-pack-dlya-sotrudnikov/', label: 'Welcome-пак для сотрудников: полный гид' },
      { href: '/ru/blog/brendirovanie-suvenirov/', label: 'Брендирование сувениров: гравировка, УФ-печать, тампопечать' },
      { href: '/ru/blog/korporativnye-podarki-uzbekistan/', label: 'Корпоративные подарки в Узбекистане' },
    ],
    uz: [
      { href: '/uz/blog/xodimlar-uchun-welcome-pack/', label: "Xodimlar uchun welcome-pak: to'liq qo'llanma" },
      { href: '/uz/blog/suvenir-brendlash/', label: 'Suvenirlarni brendlash' },
      { href: '/uz/blog/korporativ-sovgalar-ozbekiston/', label: "O'zbekistonda korporativ sovg'alar" },
    ],
  },
}

const PRODUCT_MONEY_LINKS: Record<Locale, ProductLink[]> = {
  ru: [
    { href: '/ru/korporativnye-podarki/', label: 'Все корпоративные подарки с гравировкой' },
    { href: '/ru/welcome-packs/', label: 'Welcome-паки для новых сотрудников' },
    { href: '/ru/lazernaya-gravirovka-tashkent/', label: 'Лазерная гравировка в Ташкенте' },
  ],
  uz: [
    { href: '/uz/korporativnye-podarki/', label: "Barcha korporativ sovg'alar (gravyura bilan)" },
    { href: '/uz/welcome-packs/', label: 'Yangi xodimlar uchun welcome-pak' },
    { href: '/uz/toshkentda-lazer-gravyura/', label: 'Toshkentda lazer gravyura' },
  ],
}

function RelatedArticlesBlock({ locale, slug }: { locale: Locale; slug: string }) {
  const isRu = locale === 'ru'
  const blogLinks = PRODUCT_BLOG_LINKS[slug]?.[locale] || []
  const moneyLinks = PRODUCT_MONEY_LINKS[locale] || []
  if (blogLinks.length === 0 && moneyLinks.length === 0) return null

  return (
    <section className="py-16 bg-black" data-testid="product-related-articles">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          {isRu ? 'Полезные статьи' : 'Foydali maqolalar'}
        </h2>
        {blogLinks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {blogLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-teal-500 transition text-gray-300 hover:text-teal-500 text-sm"
                data-testid={`product-blog-link-${i}`}
              >
                <span className="text-teal-500 mr-3">→</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}
        {moneyLinks.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              {isRu ? 'Связанные услуги' : 'Bog\u2018liq xizmatlar'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {moneyLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center justify-center p-3 bg-teal-500/10 rounded-lg border border-teal-500/30 hover:border-teal-500 hover:bg-teal-500/20 transition text-teal-400 hover:text-teal-300 text-sm text-center"
                  data-testid={`product-money-link-${i}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
