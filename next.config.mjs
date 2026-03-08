// @ts-check
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

/** @type {import('next').NextConfig} */

// Setup OpenNext Cloudflare dev platform in development
initOpenNextCloudflareForDev()

const nextConfig = {
  // ── Cloudflare Pages compatibility ─────────────────────────────────────────
  // next-on-pages requires edge runtime for dynamic routes
  // Static pages (SSG) work without this

  // ── Trailing slash ──────────────────────────────────────────────────────────
  trailingSlash: false,

  // ── Image optimization ──────────────────────────────────────────────────────
  images: {
    // Cloudflare Pages: use unoptimized images (no server-side image processing)
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
      // ── Root → default locale ──────────────────────────────────────────────
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

      // ── UZ locale slug aliases ─────────────────────────────────────────────
      { source: '/uz/mahsulotlar-katalogi',   destination: '/uz/catalog-products',     permanent: true },
      { source: '/uz/gravirovkali-sovgalar',  destination: '/uz/engraved-gifts',       permanent: true },
      { source: '/uz/logotipli-soat',         destination: '/uz/products/neo-watches', permanent: true },
      { source: '/uz/neo-soatlar',            destination: '/uz/products/neo-watches', permanent: true },
      { source: '/uz/neo-korporativ',         destination: '/uz/products/neo-corporate', permanent: true },
      { source: '/uz/neo-sovga',              destination: '/uz/products/neo-gift',    permanent: true },

      // ── Legacy pages → new equivalents ────────────────────────────────────
      { source: '/ru/watches-with-logo',      destination: '/ru/products/neo-watches', permanent: true },
      { source: '/uz/watches-with-logo',      destination: '/uz/products/neo-watches', permanent: true },
      { source: '/ru/lighters-engraving',     destination: '/ru/products/lighters',   permanent: true },
      { source: '/ru/process',                destination: '/ru',                      permanent: true },
      { source: '/uz/process',                destination: '/uz',                      permanent: true },
      { source: '/ru/products',               destination: '/ru/catalog-products',    permanent: true },
      { source: '/uz/products',               destination: '/uz/catalog-products',    permanent: true },
      { source: '/ru/catalog',                destination: '/ru/catalog-products',    permanent: true },
      { source: '/uz/catalog',                destination: '/uz/catalog-products',    permanent: true },
      { source: '/catalog',                   destination: '/ru/catalog-products',    permanent: true },

      // ── neo-corporate and neo-gift → catalog ──────────────────────────────
      { source: '/ru/products/neo-corporate', destination: '/ru/catalog-products', permanent: true },
      { source: '/uz/products/neo-corporate', destination: '/uz/catalog-products', permanent: true },
      { source: '/ru/products/neo-gift',      destination: '/ru/catalog-products', permanent: true },
      { source: '/uz/products/neo-gift',      destination: '/uz/catalog-products', permanent: true },

      // ── Unknown locale prefixes → prevent /en → /ru/en → 404 chain ──────────
      { source: '/en',        destination: '/ru',        permanent: true },
      { source: '/en/:path*', destination: '/ru/:path*', permanent: true },
      { source: '/fr',        destination: '/ru',        permanent: true },
      { source: '/fr/:path*', destination: '/ru/:path*', permanent: true },
      { source: '/de',        destination: '/ru',        permanent: true },
      { source: '/de/:path*', destination: '/ru/:path*', permanent: true },
      { source: '/kk',        destination: '/uz',        permanent: true },
      { source: '/kk/:path*', destination: '/uz/:path*', permanent: true },

      // ── Services → homepage (no separate /services page exists) ──────────────────────────────
      { source: '/ru/services', destination: '/ru', permanent: true },
      { source: '/uz/services', destination: '/uz', permanent: true },
      { source: '/services',    destination: '/ru', permanent: true },

      // ── Blog post merges ───────────────────────────────────────────────────
      { source: '/ru/blog/keys-welcome-pak-it-kompaniya-tashkent',    destination: '/ru/blog/keys-welcome-pack-enps-uzbekistan', permanent: true },
      { source: '/ru/blog/keys-welcome-pack-povysil-enps-v-it-kompanii', destination: '/ru/blog/keys-welcome-pack-enps-uzbekistan', permanent: true },
      { source: '/ru/blog/chto-podarit-kollege-na-8-marta',           destination: '/ru/blog/podarki-8-marta-20-idej', permanent: true },
      { source: '/ru/blog/podarki-na-8-marta-sotrudnicam',            destination: '/ru/blog/podarki-8-marta-20-idej', permanent: true },
    ]
  },

  // ── Experimental ─────────────────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
}

export default nextConfig
