
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { organizationSchema, localBusinessSchema } from '@/components/SchemaOrg'
import { getAllPostsMeta } from '@/lib/blog'
import FAQSection from '@/components/FAQSection'
import ContactForm from '@/components/ContactForm'

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
      path: '',
      title: 'Лазерная гравировка и брендирование для бизнеса в Ташкенте — Graver.uz',
      description: 'Корпоративные подарки, welcome-паки, VIP-наборы с лазерной гравировкой. Работаем с B2B-клиентами по всему Узбекистану. Ташкент.',
      ogImage: 'https://graver-studio.uz/images/og/og-home.jpg',
    })
  }

  return buildMetadata({
    locale,
    path: '',
    title: "Toshkentda biznes uchun lazer o'ymakorlik va brendlash — Graver.uz",
    description: "Logotip bilan korporativ sovg'alar, welcome-to'plamlar, VIP-to'plamlar. O'zbekiston bo'ylab B2B-mijozlar bilan ishlaymiz.",
    ogImage: 'https://graver-studio.uz/images/og/og-home.jpg',
  })
}


export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const messages = getMessages(locale)
  const recentPosts = getAllPostsMeta(locale).slice(0, 3)

  const isRu = locale === 'ru'

  return (
    <>
      <SchemaOrg schema={[organizationSchema(), localBusinessSchema()]} />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — exact transplant from CRA App.js
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black pt-20" id="hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium px-4 py-2 rounded-full">
                {messages.hero.badge}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {messages.hero.title}<br />
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">{messages.hero.titleAccent}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {messages.hero.subtitle}<br className="hidden sm:block" />
              {messages.hero.subtitleLine2}<br className="hidden sm:block" />
              <span className="text-teal-500 font-semibold">{messages.hero.subtitleAccent}</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <a
                href="#contact"
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-10 py-5 rounded-lg font-bold text-lg hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-500/50 min-h-[56px] text-center"
                data-track="cta"
                data-placement="hero-primary"
              >
                {messages.hero.ctaPrimary}
              </a>
              <a
                href="https://t.me/GraverAdm"
                data-track="tg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-transparent text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-white/10 transition border border-white/30 flex items-center justify-center gap-2 min-h-[56px]"
                data-placement="hero-secondary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                {messages.hero.ctaSecondary}
              </a>
            </div>
            {/* Trust indicators — exact from CRA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">100%</div>
                <div className="text-sm text-gray-300">{messages.hero.stats.approval}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">1-3</div>
                <div className="text-sm text-gray-300">{messages.hero.stats.days}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">∞</div>
                <div className="text-sm text-gray-300">{messages.hero.stats.volume}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-teal-500">✓</div>
                <div className="text-sm text-gray-300">{messages.hero.stats.guarantee}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          B2B BENEFITS SECTION (ported from CRA)
      ═══════════════════════════════════════════════════════════ */}
      <section id="benefits" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isRu ? 'Почему бизнес выбирает' : 'Nima uchun biznes tanlaydi'}
              <br />
              <span className="text-teal-500">Graver.uz</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {isRu
                ? 'Мы — не просто гравировка. Мы — B2B-партнёр, который закрывает задачу полностью: от идеи до упакованного тиража.'
                : "Biz — oddiy gravyura emas. Biz — g'oyadan tayyor tirajgacha vazifani to'liq yopadigan B2B-hamkor."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
                title: isRu ? 'Макет до производства' : 'Ishlab chiqarishdan oldin maket',
                desc: isRu
                  ? 'Вы видите результат до запуска. Утверждаете — запускаем. Без сюрпризов.'
                  : "Natijani ishga tushirishdan oldin ko'rasiz. Tasdiqlaysiz — ishga tushiramiz. Kutilmagan holatlar bo'lmaydi.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: isRu ? 'Любые тиражи' : 'Istalgan tiraj',
                desc: isRu
                  ? 'От 1 штуки до тысяч. Единичный VIP-подарок или серия для всей команды с персонализацией.'
                  : "1 donadan minglab donagacha. Yagona VIP-sovg'a yoki butun jamoa uchun seriya bilan personalizatsiya qilish.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: isRu ? 'Точные сроки' : 'Aniq muddatlar',
                desc: isRu
                  ? 'Типовые заказы 1-3 дня. Срочное производство по запросу. Прозрачное планирование под ваш корпоративный календарь и мероприятия.'
                  : "Oddiy buyurtmalar 1-3 kun. So'rov bo'yicha shoshilinch ishlab chiqarish. Korporativ taqvimingiz va tadbirlaringiz uchun shaffof rejalashtirish.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: isRu ? 'Любые материалы' : 'Har qanday materiallar',
                desc: isRu
                  ? 'Металл, анодированный алюминий, дерево, стекло, кожа, премиальные пластики. Fiber, CO2, MOPA, UV-технологии под каждую задачу.'
                  : "Metall, anodlangan alyuminiy, yog'och, shisha, charm, premium plastmassalar. Har bir vazifa uchun Fiber, CO2, MOPA, UV texnologiyalari.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: isRu ? 'Работаем с вашими файлами' : 'Sizning fayllaringiz bilan ishlaymiz',
                desc: isRu
                  ? 'Логотипы, брендбуки, вектор, фото. Нет макета — создадим в корпоративном стиле. Соблюдаем требования брендбука.'
                  : "Logotiplar, brend-gaydlar, vektor, foto. Maket bo'lmasa — korporativ uslubingizga mos yaratamiz. Brendbuk talablariga rioya qilamiz.",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: isRu ? 'B2B-сервис' : 'B2B xizmat',
                desc: isRu
                  ? 'Работа с юрлицами, закрывающие документы, отсрочка платежа по согласованию. Персональный менеджер для крупных заказов.'
                  : "Yuridik shaxslar bilan ishlash, yopuvchi hujjatlar, kelishuv bo'yicha to'lovni kechiktirish. Yirik buyurtmalar uchun shaxsiy menejer.",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group"
              >
                <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES SECTION (existing, preserved)
      ═══════════════════════════════════════════════════════════ */}
      <section id="services" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {messages.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '✦',
                title: messages.services.laser_engraving,
                desc: isRu
                  ? 'Точная лазерная гравировка на металле, дереве, коже и стекле'
                  : "Metall, yog'och, teri va shishada aniq lazer o'ymakorlik",
              },
              {
                icon: '🎁',
                title: messages.services.corporate_gifts,
                desc: isRu
                  ? 'Корпоративные подарки с логотипом для сотрудников и партнёров'
                  : "Xodimlar va hamkorlar uchun logotip bilan korporativ sovg'alar",
              },
              {
                icon: '📦',
                title: messages.services.welcome_packs,
                desc: isRu
                  ? 'Welcome-паки для новых сотрудников с брендированными предметами'
                  : "Brendlangan buyumlar bilan yangi xodimlar uchun welcome-to'plamlar",
              },
              {
                icon: '💼',
                title: messages.services.branded_sets,
                desc: isRu
                  ? 'Брендированные наборы для корпоративных мероприятий и презентаций'
                  : "Korporativ tadbirlar va taqdimotlar uchun brendlangan to'plamlar",
              },
              {
                icon: '⭐',
                title: messages.services.vip_gifts,
                desc: isRu
                  ? 'VIP-подарки для ключевых клиентов и партнёров высшего уровня'
                  : "Asosiy mijozlar va yuqori darajadagi hamkorlar uchun VIP-sovg'alar",
              },
              {
                icon: '🏆',
                title: isRu ? 'Награды и сертификаты' : 'Mukofotlar va sertifikatlar',
                desc: isRu
                  ? 'Именные награды, кубки и сертификаты с гравировкой'
                  : "O'ymakorlik bilan shaxsiy mukofotlar, kuboklar va sertifikatlar",
              },
            ].map((service, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRODUCTS SECTION — Lighters Catalog (ported from CRA)
      ═══════════════════════════════════════════════════════════ */}
      <section id="products" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                {isRu ? 'Новый каталог' : 'Yangi katalog'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {isRu ? 'Зажигалки с гравировкой' : 'Gravyurali zajigalkalar'}
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {isRu
                  ? 'Эксклюзивные зажигалки с лазерной гравировкой логотипа, имени или фото. Идеальный подарок для любого повода.'
                  : "Logotip, ism yoki surat bilan eksklyuziv zajigalkalar. Korporativ yoki shaxsiy sovg'a uchun ideal."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${locale}/products/lighters`}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition"
                >
                  {isRu ? 'Смотреть все модели' : "Barcha modellarni ko'rish"}
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Silver Gloss', price: '140,000', bg: 'from-gray-300 to-gray-100', text: 'text-gray-700', priceColor: 'text-orange-600', img: '/images/products/lighters/r109_silver_gloss.jpg' },
                { name: 'Black Matte', price: '150,000', bg: 'from-gray-800 to-gray-900', text: 'text-white', priceColor: 'text-orange-400', img: '/images/products/lighters/r110_black_matte.jpg' },
                { name: 'Black Texture', price: '170,000', bg: 'from-gray-700 to-black', text: 'text-white', priceColor: 'text-orange-400', img: '/images/products/lighters/r111_black_texture.jpg' },
                { name: 'Brushed Steel', price: '160,000', bg: 'from-gray-500 to-gray-400', text: 'text-gray-800', priceColor: 'text-orange-600', img: '/images/products/lighters/r112_brushed_steel.jpg' },
              ].map((product, i) => (
                <div key={i} className={`bg-gradient-to-br ${product.bg} aspect-square rounded-2xl overflow-hidden relative group`}>
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-white font-semibold text-sm">{product.name}</span>
                    <p className={`${product.priceColor} font-bold text-sm`}>
                      {product.price} {isRu ? 'сум' : "so'm"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEO WATCHES SECTION (ported from CRA)
      ═══════════════════════════════════════════════════════════ */}
      <section id="neo-watches" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-400 px-4 py-2 rounded-full text-sm mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isRu ? 'Премиум часы' : 'Premium soatlar'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {isRu ? 'Часы NEO' : 'NEO soatlar'}
              </h2>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                {isRu
                  ? 'Премиальные часы с персональной гравировкой. Модели Quartz и Automatic. Идеальный корпоративный подарок или личный аксессуар.'
                  : "Shaxsiy gravyura bilan premium soatlar. Quartz va Automatic modellar. Korporativ sovg'a yoki o'zingiz uchun."}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                  <p className="text-white font-semibold text-sm">Quartz</p>
                  <p className="text-teal-400 font-bold text-sm">750 000 {isRu ? 'сум' : "so'm"}</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-white font-semibold text-sm">Automatic</p>
                  <p className="text-cyan-400 font-bold text-sm">1 100 000 {isRu ? 'сум' : "so'm"}</p>
                </div>
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                  <p className="text-white font-semibold text-sm">{isRu ? 'Корпоративные' : 'Korporativ'}</p>
                  <p className="text-teal-400 font-bold text-sm">{isRu ? 'Оптовые цены' : 'Optom narx'}</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-white font-semibold text-sm">{isRu ? 'Подарок' : "Sovg'a"}</p>
                  <p className="text-cyan-400 font-bold text-sm">{isRu ? 'Премиум упаковка' : 'Premium qadoq'}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${locale}/products/neo-watches`}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition"
                >
                  {isRu ? 'Смотреть все модели' : "Barcha modellarni ko'rish"}
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/catalog-products`}
                  className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700"
                >
                  {isRu ? 'Перейти в каталог' : "Katalogga o'tish"}
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/20 aspect-[16/9]">
                <Image
                  src="/images/products/neo-watch-hero.jpg"
                  alt={isRu ? 'Часы NEO с гравировкой' : 'NEO soatlar gravyura bilan'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-1">
                        {isRu ? 'Цена' : 'Narx'}
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {isRu ? '750 000 – 1 100 000 сум' : "750 000 – 1 100 000 so'm"}
                      </p>
                    </div>
                    <Link
                      href={`/${locale}/products/neo-watches`}
                      className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2"
                    >
                      {isRu ? 'Смотреть' : "Ko'rish"}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PORTFOLIO SECTION (ported from CRA)
      ═══════════════════════════════════════════════════════════ */}
      <section id="portfolio" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isRu ? 'Портфолио ' : 'Portfolio '}
              <span className="text-teal-500">{isRu ? 'наших работ' : 'bizning ishlarimiz'}</span>
            </h2>
            <p className="text-xl text-gray-400">
              {isRu ? 'Реальные проекты для B2B клиентов' : 'B2B mijozlar uchun real loyihalar'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: '/images/products/neo/1.jpg',
                category: isRu ? 'Награды и признание' : 'Mukofotlar va tan olish',
                title: isRu ? 'Корпоративные награды' : 'Korporativ mukofotlar',
                desc: isRu ? 'Премиальные награды с гравировкой для сотрудников и партнёров' : 'Xodimlar va hamkorlar uchun gravyurali premium mukofotlar',
                material: isRu ? 'Металл, дерево' : "Metall, yog'och",
                application: isRu ? 'Награждение персонала' : 'Xodimlarni mukofotlash',
              },
              {
                img: '/images/products/neo/2.jpg',
                category: isRu ? 'Премиальные подарки' : "Premium sovg'alar",
                title: isRu ? 'Часы с персональной гравировкой' : 'Shaxsiy gravyurali soatlar',
                desc: isRu ? 'Элитные часы с индивидуальной гравировкой для топ-менеджмента' : 'Top-menejerlar uchun individual gravyurali elit soatlar',
                material: isRu ? 'Металл, стекло' : 'Metall, shisha',
                application: isRu ? 'Подарки руководителям' : 'Rahbarlarga sovg\'alar',
              },
              {
                img: '/images/products/neo/3.jpg',
                category: isRu ? 'Корпоративная продукция' : 'Korporativ mahsulotlar',
                title: isRu ? 'Брендированные термосы' : 'Brendlangan termoslar',
                desc: isRu ? 'Качественные термосы с логотипом компании для команды' : 'Jamoa uchun kompaniya logotipi bilan sifatli termoslar',
                material: isRu ? 'Анодированный алюминий' : 'Anodlangan alyuminiy',
                application: isRu ? 'Подарки сотрудникам' : "Xodimlarga sovg'alar",
              },
              {
                img: '/images/products/neo/4.jpg',
                category: isRu ? 'Корпоративные подарки' : "Korporativ sovg'alar",
                title: isRu ? 'Премиальный подарочный набор' : "Premium sovg'a to'plami",
                desc: isRu ? 'Эксклюзивный набор с брендированием для VIP-клиентов' : "VIP-mijozlar uchun brendlangan eksklyuziv to'plam",
                material: isRu ? 'Комбинированные материалы' : 'Aralash materiallar',
                application: isRu ? 'Подарки клиентам' : "Mijozlarga sovg'alar",
              },
              {
                img: '/images/products/neo/5.jpg',
                category: isRu ? 'Брендированная упаковка' : 'Brendlangan qadoqlash',
                title: isRu ? 'Корпоративная упаковка' : 'Korporativ qadoqlash',
                desc: isRu ? 'Элегантная упаковка с логотипом для корпоративных мероприятий' : 'Korporativ tadbirlar uchun logotipli nafis qadoqlash',
                material: isRu ? 'Картон, металл' : 'Karton, metall',
                application: isRu ? 'Корпоративные события' : 'Korporativ tadbirlar',
              },
              {
                img: '/images/products/neo/6.jpg',
                category: isRu ? 'Награды премиум-класса' : 'Premium-sinf mukofotlari',
                title: isRu ? 'Премиальная награда' : 'Premium mukofot',
                desc: isRu ? 'Эксклюзивная награда из стекла и металла с подсветкой' : 'Yoritish bilan shisha va metalldan eksklyuziv mukofot',
                material: isRu ? 'Стекло, металл' : 'Shisha, metall',
                application: isRu ? 'Престижные премии' : 'Nufuzli mukofotlar',
              },
            ].map((item, i) => (
              <div key={i} className="group relative bg-black/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-teal-500/50 transition">
                <div className="aspect-square overflow-hidden bg-gray-800 relative">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <span className="text-teal-500 text-sm font-semibold">{item.category}</span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                  <div className="space-y-2 text-xs text-gray-300">
                    <div>
                      <span className="text-gray-500">{isRu ? 'Материал' : 'Material'}:</span> {item.material}
                    </div>
                    <div>
                      <span className="text-gray-500">{isRu ? 'Применение' : "Qo'llanilishi"}:</span> {item.application}
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center mt-4 text-teal-500 hover:text-teal-400 font-semibold text-sm group/link"
                  >
                    {isRu ? 'Запросить расчёт' : "Hisob so'rash"}
                    <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS SECTION (ported from CRA)
      ═══════════════════════════════════════════════════════════ */}
      <section id="process" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isRu ? 'Как мы ' : 'Biz qanday '}
              <span className="text-teal-500">{isRu ? 'работаем' : 'ishlaymiz'}</span>
            </h2>
            <p className="text-xl text-gray-400">
              {isRu ? 'Прозрачный процесс от заявки до получения' : "Arizadan qabul qilishgacha shaffof jarayon"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: isRu ? 'Заявка' : 'Ariza',
                desc: isRu
                  ? 'Напишите в Telegram или заполните форму расчёта. Отправьте логотип, фото изделия, опишите задачу и тираж.'
                  : "Telegramga yozing yoki hisob formasini to'ldiring. Logotip, mahsulot fotosini yuboring, vazifa va tirajni tasvirlab bering.",
              },
              {
                step: '2',
                title: isRu ? 'Макет' : 'Maket',
                desc: isRu
                  ? 'Создаём цифровой макет с точным размещением и размерами. Вы видите финальный результат до производства.'
                  : "Aniq joylashish va o'lchamlar bilan raqamli maket yaratamiz. Ishlab chiqarishdan oldin yakuniy natijani ko'rasiz.",
              },
              {
                step: '3',
                title: isRu ? 'Утверждение' : 'Tasdiqlash',
                desc: isRu
                  ? 'Согласовываете макет, вносите правки при необходимости. Фиксируем сроки и стоимость.'
                  : "Maketni kelishtirasiz, kerak bo'lsa tuzatishlar kiritasiz. Muddatlar va narxni belgilaymiz.",
              },
              {
                step: '4',
                title: isRu ? 'Производство' : 'Ishlab chiqarish',
                desc: isRu
                  ? 'Выполняем гравировку согласно утверждённому макету. Контроль качества на каждом этапе.'
                  : "Tasdiqlangan maketga muvofiq gravyura qilamiz. Har bir bosqichda sifat nazorati.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-teal-500/10 border border-teal-500/30 rounded-xl px-6 py-4">
              <p className="text-teal-500 font-semibold">
                {isRu
                  ? '⚡ Типовой срок производства: 1-3 дня после утверждения макета'
                  : "⚡ Oddiy ishlab chiqarish muddati: maketni tasdiqlagandan keyin 1-3 kun"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BLOG PREVIEW (existing, preserved)
      ═══════════════════════════════════════════════════════════ */}
      {recentPosts.length > 0 && (
        <section id="blog-preview" className="py-20 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-white">{messages.blog.title}</h2>
              <Link href={`/${locale}/blog`} className="text-teal-500 hover:text-teal-400 transition">
                {isRu ? 'Все статьи →' : "Barcha maqolalar →"}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.slug} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-teal-500 transition flex flex-col">
                  {post.ogImage && (
                    <div className="aspect-video bg-gray-700 overflow-hidden">
                      <img
                        src={post.ogImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && (
                        <span className="bg-teal-500/20 text-teal-400 text-xs px-2 py-1 rounded-full">{post.category}</span>
                      )}
                      {post.date && (
                        <time dateTime={post.date} className="text-gray-500 text-xs">
                          {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </time>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 flex-1">
                      <Link href={`/${locale}/blog/${post.slug}`} className="hover:text-teal-500 transition">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">{post.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <Link href={`/${locale}/blog/${post.slug}`} className="text-teal-500 text-sm hover:text-teal-400 transition">
                        {messages.blog.read_more} →
                      </Link>
                      {post.readingTime && (
                        <span className="text-gray-500 text-xs">{post.readingTime} {isRu ? 'мин' : 'daq'}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          FAQ SECTION (ported from CRA, client component)
      ═══════════════════════════════════════════════════════════ */}
      <FAQSection locale={locale} />

      {/* ═══════════════════════════════════════════════════════════
          CONTACT SECTION (existing, enhanced with tracking)
      ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: contact info */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">{messages.contact.title}</h2>
              <p className="text-gray-400 mb-8">
                {isRu
                  ? 'Оставьте заявку — мы свяжемся с вами в течение 30 минут и подберём оптимальное решение.'
                  : "Ariza qoldiring — 30 daqiqa ichida siz bilan bog'lanamiz va optimal yechim topamiz."}
              </p>
              <div className="space-y-4 mb-8">
                <a
                  href="tel:+998770802288"
                  className="flex items-center gap-3 text-gray-300 hover:text-teal-500 transition"
                  data-track="tel"
                  data-placement="homepage-contact"
                >
                  <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <span className="font-semibold">+998 77 080 22 88</span>
                </a>
                <a
                  href="https://t.me/GraverAdm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-teal-500 transition"
                  data-track="tg"
                  data-placement="homepage-contact"
                >
                  <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </div>
                  <span className="font-semibold">@GraverAdm</span>
                </a>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <p className="text-teal-400 font-semibold mb-1">{isRu ? 'Режим работы' : 'Ish vaqti'}</p>
                <p className="text-gray-300 text-sm">{isRu ? 'Пн–Сб: 09:00–18:00' : 'Du–Shan: 09:00–18:00'}</p>
                <p className="text-teal-500 text-sm font-medium mt-1">{isRu ? 'Заявки принимаем 24/7' : 'Arizalar 24/7'}</p>
              </div>
            </div>
            {/* Right: contact form */}
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  )
}
