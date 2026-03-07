'use client'

// BlogIndexClient.tsx
// Exact transplant from CRA frontend/src/pages/BlogIndex.js
// Minimal adaptations: React Router → Next.js Link, useState for search/pagination
// Icons: inline SVG (no lucide-react dependency)

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { BlogPostMeta } from '@/lib/blog'

// ── Inline SVG icons (no external dependency) ─────────────────────────────
const CalendarIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const ChevronRightIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const StarIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const TrendingUpIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)
const ClockIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const FolderOpenIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
)
const SearchIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const ChevronLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

// ── Featured slugs (exact from CRA) ───────────────────────────────────────
const featuredSlugsRu = [
  'kak-vybrat-korporativnyj-podarok',
  'lazernaya-gravirovka-podarkov',
  'podarochnye-nabory-s-logotipom',
  'brendirovanie-suvenirov',
  'chek-list-zakupshchika-podarkov',
  'top-idei-podarkov-na-novyj-god',
]
const featuredSlugsUz = [
  'korporativ-sovgani-qanday-tanlash',
  'lazer-gravirovka-sovgalar',
  'logotipli-sovga-toplami',
  'suvenir-brendlash',
  'xaridor-chek-listi-b2b',
  'yangi-yil-sovga-goyalari',
]

// ── Helper: reading time (exact from CRA getPostReadTimeMinutes) ───────────
function getReadTimeMinutes(post: BlogPostMeta): number {
  if (post.readingTime) return post.readingTime
  return 5 // default
}

// ── Helper: category summary (exact from CRA getCategorySummary) ──────────
function getCategorySummary(posts: BlogPostMeta[], limit = 4): Array<{ name: string; count: number }> {
  const counts: Record<string, number> = {}
  for (const post of posts) {
    const cat = post.category || 'Общее'
    counts[cat] = (counts[cat] || 0) + 1
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }))
}

interface Props {
  locale: string
  posts: BlogPostMeta[]
}

const POSTS_PER_PAGE = 12

export default function BlogIndexClient({ locale, posts }: Props) {
  const isRu = locale === 'ru'
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // ── Featured posts (exact from CRA) ──────────────────────────────────────
  const featuredSlugs = isRu ? featuredSlugsRu : featuredSlugsUz
  const featuredPosts = featuredSlugs
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter(Boolean) as BlogPostMeta[]

  // ── Categories (exact from CRA getCategorySummary) ────────────────────────
  const categories = useMemo(() => getCategorySummary(posts, 4), [posts])

  // ── Latest 3 posts (exact from CRA) ──────────────────────────────────────
  const latestPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)

  // ── Money hub links (exact from CRA) ─────────────────────────────────────
  const moneyHubLinks = isRu
    ? [
        { href: `/${locale}/products/lighters`, label: 'Зажигалки с логотипом и гравировкой' },
        { href: `/${locale}/products/neo-watches`, label: 'Часы NEO с логотипом компании' },
        { href: `/${locale}#contact`, label: 'Заказать гравировку — связаться с нами' },
        { href: `/${locale}#services`, label: 'Все услуги лазерной гравировки' },
      ]
    : [
        { href: `/${locale}/products/lighters`, label: 'Logotip va gravyurali zajigalkalar' },
        { href: `/${locale}/products/neo-watches`, label: 'Kompaniya logotipi bilan NEO soatlar' },
        { href: `/${locale}#contact`, label: "Gravyura buyurtma berish — biz bilan bog'lanish" },
        { href: `/${locale}#services`, label: 'Barcha lazer gravyura xizmatlari' },
      ]

  // ── Sorted + filtered posts (exact from CRA) ─────────────────────────────
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts]
  )

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return sortedPosts
    return sortedPosts.filter((post) => {
      const title = (post.title || '').toLowerCase()
      const description = (post.description || '').toLowerCase()
      return title.includes(query) || description.includes(query)
    })
  }, [searchQuery, sortedPosts])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Breadcrumb (exact from CRA) ──────────────────────────────── */}
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href={`/${locale}`} className="hover:text-teal-500 transition">
                {isRu ? 'Главная' : 'Bosh sahifa'}
              </Link>
            </li>
            <li> / </li>
            <li className="text-gray-400">{isRu ? 'Блог' : 'Blog'}</li>
          </ol>
        </nav>

        {/* ── Hero (exact from CRA lines 262-275) ─────────────────────── */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isRu
              ? 'Статьи о корпоративных подарках и гравировке'
              : "Korporativ sovg'alar va gravyura haqida maqolalar"}
          </h1>
          <p className="text-xl text-gray-400">
            {isRu
              ? 'Полезные советы, гайды и кейсы от Graver.uz'
              : "Graver.uz dan foydali maslahatlar, qo'llanmalar va keyslar"}
          </p>
        </div>

        {/* ── Featured/Recommended Articles (exact from CRA lines 277-294) */}
        {featuredPosts.length > 0 && (
          <div
            className="mb-12 p-6 bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-700/30 rounded-xl"
            data-testid="featured-articles-section"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <StarIcon size={18} />
              <span className="text-teal-400">{isRu ? 'Рекомендуемые статьи' : 'Tavsiya etilgan maqolalar'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuredPosts.map((fp, idx) => (
                <Link
                  key={idx}
                  href={`/${locale}/blog/${fp.slug}`}
                  className="text-teal-400 hover:text-teal-300 transition hover:underline text-sm"
                >
                  → {fp.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Blog Hub: Popular + Categories (exact from CRA lines 296-336) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Popular */}
          <div
            className="md:col-span-2 p-6 bg-gray-900/50 border border-gray-800 rounded-xl"
            data-testid="blog-popular-section"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUpIcon size={18} />
              <span className="text-teal-500">{isRu ? 'Популярное' : 'Mashhur'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuredPosts.slice(0, 6).map((fp, idx) => (
                <Link
                  key={idx}
                  href={`/${locale}/blog/${fp.slug}`}
                  className="text-teal-400 hover:text-teal-300 transition hover:underline text-sm"
                >
                  → {fp.title}
                </Link>
              ))}
            </div>
          </div>
          {/* Categories */}
          <div
            className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl"
            data-testid="blog-categories-section"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FolderOpenIcon size={18} />
              <span className="text-teal-500">{isRu ? 'Категории' : 'Kategoriyalar'}</span>
            </h2>
            <ul className="space-y-2">
              {categories.map((cat, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{cat.name}</span>
                  <span className="text-gray-500 bg-gray-800 px-2 py-0.5 rounded text-xs">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Latest Posts (exact from CRA lines 338-360) ──────────────── */}
        <div
          className="mb-12 p-6 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl"
          data-testid="blog-latest-section"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ClockIcon size={18} />
            <span className="text-teal-500">{isRu ? 'Последние статьи' : "So'nggi maqolalar"}</span>
          </h2>
          <div className="space-y-3">
            {latestPosts.map((post, idx) => (
              <Link
                key={idx}
                href={`/${locale}/blog/${post.slug}`}
                className="flex justify-between items-center group"
              >
                <span className="text-teal-400 group-hover:text-teal-300 transition text-sm">→ {post.title}</span>
                <time className="text-gray-500 text-xs">
                  {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Quick Service Links (exact from CRA moneyHubLinks) ───────── */}
        <div className="mb-12 p-6 bg-gray-900/50 border border-gray-800 rounded-xl" data-testid="blog-money-links-section">
          <h2 className="text-lg font-bold text-white mb-4">
            {isRu ? 'Быстрый переход к услугам' : "Xizmatlarga tezkor o'tish"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {moneyHubLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-teal-400 hover:text-teal-300 transition hover:underline text-sm"
              >
                → {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── All Posts + Search (exact from CRA lines 393-530) ────────── */}
        <h2 className="text-2xl font-bold text-white mb-6">{isRu ? 'Все статьи' : 'Barcha maqolalar'}</h2>

        {/* Search bar */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <SearchIcon size={18} />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder={isRu ? 'Поиск по заголовку или описанию…' : "Sarlavha yoki tavsif bo'yicha qidirish…"}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
            aria-label={isRu ? 'Поиск статей' : 'Maqolalarni qidirish'}
          />
        </div>

        {/* Posts list */}
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {isRu ? 'Статьи не найдены' : 'Maqolalar topilmadi'}
            </p>
          </div>
        ) : (
          <div className="space-y-6" data-testid="blog-posts-list">
            {paginatedPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-teal-500/50 transition group"
                data-testid={`blog-post-card-${startIndex + index + 1}`}
              >
                {post.ogImage && (
                  <div className="relative aspect-[16/9] sm:aspect-[16/6] bg-gray-800 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.ogImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="mr-2"><CalendarIcon size={14} /></span>
                    {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    <span className="mx-2">•</span>
                    <span className="mr-1"><ClockIcon size={14} /></span>
                    {getReadTimeMinutes(post)} {isRu ? 'мин чтения' : "daq o'qish"}
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-teal-500 transition mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mb-4">{post.description}</p>
                  <span className="text-teal-500 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                    {isRu ? 'Читать' : "O'qish"}
                    <span className="ml-1"><ChevronRightIcon size={16} /></span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination (exact from CRA lines 493-520) */}
        {filteredPosts.length > POSTS_PER_PAGE && (
          <div className="mt-8 flex items-center justify-center gap-2" data-testid="blog-pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-teal-500 hover:text-teal-400 transition"
              aria-label={isRu ? 'Предыдущая страница' : 'Oldingi sahifa'}
            >
              <ChevronLeftIcon size={16} />
              <span className="ml-1">{isRu ? 'Назад' : 'Orqaga'}</span>
            </button>
            <span className="text-sm text-gray-400 px-2">
              {isRu ? `Страница ${safePage} из ${totalPages}` : `Sahifa ${safePage} / ${totalPages}`}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-teal-500 hover:text-teal-400 transition"
              aria-label={isRu ? 'Следующая страница' : 'Keyingi sahifa'}
            >
              <span className="mr-1">{isRu ? 'Вперёд' : 'Oldinga'}</span>
              <ChevronRightIcon size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
