import { config, fields, collection, singleton } from '@keystatic/core'

/**
 * Graver Studio CMS — Keystatic config
 *
 * Storage mode:
 *   - NODE_ENV=development → local (writes to filesystem)
 *   - Production → github (requires GITHUB_APP_* env vars)
 *
 * Modules (5 total):
 *   1. Home         — singleton (hero + all homepage blocks)
 *   2. Pages        — collection (commercial landings, trust, about)
 *   3. Stories      — collection (blog, reads existing MDX)
 *   4. Products     — collection (with structured pricing/reviews → auto-schema)
 *   5. Settings     — singleton (brand, contacts, schema-critical data)
 */

const isProd = process.env.NODE_ENV === 'production'

/** Locale enum used across the schema */
const LOCALES = [
  { label: 'Русский', value: 'ru' },
  { label: "O'zbek", value: 'uz' },
] as const

/** Reusable SEO block — the one SEO sidebar for every doc */
const seoFields = fields.object(
  {
    title: fields.text({
      label: 'SEO Title',
      description: 'Appears in Google search results. Keep under 60 characters.',
      validation: { length: { min: 1, max: 120 } },
    }),
    description: fields.text({
      label: 'Meta Description',
      description: 'Your one-line sales pitch in Google. Aim for 120-160 characters.',
      multiline: true,
      validation: { length: { min: 1, max: 320 } },
    }),
    ogImage: fields.image({
      label: 'Social Preview Image (1200×630)',
      description: 'Preview when shared on Telegram, Facebook, etc. Falls back to default.',
      directory: 'public/images/og',
      publicPath: '/images/og/',
    }),
    noindex: fields.checkbox({
      label: 'Hide from Google',
      description: 'Only for thank-you pages, duplicates, staging. Never for commercial pages.',
      defaultValue: false,
    }),
  },
  { label: 'SEO' }
)

/** Reusable FAQ item */
const faqItem = fields.object({
  questionRu: fields.text({ label: 'Question (RU)' }),
  questionUz: fields.text({ label: 'Question (UZ)' }),
  answerRu: fields.text({ label: 'Answer (RU)', multiline: true }),
  answerUz: fields.text({ label: 'Answer (UZ)', multiline: true }),
})

/** Reusable bilingual text pair */
const bilingualText = (label: string, multiline = false) =>
  fields.object({
    ru: fields.text({ label: `${label} (RU)`, multiline }),
    uz: fields.text({ label: `${label} (UZ)`, multiline }),
  })

/** Icon picker — curated set from lucide-react (matches site icon style) */
const iconPicker = fields.select({
  label: 'Icon',
  options: [
    { label: '✓ Check', value: 'check' },
    { label: '▦ Grid', value: 'grid' },
    { label: '⏱ Clock', value: 'clock' },
    { label: '⚡ Lightning', value: 'zap' },
    { label: '✨ Sparkles', value: 'sparkles' },
    { label: '👥 Team', value: 'users' },
    { label: '🎁 Gift', value: 'gift' },
    { label: '📦 Package', value: 'package' },
    { label: '💼 Briefcase', value: 'briefcase' },
    { label: '⭐ Star', value: 'star' },
    { label: '🏆 Trophy', value: 'trophy' },
    { label: '✦ Laser', value: 'laser' },
  ],
  defaultValue: 'check',
})

// ─── 1. SETTINGS (singleton) ─────────────────────────────────────────
const settings = singleton({
  label: 'Settings',
  path: 'content/settings/',
  format: { data: 'yaml' },
  schema: {
    brandName: fields.text({ label: 'Brand Name', defaultValue: 'Graver.uz' }),
    brandAlternateName: fields.text({ label: 'Alternate Brand Name', defaultValue: 'Graver Studio' }),
    tagline: bilingualText('Tagline'),

    phone1: fields.text({ label: 'Primary Phone', defaultValue: '+998770802288' }),
    phone1Display: fields.text({ label: 'Primary Phone (Display)', defaultValue: '+998 77 080 22 88' }),
    phone2: fields.text({ label: 'Secondary Phone', defaultValue: '+998974802288' }),
    phone2Display: fields.text({ label: 'Secondary Phone (Display)', defaultValue: '+998 97 480 22 88' }),
    telegram: fields.text({ label: 'Telegram Handle', defaultValue: '@GraverAdm' }),
    telegramUrl: fields.url({ label: 'Telegram URL', defaultValue: 'https://t.me/GraverAdm' }),
    whatsapp: fields.url({ label: 'WhatsApp URL', defaultValue: 'https://wa.me/998770802288' }),
    email: fields.text({ label: 'Email' }),

    addressStreet: fields.text({ label: 'Street Address', defaultValue: 'ул. Мукими, 59' }),
    addressCity: fields.text({ label: 'City', defaultValue: 'Ташкент' }),
    addressCountry: fields.text({ label: 'Country Code (ISO 2)', defaultValue: 'UZ' }),
    geoLat: fields.number({ label: 'Latitude', defaultValue: 41.2995 }),
    geoLng: fields.number({ label: 'Longitude', defaultValue: 69.2401 }),

    openingHoursLabel: bilingualText('Opening Hours Label'),
    requests247Label: bilingualText('24/7 Label'),

    defaultOgImage: fields.image({
      label: 'Default Social Image',
      directory: 'public/images/og',
      publicPath: '/images/og/',
    }),

    ga4Id: fields.text({ label: 'Google Analytics 4 ID', defaultValue: 'G-Z7V0FSGE4Y' }),
    metaPixelId: fields.text({ label: 'Meta Pixel ID', defaultValue: '1358428289305229' }),

    sameAs: fields.array(fields.url({ label: 'Social URL' }), {
      label: 'Social / External Profile URLs',
      itemLabel: (p) => p.value ?? '',
    }),
  },
})

// ─── 2. HOMEPAGE (singleton) ────────────────────────────────────────
const homepage = singleton({
  label: 'Home',
  path: 'content/homepage/',
  format: { data: 'yaml' },
  schema: {
    hero: fields.object(
      {
        badgeRu: fields.text({ label: 'Badge (RU)' }),
        badgeUz: fields.text({ label: 'Badge (UZ)' }),
        titleRu: fields.text({ label: 'Title (RU)' }),
        titleUz: fields.text({ label: 'Title (UZ)' }),
        titleAccentRu: fields.text({ label: 'Title Accent (RU)' }),
        titleAccentUz: fields.text({ label: 'Title Accent (UZ)' }),
        subtitleRu: fields.text({ label: 'Subtitle (RU)', multiline: true }),
        subtitleUz: fields.text({ label: 'Subtitle (UZ)', multiline: true }),
        ctaPrimaryRu: fields.text({ label: 'Primary CTA (RU)', defaultValue: 'Запросить расчёт' }),
        ctaPrimaryUz: fields.text({ label: 'Primary CTA (UZ)', defaultValue: "Narx so'rash" }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: 'Value' }),
            labelRu: fields.text({ label: 'Label (RU)' }),
            labelUz: fields.text({ label: 'Label (UZ)' }),
          }),
          { label: 'Stats', itemLabel: (p) => p.fields.value.value }
        ),
      },
      { label: 'Hero' }
    ),

    benefits: fields.array(
      fields.object({
        icon: iconPicker,
        titleRu: fields.text({ label: 'Title (RU)' }),
        titleUz: fields.text({ label: 'Title (UZ)' }),
        descriptionRu: fields.text({ label: 'Description (RU)', multiline: true }),
        descriptionUz: fields.text({ label: 'Description (UZ)', multiline: true }),
      }),
      { label: 'Benefits', itemLabel: (p) => p.fields.titleRu.value }
    ),

    services: fields.array(
      fields.object({
        icon: iconPicker,
        titleRu: fields.text({ label: 'Title (RU)' }),
        titleUz: fields.text({ label: 'Title (UZ)' }),
        descriptionRu: fields.text({ label: 'Description (RU)', multiline: true }),
        descriptionUz: fields.text({ label: 'Description (UZ)', multiline: true }),
      }),
      { label: 'Services', itemLabel: (p) => p.fields.titleRu.value }
    ),

    portfolio: fields.array(
      fields.object({
        image: fields.image({
          label: 'Image',
          directory: 'public/images/portfolio',
          publicPath: '/images/portfolio/',
        }),
        categoryRu: fields.text({ label: 'Category (RU)' }),
        categoryUz: fields.text({ label: 'Category (UZ)' }),
        titleRu: fields.text({ label: 'Title (RU)' }),
        titleUz: fields.text({ label: 'Title (UZ)' }),
        descriptionRu: fields.text({ label: 'Description (RU)', multiline: true }),
        descriptionUz: fields.text({ label: 'Description (UZ)', multiline: true }),
        materialRu: fields.text({ label: 'Material (RU)' }),
        materialUz: fields.text({ label: 'Material (UZ)' }),
        applicationRu: fields.text({ label: 'Application (RU)' }),
        applicationUz: fields.text({ label: 'Application (UZ)' }),
      }),
      { label: 'Portfolio Cases', itemLabel: (p) => p.fields.titleRu.value }
    ),

    processSteps: fields.array(
      fields.object({
        step: fields.text({ label: 'Step Number' }),
        titleRu: fields.text({ label: 'Title (RU)' }),
        titleUz: fields.text({ label: 'Title (UZ)' }),
        descriptionRu: fields.text({ label: 'Description (RU)', multiline: true }),
        descriptionUz: fields.text({ label: 'Description (UZ)', multiline: true }),
      }),
      { label: 'Process Steps', itemLabel: (p) => `${p.fields.step.value}. ${p.fields.titleRu.value}` }
    ),

    faq: fields.array(faqItem, {
      label: 'FAQ',
      itemLabel: (p) => p.fields.questionRu.value,
    }),

    seo: seoFields,
  },
})

// ─── 3. PAGES (collection: commercial landings) ─────────────────────
const pages = collection({
  label: 'Pages',
  slugField: 'slug',
  path: 'content/pages/*/',
  format: { data: 'yaml', contentField: 'body' },
  schema: {
    slug: fields.slug({
      name: {
        label: 'Internal name',
        description: 'For admin only. Public slug is derived below.',
      },
    }),
    locale: fields.select({
      label: 'Language',
      options: LOCALES as any,
      defaultValue: 'ru',
    }),
    status: fields.select({
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    }),
    h1: fields.text({ label: 'H1 Heading' }),
    intro: fields.text({ label: 'Intro Paragraph', multiline: true }),
    heroImage: fields.image({
      label: 'Hero Image',
      directory: 'public/images/pages',
      publicPath: '/images/pages/',
    }),
    body: fields.mdx({
      label: 'Body',
      options: {
        image: {
          directory: 'public/images/pages',
          publicPath: '/images/pages/',
        },
      },
    }),
    faq: fields.array(
      fields.object({
        q: fields.text({ label: 'Question' }),
        a: fields.text({ label: 'Answer', multiline: true }),
      }),
      { label: 'FAQ', itemLabel: (p) => p.fields.q.value }
    ),
    seo: seoFields,
  },
})

// ─── 4. STORIES (blog — reads existing MDX) ─────────────────────────
const stories = collection({
  label: 'Stories',
  slugField: 'slug',
  path: 'content/blog/*/*',
  format: { contentField: 'content' },
  columns: ['title', 'date'],
  schema: {
    slug: fields.slug({
      name: { label: 'Slug' },
    }),
    locale: fields.select({
      label: 'Language',
      options: LOCALES as any,
      defaultValue: 'ru',
    }),
    title: fields.text({
      label: 'Title',
      validation: { length: { min: 1 } },
    }),
    description: fields.text({
      label: 'Description',
      multiline: true,
    }),
    ogTitle: fields.text({ label: 'OG Title (optional)' }),
    ogDescription: fields.text({ label: 'OG Description (optional)', multiline: true }),
    ogImage: fields.text({ label: 'OG Image path' }),
    date: fields.text({ label: 'Publication Date (ISO)' }),
    author: fields.text({ label: 'Author', defaultValue: 'Graver.uz' }),
    category: fields.text({ label: 'Category' }),
    tags: fields.array(fields.text({ label: 'Tag' }), {
      label: 'Tags',
      itemLabel: (p) => p.value,
    }),
    relatedSlugs: fields.array(fields.text({ label: 'Related slug' }), {
      label: 'Related Articles',
      itemLabel: (p) => p.value,
    }),
    alternateSlug: fields.object({
      ru: fields.text({ label: 'RU counterpart slug' }),
      uz: fields.text({ label: 'UZ counterpart slug' }),
    }),
    faq: fields.array(
      fields.object({
        q: fields.text({ label: 'Question' }),
        a: fields.text({ label: 'Answer', multiline: true }),
      }),
      { label: 'FAQ', itemLabel: (p) => p.fields.q.value }
    ),
    noindex: fields.checkbox({ label: 'Hide from Google', defaultValue: false }),
    canonicalOverride: fields.text({ label: 'Canonical Override (advanced)' }),
    content: fields.mdx({
      label: 'Content',
      options: {
        image: {
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        },
      },
    }),
  },
})

// ─── 5. PRODUCTS (collection with auto-schema generation) ────────────
const products = collection({
  label: 'Products',
  slugField: 'slug',
  path: 'content/products/*/',
  format: { data: 'yaml' },
  columns: ['nameRu'],
  schema: {
    slug: fields.slug({ name: { label: 'Slug (URL segment)' } }),
    status: fields.select({
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    }),
    nameRu: fields.text({ label: 'Name (RU)' }),
    nameUz: fields.text({ label: 'Name (UZ)' }),
    descriptionRu: fields.text({ label: 'Description (RU)', multiline: true }),
    descriptionUz: fields.text({ label: 'Description (UZ)', multiline: true }),
    heroImage: fields.image({
      label: 'Hero Image',
      directory: 'public/images/products',
      publicPath: '/images/products/',
    }),
    gallery: fields.array(
      fields.image({
        label: 'Image',
        directory: 'public/images/products',
        publicPath: '/images/products/',
      }),
      { label: 'Gallery', itemLabel: (p) => (typeof p.value === 'string' ? p.value : 'Image') }
    ),
    featuresRu: fields.array(fields.text({ label: 'Feature (RU)' }), {
      label: 'Features (RU)',
      itemLabel: (p) => p.value,
    }),
    featuresUz: fields.array(fields.text({ label: 'Feature (UZ)' }), {
      label: 'Features (UZ)',
      itemLabel: (p) => p.value,
    }),
    pricingTiers: fields.array(
      fields.object({
        nameRu: fields.text({ label: 'Tier Name (RU)' }),
        nameUz: fields.text({ label: 'Tier Name (UZ)' }),
        price: fields.number({ label: 'Price (numeric, in UZS)' }),
        priceDisplay: fields.text({ label: 'Price (Display)' }),
        descRu: fields.text({ label: 'Description (RU)' }),
        descUz: fields.text({ label: 'Description (UZ)' }),
        highlight: fields.checkbox({ label: 'Highlight', defaultValue: false }),
      }),
      { label: 'Pricing Tiers', itemLabel: (p) => p.fields.nameRu.value }
    ),
    brand: fields.text({ label: 'Brand' }),
    availability: fields.select({
      label: 'Availability',
      options: [
        { label: 'In Stock', value: 'InStock' },
        { label: 'Pre Order', value: 'PreOrder' },
        { label: 'Out of Stock', value: 'OutOfStock' },
      ],
      defaultValue: 'InStock',
    }),
    minBatchSize: fields.number({ label: 'Minimum Order Quantity' }),
    aggregateRating: fields.object({
      value: fields.text({ label: 'Rating value (e.g. 4.9)' }),
      count: fields.text({ label: 'Review count (e.g. 47)' }),
    }),
    reviews: fields.array(
      fields.object({
        authorName: fields.text({ label: 'Author / Company' }),
        rating: fields.number({ label: 'Rating (1-5)' }),
        textRu: fields.text({ label: 'Text (RU)', multiline: true }),
        textUz: fields.text({ label: 'Text (UZ)', multiline: true }),
      }),
      { label: 'Reviews', itemLabel: (p) => p.fields.authorName.value }
    ),
    faq: fields.array(
      fields.object({
        qRu: fields.text({ label: 'Question (RU)' }),
        qUz: fields.text({ label: 'Question (UZ)' }),
        aRu: fields.text({ label: 'Answer (RU)', multiline: true }),
        aUz: fields.text({ label: 'Answer (UZ)', multiline: true }),
      }),
      { label: 'FAQ', itemLabel: (p) => p.fields.qRu.value }
    ),
    processStepsRu: fields.array(fields.text({ label: 'Step (RU)' }), {
      label: 'Process Steps (RU)',
      itemLabel: (p) => p.value,
    }),
    processStepsUz: fields.array(fields.text({ label: 'Step (UZ)' }), {
      label: 'Process Steps (UZ)',
      itemLabel: (p) => p.value,
    }),
    trustBadgesRu: fields.array(fields.text({ label: 'Badge (RU)' }), {
      label: 'Trust Badges (RU)',
      itemLabel: (p) => p.value,
    }),
    trustBadgesUz: fields.array(fields.text({ label: 'Badge (UZ)' }), {
      label: 'Trust Badges (UZ)',
      itemLabel: (p) => p.value,
    }),
    seo: seoFields,
  },
})

// ─── CONFIG ─────────────────────────────────────────────────────────
// Storage mode: always GitHub when deployed (CF Workers filesystem is read-only,
// local mode only useful via `yarn dev` locally).
// Env vars KEYSTATIC_GITHUB_CLIENT_ID/CLIENT_SECRET/SECRET must be set at runtime.
const useGithub =
  process.env.KEYSTATIC_STORAGE === 'github' ||
  Boolean(process.env.CF_PAGES) ||
  Boolean(process.env.CLOUDFLARE_ENV) ||
  Boolean(process.env.KEYSTATIC_GITHUB_FORCE)

export default config({
  storage: useGithub
    ? {
        kind: 'github',
        repo: {
          owner: 'braindiggeruz',
          name: 'graveruz-nextjs',
        },
      }
    : {
        kind: 'local',
      },
  ui: {
    brand: { name: 'Graver.uz CMS' },
    navigation: {
      Content: ['homepage', 'pages', 'stories', 'products'],
      System: ['settings'],
    },
  },
  singletons: { settings, homepage },
  collections: { pages, stories, products },
})
