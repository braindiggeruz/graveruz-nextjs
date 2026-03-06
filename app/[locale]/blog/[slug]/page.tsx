import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { isValidLocale, getMessages, type Locale } from '@/lib/i18n'
import { buildArticleMetadata } from '@/lib/seo'
import { getPost, getAllSlugs, getRelatedPosts } from '@/lib/blog'
import SchemaOrg, { articleSchema, faqSchema, breadcrumbSchema } from '@/components/SchemaOrg'
import HreflangLinks from '@/components/HreflangLinks'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = []
  for (const locale of ['ru', 'uz'] as const) {
    const slugs = getAllSlugs(locale)
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale
  const post = getPost(locale, resolvedParams.slug)
  if (!post) return {}

  return buildArticleMetadata({
    locale,
    path: `blog/${post.slug}`,
    title: post.title,
    description: post.description,
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
    ogImage: post.ogImage ?? 'https://graver-studio.uz/images/og/og-blog.jpg',
    publishedTime: post.date,
    author: post.author,
    alternateSlug: post.alternateSlug,
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const post = getPost(locale, resolvedParams.slug)
  if (!post) notFound()

  const messages = getMessages(locale)
  const isRu = locale === 'ru'
  const relatedPosts = post.relatedSlugs ? getRelatedPosts(locale, post.relatedSlugs) : []

  const canonicalUrl = `https://graver-studio.uz/${locale}/blog/${post.slug}`
  const ogImage = post.ogImage ?? 'https://graver-studio.uz/images/og/og-blog.jpg'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}` },
    { name: messages.blog.title, url: `https://graver-studio.uz/${locale}/blog` },
    { name: post.title, url: canonicalUrl },
  ]

  const schemas = [
    articleSchema({
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      imageUrl: ogImage,
      datePublished: post.date,
      author: post.author,
    }),
    breadcrumbSchema(breadcrumbs),
    ...(post.faq && post.faq.length > 0 ? [faqSchema(post.faq)] : []),
  ]

  return (
    <>
      <HreflangLinks locale={locale} path={`blog/${post.slug}`} alternateSlug={post.alternateSlug} />
      <SchemaOrg schema={schemas} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400 flex-wrap gap-y-1">
            <li><Link href={`/${locale}`} className="hover:text-teal-500">Graver.uz</Link></li>
            <li className="text-gray-600">/</li>
            <li><Link href={`/${locale}/blog`} className="hover:text-teal-500">{messages.blog.title}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-gray-300 truncate max-w-xs">{post.title}</li>
          </ol>
        </nav>

        {/* Article header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {post.date && (
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.readingTime && (
              <span>
                {post.readingTime} {isRu ? 'мин. чтения' : 'daqiqa o\'qish'}
              </span>
            )}
            {post.author && <span>{post.author}</span>}
          </div>
        </header>

        {/* Hero image */}
        {post.ogImage && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <img
              src={post.ogImage}
              alt={post.title}
              className="w-full aspect-video object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* Article body */}
        <article className="prose prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </article>

        {/* FAQ Section */}
        {post.faq && post.faq.length > 0 && (
          <section className="mt-12 border-t border-gray-800 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6">
              {isRu ? 'Часто задаваемые вопросы' : 'Ko\'p so\'raladigan savollar'}
            </h2>
            <div className="space-y-4">
              {post.faq.map((item, i) => (
                <details key={i} className="bg-gray-800/50 rounded-lg border border-gray-700">
                  <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:text-teal-500 transition list-none flex justify-between items-center">
                    {item.q}
                    <span className="text-teal-500 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <div className="px-6 pb-4 text-gray-400">{item.a}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-12 border-t border-gray-800 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6">{messages.blog.related}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <article key={related.slug} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-teal-500 transition">
                  <h3 className="text-base font-semibold text-white mb-2 line-clamp-2">
                    <Link href={`/${locale}/blog/${related.slug}`} className="hover:text-teal-500 transition">
                      {related.title}
                    </Link>
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{related.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Back to blog */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <Link href={`/${locale}/blog`} className="text-teal-500 hover:text-teal-400 transition flex items-center">
            ← {messages.blog.back}
          </Link>
        </div>
      </div>
    </>
  )
}
