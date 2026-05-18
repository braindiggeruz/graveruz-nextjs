/**
 * Publish Checklist — pre-flight before submitting a page/story to GSC.
 *
 * Operator picks a page or a story from a dropdown (or passes ?slug=X&kind=Y),
 * and gets a clear "Ready for GSC" / "Fix before indexing" status with a
 * concrete list of green/red checks.
 *
 * READ-ONLY. No destructive actions. Editing goes back to Keystatic.
 */
import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from '../_components/TokenForm'
import {
  getSnapshotPages,
  getSnapshotStories,
  getSnapshotMeta,
} from '@/lib/seo-snapshot'
import { SEO_LIMITS } from '@/lib/seo-score'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BASE = 'https://graver-studio.uz'

type CheckResult = {
  id: string
  label: string
  pass: boolean
  detail?: string
  severity: 'critical' | 'high' | 'medium' | 'low'
}

// ────────────────────────────────────────────────────────────────
// Run the checklist for a single page entry from snapshot
// ────────────────────────────────────────────────────────────────
function checklistForPage(p: ReturnType<typeof getSnapshotPages>[number]): CheckResult[] {
  const out: CheckResult[] = []
  const blocks = (p.blocks as any[]) || []
  const hasBlock = (t: string) => blocks.some((b) => b.discriminant === t)
  const collectHrefs = () => {
    const hs: string[] = []
    for (const b of blocks) {
      const v = b.value || {}
      if (typeof v.ctaHref === 'string') hs.push(v.ctaHref)
      if (typeof v.buttonHref === 'string') hs.push(v.buttonHref)
    }
    return hs
  }
  const tLen = p.seo?.title?.length || 0
  const dLen = p.seo?.description?.length || 0
  const otherLoc = (p.locale || 'ru') === 'ru' ? 'uz' : 'ru'
  const internalLinks = collectHrefs().filter((h) => h.startsWith('/') && !h.startsWith('//'))

  out.push({ id: 'h1', label: 'H1 заполнен', pass: !!p.h1, severity: 'critical', detail: p.h1 })
  out.push({
    id: 'title',
    label: `SEO title ${SEO_LIMITS.TITLE_MIN}-${SEO_LIMITS.TITLE_MAX} символов`,
    pass: tLen >= SEO_LIMITS.TITLE_MIN && tLen <= SEO_LIMITS.TITLE_MAX,
    severity: tLen === 0 ? 'critical' : 'medium',
    detail: tLen ? `${tLen} симв.` : 'пусто',
  })
  out.push({
    id: 'desc',
    label: `Meta description ${SEO_LIMITS.DESC_MIN}-${SEO_LIMITS.DESC_MAX} символов`,
    pass: dLen >= SEO_LIMITS.DESC_MIN && dLen <= SEO_LIMITS.DESC_MAX,
    severity: dLen === 0 ? 'critical' : 'medium',
    detail: dLen ? `${dLen} симв.` : 'пусто',
  })
  out.push({
    id: 'noindex',
    label: 'Noindex выключен (страница индексируема)',
    pass: !p.seo?.noindex,
    severity: 'critical',
    detail: p.seo?.noindex ? 'noindex=true — Google не увидит' : 'OK',
  })
  out.push({
    id: 'og',
    label: 'OG-картинка указана',
    pass: !!p.seo?.ogImage,
    severity: 'medium',
    detail: p.seo?.ogImage || 'будет fallback из settings',
  })
  out.push({
    id: 'pair',
    label: `Языковая пара (${otherLoc})`,
    pass: !!p.alternateSlug?.[otherLoc as 'ru' | 'uz'],
    severity: 'high',
    detail: p.alternateSlug?.[otherLoc as 'ru' | 'uz'] || 'нет пары — переключатель языка ведёт в 404',
  })
  out.push({
    id: 'cta',
    label: 'CTA-блок присутствует',
    pass: hasBlock('cta'),
    severity: 'high',
  })
  out.push({
    id: 'faq',
    label: 'FAQ-блок присутствует',
    pass: hasBlock('faq'),
    severity: 'medium',
  })
  out.push({
    id: 'internal_links',
    label: 'Минимум 2 внутренние ссылки',
    pass: internalLinks.length >= 2,
    severity: 'medium',
    detail: `${internalLinks.length} ссылок`,
  })
  out.push({
    id: 'canonical_safe',
    label: 'canonicalOverride не задан или валиден',
    pass:
      !p.seo ||
      typeof (p.seo as any).canonicalOverride === 'undefined' ||
      String((p.seo as any).canonicalOverride || '').startsWith('https://'),
    severity: 'high',
    detail: (p.seo as any)?.canonicalOverride || 'не задан',
  })
  out.push({
    id: 'published',
    label: 'Статус: опубликовано',
    pass: p.status === 'published',
    severity: 'critical',
    detail: p.status || 'draft',
  })

  return out
}

function checklistForStory(s: ReturnType<typeof getSnapshotStories>[number]): CheckResult[] {
  const out: CheckResult[] = []
  const tLen = (s.title || '').length
  const dLen = (s.description || '').length
  const otherLoc = s.locale === 'ru' ? 'uz' : 'ru'
  const paired = s.locale === 'ru' ? !!s.alternateUz : !!s.alternateRu

  out.push({ id: 'title', label: 'Заголовок есть', pass: !!s.title, severity: 'critical', detail: s.title })
  out.push({
    id: 'title_len',
    label: `Title ${SEO_LIMITS.TITLE_MIN}-${SEO_LIMITS.TITLE_MAX} символов`,
    pass: tLen >= SEO_LIMITS.TITLE_MIN && tLen <= SEO_LIMITS.TITLE_MAX,
    severity: tLen === 0 ? 'critical' : 'medium',
    detail: `${tLen} симв.`,
  })
  out.push({
    id: 'desc',
    label: `Description ${SEO_LIMITS.DESC_MIN}-${SEO_LIMITS.DESC_MAX} символов`,
    pass: dLen >= SEO_LIMITS.DESC_MIN && dLen <= SEO_LIMITS.DESC_MAX,
    severity: dLen === 0 ? 'critical' : 'medium',
    detail: dLen ? `${dLen} симв.` : 'пусто',
  })
  out.push({
    id: 'noindex',
    label: 'Noindex выключен',
    pass: !s.noindex,
    severity: 'critical',
    detail: s.noindex ? 'noindex=true' : 'OK',
  })
  out.push({
    id: 'og',
    label: 'OG-картинка указана',
    pass: !!s.ogImage,
    severity: 'medium',
    detail: s.ogImage || 'будет fallback',
  })
  out.push({
    id: 'pair',
    label: `Языковая пара (${otherLoc})`,
    pass: paired,
    severity: 'high',
    detail: paired ? `paired: ${s.locale === 'ru' ? s.alternateUz : s.alternateRu}` : 'нет пары',
  })
  out.push({
    id: 'faq',
    label: 'FAQ есть (для блога обязательно)',
    pass: !!s.hasFaq,
    severity: 'medium',
  })
  out.push({
    id: 'word_count',
    label: 'Минимум 700 слов',
    pass: (s.wordCount || 0) >= 700,
    severity: (s.wordCount || 0) < 200 ? 'high' : 'medium',
    detail: `${s.wordCount || 0} слов`,
  })
  out.push({
    id: 'date',
    label: 'Дата публикации заполнена',
    pass: !!s.date && /^\d{4}-\d{2}-\d{2}$/.test(s.date),
    severity: 'high',
    detail: s.date || 'нет даты',
  })
  out.push({
    id: 'canonical_safe',
    label: 'canonicalOverride валиден (или пуст)',
    pass: !s.canonicalOverride || s.canonicalOverride.startsWith('https://'),
    severity: 'high',
    detail: s.canonicalOverride || 'не задан',
  })
  out.push({
    id: 'slug_safe',
    label: 'Slug без кириллицы и пробелов',
    pass: /^[a-z0-9-]+$/.test(s.slug || ''),
    severity: 'high',
    detail: s.slug,
  })

  return out
}

function summarize(checks: CheckResult[]) {
  const failed = checks.filter((c) => !c.pass)
  const failedCritical = failed.filter((c) => c.severity === 'critical').length
  const failedHigh = failed.filter((c) => c.severity === 'high').length
  const ready = failedCritical === 0 && failedHigh === 0
  return { failed, failedCritical, failedHigh, ready }
}

export default async function PublishChecklistPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; slug?: string; kind?: 'page' | 'story'; loc?: string }>
}) {
  const sp = await searchParams
  if (!getServerToken()) {
    return <div style={panel}>ADMIN_TOOLS_TOKEN не настроен.</div>
  }
  if (!(await isAuthed(sp.token))) return <TokenForm />

  const pages = getSnapshotPages()
  const stories = getSnapshotStories()
  const meta = getSnapshotMeta()

  const kind: 'page' | 'story' = sp.kind === 'story' ? 'story' : 'page'
  const slug = sp.slug || ''
  const loc = (sp.loc as 'ru' | 'uz' | undefined) || ''

  let targetTitle = ''
  let liveUrl = ''
  let editUrl = '/keystatic/'
  let checks: CheckResult[] = []
  let summary: ReturnType<typeof summarize> | null = null

  if (kind === 'page' && slug) {
    const p = pages.find((x) => x.slug === slug)
    if (p) {
      targetTitle = `${p.locale}/${p.slug}`
      liveUrl = `${BASE}/${p.locale || 'ru'}/${p.slug}/`
      editUrl = `/keystatic/collection/pages/item/${encodeURIComponent(p.slug)}`
      checks = checklistForPage(p)
      summary = summarize(checks)
    }
  } else if (kind === 'story' && slug) {
    const s = stories.find((x) => x.slug === slug && (!loc || x.locale === loc))
    if (s) {
      targetTitle = `blog/${s.locale}/${s.slug}`
      liveUrl = `${BASE}/${s.locale}/blog/${s.slug}/`
      editUrl = `/keystatic/branch/main/collection/stories/item/${encodeURIComponent(`${s.locale}/${s.slug}`)}`
      checks = checklistForStory(s)
      summary = summarize(checks)
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Publish Checklist</h1>
      <p style={{ color: '#9aa8c4' }}>
        Pre-flight для отправки страницы или статьи в Google Search Console. Выбери цель — увидишь зелёные ✓ и красные ✘.
        <br />
        <small style={{ color: '#5a6a87' }}>Snapshot: {meta.generatedAt}</small>
      </p>

      <form style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '20px 0', alignItems: 'flex-end' }}>
        <input type="hidden" name="token" defaultValue={sp.token || ''} />
        <label style={fieldGroup}>
          <span style={fieldLabel}>Тип</span>
          <select name="kind" defaultValue={kind} style={input}>
            <option value="page">Page (money pages)</option>
            <option value="story">Story (блог)</option>
          </select>
        </label>
        <label style={fieldGroup}>
          <span style={fieldLabel}>Slug</span>
          <input name="slug" placeholder="например: korporativnye-podarki" defaultValue={slug} style={input} />
        </label>
        <label style={fieldGroup}>
          <span style={fieldLabel}>Locale (только для story)</span>
          <select name="loc" defaultValue={loc} style={input}>
            <option value="">— любой —</option>
            <option value="ru">RU</option>
            <option value="uz">UZ</option>
          </select>
        </label>
        <button type="submit" style={btnPrimary}>Проверить</button>
      </form>

      {summary && (
        <section style={{ marginTop: 24 }}>
          <div
            style={{
              padding: 18,
              borderRadius: 12,
              border: `2px solid ${summary.ready ? '#5eead4' : '#ff6b6b'}`,
              background: summary.ready ? '#0d2a26' : '#321319',
              marginBottom: 24,
            }}
          >
            <strong style={{ color: summary.ready ? '#5eead4' : '#ffbab8', fontSize: 18 }}>
              {summary.ready ? '✓ Ready for GSC' : '✘ Fix before indexing'}
            </strong>
            <p style={{ margin: '6px 0 0', color: '#cbd5ea', fontSize: 14 }}>
              {summary.ready
                ? `Все критичные и высокоприоритетные проверки пройдены. Можно отправлять «${targetTitle}» в Google Search Console.`
                : `Критичных проблем: ${summary.failedCritical}, высокоприоритетных: ${summary.failedHigh}. Сначала исправь их в Keystatic.`}
            </p>
            <p style={{ margin: '10px 0 0', fontSize: 13 }}>
              <a style={link} href={liveUrl} target="_blank" rel="noopener">↗ Open live page</a>
              {' · '}
              <a style={link} href={editUrl} target="_blank" rel="noopener">✎ Edit in Keystatic</a>
              {' · '}
              <a
                style={link}
                href={`https://search.google.com/search-console/inspect?resource_id=https%3A%2F%2Fgraver-studio.uz%2F&id=${encodeURIComponent(liveUrl)}`}
                target="_blank"
                rel="noopener"
              >
                ↗ GSC URL Inspection
              </a>
            </p>
          </div>

          <h2 style={{ marginBottom: 10 }}>Чеклист ({targetTitle})</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {checks.map((c) => (
              <li
                key={c.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '10px 14px',
                  borderBottom: '1px solid #1f2a44',
                  background: c.pass ? 'transparent' : '#150e1a',
                }}
              >
                <span style={{ width: 24, color: c.pass ? '#5eead4' : severityColor(c.severity) }}>
                  {c.pass ? '✓' : '✘'}
                </span>
                <span style={{ flex: 1 }}>
                  <strong>{c.label}</strong>
                  {c.detail && <span style={{ color: '#9aa8c4', marginLeft: 8, fontSize: 13 }}>— {c.detail}</span>}
                </span>
                <span style={{ color: severityColor(c.severity), fontSize: 12 }}>{c.severity}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!summary && (
        <section style={{ marginTop: 24 }}>
          <div style={panel}>
            <h3 style={{ marginTop: 0 }}>Выбери цель проверки</h3>
            <p style={{ color: '#9aa8c4' }}>
              Введи slug сверху или открой одну из недавних целей:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              <Card title="Pages" rows={pages.slice(0, 8).map((p) => ({ slug: p.slug, kind: 'page', loc: p.locale }))} token={sp.token} />
              <Card
                title="Stories (latest 8)"
                rows={[...stories]
                  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
                  .slice(0, 8)
                  .map((s) => ({ slug: s.slug, kind: 'story', loc: s.locale }))}
                token={sp.token}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function severityColor(s: CheckResult['severity']) {
  return ({ critical: '#ff6b6b', high: '#ffb86b', medium: '#ffe066', low: '#a8d8ff' } as const)[s]
}

function Card({
  title,
  rows,
  token,
}: {
  title: string
  rows: { slug: string; kind: string; loc?: string }[]
  token?: string
}) {
  return (
    <div style={{ background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 10, padding: 16 }}>
      <strong style={{ fontSize: 14 }}>{title}</strong>
      <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', fontSize: 13 }}>
        {rows.map((r) => (
          <li key={`${r.kind}-${r.loc || ''}-${r.slug}`} style={{ padding: '4px 0' }}>
            <a
              style={link}
              href={`/admin-tools/publish-checklist/?kind=${r.kind}&slug=${encodeURIComponent(r.slug)}${r.loc ? `&loc=${r.loc}` : ''}${token ? `&token=${encodeURIComponent(token)}` : ''}`}
            >
              {r.loc ? `${r.loc}/` : ''}{r.slug}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const panel: React.CSSProperties = { background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 12, padding: 20 }
const link: React.CSSProperties = { color: '#9ec1ff', textDecoration: 'none' }
const input: React.CSSProperties = { padding: '8px 12px', background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 8, color: '#e6edf3', fontSize: 13 }
const btnPrimary: React.CSSProperties = { padding: '10px 18px', background: '#5eead4', color: '#0b1220', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }
const fieldGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }
const fieldLabel: React.CSSProperties = { color: '#9aa8c4', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }
