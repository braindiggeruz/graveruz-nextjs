
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
    return buildMetadata({ locale, path: 'products/notebooks', title: 'Блокноты с гравировкой логотипа | Корпоративные подарки', description: 'Кожаные и деревянные блокноты с лазерной гравировкой логотипа. Форматы A5 и A6. Тираж от 10 штук. Доставка по Узбекистану.' })
  }
  return buildMetadata({ locale, path: 'products/notebooks', title: "Logotip o'ymakorligi bilan daftarlar | Toshkent", description: "Logotipning lazer o'ymakorligi bilan teri va yog'och daftarlar. A5 va A6 formatlari. 10 donadan boshlab." })
}

const PRODUCT = {
  slug: 'notebooks',
  nameRu: 'Блокноты с гравировкой',
  nameUz: "O'ymakorlik bilan daftarlar",
  descRu: 'Кожаные и деревянные блокноты с лазерной гравировкой логотипа — элегантный корпоративный подарок для деловых встреч, конференций и welcome pack. Форматы A5 и A6, бумага 80 г/м² и выше. Тираж от 10 штук. Гравировка лазерная — не стирается, выглядит премиально.',
  descUz: "Logotipning lazer o'ymakorligi bilan teri va yog'och daftarlar — biznes uchrashuvlari, konferentsiyalar va welcome pack uchun elegant korporativ sovg'a. A5 va A6 formatlari, 80 g/m² va undan yuqori qog'oz. 10 donadan boshlab.",
  icon: '📓',
  featuresRu: [
    'Гравировка логотипа на обложке',
    'Натуральная кожа или дерево (бамбук)',
    'Бумага 80 г/м² или выше',
    'Форматы A5 и A6',
    'Тираж от 10 штук',
    'Ручка в комплекте по запросу',
    'Именная гравировка на каждом блокноте',
    'Готовность за 5–7 рабочих дней',
  ],
  featuresUz: [
    "Muqovada logotipning o'ymakorligi",
    "Tabiiy teri yoki yog'och (bambu)",
    "80 g/m² yoki undan yuqori qog'oz",
    'A5 va A6 formatlari',
    '10 donadan boshlab',
    "So'rov bo'yicha to'plamda ruchka",
    "Har bir daftarda shaxsiy o'ymakorlik",
    '5–7 ish kunida tayyor',
  ],
  pricingTiers: [
    { nameRu: 'Кожаный A6', nameUz: 'Teri A6', descRu: 'Компактный кожаный блокнот A6 с гравировкой логотипа', descUz: "Kompakt teri daftar A6 logotip o'ymakorligi bilan", price: 'от 85 000 сум', highlight: false },
    { nameRu: 'Кожаный A5', nameUz: 'Teri A5', descRu: 'Классический деловой блокнот A5 — самый популярный формат', descUz: "Klassik biznes daftar A5 — eng mashhur format", price: 'от 120 000 сум', highlight: true },
    { nameRu: 'Деревянный A5', nameUz: "Yog'och A5", descRu: 'Эко-премиум: бамбуковая обложка с гравировкой, уникальный подарок', descUz: "Eko-premium: bambu muqova o'ymakorligi bilan, noyob sovg'a", price: 'от 180 000 сум', highlight: false },
  ],
  processStepsRu: [
    'Выберите формат и материал, отправьте логотип в Telegram или WhatsApp',
    'Получите макет гравировки и подтвердите дизайн в течение 2 часов',
    'Производство и нанесение гравировки — 5–7 рабочих дней',
    'Доставка по Ташкенту или отправка по всему Узбекистану',
  ],
  processStepsUz: [
    "Format va materialni tanlang, Telegram yoki WhatsApp orqali logotipni yuboring",
    "2 soat ichida gravyura maketini oling va dizaynni tasdiqlang",
    "Ishlab chiqarish va gravyura qo'llash — 5–7 ish kuni",
    "Toshkentga yetkazib berish yoki O'zbekiston bo'ylab jo'natish",
  ],
  faq: [
    { qRu: 'Какой минимальный тираж для блокнотов с гравировкой?', aRu: 'Минимальный тираж — 10 штук. При заказе от 50 штук действует скидка 10%, от 100 штук — 15%.', qUz: "Gravyurali daftarlar uchun minimal tiraji qancha?", aUz: "Minimal tiraji — 10 dona. 50 donadan buyurtma berilganda 10% chegirma, 100 donadan — 15%." },
    { qRu: 'Из каких материалов делают блокноты?', aRu: 'Натуральная кожа (классика) и дерево/бамбук (эко-премиум). Оба материала отлично принимают лазерную гравировку — чёткий контрастный рисунок.', qUz: "Daftarlar qanday materiallardan tayyorlanadi?", aUz: "Tabiiy teri (klassika) va yog'och/bambu (eko-premium). Ikkala material ham lazer o'ymakorligini yaxshi qabul qiladi." },
    { qRu: 'Можно ли сделать именную гравировку на каждом блокноте?', aRu: 'Да, делаем именную персонализацию — на каждом блокноте имя или должность получателя. Стоимость остаётся той же при тираже от 10 штук.', qUz: "Har bir daftarga shaxsiy o'ymakorlik qilish mumkinmi?", aUz: "Ha, shaxsiy personalizatsiya qilamiz — har bir daftarda oluvchining ismi yoki lavozimi. 10 donadan boshlab narx o'zgarishsiz." },
    { qRu: 'Какой формат лучше для корпоративного подарка?', aRu: 'A5 — самый популярный деловой формат. Удобен для записей на встречах, помещается в сумку. A6 подходит для более компактных наборов.', qUz: "Korporativ sovg'a uchun qaysi format yaxshiroq?", aUz: "A5 — eng mashhur biznes format. Uchrashuvlarda yozish uchun qulay, sumkaga sig'adi. A6 kompakt to'plamlar uchun mos." },
    { qRu: 'Можно ли добавить ручку в комплект к блокноту?', aRu: 'Да, комплектуем блокнот с ручкой с гравировкой — единый фирменный набор. Также можем добавить повербанк или зажигалку.', qUz: "Daftarga ruchkani to'plamga qo'shish mumkinmi?", aUz: "Ha, daftarni gravyurali ruchka bilan to'playmiz — yagona brendli to'plam. Powerbank yoki zazhigalka ham qo'shishimiz mumkin." },
    { qRu: 'Сколько времени занимает производство?', aRu: '5–7 рабочих дней после подтверждения макета. Срочные заказы возможны. Доставка по Ташкенту — 1 день, по Узбекистану — 2–3 дня.', qUz: "Ishlab chiqarish qancha vaqt oladi?", aUz: "Maketni tasdiqlaganidan keyin 5–7 ish kuni. Shoshilinch buyurtmalar mumkin. Toshkentga — 1 kun, O'zbekiston bo'ylab — 2–3 kun." },
  ],
}

function productSchema(locale: string) {
  const isRu = locale === 'ru'
  const base = 'https://graver-studio.uz'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isRu ? 'Блокноты с лазерной гравировкой логотипа' : "Logotip lazer gravyurali daftarlar",
    description: isRu
      ? 'Кожаные и деревянные блокноты с лазерной гравировкой логотипа. Форматы A5 и A6. Тираж от 10 штук.'
      : "Logotipning lazer o'ymakorligi bilan teri va yog'och daftarlar. 10 donadan boshlab.",
    image: `${base}/images/products/notebooks/notebook-hero.jpg`,
    url: `${base}/${locale}/products/notebooks`,
    brand: { '@type': 'Brand', name: 'Graver.uz' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '54',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'UZS',
      lowPrice: '85000',
      highPrice: '180000',
      offerCount: '3',
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
