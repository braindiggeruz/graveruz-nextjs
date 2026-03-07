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
      path: 'engraved-gifts',
      title: 'Гравированные подарки для бизнеса — Graver.uz',
      description: 'Гравированные подарки с логотипом для корпоративных клиентов в Ташкенте. Лазерная гравировка на металле, дереве, коже. Тираж от 10 штук.',
      ogImage: 'https://graver-studio.uz/images/og/og-engraved-gifts.jpg',
    })
  }

  return buildMetadata({
    locale,
    path: 'engraved-gifts',
    title: "Biznes uchun o'ymakor sovg'alar — Graver.uz",
    description: "Toshkentdagi korporativ mijozlar uchun logotip bilan o'ymakor sovg'alar. Metall, yog'och, teridagi lazer o'ymakorlik. 10 donadan boshlab.",
    ogImage: 'https://graver-studio.uz/images/og/og-engraved-gifts.jpg',
  })
}


export default async function EngravedGiftsPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const isRu = locale === 'ru'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}` },
    {
      name: isRu ? 'Гравированные подарки' : "O'ymakor sovg'alar",
      url: `https://graver-studio.uz/${locale}/engraved-gifts`,
    },
  ]

  return (
    <>
      <SchemaOrg schema={[localBusinessSchema(), breadcrumbSchema(breadcrumbs)]} />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex justify-center items-center space-x-2 text-sm text-gray-400">
              <li><Link href={`/${locale}`} className="hover:text-teal-500">Graver.uz</Link></li>
              <li className="text-gray-600">/</li>
              <li className="text-gray-300">{isRu ? 'Гравированные подарки' : "O'ymakor sovg'alar"}</li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isRu ? (
              <>
                Гравированные подарки<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  для бизнеса
                </span>
              </>
            ) : (
              <>
                O&apos;ymakor sovg&apos;alar<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  biznes uchun
                </span>
              </>
            )}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {isRu
              ? 'Лазерная гравировка с логотипом вашей компании на металле, дереве, коже и стекле. Тираж от 10 штук. Доставка по всему Узбекистану.'
              : "Kompaniyangiz logotipi bilan metall, yog'och, teri va shishada lazer o'ymakorlik. 10 donadan boshlab. O'zbekiston bo'ylab yetkazib berish."}
          </p>
          <a
            href="https://t.me/GraverAdm"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition inline-block"
          >
            {isRu ? 'Получить расчёт' : 'Hisob-kitob olish'}
          </a>
        </div>
      </section>

      {/* Materials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {isRu ? 'Материалы для гравировки' : "O'ymakorlik uchun materiallar"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                material: isRu ? 'Металл' : 'Metall',
                desc: isRu
                  ? 'Нержавеющая сталь, алюминий, латунь. Идеально для наград и бизнес-сувениров.'
                  : "Zanglamaydigan po'lat, alyuminiy, guruch. Mukofotlar va biznes-suvenirlari uchun ideal.",
                items: isRu
                  ? ['Кружки', 'Термосы', 'Флешки', 'Брелоки']
                  : ["Krujkalar", "Termoslar", "Flesh-disklar", "Breloklar"],
              },
              {
                material: isRu ? 'Дерево' : "Yog'och",
                desc: isRu
                  ? 'Натуральное дерево с тёплым эффектом гравировки. Для премиальных подарков.'
                  : "O'ymakorlikning iliq effekti bilan tabiiy yog'och. Premium sovg'alar uchun.",
                items: isRu
                  ? ['Рамки', 'Шкатулки', 'Подставки', 'Блокноты']
                  : ["Ramkalar", "Qutichalar", "Tagliklar", "Daftarlar"],
              },
              {
                material: isRu ? 'Кожа' : 'Teri',
                desc: isRu
                  ? 'Натуральная и экокожа. Деловые аксессуары с персонализацией.'
                  : "Tabiiy va eko-teri. Shaxsiylashtirilgan biznes aksessuarlari.",
                items: isRu
                  ? ['Ежедневники', 'Портмоне', 'Визитницы', 'Ремни']
                  : ["Kundaliklar", "Hamyonlar", "Vizitka daftarlari", "Kamarlar"],
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-teal-500 mb-3">{item.material}</h3>
                <p className="text-gray-400 mb-4">{item.desc}</p>
                <ul className="space-y-1">
                  {item.items.map((it, j) => (
                    <li key={j} className="text-gray-300 text-sm flex items-center">
                      <span className="text-teal-500 mr-2">✓</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {isRu ? 'Как мы работаем' : 'Qanday ishlashimiz'}
          </h2>
          <div className="space-y-6">
            {(isRu
              ? [
                  { step: '01', title: 'Заявка', desc: 'Оставьте заявку в Telegram или по телефону' },
                  { step: '02', title: 'Бриф', desc: 'Уточняем детали: тираж, материал, логотип, сроки' },
                  { step: '03', title: 'Макет', desc: 'Подготавливаем макет и согласовываем с вами' },
                  { step: '04', title: 'Производство', desc: 'Изготавливаем в срок от 1 рабочего дня' },
                  { step: '05', title: 'Доставка', desc: 'Доставляем по Ташкенту и всему Узбекистану' },
                ]
              : [
                  { step: '01', title: 'Ariza', desc: "Telegram yoki telefon orqali ariza qoldiring" },
                  { step: '02', title: 'Bref', desc: "Tafsilotlarni aniqlaymiz: miqdor, material, logotip, muddatlar" },
                  { step: '03', title: 'Maket', desc: "Maket tayyorlaymiz va siz bilan kelishamiz" },
                  { step: '04', title: 'Ishlab chiqarish', desc: "1 ish kunidan boshlab muddatida tayyorlaymiz" },
                  { step: '05', title: "Yetkazib berish", desc: "Toshkent va butun O'zbekistonga yetkazamiz" },
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isRu ? 'Готовы сделать заказ?' : "Buyurtma berishga tayyormisiz?"}
          </h2>
          <p className="text-gray-400 mb-8">
            {isRu
              ? 'Напишите нам в Telegram — ответим в течение 30 минут и подберём оптимальное решение.'
              : "Bizga Telegramga yozing — 30 daqiqa ichida javob beramiz va optimal yechim topamiz."}
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
