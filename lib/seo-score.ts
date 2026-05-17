/**
 * Shared SEO-Score logic — used by both the build-time CLI auditor
 * (scripts/seo-audit.mjs) AND the server-rendered admin dashboard
 * (app/admin-tools/seo-cockpit/page.tsx).
 *
 * One source of truth for what "ready to rank" means at Graver Studio.
 */

export type CheckSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export interface SeoCheck {
  id: string
  label: string
  pass: boolean
  severity: CheckSeverity
  detail?: string
  /** SEO best-practice rationale shown on hover */
  why?: string
}

export interface PageAuditInput {
  slug: string
  locale: 'ru' | 'uz'
  status: 'draft' | 'published'
  h1?: string
  intro?: string
  heroImage?: string
  seoTitle?: string
  seoDescription?: string
  seoOgImage?: string
  seoNoindex?: boolean
  alternateRu?: string
  alternateUz?: string
  hasFaq?: boolean
  hasCta?: boolean
  internalLinkHrefs?: string[]
  /** All slugs of other pages in the same locale (for orphan detection) */
  knownPageSlugs?: string[]
  /** Slugs that already link to this page (orphan = none) */
  inboundLinkSlugs?: string[]
}

const TITLE_MIN = 30
const TITLE_MAX = 65
const DESC_MIN = 120
const DESC_MAX = 165

export function auditPage(p: PageAuditInput): SeoCheck[] {
  const checks: SeoCheck[] = []
  const isPublished = p.status === 'published'
  const isMoneyPage = !!p.h1 // any CMS-managed page counts

  // ── Critical SEO basics ────────────────────────────────────────
  checks.push({
    id: 'h1',
    label: 'H1 заполнен',
    pass: !!p.h1 && p.h1.trim().length > 0,
    severity: 'critical',
    detail: p.h1 || '— пусто —',
    why: 'H1 — главный сигнал страницы для Google и пользователя. Без H1 Google берёт случайный текст.',
  })

  checks.push({
    id: 'seo_title',
    label: `SEO Title заполнен (${TITLE_MIN}-${TITLE_MAX} символов)`,
    pass: !!p.seoTitle && p.seoTitle.length >= TITLE_MIN && p.seoTitle.length <= TITLE_MAX,
    severity: !p.seoTitle ? 'critical' : 'medium',
    detail: p.seoTitle
      ? `${p.seoTitle.length} символов: ${p.seoTitle}`
      : '— пусто —',
    why: `Цель: ${TITLE_MIN}-${TITLE_MAX}. Меньше — Google добавит хвост, больше — обрежет в выдаче.`,
  })

  checks.push({
    id: 'seo_description',
    label: `Meta Description заполнено (${DESC_MIN}-${DESC_MAX} символов)`,
    pass: !!p.seoDescription && p.seoDescription.length >= DESC_MIN && p.seoDescription.length <= DESC_MAX,
    severity: !p.seoDescription ? 'critical' : 'medium',
    detail: p.seoDescription
      ? `${p.seoDescription.length} символов`
      : '— пусто —',
    why: `Цель: ${DESC_MIN}-${DESC_MAX}. Описание формирует CTR в выдаче.`,
  })

  checks.push({
    id: 'og_image',
    label: 'Картинка для соцсетей (OG)',
    pass: !!p.seoOgImage,
    severity: 'medium',
    detail: p.seoOgImage || 'будет использован дефолтный из Настроек',
    why: 'OG-картинка определяет, как страница выглядит при шеринге в Telegram / Facebook.',
  })

  checks.push({
    id: 'hero_image',
    label: 'Главная картинка страницы',
    pass: !!p.heroImage,
    severity: 'low',
    detail: p.heroImage || '— пусто —',
  })

  // ── Money-page commercial fields ───────────────────────────────
  if (isMoneyPage) {
    checks.push({
      id: 'has_faq',
      label: 'FAQ-блок присутствует',
      pass: !!p.hasFaq,
      severity: 'high',
      why: 'FAQ-блок генерирует schema.org FAQPage, который Google показывает прямо в выдаче.',
    })
    checks.push({
      id: 'has_cta',
      label: 'CTA-блок присутствует',
      pass: !!p.hasCta,
      severity: 'high',
      why: 'Без CTA-кнопки коммерческая страница теряет конверсии.',
    })
  }

  // ── Language pair ──────────────────────────────────────────────
  const otherLocale = p.locale === 'ru' ? 'uz' : 'ru'
  const pairedSlug = p.locale === 'ru' ? p.alternateUz : p.alternateRu
  checks.push({
    id: 'language_pair',
    label: `Языковая пара (${p.locale} ↔ ${otherLocale})`,
    pass: !!pairedSlug,
    severity: 'high',
    detail: pairedSlug ? `paired with /${otherLocale}/${pairedSlug}/` : '— пары нет —',
    why: 'Без пары Google не свяжет RU и UZ страницы → hreflang не работает.',
  })

  // ── Noindex sanity ─────────────────────────────────────────────
  const dangerousNoindex = isPublished && !!p.seoNoindex
  checks.push({
    id: 'noindex_sanity',
    label: 'Страница НЕ скрыта от Google (если опубликована)',
    pass: !dangerousNoindex,
    severity: dangerousNoindex ? 'critical' : 'info',
    detail: dangerousNoindex
      ? '⚠ ОПУБЛИКОВАННАЯ страница имеет noindex=true — Google не индексирует её!'
      : 'OK',
    why: 'Опубликованная коммерческая страница с noindex = деньги в трубу.',
  })

  // ── Internal linking ──────────────────────────────────────────
  const internalCount = (p.internalLinkHrefs || []).filter((h) => h.startsWith('/') && !h.startsWith('//')).length
  checks.push({
    id: 'internal_links_out',
    label: 'Есть внутренние ссылки (≥1)',
    pass: internalCount >= 1,
    severity: internalCount === 0 ? 'medium' : 'info',
    detail: `${internalCount} внутренних ссылок в CTA/блоках`,
    why: 'Внутренняя перелинковка помогает Google понять структуру сайта и распределяет вес.',
  })

  if (p.knownPageSlugs && p.inboundLinkSlugs !== undefined) {
    checks.push({
      id: 'orphan',
      label: 'Страница не сирота (есть входящие ссылки)',
      pass: p.inboundLinkSlugs.length > 0,
      severity: p.inboundLinkSlugs.length === 0 ? 'high' : 'info',
      detail:
        p.inboundLinkSlugs.length > 0
          ? `Входящих: ${p.inboundLinkSlugs.length} (${p.inboundLinkSlugs.slice(0, 3).join(', ')}${p.inboundLinkSlugs.length > 3 ? '…' : ''})`
          : 'Никто не ссылается — страница orphan. Добавь ссылку из главной, блога или связанной money page.',
    })
  }

  return checks
}

const WEIGHTS: Record<CheckSeverity, number> = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
  info: 1,
}

export function scorePage(checks: SeoCheck[]): { score: number; max: number; percent: number; grade: 'A' | 'B' | 'C' | 'D' | 'F' } {
  let earned = 0
  let total = 0
  for (const c of checks) {
    const w = WEIGHTS[c.severity]
    total += w
    if (c.pass) earned += w
  }
  const percent = total === 0 ? 0 : Math.round((earned / total) * 100)
  let grade: 'A' | 'B' | 'C' | 'D' | 'F'
  if (percent >= 90) grade = 'A'
  else if (percent >= 75) grade = 'B'
  else if (percent >= 60) grade = 'C'
  else if (percent >= 40) grade = 'D'
  else grade = 'F'
  return { score: earned, max: total, percent, grade }
}

/** Truncate to whole-words for SERP preview */
export function truncateForSerp(text: string, max: number): string {
  if (!text) return ''
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + '…'
}

export const SEO_LIMITS = { TITLE_MIN, TITLE_MAX, DESC_MIN, DESC_MAX } as const
