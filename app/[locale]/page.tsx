import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { organizationSchema, localBusinessSchema, faqSchema, websiteSchema, breadcrumbSchema } from '@/components/SchemaOrg'
import { getAllPostsMeta } from '@/lib/blog'
import FAQSection from '@/components/FAQSection'
import ContactForm from '@/components/ContactForm'
import { getHomepage } from '@/lib/cms'
import {
  Check,
  Clock,
  Zap,
  Sparkles,
  Users,
  Gift,
  Package,
  Briefcase,
  Star,
  Trophy,
  Grid,
  Flame,
} from 'lucide-react'

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
  const home = await getHomepage().catch(() => null)
  const seoFromCMS = home?.seo as
    | {
        title?: string
        description?: string
        titleRu?: string
        titleUz?: string
        descriptionRu?: string
        descriptionUz?: string
        ogTitleRu?: string
        ogTitleUz?: string
        ogDescriptionRu?: string
        ogDescriptionUz?: string
        ogImage?: string
        noindex?: boolean
      }
    | undefined

  const isRu = locale === 'ru'
  const seoTitle = isRu
    ? (seoFromCMS?.titleRu || seoFromCMS?.title)
    : (seoFromCMS?.titleUz || seoFromCMS?.titleRu || seoFromCMS?.title)
  const seoDescription = isRu
    ? (seoFromCMS?.descriptionRu || seoFromCMS?.description)
    : (seoFromCMS?.descriptionUz || seoFromCMS?.descriptionRu || seoFromCMS?.description)
  const ogTitle = isRu
    ? (seoFromCMS?.ogTitleRu || seoFromCMS?.titleRu || seoFromCMS?.title)
    : (seoFromCMS?.ogTitleUz || seoFromCMS?.titleUz || seoFromCMS?.titleRu || seoFromCMS?.title)
  const ogDescription = isRu
    ? (seoFromCMS?.ogDescriptionRu || seoFromCMS?.descriptionRu || seoFromCMS?.description)
    : (seoFromCMS?.ogDescriptionUz || seoFromCMS?.descriptionUz || seoFromCMS?.descriptionRu || seoFromCMS?.description)

  if (isRu) {
    return buildMetadata({
      locale,
      path: '',
      title: seoTitle || 'Лазерная гравировка и брендирование для бизнеса в Ташкенте — Graver.uz',
      description: seoDescription || 'Корпоративные подарки, welcome-паки, VIP-наборы с лазерной гравировкой. Работаем с B2B-клиентами по всему Узбекистану. Ташкент.',
      ogTitle,
      ogDescription,
      ogImage: seoFromCMS?.ogImage || 'https://graver-studio.uz/images/og/og-home.jpg',
      noindex: seoFromCMS?.noindex || false,
    })
  }

  return buildMetadata({
    locale,
    path: '',
    title: seoTitle || "Toshkentda biznes uchun lazer o'ymakorlik va brendlash — Graver.uz",
    description: seoDescription || "Logotip bilan korporativ sovg'alar, welcome-to'plamlar, VIP-to'plamlar. O'zbekiston bo'ylab B2B-mijozlar bilan ishlaymiz.",
    ogTitle,
    ogDescription,
    ogImage: seoFromCMS?.ogImage || 'https://graver-studio.uz/images/og/og-home.jpg',
    noindex: seoFromCMS?.noindex || false,
  })
}

// Map CMS icon string -> lucide icon component
function IconByName({ name, className }: { name?: string; className?: string }) {
  const cls = className || 'w-7 h-7 text-teal-500'
  switch (name) {
    case 'check': return <Check className={cls} />
    case 'clock': return <Clock className={cls} />
    case 'zap': return <Zap className={cls} />
    case 'sparkles': return <Sparkles className={cls} />
    case 'users': return <Users className={cls} />
    case 'gift': return <Gift className={cls} />
    case 'package': return <Package className={cls} />
    case 'briefcase': return <Briefcase className={cls} />
    case 'star': return <Star className={cls} />
    case 'trophy': return <Trophy className={cls} />
    case 'grid': return <Grid className={cls} />
    case 'laser': return <Flame className={cls} />
    default: return <Check className={cls} />
  }
}

// SEO money-page link map for services. Keyed by CMS icon value, then by locale.
const SERVICE_HREF_BY_ICON: Record<string, { ru: string; uz: string }> = {
  laser:     { ru: '/ru/lazernaya-gravirovka-tashkent/', uz: '/uz/toshkentda-lazer-gravyura/' },
  gift:      { ru: '/ru/korporativnye-podarki/',         uz: '/uz/toshkentda-korporativ-sovgalar/' },
  package:   { ru: '/ru/welcome-packs/',                 uz: '/uz/welcome-packs/' },
  briefcase: { ru: '/ru/vip-podarki/',                   uz: '/uz/vip-podarki/' },
  trophy:    { ru: '/ru/engraved-gifts/',                uz: '/uz/engraved-gifts/' },
  // star (Сувениры с логотипом) → safe link to catalog
  star:      { ru: '/ru/catalog-products/',              uz: '/uz/catalog-products/' },
}


export default async function HomePage({ params }: PageProps) {
  // ─────────────────────────────────────────────────────────────────
  // ⚠️ HOMEPAGE CONTENT CONTRACT — DO NOT BREAK
  // -------------------------------------------------------------------
  // The homepage MUST render its visible content from getHomepage()
  // (content/homepage/index.yaml), edited by operators in Keystatic.
  //
  // Allowed pattern:
  //   const value = (isRu ? home?.X?.fieldRu : home?.X?.fieldUz)
  //                  ?? messages.fallback ?? hardcodedFallback
  //
  // Forbidden patterns:
  //   • returning messages.hero.* (or any other JSON-only key) directly
  //     in JSX without a CMS path in front
  //   • introducing new hardcoded arrays for benefits / services /
  //     portfolio / processSteps / FAQ on top of the CMS arrays
  //   • inlining new copy here that should be operator-editable
  //
  // If a new field is needed: add it to keystatic.config.ts schema and
  // content/homepage/index.yaml, then read it via home.* with a safe
  // fallback. The owner must be able to change every visible string
  // and link on the homepage without touching code.
  // -------------------------------------------------------------------
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const messages = getMessages(locale)
  const recentPosts = getAllPostsMeta(locale).slice(0, 3)
  const home = await getHomepage().catch(() => null)

  const isRu = locale === 'ru'

  // ────────────────────────────────────────────────────────────────
  // HERO — CMS first, with fallback to messages JSON
  // ────────────────────────────────────────────────────────────────
  const heroBadge = (isRu ? home?.hero?.badgeRu : home?.hero?.badgeUz) || messages.hero.badge
  const heroTitle = (isRu ? home?.hero?.titleRu : home?.hero?.titleUz) || messages.hero.title
  const heroTitleAccent = (isRu ? home?.hero?.titleAccentRu : home?.hero?.titleAccentUz) || messages.hero.titleAccent
  const heroSubtitle = (isRu ? home?.hero?.subtitleRu : home?.hero?.subtitleUz) || messages.hero.subtitle
  const heroCtaPrimary = (isRu ? home?.hero?.ctaPrimaryRu : home?.hero?.ctaPrimaryUz) || messages.hero.ctaPrimary
  // CTA hrefs and secondary CTA — CMS-controllable, with safe fallbacks
  const heroEx = (home?.hero as
    | {
        ctaPrimaryHrefRu?: string
        ctaPrimaryHrefUz?: string
        ctaSecondaryRu?: string
        ctaSecondaryUz?: string
        ctaSecondaryHrefRu?: string
        ctaSecondaryHrefUz?: string
      }
    | undefined) || {}
  const heroCtaPrimaryHref =
    (isRu ? heroEx.ctaPrimaryHrefRu : heroEx.ctaPrimaryHrefUz) || '#contact'
  const heroCtaSecondary =
    (isRu ? heroEx.ctaSecondaryRu : heroEx.ctaSecondaryUz) || messages.hero.ctaSecondary
  const heroCtaSecondaryHref =
    (isRu ? heroEx.ctaSecondaryHrefRu : heroEx.ctaSecondaryHrefUz) || 'https://t.me/GraverAdm'

  // Hero stats from CMS, fallback to old hardcoded 4 stats
  const cmsStats = home?.hero?.stats || []
  const heroStats = cmsStats.length > 0
    ? cmsStats.map((s) => {
        const sx = s as {
          value?: string
          valueRu?: string
          valueUz?: string
          labelRu?: string
          labelUz?: string
        }
        const value = isRu
          ? (sx.valueRu || sx.value || '')
          : (sx.valueUz || sx.valueRu || sx.value || '')
        return {
          value,
          label: (isRu ? sx.labelRu : sx.labelUz) || sx.labelRu || '',
        }
      })
    : [
        { value: '100%', label: messages.hero.stats.approval },
        { value: '1-3', label: messages.hero.stats.days },
        { value: '∞', label: messages.hero.stats.volume },
        { value: '✓', label: messages.hero.stats.guarantee },
      ]

  // ────────────────────────────────────────────────────────────────
  // BENEFITS — CMS first, fallback to old hardcoded 6 cards
  // ────────────────────────────────────────────────────────────────
  const cmsBenefits = home?.benefits || []
  const benefitsList = cmsBenefits.length > 0
    ? cmsBenefits.map((b) => ({
        icon: b.icon || 'check',
        title: (isRu ? b.titleRu : b.titleUz) || b.titleRu || '',
        desc: (isRu ? b.descriptionRu : b.descriptionUz) || b.descriptionRu || '',
      }))
    : [
        { icon: 'check',     title: isRu ? 'Макет до производства' : 'Ishlab chiqarishdan oldin maket', desc: isRu ? 'Вы видите результат до запуска. Утверждаете — запускаем. Без сюрпризов.' : "Natijani ishga tushirishdan oldin ko'rasiz. Tasdiqlaysiz — ishga tushiramiz." },
        { icon: 'package',   title: isRu ? 'Любые тиражи' : 'Istalgan tiraj', desc: isRu ? 'От 1 штуки до тысяч. Единичный VIP-подарок или серия для всей команды с персонализацией.' : "1 donadan minglab donagacha. Yagona VIP-sovg'a yoki butun jamoa uchun seriya." },
        { icon: 'clock',     title: isRu ? 'Точные сроки' : 'Aniq muddatlar', desc: isRu ? 'Типовые заказы 1-3 дня. Срочное производство по запросу.' : "Oddiy buyurtmalar 1-3 kun. So'rov bo'yicha shoshilinch ishlab chiqarish." },
        { icon: 'zap',       title: isRu ? 'Любые материалы' : 'Har qanday materiallar', desc: isRu ? 'Металл, дерево, стекло, кожа, акрил, премиальные пластики.' : "Metall, yog'och, shisha, charm, akril, premium plastmassalar." },
        { icon: 'sparkles',  title: isRu ? 'Работаем с вашими файлами' : 'Sizning fayllaringiz bilan ishlaymiz', desc: isRu ? 'Логотипы, брендбуки, вектор, фото. Нет макета — создадим в корпоративном стиле.' : "Logotiplar, vektor, foto. Maket bo'lmasa — yaratamiz." },
        { icon: 'users',     title: isRu ? 'B2B-сервис' : 'B2B xizmat', desc: isRu ? 'Работа с юрлицами, закрывающие документы, отсрочка платежа по согласованию.' : "Yuridik shaxslar bilan ishlash, yopuvchi hujjatlar." },
      ]

  // ────────────────────────────────────────────────────────────────
  // SERVICES — CMS first, fallback to old hardcoded. SEO links preserved.
  // Each service can carry its own hrefRu/hrefUz/ctaLabelRu/ctaLabelUz
  // edited in Keystatic. If empty, SERVICE_HREF_BY_ICON is used.
  // ────────────────────────────────────────────────────────────────
  const cmsServices = home?.services || []
  const servicesList = cmsServices.length > 0
    ? cmsServices.map((s) => {
        const sx = s as {
          icon?: string
          titleRu?: string
          titleUz?: string
          descriptionRu?: string
          descriptionUz?: string
          hrefRu?: string
          hrefUz?: string
          ctaLabelRu?: string
          ctaLabelUz?: string
        }
        const icon = sx.icon || 'gift'
        const fallbackHrefMap = SERVICE_HREF_BY_ICON[icon]
        const fallbackHref = fallbackHrefMap
          ? (isRu ? fallbackHrefMap.ru : fallbackHrefMap.uz)
          : `/${locale}/catalog-products/`
        const href = (isRu ? sx.hrefRu : sx.hrefUz) || fallbackHref
        const ctaLabel =
          (isRu ? sx.ctaLabelRu : sx.ctaLabelUz) ||
          (isRu ? 'Подробнее →' : 'Batafsil →')
        return {
          icon,
          title: (isRu ? sx.titleRu : sx.titleUz) || sx.titleRu || '',
          desc: (isRu ? sx.descriptionRu : sx.descriptionUz) || sx.descriptionRu || '',
          href,
          ctaLabel,
        }
      })
    : [
        { icon: 'laser',     title: messages.services.laser_engraving,  desc: isRu ? 'Точная лазерная гравировка на металле, дереве, коже и стекле' : "Metall, yog'och, teri va shishada aniq lazer o'ymakorlik", href: isRu ? '/ru/lazernaya-gravirovka-tashkent/' : '/uz/toshkentda-lazer-gravyura/', ctaLabel: isRu ? 'Подробнее →' : 'Batafsil →' },
        { icon: 'gift',      title: messages.services.corporate_gifts,  desc: isRu ? 'Корпоративные подарки с логотипом для сотрудников и партнёров' : "Xodimlar va hamkorlar uchun logotip bilan korporativ sovg'alar", href: isRu ? '/ru/korporativnye-podarki/' : '/uz/toshkentda-korporativ-sovgalar/', ctaLabel: isRu ? 'Подробнее →' : 'Batafsil →' },
        { icon: 'package',   title: messages.services.welcome_packs,    desc: isRu ? 'Welcome-паки для новых сотрудников с брендированными предметами' : "Brendlangan buyumlar bilan yangi xodimlar uchun welcome-to'plamlar", href: `/${locale}/welcome-packs/`, ctaLabel: isRu ? 'Подробнее →' : 'Batafsil →' },
        { icon: 'briefcase', title: messages.services.vip_gifts,        desc: isRu ? 'VIP-подарки для ключевых клиентов и партнёров высшего уровня' : "Asosiy mijozlar va yuqori darajadagi hamkorlar uchun VIP-sovg'alar", href: `/${locale}/vip-podarki/`, ctaLabel: isRu ? 'Подробнее →' : 'Batafsil →' },
        { icon: 'star',      title: messages.services.branded_sets,     desc: isRu ? 'Брендированные наборы для корпоративных мероприятий и презентаций' : "Korporativ tadbirlar va taqdimotlar uchun brendlangan to'plamlar", href: `/${locale}/catalog-products/`, ctaLabel: isRu ? 'Подробнее →' : 'Batafsil →' },
        { icon: 'trophy',    title: isRu ? 'Подарки с гравировкой' : 'Gravyurali sovg\'alar', desc: isRu ? 'Именные подарки и сувениры с лазерной гравировкой' : "Lazer gravyurali shaxsiy sovg'alar va suvenirlar", href: `/${locale}/engraved-gifts/`, ctaLabel: isRu ? 'Подробнее →' : 'Batafsil →' },
      ]

  // ────────────────────────────────────────────────────────────────
  // PORTFOLIO — CMS first, fallback to old hardcoded
  // ────────────────────────────────────────────────────────────────
  const cmsPortfolio = home?.portfolio || []
  const portfolioList = cmsPortfolio.length > 0
    ? cmsPortfolio.map((p) => ({
        img: p.image || '/images/og/og-home.jpg',
        category: (isRu ? p.categoryRu : p.categoryUz) || p.categoryRu || '',
        title: (isRu ? p.titleRu : p.titleUz) || p.titleRu || '',
        desc: (isRu ? p.descriptionRu : p.descriptionUz) || p.descriptionRu || '',
        material: (isRu ? p.materialRu : p.materialUz) || p.materialRu || '',
        application: (isRu ? p.applicationRu : p.applicationUz) || p.applicationRu || '',
      }))
    : [
        { img: '/images/products/neo/1.jpg', category: isRu ? 'Награды и признание' : 'Mukofotlar va tan olish', title: isRu ? 'Корпоративные награды' : 'Korporativ mukofotlar', desc: isRu ? 'Премиальные награды с гравировкой для сотрудников и партнёров' : 'Xodimlar va hamkorlar uchun gravyurali premium mukofotlar', material: isRu ? 'Металл, дерево' : "Metall, yog'och", application: isRu ? 'Награждение персонала' : 'Xodimlarni mukofotlash' },
        { img: '/images/products/neo/2.jpg', category: isRu ? 'Премиальные подарки' : "Premium sovg'alar", title: isRu ? 'Часы с персональной гравировкой' : 'Shaxsiy gravyurali soatlar', desc: isRu ? 'Элитные часы с индивидуальной гравировкой для топ-менеджмента' : 'Top-menejerlar uchun individual gravyurali elit soatlar', material: isRu ? 'Металл, стекло' : 'Metall, shisha', application: isRu ? 'Подарки руководителям' : "Rahbarlarga sovg'alar" },
        { img: '/images/products/neo/3.jpg', category: isRu ? 'Корпоративная продукция' : 'Korporativ mahsulotlar', title: isRu ? 'Брендированные термосы' : 'Brendlangan termoslar', desc: isRu ? 'Качественные термосы с логотипом компании для команды' : 'Jamoa uchun kompaniya logotipi bilan sifatli termoslar', material: isRu ? 'Анодированный алюминий' : 'Anodlangan alyuminiy', application: isRu ? 'Подарки сотрудникам' : "Xodimlarga sovg'alar" },
      ]

  // ────────────────────────────────────────────────────────────────
  // PROCESS STEPS — CMS first, fallback to old hardcoded
  // ────────────────────────────────────────────────────────────────
  const cmsSteps = home?.processSteps || []
  const stepsList = cmsSteps.length > 0
    ? cmsSteps.map((s) => ({
        step: s.step || '',
        title: (isRu ? s.titleRu : s.titleUz) || s.titleRu || '',
        desc: (isRu ? s.descriptionRu : s.descriptionUz) || s.descriptionRu || '',
      }))
    : [
        { step: '1', title: isRu ? 'Заявка' : 'Ariza', desc: isRu ? 'Напишите в Telegram или заполните форму расчёта.' : "Telegramga yozing yoki hisob formasini to'ldiring." },
        { step: '2', title: isRu ? 'Макет' : 'Maket', desc: isRu ? 'Создаём цифровой макет с точным размещением и размерами.' : "Aniq joylashish va o'lchamlar bilan raqamli maket yaratamiz." },
        { step: '3', title: isRu ? 'Утверждение' : 'Tasdiqlash', desc: isRu ? 'Согласовываете макет, фиксируем сроки и стоимость.' : "Maketni kelishtirasiz, muddatlar va narxni belgilaymiz." },
        { step: '4', title: isRu ? 'Производство' : 'Ishlab chiqarish', desc: isRu ? 'Выполняем гравировку согласно утверждённому макету.' : "Tasdiqlangan maketga muvofiq gravyura qilamiz." },
      ]

  // ────────────────────────────────────────────────────────────────
  // FAQ — CMS first, fallback to hardcoded
  // ────────────────────────────────────────────────────────────────
  const cmsFaq = home?.faq || []
  const faqItems = cmsFaq.length > 0
    ? cmsFaq.map((f) => ({
        q: (isRu ? f.questionRu : f.questionUz) || f.questionRu || '',
        a: (isRu ? f.answerRu : f.answerUz) || f.answerRu || '',
      }))
    : (isRu ? [
          { q: 'Какой минимальный тираж для корпоративного заказа?', a: 'Минимального тиража нет. Делаем как 1 эксклюзивный подарок, так и серии на тысячи единиц. Цена за единицу снижается при объёмах от 50+ штук.' },
          { q: 'Можно ли сделать персонализацию для каждого сотрудника?', a: 'Да, делаем индивидуальную гравировку имени, должности, даты для каждого изделия в тираже. Пришлите список — подготовим макеты для согласования.' },
          { q: 'Работаете ли с юридическими лицами?', a: 'Да, работаем с юрлицами. Предоставляем все закрывающие документы, счета, акты. По согласованию возможна отсрочка платежа для постоянных клиентов.' },
          { q: 'Сколько времени занимает производство?', a: 'Типовые заказы — 1-3 дня после утверждения макета. Крупные тиражи и сложные проекты — обсуждаем индивидуально. Срочное производство — по запросу.' },
          { q: 'Что нужно от нас для начала работы?', a: 'Логотип в векторе (AI/SVG/PDF) или качественное фото. Описание: что наносим, на какие предметы, тираж, к какому сроку. Если нет готового макета — создадим сами.' },
          { q: 'На каких материалах делаете гравировку?', a: 'Металл (сталь, алюминий, латунь), анодированный алюминий, дерево, кожа, стекло, акрил, премиальные пластики. Fiber, CO2, MOPA и UV-технологии.' },
          { q: 'Можно ли увидеть результат до производства?', a: 'Обязательно. Это наш стандарт работы: вы получаете цифровой макет с точными размерами и размещением, утверждаете его, и только потом мы запускаем производство.' },
          { q: 'Предоставляете ли подарочную упаковку?', a: 'Да, предлагаем премиальную упаковку под ключ: коробки, пакеты, ленты, открытки — всё под ваш корпоративный стиль.' },
      ] : [
          { q: 'Korporativ buyurtma uchun minimal tiraj qancha?', a: "Minimal tiraj yo'q. 1 ta eksklyuziv sovg'adan minglab donagacha tayyorlaymiz. 50+ donadan narx pasayadi." },
          { q: 'Har bir xodim uchun personalizatsiya qilish mumkinmi?', a: "Ha, tirajdagi har bir mahsulot uchun individual ism, lavozim, sana gravyura qilamiz. Ro'yxat yuboring — tasdiqlash uchun maketlar tayyorlaymiz." },
          { q: 'Yuridik shaxslar bilan ishlaysizmi?', a: "Ha, yuridik shaxslar bilan ishlaymiz. Barcha yopuvchi hujjatlar, hisob-fakturalar, dalolatnomalar taqdim etamiz. Doimiy mijozlar uchun to'lovni kechiktirish mumkin." },
          { q: 'Ishlab chiqarish qancha vaqt oladi?', a: "Oddiy buyurtmalar — maketni tasdiqlagandan keyin 1-3 kun. Katta tirajlar va murakkab loyihalar — individual muhokama qilinadi. Shoshilinch ishlab chiqarish — so'rov bo'yicha." },
          { q: 'Ishni boshlash uchun bizdan nima kerak?', a: "Vektor formatida logotip (AI/SVG/PDF) yoki sifatli foto. Tavsif: nima qo'yiladi, qaysi buyumlarga, tiraj, qachongacha. Tayyor maket bo'lmasa — o'zimiz yaratamiz." },
          { q: 'Qaysi materiallarda gravyura qilasiz?', a: "Metall (po'lat, alyuminiy, latun), anodlangan alyuminiy, yog'och, charm, shisha, akril, premium plastmassalar. Fiber, CO2, MOPA va UV texnologiyalari." },
          { q: "Ishlab chiqarishdan oldin natijani ko'rish mumkinmi?", a: "Albatta. Bu bizning standart ishimiz: aniq o'lchamlar va joylashuvga ega raqamli maket olasiz, uni tasdiqlaysiz, va faqat shundan keyin ishlab chiqarishni boshlaymiz." },
          { q: "Sovg'a qadoqlash taqdim etasizmi?", a: "Ha, tayyor premium qadoqlash taklif qilamiz: qutichalar, paketlar, lentalar, ochiq xatlar — hammasi sizning korporativ uslubingizga mos." },
      ])

  return (
    <>
      <SchemaOrg schema={[organizationSchema(), websiteSchema(locale), localBusinessSchema(), breadcrumbSchema([{ name: 'Graver.uz', url: `https://graver-studio.uz/${locale}/` }]), faqSchema(faqItems)]} />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — driven by CMS (content/homepage/index.yaml)
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black pt-20" id="hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium px-4 py-2 rounded-full">
                {heroBadge}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {heroTitle}<br />
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">{heroTitleAccent}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <a
                href={heroCtaPrimaryHref}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-10 py-5 rounded-lg font-bold text-lg hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-500/50 min-h-[56px] text-center"
                data-track="cta"
                data-placement="hero-primary"
              >
                {heroCtaPrimary}
              </a>
              <a
                href={heroCtaSecondaryHref}
                data-track="tg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-transparent text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-white/10 transition border border-white/30 flex items-center justify-center gap-2 min-h-[56px]"
                data-placement="hero-secondary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                {heroCtaSecondary}
              </a>
            </div>
            {/* Trust indicators — driven by home.hero.stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-5xl mx-auto">
              {heroStats.map((s, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-teal-500">{s.value}</div>
                  <div className="text-sm text-gray-300">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          B2B BENEFITS SECTION — driven by home.benefits
      ═══════════════════════════════════════════════════════════ */}
      <section id="benefits" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isRu ? 'Почему бизнес выбирает' : 'Nima uchun biznes tanlaydi'}
              <br />
              <span className="text-teal-500">Graver.uz</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {isRu
                ? 'Мы — не просто гравировка. Мы — B2B-партнёр, который закрывает задачу полностью: от идеи до упакованного тиража.'
                : "Biz — oddiy gravyura emas. Biz — g'oyadan tayyor tirajgacha vazifani to'liq yopadigan B2B-hamkor."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefitsList.map((benefit, i) => (
              <div
                key={i}
                className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition group"
              >
                <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition">
                  <IconByName name={benefit.icon} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES SECTION — driven by home.services, SEO links preserved
      ═══════════════════════════════════════════════════════════ */}
      <section id="services" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {messages.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, i) => (
              <a
                key={i}
                href={service.href}
                className="block bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition group"
                data-track="service-card"
                data-placement={`service-${i}`}
              >
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                  <IconByName name={service.icon} className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-400 transition">{service.title}</h3>
                <p className="text-gray-400">{service.desc}</p>
                <span className="inline-block mt-4 text-teal-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                  {service.ctaLabel}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRODUCTS SECTION — Lighters Catalog (preserved)
      ═══════════════════════════════════════════════════════════ */}
      <section id="products" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                {isRu ? 'Новый каталог' : 'Yangi katalog'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {isRu ? 'Зажигалки с гравировкой' : 'Gravyurali zajigalkalar'}
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {isRu
                  ? 'Эксклюзивные зажигалки с лазерной гравировкой логотипа, имени или фото. Идеальный подарок для любого повода.'
                  : "Logotip, ism yoki surat bilan eksklyuziv zajigalkalar. Korporativ yoki shaxsiy sovg'a uchun ideal."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${locale}/products/lighters/`}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition"
                >
                  {isRu ? 'Смотреть все модели' : "Barcha modellarni ko'rish"}
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Silver Gloss', price: '140,000', bg: 'from-gray-300 to-gray-100', text: 'text-gray-700', priceColor: 'text-orange-600', img: '/images/products/lighters/r109_silver_gloss.jpg' },
                { name: 'Black Matte', price: '150,000', bg: 'from-gray-800 to-gray-900', text: 'text-white', priceColor: 'text-orange-400', img: '/images/products/lighters/r110_black_matte.jpg' },
                { name: 'Black Texture', price: '170,000', bg: 'from-gray-700 to-black', text: 'text-white', priceColor: 'text-orange-400', img: '/images/products/lighters/r111_black_texture.jpg' },
                { name: 'Brushed Steel', price: '160,000', bg: 'from-gray-500 to-gray-400', text: 'text-gray-800', priceColor: 'text-orange-600', img: '/images/products/lighters/r112_brushed_steel.jpg' },
              ].map((product, i) => (
                <div key={i} className={`bg-gradient-to-br ${product.bg} aspect-square rounded-2xl overflow-hidden relative group`}>
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-white font-semibold text-sm">{product.name}</span>
                    <p className={`${product.priceColor} font-bold text-sm`}>
                      {product.price} {isRu ? 'сум' : "so'm"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEO WATCHES SECTION (preserved)
      ═══════════════════════════════════════════════════════════ */}
      <section id="neo-watches" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-400 px-4 py-2 rounded-full text-sm mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isRu ? 'Премиум часы' : 'Premium soatlar'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {isRu ? 'Часы NEO' : 'NEO soatlar'}
              </h2>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                {isRu
                  ? 'Премиальные часы с персональной гравировкой. Модели Quartz и Automatic. Идеальный корпоративный подарок или личный аксессуар.'
                  : "Shaxsiy gravyura bilan premium soatlar. Quartz va Automatic modellar. Korporativ sovg'a yoki o'zingiz uchun."}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                  <p className="text-white font-semibold text-sm">Quartz</p>
                  <p className="text-teal-400 font-bold text-sm">750 000 {isRu ? 'сум' : "so'm"}</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-white font-semibold text-sm">Automatic</p>
                  <p className="text-cyan-400 font-bold text-sm">1 100 000 {isRu ? 'сум' : "so'm"}</p>
                </div>
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                  <p className="text-white font-semibold text-sm">{isRu ? 'Корпоративные' : 'Korporativ'}</p>
                  <p className="text-teal-400 font-bold text-sm">{isRu ? 'Оптовые цены' : 'Optom narx'}</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-white font-semibold text-sm">{isRu ? 'Подарок' : "Sovg'a"}</p>
                  <p className="text-cyan-400 font-bold text-sm">{isRu ? 'Премиум упаковка' : 'Premium qadoq'}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${locale}/products/neo-watches/`}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition"
                >
                  {isRu ? 'Смотреть все модели' : "Barcha modellarni ko'rish"}
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/catalog-products/`}
                  className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700"
                >
                  {isRu ? 'Перейти в каталог' : "Katalogga o'tish"}
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/20 aspect-[16/9]">
                <Image
                  src="/images/products/neo-watch-hero.jpg"
                  alt={isRu ? 'Часы NEO с гравировкой' : 'NEO soatlar gravyura bilan'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-1">
                        {isRu ? 'Цена' : 'Narx'}
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {isRu ? '750 000 – 1 100 000 сум' : "750 000 – 1 100 000 so'm"}
                      </p>
                    </div>
                    <Link
                      href={`/${locale}/products/neo-watches/`}
                      className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2"
                    >
                      {isRu ? 'Смотреть' : "Ko'rish"}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PORTFOLIO SECTION — driven by home.portfolio
      ═══════════════════════════════════════════════════════════ */}
      <section id="portfolio" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isRu ? 'Портфолио ' : 'Portfolio '}
              <span className="text-teal-500">{isRu ? 'наших работ' : 'bizning ishlarimiz'}</span>
            </h2>
            <p className="text-xl text-gray-400">
              {isRu ? 'Реальные проекты для B2B клиентов' : 'B2B mijozlar uchun real loyihalar'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioList.map((item, i) => (
              <div key={i} className="group relative bg-black/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-teal-500/50 transition">
                <div className="aspect-square overflow-hidden bg-gray-800 relative">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <span className="text-teal-500 text-sm font-semibold">{item.category}</span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                  <div className="space-y-2 text-xs text-gray-300">
                    <div>
                      <span className="text-gray-500">{isRu ? 'Материал' : 'Material'}:</span> {item.material}
                    </div>
                    <div>
                      <span className="text-gray-500">{isRu ? 'Применение' : "Qo'llanilishi"}:</span> {item.application}
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center mt-4 text-teal-500 hover:text-teal-400 font-semibold text-sm group/link"
                  >
                    {isRu ? 'Запросить расчёт' : "Hisob so'rash"}
                    <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS SECTION — driven by home.processSteps
      ═══════════════════════════════════════════════════════════ */}
      <section id="process" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isRu ? 'Как мы ' : 'Biz qanday '}
              <span className="text-teal-500">{isRu ? 'работаем' : 'ishlaymiz'}</span>
            </h2>
            <p className="text-xl text-gray-400">
              {isRu ? 'Прозрачный процесс от заявки до получения' : "Arizadan qabul qilishgacha shaffof jarayon"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stepsList.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6 text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
                {i < stepsList.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-teal-500/10 border border-teal-500/30 rounded-xl px-6 py-4">
              <p className="text-teal-500 font-semibold">
                {isRu
                  ? '⚡ Типовой срок производства: 1-3 дня после утверждения макета'
                  : "⚡ Oddiy ishlab chiqarish muddati: maketni tasdiqlagandan keyin 1-3 kun"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BLOG PREVIEW (preserved)
      ═══════════════════════════════════════════════════════════ */}
      {recentPosts.length > 0 && (
        <section id="blog-preview" className="py-20 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-white">{messages.blog.title}</h2>
              <Link href={`/${locale}/blog/`} className="text-teal-500 hover:text-teal-400 transition">
                {isRu ? 'Все статьи →' : "Barcha maqolalar →"}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.slug} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-teal-500 transition flex flex-col">
                  {post.ogImage && (
                    <div className="aspect-video bg-gray-700 overflow-hidden">
                      <img
                        src={post.ogImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && (
                        <span className="bg-teal-500/20 text-teal-400 text-xs px-2 py-1 rounded-full">{post.category}</span>
                      )}
                      {post.date && (
                        <time dateTime={post.date} className="text-gray-500 text-xs">
                          {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </time>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 flex-1">
                      <Link href={`/${locale}/blog/${post.slug}/`} className="hover:text-teal-500 transition">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">{post.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <Link href={`/${locale}/blog/${post.slug}/`} className="text-teal-500 text-sm hover:text-teal-400 transition">
                        {messages.blog.read_more} →
                      </Link>
                      {post.readingTime && (
                        <span className="text-gray-500 text-xs">{post.readingTime} {isRu ? 'мин' : 'daq'}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          FAQ SECTION — passes CMS-derived items to the client component
      ═══════════════════════════════════════════════════════════ */}
      <FAQSection locale={locale} items={faqItems} />

      {/* ═══════════════════════════════════════════════════════════
          CONTACT SECTION (preserved)
      ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: contact info */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">{messages.contact.title}</h2>
              <p className="text-gray-400 mb-8">
                {isRu
                  ? 'Оставьте заявку — мы свяжемся с вами в течение 30 минут и подберём оптимальное решение.'
                  : "Ariza qoldiring — 30 daqiqa ichida siz bilan bog'lanamiz va optimal yechim topamiz."}
              </p>
              <div className="space-y-4 mb-8">
                <a
                  href="tel:+998770802288"
                  className="flex items-center gap-3 text-gray-300 hover:text-teal-500 transition"
                  data-track="tel"
                  data-placement="homepage-contact"
                >
                  <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <span className="font-semibold">+998 77 080 22 88</span>
                </a>
                <a
                  href="https://t.me/GraverAdm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-teal-500 transition"
                  data-track="tg"
                  data-placement="homepage-contact"
                >
                  <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </div>
                  <span className="font-semibold">@GraverAdm</span>
                </a>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <p className="text-teal-400 font-semibold mb-1">{isRu ? 'Режим работы' : 'Ish vaqti'}</p>
                <p className="text-gray-300 text-sm">{isRu ? 'Пн–Сб: 09:00–18:00' : 'Du–Shan: 09:00–18:00'}</p>
                <p className="text-teal-500 text-sm font-medium mt-1">{isRu ? 'Заявки принимаем 24/7' : 'Arizalar 24/7'}</p>
              </div>
            </div>
            {/* Right: contact form */}
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  )
}
