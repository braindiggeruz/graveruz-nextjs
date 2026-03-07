import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import NeoWatchesLanding from '@/components/NeoWatchesLanding'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'

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
  return buildMetadata({ locale, path: 'products/neo-watches', title: "NEO soatlar gravyura bilan | Graver.uz", description: "NEO soatlar shaxsiy gravyura bilan — kvars va mexanik. Naqsh qo'yishdan oldin bepul maket. O'zingiz, yaqinlaringiz va hamkorlaringiz uchun ideal sovg'a." })
}

// PRODUCT data removed — replaced by NeoWatchesLanding (exact historical transplant from CRA)
const _UNUSED = {
  slug: 'neo-watches',
  nameRu: 'Часы NEO с гравировкой',
  nameUz: "NEO soatlar o'ymakorlik bilan",
  descRu: 'Премиальные наручные часы NEO с лазерной гравировкой логотипа. Японский кварцевый механизм, сапфировое стекло. Идеальный корпоративный подарок для VIP-клиентов и топ-менеджеров.',
  descUz: "Logotipning lazer o'ymakorligi bilan premium NEO qo'l soatlari. Yaponiya kvarts mexanizmi, safir oyna. VIP-mijozlar va top-menejerlar uchun ideal korporativ sovg'a.",
  icon: '⌚',
  heroImage: '/images/products/neo/neo-watch-black-gold.jpg',
  galleryImages: [
    '/images/products/neo/neo-watch-black-silver.jpg',
    '/images/products/neo/neo-watch-white-gold.jpg',
    '/images/products/neo/neo-watch-white-silver.jpg',
    '/images/products/neo/neo-watch-black-gold.jpg',
  ],
  trustBadgesRu: [
    'Японский механизм',
    'Сапфировое стекло',
    'Тираж от 10 штук',
    'Подарочная упаковка',
  ],
  trustBadgesUz: [
    'Yaponiya mexanizmi',
    'Safir oyna',
    '10 donadan boshlab',
    "Sovg'a qadoqlash",
  ],
  featuresRu: [
    'Лазерная гравировка логотипа на крышке или задней крышке',
    'Японский кварцевый механизм',
    'Сапфировое стекло',
    'Тираж от 10 штук',
    'Подарочная упаковка включена',
    'Доставка по всему Узбекистану',
  ],
  featuresUz: [
    "Qopqoq yoki orqa qopqoqda logotipning lazer o'ymakorligi",
    'Yaponiya kvarts mexanizmi',
    'Safir oyna',
    '10 donadan boshlab',
    "Sovg'a qadoqlash kiritilgan",
    "O'zbekiston bo'ylab yetkazib berish",
  ],
  pricingTiers: [
    {
      nameRu: 'NEO Classic (белый циферблат)',
      nameUz: 'NEO Classic (oq raqamli)',
      price: '890 000 сум',
      descRu: 'Белый циферблат, серебряный или золотой корпус.',
      descUz: "Oq raqamli, kumush yoki oltin korpus.",
    },
    {
      nameRu: 'NEO Dark (чёрный циферблат)',
      nameUz: 'NEO Dark (qora raqamli)',
      price: '950 000 сум',
      descRu: 'Чёрный циферблат, чёрный или золотой корпус. Топ-продажи.',
      descUz: "Qora raqamli, qora yoki oltin korpus. Eng ko'p sotiladigan.",
      highlight: true,
    },
    {
      nameRu: 'NEO Premium Set',
      nameUz: 'NEO Premium Set',
      price: '1 200 000 сум',
      descRu: 'Часы + кожаный ремешок + гравированная коробка.',
      descUz: "Soat + charm qayish + o'ymakorli quti.",
    },
  ],
  processStepsRu: [
    'Выберите модель и цвет корпуса',
    'Пришлите логотип для гравировки (SVG/PNG)',
    'Согласуйте макет на крышке или задней крышке',
    'Получите готовые часы в подарочной упаковке',
  ],
  processStepsUz: [
    'Model va korpus rangini tanlang',
    "O'ymakorlik uchun logotip yuboring (SVG/PNG)",
    'Qopqoq yoki orqa qopqoqdagi maketni tasdiqlang',
    "Sovg'a qadoqlamasida tayyor soatlarni oling",
  ],
  faq: [
    {
      qRu: 'Какой минимальный тираж для часов NEO?',
      qUz: 'NEO soatlar uchun minimal tiraj qancha?',
      aRu: 'Минимальный тираж — 10 штук. При заказе от 20 штук действует скидка 8%, от 50 штук — 15%.',
      aUz: "Minimal tiraj — 10 dona. 20 donadan buyurtma berishda 8% chegirma, 50 donadan — 15%.",
    },
    {
      qRu: 'Где наносится гравировка на часах?',
      qUz: 'Soatlarda o\'ymakorlik qayerga qo\'llaniladi?',
      aRu: 'Гравировка наносится на заднюю крышку часов или на циферблат. Возможна гравировка на ремешке.',
      aUz: "O'ymakorlik soatlarning orqa qopqog'iga yoki raqamli qismiga qo'llaniladi. Qayishga o'ymakorlik ham mumkin.",
    },
    {
      qRu: 'Какой срок изготовления?',
      qUz: 'Ishlab chiqarish muddati qancha?',
      aRu: 'Стандартный срок — 3–5 рабочих дней. Срочный заказ (2 дня) возможен при наличии модели на складе.',
      aUz: "Standart muddat — 3–5 ish kuni. Shoshilinch buyurtma (2 kun) omborda model mavjud bo'lganda mumkin.",
    },
    {
      qRu: 'Входит ли подарочная упаковка?',
      qUz: "Sovg'a qadoqlash kiritilganmi?",
      aRu: 'Да, каждые часы поставляются в фирменной подарочной коробке. Возможна брендированная упаковка с логотипом вашей компании.',
      aUz: "Ha, har bir soat firma sovg'a qutisida yetkaziladi. Kompaniyangiz logotipi bilan brendlangan qadoqlash ham mumkin.",
    },
  ],
}

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
  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />
      <NeoWatchesLanding locale={locale} />
    </>
  )
}
