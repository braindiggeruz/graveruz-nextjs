
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
    return buildMetadata({ locale, path: 'products/powerbanks', title: 'Повербанки с гравировкой логотипа | Корпоративные подарки', description: 'Портативные зарядные устройства с лазерной гравировкой логотипа. Ёмкость 5000–20000 мАч, Quick Charge. Тираж от 10 штук. Доставка по Узбекистану.' })
  }
  return buildMetadata({ locale, path: 'products/powerbanks', title: "Logotip gravyurali powerbank buyurtma | Toshkent", description: "Logotipning lazer o'ymakorligi bilan ko'chma zaryadlovchi qurilmalar. 5000–20000 mAh, Quick Charge. 10 donadan boshlab." })
}

const PRODUCT = {
  slug: 'powerbanks',
  nameRu: 'Повербанки с гравировкой',
  nameUz: "O'ymakorlik bilan powerbank",
  descRu: 'Портативные зарядные устройства с лазерной гравировкой логотипа — практичный и запоминающийся корпоративный подарок. Ёмкость от 5000 до 20000 мАч, поддержка Quick Charge. Тираж от 10 штук. Каждый раз когда клиент или сотрудник заряжает телефон — видит ваш бренд.',
  descUz: "Kompaniya logotipining lazer o'ymakorligi bilan ko'chma zaryadlovchi qurilmalar — amaliy va esda qoladigan korporativ sovg'a. 5000 dan 20000 mAh gacha sig'im, Quick Charge qo'llab-quvvatlash. 10 donadan boshlab.",
  icon: '🔋',
  featuresRu: [
    'Лазерная гравировка логотипа на корпусе',
    'Ёмкость от 5000 до 20000 мАч',
    'Быстрая зарядка Quick Charge 3.0',
    'USB-A + USB-C выходы',
    'Тираж от 10 штук',
    'Подарочная упаковка с логотипом',
    'Сертификат безопасности CE/FCC',
    'Готовность за 5–7 рабочих дней',
  ],
  featuresUz: [
    "Korpusda logotipning lazer o'ymakorligi",
    "5000 dan 20000 mAh gacha sig'im",
    'Tezkor zaryadlash Quick Charge 3.0',
    'USB-A + USB-C chiqishlari',
    '10 donadan boshlab',
    "Logotipli sovg'a qadoqlash",
    'CE/FCC xavfsizlik sertifikati',
    '5–7 ish kunida tayyor',
  ],
  pricingTiers: [
    { nameRu: '5000 мАч', nameUz: '5000 mAh', descRu: 'Компактный — помещается в карман. Гравировка логотипа.', descUz: "Kompakt — cho'ntakka sig'adi. Logotip o'ymakorligi.", price: 'от 120 000 сум', highlight: false },
    { nameRu: '10000 мАч', nameUz: '10000 mAh', descRu: 'Оптимальный — 2 полных заряда смартфона. Самый популярный.', descUz: "Optimal — smartfonni 2 marta to'liq zaryadlash. Eng mashhur.", price: 'от 180 000 сум', highlight: true },
    { nameRu: '20000 мАч', nameUz: '20000 mAh', descRu: 'Премиум — 4–5 зарядов, подходит для командировок.', descUz: "Premium — 4–5 zaryadlash, sayohatlar uchun mos.", price: 'от 280 000 сум', highlight: false },
  ],
  processStepsRu: [
    'Выберите ёмкость и отправьте логотип в Telegram или WhatsApp',
    'Получите макет гравировки и подтвердите дизайн в течение 2 часов',
    'Производство и нанесение гравировки — 5–7 рабочих дней',
    'Доставка по Ташкенту или отправка по всему Узбекистану',
  ],
  processStepsUz: [
    "Sig'imni tanlang va Telegram yoki WhatsApp orqali logotipni yuboring",
    "2 soat ichida gravyura maketini oling va dizaynni tasdiqlang",
    "Ishlab chiqarish va gravyura qo'llash — 5–7 ish kuni",
    "Toshkentga yetkazib berish yoki O'zbekiston bo'ylab jo'natish",
  ],
  faq: [
    { qRu: 'Какой минимальный тираж для повербанков с гравировкой?', aRu: 'Минимальный тираж — 10 штук. При заказе от 50 штук действует скидка 10%, от 100 штук — 15%.', qUz: "Gravyurali powerbank uchun minimal tiraji qancha?", aUz: "Minimal tiraji — 10 dona. 50 donadan buyurtma berilganda 10% chegirma, 100 donadan — 15%." },
    { qRu: 'Можно ли нанести логотип на повербанк?', aRu: 'Да, лазерная гравировка наносится непосредственно на металлический или пластиковый корпус. Принимаем PNG, SVG, AI, PDF.', qUz: "Powerbank'ga logotip qo'llash mumkinmi?", aUz: "Ha, lazer o'ymakorligi to'g'ridan-to'g'ri metall yoki plastik korpusga qo'llaniladi. PNG, SVG, AI, PDF qabul qilamiz." },
    { qRu: 'Сколько времени занимает производство?', aRu: '5–7 рабочих дней после подтверждения макета. Срочные заказы возможны — уточняйте при оформлении.', qUz: "Ishlab chiqarish qancha vaqt oladi?", aUz: "Maketni tasdiqlaganidan keyin 5–7 ish kuni. Shoshilinch buyurtmalar mumkin — rasmiylashtirish vaqtida so'rang." },
    { qRu: 'Есть ли сертификаты безопасности на повербанки?', aRu: 'Да, все повербанки имеют сертификаты CE и FCC. Защита от перегрева, перезарядки и короткого замыкания. Безопасны для авиаперелётов.', qUz: "Powerbank'lar uchun xavfsizlik sertifikatlari bormi?", aUz: "Ha, barcha powerbank'lar CE va FCC sertifikatlariga ega. Qizib ketish va qisqa tutashuvdan himoya. Aviaparvozlar uchun xavfsiz." },
    { qRu: 'Можно ли добавить повербанк в корпоративный набор?', aRu: 'Да, комплектуем корпоративные наборы: повербанк + ручка + блокнот + зажигалка. Всё с единой гравировкой логотипа.', qUz: "Powerbank'ni korporativ to'plamga qo'shish mumkinmi?", aUz: "Ha, korporativ to'plamlarni to'playmiz: powerbank + ruchka + daftar + zazhigalka. Hammasi yagona logotip o'ymakorligi bilan." },
    { qRu: 'Какая ёмкость лучше для корпоративного подарка?', aRu: '10000 мАч — оптимальный выбор: компактный, даёт 2 полных заряда смартфона. Самый популярный вариант среди корпоративных заказчиков.', qUz: "Korporativ sovg'a uchun qaysi sig'im yaxshiroq?", aUz: "10000 mAh — optimal tanlov: kompakt, smartfonni 2 marta to'liq zaryadlaydi. Korporativ buyurtmachilar orasida eng mashhur." },
  ],
}


function productSchema(locale: string) {
  const isRu = locale === 'ru'
  const base = 'https://graver-studio.uz'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isRu ? 'Повербанки с лазерной гравировкой логотипа' : "Logotip lazer gravyurali powerbank",
    description: isRu
      ? 'Портативные зарядные устройства с лазерной гравировкой логотипа. Еёмкость 5000–20000 мАч. Тираж от 10 штук.'
      : "Logotipning lazer o'ymakorligi bilan ko'chma zaryadlovchi qurilmalar. 10 donadan boshlab.",
    image: `${base}/images/products/powerbanks/powerbank-hero.jpg`,
    url: `${base}/${locale}/products/powerbanks`,
    brand: { '@type': 'Brand', name: 'Graver.uz' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'UZS',
      lowPrice: '120000',
      highPrice: '280000',
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
