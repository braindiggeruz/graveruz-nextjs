# Deployment Guide — graveruz-nextjs

## Stack
- **Framework**: Next.js 15 (App Router, SSG)
- **Adapter**: `@cloudflare/next-on-pages` (via `vercel build` + `--skip-build`)
- **Platform**: Cloudflare Pages (project: `graveruz-nextjs`)
- **Domain**: `graver-studio.uz`

## Canonical Build Path

```bash
# 1. Install dependencies
npm ci --legacy-peer-deps

# 2. Build (single command)
npm run build:cf
# Equivalent to: vercel build && npx @cloudflare/next-on-pages --skip-build
# Output: .vercel/output/static/

# 3. Deploy
npm run deploy:cf
# Equivalent to: wrangler pages deploy .vercel/output/static --project-name graveruz-nextjs
```

## Environment Variables Required

| Variable | Where | Value |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | shell / CI | Cloudflare API token with Pages:Edit |
| `NEXT_TELEMETRY_DISABLED` | `.dev.vars` / CI | `1` |

## ⚠️ What NOT to Use

| Tool | Why Banned |
|---|---|
| `@opennextjs/cloudflare` | Fails with `Invalid alias name` (esbuild 0.25.x breaking change). **Removed from package.json.** |
| `@cloudflare/next-on-pages` without `vercel build` | Requires `.vercel/output` to exist first |
| `next build` alone | Does not produce Cloudflare Pages-compatible output |
| `wrangler deploy` (Workers) | Wrong target — this is a Pages project, not a Worker |

## Smoke Test After Deploy

```bash
# Run after every deploy to verify production
node scripts/smoke-test.js
```

Checks: HTTP 200 on all key routes, correct titles, hreflang count, canonical, schema.org, robots.txt, sitemap.

## Build Artifacts

The following directories are **gitignored** and must never be committed:
- `.open-next/` — opennextjs build output (obsolete)
- `.vercel/` — vercel/next-on-pages build output
- `.wrangler/` — wrangler cache
- `.next/` — Next.js build cache

## Cloudflare Pages Config

| Setting | Value |
|---|---|
| Project name | `graveruz-nextjs` |
| Build command | `npm ci --legacy-peer-deps && npm run build:cf` |
| Build output dir | `.vercel/output/static` |
| Node.js version | 22 |
| Custom domain | `graver-studio.uz` |
# Build: npm run build && npx opennextjs-cloudflare build
