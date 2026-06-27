# graver-studio.uz — SEO/Perf session (2026-06-27)

Goal: bring to gptbot.uz quality — Perf 95+, A11y 100, BP 95+, SEO 100, CSP enforced, E-E-A-T, 0 broken links.

## Deploy method: CONFIRMED AUTO
Push to `main` → CF Pages auto-builds & deploys (~3 min). No manual CF token needed.
Verify deploy: `curl -sI https://graver-studio.uz/ru/?cb=$RANDOM | grep -i <header>`

## Order (from handoff): CSP → A11y → Privacy/Team → Performance → cleanup

### PR1 — CSP  [IN PROGRESS]
- [x] Added CSP Report-Only in next.config.mjs headers() (commit 7c0004d, deployed)
- [x] Validated on prod via playwright → found GA4 Ads/doubleclick domains missing
- [x] Added doubleclick/googleads/analytics.google.com/google.com to whitelist
- [ ] Re-deploy, re-validate clean → then promote Report-Only → enforced
- Whitelist domains: GA4 (googletagmanager, *.google-analytics, analytics.google.com),
  Google Ads (*.g.doubleclick.net, googleads, googleadservices, www.google.com),
  Meta Pixel (connect.facebook.net, facebook.com), CF beacon (static.cloudflareinsights),
  fonts (googleapis/gstatic), Maps iframe (www.google.com), Telegram API.

### PR2 — A11y (target 96→100)
- [ ] color-contrast <4.5:1
- [ ] label-content-name-mismatch

### PR3 — Privacy + Team (E-E-A-T)
- [ ] /ru/politika-konfidentsialnosti/ ↔ /uz/maxfiylik-siyosati/
- [ ] Team page (optional)
- [ ] schema: [Organization, WebSite, BreadcrumbList, FAQPage] — NOT AboutPage/Person
- [ ] Footer link to Privacy

### PR4 — Performance (Perf 53, hardest)
- [ ] images webp/sizes/lazy, hero priority
- [ ] render-blocking fonts (next/font or display=swap)
- [ ] legacy-js / unused-js
- [ ] lazy Meta Pixel

### PR5 — cleanup
- [ ] meta desc 120-160
- [ ] broken links crawl (sitemap 111 URLs)
- [ ] llms.txt / sitemap validation
- [ ] IndexNow ping changed URLs

## Notes / guardrails
- bun manager. Build: `bun run build`. tsc: `npx tsc --noEmit`.
- Do NOT break trailingSlash/middleware slash logic.
- Do NOT regenerate IndexNow key.
- Keystatic/Meta-Ads Alt-Svc:clear hacks — don't touch.
- Redirects via helper r(source,dest) in next.config.mjs.
- Commit author: Graver SEO <seo@graver-studio.uz>. Atomic commits.
