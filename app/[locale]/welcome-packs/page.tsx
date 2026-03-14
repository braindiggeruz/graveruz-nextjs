import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { localBusinessSchema, breadcrumbSchema } from '@/components/SchemaOrg'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale

  if (locale === 'ru') {
    return buildMetadata({
      locale,
      path: 'welcome-packs',
      title: 'Welcome-пак для сотрудников с гравировкой — Graver.uz Ташкент',
      description:
        'Welcome-паки для новых сотрудников с логотипом компании. Ручка, блокнот, повербанк с гравировкой. Тираж от 10 наборов. Производство в Ташкенте.',
      ogImage: 'https://graver-studio.uz/images/og/og-engraved-gifts.jpg',
    })
  }
  return buildMetadata({
    locale,
    path: 'welcome-packs',
    title: "Xodimlar uchun welcome-pak gravyura bilan — Graver.uz Toshkent",
    description:
      "Kompaniya logotipi bilan yangi xodimlar uchun welcome-paklar. Gravyurali ruchka, daftar, powerbank. 10 to'plamdan boshlab. Toshkentda ishlab chiqarish.",
    ogImage: 'https://graver-studio.uz/images/og/og-engraved-gifts.jpg',
  })
}

export default async function WelcomePacksPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const isRu = locale === 'ru'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}/` },
    {
      name: isRu ? 'Welcome-паки' : 'Welcome-paklar',
      url: `https://graver-studio.uz/${locale}/welcome-packs/`,
    },
  ]

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: isRu ? 'Welcome-пак для сотрудников' : "Xodimlar uchun welcome-pak",
    description: isRu
      ? 'Брендированные наборы для новых сотрудников: ручка, блокнот, повербанк с гравировкой логотипа компании.'
      : "Yangi xodimlar uchun brendlangan to'plamlar: kompaniya logotipi gravyurasi bilan ruchka, daftar, powerbank.",
    provider: {
      '@type': 'Organization',
      name: 'Graver Studio',
      url: 'https://graver-studio.uz',
    },
    areaServed: { '@type': 'Country', name: 'Uzbekistan' },
    serviceType: isRu ? 'Welcome-пак' : 'Welcome-pak',
  }

  const packages = isRu
    ? [
        {
          name: 'Старт',
          items: ['Ручка с гравировкой', 'Блокнот A5 с логотипом'],
          desc: 'Базовый набор для массового онбординга',
          price: 'от 150 000 сум/набор',
        },
        {
          name: 'Стандарт',
          items: ['Ручка с гравировкой', 'Блокнот A5 с логотипом', 'Повербанк с логотипом'],
          desc: 'Оптимальный набор для большинства компаний',
          price: 'от 350 000 сум/набор',
          popular: true,
        },
        {
          name: 'Премиум',
          items: ['Ручка Parker-класса', 'Ежедневник кожаный', 'Повербанк', 'Часы NEO с гравировкой'],
          desc: 'Для топ-менеджмента и ключевых сотрудников',
          price: 'от 900 000 сум/набор',
        },
      ]
    : [
        {
          name: 'Start',
          items: ['Gravyurali ruchka', 'A5 logotipli daftar'],
          desc: "Ommaviy onboarding uchun asosiy to'plam",
          price: "150 000 so'mdan/to'plam",
        },
        {
          name: 'Standart',
          items: ['Gravyurali ruchka', 'A5 logotipli daftar', 'Logotipli powerbank'],
          desc: "Ko'pchilik kompaniyalar uchun optimal to'plam",
          price: "350 000 so'mdan/to'plam",
          popular: true,
        },
        {
          name: 'Premium',
          items: ['Parker sinfidagi ruchka', 'Charm kundalik', 'Powerbank', 'Gravyurali NEO soat'],
          desc: "Top-menejerlar va asosiy xodimlar uchun",
          price: "900 000 so'mdan/to'plam",
        },
      ]

  return (
    <>
      <SchemaOrg schema={[localBusinessSchema(), breadcrumbSchema(breadcrumbs), serviceSchema]} />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <li><Link href={`/${locale}`} className="hover:text-teal-500">Graver.uz</Link></li>
              <li className="text-gray-700">/</li>
              <li className="text-gray-400">{isRu ? 'Welcome-паки' : 'Welcome-paklar'}</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isRu
              ? 'Welcome-пак для новых сотрудников'
              : "Yangi xodimlar uchun welcome-pak"}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {isRu
              ? 'Брендированные наборы с гравировкой логотипа вашей компании. Первое впечатление, которое остаётся навсегда.'
              : "Kompaniyangiz logotipi gravyurasi bilan brendlangan to'plamlar. Abadiy qoladigan birinchi taassurot."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/GraverAdm"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {isRu ? 'Заказать welcome-пак' : "Welcome-pak buyurtma berish"}
            </a>
            <a
              href="tel:+998770802288"
              className="border border-teal-500 text-teal-500 px-8 py-4 rounded-lg font-semibold hover:bg-teal-500 hover:text-white transition"
            >
              +998 77 080 22 88
            </a>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {isRu ? 'Готовые пакеты' : "Tayyor paketlar"}
          </h2>
          <p className="text-gray-400 text-center mb-12">
            {isRu ? 'Или соберём набор под ваш бюджет и бренд' : "Yoki byudjet va brendingizga mos to'plam tuzamiz"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className={`rounded-xl p-6 border ${pkg.popular ? 'border-teal-500 bg-teal-500/10' : 'border-gray-700 bg-gray-800/50'} relative`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    {isRu ? 'Популярный' : 'Mashhur'}
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{pkg.desc}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.items.map((item, j) => (
                    <li key={j} className="text-gray-300 text-sm flex items-center">
                      <span className="text-teal-500 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="text-teal-500 font-semibold text-sm">{pkg.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why welcome pack matters */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {isRu ? 'Зачем нужен welcome-пак?' : "Nega welcome-pak kerak?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(isRu
              ? [
                  { title: 'Снижает тревогу новичка', desc: 'Первый день — стресс. Брендированный набор говорит: «Мы рады, что ты с нами».' },
                  { title: 'Укрепляет идентификацию с брендом', desc: 'Сотрудник использует логотипированные вещи каждый день — это работает лучше любого тренинга.' },
                  { title: 'Повышает eNPS', desc: 'Компании с welcome-паком фиксируют рост индекса лояльности сотрудников на 15-25%.' },
                  { title: 'Снижает текучесть', desc: 'Сотрудники, получившие welcome-пак, на 30% реже уходят в первые 3 месяца.' },
                ]
              : [
                  { title: "Yangichilar tashvishini kamaytiradi", desc: "Birinchi kun — stress. Brendlangan to'plam: «Biz siz bilan birga ekanligimizdan xursandmiz» deydi." },
                  { title: "Brend bilan identifikatsiyani mustahkamlaydi", desc: "Xodim har kuni logotipli narsalardan foydalanadi — bu har qanday treningdan yaxshiroq ishlaydi." },
                  { title: "eNPS ni oshiradi", desc: "Welcome-pakli kompaniyalar xodimlar sadoqati indeksining 15-25% o'sishini qayd etadi." },
                  { title: "Kadrlar almashinuvini kamaytiradi", desc: "Welcome-pak olgan xodimlar birinchi 3 oyda 30% kamroq ketadi." },
                ]
            ).map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-500 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {isRu ? 'Читайте также' : "Shuningdek o'qing"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isRu
              ? [
                  { href: `/${locale}/blog/welcome-pack-dlya-sotrudnikov`, label: 'Welcome-пак для сотрудников: полный гид 2025' },
                  { href: `/${locale}/blog/keys-welcome-pack-enps-uzbekistan`, label: 'Кейс: welcome-пак повысил eNPS в IT-компании' },
                  { href: `/${locale}/korporativnye-podarki`, label: 'Все корпоративные подарки с гравировкой' },
                  { href: `/${locale}/blog/korporativnye-podarki-uzbekistan`, label: 'Гид по корпоративным подаркам в Узбекистане' },
                ]
              : [
                  { href: `/${locale}/blog/xodimlar-uchun-welcome-pak`, label: "Xodimlar uchun welcome-pak: to'liq qo'llanma 2025" },
                  { href: `/${locale}/blog/keys-welcome-pack-enps-uzbekiston`, label: "Keys: welcome-pak IT kompaniyada eNPS ni oshirdi" },
                  { href: `/${locale}/korporativnye-podarki`, label: "Gravyura bilan barcha korporativ sovg'alar" },
                  { href: `/${locale}/blog/korporativ-sovgalar-uzbekiston`, label: "O'zbekistonda korporativ sovg'alar bo'yicha qo'llanma" },
                ]
            ).map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-teal-500 transition text-gray-300 hover:text-teal-500 text-sm"
              >
                <span className="text-teal-500 mr-3">📖</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isRu ? 'Обсудим ваш welcome-пак?' : "Welcome-pakingizni muhokama qilamizmi?"}
          </h2>
          <p className="text-gray-400 mb-8">
            {isRu
              ? 'Расскажите о вашей компании и количестве сотрудников — подберём оптимальный набор.'
              : "Kompaniyangiz va xodimlar soni haqida aytib bering — optimal to'plam tanlaymiz."}
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
            <a
              href="tel:+998770802288"
              className="border border-teal-500 text-teal-500 px-8 py-4 rounded-lg font-semibold hover:bg-teal-500 hover:text-white transition"
            >
              +998 77 080 22 88
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
