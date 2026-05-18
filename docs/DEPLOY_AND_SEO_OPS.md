# Deploy & SEO Ops — Graver Studio

Production reliability playbook. Read before changing anything live.

## 1. How the publish chain works

```
[ Owner ]
   │  edits in /keystatic/ → Save
   ▼
[ GitHub repo: braindiggeruz/graveruz-nextjs · branch main ]
   │  webhook
   ▼
[ Cloudflare Pages: graveruz-nextjs ]
   │  runs `npm run prebuild && npm run build && opennextjs build`
   ▼
[ Cloudflare edge ]
   │  serves https://graver-studio.uz/ (RU + UZ)
```

Every save in Keystatic that touches content commits to `main`, triggers
a Cloudflare Pages deploy, and (on success) goes live in 1–3 minutes.

## 2. If "Save in Keystatic" didn’t update live

Run through this list in order. **Stop at the first thing that fails.**

1. Confirm the commit actually reached `main`:
   `https://github.com/braindiggeruz/graveruz-nextjs/commits/main`
2. Confirm the latest Cloudflare deploy is `success` and points at that commit:
   Cloudflare → Pages → graveruz-nextjs → Deployments. The top row must show your commit SHA and "Production".
3. Confirm the homepage actually reads CMS (not fallback) — load
   `https://graver-studio.uz/ru/?v=<unix-time>` to bypass cache and check the H1 text.
4. If steps 1–3 all look good but live still serves old HTML, purge the
   homepage cache safely:
   ```
   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... npm run cf:purge:home
   ```
   This **only** touches `/`, `/ru/`, `/uz/`, `/sitemap.xml`, `/robots.txt`.
5. Re-test with a fresh cache-buster.

## 3. How to check the Cloudflare deployment

- Dashboard: Cloudflare → Workers & Pages → `graveruz-nextjs` → Deployments.
- API check:
  ```bash
  curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/graveruz-nextjs/deployments?per_page=1" \
    | jq '.result[0] | {id, env: .environment, status: .latest_stage.status, sha: .deployment_trigger.metadata.commit_hash}'
  ```

## 4. How to run the smoke check

```
npm run smoke:prod
```

What it does:

- Hits every money-page on `/ru/` and `/uz/` plus two reference stories.
- Hits `/robots.txt` and `/sitemap.xml`.
- Reads `/ru/` and `/uz/` HTML and validates:
  - the CMS-driven H1 (RU: "Корпоративные подарки, welcome pack и VIP-наборы";
    UZ: "Korporativ sovg‘alar, welcome pack va VIP-to‘plamlar")
  - `<title>` is in the right language
  - `<meta description>`, `<og:title>`, `<link rel=canonical>`, hreflang ru+uz
- HEAD-checks every service-card href and every hero CTA href.
- Probes `/admin-tools/*` for 200/401 (must not 500, must not leak token).

Exit code 0 = pass (warnings allowed). Exit code 1 = fix before sending to GSC.

## 5. How to verify homepage CMS shape locally

```
npm run verify:homepage
```

Validates `content/homepage/index.yaml` against the contract the
`app/[locale]/page.tsx` renderer expects (hero / stats / services /
portfolio / FAQ / SEO RU/UZ / OG fallback chain). Wired into `prebuild`
so a broken save cannot ship to production.

## 6. How to change service-card links safely

1. `/keystatic/` → Главная → Услуги
2. Pick the service. Fill `hrefRu` and `hrefUz` — both must start with `/`
   and ideally end with `/`.
3. If the field is empty, the renderer falls back to `SERVICE_HREF_BY_ICON`
   in `app/[locale]/page.tsx`. Known fallback icons:
   `laser`, `gift`, `package`, `briefcase`, `trophy`, `star`.
4. Never use full domain URLs (e.g. `https://graver-studio.uz/...`).
5. After save → wait for Cloudflare deploy → `npm run smoke:prod` to
   confirm the new links resolve to 200.

## 7. How to send a page or story to Google Search Console

1. Open `/admin-tools/publish-checklist/?kind=page&slug=<slug>` (or
   `kind=story&loc=ru&slug=<slug>`).
2. Verdict must be **Ready for GSC** (green). If not, fix critical/high
   checks first in Keystatic.
3. Click **"GSC URL Inspection"** in the checklist; in Google Search Console
   request indexing.
4. Add the URL to `sitemap.xml` if it's not already there — `npm run smoke:prod`
   prints which money pages are present.

## 8. Things you must NEVER touch without a separate, explicit decision

- DNS records for `graver-studio.uz`.
- GitHub OAuth app or Keystatic auth secrets.
- Slugs of already-indexed pages. (Always fill `previousSlugs` first.)
- `noindex: true` on money pages or the homepage.
- Mass delete of blog/stories.
- Mass 301 / canonical changes.
- `redirects.yaml` / `public/_redirects` by hand — they are generated.

## 9. Where to look

| Need | Place |
|---|---|
| One-glance status | `/admin-tools/health/` |
| Per-story audit | `/admin-tools/stories/` |
| Pre-flight before GSC | `/admin-tools/publish-checklist/` |
| 301 mappings overview | `/admin-tools/redirects/` |
| Money-page SEO drill | `/admin-tools/seo-cockpit/` |
| Edit homepage | `/keystatic/` → Главная |
| Deploy logs | Cloudflare → Pages → graveruz-nextjs → Deployments |

## 10. Required environment variables (Cloudflare Pages production)

- `ADMIN_TOOLS_TOKEN` — encrypts admin-tools access. Without it, `/admin-tools/health/`
  shows a safe banner explaining how to set it.
- `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` — Keystatic auth.
- `KEYSTATIC_GITHUB_REPO_OWNER` / `KEYSTATIC_GITHUB_REPO_NAME` — `braindiggeruz` / `graveruz-nextjs`.
- `KEYSTATIC_SECRET` — Keystatic session signing.
- `KEYSTATIC_STORAGE` / `KEYSTATIC_URL` — Keystatic mode flags.
- `NEXT_TELEMETRY_DISABLED` — opt out of Next telemetry.
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` — client-side Keystatic UI.

To set or rotate:

```
wrangler pages secret put ADMIN_TOOLS_TOKEN --project-name graveruz-nextjs
```

Or Cloudflare Dashboard → Pages → graveruz-nextjs → Settings → Environment
variables → Production → Add → mark **Encrypt**.
