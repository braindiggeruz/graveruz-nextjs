// @ts-check
/** @type {import('next').NextConfig} */

const nextConfig = {
  // ── Trailing slash ──────────────────────────────────────────────────────────
  trailingSlash: false,

  // ── Image optimization ──────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'graver-studio.uz',
      },
    ],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ── Compiler optimizations ──────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ── Bundle optimizations ────────────────────────────────────────────────────
  swcMinify: true,

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
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ]
  },

  // ── Redirects ───────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // ── Root → default locale ──────────────────────────────────────────────
      // (middleware handles this, but keep as fallback)
      {
        source: '/',
        destination: '/ru',
        permanent: false,
      },

      // ── Old URLs without locale prefix → RU ───────────────────────────────
      { source: '/blog',               destination: '/ru/blog',               permanent: true },
      { source: '/blog/:slug',         destination: '/ru/blog/:slug',         permanent: true },
      { source: '/catalog-products',   destination: '/ru/catalog-products',   permanent: true },
      { source: '/products/:path*',    destination: '/ru/products/:path*',    permanent: true },
      { source: '/engraved-gifts',     destination: '/ru/engraved-gifts',     permanent: true },
      { source: '/guarantees',         destination: '/ru/guarantees',         permanent: true },
      { source: '/contacts',           destination: '/ru/contacts',           permanent: true },
      { source: '/thanks',             destination: '/ru/thanks',             permanent: true },
      { source: '/process',            destination: '/ru/process',            permanent: true },
      { source: '/watches-with-logo',  destination: '/ru/watches-with-logo',  permanent: true },
      { source: '/lighters-engraving', destination: '/ru/lighters-engraving', permanent: true },

      // ── UZ locale slug aliases (old CRA had different UZ URL patterns) ─────
      { source: '/uz/mahsulotlar-katalogi',   destination: '/uz/catalog-products',    permanent: true },
      { source: '/uz/gravirovkali-sovgalar',  destination: '/uz/engraved-gifts',      permanent: true },
      { source: '/uz/logotipli-soat',         destination: '/uz/products/neo-watches', permanent: true },
      { source: '/uz/neo-soatlar',            destination: '/uz/products/neo-watches', permanent: true },
      { source: '/uz/neo-korporativ',         destination: '/uz/products/neo-corporate', permanent: true },
      { source: '/uz/neo-sovga',              destination: '/uz/products/neo-gift',   permanent: true },

      // ── Legacy pages that redirect to their new equivalents ───────────────
      // watches-with-logo → neo-watches product page
      { source: '/ru/watches-with-logo',      destination: '/ru/products/neo-watches', permanent: true },
      { source: '/uz/watches-with-logo',      destination: '/uz/products/neo-watches', permanent: true },
      // lighters-engraving → lighters product page
      { source: '/ru/lighters-engraving',     destination: '/ru/products/lighters',   permanent: true },
      // process → homepage (section anchor)
      { source: '/ru/process',                destination: '/ru#process',             permanent: true },
      { source: '/uz/process',                destination: '/uz#process',             permanent: true },
      // products index → catalog-products
      { source: '/ru/products',               destination: '/ru/catalog-products',    permanent: true },
      { source: '/uz/products',               destination: '/uz/catalog-products',    permanent: true },

      // ── neo-corporate and neo-gift (no dedicated pages, redirect to catalog) ──
      { source: '/ru/products/neo-corporate', destination: '/ru/catalog-products', permanent: true },
      { source: '/uz/products/neo-corporate', destination: '/uz/catalog-products', permanent: true },
      { source: '/ru/products/neo-gift',      destination: '/ru/catalog-products', permanent: true },
      { source: '/uz/products/neo-gift',      destination: '/uz/catalog-products', permanent: true },

            // ── Blog post merges (2026-03-05 SEO content remastering) ─────────────
      // Welcome Pack: 2 old articles merged into 1 case study
      {
        source: '/ru/blog/keys-welcome-pak-it-kompaniya-tashkent',
        destination: '/ru/blog/keys-welcome-pack-enps-uzbekistan',
        permanent: true,
      },
      {
        source: '/ru/blog/keys-welcome-pack-povysil-enps-v-it-kompanii',
        destination: '/ru/blog/keys-welcome-pack-enps-uzbekistan',
        permanent: true,
      },
      // 8 Marta: 2 old articles merged into 1 comprehensive guide
      {
        source: '/ru/blog/chto-podarit-kollege-na-8-marta',
        destination: '/ru/blog/podarki-8-marta-20-idej',
        permanent: true,
      },
      {
        source: '/ru/blog/podarki-na-8-marta-sotrudnicam',
        destination: '/ru/blog/podarki-8-marta-20-idej',
        permanent: true,
      },
    ]
  },

  // ── Experimental ─────────────────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
}

export default nextConfig
