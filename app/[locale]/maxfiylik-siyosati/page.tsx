import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { organizationSchema, websiteSchema, breadcrumbSchema } from '@/components/SchemaOrg'
import AlternateSlugSetter from '@/components/AlternateSlugSetter'
import PrivacyPolicyContent from '@/components/PrivacyPolicyContent'

const SLUG = 'maxfiylik-siyosati'
const PAGE_LOCALE: Locale = 'uz'
const ALT_SLUG: Partial<Record<Locale, string>> = {
  ru: 'politika-konfidentsialnosti',
  uz: 'maxfiylik-siyosati',
}

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
  return buildMetadata({
    locale,
    path: SLUG,
    title: "Maxfiylik siyosati | Graver Studio",
    description:
      "Graver Studio maxfiylik siyosati — graver-studio.uz sayti tashrifchilarining shaxsiy ma'lumotlarini qanday yig'amiz, ishlatamiz va himoya qilamiz. Toshkentda lazer o'ymakorligi.",
    alternateSlug: ALT_SLUG,
  })
}

export default async function Page({ params }: PageProps) {
  const { locale: l } = await params
  if (!isValidLocale(l)) notFound()
  if (l !== PAGE_LOCALE) notFound()
  const locale = l as Locale

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}/` },
    { name: 'Maxfiylik siyosati', url: `https://graver-studio.uz/${locale}/${SLUG}/` },
  ]

  const schemas = [organizationSchema(), websiteSchema(locale), breadcrumbSchema(breadcrumbs)]

  return (
    <>
      <SchemaOrg schema={schemas} />
      <AlternateSlugSetter alternateSlug={ALT_SLUG} />
      <PrivacyPolicyContent locale={locale} />
    </>
  )
}
