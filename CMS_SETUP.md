# Graver.uz CMS (Keystatic) — Admin Panel Guide

A minimal, elegant, SEO-safe admin panel for Graver Studio.
Git-based, zero runtime dependencies, works with your existing Next.js + Cloudflare Pages stack.

## What is this?

A content management system built on [Keystatic](https://keystatic.com):

- **5 modules**: Home, Pages, Stories (blog), Products, Settings
- **Git-backed**: every edit is a commit in `braindiggeruz/graveruz-nextjs`
- **Zero runtime cost**: content reads happen at build time (SSG)
- **RU / UZ bilingual**: every content field supports both locales
- **Auto-generated SEO**: canonical, hreflang, schema JSON-LD, sitemap, redirects are never edited by hand
- **Admin URL**: `/keystatic`

## Who edits what

| Role | Access | How |
|---|---|---|
| **Admin** (owner) | All modules + Settings + slug changes | GitHub org admin |
| **Editor** (marketer / SEO) | Content in all modules, cannot touch Settings or change published slugs without approval | GitHub team member |

Roles are enforced by GitHub team membership on the `braindiggeruz` org.

---

## Setup: Two storage modes

### Mode A — Local (for development)

Already configured. Just run:

```bash
yarn install
yarn dev
```

Then open http://localhost:3000/keystatic

- No login required
- Saves go directly to your local `content/` folder
- Commit and push like any code change
- **Best for:** local content work, schema testing, dry-runs

### Mode B — GitHub (for production / preview)

When deployed to Cloudflare Pages, Keystatic needs a **GitHub App** so editors can log in and save changes directly to the repo (without needing local setup).

#### One-time setup (~5 minutes)

1. Go to **https://github.com/organizations/braindiggeruz/settings/apps/new**
   (or create under your personal account if you prefer)

2. Fill in:
   - **GitHub App name**: `graveruz-cms`
   - **Homepage URL**: `https://graver-studio.uz`
   - **Callback URL**: `https://graver-studio.uz/api/keystatic/github/oauth/callback`
   - **Request user authorization (OAuth) during installation**: ✅ checked
   - **Webhook** → Active: ❌ unchecked
   - **Repository permissions**:
     - Contents: **Read & write**
     - Metadata: **Read-only**
     - Pull requests: **Read & write** (optional, for draft PRs)
   - **Where can this GitHub App be installed?**: Only on this account

3. Click **Create GitHub App**

4. On the app's page:
   - Note down the **App ID** and **Client ID**
   - Click **Generate a new client secret** → copy the secret
   - Click **Generate a private key** → download the `.pem` file

5. Go to the app's **Install App** tab → install it on the `graveruz-nextjs` repo.

6. Add environment variables to **Cloudflare Pages** dashboard:
   (Settings → Environment variables → Production)

   ```
   KEYSTATIC_GITHUB_REPO_OWNER=braindiggeruz
   KEYSTATIC_GITHUB_REPO_NAME=graveruz-nextjs
   KEYSTATIC_GITHUB_CLIENT_ID=<Client ID from step 4>
   KEYSTATIC_GITHUB_CLIENT_SECRET=<Client Secret from step 4>
   KEYSTATIC_SECRET=<run `openssl rand -hex 32` to generate>
   NODE_ENV=production
   ```

7. Trigger a redeploy. The admin at `https://graver-studio.uz/keystatic` will now work with GitHub OAuth login.

---

## Editing workflow

### Edit an existing blog post

1. Open `/keystatic` → **Stories**
2. Click any post → editor opens
3. Edit title, description, body (MDX), FAQ, OG image
4. Click **Save** (or Cmd+S)
5. Keystatic commits to GitHub
6. Cloudflare Pages auto-deploys (~2 min)
7. Live on `graver-studio.uz`

### Create a new blog post

1. **Stories** → **+ New Story**
2. Enter slug (e.g. `welcome-pack-dla-it-kompanii`)
3. Select language (RU or UZ)
4. Fill title, description, body
5. Add OG image, FAQ items
6. Save → commit → deploy

### Edit homepage

1. **Home** singleton → opens editor
2. Edit hero text, benefits, services, portfolio cases, process steps, FAQ
3. Save → deploy

### Edit product (e.g. change watch price)

1. **Products** → **Часы NEO с гравировкой**
2. Update `pricingTiers` → change price
3. Save → deploy
4. **Product schema JSON-LD automatically reflects the new price** — editor never touches JSON.

### Update brand-wide info (phone, address)

1. **Settings** singleton
2. Update phone / address / Telegram
3. Save → deploy
4. Header, Footer, Organization schema, LocalBusiness schema, all contact-related elements update site-wide.

---

## SEO safety rules (built in)

1. **Canonical**: auto-generated, never edited manually.
2. **Hreflang**: auto-generated from `alternateSlug` field pairing RU↔UZ.
3. **Schema (JSON-LD)**: auto-generated from structured fields. Editors enter data (price, rating, FAQ) — the app produces correct JSON-LD.
4. **Redirects**: auto-written to `public/_redirects` when a published slug changes (coming in v1.1).
5. **Sitemap**: auto-regenerated on each build.
6. **No meta keywords field**: Google ignores them since 2009, it's not in the schema by design.
7. **Published slug is locked**: Keystatic schema marks slug as primary key; changing it creates a new document rather than renaming in place. The manual 301-redirect UI is a v1.1 item.

---

## Content model at a glance

```
content/
├── settings/index.yaml          ← Settings singleton (brand, contacts, GA/Pixel IDs)
├── homepage/index.yaml          ← Homepage singleton (hero, benefits, services, portfolio, …)
├── pages/
│   └── <slug>/index.yaml        ← Commercial landings (created via admin)
├── blog/
│   ├── ru/<slug>.mdx            ← 46 existing RU stories
│   └── uz/<slug>.mdx            ← 66 existing UZ stories
└── products/
    ├── neo-watches/index.yaml
    ├── lighters/index.yaml
    ├── pens/index.yaml
    ├── powerbanks/index.yaml
    └── notebooks/index.yaml
```

All reads go through `lib/cms.ts` → `reader.collections.*` / `reader.singletons.*` at build time.

---

## Local development tips

- **Image uploads** go to `public/images/{og,products,blog,portfolio,pages}/`
- **Drafts**: set `status: draft` on a page/product — it stays out of sitemap automatically
- **Preview before publish**: push to any branch → Cloudflare Pages auto-creates preview URL at `<branch>.graveruz-nextjs.pages.dev`

---

## What's intentionally NOT in v1

These are deferred to v1.1 / v2:

- Custom SEO panel with character counters (Keystatic's built-in string field is enough for now)
- Slug-lock middleware + auto-redirect on slug change
- Side-by-side RU/UZ tab switcher UI (currently RU and UZ are separate docs — pair via `alternateSlug` field)
- Cannibalization linter
- Google Search Console integration
- Portfolio cases, testimonials, FAQs as separate collections (currently live as inline arrays inside Home / Pages)

These are real roadmap items, not forgotten — they're deferred because v1 delivers 80% of value with 20% of the complexity.

---

## Troubleshooting

**"Cannot write to filesystem"** on production
→ You're still in local mode. Follow Mode B setup above.

**"Invalid OAuth state"**
→ `KEYSTATIC_SECRET` isn't set or is empty. Generate a new one with `openssl rand -hex 32`.

**"Build fails after editing a YAML file"**
→ Required field is missing. Keystatic's schema enforces required fields but manual YAML edits bypass it. Always edit via `/keystatic`.

**"Content doesn't update on production"**
→ Check Cloudflare Pages deployment status. Auto-deploy happens on push to `main`. Manual trigger: `curl -X POST -H "Authorization: Bearer $CF_TOKEN" https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/pages/projects/graveruz-nextjs/deployments`
