# Graver Studio — SEO Audit & Implementation PRD

**Repository:** https://github.com/braindiggeruz/graveruz-nextjs
**Live:** https://graver-studio.uz
**Deploy:** Cloudflare Pages (project: `graveruz-nextjs`, production branch: `main`)
**Stack:** Next.js 15.2.9 (App Router) + OpenNext + Cloudflare Pages
**Languages:** RU (default) + UZ, trailingSlash: true

## Context
Site had undergone major SEO work in March 2026 (pillar consolidation, FAQ schema, address, OG images, guarantees/about pages). Current audit targets remaining deep issues beyond the earlier pass.

## Session: Jan 2026 — Forensic Audit Batch
### Done (c5720df, merged to main, auto-deployed)
- **Critical bug fixed**: 46 RU blog posts had `| Graver.uz` in frontmatter `title`. Combined with Next.js `%s | Graver.uz` template in locale layout, it produced `"... | Graver.uz | Graver.uz"` in meta `<title>` AND leaked the brand into H1, article card titles, breadcrumbs, and homepage blog previews. Stripped suffix from frontmatter only; layout template still appends a single brand to meta.
- **WebSite schema** added (locale-aware, Publisher-linked) → Sitelinks Search Box eligibility.
- **BreadcrumbList** added to homepage.
- **Organization** enriched with `alternateName: "Graver Studio"`.
- **robots.ts** cleaned: removed deprecated `Host:` directive; added trailing-slash variants for `/thanks`.
- **StickyMobileCTA** href fix: `/ru/contacts/` with trailing slash (eliminates per-tap 308 hop).

### Validated live on https://graver-studio.uz
- 5 JSON-LD blocks on homepage (Organization, WebSite, LocalBusiness, BreadcrumbList, FAQPage).
- Blog article `<title>` clean: `"Корпоративные подарки в Узбекистане | Graver.uz"` (single brand).
- Blog H1 clean: `"Корпоративные подарки в Узбекистане"`.
- Blog card titles on homepage clean.
- robots.txt clean, no Host directive.
- Sticky CTA link ends with `/`.

## Backlog — Next prioritized actions
### P0 (next session, highest impact)
1. **Google Search Console** — submit updated sitemap, request reindexing for the 46 blog posts with cleaned titles (CTR lift expected).
2. **Google Business Profile** — create/claim listing for Tashkent address (ул. Мукими, 59); tightly linked LocalBusiness schema is already live.

### P1 (commercial SEO strengthening)
3. **Add Product schema** with real availability/price to every product page (/products/neo-watches, /lighters, /pens, /powerbanks, /notebooks) — currently only neo-watches & lighters appear in homepage hero; schema coverage may be partial.
4. **Build 3 case-study landing pages** from existing portfolio cards (IT / bank / HoReCa). Convert portfolio section from gallery to narrative cases with outcomes → E-E-A-T + long-tail ranking.
5. **Homepage hero CTA**: change `href="#contact"` → `href="/ru/contacts/"` on secondary pages or add inline contact form on commercial pages to avoid cross-page anchor friction.

### P2 (content / architecture)
6. **Internal linking audit** — every commercial page should link to 3–5 related blog articles; every top blog article should link to 2+ commercial pages. Currently blog→service links exist but are uneven.
7. **UZ parity audit** — UZ posts count (66) > RU (46 post-consolidation). Verify hreflang pairs across all 66 UZ posts and ensure no UZ-only post is missing when RU has a strong equivalent.
8. **Image sitemap hygiene** — confirm `/image-sitemap.xml` only contains images on 200-status pages (sitemap already excludes redirected slugs).

### P3 (infra / monitoring)
9. **Lighthouse CI** on PRs (perf + SEO regressions).
10. **Add `prev`/`next` rel for paginated blog** if `/blog` gets pagination beyond 1 page.

## Architecture notes (for future agents)
- `lib/seo.ts#buildMetadata` returns `title: { absolute }`; `buildArticleMetadata` overrides with raw string to activate `%s | Graver.uz` template. **Never** re-add `| Graver.uz` to blog frontmatter `title` — the template handles it.
- `ogTitle` is intentionally allowed to carry brand (not affected by template; benefits social CTR).
- `trailingSlash: true` is canonical form site-wide. All new internal plain `<a>` tags must end with `/`.
- `middleware.ts` forces 301 `/ → /ru/` (hardcoded `Response` because OpenNext/Workers sometimes downgrade `NextResponse.redirect` status).
- Cloudflare Pages auto-deploys on `main` push (~2 min build).
