import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import { getAllPostsMeta } from '@/lib/blog'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'

interface PageProps {
  params: { locale: string }
}

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isValidLocale(params.locale)) return {}
  const locale = params.locale as Locale

  if (locale === 'ru') {
    return buildMetadata({
      locale,
      path: 'blog',
      title: 'Блог о корпоративных подарках и гравировке — Graver.uz',
      description: 'Полезные статьи о корпоративных подарках, лазерной гравировке и брендировании для бизнеса. Советы для B2B-команд в Ташкенте.',
    })
  }

  return buildMetadata({
    locale,
    path: 'blog',
    title: "Korporativ sovg'alar va o'ymakorlik haqida blog — Graver.uz",
    description: "Korporativ sovg'alar, lazer o'ymakorlik va brendlash haqida foydali maqolalar. Toshkentdagi B2B-jamoalar uchun maslahatlar.",
  })
}

export default function BlogIndexPage({ params }: PageProps) {
  if (!isValidLocale(params.locale)) notFound()
  const locale = params.locale as Locale
  const messages = getMessages(locale)
  const posts = getAllPostsMeta(locale)
  const isRu = locale === 'ru'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}` },
    { name: messages.blog.title, url: `https://graver-studio.uz/${locale}/blog` },
  ]

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><Link href={`/${locale}`} className="hover:text-teal-500">Graver.uz</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-gray-300">{messages.blog.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{messages.blog.title}</h1>
          <p className="text-xl text-gray-400">{messages.blog.subtitle}</p>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {isRu ? 'Статьи скоро появятся.' : 'Maqolalar tez orada paydo bo\'ladi.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-teal-500 transition flex flex-col"
              >
                {post.ogImage && (
                  <div className="aspect-video bg-gray-700 overflow-hidden">
                    <img
                      src={post.ogImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    {post.date && (
                      <time dateTime={post.date} className="text-gray-500 text-xs">
                        {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2 flex-1">
                    <Link href={`/${locale}/blog/${post.slug}`} className="hover:text-teal-500 transition">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">{post.description}</p>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="text-teal-500 text-sm hover:text-teal-400 transition mt-auto"
                  >
                    {messages.blog.read_more} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
