# Graver.uz — Next.js Migration

**Stage 1 deliverable.** Full migration from CRA + react-snap to Next.js 14 App Router with SSG/SSR, i18n, technical SEO, and MDX blog content system.

---

## Project Structure

```
graveruz-nextjs/
├── app/
│   ├── layout.tsx                    # Root layout (minimal)
│   ├── not-found.tsx                 # Global 404
│   ├── sitemap.ts                    # Dynamic sitemap.xml (all pages + blog)
│   ├── robots.ts                     # robots.txt
│   └── [locale]/                     # Locale-prefixed routes (/ru, /uz)
│       ├── layout.tsx                # Locale layout (html lang, Header, Footer)
│       ├── page.tsx                  # Homepage
│       ├── not-found.tsx             # Locale 404
│       ├── thanks/page.tsx           # Post-form page (noindex)
│       ├── engraved-gifts/page.tsx   # Service page (SEO proof)
│       ├── catalog-products/page.tsx # Product catalog
│       ├── contacts/page.tsx         # Contacts
│       ├── guarantees/page.tsx       # Guarantees
│       ├── blog/
│       │   ├── page.tsx              # Blog index
│       │   └── [slug]/page.tsx       # Blog article (SSG, MDX)
│       └── products/
│           ├── neo-watches/page.tsx
│           ├── lighters/page.tsx
│           ├── pens/page.tsx
│           ├── powerbanks/page.tsx
│           └── notebooks/page.tsx
├── components/
│   ├── Header.tsx                    # Navigation with locale switcher
│   ├── Footer.tsx                    # Footer with contact info
│   ├── SchemaOrg.tsx                 # JSON-LD injection (LocalBusiness, Article, FAQ, Breadcrumb)
│   ├── OptimizedImage.tsx            # next/image wrapper
│   └── ProductPage.tsx               # Reusable product page template
├── lib/
│   ├── i18n.ts                       # Dictionary loader, locale helpers, getHtmlLang
│   ├── seo.ts                        # buildMetadata() — canonical, hreflang, OG
│   └── blog.ts                       # getAllPostsMeta(), getPostBySlug(), MDX parsing
├── messages/
│   ├── ru.json                       # Russian UI strings
│   └── uz.json                       # Uzbek UI strings
├── content/
│   └── blog/
│       ├── ru/                       # 65 RU MDX posts (migrated from blogPosts.js)
│       └── uz/                       # 66 UZ MDX posts (migrated from blogPosts.js)
├── scripts/
│   ├── migrate-blog.js               # CRA blogPosts.js → MDX migration script
│   └── qa-validate.js                # QA validation (60 checks)
├── middleware.ts                     # Locale detection & redirect (/ → /ru)
├── next.config.mjs                   # Images, headers, redirects, bundle opts
├── tailwind.config.ts
├── tsconfig.json
└── STAGE1_PLAN.md                    # Full execution plan document
```

---

## Key Technical Decisions

### Routing
- **App Router** with `[locale]` dynamic segment (`/ru/*`, `/uz/*`)
- **Middleware** detects locale from Accept-Language header and redirects `/` → `/ru`
- `generateStaticParams()` on every page ensures full SSG at build time

### SEO
- `buildMetadata()` in `lib/seo.ts` generates canonical URL + hreflang alternates for every page
- `SchemaOrg` component injects JSON-LD: `LocalBusiness`, `Article`, `BreadcrumbList`, `FAQPage`
- `sitemap.ts` generates dynamic XML with `alternates.languages` for all pages + 131 blog posts
- `robots.ts` blocks `/thanks`, `/_next/`, `/api/`
- `noindex` on `/thanks` pages

### Blog Content System
- All 131 blog posts migrated from `blogPosts.js` → individual `.mdx` files
- Frontmatter: `slug`, `locale`, `title`, `description`, `ogTitle`, `ogDescription`, `ogImage`, `date`, `author`, `category`, `relatedSlugs`, `faq`, `alternateSlug`
- SEO overrides from `blogSeoOverrides.js` applied to 51 posts
- `lib/blog.ts` provides `getAllPostsMeta()` and `getPostBySlug()` for SSG

### Performance
- System font stack (zero external font requests)
- `next/image` with AVIF/WebP formats
- `removeConsole` in production
- Aggressive cache headers for static assets
- `optimizePackageImports` for React

---

## Build & Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run QA validation
node scripts/qa-validate.js

# Re-run blog migration (if blogPosts.js changes)
BLOG_POSTS_FILE=/path/to/blogPosts.js node scripts/migrate-blog.js
```

---

## Build Output (Stage 1)

| Metric | Value |
|--------|-------|
| Static pages generated | **161** |
| Blog posts (RU) | **65** |
| Blog posts (UZ) | **66** |
| First Load JS (shared) | **87 kB** |
| Sitemap entries | ~160+ |
| QA checks passed | **60/60** |

---

## Stage 2 Checklist (Next Steps)

- [ ] Migrate remaining page content (portfolio, process, FAQ sections) from CRA components
- [ ] Add real images to `public/images/blog/` and `public/images/products/`
- [ ] Set up ISR (Incremental Static Regeneration) for blog pages if content updates frequently
- [ ] Configure Vercel/hosting deployment with environment variables
- [ ] Set up Google Search Console property and submit sitemap
- [ ] Implement contact form backend (API route or external service)
- [ ] Add analytics (GA4 or Plausible) with proper consent handling
- [ ] Performance audit with Lighthouse CI in CI/CD pipeline
- [ ] Set up 301 redirect mapping from old CRA URLs to new Next.js URLs
- [ ] Test hreflang with Google's Rich Results Test

---

## Environment Variables

```env
# .env.local (for production)
NEXT_PUBLIC_SITE_URL=https://graver-studio.uz
```
