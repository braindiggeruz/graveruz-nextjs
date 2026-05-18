/**
 * Stories SEO Audit — drives RU/UZ blog quality decisions.
 *
 * Read-only. Lists every story with score, length warnings, and the
 * single most-impactful action the operator should take.
 *
 * Goals:
 *   - surface stories with no FAQ / no description / draft frontmatter;
 *   - surface stories with broken or missing language pair;
 *   - surface "thin content" (<200 words) candidates;
 *   - one-click deep-link into Keystatic for editing.
 */
import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from '../_components/TokenForm'
import { getSnapshotStories, getSnapshotMeta } from '@/lib/seo-snapshot'
import { SEO_LIMITS } from '@/lib/seo-score'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BASE = 'https://graver-studio.uz'

type Action =
  | { kind: 'ok'; label: string }
  | { kind: 'warn'; label: string; reason: string }
  | { kind: 'critical'; label: string; reason: string }

function decideAction(s: ReturnType<typeof getSnapshotStories>[number]): Action {
  if (s.noindex) return { kind: 'critical', label: 'NOINDEX', reason: 'Скрыта от Google. Проверь — точно ли надо?' }
  if (!s.title) return { kind: 'critical', label: 'Нет title', reason: 'Без title статья не ранжируется.' }
  if (!/^[a-z0-9-]+$/.test(s.slug || '')) return { kind: 'critical', label: 'Slug suspicious', reason: 'Slug содержит кириллицу/пробелы/спецсимволы — Google не индексирует.' }
  if (!s.description) return { kind: 'warn', label: 'Нет description', reason: 'Google возьмёт случайный текст.' }
  const tLen = s.title.length
  if (tLen < SEO_LIMITS.TITLE_MIN || tLen > SEO_LIMITS.TITLE_MAX)
    return { kind: 'warn', label: `Title ${tLen}c`, reason: `Цель ${SEO_LIMITS.TITLE_MIN}-${SEO_LIMITS.TITLE_MAX} символов.` }
  const dLen = (s.description || '').length
  if (dLen < SEO_LIMITS.DESC_MIN || dLen > SEO_LIMITS.DESC_MAX)
    return { kind: 'warn', label: `Desc ${dLen}c`, reason: `Цель ${SEO_LIMITS.DESC_MIN}-${SEO_LIMITS.DESC_MAX} символов.` }
  if (!s.hasFaq) return { kind: 'warn', label: 'Нет FAQ', reason: 'FAQ даёт schema.org FAQPage — Google показывает ответы.' }
  const paired = s.locale === 'ru' ? !!s.alternateUz : !!s.alternateRu
  if (!paired) return { kind: 'warn', label: 'Нет UZ/RU пары', reason: 'hreflang не работает без пары.' }
  if ((s.wordCount || 0) < 200) return { kind: 'warn', label: `Тонкая (${s.wordCount}сл)`, reason: '<200 слов = Google считает дублем/пустышкой.' }
  if (s.canonicalOverride && !s.canonicalOverride.startsWith('https://'))
    return { kind: 'warn', label: 'Bad canonical', reason: 'canonicalOverride должен начинаться с https:// и указывать на полный URL.' }
  if (!s.date || !/^\d{4}-\d{2}-\d{2}$/.test(s.date))
    return { kind: 'warn', label: 'Нет даты', reason: 'Опубликованная статья без даты в формате YYYY-MM-DD — даты в выдаче не будет.' }
  if (!s.ogImage) return { kind: 'warn', label: 'Нет OG', reason: 'Шаринг в Telegram/Facebook без превью.' }
  return { kind: 'ok', label: '✓ Готово' }
}

function buildKeystaticUrl(file: string) {
  // file = content/blog/ru/some-slug.mdx → keystatic uses {locale}/{slug-without-mdx}
  const m = file.match(/content\/blog\/(ru|uz)\/(.+?)\.mdx$/)
  if (!m) return '/keystatic/'
  return `/keystatic/branch/main/collection/stories/item/${encodeURIComponent(`${m[1]}/${m[2]}`)}`
}

export default async function StoriesAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; q?: string; loc?: string; filter?: string }>
}) {
  const sp = await searchParams
  if (!getServerToken()) {
    return <div style={panel}>ADMIN_TOOLS_TOKEN не настроен.</div>
  }
  if (!(await isAuthed(sp.token))) return <TokenForm />

  const stories = getSnapshotStories()
  const meta = getSnapshotMeta()
  const loc = (sp.loc as 'ru' | 'uz' | undefined) || ''
  const q = (sp.q || '').toLowerCase()
  const filter = sp.filter || ''

  const rows = stories
    .filter((s) => !loc || s.locale === loc)
    .filter((s) => !q || (s.title || '').toLowerCase().includes(q) || s.slug.toLowerCase().includes(q))
    .map((s) => ({ s, action: decideAction(s) }))
    .filter((r) => {
      if (filter === 'critical') return r.action.kind === 'critical'
      if (filter === 'warn') return r.action.kind !== 'ok'
      if (filter === 'orphan') {
        const paired = r.s.locale === 'ru' ? !!r.s.alternateUz : !!r.s.alternateRu
        return !paired
      }
      if (filter === 'thin') return (r.s.wordCount || 0) < 200
      if (filter === 'no-faq') return !r.s.hasFaq
      if (filter === 'noindex') return !!r.s.noindex
      if (filter === 'canonical') return !!r.s.canonicalOverride
      if (filter === 'has-prev-slug') return Array.isArray((r.s as any).previousSlugs) && (r.s as any).previousSlugs.length > 0
      if (filter === 'bad-slug') return !/^[a-z0-9-]+$/.test(r.s.slug || '')
      if (filter === 'no-date') return !r.s.date || !/^\d{4}-\d{2}-\d{2}$/.test(r.s.date)
      return true
    })
    .sort((a, b) => {
      const order = { critical: 0, warn: 1, ok: 2 }
      const oa = order[a.action.kind]
      const ob = order[b.action.kind]
      if (oa !== ob) return oa - ob
      return (a.s.date || '').localeCompare(b.s.date || '')
    })

  const stats = {
    total: stories.length,
    critical: rows.filter((r) => r.action.kind === 'critical').length,
    warn: rows.filter((r) => r.action.kind === 'warn').length,
    ok: rows.filter((r) => r.action.kind === 'ok').length,
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Stories — SEO Audit ({stories.length})</h1>
      <p style={{ color: '#9aa8c4' }}>
        Аудит блога: каждая статья получает 1 рекомендованное действие. Снапшот:{' '}
        <code style={mono}>{meta.generatedAt}</code>
      </p>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, margin: '20px 0' }}>
        <Stat label="Всего историй" value={String(stats.total)} />
        <Stat label="Критичные" value={String(stats.critical)} accent={stats.critical > 0 ? '#ff6b6b' : '#5eead4'} />
        <Stat label="Предупреждения" value={String(stats.warn)} accent={stats.warn > 0 ? '#ffb86b' : '#5eead4'} />
        <Stat label="OK" value={String(stats.ok)} />
      </section>

      <form style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
        <input
          type="hidden"
          name="token"
          defaultValue={sp.token || ''}
        />
        <input name="q" placeholder="Поиск по заголовку или slug" defaultValue={sp.q || ''} style={input} />
        <select name="loc" defaultValue={loc} style={input}>
          <option value="">Все языки</option>
          <option value="ru">RU</option>
          <option value="uz">UZ</option>
        </select>
        <select name="filter" defaultValue={filter} style={input}>
          <option value="">Все строки</option>
          <option value="critical">Только критичные</option>
          <option value="warn">Только проблемные</option>
          <option value="orphan">Без языковой пары</option>
          <option value="thin">Тонкий контент (&lt;200 слов)</option>
          <option value="no-faq">Без FAQ</option>
          <option value="noindex">С noindex=true</option>
          <option value="canonical">С canonicalOverride</option>
          <option value="has-prev-slug">С previousSlugs</option>
          <option value="bad-slug">Подозрительный slug</option>
          <option value="no-date">Без валидной даты</option>
        </select>
        <button type="submit" style={btnPrimary}>Применить</button>
      </form>

      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Действие</th>
              <th style={th}>Slug</th>
              <th style={th}>Заголовок</th>
              <th style={th}>Loc</th>
              <th style={th}>Date</th>
              <th style={th}>Words</th>
              <th style={th}>FAQ</th>
              <th style={th}>Pair</th>
              <th style={th}>Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ s, action }) => (
              <tr key={`${s.locale}/${s.slug}`}>
                <td style={td}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      color: action.kind === 'ok' ? '#0b1220' : '#fff',
                      background:
                        action.kind === 'critical' ? '#ff6b6b' : action.kind === 'warn' ? '#ffb86b' : '#5eead4',
                    }}
                    title={action.kind !== 'ok' ? (action as any).reason : ''}
                  >
                    {action.label}
                  </span>
                </td>
                <td style={{ ...td, fontFamily: 'monospace', fontSize: 12, color: '#9ec1ff' }}>{s.slug}</td>
                <td style={{ ...td, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.title || <em style={{ color: '#7a8aa8' }}>— нет —</em>}
                </td>
                <td style={td}>{s.locale}</td>
                <td style={{ ...td, color: '#9aa8c4' }}>{s.date || '—'}</td>
                <td style={{ ...td, color: (s.wordCount || 0) < 200 ? '#ffb86b' : '#9aa8c4' }}>{s.wordCount || 0}</td>
                <td style={td}>{s.hasFaq ? '✓' : '—'}</td>
                <td style={td}>
                  {s.locale === 'ru'
                    ? (s.alternateUz ? <span style={{ color: '#5eead4' }} title={s.alternateUz}>→UZ</span> : <span style={{ color: '#ffb86b' }}>—</span>)
                    : (s.alternateRu ? <span style={{ color: '#5eead4' }} title={s.alternateRu}>→RU</span> : <span style={{ color: '#ffb86b' }}>—</span>)}
                </td>
                <td style={td}>
                  <a style={link} href={buildKeystaticUrl(s.file || '')} target="_blank" rel="noopener">✎</a>{' '}
                  <a style={link} href={`${BASE}/${s.locale}/blog/${s.slug}/`} target="_blank" rel="noopener">↗</a>{' '}
                  <a
                    style={link}
                    href={`/admin-tools/publish-checklist/?kind=story&loc=${s.locale}&slug=${encodeURIComponent(s.slug)}${sp.token ? `&token=${encodeURIComponent(sp.token)}` : ''}`}
                    title="Publish Checklist"
                  >
                    ✓
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Stat({ label, value, accent = '#5eead4' }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 10, padding: 16 }}>
      <div style={{ color: '#9aa8c4', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent, marginTop: 6 }}>{value}</div>
    </div>
  )
}

const panel: React.CSSProperties = { background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 12, padding: 20 }
const tableWrap: React.CSSProperties = { overflowX: 'auto', background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 12 }
const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #1f2a44', color: '#9aa8c4', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }
const td: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid #11192b', color: '#e6edf3' }
const link: React.CSSProperties = { color: '#9ec1ff', textDecoration: 'none' }
const mono: React.CSSProperties = { background: '#1f2a44', padding: '1px 6px', borderRadius: 4, fontSize: 12 }
const input: React.CSSProperties = { padding: '8px 12px', background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 8, color: '#e6edf3', fontSize: 13 }
const btnPrimary: React.CSSProperties = { padding: '8px 16px', background: '#5eead4', color: '#0b1220', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }
