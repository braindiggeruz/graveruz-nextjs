import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { organizationSchema, localBusinessSchema } from '@/components/SchemaOrg'
import { getAllPostsMeta } from '@/lib/blog'

interface PageProps {
  params: Promise<{ locale: string }>
}

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

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full filter blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {isRu ? (
              <>
                Лазерная гравировка<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  и брендирование
                </span><br />
                для бизнеса
              </>
            ) : (
              <>
                Lazer o&apos;ymakorlik<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  va brendlash
                </span><br />
                biznes uchun
              </>
            )}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {messages.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition"
            >
              {messages.hero.cta_primary}
            </a>
            <a
              href="#portfolio"
              className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-teal-500 transition"
            >
              {messages.hero.cta_secondary}
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-900/50">
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

      {/* Why Us Section */}
      <section id="process" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {isRu ? 'Почему выбирают Graver.uz' : "Nima uchun Graver.uz ni tanlashadi"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '500+', label: isRu ? 'Выполненных заказов' : "Bajarilgan buyurtmalar" },
              { num: '100+', label: isRu ? 'B2B-клиентов' : "B2B-mijozlar" },
              { num: '5 лет', label: isRu ? 'На рынке Узбекистана' : "O'zbekiston bozorida" },
              { num: '24ч', label: isRu ? 'Срочное изготовление' : "Shoshilinch ishlab chiqarish" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-teal-500 mb-2">{stat.num}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
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
                <article key={post.slug} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-teal-500 transition">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      <Link href={`/${locale}/blog/${post.slug}`} className="hover:text-teal-500 transition">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">{post.description}</p>
                    <Link href={`/${locale}/blog/${post.slug}`} className="text-teal-500 text-sm hover:text-teal-400 transition">
                      {messages.blog.read_more} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{messages.contact.title}</h2>
          <p className="text-gray-400 mb-8">
            {isRu
              ? 'Оставьте заявку — мы свяжемся с вами в течение 30 минут и подберём оптимальное решение.'
              : "Ariza qoldiring — 30 daqiqa ichida siz bilan bog'lanamiz va optimal yechim topamiz."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+998770802288"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
            >
              +998 77 080 22 88
            </a>
            <a
              href="https://t.me/GraverAdm"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-teal-500 text-teal-500 px-8 py-4 rounded-lg font-semibold hover:bg-teal-500 hover:text-white transition"
            >
              Telegram
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
