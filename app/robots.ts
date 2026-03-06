import type { MetadataRoute } from 'next'

const BASE_URL = 'https://graver-studio.uz'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/ru/thanks',
          '/uz/thanks',
          '/_next/',
          '/api/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
