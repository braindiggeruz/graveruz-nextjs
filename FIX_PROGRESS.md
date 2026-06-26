
## Phase 2 — Cannibalization (CONTINUED, session 2)
- VERIFIED money-page cannibalization already correct in code (corporate static route RU-only + redirect to UZ CMS slug; laser CMS-only; welcome/vip/engraved are legit bilingual same-slug). NO new fix needed there.
- C-04 8-March cluster fixes:
  - FIXED broken UZ 301 targets in public/_redirects: 3 lines pointed to /uz/blog/podarki-na-8-marta-sotrudnicam/ (NO such UZ page → 404). Repointed to /uz/blog/8-martda-xodimalarga-sovgalar/ (real UZ pillar).
  - FIXED cross-locale canonicalOverride in content/blog/uz/korporativnye-podarki-na-8-marta-v-tashkente-uz.mdx (was canonicalizing UZ→RU; now → UZ pillar 8-martda-xodimalarga-sovgalar).
  - FIXED broken relatedSlug in content/blog/uz/sovgalarga-lazer-gravyurasi.mdx (typo slug → UZ pillar).
  - FIXED 3 RU canonicalOverride pointing at noindexed typo slug (sotrudnicam) → repointed to survivor sotrudnitsam.
  - RU typo file podarki-na-8-marta-sotrudnicam.mdx already noindex:true + _redirects 301 → leave.
- NEXT: T-038 hreflang orphans, then Phase 3 thin content, build, push.

## Phase 3 — Thin content (session 2, FINAL)
- 30 thin UZ stubs → noindex:true (kept in sitemap-excluded state via noindex).
- 12 high-value UZ posts REWRITTEN to full 500-980 word articles (H2 structure + FAQ + internal links, body H1 demoted to H2):
  lazer-gravirovka-sovgalar, korporativ-sovgalar-boyicha-toliq-qollanma, logotipli-sovga-toplami, vip-sovga-goyalari, b2b-hamkorlar-uchun-sovgalar-etiket-gid, it-kompaniyalar-uchun-merch-toshkent, mijoz-hamkorlar-uchun-sovgalar-vip, shaxsiylashtirish-yangi-standart-gravyura, yangi-xodimlar-uchun-welcome-pack, logotip-maketi-tayyorlash, banklar-va-fintex-uchun-sovgalar-toshkent, logotipli-soat-korporativ-sovgalar-toshkent.
- All 12 verified NOT noindex. Image optimization pass: header PNGs -> optimized JPGs + product images recompressed + ogImage frontmatter repointed.
- npx tsc --noEmit = exit 0. bun run build = exit 0.
- C-01 deliverable updated: canonical UZ corporate = /uz/toshkentda-korporativ-sovgalar/ (RU route RU-only + redirect).
