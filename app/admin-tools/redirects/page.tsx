/**
 * Redirects / previousSlugs viewer — READ-ONLY.
 *
 * Lists every old→new slug mapping that `scripts/generate-redirects.mjs`
 * emits into `public/_redirects` at build time. Lets the operator see
 * which donor URLs already have a 301 in place, so they know what's
 * safe to consolidate and what still needs manual work.
 *
 * No destructive actions. Editing happens in Keystatic via the
 * `previousSlugs` field on pages / stories / products.
 */
import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from '../_components/TokenForm'
import {
  getSnapshotPages,
  getSnapshotProducts,
  getSnapshotStories,
  getSnapshotMeta,
} from '@/lib/seo-snapshot'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BASE = 'https://graver-studio.uz'

type RedirectRow = {
  source: 'page' | 'story' | 'product'
  locale?: string
  oldSlug: string
  newSlug: string
  targetUrl: string
  editUrl: string
  status?: string
}

export default async function RedirectsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; q?: string }>
}) {
  const sp = await searchParams
  if (!getServerToken()) {
    return <div style={panel}>ADMIN_TOOLS_TOKEN не настроен.</div>
  }
  if (!(await isAuthed(sp.token))) return <TokenForm />

  const pages = getSnapshotPages()
  const products = getSnapshotProducts()
  const stories = getSnapshotStories()
  const meta = getSnapshotMeta()

  const rows: RedirectRow[] = []

  for (const p of pages) {
    const prev: string[] = (p as any).previousSlugs || []
    const loc = p.locale || 'ru'
    for (const old of prev) {
      rows.push({
        source: 'page',
        locale: loc,
        oldSlug: old,
        newSlug: p.slug,
        targetUrl: `${BASE}/${loc}/${p.slug}/`,
        editUrl: `/keystatic/collection/pages/item/${encodeURIComponent(p.slug)}`,
        status: p.status,
      })
    }
  }

  for (const pr of products) {
    const prev: string[] = (pr as any).previousSlugs || []
    for (const old of prev) {
      rows.push({
        source: 'product',
        oldSlug: old,
        newSlug: pr.slug,
        targetUrl: `${BASE}/ru/products/${pr.slug}/`,
        editUrl: `/keystatic/collection/products/item/${encodeURIComponent(pr.slug)}`,
        status: pr.status,
      })
    }
  }

  for (const s of stories) {
    const prev: string[] = (s as any).previousSlugs || []
    for (const old of prev) {
      rows.push({
        source: 'story',
        locale: s.locale,
        oldSlug: old,
        newSlug: s.slug,
        targetUrl: `${BASE}/${s.locale}/blog/${s.slug}/`,
        editUrl: `/keystatic/branch/main/collection/stories/item/${encodeURIComponent(`${s.locale}/${s.slug}`)}`,
      })
    }
  }

  const q = (sp.q || '').toLowerCase()
  const filtered = q
    ? rows.filter(
        (r) => r.oldSlug.toLowerCase().includes(q) || r.newSlug.toLowerCase().includes(q),
      )
    : rows

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Redirects · previousSlugs viewer</h1>
      <p style={{ color: '#9aa8c4' }}>
        Каждая запись — это{' '}
        <strong>301-редирект old→new</strong>, который автоматически генерируется в{' '}
        <code style={mono}>public/_redirects</code> на каждом deploy.
        Управляется через поле <code style={mono}>previousSlugs</code> в Keystatic.
        <br />
        <small style={{ color: '#5a6a87' }}>
          Snapshot: {meta.generatedAt} · всего редиректов: {rows.length}
        </small>
      </p>

      <form style={{ margin: '20px 0', display: 'flex', gap: 10 }}>
        <input type="hidden" name="token" defaultValue={sp.token || ''} />
        <input name="q" defaultValue={sp.q || ''} placeholder="поиск по old/new slug" style={input} />
        <button type="submit" style={btnPrimary}>Фильтр</button>
      </form>

      {filtered.length === 0 ? (
        <div style={panel}>
          <p style={{ margin: 0, color: '#9aa8c4' }}>
            Пока нет ни одного previousSlugs. Это нормально, если ты ни разу не менял slug
            опубликованной страницы. Если меняешь slug — обязательно впиши старый в поле{' '}
            <strong>«История URL»</strong> в Keystatic.
          </p>
        </div>
      ) : (
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Тип</th>
                <th style={th}>Locale</th>
                <th style={th}>Old slug (donor)</th>
                <th style={th}>→</th>
                <th style={th}>New slug (canonical)</th>
                <th style={th}>Status</th>
                <th style={th}>Open</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={`${r.source}-${r.locale}-${r.oldSlug}-${i}`}>
                  <td style={td}>{r.source}</td>
                  <td style={td}>{r.locale || '—'}</td>
                  <td style={{ ...td, color: '#ffb86b', fontFamily: 'monospace', fontSize: 12 }}>
                    {r.oldSlug}
                  </td>
                  <td style={{ ...td, color: '#5a6a87' }}>→</td>
                  <td style={{ ...td, color: '#5eead4', fontFamily: 'monospace', fontSize: 12 }}>
                    {r.newSlug}
                  </td>
                  <td style={td}>
                    <span style={{ color: r.status === 'published' ? '#5eead4' : '#ffe066' }}>
                      {r.status || '—'}
                    </span>
                  </td>
                  <td style={td}>
                    <a style={link} href={r.targetUrl} target="_blank" rel="noopener">↗ live</a>
                    {' · '}
                    <a style={link} href={r.editUrl} target="_blank" rel="noopener">✎ edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section style={{ marginTop: 32 }}>
        <div style={panel}>
          <h3 style={{ marginTop: 0 }}>Как добавить редирект безопасно</h3>
          <ol style={{ color: '#9aa8c4', lineHeight: 1.9, paddingLeft: 18 }}>
            <li>Открой страницу в Keystatic (page / story / product).</li>
            <li>В поле <strong>«История URL»</strong> допиши старый slug (без локали, без слеша).</li>
            <li>Сохрани — Cloudflare через 1–3 минуты задеплоит, и старый URL начнёт 301-редиректиться.</li>
            <li>Не меняй slug без previousSlugs: потеряешь Google-трафик и ссылки.</li>
            <li>Не делай массовые 301 без подтверждения — каждая консолидация — это решение.</li>
          </ol>
        </div>
      </section>
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
