interface SchemaOrgProps {
  schema: object | object[]
}

/**
 * Injects JSON-LD schema into the page as a <script> tag.
 * Must be used inside a Server Component or page.tsx to ensure
 * it appears in the initial SSR HTML.
 */
export default function SchemaOrg({ schema }: SchemaOrgProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}

// ─── Pre-built schema factories ───────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://graver-studio.uz/#organization',
    name: 'Graver.uz',
    alternateName: ['Graver Studio', 'ГраверСтудио', 'Graver Studio Tashkent'],
    url: 'https://graver-studio.uz',
    logo: {
      '@type': 'ImageObject',
      url: 'https://graver-studio.uz/logo192.png',
      width: 192,
      height: 192,
    },
    image: 'https://graver-studio.uz/images/og/og-home.jpg',
    description:
      'Премиальная лазерная гравировка, корпоративные подарки и welcome-packs в Ташкенте. Брендирование на металле, дереве, коже, стекле и акриле. Полный цикл B2B-подарков под ключ.',
    foundingDate: '2018',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tashkent',
        addressCountry: 'UZ',
      },
    },
    areaServed: [
      { '@type': 'Country', name: 'Uzbekistan' },
      { '@type': 'City', name: 'Tashkent' },
    ],
    knowsAbout: [
      'Laser engraving',
      'Corporate gifts',
      'Branded merchandise',
      'Welcome packs',
      'Onboarding kits',
      'Premium personalised gifts',
      'B2B gifting Uzbekistan',
    ],
    sameAs: [
      'https://t.me/GraverAdm',
      'https://wa.me/998770802288',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+998770802288',
        contactType: 'customer service',
        availableLanguage: ['Russian', 'Uzbek'],
        areaServed: 'UZ',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+998974802288',
        contactType: 'sales',
        availableLanguage: ['Russian', 'Uzbek'],
        areaServed: 'UZ',
      },
    ],
  }
}

/**
 * WebSite schema — enables Sitelinks Search Box in Google SERP
 * and explicitly declares the site's primary language & in-language alternates.
 */
export function websiteSchema(locale: 'ru' | 'uz' = 'ru') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://graver-studio.uz/#website',
    url: 'https://graver-studio.uz',
    name: 'Graver.uz',
    inLanguage: locale === 'uz' ? 'uz-UZ' : 'ru-RU',
    publisher: { '@id': 'https://graver-studio.uz/#organization' },
  }
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://graver-studio.uz/#localbusiness',
    name: 'Graver.uz',
    image: 'https://graver-studio.uz/images/og/og-home.jpg',
    url: 'https://graver-studio.uz',
    telephone: '+998770802288',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Мукими, 59',
      addressLocality: 'Ташкент',
      addressCountry: 'UZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.2995,
      longitude: 69.2401,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    priceRange: '$$',
  }
}

export function articleSchema(params: {
  title: string
  description: string
  url: string
  imageUrl: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    url: params.url,
    image: params.imageUrl,
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    author: {
      '@type': 'Organization',
      name: params.author ?? 'Graver.uz',
      url: 'https://graver-studio.uz',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Graver.uz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://graver-studio.uz/logo192.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url,
    },
  }
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
