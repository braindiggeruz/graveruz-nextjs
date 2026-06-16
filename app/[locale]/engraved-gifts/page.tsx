
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { localBusinessSchema, breadcrumbSchema } from '@/components/SchemaOrg'
import ViewCategoryTracker from '@/components/ViewCategoryTracker'

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
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}/` },
    {
      name: isRu ? 'Гравированные подарки' : "O'ymakor sovg'alar",
      url: `https://graver-studio.uz/${locale}/engraved-gifts/`,
    },
  ]

  return (
    <>
      <SchemaOrg schema={[localBusinessSchema(), breadcrumbSchema(breadcrumbs)]} />
      <ViewCategoryTracker categoryId="engraved-gifts" categoryName={isRu ? 'Гравированные подарки' : "O'ymakor sovg'alar"} />
      <SchemaOrg schema={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: isRu ? 'Лазерная гравировка подарков' : "Sovg'alarni lazer gravyurasi",
        description: isRu
          ? 'Лазерная гравировка логотипов и текста на металле, дереве, коже, стекле. Тираж от 1 штуки.'
          : "Metall, yog'och, charm, shishada logotip va matn lazer gravyurasi. 1 donadan boshlab.",
        provider: {
          '@type': 'Organization',
          name: 'Graver Studio',
          url: 'https://graver-studio.uz',
        },
        areaServed: { '@type': 'Country', name: 'Uzbekistan' },
        serviceType: isRu ? 'Лазерная гравировка' : "Lazer gravyurasi",
      }} />
      <SchemaOrg schema={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: isRu ? 'Как заказать гравировку в Graver Studio' : 'Graver Studio da gravyura buyurtma berish',
        description: isRu
          ? 'Пошаговая инструкция по заказу лазерной гравировки подарков с логотипом'
          : "Logotip bilan sovg'alarni lazer gravyurasiga buyurtma berish bo'yicha bosqichma-bosqich ko'rsatma",
        totalTime: 'P3D',
        estimatedCost: { '@type': 'MonetaryAmount', currency: 'UZS', value: '140000' },
        step: [
          { '@type': 'HowToStep', position: 1, name: isRu ? 'Оставьте заявку' : 'Ariza qoldiring', text: isRu ? 'Опишите задачу: что нужно, тираж, сроки.' : "Vazifani tasvirlab bering: nima kerak, tiraj, muddatlar." },
          { '@type': 'HowToStep', position: 2, name: isRu ? 'Согласуйте макет' : 'Maketni tasdiqlang', text: isRu ? 'Мы подготовим цифровой макет и отправим на согласование.' : "Biz raqamli maket tayyorlaymiz va tasdiqlash uchun yuboramiz." },
          { '@type': 'HowToStep', position: 3, name: isRu ? 'Производство' : 'Ishlab chiqarish', text: isRu ? 'Гравируем на профессиональном оборудовании с контролем качества.' : "Professional uskunada sifat nazorati bilan gravyura qilamiz." },
          { '@type': 'HowToStep', position: 4, name: isRu ? 'Фотоотчёт и доставка' : 'Fotoaks va yetkazib berish', text: isRu ? 'Отправляем фото готовой продукции и доставляем в Ташкенте за 1 день.' : "Tayyor mahsulot suratlarini yuboramiz va Toshkentda 1 kunda yetkazamiz." },
        ],
      }} />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex justify-center items-center space-x-2 text-sm text-gray-400">
              <li><Link href={`/${locale}/`} className="hover:text-teal-500">Graver.uz</Link></li>
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

      {/* FAQ */}
      <section className="py-20 bg-gray-900/50" data-testid="engraved-gifts-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            {isRu ? 'Частые вопросы' : "Ko'p so'raladigan savollar"}
          </h2>
          <div className="space-y-4">
            {(isRu
              ? [
                  { q: 'Сколько стоит гравировка подарка в Ташкенте?', a: 'Стоимость зависит от материала, размера изделия и тиража. Гравировка имени или короткой фразы обычно входит в цену продукта. Точную цену рассчитаем после уточнения деталей.' },
                  { q: 'За какой срок можно сделать подарок с гравировкой?', a: 'Срочный заказ — за 1 рабочий день в Ташкенте. Стандартный срок — 2-3 дня. На большой тираж планируем 5-7 дней. Сроки согласовываем заранее, без сюрпризов.' },
                  { q: 'Что можно гравировать?', a: 'Имя, инициалы, дату, короткую фразу, логотип компании, монограмму, символ или QR-код. Если нужна сложная графика — подготовим макет под лазер.' },
                  { q: 'На каких материалах вы делаете гравировку?', a: 'Металл, дерево, кожа, акрил, стекло. Лучше всего смотрится на металле и дереве — гравировка получается чёткой и долговечной.' },
                  { q: 'Можно ли заказать гравировку без логотипа, только для частного подарка?', a: 'Да. Делаем именную гравировку на часах, зажигалках, ручках, блокнотах, powerbank — для дня рождения, юбилея, свадьбы, корпоратива.' },
                  { q: 'Как сделать заказ?', a: 'Напишите в Telegram @GraverAdm или позвоните +998 77 080 22 88. Уточним подарок, материал, текст гравировки и тираж — после этого подготовим макет и счёт.' },
                  { q: 'Есть ли доставка по Узбекистану?', a: 'Да. По Ташкенту доставляем в день готовности заказа. По Узбекистану — через курьерские службы за 1-3 дня.' },
                ]
              : [
                  { q: "Toshkentda gravyurali sovg'a qancha turadi?", a: "Narx materialga, buyum o'lchami va tirajga bog'liq. Ism yoki qisqa ibora gravyurasi odatda mahsulot narxiga kiradi. Aniq narxni tafsilotlar aniqlangach hisoblab beramiz." },
                  { q: "Gravyurali sovg'ani qancha vaqtda tayyorlash mumkin?", a: "Shoshilinch buyurtma — Toshkentda 1 ish kunida. Standart muddat — 2-3 kun. Katta tirajga 5-7 kun rejalashtiramiz. Muddatlarni oldindan kelishib olamiz." },
                  { q: "Nimani gravyura qilish mumkin?", a: "Ism, bosh harflar, sana, qisqa ibora, kompaniya logotipi, monogramma, ramz yoki QR-kod. Murakkab grafika kerak bo'lsa, lazerga mos maket tayyorlaymiz." },
                  { q: "Qaysi materiallarda gravyura qilasiz?", a: "Metall, yog'och, charm, akril, shisha. Metall va yog'ochda eng yaxshi ko'rinadi — gravyura aniq va uzoq saqlanadi." },
                  { q: "Faqat shaxsiy sovg'a uchun (logotipsiz) buyurtma qilish mumkinmi?", a: "Ha. Tug'ilgan kun, yubiley, to'y, korporativ tadbir uchun soat, zajigalka, ruchka, kundalik, powerbankga shaxsiy gravyura qilamiz." },
                  { q: "Buyurtmani qanday qilish mumkin?", a: "Telegram @GraverAdm ga yozing yoki +998 77 080 22 88 raqamiga qo'ng'iroq qiling. Sovg'a, material, gravyura matni va tirajni aniqlaymiz — keyin maket va hisob-faktura tayyorlaymiz." },
                  { q: "O'zbekiston bo'ylab yetkazib berasizmi?", a: "Ha. Toshkent bo'ylab buyurtma tayyor bo'lgan kuni yetkazamiz. O'zbekiston bo'ylab kuryerlik xizmatlari orqali 1-3 kunda." },
                ]
            ).map((item, i) => (
              <details key={i} className="bg-gray-800/50 rounded-xl border border-gray-700">
                <summary className="px-6 py-5 cursor-pointer text-white font-medium hover:text-teal-500 transition list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-teal-500 ml-4 flex-shrink-0 text-xl">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ schema */}
      <SchemaOrg schema={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (isRu
          ? [
              { q: 'Сколько стоит гравировка подарка в Ташкенте?', a: 'Стоимость зависит от материала, размера изделия и тиража. Гравировка имени или короткой фразы обычно входит в цену продукта.' },
              { q: 'За какой срок можно сделать подарок с гравировкой?', a: 'Срочный заказ — за 1 рабочий день в Ташкенте. Стандартный срок — 2-3 дня. На большой тираж — 5-7 дней.' },
              { q: 'Что можно гравировать?', a: 'Имя, инициалы, дату, короткую фразу, логотип компании, монограмму, символ или QR-код.' },
              { q: 'На каких материалах вы делаете гравировку?', a: 'Металл, дерево, кожа, акрил, стекло. Лучше всего смотрится на металле и дереве.' },
              { q: 'Можно ли заказать гравировку без логотипа, только для частного подарка?', a: 'Да. Делаем именную гравировку на часах, зажигалках, ручках, блокнотах, powerbank.' },
              { q: 'Как сделать заказ?', a: 'Напишите в Telegram @GraverAdm или позвоните +998 77 080 22 88.' },
              { q: 'Есть ли доставка по Узбекистану?', a: 'Да. По Ташкенту в день готовности. По Узбекистану — за 1-3 дня курьерскими службами.' },
            ]
          : [
              { q: "Toshkentda gravyurali sovg'a qancha turadi?", a: "Narx materialga, buyum o'lchami va tirajga bog'liq." },
              { q: "Gravyurali sovg'ani qancha vaqtda tayyorlash mumkin?", a: "Shoshilinch buyurtma — Toshkentda 1 ish kunida." },
              { q: "Nimani gravyura qilish mumkin?", a: "Ism, bosh harflar, sana, qisqa ibora, kompaniya logotipi, monogramma, ramz yoki QR-kod." },
              { q: "Qaysi materiallarda gravyura qilasiz?", a: "Metall, yog'och, charm, akril, shisha." },
              { q: "Faqat shaxsiy sovg'a uchun buyurtma qilish mumkinmi?", a: "Ha. Tug'ilgan kun, yubiley, to'y, korporativ tadbir uchun shaxsiy gravyura qilamiz." },
              { q: "Buyurtmani qanday qilish mumkin?", a: "Telegram @GraverAdm ga yozing yoki +998 77 080 22 88 raqamiga qo'ng'iroq qiling." },
              { q: "O'zbekiston bo'ylab yetkazib berasizmi?", a: "Ha. Toshkent bo'ylab buyurtma tayyor bo'lgan kuni yetkazamiz." },
            ]
        ).map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      }} />

      {/* Internal links to blog + product/money pages */}
      <section className="py-16 bg-black" data-testid="engraved-gifts-related">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {isRu ? 'Полезные материалы и категории' : 'Foydali materiallar va kategoriyalar'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {(isRu
              ? [
                  { href: '/ru/blog/chto-podarit-na-den-rozhdeniya/', label: 'Что подарить на день рождения' },
                  { href: '/ru/blog/originalnye-podarki/', label: 'Оригинальные подарки с гравировкой' },
                  { href: '/ru/blog/lazernaya-gravirovka-podarkov/', label: 'Лазерная гравировка подарков' },
                  { href: '/ru/blog/brendirovanie-suvenirov/', label: 'Брендирование сувениров: способы' },
                ]
              : [
                  { href: '/uz/blog/tugilgan-kunga-sovgalar/', label: "Tug'ilgan kunga sovg'alar" },
                  { href: '/uz/blog/noyob-sovgalar/', label: "Noyob sovg'alar (gravyura bilan)" },
                  { href: '/uz/blog/lazer-gravirovka-sovgalar/', label: "Sovg'alarga lazer gravyura" },
                  { href: '/uz/blog/suvenir-brendlash/', label: 'Suvenirlarni brendlash' },
                ]
            ).map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-teal-500 transition text-gray-300 hover:text-teal-500 text-sm"
              >
                <span className="text-teal-500 mr-3">→</span>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(isRu
              ? [
                  { href: '/ru/korporativnye-podarki/', label: 'Корпоративные подарки' },
                  { href: '/ru/lazernaya-gravirovka-tashkent/', label: 'Лазерная гравировка в Ташкенте' },
                  { href: '/ru/welcome-packs/', label: 'Welcome-паки для сотрудников' },
                ]
              : [
                  { href: '/uz/korporativnye-podarki/', label: "Korporativ sovg'alar" },
                  { href: '/uz/toshkentda-lazer-gravyura/', label: 'Toshkentda lazer gravyura' },
                  { href: '/uz/welcome-packs/', label: 'Welcome-paklar' },
                ]
            ).map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center justify-center p-3 bg-teal-500/10 rounded-lg border border-teal-500/30 hover:border-teal-500 hover:bg-teal-500/20 transition text-teal-400 hover:text-teal-300 text-sm text-center"
              >
                {link.label}
              </Link>
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
