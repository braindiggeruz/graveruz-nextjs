# Graver Studio — Admin Panel (CMS) PRD

**Repository:** https://github.com/braindiggeruz/graveruz-nextjs
**Live admin:** https://graver-studio.uz/keystatic/
**Stack:** Next.js 15.2.9 + Keystatic 0.5.50 + OpenNext + Cloudflare Pages
**Content storage:** Git-backed (local mode for dev; GitHub App mode for production editing)

## Session Log

### Session 1 (Jan 2026): Forensic SEO audit + fixes → LIVE
- 46 RU blog titles cleaned (double "| Graver.uz" duplicate brand removed)
- WebSite schema + BreadcrumbList on homepage
- robots.txt cleanup, StickyMobileCTA trailing-slash fix

### Session 2 (Jan 2026): Admin panel CMS foundation → LIVE
- Keystatic v0.5.50 + Next 5.0.4 installed; admin at `/keystatic`
- 5 modules defined (Home, Pages, Stories, Products, Settings)
- Real-data migration from hardcoded → YAML for homepage/products/settings
- `lib/cms.ts` reader bridge for SSG
- Middleware excludes `/keystatic` + `/api/keystatic`
- `public/_routes.json` fix — restored `/_next/static/chunks/*.js` 200 responses

### Session 3 (Feb 2026): Wave 2 + Wave 3 → READY TO DEPLOY

**Wave 2 — Production OAuth editing (FIXED):**
- `app/api/keystatic/[...params]/route.ts` rewritten with `export const dynamic = 'force-dynamic'` + `export const runtime = 'nodejs'`. Removes the build-time env evaluation crash on Cloudflare Pages.
- `npm run build` now succeeds end-to-end. The route appears as `ƒ /api/keystatic/[...params]` (Dynamic) in the build output — the correct mode for runtime env-var injection.

**Wave 3 — Block builder + slug-change SEO safety (SHIPPED):**
- **Pages collection** in `keystatic.config.ts` rewired to a 6-block visual builder via `fields.conditional()`:
  1. Hero (badge, title, subtitle, image, CTA)
  2. Rich Text (MDX)
  3. Features Grid (icon + title + description, array)
  4. Image + Text (left/right side switcher)
  5. CTA Banner
  6. FAQ
- **`components/PageBlocks.tsx`** — server component that renders all 6 block types with brutalist styling matching the site theme. Uses `lucide-react` icons (12 curated icons via `iconPicker`).
- **`app/[locale]/[slug]/page.tsx`** — dynamic CMS page route. Pulls from Keystatic, generates SSG at build time. Reserves the static folder slugs (`about`, `blog`, `products`, etc.) so they take precedence over dynamic CMS pages. Auto-emits `breadcrumbSchema` + `faqSchema` JSON-LD from any FAQ block on the page.
- **Slug-change auto-301 redirects** — added `previousSlugs` array field to **pages**, **products**, and **stories** collections. `scripts/generate-redirects.mjs` runs as `prebuild` and writes managed `# === BEGIN/END AUTO-GENERATED CMS REDIRECTS ===` block into `public/_redirects`. Per-collection routing:
  - Pages: `/{locale}/{old}/  → /{locale}/{new}/`
  - Products: `/{locale}/products/{old}/  → /{locale}/products/{new}/`
  - Stories: `/{locale}/blog/{old}/  → /{locale}/blog/{new}/`
- **RU/UZ pair linking** — added `alternateSlug` (RU/UZ) field to pages collection. Used by both renderer (`hreflang`) and `app/sitemap.ts` (locale alternates for CMS pages).
- **`app/sitemap.ts`** now async; reads CMS pages via `getAllPages()` and emits canonical + hreflang entries (skips noindex and reserved slugs).
- **`lib/cms.ts`** — fixed shadowing bug where `data.slug` (from schema field) overrode the directory-name slug returned by `list()`. Spread order corrected.

## What WORKS right now

- **Build:** `npm run build` exits 0; route map shows `ƒ /api/keystatic/[...params]`, `ƒ /keystatic/[[...params]]`, plus a working dynamic `● /[locale]/[slug]` (verified with a temp test page).
- **Dev mode:** `npm run dev` → `localhost:3000/keystatic` — read+write, no auth needed.
- **Production admin shell** at https://graver-studio.uz/keystatic/ — UI renders.
- **Slug-change SEO:** any editor edit to `previousSlugs` → next build emits 301 redirects in `_redirects`.
- **Sitemap:** auto-includes CMS pages.

## Setup needed once for live editing (on the user's side)

User must create a GitHub App (per `seo_work/repo/CMS_SETUP.md`), set the env vars `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` in Cloudflare Pages → Variables → Production, then redeploy. From that moment forward, every admin save becomes a commit.

## Content Model

```
content/
├── settings/index.yaml          [singleton]
├── homepage/index.yaml          [singleton, 6 sections migrated]
├── pages/<slug>/index.yaml      [collection — block-builder, alternateSlug, previousSlugs]
├── blog/{ru,uz}/<slug>.mdx      [collection, 112 existing MDX read natively]
└── products/<slug>/index.yaml   [collection, 5 migrated]
```

Each collection now supports:
- `previousSlugs[]` — auto 301 emitted at build time
- `alternateSlug{ru,uz}` — RU/UZ pair linking (pages, stories)

## Architecture decisions

- **Git-backed (not Sanity/Strapi/Payload):** zero runtime cost
- **Keystatic local for dev / GitHub for prod:** switchable
- **Block-builder with 6 reusable blocks:** editors compose pages without touching code
- **Auto-301 from `previousSlugs[]`:** SEO-safe slug changes; no manual `_redirects` edits
- **Sitemap reads CMS pages:** newly published commercial landings are crawled
- **Schema JSON-LD auto-generated:** Product, Article, FAQ, Breadcrumb

## Backlog

### P1 — More SEO safeguards (deferred this session)
- Custom Keystatic SEO field with live character counter (Title 60ch / Desc 160ch). Requires a Keystatic component plugin — non-trivial; not blocking.
- Pre-publish checklist modal
- Cannibalization linter (warn when two pages target the same query)

### P1 — Pair UI indicator
- Show a visual "missing translation" badge in Keystatic admin when `alternateSlug.uz` empty. Requires custom Keystatic field component.

### P2 — UX polish
- Cmd+K command palette
- Recent-Edits default view
- Dark theme matching site brand

### P2 — Collections that outgrew inline arrays
- Portfolio cases (when count > 15)
- Testimonials (when shared across pages)

## Environment notes

- Node 20+ for local dev; CF Pages uses Node 22
- CF build command: `npm run build && npx @opennextjs/cloudflare@1.17.1 build && cp -r .next/static/* .open-next/assets/_next/static/ && ...`
- `.npmrc` with `legacy-peer-deps=true` due to opennextjs peer dep conflict
- `yarn.lock` MUST stay deleted; build uses npm + `package-lock.json`
- Hot warning `[TypeError: Cannot read properties of undefined (reading 'os')]` from Next.js's lockfile-patcher is a known Next 15.2.9 issue — does not affect output

## Contacts for future agents

- Keystatic config: `keystatic.config.ts` (single file, ~600 lines after Wave 3)
- Reader bridge: `lib/cms.ts`
- Block renderer: `components/PageBlocks.tsx`
- CMS page route: `app/[locale]/[slug]/page.tsx`
- Redirects script: `scripts/generate-redirects.mjs` (runs in `prebuild`)
- Admin route: `app/keystatic/[[...params]]/page.tsx` + `app/api/keystatic/[...params]/route.ts`
- Never re-add `| Graver.uz` to blog frontmatter title (Session 1 fix)
- Never touch `public/_routes.json` (Session 2 fix)
- Never edit `# === BEGIN/END AUTO-GENERATED CMS REDIRECTS ===` block manually (Session 3 fix)
