import { BLOG_IMAGE_ENTRIES } from './blog-images'

const BASE = 'https://graver-studio.uz'

function abs(path: string) {
  return path.startsWith('http') ? path : `${BASE}${path}`
}

function xmlEscape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface ImageEntry {
  loc: string
  images: { url: string; title: string; caption?: string }[]
}

// ── Static page image map ─────────────────────────────────────────────────────
const STATIC_ENTRIES: {
  paths: string[]
  images: { url: string; title: string; caption?: string }[]
}[] = [
  {
    paths: ['/ru/', '/uz/'],
    images: [
      {
        url: '/images/og/og-home.jpg',
        title: 'Graver.uz — Корпоративные подарки с гравировкой в Ташкенте',
        caption: 'Лазерная гравировка корпоративных подарков. Ташкент, Узбекистан.',
      },
    ],
  },
  {
    paths: ['/ru/products/neo-watches/', '/uz/products/neo-watches/'],
    images: [
      {
        url: '/images/og/og-neo-watches.jpg',
        title: 'Часы NEO с гравировкой логотипа — корпоративный подарок',
        caption: 'Премиальные наручные часы NEO с лазерной гравировкой. Тираж от 10 шт.',
      },
      { url: '/images/products/neo-watch-hero.jpg', title: 'NEO Watch Hero — часы с гравировкой' },
      { url: '/images/products/neo-watch-automatic.jpg', title: 'NEO Watch Automatic — автоматические часы с гравировкой' },
      { url: '/images/products/neo-watch-quartz.jpg', title: 'NEO Watch Quartz — кварцевые часы с гравировкой' },
      { url: '/images/products/neo/neo-watch-black-gold.jpg', title: 'NEO часы Black Gold — корпоративный подарок' },
      { url: '/images/products/neo/neo-watch-black-silver.jpg', title: 'NEO часы Black Silver — корпоративный подарок' },
      { url: '/images/products/neo/neo-watch-white-gold.jpg', title: 'NEO часы White Gold — корпоративный подарок' },
      { url: '/images/products/neo/neo-watch-white-silver.jpg', title: 'NEO часы White Silver — корпоративный подарок' },
    ],
  },
  {
    paths: ['/ru/products/lighters/', '/uz/products/lighters/'],
    images: [
      {
        url: '/images/og/og-lighters.jpg',
        title: 'Зажигалки с гравировкой логотипа — корпоративный подарок',
        caption: 'Зажигалки с лазерной гравировкой. Тираж от 10 шт.',
      },
      { url: '/images/products/lighters/r109_silver_gloss.jpg', title: 'Зажигалка R109 Silver Gloss с гравировкой' },
      { url: '/images/products/lighters/r110_black_matte.jpg', title: 'Зажигалка R110 Black Matte с гравировкой' },
      { url: '/images/products/lighters/r111_black_texture.jpg', title: 'Зажигалка R111 Black Texture с гравировкой' },
      { url: '/images/products/lighters/r112_brushed_steel.jpg', title: 'Зажигалка R112 Brushed Steel с гравировкой' },
    ],
  },
  {
    paths: ['/ru/catalog-products/', '/uz/catalog-products/'],
    images: [
      {
        url: '/images/og/og-catalog.jpg',
        title: 'Каталог корпоративных подарков с гравировкой — Graver.uz',
        caption: 'Полный каталог: часы, зажигалки, ручки, повербанки, блокноты.',
      },
    ],
  },
  {
    paths: ['/ru/blog/', '/uz/blog/'],
    images: [
      {
        url: '/images/og/og-blog.jpg',
        title: 'Блог Graver.uz — корпоративные подарки и гравировка',
        caption: 'Статьи о корпоративных подарках, гравировке и B2B-маркетинге.',
      },
    ],
  },
]

// ── Build XML ─────────────────────────────────────────────────────────────────
function buildXml(entries: ImageEntry[]): string {
  const rows = entries
    .map(({ loc, images }) => {
      const imgTags = images
        .map(({ url, title, caption }) => {
          const captionTag = caption
            ? `\n      <image:caption>${xmlEscape(caption)}</image:caption>`
            : ''
          return `    <image:image>
      <image:loc>${xmlEscape(abs(url))}</image:loc>
      <image:title>${xmlEscape(title)}</image:title>${captionTag}
    </image:image>`
        })
        .join('\n')
      return `  <url>
    <loc>${xmlEscape(loc)}</loc>
${imgTags}
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${rows}
</urlset>`
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET() {
  const entries: ImageEntry[] = []

  // Static pages — all paths already include trailing slash (required by next.config trailingSlash: true)
  for (const { paths, images } of STATIC_ENTRIES) {
    for (const path of paths) {
      // Enforce trailing slash: every <loc> must match the canonical URL served by the site
      const canonicalPath = path.endsWith('/') ? path : `${path}/`
      entries.push({ loc: `${BASE}${canonicalPath}`, images })
    }
  }

  // Blog articles (statically embedded — CF Worker safe)
  // Enforce trailing slash on all blog loc entries
  for (const { loc, img, title, caption } of BLOG_IMAGE_ENTRIES) {
    const canonicalLoc = loc.endsWith('/') ? loc : `${loc}/`
    entries.push({
      loc: canonicalLoc,
      images: [{ url: img, title, caption }],
    })
  }

  const xml = buildXml(entries)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
