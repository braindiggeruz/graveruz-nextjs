// @ts-check
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

/** @type {import('next').NextConfig} */

// Setup OpenNext Cloudflare dev platform in development
initOpenNextCloudflareForDev()

// Helper: generate both /slug and /slug/ variants to avoid double-hop with trailingSlash:true
function r(source, destination) {
  return [
    { source, destination: `${destination}/`, permanent: true },
    { source: `${source}/`, destination: `${destination}/`, permanent: true },
  ]
}

const nextConfig = {
  // ── Trailing slash ──────────────────────────────────────────────────────────
  // trailingSlash: true ensures all URLs end with / (canonical form)
  // Fixes 194 GSC errors: "Страница с переадресацией" caused by 308 redirects
  trailingSlash: true,

  // ── Image optimization ──────────────────────────────────────────────────────
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'graver-studio.uz',
      },
    ],
  },

  // ── Compiler optimizations ──────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ── Headers ─────────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // ── Redirects ───────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // ── Root → default locale (301, not 302) ──────────────────────────────
      { source: '/', destination: '/ru/', permanent: true },

      // ── Old URLs without locale prefix → RU ───────────────────────────────
      ...r('/blog',               '/ru/blog'),
      ...r('/catalog-products',   '/ru/catalog-products'),
      ...r('/engraved-gifts',     '/ru/engraved-gifts'),
      ...r('/guarantees',         '/ru/guarantees'),
      ...r('/contacts',           '/ru/contacts'),
      ...r('/thanks',             '/ru/thanks'),
      // Collapsed double-hop: /watches-with-logo -> /ru/watches-with-logo -> /ru/products/neo-watches
      ...r('/watches-with-logo',  '/ru/products/neo-watches'),
      // Collapsed double-hop: /lighters-engraving -> /ru/lighters-engraving -> /ru/products/lighters
      ...r('/lighters-engraving', '/ru/products/lighters'),
      { source: '/blog/:slug',      destination: '/ru/blog/:slug/',      permanent: true },
      { source: '/blog/:slug/',     destination: '/ru/blog/:slug/',      permanent: true },
      { source: '/products/:path*', destination: '/ru/products/:path*/', permanent: true },

      // ── UZ locale slug aliases ─────────────────────────────────────────────
      ...r('/uz/mahsulotlar-katalogi',  '/uz/catalog-products'),
      ...r('/uz/gravirovkali-sovgalar', '/uz/engraved-gifts'),
      ...r('/uz/logotipli-soat',        '/uz/products/neo-watches'),
      ...r('/uz/neo-soatlar',           '/uz/products/neo-watches'),
      // Collapsed double-hop: /uz/neo-korporativ -> /uz/products/neo-corporate -> /uz/catalog-products
      ...r('/uz/neo-korporativ',        '/uz/catalog-products'),
      // Collapsed double-hop: /uz/neo-sovga -> /uz/products/neo-gift -> /uz/catalog-products
      ...r('/uz/neo-sovga',             '/uz/catalog-products'),

      // ── Legacy pages → new equivalents ────────────────────────────────────
      ...r('/ru/watches-with-logo',      '/ru/products/neo-watches'),
      ...r('/uz/watches-with-logo',      '/uz/products/neo-watches'),
      ...r('/ru/lighters-engraving',     '/ru/products/lighters'),
      ...r('/ru/process',                '/ru'),
      ...r('/uz/process',                '/uz'),
      ...r('/ru/products',               '/ru/catalog-products'),
      ...r('/uz/products',               '/uz/catalog-products'),
      ...r('/ru/catalog',                '/ru/catalog-products'),
      ...r('/uz/catalog',                '/uz/catalog-products'),
      ...r('/catalog',                   '/ru/catalog-products'),

      // ── neo-corporate and neo-gift → catalog ──────────────────────────────
      ...r('/ru/products/neo-corporate', '/ru/catalog-products'),
      ...r('/uz/products/neo-corporate', '/uz/catalog-products'),
      ...r('/ru/products/neo-gift',      '/ru/catalog-products'),
      ...r('/uz/products/neo-gift',      '/uz/catalog-products'),

      // ── Unknown locale prefixes ────────────────────────────────────────────
      { source: '/en',        destination: '/ru/',        permanent: true },
      { source: '/en/:path*', destination: '/ru/:path*/', permanent: true },
      { source: '/fr',        destination: '/ru/',        permanent: true },
      { source: '/fr/:path*', destination: '/ru/:path*/', permanent: true },
      { source: '/de',        destination: '/ru/',        permanent: true },
      { source: '/de/:path*', destination: '/ru/:path*/', permanent: true },
      { source: '/kk',        destination: '/uz/',        permanent: true },
      { source: '/kk/:path*', destination: '/uz/:path*/', permanent: true },

      // ── Services → homepage ────────────────────────────────────────────────
      ...r('/ru/services', '/ru'),
      ...r('/uz/services', '/uz'),
      ...r('/services',    '/ru'),

      // ── Blog post merges (with and without trailing slash) ─────────────────
      ...r('/ru/blog/keys-welcome-pak-it-kompaniya-tashkent',         '/ru/blog/keys-welcome-pack-enps-uzbekistan'),
      ...r('/ru/blog/keys-welcome-pack-povysil-enps-v-it-kompanii',   '/ru/blog/keys-welcome-pack-enps-uzbekistan'),
      ...r('/ru/blog/chto-podarit-kollege-na-8-marta',                '/ru/blog/podarki-8-marta-20-idej'),
      ...r('/ru/blog/podarki-na-8-marta-sotrudnicam',                 '/ru/blog/podarki-8-marta-20-idej'),

      // ── Additional old CRA slugs → 404 fix ────────────────────────────────
      ...r('/ru/blog/banklar-va-fintex-uchun-sovgalar-toshkent',      '/ru/blog/podarki-dlya-bankov-i-finteha-tashkent'),
      ...r('/ru/blog/welcome-pack-dlya-sotrudnikov-2024',             '/ru/blog/welcome-pack-dlya-sotrudnikov'),
      ...r('/ru/blog/korporativnye-podarki-dlya-klientov',            '/ru/blog/korporativnye-podarki-uzbekistan'),
      ...r('/ru/blog/podarki-na-8-marta-v-tashkente',                 '/ru/blog/podarki-8-marta-20-idej'),
      ...r('/ru/blog/podarki-na-novyj-god-2025',                      '/ru/blog/top-idei-podarkov-na-novyj-god'),
      ...r('/ru/blog/gravirovka-na-chashkah',                         '/ru/blog/korporativnye-podarki-uzbekistan'),
      ...r('/ru/blog/gravirovka-na-ruczkah',                          '/ru/blog/korporativnye-podarki-s-gravirovkoy-metody'),
      ...r('/ru/blog/gravirovka-na-zajigalkah',                       '/ru/blog/korporativnye-podarki-s-gravirovkoy-metody'),
      ...r('/ru/blog/gravirovka-na-bloknotah',                        '/ru/blog/korporativnye-podarki-s-gravirovkoy-metody'),
      ...r('/ru/blog/gravirovka-na-poverbanikah',                     '/ru/blog/korporativnye-podarki-s-gravirovkoy-metody'),
      ...r('/ru/blog/gravirovka-na-chashkah-2',                       '/ru/blog/korporativnye-podarki-uzbekistan'),
      ...r('/ru/blog/gravirovka-na-ruczkah-2',                        '/ru/blog/korporativnye-podarki-s-gravirovkoy-metody'),
      ...r('/ru/blog/gravirovka-na-zajigalkah-2',                     '/ru/blog/korporativnye-podarki-s-gravirovkoy-metody'),

      // ── New commercial pages without locale prefix ─────────────────────────
      ...r('/korporativnye-podarki', '/ru/korporativnye-podarki'),
      ...r('/welcome-packs',         '/ru/welcome-packs'),
      ...r('/vip-podarki',           '/ru/vip-podarki'),
    ]
  },

  // ── Experimental ─────────────────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
}

export default nextConfig
