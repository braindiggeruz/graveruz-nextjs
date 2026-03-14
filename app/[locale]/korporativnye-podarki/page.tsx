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
      path: 'korporativnye-podarki',
      title: 'Корпоративные подарки с гравировкой в Ташкенте — Graver.uz',
      description:
        'Корпоративные подарки с логотипом и гравировкой для бизнеса в Ташкенте. Часы, ручки, зажигалки, блокноты. Тираж от 10 штук. Доставка по всему Узбекистану.',
      ogImage: 'https://graver-studio.uz/images/og/og-engraved-gifts.jpg',
    })
  }
  return buildMetadata({
    locale,
    path: 'korporativnye-podarki',
    title: "Toshkentda korporativ sovg'alar — Graver.uz",
    description:
      "Toshkentdagi biznes uchun logotip va gravyura bilan korporativ sovg'alar. Soatlar, ruchkalar, zajigilkalar, daftarlar. 10 donadan boshlab.",
    ogImage: 'https://graver-studio.uz/images/og/og-engraved-gifts.jpg',
  })
}

export default async function KorporativnyePodarkiPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const isRu = locale === 'ru'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}/` },
    {
      name: isRu ? 'Корпоративные подарки' : "Korporativ sovg'alar",
      url: `https://graver-studio.uz/${locale}/korporativnye-podarki/`,
    },
  ]

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: isRu ? 'Корпоративные подарки с гравировкой' : "Gravyura bilan korporativ sovg'alar",
    description: isRu
      ? 'Корпоративные подарки с логотипом компании: гравировка на часах, ручках, зажигалках, блокнотах. Тираж от 10 штук.'
      : "Kompaniya logotipi bilan korporativ sovg'alar: soatlar, ruchkalar, zajigilkalar, daftarlarda gravyura. 10 donadan boshlab.",
    provider: {
      '@type': 'Organization',
      name: 'Graver Studio',
      url: 'https://graver-studio.uz',
    },
    areaServed: { '@type': 'Country', name: 'Uzbekistan' },
    serviceType: isRu ? 'Корпоративные подарки' : "Korporativ sovg'alar",
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      description: isRu ? 'Цена зависит от тиража и материала. Тираж от 10 штук.' : "Narx miqdor va materialga bog'liq. 10 donadan boshlab.",
    },
  }

  const categories = isRu
    ? [
        {
          icon: '⌚',
          title: 'Часы с логотипом',
          desc: 'Брендированные часы NEO — премиальный корпоративный подарок. Гравировка логотипа на задней крышке или циферблате.',
          href: `/${locale}/products/neo-watches`,
          cta: 'Смотреть часы',
        },
        {
          icon: '✒️',
          title: 'Ручки с гравировкой',
          desc: 'Металлические ручки Parker-класса с именной гравировкой. Идеальны для топ-менеджмента и деловых партнёров.',
          href: `/${locale}/products/pens`,
          cta: 'Смотреть ручки',
        },
        {
          icon: '🔥',
          title: 'Зажигалки с логотипом',
          desc: 'Зажигалки Zippo с гравировкой логотипа. Долговечный и запоминающийся корпоративный сувенир.',
          href: `/${locale}/products/lighters`,
          cta: 'Смотреть зажигалки',
        },
        {
          icon: '📓',
          title: 'Блокноты и ежедневники',
          desc: 'Кожаные и экокожаные блокноты с тиснением логотипа. Практичный подарок для сотрудников и клиентов.',
          href: `/${locale}/products/notebooks`,
          cta: 'Смотреть блокноты',
        },
        {
          icon: '🔋',
          title: 'Повербанки с брендингом',
          desc: 'Портативные зарядные устройства с логотипом компании. Технологичный подарок, который используют каждый день.',
          href: `/${locale}/products/powerbanks`,
          cta: 'Смотреть повербанки',
        },
        {
          icon: '🎁',
          title: 'Welcome-паки для сотрудников',
          desc: 'Готовые наборы для новых сотрудников: ручка + блокнот + повербанк с единым брендингом компании.',
          href: `/${locale}/welcome-packs`,
          cta: 'Узнать о welcome-паках',
        },
      ]
    : [
        {
          icon: '⌚',
          title: 'Logotipli soatlar',
          desc: "NEO brendlangan soatlar — premium korporativ sovg'a. Orqa qopqoq yoki tsiferblatda logotip gravyurasi.",
          href: `/${locale}/products/neo-watches`,
          cta: 'Soatlarni ko\'rish',
        },
        {
          icon: '✒️',
          title: 'Gravyurali ruchkalar',
          desc: "Parker sinfidagi metall ruchkalar shaxsiy gravyura bilan. Top-menejerlar va biznes hamkorlar uchun ideal.",
          href: `/${locale}/products/pens`,
          cta: 'Ruchkalarni ko\'rish',
        },
        {
          icon: '🔥',
          title: 'Logotipli zajigilkalar',
          desc: "Logotip gravyurasi bilan Zippo zajigilkalari. Uzoq muddatli va yodda qoladigan korporativ sovenir.",
          href: `/${locale}/products/lighters`,
          cta: 'Zajigilkalarni ko\'rish',
        },
        {
          icon: '📓',
          title: 'Daftarlar va kundaliklar',
          desc: "Logotip bosma bilan charm va eko-charm daftarlar. Xodimlar va mijozlar uchun amaliy sovg'a.",
          href: `/${locale}/products/notebooks`,
          cta: 'Daftarlarni ko\'rish',
        },
        {
          icon: '🔋',
          title: 'Brendlangan powerbank\'lar',
          desc: "Kompaniya logotipi bilan ko'chma zaryadlovchi qurilmalar. Har kuni ishlatiladigan texnologik sovg'a.",
          href: `/${locale}/products/powerbanks`,
          cta: 'Powerbankni ko\'rish',
        },
        {
          icon: '🎁',
          title: 'Xodimlar uchun welcome-paklar',
          desc: "Yangi xodimlar uchun tayyor to'plamlar: ruchka + daftar + powerbank yagona kompaniya brendingi bilan.",
          href: `/${locale}/welcome-packs`,
          cta: 'Welcome-paklar haqida',
        },
      ]

  const benefits = isRu
    ? [
        { num: '200+', label: 'корпоративных клиентов' },
        { num: '15 000+', label: 'изготовленных подарков' },
        { num: '1 день', label: 'минимальный срок изготовления' },
        { num: '10 шт', label: 'минимальный тираж' },
      ]
    : [
        { num: '200+', label: 'korporativ mijozlar' },
        { num: '15 000+', label: 'tayyorlangan sovg\'alar' },
        { num: '1 kun', label: 'minimal ishlab chiqarish muddati' },
        { num: '10 dona', label: 'minimal tiraj' },
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
              <li className="text-gray-400">{isRu ? 'Корпоративные подарки' : "Korporativ sovg'alar"}</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isRu
              ? 'Корпоративные подарки с гравировкой'
              : "Gravyura bilan korporativ sovg'alar"}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {isRu
              ? 'Брендированные подарки с логотипом вашей компании. Тираж от 10 штук, срок от 1 рабочего дня. Доставка по всему Узбекистану.'
              : "Kompaniyangiz logotipi bilan brendlangan sovg'alar. 10 donadan boshlab, 1 ish kunidan muddatda. Butun O'zbekistonga yetkazib berish."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/GraverAdm"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {isRu ? 'Получить консультацию' : 'Maslahat olish'}
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

      {/* Stats */}
      <section className="py-12 bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {benefits.map((b, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-teal-500">{b.num}</div>
                <div className="text-gray-400 text-sm mt-1">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {isRu ? 'Что мы делаем' : 'Nima qilamiz'}
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            {isRu
              ? 'Полный спектр корпоративных подарков с лазерной гравировкой и брендингом'
              : "Lazer gravyurasi va brending bilan korporativ sovg'alarning to'liq assortimenti"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition group">
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-teal-500 transition">{cat.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{cat.desc}</p>
                <Link
                  href={cat.href}
                  className="text-teal-500 hover:text-teal-400 text-sm font-medium transition"
                >
                  {cat.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {isRu ? 'Почему выбирают нас' : 'Nega bizni tanlashadi'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(isRu
              ? [
                  { title: 'Собственное производство', desc: 'Лазерные станки в Ташкенте. Никаких посредников — полный контроль качества и сроков.' },
                  { title: 'Тираж от 10 штук', desc: 'Работаем с малым и средним бизнесом. Нет минимального заказа на миллион.' },
                  { title: 'Срок от 1 дня', desc: 'Срочные заказы выполняем за 24 часа. Стандартный срок — 2-3 рабочих дня.' },
                  { title: 'Брендбук под ключ', desc: 'Разработаем макет гравировки по вашему логотипу. Согласование до запуска в производство.' },
                  { title: 'Доставка по Узбекистану', desc: 'Доставляем в Ташкент, Самарканд, Бухару, Фергану и другие города.' },
                  { title: 'Корпоративный договор', desc: 'Работаем по безналичному расчёту. Закрывающие документы, счёт-фактура.' },
                ]
              : [
                  { title: "O'z ishlab chiqarish", desc: "Toshkentda lazer stanoklari. Vositachilar yo'q — sifat va muddatlar ustidan to'liq nazorat." },
                  { title: '10 donadan boshlab', desc: "Kichik va o'rta biznes bilan ishlaymiz. Millionlik minimal buyurtma yo'q." },
                  { title: '1 kundan muddatda', desc: "Shoshilinch buyurtmalarni 24 soat ichida bajaramiz. Standart muddat — 2-3 ish kuni." },
                  { title: "Brendbuk kalit ostida", desc: "Logotipingiz bo'yicha gravyura maketini ishlab chiqamiz. Ishlab chiqarishdan oldin kelishish." },
                  { title: "O'zbekiston bo'ylab yetkazib berish", desc: "Toshkent, Samarqand, Buxoro, Farg'ona va boshqa shaharlarga yetkazamiz." },
                  { title: 'Korporativ shartnoma', desc: "Naqd pulsiz hisob-kitob bilan ishlaymiz. Yopuvchi hujjatlar, hisob-faktura." },
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

      {/* Internal links to blog */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {isRu ? 'Полезные материалы' : "Foydali materiallar"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isRu
              ? [
                  { href: `/${locale}/blog/korporativnye-podarki-uzbekistan`, label: 'Гид по корпоративным подаркам в Узбекистане' },
                  { href: `/${locale}/blog/welcome-pack-dlya-sotrudnikov`, label: 'Welcome-пак для новых сотрудников: полный гид' },
                  { href: `/${locale}/blog/idei-vip-podarkov`, label: 'Идеи VIP-подарков для топ-менеджмента' },
                  { href: `/${locale}/blog/podarki-8-marta-20-idej`, label: '20 идей подарков на 8 марта' },
                ]
              : [
                  { href: `/${locale}/blog/korporativ-sovgalar-uzbekiston`, label: "O'zbekistonda korporativ sovg'alar bo'yicha qo'llanma" },
                  { href: `/${locale}/blog/xodimlar-uchun-welcome-pak`, label: "Yangi xodimlar uchun welcome-pak: to'liq qo'llanma" },
                  { href: `/${locale}/blog/vip-sovga-goyalari`, label: 'Top-menejerlar uchun VIP sovg\'a g\'oyalari' },
                  { href: `/${locale}/blog/8-mart-sovgalari-20-goya`, label: '8 Mart uchun 20 ta sovg\'a g\'oyasi' },
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
            {isRu ? 'Готовы обсудить заказ?' : "Buyurtmani muhokama qilishga tayyormisiz?"}
          </h2>
          <p className="text-gray-400 mb-8">
            {isRu
              ? 'Напишите нам в Telegram — ответим в течение 30 минут, подберём подарки под ваш бюджет и бренд.'
              : "Bizga Telegramga yozing — 30 daqiqa ichida javob beramiz, byudjet va brendingizga mos sovg'alarni tanlaymiz."}
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
