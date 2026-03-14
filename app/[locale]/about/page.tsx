import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'

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
      path: 'about',
      title: 'О нас — Graver Studio | Лазерная гравировка в Ташкенте',
      description: 'Graver Studio — студия лазерной гравировки и корпоративных подарков в Ташкенте. С 2019 года создаём персонализированные подарки для 200+ компаний Узбекистана. Fiber, CO2, MOPA и UV-лазеры.',
    })
  }
  return buildMetadata({
    locale,
    path: 'about',
    title: "Biz haqimizda — Graver Studio | Toshkentda lazer o'ymakorligi",
    description: "Graver Studio — Toshkentdagi lazer o'ymakorlik va korporativ sovg'alar studiyasi. 2019 yildan beri O'zbekistonning 200+ kompaniyalari uchun shaxsiylashtirilgan sovg'alar yaratamiz.",
  })
}

const statsRu = [
  { number: '200+', label: 'Корпоративных клиентов' },
  { number: '15 000+', label: 'Выполненных заказов' },
  { number: '5+', label: 'Лет на рынке' },
  { number: '4', label: 'Типа лазеров' },
]

const statsUz = [
  { number: '200+', label: 'Korporativ mijozlar' },
  { number: '15 000+', label: 'Bajarilgan buyurtmalar' },
  { number: '5+', label: 'Yillik tajriba' },
  { number: '4', label: 'Lazer turi' },
]

const valuesRu = [
  { title: 'Качество без компромиссов', desc: 'Каждый заказ проходит многоступенчатый контроль. Мы используем 4 типа лазеров — Fiber, CO2, MOPA и UV — чтобы подобрать идеальную технологию для каждого материала.' },
  { title: 'Персональный подход', desc: 'Мы не работаем по шаблону. Для каждого клиента разрабатываем индивидуальный макет, учитываем фирменный стиль и задачу: от welcome-паков до VIP-подарков партнёрам.' },
  { title: 'Прозрачность процесса', desc: 'Фотоотчёт каждого заказа, согласование тестового образца перед тиражом, фиксированные сроки. Вы контролируете каждый этап.' },
  { title: 'Скорость и надёжность', desc: 'Типовые заказы выполняем за 1-3 рабочих дня. Срочные — от 24 часов. Работаем с B2B-клиентами, понимаем важность дедлайнов.' },
]

const valuesUz = [
  { title: 'Murosasiz sifat', desc: "Har bir buyurtma ko'p bosqichli nazoratdan o'tadi. Biz 4 turdagi lazerlardan — Fiber, CO2, MOPA va UV — foydalanamiz, har bir material uchun ideal texnologiyani tanlaymiz." },
  { title: 'Shaxsiy yondashuv', desc: "Biz shablon bo'yicha ishlamaymiz. Har bir mijoz uchun individual maket ishlab chiqamiz, korporativ uslub va vazifani hisobga olamiz." },
  { title: 'Jarayonning shaffofligi', desc: "Har bir buyurtmaning fotoaksi, tirajdan oldin sinov namunasini tasdiqlash, belgilangan muddatlar. Siz har bir bosqichni nazorat qilasiz." },
  { title: 'Tezlik va ishonchlilik', desc: "Oddiy buyurtmalarni 1-3 ish kunida bajaramiz. Shoshilinch — 24 soatdan. B2B mijozlar bilan ishlaymiz, dedlaynlar muhimligini tushunamiz." },
]

const equipmentRu = [
  { name: 'Fiber лазер', desc: 'Гравировка на металле, нержавеющей стали, титане. Глубокая и контрастная маркировка.' },
  { name: 'CO2 лазер', desc: 'Работа с деревом, кожей, акрилом, стеклом. Идеален для органических материалов.' },
  { name: 'MOPA лазер', desc: 'Цветная маркировка на нержавейке и титане. Создание уникальных цветовых эффектов.' },
  { name: 'UV лазер', desc: 'Холодная маркировка пластика, стекла, электроники. Без термического воздействия.' },
]

const equipmentUz = [
  { name: 'Fiber lazer', desc: "Metall, zanglamaydigan po'lat, titanda o'ymakorlik. Chuqur va kontrastli markalash." },
  { name: 'CO2 lazer', desc: "Yog'och, charm, akril, shisha bilan ishlash. Organik materiallar uchun ideal." },
  { name: 'MOPA lazer', desc: "Zanglamaydigan po'lat va titanda rangli markalash. Noyob rang effektlarini yaratish." },
  { name: 'UV lazer', desc: "Plastik, shisha, elektronikaning sovuq markalashi. Termal ta'sirsiz." },
]

const timelineRu = [
  { year: '2019', event: 'Основание студии. Первый Fiber-лазер, первые корпоративные клиенты.' },
  { year: '2020', event: 'Расширение парка оборудования: добавлен CO2-лазер для работы с деревом и кожей.' },
  { year: '2021', event: 'Запуск линейки NEO — собственные часы и аксессуары с гравировкой.' },
  { year: '2022', event: '100-й корпоративный клиент. Добавлен MOPA-лазер для цветной маркировки.' },
  { year: '2023', event: 'Запуск welcome-pack сервиса для IT-компаний. Партнёрство с HR-отделами.' },
  { year: '2024', event: 'UV-лазер для холодной маркировки. 200+ активных B2B-клиентов.' },
  { year: '2025', event: 'Запуск каталога продукции онлайн. Расширение географии до всего Узбекистана.' },
]

const timelineUz = [
  { year: '2019', event: "Studiya tashkil etildi. Birinchi Fiber-lazer, birinchi korporativ mijozlar." },
  { year: '2020', event: "Uskunalar parkini kengaytirish: yog'och va charm bilan ishlash uchun CO2-lazer qo'shildi." },
  { year: '2021', event: "NEO liniyasi ishga tushirildi — o'ymakorlik bilan o'z soatlari va aksessuarlari." },
  { year: '2022', event: "100-chi korporativ mijoz. Rangli markalash uchun MOPA-lazer qo'shildi." },
  { year: '2023', event: "IT-kompaniyalar uchun welcome-pack xizmati ishga tushirildi. HR bo'limlari bilan hamkorlik." },
  { year: '2024', event: "Sovuq markalash uchun UV-lazer. 200+ faol B2B-mijozlar." },
  { year: '2025', event: "Onlayn mahsulot katalogi ishga tushirildi. Butun O'zbekiston bo'ylab geografiyani kengaytirish." },
]

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const isRu = locale === 'ru'

  const stats = isRu ? statsRu : statsUz
  const values = isRu ? valuesRu : valuesUz
  const equipment = isRu ? equipmentRu : equipmentUz
  const timeline = isRu ? timelineRu : timelineUz

  const breadcrumbs = breadcrumbSchema([
    { name: isRu ? 'Главная' : 'Bosh sahifa', url: `https://graver-studio.uz/${locale}/` },
    { name: isRu ? 'О нас' : 'Biz haqimizda', url: `https://graver-studio.uz/${locale}/about/` },
  ])

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: isRu ? 'О компании Graver Studio' : 'Graver Studio haqida',
    description: isRu
      ? 'Graver Studio — студия лазерной гравировки и корпоративных подарков в Ташкенте с 2019 года.'
      : "Graver Studio — 2019 yildan beri Toshkentdagi lazer o'ymakorlik va korporativ sovg'alar studiyasi.",
    url: `https://graver-studio.uz/${locale}/about/`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Graver Studio',
      url: 'https://graver-studio.uz',
      foundingDate: '2019',
      numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 5, maxValue: 15 },
      areaServed: { '@type': 'Country', name: 'Uzbekistan' },
      knowsAbout: [
        'Laser engraving',
        'Corporate gifts',
        'Personalized souvenirs',
        'Welcome packs',
        'Branding',
      ],
    },
  }

  return (
    <>
      <SchemaOrg schema={[breadcrumbs, aboutSchema]} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isRu ? 'О Graver Studio' : 'Graver Studio haqida'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {isRu
              ? 'Мы — студия лазерной гравировки и корпоративных подарков в Ташкенте. С 2019 года помогаем компаниям создавать персонализированные подарки, которые запоминаются.'
              : "Biz — Toshkentdagi lazer o'ymakorlik va korporativ sovg'alar studiyasi. 2019 yildan beri kompaniyalarga esda qoladigan shaxsiylashtirilgan sovg'alar yaratishga yordam beramiz."}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            {isRu ? 'Наши принципы' : 'Bizning tamoyillarimiz'}
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            {isRu
              ? 'Каждый принцип — не просто слова. Это то, как мы работаем каждый день.'
              : "Har bir tamoyil — shunchaki so'zlar emas. Bu biz har kuni qanday ishlashimiz."}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-3">{v.title}</h3>
                <p className="text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-16 md:py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            {isRu ? 'Наше оборудование' : 'Bizning uskunalarimiz'}
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            {isRu
              ? '4 типа лазеров для работы с любым материалом. Подбираем технологию под вашу задачу.'
              : "Har qanday material bilan ishlash uchun 4 turdagi lazerlar. Vazifangizga mos texnologiyani tanlaymiz."}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {equipment.map((eq, i) => (
              <div key={i} className="flex gap-4 bg-gray-950 rounded-xl p-5 border border-gray-800">
                <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{eq.name}</h3>
                  <p className="text-gray-400 text-sm">{eq.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-20 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            {isRu ? 'Наша история' : 'Bizning tarix'}
          </h2>
          <div className="space-y-8">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-sm flex-shrink-0">
                    {t.year}
                  </div>
                  {i < timeline.length - 1 && <div className="w-px h-full bg-gray-800 mt-2" />}
                </div>
                <div className="pb-8">
                  <p className="text-gray-300 leading-relaxed">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isRu ? 'Готовы обсудить проект?' : 'Loyihani muhokama qilishga tayyormisiz?'}
          </h2>
          <p className="text-gray-400 mb-8">
            {isRu
              ? 'Расскажите о вашей задаче — мы предложим решение и рассчитаем стоимость в течение 2 часов.'
              : "Vazifangiz haqida ayting — biz yechim taklif qilamiz va 2 soat ichida narxni hisoblaymiz."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contacts`}
              className="inline-flex items-center justify-center px-8 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition"
            >
              {isRu ? 'Связаться с нами' : "Biz bilan bog'lanish"}
            </Link>
            <Link
              href={`/${locale}/catalog-products`}
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-teal-500 hover:text-teal-400 transition"
            >
              {isRu ? 'Смотреть каталог' : "Katalogni ko'rish"}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
