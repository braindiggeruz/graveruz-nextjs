# Graver Studio — Admin Panel (CMS) PRD

**Repository:** https://github.com/braindiggeruz/graveruz-nextjs
**Live admin:** https://graver-studio.uz/keystatic/
**Stack:** Next.js 15.2.9 + Keystatic 0.5 + OpenNext + Cloudflare Pages
**Content storage:** Git-backed (local mode for dev; GitHub App mode for production editing)

## Session Log

### Session 1 (Jan 2026): Forensic SEO audit + fixes → LIVE
- 46 RU blog titles cleaned (double "| Graver.uz" duplicate brand removed)
- WebSite schema + BreadcrumbList on homepage
- robots.txt cleanup, StickyMobileCTA trailing-slash fix

### Session 2 (Jan 2026): Admin panel CMS foundation → LIVE

**Shipped:**
- **Keystatic v0.5.50 + Next v5.0.4** installed, admin at `/keystatic`
- **5 modules defined** with full TypeScript schema (keystatic.config.ts):
  1. **Home** (singleton) — hero, benefits, services, portfolio, process steps, FAQ
  2. **Pages** (collection) — commercial landings (schema ready, editor-created in admin)
  3. **Stories** (collection) — reads existing 112 MDX blog posts natively
  4. **Products** (collection) — structured pricing/reviews/FAQ → auto Product schema
  5. **Settings** (singleton) — brand, contacts, address, GA4/Pixel IDs
- **Real-data migration** from hardcoded to YAML:
  - `content/settings/index.yaml` — phones, address, Telegram, GA4, Meta Pixel
  - `content/homepage/index.yaml` — all homepage sections (6 benefits, 6 services, 6 portfolio cases, 4 process steps, 8 FAQ items, bilingual RU/UZ)
  - `content/products/{neo-watches,lighters,pens,powerbanks,notebooks}/index.yaml`
- **Pipeline proof-of-concept:** `app/[locale]/layout.tsx` now reads GA4 + Meta Pixel IDs from Settings singleton (one source of truth). Verified live: `G-Z7V0FSGE4Y` served from `content/settings/index.yaml`.
- **`lib/cms.ts`** — Keystatic reader bridge for build-time SSG consumption
- **Middleware updated** to exclude `/keystatic` and `/api/keystatic` from locale redirect
- **CMS_SETUP.md** — full GitHub App setup guide for production-mode admin editing

**Bonus fix (affects whole site, not just admin):**
- **`public/_routes.json`** — fixes pre-existing bug where all `/_next/static/chunks/*.js` and CSS returned 404 on production (OpenNext worker.js was catching static asset paths before CF ASSETS binding could serve them). Now all JS chunks return 200 `application/javascript` with 1-year immutable cache. **Benefits the entire production site's client hydration.**

**Validated live on https://graver-studio.uz:**
- `/keystatic/` → 200 OK, admin UI renders with 5-module sidebar (Home/Pages/Stories/Products/Settings)
- `/_next/static/chunks/webpack-*.js` → 200 OK (was 404 for weeks+)
- Homepage GA4 ID served from CMS
- Blog still 200 OK, title clean (from Session 1 fix)

## What WORKS right now

- **Local dev** (`yarn dev` → `localhost:3000/keystatic`): full read+write access, no auth needed
- **Production admin UI shell** at https://graver-studio.uz/keystatic/ — renders, navigation works
- **Production site performance improved** via static asset routing fix

## What needs 5 min of user setup for full production editing

The admin on production shows "Not found" for content because Keystatic config defaults to `local` storage unless GitHub App credentials are provided. This is intentional — the user must create a GitHub App once, add env vars to Cloudflare Pages, redeploy. Full instructions in `CMS_SETUP.md`.

Once that's done, editors log in with GitHub, every save becomes a commit to `braindiggeruz/graveruz-nextjs`, CF Pages auto-deploys in ~2 min.

## Content Model

```
content/
├── settings/index.yaml          [singleton]
├── homepage/index.yaml          [singleton, 6 sections migrated]
├── pages/<slug>/index.yaml      [collection, empty v1 — create via admin]
├── blog/{ru,uz}/<slug>.mdx      [collection, 112 existing MDX read natively]
└── products/<slug>/index.yaml   [collection, 5 migrated]
```

## Architecture decisions

- **Git-backed (not Sanity/Strapi/Payload):** zero runtime cost, zero external dep, works with CF Pages SSG, full audit trail via git commits
- **Keystatic local mode for dev, GitHub mode for prod:** switchable via env var, documented
- **Meta keywords field NOT included:** Google ignores since 2009, pure UI clutter
- **Schema JSON-LD auto-generated:** editors fill structured fields (price, reviews, FAQ); app produces Product/Article/FAQ schema — no raw JSON editing
- **Custom SEO panel with character counters, slug-lock middleware, RU/UZ tab-switcher UX:** deferred to v1.1 (Keystatic built-in UI is sufficient for MVP)

## Backlog (v1.1 next sessions)

### P0 — Production admin unlock
- User creates GitHub App per CMS_SETUP.md (5 min)
- User adds env vars to Cloudflare Pages (3 min)
- Redeploy → full editor workflow live

### P1 — Wire more pages to CMS
Now that Settings + Homepage content exists in YAML, the next task is to rewrite `app/[locale]/page.tsx` to consume from `getHomepage()` instead of hardcoded inline data. Same for Products page — consume from `getProduct(slug)` so pricing changes reflect instantly.

### P1 — SEO safeguards layer
- Character-counter on SEO title/description fields (custom Keystatic field component)
- Slug-lock on published docs + auto-301 redirect writer
- Pre-publish checklist modal
- Cannibalization linter

### P2 — UX polish
- Side-by-side RU/UZ tab switcher UX (currently separate docs paired via `alternateSlug`)
- Cmd+K command palette
- Recent-Edits default view (replace Keystatic's default dashboard)
- Dark theme matching site brand

### P2 — Collections that outgrew inline arrays
- Portfolio cases (when count > 15)
- Testimonials
- FAQs (when shared across 3+ pages)

## Environment notes

- Node 20+ required for local dev; CF Pages uses Node 22
- CF build command (via API): `npm run build && npx @opennextjs/cloudflare@1.17.1 build && ... && cp -r .next/static/* .open-next/assets/_next/static/ && ...`
- `.npmrc` with `legacy-peer-deps=true` required due to opennextjs peer dep conflict with Next 15.2.9
- `yarn.lock` deleted from repo; CF uses `package-lock.json` + npm install

## Contacts for future agents

- Keystatic config: `keystatic.config.ts` (single file, ~400 lines)
- Reader bridge: `lib/cms.ts`
- Admin route: `app/keystatic/[[...params]]/page.tsx` + `app/api/keystatic/[...params]/route.ts`
- Never re-add `| Graver.uz` to blog frontmatter title (Session 1 fix)
- Never touch `public/_routes.json` without understanding it fixes the Worker/static routing
