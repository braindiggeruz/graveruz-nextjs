import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import NeoWatchesLanding from '@/components/NeoWatchesLanding'
import SchemaOrg, { breadcrumbSchema, faqSchema } from '@/components/SchemaOrg'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale
  if (locale === 'ru') {
    return buildMetadata({ locale, path: 'products/neo-watches', title: 'Часы NEO с гравировкой на заказ | Премиум подарок | Graver.uz', description: 'Часы NEO с персональной гравировкой — кварцевые и механические. Бесплатный макет перед нанесением. Идеальный подарок для себя, близких и партнёров.' })
  }
  return buildMetadata({ locale, path: 'products/neo-watches', title: "NEO soatlar gravyura bilan buyurtmaga | Premium sovg'a | Graver.uz", description: "NEO soatlar shaxsiy gravyura bilan — kvars va mexanik. Naqsh qo'yishdan oldin bepul maket. O'zingiz, yaqinlaringiz va hamkorlaringiz uchun ideal sovg'a." })
}

function productSchema(locale: string) {
  const isRu = locale === 'ru'
  const base = 'https://graver-studio.uz'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isRu ? 'Часы NEO с лазерной гравировкой' : 'NEO soatlar lazer gravyurasi bilan',
    description: isRu
      ? 'Премиальные наручные часы NEO с лазерной гравировкой логотипа. Японский кварцевый механизм, сапфировое стекло. Идеальный корпоративный подарок. Тираж от 10 штук.'
      : "Premium NEO qo'l soatlari logotipning lazer gravyurasi bilan. Yaponiya kvarts mexanizmi, safir oyna. 10 donadan boshlab.",
    image: `${base}/images/products/neo/neo-watch-black-gold.jpg`,
    url: `${base}/${locale}/products/neo-watches`,
    brand: {
      '@type': 'Brand',
      name: 'NEO',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'UZS',
      lowPrice: '750000',
      highPrice: '1200000',
      offerCount: '3',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Graver.uz',
        url: base,
      },
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Organization', name: 'Uzum' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: isRu
          ? 'Заказали 50 часов NEO для команды. Качество гравировки отличное, сроки соблюдены.'
          : "50 dona NEO soatlar buyurtma berdik. Gravyura sifati a'lo, muddatlarga rioya qilindi.",
      },
      {
        '@type': 'Review',
        author: { '@type': 'Organization', name: 'Humans' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: isRu
          ? 'Используем часы NEO в welcome-паках. Сотрудники в восторге.'
          : "Welcome-paklarda NEO soatlardan foydalanamiz. Xodimlar juda mamnun.",
      },
    ],
  }
}

const FAQ_RU = [
  { q: 'Какой минимальный тираж для часов NEO?', a: 'Минимальный тираж — 10 штук. При заказе от 20 штук действует скидка 8%, от 50 штук — 15%.' },
  { q: 'Где наносится гравировка на часах?', a: 'Гравировка наносится на заднюю крышку часов или на циферблат. Возможна гравировка на ремешке.' },
  { q: 'Какой срок изготовления?', a: 'Стандартный срок — 3–5 рабочих дней. Срочный заказ (2 дня) возможен при наличии модели на складе.' },
  { q: 'Входит ли подарочная упаковка?', a: 'Да, каждые часы поставляются в фирменной подарочной коробке. Возможна брендированная упаковка с логотипом вашей компании.' },
  { q: 'Можно ли заказать часы с логотипом компании?', a: 'Да, мы наносим любой логотип, текст или изображение методом лазерной гравировки. Пришлите файл SVG или PNG.' },
  { q: 'Какие механизмы используются?', a: 'В часах NEO используются японские кварцевые механизмы Miyota. По запросу доступны автоматические механизмы.' },
  { q: 'Есть ли доставка по Узбекистану?', a: 'Да, доставляем по всему Узбекистану. Ташкент — курьером за 1 день. Регионы — 2–3 дня.' },
  { q: 'Можно ли заказать 1 штуку?', a: 'Минимальный тираж для часов NEO — 10 штук. Для единичных заказов рекомендуем зажигалки или ручки — тираж от 1 штуки.' },
]

const FAQ_UZ = [
  { q: 'NEO soatlar uchun minimal tiraj qancha?', a: "Minimal tiraj — 10 dona. 20 donadan buyurtma berishda 8% chegirma, 50 donadan — 15%." },
  { q: "Soatlarda o'ymakorlik qayerga qo'llaniladi?", a: "O'ymakorlik soatlarning orqa qopqog'iga yoki raqamli qismiga qo'llaniladi. Qayishga o'ymakorlik ham mumkin." },
  { q: 'Ishlab chiqarish muddati qancha?', a: "Standart muddat — 3–5 ish kuni. Shoshilinch buyurtma (2 kun) omborda model mavjud bo'lganda mumkin." },
  { q: "Sovg'a qadoqlash kiritilganmi?", a: "Ha, har bir soat firma sovg'a qutisida yetkaziladi. Kompaniyangiz logotipi bilan brendlangan qadoqlash ham mumkin." },
  { q: "Kompaniya logotipi bilan soat buyurtma berish mumkinmi?", a: "Ha, biz lazer gravyurasi usuli bilan istalgan logotip, matn yoki tasvirni qo'llaymiz. SVG yoki PNG fayl yuboring." },
  { q: "Qanday mexanizmlar ishlatiladi?", a: "NEO soatlarida Miyota yapon kvarts mexanizmlari ishlatiladi. So'rov bo'yicha avtomatik mexanizmlar ham mavjud." },
  { q: "O'zbekiston bo'ylab yetkazib berish bormi?", a: "Ha, butun O'zbekiston bo'ylab yetkazib beramiz. Toshkent — 1 kunda kuryer. Viloyatlar — 2–3 kun." },
  { q: "1 dona buyurtma berish mumkinmi?", a: "NEO soatlar uchun minimal tiraj — 10 dona. Yagona buyurtmalar uchun zajigalkalar yoki ruchkalarni tavsiya etamiz — 1 donadan boshlab." },
]

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const isRu = locale === 'ru'
  const base = 'https://graver-studio.uz'
  const breadcrumbs = [
    { name: isRu ? 'Главная' : 'Bosh sahifa', url: `${base}/${locale}` },
    { name: isRu ? 'Продукция' : 'Mahsulotlar', url: `${base}/${locale}/products/neo-watches` },
    { name: isRu ? 'Часы NEO с гравировкой' : 'NEO soatlar gravyura bilan', url: `${base}/${locale}/products/neo-watches` },
  ]
  const faqItems = (isRu ? FAQ_RU : FAQ_UZ).map(item => ({ q: item.q, a: item.a }))
  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />
      <SchemaOrg schema={productSchema(locale)} />
      <SchemaOrg schema={faqSchema(faqItems)} />
      <NeoWatchesLanding locale={locale} />
    </>
  )
}
