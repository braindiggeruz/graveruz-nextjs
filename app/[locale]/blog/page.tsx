import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import { getAllPostsMeta } from '@/lib/blog'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'
import BlogIndexClient from '@/components/BlogIndexClient'

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
      path: 'blog',
      title: 'Блог о корпоративных подарках и гравировке | Graver.uz',
      description: 'Полные гайды, статьи и кейсы о выборе корпоративных подарков, лазерной гравировке и брендировании в Ташкенте.',
    })
  }
  return buildMetadata({
    locale,
    path: 'blog',
    title: "Korporativ sovg'alar va gravyura haqida blog | Graver.uz",
    description: "Korporativ sovg'alar tanlash, lazer gravyurasi, brending va merch haqida to'liq qo'llanmalar, maqolalar va keyslar.",
  })
}

export default async function BlogIndexPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale

  // Filter out noindex posts — they are duplicate/thin content and should not appear in listings
  const posts = getAllPostsMeta(locale).filter(p => !p.noindex)

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}/` },
    { name: locale === 'ru' ? 'Блог' : 'Blog', url: `https://graver-studio.uz/${locale}/blog/` },
  ]

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />
      <BlogIndexClient locale={locale} posts={posts} />
    </>
  )
}
