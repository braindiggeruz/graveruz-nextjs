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
    url: 'https://graver-studio.uz',
    logo: 'https://graver-studio.uz/logo192.png',
    description: 'Премиальная лазерная гравировка и брендирование для бизнеса в Ташкенте',
    sameAs: ['https://t.me/GraverAdm'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+998770802288',
      contactType: 'customer service',
      availableLanguage: ['Russian', 'Uzbek'],
    },
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
      streetAddress: 'улица Мукими',
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
