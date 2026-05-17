# Graver Studio — RU → UZ Auto-Translation

> **TL;DR**: Operator creates a Translation Job in Keystatic → GitHub Action runs Gemini translator → new UZ Draft page lands in `content/pages/<uz-slug>/index.yaml` → operator reviews & publishes.
>
> RU page is **never** overwritten. UZ page is **always** created as Draft.

---

## 1. Architecture

```
┌────────────────┐    1. create job     ┌─────────────────┐
│  Keystatic UI  │ ───────────────────► │  GitHub repo    │
│  (operator)    │     YAML commit       │  content/       │
└────────────────┘                       │   translation-  │
                                          │   jobs/<id>/    │
                                          │   index.yaml    │
                                          └────────┬────────┘
                                                   │ push event
                                                   ▼
                                          ┌─────────────────┐
                                          │ GitHub Actions  │
                                          │ translate.yml   │
                                          └────────┬────────┘
                                                   │ runs CLI
                                                   ▼
                                          ┌─────────────────┐
                                          │ Gemini API      │
                                          │ (RU → UZ Latin) │
                                          └────────┬────────┘
                                                   │ commits draft
                                                   ▼
                                          ┌─────────────────┐
                                          │ content/pages/  │
                                          │  <uz-slug>/     │
                                          │  index.yaml     │
                                          │  (status: draft)│
                                          └─────────────────┘
                                                   │ Cloudflare Pages
                                                   ▼
                                              site live
```

## 2. Files

| Path | Purpose |
|------|---------|
| `scripts/translate-page.mjs` | The CLI: read RU YAML → translate via Gemini → write UZ YAML (draft). |
| `scripts/run-translation-jobs.mjs` | Picks up pending jobs from `content/translation-jobs/` and runs the CLI for each. |
| `scripts/lib/translator-gemini.mjs` | Gemini API wrapper (REST, no SDK). |
| `scripts/lib/glossary.mjs` | RU → UZ glossary (single source of truth). |
| `scripts/lib/slugify-uz.mjs` | SEO-friendly UZ Latin slug generator. |
| `scripts/lib/yaml-io.mjs` | YAML read/write + recursive image copy. |
| `.github/workflows/translate.yml` | GitHub Action. Trigger: `workflow_dispatch` or push to `content/translation-jobs/**`. |
| `keystatic.config.ts` → `translationJobs` collection | The CMS surface — visible as "SEO-инструменты → Переводы (RU → UZ)". |

## 3. Env vars

| Var | Where | Required? |
|-----|-------|-----------|
| `GEMINI_API_KEY` | GitHub Actions secret + `.env.local` for dev | **Yes** |
| `GOOGLE_API_KEY` | Same as above (fallback name) | optional |
| `GEMINI_MODEL` | Override default `gemini-2.5-flash` | optional |
| `ADMIN_TOOLS_TOKEN` | Cloudflare Pages secret. Min 8 chars. | only for SEO Cockpit / /admin-tools/ |

### Setting up GitHub secret

```
Repo → Settings → Secrets and variables → Actions → New repository secret
Name:  GEMINI_API_KEY
Value: AIza...
```

### Setting up Cloudflare Pages secret (for admin-tools)

```
Cloudflare → Pages → graveruz-nextjs → Settings → Environment Variables
Production → Add variable → ADMIN_TOOLS_TOKEN → Type: Secret → Value: <strong-password>
```

## 4. How to translate a page

### Option A — through Keystatic (recommended)

1. Open `https://graver-studio.uz/keystatic/`.
2. Side nav → **SEO-инструменты → Переводы (RU → UZ)** → click **+** to create a new entry.
3. Fill:
   - **ID задачи**: any unique slug (e.g. `lazernaya-gravirovka-2026-03-15`).
   - **Slug исходной страницы**: e.g. `lazernaya-gravirovka-tashkent`.
   - **Статус**: leave as `Новая`.
   - All other fields can be left as default.
4. **Save**. Keystatic commits the YAML to GitHub.
5. GitHub Action `Translate Pages` picks up the new file (1-2 min), runs the translator, commits a new file `content/pages/<uz-slug>/index.yaml` with `status: draft`.
6. Cloudflare Pages auto-deploys (1-3 min).
7. Open Keystatic → **Страницы** → the new draft. Review every block.
8. Change status from `Черновик` to `Опубликовано`, save.

### Option B — manual GitHub Action

1. Open `https://github.com/braindiggeruz/graveruz-nextjs/actions/workflows/translate.yml`.
2. Click **Run workflow**.
3. Fill `source_slug` and optionally `target_slug`.
4. Click **Run workflow**. Watch the logs.
5. Result is committed back to the branch.

### Option C — local CLI (for developers)

```bash
export GEMINI_API_KEY=AIza...

# Dry run first
npm run translate:page -- --source=lazernaya-gravirovka-tashkent --dry-run

# Real run
npm run translate:page -- --source=lazernaya-gravirovka-tashkent --link-source

# Manual target slug
npm run translate:page -- \
  --source=lazernaya-gravirovka-tashkent \
  --target=toshkentda-lazer-gravyura \
  --link-source

# Re-translate (overwrite existing UZ draft)
npm run translate:page -- --source=lazernaya-gravirovka-tashkent --overwrite
```

## 5. What is translated

✅ **Yes** — H1, intro, SEO title, meta description, all block text (hero, features, image+text, FAQ, CTA, richText), all FAQ questions and answers.

❌ **No** — slugs, URLs (`ctaHref`, `buttonHref`), image paths, locale/status/noindex/icon (structural fields), brand names (`Graver Studio`, `Graver.uz`, `graver-studio.uz`, `GraverAdm`).

🔁 **Auto-converted** — `(/ru/...)` and `href="/ru/..."` inside markdown text → `(/uz/...)` (relative internal links flip to UZ locale). Image directory paths flip from `/images/pages/<ru-slug>/` to `/images/pages/<uz-slug>/`, and images are physically copied.

## 6. Glossary

See `scripts/lib/glossary.mjs`. Edit and re-run translation to get consistent UZ output:

- лазерная гравировка → lazer gravyura
- Ташкент → Toshkent
- подарки → sovg‘alar
- сувениры → suvenirlar
- бизнес-аксессуары → biznes aksessuarlari
- логотип → logotip
- макет → maket
- расчёт → hisob-kitob
- корпоративные подарки → korporativ sovg‘alar
- welcome pack → welcome pack
- powerbank → powerbank
- Получить расчёт → Hisob-kitob olish

Brand reserved (NEVER translated): `Graver Studio`, `Graver.uz`, `graver-studio.uz`, `GraverAdm`.

## 7. Safety rules

| Rule | Enforced where |
|------|----------------|
| RU source file never modified | translator only reads source unless `--link-source` (then it only touches `alternateSlug.uz/ru`) |
| UZ target always `status: draft` | hard-coded in `translate-page.mjs` |
| Overwrite requires `--overwrite` flag | hard-coded in `translate-page.mjs` |
| Target slug auto-generated as SEO-friendly UZ Latin | `scripts/lib/slugify-uz.mjs` |
| Token never logged | `translator-gemini.mjs` reads from env, never echoes |
| Translation job retains audit trail | the YAML stays in repo as record |
| Brand names preserved | system prompt + `BRAND_RESERVED` list |

## 8. Failure modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Action fails with "Missing GEMINI_API_KEY" | Repo secret not set | Add it: Repo → Settings → Secrets → Actions |
| Gemini returns 429 | Free-tier rate limit | Wait 1 minute and re-run, or upgrade tier |
| Translation looks Cyrillic | Wrong model / prompt regression | Check `GEMINI_MODEL` env, prompt in `translator-gemini.mjs` |
| Target page 404 after publish | Cloudflare deploy still running | Wait 1-3 min, check Pages dashboard |
| Hreflang missing on RU page | `--link-source` was not passed (default in workflow is true) | Manually set `alternateSlug.uz` on RU page in Keystatic |

## 9. Roadmap

- Products translation (currently MVP only supports `pages`). Schema is different (RU/UZ side-by-side) so it needs its own walker.
- Stories/blog translation (139 posts — bulk job runner with rate-limit awareness).
- Translation memory: cache translated phrases to skip re-translation of unchanged blocks on re-runs.
- Inline-link existence check: detect when `/ru/products/X/` rewrites to `/uz/products/X/` but the UZ page doesn't actually exist; tag with warning.
