import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import ProductPage from '@/components/ProductPage'
import SchemaOrg from '@/components/SchemaOrg'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale
  if (locale === 'ru') {
    return buildMetadata({ locale, path: 'products/pens', title: 'Ручки с гравировкой логотипа | Корпоративные подарки', description: 'Деловые ручки с лазерной гравировкой имени или логотипа. Металлический корпус, немецкий стержень. Тираж от 10 штук. Доставка по Узбекистану.' })
  }
  return buildMetadata({ locale, path: 'products/pens', title: "Logotip o'ymakorligi bilan ruchkalar | Toshkent", description: "Ism yoki logotipning lazer o'ymakorligi bilan biznes ruchkalar. Metall korpus, nemis qalami. 10 donadan boshlab. O'zbekiston bo'ylab yetkazib berish." })
}

const PRODUCT = {
  slug: 'pens',
  nameRu: 'Ручки с гравировкой',
  nameUz: "O'ymakorlik bilan ruchkalar",
  descRu: 'Деловые ручки с лазерной гравировкой имени или логотипа — классический корпоративный подарок для сотрудников и партнёров. Металлический корпус, немецкий стержень Parker или аналог. Тираж от 10 штук — идеально для welcome pack, корпоративных наборов и деловых встреч. Гравировка лазерная: не стирается, не выцветает, выглядит премиально.',
  descUz: "Ism yoki logotipning lazer o'ymakorligi bilan biznes ruchkalar — xodimlar va hamkorlar uchun klassik korporativ sovg'a. Metall korpus, nemis Parker qalami yoki analog. 10 donadan boshlab — welcome pack, korporativ to'plamlar va biznes uchrashuvlar uchun ideal. Lazer o'ymakorligi: o'chmaydi, rangini yo'qotmaydi, premium ko'rinadi.",
  icon: '✒️',
  featuresRu: [
    'Гравировка имени, логотипа или слогана',
    'Металлический корпус — нержавеющая сталь или алюминий',
    'Немецкий стержень Parker или аналог',
    'Тираж от 10 штук',
    'Подарочная коробка или чехол в комплекте',
    'Именная персонализация для каждого получателя',
    'Гравировка на русском, узбекском, английском',
    'Готовность за 3–5 рабочих дней',
  ],
  featuresUz: [
    "Ism, logotip yoki shiorning o'ymakorligi",
    "Metall korpus — zanglamaydigan po'lat yoki alyuminiy",
    'Nemis Parker qalami yoki analog',
    '10 donadan boshlab',
    "Sovg'a qutisi yoki qobi komplektda",
    'Har bir oluvchi uchun shaxsiy personalizatsiya',
    "Rus, o'zbek, ingliz tillarida o'ymakorlik",
    '3–5 ish kunida tayyor',
  ],
  pricingTiers: [
    {
      nameRu: 'Стартовый тираж',
      nameUz: "Boshlang'ich tiraji",
      descRu: '10–49 штук — ручки с гравировкой имени или логотипа',
      descUz: "10–49 dona — ism yoki logotip o'ymakorligi bilan ruchkalar",
      price: 'от 45 000 сум',
      highlight: false,
    },
    {
      nameRu: 'Корпоративный тираж',
      nameUz: 'Korporativ tiraji',
      descRu: '50–199 штук — скидка 15%, именная персонализация',
      descUz: '50–199 dona — 15% chegirma, shaxsiy personalizatsiya',
      price: 'от 38 000 сум',
      highlight: true,
    },
    {
      nameRu: 'Оптовый заказ',
      nameUz: 'Ulgurji buyurtma',
      descRu: '200+ штук — максимальная скидка, приоритетное производство',
      descUz: '200+ dona — maksimal chegirma, ustuvor ishlab chiqarish',
      price: 'от 32 000 сум',
      highlight: false,
    },
  ],
  processStepsRu: [
    'Отправьте логотип или текст для гравировки в Telegram или WhatsApp',
    'Получите макет и подтвердите дизайн в течение 2 часов',
    'Производство занимает 3–5 рабочих дней',
    'Доставка по Ташкенту или отправка по всему Узбекистану',
  ],
  processStepsUz: [
    "Telegram yoki WhatsApp orqali logotip yoki matnni yuboring",
    "2 soat ichida maket oling va dizaynni tasdiqlang",
    "Ishlab chiqarish 3–5 ish kunini oladi",
    "Toshkentga yetkazib berish yoki O'zbekiston bo'ylab jo'natish",
  ],
  faq: [
    {
      qRu: 'Какой минимальный тираж для ручек с гравировкой?',
      aRu: 'Минимальный тираж — 10 штук. Это оптимально для небольших welcome pack или подарков на корпоратив. При заказе от 50 штук действует скидка 15%, от 200 штук — максимальная скидка.',
      qUz: "Gravyurali ruchkalar uchun minimal tiraji qancha?",
      aUz: "Minimal tiraji — 10 dona. Bu kichik welcome pack yoki korporativ sovg'alar uchun optimal. 50 donadan buyurtma berilganda 15% chegirma, 200 donadan — maksimal chegirma amal qiladi.",
    },
    {
      qRu: 'Можно ли сделать разные надписи на каждой ручке?',
      aRu: 'Да, мы делаем именную персонализацию — на каждой ручке своё имя или должность. Стоимость остаётся той же при тираже от 10 штук. Просто предоставьте список имён.',
      qUz: "Har bir ruchkaga turli yozuvlar qilish mumkinmi?",
      aUz: "Ha, biz shaxsiy personalizatsiya qilamiz — har bir ruchkada o'z ismi yoki lavozimi. 10 donadan boshlab narx o'zgarishsiz qoladi. Faqat ismlar ro'yxatini bering.",
    },
    {
      qRu: 'Какие материалы используются для ручек?',
      aRu: 'Металлический корпус из нержавеющей стали или алюминия, немецкий стержень Parker или аналог. Гравировка лазерная — не стирается и не выцветает даже при ежедневном использовании.',
      qUz: "Ruchkalar uchun qanday materiallar ishlatiladi?",
      aUz: "Zanglamaydigan po'lat yoki alyuminiydan metall korpus, nemis Parker qalami yoki analog. Lazer o'ymakorligi — kundalik foydalanishda ham o'chmaydi va rangini yo'qotmaydi.",
    },
    {
      qRu: 'Сколько времени занимает производство?',
      aRu: '3–5 рабочих дней после подтверждения макета. Срочные заказы (1–2 дня) возможны при наличии заготовок — уточняйте при оформлении заказа.',
      qUz: "Ishlab chiqarish qancha vaqt oladi?",
      aUz: "Maketni tasdiqlaganidan keyin 3–5 ish kuni. Shoshilinch buyurtmalar (1–2 kun) mavjud bo'lganda mumkin — buyurtma rasmiylashtirish vaqtida so'rang.",
    },
    {
      qRu: 'Есть ли подарочная упаковка?',
      aRu: 'Да, доступна подарочная коробка или чехол. Для корпоративных наборов можем укомплектовать ручку вместе с блокнотом или повербанком в единый фирменный набор.',
      qUz: "Sovg'a qadoqlash bormi?",
      aUz: "Ha, sovg'a qutisi yoki qobi mavjud. Korporativ to'plamlar uchun ruchkani daftar yoki quvvat banki bilan birga yagona brendli to'plamga to'plashimiz mumkin.",
    },
    {
      qRu: 'Можно ли нанести логотип компании на ручки?',
      aRu: 'Да, это наш основной вид работы. Принимаем логотипы в форматах PNG, SVG, AI, PDF. Если логотип только в растровом формате — адаптируем бесплатно.',
      qUz: "Ruchkalarga kompaniya logotipini qo'llash mumkinmi?",
      aUz: "Ha, bu bizning asosiy ish turumiz. PNG, SVG, AI, PDF formatlarida logotiplarni qabul qilamiz. Agar logotip faqat rastr formatida bo'lsa — bepul moslashtiramiz.",
    },
  ],
}

function productSchema(locale: string) {
  const isRu = locale === 'ru'
  const base = 'https://graver-studio.uz'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isRu ? 'Ручки с лазерной гравировкой' : "Lazer gravyurali ruchkalar",
    description: isRu
      ? 'Деловые ручки с лазерной гравировкой имени или логотипа. Металлический корпус, немецкий стержень. Тираж от 10 штук. Доставка по Узбекистану.'
      : "Ism yoki logotipning lazer o'ymakorligi bilan biznes ruchkalar. Metall korpus, nemis qalami. 10 donadan boshlab.",
    image: `${base}/images/products/pens/pen-hero.jpg`,
    url: `${base}/${locale}/products/pens`,
    brand: { '@type': 'Brand', name: 'Graver.uz' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '68',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      price: '45000',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Graver.uz', url: base },
    },
  }
}

function faqSchema(locale: string) {
  const isRu = locale === 'ru'
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PRODUCT.faq.map(item => ({
      '@type': 'Question',
      name: isRu ? item.qRu : item.qUz,
      acceptedAnswer: { '@type': 'Answer', text: isRu ? item.aRu : item.aUz },
    })),
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  return (
    <>
      <SchemaOrg schema={productSchema(locale)} />
      <SchemaOrg schema={faqSchema(locale)} />
      <ProductPage locale={locale} product={PRODUCT} />
    </>
  )
}
