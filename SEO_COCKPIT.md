# Graver Studio — SEO Cockpit

> A protected, read-only admin dashboard at `/admin-tools/` that surfaces page health, SERP previews, language-pair status, orphan detection and a publish checklist. Editing happens in Keystatic.

---

## 1. URLs

| URL | What |
|-----|------|
| `/admin-tools/` | Landing page, status, navigation |
| `/admin-tools/seo-cockpit/` | SEO health dashboard (all pages + products) |
| `/admin-tools/seo-cockpit/?slug=<slug>` | Focus on one page with full audit |
| `/admin-tools/translate/` | RU → UZ translation workflow guide |
| `/api/admin-tools/login` | POST `{token}` → cookie. DELETE → logout |

## 2. Auth

`/admin-tools/*` is gated by a shared token stored in `ADMIN_TOOLS_TOKEN` env var (Cloudflare Pages secret).

- First visit: shows token form. POST to `/api/admin-tools/login` sets a 14-day cookie.
- `?token=<value>` in URL is **accepted** (then redirected to clear URL). Useful for sharing.
- Without `ADMIN_TOOLS_TOKEN` configured: the route returns a "configure env" message — no public exposure.
- `/admin-tools/` is also disallowed in `robots.txt` and uses `noindex` in metadata.

## 3. Checks performed

Per page (audit lives in `lib/seo-score.ts` — single source of truth):

| Check | Severity | Why |
|-------|----------|-----|
| H1 filled | critical | Primary content signal |
| SEO title 30-65 chars | critical / medium | Google truncates outside this range |
| Meta description 120-165 chars | critical / medium | Affects SERP CTR |
| OG image present | medium | Social sharing previews |
| Hero image present | low | Visual quality |
| FAQ block exists | high (money pages) | Powers schema.org FAQPage |
| CTA block exists | high (money pages) | Conversions |
| Language pair (RU↔UZ) | high | Hreflang |
| **NOT noindex when published** | critical | Money page with noindex = invisible to Google |
| ≥1 internal link out | medium | Site graph |
| Not an orphan | high | Pages with zero inbound links are invisible to Google |

Score is weighted sum (critical=25, high=15, medium=8, low=3, info=1), expressed as % → grade A/B/C/D/F.

## 4. SERP Preview

Mock Google SERP result rendered with the actual SEO title + URL + description, truncated to Google's rendering width. Helps spot:
- Title clipped past 60 chars.
- Description clipped past 158 chars.
- Empty description showing fallback.

## 5. Internal Linking Assistant

For each focused page, suggests links that are missing but typically valuable for money pages:

- `/<locale>/contacts/`
- `/<locale>/products/lighters/`
- `/<locale>/products/pens/`
- `/<locale>/products/notebooks/`
- `/<locale>/products/powerbanks/`
- `/<locale>/products/neo-watches/`

Shows current outbound internal links so operator sees what's already there.

## 6. Orphan / Inbound Links

Scans every page's CTA/button hrefs, builds an inbound-link graph, flags published pages with **zero** inbound links.

Recommended fixes:
- Add a CTA block on the homepage linking to the money page.
- Mention the page in 1-2 blog stories.
- Add to navigation (currently the codebase has hard-coded nav — see `components/Header.tsx`).

## 7. Publish Checklist (per-page)

A static, ordered checklist that mirrors the audit. Operator can use it as a visual gate before publishing.

## 8. CLI equivalent

```bash
node scripts/seo-audit.mjs           # text report, exits 1 if any published page is <60% or unsafe
node scripts/seo-audit.mjs --json    # JSON for CI integration
```

Add to GitHub Actions as a pre-merge check if desired.

## 9. Roadmap

Implemented now:
- SEO Score + grade per page
- SERP Preview
- Computed Live URL with one-click open
- Language Pair Panel with missing-pair warning
- Orphan detection (inbound link graph)
- Internal Linking Assistant suggestions
- Publish Checklist
- Image SEO snapshot (OG / hero presence)
- Products SEO mini-table (title/desc/FAQ/reviews/heroImage/pricing tiers)
- CLI audit + JSON output

Safe next sprint:
- **Sitemap sanity checker**: cross-reference `sitemap.xml` ↔ `published` pages.
- **Hreflang audit**: walk every `alternateSlug` and ensure the paired URL returns 200.
- **Schema validator**: post-build, hit each money page, parse JSON-LD, validate `Product` / `FAQPage` / `BreadcrumbList` shape.
- **Blog cannibalization dashboard**: for 139 stories — surface keyword overlaps and suggest KEEP / MERGE / 301 / NOINDEX actions.
- **Redirect manager**: UI to view/edit `previousSlugs` arrays in bulk.
- **Image SEO deeper**: detect missing alt text in markdown, image dimension warnings.

Not recommended now:
- Inline keystatic field components (would require forking @keystatic/core — too risky).
- Real-time auto-publish (would defeat the safety-by-draft model).
- Direct Google Search Console integration (requires OAuth flow and per-site verification).
