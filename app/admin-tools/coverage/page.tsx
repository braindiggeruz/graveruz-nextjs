/**
 * Coverage Matrix — RU↔UZ translation status across pages and stories.
 *
 * Each row = a content unit.
 * Each column = a locale.
 * One-click "Create translation job" deep-links the operator into
 * Keystatic with the source slug pre-filled.
 *
 * Read-only — no writes from this page.
 */
import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from '../_components/TokenForm'
import { getSnapshotPages, getSnapshotStories, getSnapshotMeta } from '@/lib/seo-snapshot'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BASE = 'https://graver-studio.uz'

type CoverageRow = {
  key: string
  cluster: 'pages' | 'stories'
  ruSlug?: string
  uzSlug?: string
  ruTitle?: string
  uzTitle?: string
  ruStatus?: string
  uzStatus?: string
  ruFile?: string
  uzFile?: string
}

function storyKeystaticUrl(file?: string) {
  if (!file) return '/keystatic/'
  const m = file.match(/content\/blog\/(ru|uz)\/(.+?)\.mdx$/)
  if (!m) return '/keystatic/'
  return `/keystatic/branch/main/collection/stories/item/${encodeURIComponent(`${m[1]}/${m[2]}`)}`
}

function pageKeystaticUrl(slug?: string) {
  if (!slug) return '/keystatic/'
  return `/keystatic/branch/main/collection/pages/item/${encodeURIComponent(slug)}`
}

function newTranslationJobUrl(sourceSlug: string) {
  // Deep link into Keystatic translationJobs collection — operator still
  // fills the form, but we land them there with one click.
  return `/keystatic/branch/main/collection/translationJobs/create`
}

export default async function CoveragePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; tab?: string; filter?: string }>
}) {
  const sp = await searchParams
  if (!getServerToken()) return <div style={panel}>ADMIN_TOOLS_TOKEN не настроен.</div>
  if (!(await isAuthed(sp.token))) return <TokenForm />

  const tab = sp.tab === 'stories' ? 'stories' : 'pages'
  const filter = sp.filter || ''

  const pages = getSnapshotPages()
  const stories = getSnapshotStories()
  const meta = getSnapshotMeta()

  // Build coverage rows
  const pageRows: CoverageRow[] = []
  {
    const seen = new Set<string>()
    for (const p of pages) {
      const ru = p.locale === 'ru' ? p : pages.find((x) => x.locale === 'ru' && x.slug === p.alternateSlug?.ru)
      const uz = p.locale === 'uz' ? p : pages.find((x) => x.locale === 'uz' && x.slug === p.alternateSlug?.uz)
      const key = `${ru?.slug || ''}_${uz?.slug || ''}_${p.slug}`
      if (seen.has(key)) continue
      seen.add(key)
      pageRows.push({
        key: ru?.slug || uz?.slug || p.slug,
        cluster: 'pages',
        ruSlug: ru?.slug,
        uzSlug: uz?.slug,
        ruTitle: ru?.h1 || ru?.seo?.title,
        uzTitle: uz?.h1 || uz?.seo?.title,
        ruStatus: ru?.status,
        uzStatus: uz?.status,
      })
    }
  }

  const storyRows: CoverageRow[] = []
  {
    const seen = new Set<string>()
    for (const s of stories) {
      const ru = s.locale === 'ru' ? s : stories.find((x) => x.locale === 'ru' && x.slug === s.alternateRu)
      const uz = s.locale === 'uz' ? s : stories.find((x) => x.locale === 'uz' && x.slug === s.alternateUz)
      const key = `${ru?.slug || ''}_${uz?.slug || ''}_${s.slug}`
      if (seen.has(key)) continue
      seen.add(key)
      storyRows.push({
        key: ru?.slug || uz?.slug || s.slug,
        cluster: 'stories',
        ruSlug: ru?.slug,
        uzSlug: uz?.slug,
        ruTitle: ru?.title,
        uzTitle: uz?.title,
        ruFile: ru?.file,
        uzFile: uz?.file,
      })
    }
  }

  const rows = tab === 'pages' ? pageRows : storyRows
  const filtered = rows
    .filter((r) => {
      if (filter === 'missing-uz') return r.ruSlug && !r.uzSlug
      if (filter === 'missing-ru') return r.uzSlug && !r.ruSlug
      if (filter === 'complete') return r.ruSlug && r.uzSlug
      return true
    })
    .sort((a, b) => {
      // missing pairs first
      const aMissing = !a.ruSlug || !a.uzSlug
      const bMissing = !b.ruSlug || !b.uzSlug
      if (aMissing !== bMissing) return aMissing ? -1 : 1
      return a.key.localeCompare(b.key)
    })

  const stats = {
    total: rows.length,
    missingUz: rows.filter((r) => r.ruSlug && !r.uzSlug).length,
    missingRu: rows.filter((r) => r.uzSlug && !r.ruSlug).length,
    complete: rows.filter((r) => r.ruSlug && r.uzSlug).length,
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>RU ↔ UZ Coverage</h1>
      <p style={{ color: '#9aa8c4' }}>
        Где у RU-страницы нет UZ-перевода (и наоборот). Каждая отсутствующая пара = упущенный hreflang и аудитория.
        <br />
        <small style={{ color: '#5a6a87' }}>Snapshot: {meta.generatedAt}</small>
      </p>

      <div style={{ display: 'flex', gap: 8, margin: '20px 0 12px' }}>
        <a href={`?tab=pages${sp.token ? `&token=${sp.token}` : ''}`} style={tab === 'pages' ? tabActive : tabInactive}>
          Pages ({pageRows.length})
        </a>
        <a href={`?tab=stories${sp.token ? `&token=${sp.token}` : ''}`} style={tab === 'stories' ? tabActive : tabInactive}>
          Stories ({storyRows.length})
        </a>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, margin: '14px 0' }}>
        <Stat label="Всего" value={String(stats.total)} />
        <Stat label="Нет UZ" value={String(stats.missingUz)} accent={stats.missingUz > 0 ? '#ffb86b' : '#5eead4'} />
        <Stat label="Нет RU" value={String(stats.missingRu)} accent={stats.missingRu > 0 ? '#ffb86b' : '#5eead4'} />
        <Stat label="Полные пары" value={String(stats.complete)} accent="#5eead4" />
      </section>

      <form style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', margin: '8px 0 20px' }}>
        <input type="hidden" name="token" defaultValue={sp.token || ''} />
        <input type="hidden" name="tab" defaultValue={tab} />
        <select name="filter" defaultValue={filter} style={input}>
          <option value="">Все строки</option>
          <option value="missing-uz">Нет UZ-перевода</option>
          <option value="missing-ru">Нет RU-перевода</option>
          <option value="complete">Полные пары</option>
        </select>
        <button type="submit" style={btnPrimary}>Применить</button>
      </form>

      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>RU</th>
              <th style={th}>UZ</th>
              <th style={th}>Действие</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const missingUz = !!r.ruSlug && !r.uzSlug
              const missingRu = !!r.uzSlug && !r.ruSlug
              return (
                <tr key={r.key + r.cluster}>
                  <td style={td}>
                    {r.ruSlug ? (
                      <>
                        <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#9ec1ff' }}>{r.ruSlug}</div>
                        <div style={{ color: '#9aa8c4', fontSize: 12, marginTop: 2 }}>{r.ruTitle || ''}</div>
                        <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                          <a
                            style={link}
                            href={r.cluster === 'pages' ? pageKeystaticUrl(r.ruSlug) : storyKeystaticUrl(r.ruFile)}
                            target="_blank"
                            rel="noopener"
                          >
                            ✎ Edit
                          </a>
                          <a style={link} href={`${BASE}/ru/${r.cluster === 'stories' ? 'blog/' : ''}${r.ruSlug}/`} target="_blank" rel="noopener">
                            ↗ Live
                          </a>
                        </div>
                      </>
                    ) : (
                      <em style={{ color: '#7a8aa8' }}>— нет RU —</em>
                    )}
                  </td>
                  <td style={td}>
                    {r.uzSlug ? (
                      <>
                        <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#9ec1ff' }}>{r.uzSlug}</div>
                        <div style={{ color: '#9aa8c4', fontSize: 12, marginTop: 2 }}>{r.uzTitle || ''}</div>
                        <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                          <a
                            style={link}
                            href={r.cluster === 'pages' ? pageKeystaticUrl(r.uzSlug) : storyKeystaticUrl(r.uzFile)}
                            target="_blank"
                            rel="noopener"
                          >
                            ✎ Edit
                          </a>
                          <a style={link} href={`${BASE}/uz/${r.cluster === 'stories' ? 'blog/' : ''}${r.uzSlug}/`} target="_blank" rel="noopener">
                            ↗ Live
                          </a>
                        </div>
                      </>
                    ) : (
                      <em style={{ color: '#7a8aa8' }}>— нет UZ —</em>
                    )}
                  </td>
                  <td style={td}>
                    {missingUz && (
                      <a
                        href={r.cluster === 'pages' ? newTranslationJobUrl(r.ruSlug!) : '/keystatic/'}
                        target="_blank"
                        rel="noopener"
                        style={{ ...btnPrimary, display: 'inline-block', padding: '6px 12px', fontSize: 12, textDecoration: 'none' }}
                        title={r.cluster === 'pages' ? `Создай Translation Job с sourceSlug=${r.ruSlug}` : 'Stories переводятся вручную (MVP)'}
                      >
                        {r.cluster === 'pages' ? '+ Job RU→UZ' : '✎ Создать UZ'}
                      </a>
                    )}
                    {missingRu && (
                      <span style={{ color: '#ffb86b', fontSize: 12 }}>
                        Создай RU-версию вручную в Keystatic — auto-translate UZ→RU не поддерживается.
                      </span>
                    )}
                    {!missingUz && !missingRu && <span style={{ color: '#5eead4' }}>✓ Полная пара</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <section style={{ ...panel, marginTop: 32 }}>
        <h3 style={{ marginTop: 0 }}>Как создать UZ-перевод страницы</h3>
        <ol style={{ color: '#9aa8c4', lineHeight: 1.9, paddingLeft: 20 }}>
          <li>Нажми <strong style={{ color: '#5eead4' }}>+ Job RU→UZ</strong> в строке нужной RU-страницы.</li>
          <li>В Keystatic заполни <code style={mono}>sourceSlug</code> = slug RU-страницы, оставь статус <em>Новая</em>.</li>
          <li>Сохрани. GitHub Action <code style={mono}>translate.yml</code> подхватит задачу автоматически (нужен secret <code style={mono}>GEMINI_API_KEY</code> в repo settings).</li>
          <li>Через ~2-5 минут Pages → найди новую страницу <em>Draft</em>, проверь перевод, опубликуй.</li>
          <li>После Publish — Cloudflare деплой ~1-3 минуты, потом UZ-страница доступна.</li>
        </ol>
      </section>
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
const td: React.CSSProperties = { padding: '12px 14px', borderBottom: '1px solid #11192b', color: '#e6edf3', verticalAlign: 'top' }
const link: React.CSSProperties = { color: '#9ec1ff', textDecoration: 'none', fontSize: 12 }
const mono: React.CSSProperties = { background: '#1f2a44', padding: '1px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }
const input: React.CSSProperties = { padding: '6px 10px', background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 6, color: '#e6edf3', fontSize: 13 }
const btnPrimary: React.CSSProperties = { padding: '8px 16px', background: '#5eead4', color: '#0b1220', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }
const tabActive: React.CSSProperties = { padding: '8px 16px', background: '#5eead4', color: '#0b1220', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }
const tabInactive: React.CSSProperties = { padding: '8px 16px', background: '#0d1830', color: '#9ec1ff', border: '1px solid #1f2a44', borderRadius: 8, textDecoration: 'none', fontSize: 14 }
