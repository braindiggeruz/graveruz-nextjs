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
      path: 'vip-podarki',
      title: 'VIP-подарки с гравировкой для руководителей — Graver.uz Ташкент',
      description:
        'Эксклюзивные VIP-подарки с гравировкой для топ-менеджмента и партнёров. Часы NEO, ручки Parker-класса, кожаные аксессуары. Индивидуальный подход. Ташкент.',
      ogImage: 'https://graver-studio.uz/images/og/og-engraved-gifts.jpg',
    })
  }
  return buildMetadata({
    locale,
    path: 'vip-podarki',
    title: "Rahbarlar uchun gravyurali VIP sovg'alar — Graver.uz Toshkent",
    description:
      "Top-menejerlar va hamkorlar uchun gravyurali eksklyuziv VIP sovg'alar. NEO soatlar, Parker sinfidagi ruchkalar, charm aksessuarlar. Individual yondashuv. Toshkent.",
    ogImage: 'https://graver-studio.uz/images/og/og-engraved-gifts.jpg',
  })
}

export default async function VipPodarkiPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const isRu = locale === 'ru'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}/` },
    {
      name: isRu ? 'VIP-подарки' : "VIP sovg'alar",
      url: `https://graver-studio.uz/${locale}/vip-podarki/`,
    },
  ]

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: isRu ? 'VIP-подарки с гравировкой' : "Gravyurali VIP sovg'alar",
    description: isRu
      ? 'Эксклюзивные подарки с именной гравировкой для руководителей и VIP-партнёров. Часы, ручки, кожаные аксессуары премиум-класса.'
      : "Rahbarlar va VIP hamkorlar uchun shaxsiy gravyurali eksklyuziv sovg'alar. Premium soatlar, ruchkalar, charm aksessuarlar.",
    provider: {
      '@type': 'Organization',
      name: 'Graver Studio',
      url: 'https://graver-studio.uz',
    },
    areaServed: { '@type': 'Country', name: 'Uzbekistan' },
    serviceType: isRu ? 'VIP-подарки' : "VIP sovg'alar",
  }

  const vipItems = isRu
    ? [
        {
          icon: '⌚',
          title: 'Часы NEO с гравировкой',
          desc: 'Брендированные наручные часы с гравировкой имени или логотипа на задней крышке. Поставляются в фирменной коробке с сертификатом.',
          href: `/${locale}/products/neo-watches`,
          tag: 'Топ выбор',
        },
        {
          icon: '✒️',
          title: 'Ручки Parker-класса',
          desc: 'Металлические ручки премиум-сегмента с именной гравировкой. Идеальны для подписания договоров и деловых встреч.',
          href: `/${locale}/products/pens`,
          tag: null,
        },
        {
          icon: '🔥',
          title: 'Зажигалки Zippo с гравировкой',
          desc: 'Классические зажигалки с гравировкой монограммы или логотипа. Вечный подарок, который передают по наследству.',
          href: `/${locale}/products/lighters`,
          tag: null,
        },
        {
          icon: '📓',
          title: 'Кожаные ежедневники',
          desc: 'Ежедневники из натуральной кожи с тиснением логотипа или имени. Формат A5, 365 страниц, ляссе.',
          href: `/${locale}/products/notebooks`,
          tag: null,
        },
      ]
    : [
        {
          icon: '⌚',
          title: 'Gravyurali NEO soatlar',
          desc: "Orqa qopqoqda ism yoki logotip gravyurasi bilan brendlangan qo'l soatlari. Sertifikat bilan firma qutisida yetkaziladi.",
          href: `/${locale}/products/neo-watches`,
          tag: 'Top tanlov',
        },
        {
          icon: '✒️',
          title: 'Parker sinfidagi ruchkalar',
          desc: "Shaxsiy gravyurali premium segmentdagi metall ruchkalar. Shartnoma imzolash va biznes uchrashuvlar uchun ideal.",
          href: `/${locale}/products/pens`,
          tag: null,
        },
        {
          icon: '🔥',
          title: 'Gravyurali Zippo zajigilkalari',
          desc: "Monogramma yoki logotip gravyurasi bilan klassik zajigilkalar. Avloddan avlodga o'tadigan abadiy sovg'a.",
          href: `/${locale}/products/lighters`,
          tag: null,
        },
        {
          icon: '📓',
          title: 'Charm kundaliklar',
          desc: "Logotip yoki ism bosma bilan tabiiy charm kundaliklar. A5 format, 365 sahifa, lasse.",
          href: `/${locale}/products/notebooks`,
          tag: null,
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
              <li className="text-gray-400">{isRu ? 'VIP-подарки' : "VIP sovg'alar"}</li>
            </ol>
          </nav>
          <div className="inline-block bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm px-4 py-2 rounded-full mb-6">
            {isRu ? '✦ Эксклюзивно. Персонально. Незабываемо.' : '✦ Eksklyuziv. Shaxsiy. Unutilmas.'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isRu
              ? 'VIP-подарки с гравировкой'
              : "Gravyurali VIP sovg'alar"}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {isRu
              ? 'Эксклюзивные подарки для топ-менеджмента, ключевых партнёров и особых случаев. Каждый предмет — с именной гравировкой.'
              : "Top-menejerlar, asosiy hamkorlar va maxsus holatlar uchun eksklyuziv sovg'alar. Har bir narsa — shaxsiy gravyura bilan."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/GraverAdm"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {isRu ? 'Обсудить VIP-заказ' : "VIP buyurtmani muhokama qilish"}
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

      {/* VIP items */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {isRu ? 'Популярные VIP-подарки' : "Mashhur VIP sovg'alar"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vipItems.map((item, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition group relative">
                {item.tag && (
                  <div className="absolute top-4 right-4 bg-teal-500 text-black text-xs font-bold px-2 py-1 rounded">
                    {item.tag}
                  </div>
                )}
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-teal-500 transition">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                <Link href={item.href} className="text-teal-500 hover:text-teal-400 text-sm font-medium transition">
                  {isRu ? 'Подробнее →' : "Batafsil →"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {isRu ? 'Для каких случаев' : "Qanday holatlar uchun"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(isRu
              ? [
                  'Юбилей руководителя',
                  'День рождения партнёра',
                  'Новый год / Навруз',
                  'Подписание контракта',
                  'Выход на пенсию',
                  'Повышение в должности',
                  'Корпоративный юбилей',
                  'Международный визит',
                  'Благодарность клиенту',
                ]
              : [
                  'Rahbar yubileyi',
                  "Hamkor tug'ilgan kuni",
                  'Yangi yil / Navro\'z',
                  'Shartnoma imzolash',
                  'Nafaqaga chiqish',
                  'Lavozim ko\'tarish',
                  'Korporativ yubiley',
                  'Xalqaro tashrif',
                  'Mijozga minnatdorchilik',
                ]
            ).map((occasion, i) => (
              <div key={i} className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-gray-300 text-sm">
                <span className="text-teal-500 mr-2">✦</span>
                {occasion}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {isRu ? 'Как работает VIP-заказ' : "VIP buyurtma qanday ishlaydi"}
          </h2>
          <div className="space-y-6">
            {(isRu
              ? [
                  { step: '01', title: 'Консультация', desc: 'Обсуждаем получателя, повод и бюджет. Подбираем оптимальный подарок.' },
                  { step: '02', title: 'Макет гравировки', desc: 'Разрабатываем дизайн гравировки: имя, монограмма, логотип, пожелание.' },
                  { step: '03', title: 'Согласование', desc: 'Показываем 3D-визуализацию до запуска в производство.' },
                  { step: '04', title: 'Изготовление', desc: 'Производим в срок от 1 рабочего дня с полным контролем качества.' },
                  { step: '05', title: 'Упаковка и доставка', desc: 'Премиальная упаковка с лентой. Доставка курьером в Ташкенте.' },
                ]
              : [
                  { step: '01', title: 'Maslahat', desc: "Qabul qiluvchi, sabab va byudjetni muhokama qilamiz. Optimal sovg'ani tanlaymiz." },
                  { step: '02', title: 'Gravyura maketi', desc: "Gravyura dizaynini ishlab chiqamiz: ism, monogramma, logotip, tilaklarlar." },
                  { step: '03', title: 'Kelishish', desc: "Ishlab chiqarishdan oldin 3D-vizualizatsiyani ko'rsatamiz." },
                  { step: '04', title: 'Ishlab chiqarish', desc: "To'liq sifat nazorati bilan 1 ish kunidan muddatda ishlab chiqaramiz." },
                  { step: '05', title: "Qadoqlash va yetkazib berish", desc: "Lenta bilan premium qadoqlash. Toshkentda kuryer orqali yetkazib berish." },
                ]
            ).map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="text-3xl font-bold text-teal-500 w-12 flex-shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {isRu ? 'Полезные материалы' : "Foydali materiallar"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isRu
              ? [
                  { href: `/${locale}/blog/idei-vip-podarkov`, label: 'Идеи VIP-подарков для топ-менеджмента' },
                  { href: `/${locale}/blog/korporativnye-podarki-uzbekistan`, label: 'Корпоративные подарки в Узбекистане: полный гид' },
                  { href: `/${locale}/korporativnye-podarki`, label: 'Все корпоративные подарки с гравировкой' },
                  { href: `/${locale}/products/neo-watches`, label: 'Часы NEO — флагманский VIP-подарок' },
                ]
              : [
                  { href: `/${locale}/blog/vip-sovga-goyalari`, label: 'Top-menejerlar uchun VIP sovg\'a g\'oyalari' },
                  { href: `/${locale}/blog/korporativ-sovgalar-uzbekiston`, label: "O'zbekistonda korporativ sovg'alar: to'liq qo'llanma" },
                  { href: `/${locale}/korporativnye-podarki`, label: "Gravyura bilan barcha korporativ sovg'alar" },
                  { href: `/${locale}/products/neo-watches`, label: "NEO soatlar — flagman VIP sovg'a" },
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
            {isRu ? 'Создадим подарок, который запомнится' : "Esda qoladigan sovg'a yaratamiz"}
          </h2>
          <p className="text-gray-400 mb-8">
            {isRu
              ? 'Расскажите о получателе и поводе — предложим идеальный вариант в течение 30 минут.'
              : "Qabul qiluvchi va sabab haqida aytib bering — 30 daqiqa ichida ideal variantni taklif qilamiz."}
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
