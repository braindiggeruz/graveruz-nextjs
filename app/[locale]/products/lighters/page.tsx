import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import ProductPage from '@/components/ProductPage'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale
  if (locale === 'ru') {
    return buildMetadata({ locale, path: 'products/lighters', title: 'Зажигалки с гравировкой логотипа — корпоративный сувенир | Graver.uz', description: 'Зажигалки с лазерной гравировкой логотипа. Корпоративные сувениры в Ташкенте. Тираж от 10 штук. Цены от 140 000 сум.' })
  }
  return buildMetadata({ locale, path: 'products/lighters', title: "Logotip o'ymakorligi bilan zazhigalkalar — korporativ suvenir | Graver.uz", description: "Logotipning lazer o'ymakorligi bilan zazhigalkalar. Toshkentda korporativ suvenirlari. 10 donadan boshlab." })
}

const PRODUCT = {
  slug: 'lighters',
  nameRu: 'Зажигалки с гравировкой',
  nameUz: "O'ymakorlik bilan zazhigalkalar",
  descRu: 'Металлические зажигалки с персонализированной лазерной гравировкой логотипа или текста. Популярный корпоративный сувенир для мужской аудитории — практичный и запоминающийся.',
  descUz: "Logotip yoki matnning shaxsiylashtirilgan lazer o'ymakorligi bilan metall zazhigalkalar. Erkak auditoriyasi uchun mashhur korporativ suvenir — amaliy va yodda qoladigan.",
  icon: '🔥',
  heroImage: '/images/products/lighters/r109_silver_gloss.jpg',
  galleryImages: [
    '/images/products/lighters/r110_black_matte.jpg',
    '/images/products/lighters/r111_black_texture.jpg',
    '/images/products/lighters/r112_brushed_steel.jpg',
    '/images/products/lighters/r109_silver_gloss.jpg',
  ],
  trustBadgesRu: [
    'Тираж от 10 штук',
    'Готово за 1–3 дня',
    'Доставка по Узбекистану',
    'Гравировка не стирается',
  ],
  trustBadgesUz: [
    '10 donadan boshlab',
    '1–3 kunda tayyor',
    "O'zbekiston bo'ylab yetkazib berish",
    "O'ymakorlik o'chmaydi",
  ],
  featuresRu: [
    'Лазерная гравировка логотипа или текста',
    'Нержавеющая сталь или хром',
    'Ветрозащитное пламя',
    'Тираж от 10 штук',
    'Индивидуальная упаковка',
    'Быстрое изготовление от 1 дня',
  ],
  featuresUz: [
    "Logotip yoki matnning lazer o'ymakorligi",
    "Zanglamaydigan po'lat yoki xrom",
    'Shamolga chidamli alanga',
    '10 donadan boshlab',
    'Individual qadoqlash',
    '1 kundan boshlab tezkor ishlab chiqarish',
  ],
  pricingTiers: [
    {
      nameRu: 'Silver Gloss (R109)',
      nameUz: 'Silver Gloss (R109)',
      price: '140 000 сум',
      descRu: 'Глянцевая нержавеющая сталь. Классика.',
      descUz: "Yaltiroq zanglamaydigan po'lat. Klassika.",
    },
    {
      nameRu: 'Black Matte (R110)',
      nameUz: 'Black Matte (R110)',
      price: '150 000 сум',
      descRu: 'Матовый чёрный. Строгий деловой стиль.',
      descUz: "Mat qora. Qat'iy biznes uslubi.",
      highlight: true,
    },
    {
      nameRu: 'Brushed Steel (R112)',
      nameUz: 'Brushed Steel (R112)',
      price: '160 000 сум',
      descRu: 'Брашированная сталь. Премиум-вид.',
      descUz: "Cho'tkalangan po'lat. Premium ko'rinish.",
    },
    {
      nameRu: 'Black Texture (R111)',
      nameUz: 'Black Texture (R111)',
      price: '170 000 сум',
      descRu: 'Текстурированный чёрный. Максимальный стиль.',
      descUz: 'Teksturali qora. Maksimal uslub.',
    },
  ],
  processStepsRu: [
    'Выберите модель и укажите тираж',
    'Пришлите логотип или текст для гравировки',
    'Согласуйте макет и подтвердите заказ',
    'Получите готовые зажигалки за 1–3 дня',
  ],
  processStepsUz: [
    'Model tanlang va tirajni ko\'rsating',
    "O'ymakorlik uchun logotip yoki matn yuboring",
    'Maketni tasdiqlang va buyurtmani tasdiqlashtiring',
    'Tayyor zazhigalkalarni 1–3 kunda oling',
  ],
  faq: [
    {
      qRu: 'Какой минимальный тираж?',
      qUz: 'Minimal tiraj qancha?',
      aRu: 'Минимальный тираж — 10 штук. При заказе от 50 штук действует скидка 10%, от 100 штук — 15%.',
      aUz: "Minimal tiraj — 10 dona. 50 donadan buyurtma berishda 10% chegirma, 100 donadan — 15%.",
    },
    {
      qRu: 'Сколько времени занимает изготовление?',
      qUz: 'Ishlab chiqarish qancha vaqt oladi?',
      aRu: 'Стандартный срок — 1–3 рабочих дня. Срочный заказ (24 часа) возможен при наличии модели на складе.',
      aUz: "Standart muddat — 1–3 ish kuni. Shoshilinch buyurtma (24 soat) omborda model mavjud bo'lganda mumkin.",
    },
    {
      qRu: 'Можно ли нанести фото или сложный логотип?',
      qUz: "Rasm yoki murakkab logotip qo'llash mumkinmi?",
      aRu: 'Да, лазерная гравировка позволяет воспроизвести любой логотип, текст или простое изображение с высокой точностью.',
      aUz: "Ha, lazer o'ymakorlik har qanday logotip, matn yoki oddiy tasvirni yuqori aniqlikda ko'paytirish imkonini beradi.",
    },
    {
      qRu: 'Есть ли индивидуальная упаковка?',
      qUz: 'Individual qadoqlash bormi?',
      aRu: 'Да, каждая зажигалка может быть упакована в индивидуальную подарочную коробку с логотипом вашей компании.',
      aUz: "Ha, har bir zazhigalka sizning kompaniyangiz logotipi bilan individual sovg'a qutisiga qadoqlanishi mumkin.",
    },
  ],
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  return <ProductPage locale={resolvedParams.locale as Locale} product={PRODUCT} />
}
