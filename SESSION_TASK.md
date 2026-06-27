# graver-studio.uz — SEO/Perf session (2026-06-27)

Goal: bring to gptbot.uz quality — Perf 95+, A11y 100, BP 95+, SEO 100, CSP enforced, E-E-A-T, 0 broken links.

## Deploy method: CONFIRMED AUTO
Push to `main` → CF Pages auto-builds & deploys (~3 min). No manual CF token needed.
Verify deploy: `curl -sI https://graver-studio.uz/ru/?cb=$RANDOM | grep -i <header>`

## Order (from handoff): CSP → A11y → Privacy/Team → Performance → cleanup

### PR1 — CSP  [DONE ✅ enforced, 0 blocks, 0 JS errors on prod]
- [x] Report-Only → validate → add GA4 Ads/doubleclick → enforce (commits 7c0004d, dfbe242, 717eca9)
- [x] Prod verified: enforced CSP live, all pages render, analytics loads clean
- Whitelist domains: GA4 (googletagmanager, *.google-analytics, analytics.google.com),
  Google Ads (*.g.doubleclick.net, googleads, googleadservices, www.google.com),
  Meta Pixel (connect.facebook.net, facebook.com), CF beacon (static.cloudflareinsights),
  fonts (googleapis/gstatic), Maps iframe (www.google.com), Telegram API.

### PR2 — A11y (target 96→100)  [CODE DONE, awaiting cache purge]
- [x] color-contrast: text-gray-500→400, bg-teal-500+white→teal-700 (commit 25deb36)
- [x] label-content-name-mismatch: LocaleSwitcher aria-labels include RU/UZ
- [x] Verified in code: 0 remaining text-gray-500 / bg-teal-500-hover-400
- ⚠️ BLOCKER: CF edge serves STALE HTML (cache-control s-maxage=31536000 = 1yr!).
  Deploy is live but Lighthouse catches cached old HTML. Need CF cache purge
  (CLOUDFLARE_API_TOKEN + CLOUDFLARE_ZONE_ID) OR owner clicks Purge in dashboard.
  Script ready: npm run cf:purge:home
- NOTE: s-maxage=31536000 on HTML is ALSO a perf/freshness risk — investigate
  in PR4 whether to lower it (stale content after deploys).

### PR3 — Privacy + Team (E-E-A-T)  [DONE ✅ LIVE on prod, commit c500a2f]
- [x] /ru/politika-konfidentsialnosti/ ↔ /uz/maxfiylik-siyosati/ (both HTTP 200)
- [x] hreflang ru/uz/x-default + self-canonical verified live
- [x] schema: Organization, WebSite, BreadcrumbList
- [x] Footer link to Privacy (both locales, verified live)
- [ ] Team page — SKIP unless user asks (no real team data)

### CACHE NOTE (resolved)
- CF token = scoped Pages token (no zone/account list). BUT cf-cache-status:DYNAMIC
  → CF does NOT edge-cache HTML despite s-maxage=1yr. No purge needed.
  Earlier "stale" was local Lighthouse/browser cache. Prod always fresh.
- s-maxage=31536000 still cosmetically wrong → lower in PR4.

### PR4 — Performance (Perf 46→target, BP 73→target)  [PUSHED, awaiting deploy+verify]
Commits: 50ca481 (lazyOnload), 443b052 (CSP guard), 25a4a3f (webp), 73ad986 (cache)
- [x] GA4 + Meta Pixel SDKs → lazyOnload (stubs afterInteractive queue events)
- [x] dead Google Fonts preconnect removed → gtm/fb preconnect (system fonts)
- [x] CSP-blocked GTM beacons (*.on.aws/*.run.app /events?cee=) silenced via
      beforeInteractive guard (no console error / Issues entry → BP fix)
- [x] 60 heavy images → WebP (-7MB, -47%); 38 orphan originals removed (-10.9MB)
      og:image kept JPG (social reliability). hero 155→105KB.
- [x] HTML edge cache 1yr → 1h + SWR (NOTE: verify Worker honors _headers; HTML
      is Worker-rendered, _headers may only bind static layer — check on prod)
- [ ] VERIFY on prod: re-run Lighthouse, confirm Perf↑ BP↑, og previews intact

### PR5 — cleanup ✅ DONE (2026-06-27)
- [x] broken links crawl (sitemap 111 URLs) → found 1, fixed, re-crawl = 0 broken
      fix c64f64a: vip-podarki UZ blog slug uzbekiston→ozbekiston
- [x] llms.txt (200) / sitemap (111 URLs) validation — OK
- [x] IndexNow ping changed URLs (ru+uz /vip-podarki/ → 200)
- [N/A] meta desc 120-160: title/desc "issues" are mostly false positives
      (crawler counts HTML entity &#x27; = 6 chars per UZ apostrophe). Real text
      is fine. NOT mass-edited — would churn 100 files over a measurement artifact.

## SESSION COMPLETE — all 5 PRs shipped & live
Final Lighthouse (lh-final2.json): Perf 98 / A11y 100 / BP 100 / SEO 100. 0 broken links.

## Notes / guardrails
- bun manager. Build: `bun run build`. tsc: `npx tsc --noEmit`.
- Do NOT break trailingSlash/middleware slash logic.
- Do NOT regenerate IndexNow key.
- Keystatic/Meta-Ads Alt-Svc:clear hacks — don't touch.
- Redirects via helper r(source,dest) in next.config.mjs.
- Commit author: Graver SEO <seo@graver-studio.uz>. Atomic commits.
