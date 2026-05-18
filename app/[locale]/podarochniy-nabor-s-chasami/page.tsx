import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import { getPage } from '@/lib/cms'
import WatchGiftSetLanding from '@/components/WatchGiftSetLanding'
import SchemaOrg, { breadcrumbSchema, faqSchema } from '@/components/SchemaOrg'

const SLUG = 'podarochniy-nabor-s-chasami'
const PAGE_LOCALE: Locale = 'ru'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return [{ locale: PAGE_LOCALE }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: l } = await params
  if (!isValidLocale(l)) return {}
  if (l !== PAGE_LOCALE) return { robots: { index: false, follow: false } }
  const locale = l as Locale
  const page = await getPage(SLUG).catch(() => null)
  const seo = page?.seo
  const title = seo?.title || 'Подарочный набор с часами и логотипом компании | Graver Studio'
  const description = seo?.description || ''
  return buildMetadata({
    locale,
    path: SLUG,
    title,
    description,
    ogImage: seo?.ogImage
      ? (seo.ogImage.startsWith('http') ? seo.ogImage : `https://graver-studio.uz${seo.ogImage}`)
      : 'https://graver-studio.uz/images/products/gift-set-watch/hero.png',
    noindex: !!seo?.noindex || page?.status !== 'published',
    alternateSlug: {
      ru: SLUG,
      uz: 'soatli-sovga-toplami',
    },
  })
}

export default async function Page({ params }: PageProps) {
  const { locale: l } = await params
  if (!isValidLocale(l)) notFound()
  if (l !== PAGE_LOCALE) notFound()
  const locale = l as Locale

  const page = await getPage(SLUG).catch(() => null)
  if (!page || page.status !== 'published') notFound()

  // Defaults — CMS values override
  const h1 = page.h1 || 'Премиальный подарочный набор с часами и логотипом компании'
  const intro =
    page.intro ||
    'Часы SLIM, кожаное портмоне и ручка-роллер в фирменном футляре. Нанесём логотип, эмблему, имя или короткую фразу — для партнёров, сотрудников и VIP-клиентов.'

  // Find CTA & FAQ blocks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocks = (page.blocks || []) as any[]
  const ctaBlock = blocks.find((b) => b.discriminant === 'cta')?.value
  const faqBlock = blocks.find((b) => b.discriminant === 'faq')?.value
  const faqItems: Array<{ q: string; a: string }> = faqBlock?.items || []

  const finalCta = {
    title: ctaBlock?.title || 'Хотите такой набор с логотипом вашей компании?',
    subtitle: ctaBlock?.subtitle ||
      'Напишите нам — подскажем варианты нанесения, упаковки и рассчитаем заказ под вашу задачу.',
    primaryLabel: ctaBlock?.buttonLabel || 'Рассчитать стоимость в Telegram',
    primaryHref: ctaBlock?.buttonHref || 'https://t.me/GraverAdm',
  }

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}/` },
    { name: h1, url: `https://graver-studio.uz/${locale}/${SLUG}/` },
  ]

  // Product schema WITHOUT price / availability / rating / reviews (no fake data).
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: h1,
    description: intro,
    image: 'https://graver-studio.uz/images/products/gift-set-watch/hero.png',
    brand: { '@type': 'Brand', name: 'Graver Studio' },
    category: 'Corporate Gifts',
  }

  const schemas = [
    productSchema,
    breadcrumbSchema(breadcrumbs),
    ...(faqItems.length > 0 ? [faqSchema(faqItems)] : []),
  ]

  return (
    <>
      <SchemaOrg schema={schemas} />
      <WatchGiftSetLanding
        locale={locale}
        h1={h1}
        intro={intro}
        finalCta={finalCta}
        faq={faqItems}
      />
    </>
  )
}
