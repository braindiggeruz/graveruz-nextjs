# Stage 1 — Execution Plan: graver-studio.uz → Next.js Migration

**Role:** Principal Migration Engineer + Technical SEO Recovery Lead + Senior Next.js Architect + Web Performance Engineer  
**Date:** March 6, 2026  
**Status:** Implementation-ready

---

## 1. Executive Implementation Decision

### What I am building first

A brand-new Next.js 14 (App Router) project that replaces the current CRA + react-snap stack entirely. The first deliverable is a clean, locale-aware foundation with SSG/SSR rendering, a unified SEO head system, and a file-based MDX content model for the blog. The first proof of correctness is a `curl` test against the homepage and one blog article that returns full HTML — not a shell.

### What I am NOT touching

- The existing `frontend/` CRA codebase. It is **read-only reference material** from this point forward.
- The `postbuild-react-snap.js`, `postbuild-inject-seo-meta.js`, and all related post-build scripts. They are deleted from scope.
- The `blogPosts.js` monolith. It will be parsed by a one-time migration script; the file itself is never imported into the new project.
- The `workers/prerender` Cloudflare Worker. It is a workaround for a problem that Next.js solves natively.

### Why this is the correct recovery path

The dossier confirms a **total indexability failure**: production serves an empty HTML shell to all crawlers. No amount of patching the CRA pipeline fixes the root cause — CSR is architecturally incompatible with a content-heavy, SEO-dependent site. Next.js with App Router solves every P0/P1 issue by design: SSG/SSR rendering, native `<head>` metadata API, built-in i18n routing, and proper 404 status codes. The ROI is the restoration of the site's entire organic search presence from near-zero.

---

## 2. Migration Strategy

### Target Architecture

| Dimension | Decision |
|---|---|
| Framework | Next.js 14 (latest stable) |
| Router | App Router (`app/`) |
| Rendering | SSG for all pages; SSR reserved for future dynamic features |
| Styling | Tailwind CSS (mirrors existing stack) |
| Language | TypeScript (strict mode off initially for migration speed) |
| Deployment target | Vercel (staging) → Cloudflare Pages (production) |

### App Structure

```
graveruz-nextjs/
├── app/
│   ├── [locale]/                  # /ru and /uz
│   │   ├── layout.tsx             # locale-aware root layout
│   │   ├── page.tsx               # homepage
│   │   ├── blog/
│   │   │   ├── page.tsx           # blog index
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # blog article
│   │   ├── catalog-products/page.tsx
│   │   ├── products/
│   │   │   ├── neo-watches/page.tsx
│   │   │   ├── lighters/page.tsx
│   │   │   ├── pens/page.tsx
│   │   │   ├── powerbanks/page.tsx
│   │   │   └── notebooks/page.tsx
│   │   ├── engraved-gifts/page.tsx
│   │   ├── guarantees/page.tsx
│   │   ├── contacts/page.tsx
│   │   ├── thanks/page.tsx        # noindex
│   │   └── not-found.tsx          # locale 404
│   ├── not-found.tsx              # global 404 (returns 404 status)
│   ├── sitemap.ts                 # dynamic sitemap generation
│   ├── robots.ts                  # robots.txt generation
│   └── layout.tsx                 # root layout (html/body)
├── components/
│   ├── SeoHead.tsx                # canonical + hreflang + OG
│   ├── SchemaOrg.tsx              # JSON-LD injection
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── blog/
│       ├── BlogCard.tsx
│       └── RelatedArticles.tsx
├── content/
│   └── blog/
│       ├── ru/                    # {slug}.mdx
│       └── uz/                    # {slug}.mdx
├── lib/
│   ├── i18n.ts                    # locale dictionaries loader
│   ├── blog.ts                    # MDX content helpers
│   └── seo.ts                     # metadata builder helpers
├── messages/
│   ├── ru.json                    # UI translations
│   └── uz.json
├── public/
│   └── images/                    # migrated from old public/
├── next.config.ts
├── middleware.ts                  # locale redirect (/ → /ru)
└── scripts/
    └── migrate-blog.js            # one-time CRA→MDX migration script
```

### Locale Routing

- Supported locales: `ru` (default), `uz`
- URL pattern: `/ru/...` and `/uz/...`
- Root `/` redirects to `/ru` via `middleware.ts`
- `next.config.ts` does **not** use the legacy `i18n` key (App Router handles this via the `[locale]` segment)
- `generateStaticParams` at the `[locale]` level exports `['ru', 'uz']`

### Blog / Content Model

Each article is a standalone `.mdx` file with YAML frontmatter:

```mdx
---
slug: "kak-vybrat-korporativnyj-podarok"
locale: "ru"
title: "Как выбрать корпоративный подарок для сотрудников — Graver.uz"
description: "..."
ogTitle: "..."
ogDescription: "..."
ogImage: "/images/blog/kak-vybrat-korporativnyj-podarok.jpg"
date: "2026-01-15"
author: "Graver.uz"
alternateSlug:              # slug of the UZ counterpart (if exists)
  uz: "korporativ-sovgalar-qanday-tanlash"
relatedSlugs:
  - "lazernaya-gravirovka-podarkov"
  - "podarochnye-nabory-s-logotipom"
faq:
  - q: "..."
    a: "..."
---

Article body in Markdown/MDX...
```

### Metadata Model

All metadata is generated server-side via Next.js `generateMetadata()` in each `page.tsx`. The `SeoHead` component is used only for hreflang link tags (which cannot be set via `generateMetadata`). This ensures:

- `<title>` is in SSR HTML
- `<meta name="description">` is in SSR HTML
- `<link rel="canonical">` is self-referencing, generated from `locale + slug`
- `<link rel="alternate" hreflang="...">` is reciprocal

### Sitemap / hreflang Model

`app/sitemap.ts` reads all MDX files at build time and generates entries with:
- `url`: absolute URL per locale
- `alternates.languages`: `{ ru: '...', uz: '...' }` for hreflang
- `lastModified`: from frontmatter `date`

### Redirect Preservation Strategy

All redirects from the old `_redirects` file are migrated into `next.config.ts` → `redirects()` as 301s. Pattern: old CRA URL → new Next.js URL. No URL structure changes for existing valid pages.

---

## 3. Implementation Phases

### Phase 1: Next.js Foundation (Batch 1)

| Item | Detail |
|---|---|
| **Objective** | Clean new project exists, locale routing works, base layout renders |
| **Tasks** | `create-next-app`, Tailwind setup, `[locale]` segment, `middleware.ts`, root layout, Header/Footer shell, i18n message files |
| **Dependencies** | None |
| **Success Criteria** | `npm run build` succeeds; `curl /ru` returns `<html>` with `<title>` |
| **Validation** | `curl -s http://localhost:3000/ru \| grep '<title>'` returns non-empty |

### Phase 2: SSR/SSG Proof (Batch 2)

| Item | Detail |
|---|---|
| **Objective** | Homepage + one service page + one blog article template render full HTML |
| **Tasks** | `app/[locale]/page.tsx` (homepage), `app/[locale]/engraved-gifts/page.tsx`, `app/[locale]/blog/[slug]/page.tsx` with one sample MDX article, `generateMetadata()` for all three |
| **Dependencies** | Phase 1 complete |
| **Success Criteria** | `curl` returns `<title>`, `<meta name="description">`, `<link rel="canonical">`, full `<body>` content |
| **Validation** | `curl -s http://localhost:3000/ru/blog/lazernaya-gravirovka-podarkov \| grep -E 'canonical\|title\|description'` |

### Phase 3: Blog Content Migration (Batch 3)

| Item | Detail |
|---|---|
| **Objective** | All 135+ blog articles exist as MDX files with correct frontmatter |
| **Tasks** | `scripts/migrate-blog.js` parses `blogPosts.js` + `blogSeoOverrides.js`, outputs `.mdx` files; `generateStaticParams` builds all blog routes |
| **Dependencies** | Phase 2 complete (blog template proven) |
| **Success Criteria** | `find content/blog -name '*.mdx' \| wc -l` ≥ 135; all slugs resolve with 200 |
| **Validation** | `npm run build` completes without errors; spot-check 5 articles with `curl` |

### Phase 4: Technical SEO Layer (Batch 4)

| Item | Detail |
|---|---|
| **Objective** | All P0/P1 SEO issues from dossier resolved |
| **Tasks** | Self-referencing canonical per page, reciprocal hreflang, `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx` (returns 404), `SchemaOrg.tsx` (Organization + LocalBusiness + Article JSON-LD), redirect map in `next.config.ts`, `/thanks` noindex |
| **Dependencies** | Phase 3 complete |
| **Success Criteria** | Sitemap contains all pages with hreflang; `curl -I /nonexistent` returns 404; canonical is self-referencing on all pages |
| **Validation** | `curl -s http://localhost:3000/sitemap.xml \| grep hreflang`; `curl -I http://localhost:3000/nonexistent-page` |

### Phase 5: Performance Stabilization (Batch 5)

| Item | Detail |
|---|---|
| **Objective** | Core Web Vitals baseline meets Googlebot expectations |
| **Tasks** | `next/image` for all images, `next/font` for fonts, third-party scripts via `next/script` with `strategy="afterInteractive"`, bundle analysis |
| **Dependencies** | Phase 4 complete |
| **Success Criteria** | LCP < 3s on mobile (PageSpeed); no render-blocking resources in critical path |
| **Validation** | `next build` bundle report; PageSpeed Insights on staging URL |

### Phase 6: QA & Rollout Readiness (Batch 6)

| Item | Detail |
|---|---|
| **Objective** | Staging site passes all validation gates before DNS cutover |
| **Tasks** | URL parity check (all old URLs resolve), canonical audit, hreflang audit, sitemap validation, robots.txt validation, 404 behavior, internal link audit, schema validation |
| **Dependencies** | Phase 5 complete |
| **Success Criteria** | Zero P0/P1 issues in audit; all critical URLs return 200 or correct 301 |
| **Validation** | Automated URL check script; Google Rich Results Test on 3 article pages |

---

## 4. First Batch

**Batch 1 contains:**

1. `npx create-next-app@latest graveruz-nextjs` with TypeScript, Tailwind, App Router
2. `middleware.ts` — redirects `/` → `/ru`, validates locale
3. `app/layout.tsx` — root HTML shell
4. `app/[locale]/layout.tsx` — locale-aware layout with Header + Footer
5. `components/Header.tsx` — navigation shell (locale-aware links)
6. `components/Footer.tsx` — footer shell
7. `messages/ru.json` + `messages/uz.json` — UI string dictionaries
8. `lib/i18n.ts` — dictionary loader
9. `next.config.ts` — trailing slash, image domains, redirect stubs
10. `app/[locale]/page.tsx` — homepage stub (SSG, with `generateMetadata`)

**Why this first?** Without a working locale-aware foundation, nothing else can be built. This batch establishes the structural contract that all subsequent pages depend on. It also immediately proves that the new system renders server-side HTML — the single most important validation gate.
