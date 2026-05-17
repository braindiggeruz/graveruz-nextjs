/**
 * SEO Cockpit — server component reading Keystatic content.
 *
 * Shows per-page audit + per-product audit + global health snapshot.
 * Read-only. Editing happens in Keystatic.
 */
import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from '../_components/TokenForm'
import { getSnapshotPages, getSnapshotProducts, getSnapshotMeta } from '@/lib/seo-snapshot'
import { auditPage, scorePage, truncateForSerp, SEO_LIMITS, type SeoCheck } from '@/lib/seo-score'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BASE = 'https://graver-studio.uz'

// ─── Helpers ────────────────────────────────────────────────────────
function collectInternalHrefs(blocks: any[]): string[] {
  const hrefs: string[] = []
  for (const b of blocks || []) {
    const v = b.value || {}
    if (typeof v.ctaHref === 'string') hrefs.push(v.ctaHref)
    if (typeof v.buttonHref === 'string') hrefs.push(v.buttonHref)
  }
  return hrefs
}

function hasBlock(blocks: any[], type: string) {
  return (blocks || []).some((b) => b.discriminant === type)
}

function severityColor(s: SeoCheck['severity']) {
  return { critical: '#ff6b6b', high: '#ffb86b', medium: '#ffe066', low: '#a8d8ff', info: '#7a8aa8' }[s]
}

function gradeColor(g: 'A' | 'B' | 'C' | 'D' | 'F') {
  return { A: '#5eead4', B: '#a8d8ff', C: '#ffe066', D: '#ffb86b', F: '#ff6b6b' }[g]
}

// ─── Page ───────────────────────────────────────────────────────────
export default async function SeoCockpitPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; slug?: string }>
}) {
  const sp = await searchParams
  if (!getServerToken()) {
    return (
      <div style={panel}>
        ADMIN_TOOLS_TOKEN не настроен. Открой <a href="/admin-tools/" style={link}>/admin-tools/</a> для инструкций.
      </div>
    )
  }
  if (!(await isAuthed(sp.token))) return <TokenForm />

  const pages = getSnapshotPages()
  const products = getSnapshotProducts()
  const meta = getSnapshotMeta()

  // Build inbound-link graph: which slug links to which slug.
  const inboundBySlug: Record<string, string[]> = {}
  for (const p of pages) {
    const hrefs = collectInternalHrefs((p.blocks as any) || [])
    for (const h of hrefs) {
      // /ru/some-slug/ or /uz/some-slug/
      const m = h.match(/^\/(ru|uz)\/([^/?#]+)/)
      if (m) {
        const targetSlug = m[2]
        inboundBySlug[targetSlug] = inboundBySlug[targetSlug] || []
        if (p.slug && p.slug !== targetSlug) inboundBySlug[targetSlug].push(p.slug)
      }
    }
  }

  const pageAudits = pages.map((p) => {
    const blocks = (p.blocks as any[]) || []
    const checks = auditPage({
      slug: p.slug,
      locale: (p.locale as 'ru' | 'uz') || 'ru',
      status: (p.status as 'draft' | 'published') || 'draft',
      h1: p.h1 || '',
      intro: p.intro || '',
      heroImage: (p.heroImage as string) || '',
      seoTitle: p.seo?.title || '',
      seoDescription: p.seo?.description || '',
      seoOgImage: (p.seo?.ogImage as string) || '',
      seoNoindex: !!p.seo?.noindex,
      alternateRu: p.alternateSlug?.ru || '',
      alternateUz: p.alternateSlug?.uz || '',
      hasFaq: hasBlock(blocks, 'faq'),
      hasCta: hasBlock(blocks, 'cta'),
      internalLinkHrefs: collectInternalHrefs(blocks),
      knownPageSlugs: pages.map((x) => x.slug),
      inboundLinkSlugs: inboundBySlug[p.slug] || [],
    })
    return { page: p, checks, score: scorePage(checks) }
  })

  // Global health
  const totals = {
    published: pageAudits.filter((a) => a.page.status === 'published').length,
    drafts: pageAudits.filter((a) => a.page.status !== 'published').length,
    orphans: pageAudits.filter((a) => (inboundBySlug[a.page.slug] || []).length === 0 && a.page.status === 'published').length,
    noindexPublished: pageAudits.filter((a) => a.page.status === 'published' && a.page.seo?.noindex).length,
    avg: Math.round(pageAudits.reduce((s, a) => s + a.score.percent, 0) / Math.max(pageAudits.length, 1)),
  }

  const focusSlug = sp.slug
  const focus = focusSlug ? pageAudits.find((a) => a.page.slug === focusSlug) : null

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>SEO Cockpit</h1>
      <p style={{ color: '#9aa8c4' }}>
        Состояние всех страниц и продуктов. Все ссылки на правки ведут в Keystatic.
        <br />
        <small style={{ color: '#5a6a87' }}>
          Snapshot: {meta.generatedAt} · обновляется при каждом deploy.
        </small>
      </p>

      {/* Global health */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, margin: '20px 0' }}>
        <Stat label="Pages published" value={String(totals.published)} />
        <Stat label="Pages drafts" value={String(totals.drafts)} />
        <Stat label="Avg SEO score" value={`${totals.avg}%`} accent={gradeColor(totals.avg >= 90 ? 'A' : totals.avg >= 75 ? 'B' : totals.avg >= 60 ? 'C' : totals.avg >= 40 ? 'D' : 'F')} />
        <Stat label="Orphan published" value={String(totals.orphans)} accent={totals.orphans > 0 ? '#ffb86b' : '#5eead4'} />
        <Stat label="Noindex on published" value={String(totals.noindexPublished)} accent={totals.noindexPublished > 0 ? '#ff6b6b' : '#5eead4'} />
        <Stat label="Products" value={String(products.length)} />
      </section>

      {/* Pages table */}
      <section style={{ marginTop: 28 }}>
        <h2>Pages ({pageAudits.length})</h2>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Slug</th>
                <th style={th}>Locale</th>
                <th style={th}>Status</th>
                <th style={th}>Score</th>
                <th style={th}>Title len</th>
                <th style={th}>Desc len</th>
                <th style={th}>Pair</th>
                <th style={th}>FAQ</th>
                <th style={th}>CTA</th>
                <th style={th}>Inbound</th>
                <th style={th}>Live URL</th>
              </tr>
            </thead>
            <tbody>
              {pageAudits.map((a) => {
                const liveUrl = `${BASE}/${a.page.locale || 'ru'}/${a.page.slug}/`
                const orphan = (inboundBySlug[a.page.slug] || []).length === 0
                const titleLen = a.page.seo?.title?.length || 0
                const descLen = a.page.seo?.description?.length || 0
                const titleOk = titleLen >= SEO_LIMITS.TITLE_MIN && titleLen <= SEO_LIMITS.TITLE_MAX
                const descOk = descLen >= SEO_LIMITS.DESC_MIN && descLen <= SEO_LIMITS.DESC_MAX
                return (
                  <tr key={a.page.slug} style={{ background: focusSlug === a.page.slug ? '#142347' : undefined }}>
                    <td style={td}>
                      <a style={link} href={`/admin-tools/seo-cockpit/?slug=${a.page.slug}`}>
                        {a.page.slug}
                      </a>
                    </td>
                    <td style={td}>{a.page.locale}</td>
                    <td style={td}>
                      <span style={{ color: a.page.status === 'published' ? '#5eead4' : '#ffe066' }}>
                        {a.page.status}
                      </span>
                    </td>
                    <td style={{ ...td, color: gradeColor(a.score.grade), fontWeight: 700 }}>
                      {a.score.percent}% {a.score.grade}
                    </td>
                    <td style={{ ...td, color: titleOk ? '#5eead4' : '#ffb86b' }}>{titleLen || '—'}</td>
                    <td style={{ ...td, color: descOk ? '#5eead4' : '#ffb86b' }}>{descLen || '—'}</td>
                    <td style={td}>
                      {a.page.alternateSlug?.ru && a.page.alternateSlug?.uz ? (
                        <span style={{ color: '#5eead4' }}>✓</span>
                      ) : (
                        <span style={{ color: '#ffb86b' }}>—</span>
                      )}
                    </td>
                    <td style={td}>{hasBlock((a.page.blocks as any[]) || [], 'faq') ? '✓' : '—'}</td>
                    <td style={td}>{hasBlock((a.page.blocks as any[]) || [], 'cta') ? '✓' : '—'}</td>
                    <td style={{ ...td, color: orphan && a.page.status === 'published' ? '#ff6b6b' : '#9aa8c4' }}>
                      {(inboundBySlug[a.page.slug] || []).length}
                    </td>
                    <td style={td}>
                      <a style={link} href={liveUrl} target="_blank">↗</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Focus card */}
      {focus && <FocusCard a={focus} inbound={inboundBySlug[focus.page.slug] || []} />}

      {/* Products mini-audit */}
      <section style={{ marginTop: 40 }}>
        <h2>Products SEO snapshot ({products.length})</h2>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Slug</th>
                <th style={th}>Status</th>
                <th style={th}>Title</th>
                <th style={th}>Desc</th>
                <th style={th}>FAQ items</th>
                <th style={th}>Reviews</th>
                <th style={th}>Hero</th>
                <th style={th}>Pricing tiers</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const titleLen = p.seo?.title?.length || 0
                const descLen = p.seo?.description?.length || 0
                return (
                  <tr key={p.slug}>
                    <td style={td}>{p.slug}</td>
                    <td style={td}>
                      <span style={{ color: p.status === 'published' ? '#5eead4' : '#ffe066' }}>{p.status}</span>
                    </td>
                    <td style={{ ...td, color: titleLen >= SEO_LIMITS.TITLE_MIN ? '#5eead4' : '#ffb86b' }}>
                      {titleLen || '—'}
                    </td>
                    <td style={{ ...td, color: descLen >= SEO_LIMITS.DESC_MIN ? '#5eead4' : '#ffb86b' }}>
                      {descLen || '—'}
                    </td>
                    <td style={td}>{p.faq?.length || 0}</td>
                    <td style={td}>{p.reviews?.length || 0}</td>
                    <td style={td}>{p.heroImage ? '✓' : '—'}</td>
                    <td style={td}>{p.pricingTiers?.length || 0}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function FocusCard({ a, inbound }: { a: { page: any; checks: SeoCheck[]; score: { percent: number; grade: any } }; inbound: string[] }) {
  const liveUrl = `${BASE}/${a.page.locale || 'ru'}/${a.page.slug}/`
  const editUrl = `/keystatic/collection/pages/item/${encodeURIComponent(a.page.slug)}`
  const title = a.page.seo?.title || a.page.h1 || a.page.slug
  const desc = a.page.seo?.description || a.page.intro || ''

  // Suggest internal links
  const suggestions = [
    `/${a.page.locale}/contacts/`,
    `/${a.page.locale}/products/lighters/`,
    `/${a.page.locale}/products/pens/`,
    `/${a.page.locale}/products/notebooks/`,
    `/${a.page.locale}/products/powerbanks/`,
    `/${a.page.locale}/products/neo-watches/`,
  ]
  const existingHrefs = collectInternalHrefs((a.page.blocks as any) || [])
  const missing = suggestions.filter((s) => !existingHrefs.some((h) => h === s || h === s.replace(/\/$/, '')))

  return (
    <section style={{ marginTop: 36 }}>
      <h2>
        🎯 {a.page.slug}{' '}
        <span style={{ color: gradeColor(a.score.grade) }}>
          {a.score.percent}% {a.score.grade}
        </span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={panel}>
          <h3 style={{ marginTop: 0 }}>SERP Preview</h3>
          <div
            style={{
              background: '#fff',
              color: '#111',
              padding: 16,
              borderRadius: 8,
              fontFamily: 'arial, sans-serif',
            }}
          >
            <div style={{ color: '#202124', fontSize: 14 }}>
              {BASE} › {a.page.locale}{' '}
              <span style={{ color: '#5f6368' }}>› {a.page.slug}</span>
            </div>
            <div style={{ color: '#1a0dab', fontSize: 20, marginTop: 4, lineHeight: 1.3 }}>
              {truncateForSerp(title, 60)}
            </div>
            <div style={{ color: '#4d5156', fontSize: 14, marginTop: 4 }}>
              {truncateForSerp(desc, 158) || '— meta description пусто —'}
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <a style={btnPrimary} href={editUrl} target="_blank">
              ✎ Edit in Keystatic
            </a>
            <a style={btn} href={liveUrl} target="_blank">
              ↗ Open Live Page
            </a>
          </div>
        </div>

        <div style={panel}>
          <h3 style={{ marginTop: 0 }}>Language Pair</h3>
          <p style={{ color: '#9aa8c4', fontSize: 14 }}>
            Current: <code>{a.page.locale}</code> · slug <code>{a.page.slug}</code>
          </p>
          <p style={{ color: '#9aa8c4', fontSize: 14 }}>
            Paired RU: <code>{a.page.alternateSlug?.ru || '—'}</code>
            <br />
            Paired UZ: <code>{a.page.alternateSlug?.uz || '—'}</code>
          </p>
          {!a.page.alternateSlug?.[a.page.locale === 'ru' ? 'uz' : 'ru'] && (
            <div style={{ ...warnBox, marginTop: 10 }}>
              ⚠ Языковой пары нет. {a.page.locale === 'ru' ? 'Создай UZ-версию' : 'Создай RU-версию'}{' '}
              через{' '}
              <a style={link} href="/admin-tools/translate/">
                Translate RU→UZ
              </a>
              .
            </div>
          )}
        </div>
      </div>

      <div style={{ ...panel, marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>SEO Checks</h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {a.checks.map((c) => (
            <li
              key={c.id}
              style={{
                display: 'flex',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid #1f2a44',
              }}
              title={c.why}
            >
              <span style={{ width: 24, color: c.pass ? '#5eead4' : severityColor(c.severity) }}>
                {c.pass ? '✓' : '✘'}
              </span>
              <span style={{ flex: 1 }}>
                <strong>{c.label}</strong>
                {c.detail && <span style={{ color: '#9aa8c4', marginLeft: 8 }}>— {c.detail}</span>}
              </span>
              <span style={{ color: severityColor(c.severity), fontSize: 12 }}>{c.severity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ ...panel, marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Internal Linking Assistant</h3>
        <p style={{ color: '#9aa8c4', fontSize: 14 }}>
          В блоках CTA / Hero / Кнопках можно добавить ссылки на:
        </p>
        <ul style={{ color: '#9aa8c4' }}>
          {missing.length === 0 && <li style={{ color: '#5eead4' }}>✓ Все ключевые продукты уже залинкованы.</li>}
          {missing.map((href) => (
            <li key={href}>
              <code style={mono}>{href}</code>
            </li>
          ))}
        </ul>
        <p style={{ color: '#9aa8c4', fontSize: 13, marginTop: 12 }}>
          Существующие ссылки на странице: {existingHrefs.length ? existingHrefs.map((h, i) => <code key={i} style={{ ...mono, marginRight: 6 }}>{h}</code>) : <em>нет</em>}
        </p>
      </div>

      <div style={{ ...panel, marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Orphan / Inbound Links</h3>
        {inbound.length === 0 ? (
          <div style={warnBox}>
            ⚠ Никто не ссылается на эту страницу — orphan. Добавь ссылку из главной (homepage benefits/services CTA),
            блога или связанной money page.
          </div>
        ) : (
          <ul style={{ color: '#9aa8c4' }}>
            {inbound.map((s) => (
              <li key={s}><code style={mono}>{s}</code></li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ ...panel, marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Publish Checklist</h3>
        <ol style={{ color: '#9aa8c4', lineHeight: 1.9 }}>
          <li>H1, intro, SEO title и description заполнены.</li>
          <li>Title 30-65 символов, description 120-165.</li>
          <li>OG-картинка 1200×630 указана (или используется дефолтная).</li>
          <li>Есть хотя бы один FAQ-блок и один CTA-блок.</li>
          <li>В alternateSlug.uz / alternateSlug.ru прописана пара.</li>
          <li>Не включён noindex.</li>
          <li>Есть ссылки на /contacts/ и хотя бы один продукт.</li>
          <li>Страница залинкована откуда-то (не orphan).</li>
          <li>Статус → Опубликовано → ждём 1-3 минуты на Cloudflare deploy.</li>
        </ol>
      </div>
    </section>
  )
}

function collectInternalHrefsFromAny(blocks: any[]): string[] {
  const hrefs: string[] = []
  for (const b of blocks || []) {
    const v = b.value || {}
    if (typeof v.ctaHref === 'string') hrefs.push(v.ctaHref)
    if (typeof v.buttonHref === 'string') hrefs.push(v.buttonHref)
  }
  return hrefs
}

function Stat({ label, value, accent = '#5eead4' }: { label: string; value: string; accent?: string }) {
  return (
    <div
      style={{
        background: '#0d1830',
        border: '1px solid #1f2a44',
        borderRadius: 10,
        padding: 16,
      }}
    >
      <div style={{ color: '#9aa8c4', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent, marginTop: 6 }}>{value}</div>
    </div>
  )
}

// ─── styles ─────────────────────────────────────────────────────────
const panel: React.CSSProperties = { background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 12, padding: 20 }
const tableWrap: React.CSSProperties = { overflowX: 'auto', background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 12 }
const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #1f2a44', color: '#9aa8c4', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }
const td: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid #11192b', color: '#e6edf3' }
const link: React.CSSProperties = { color: '#9ec1ff', textDecoration: 'none' }
const mono: React.CSSProperties = { background: '#1f2a44', padding: '1px 6px', borderRadius: 4, fontSize: 12 }
const warnBox: React.CSSProperties = { background: '#3a1f10', border: '1px solid #ffb86b', color: '#ffd9a8', padding: '10px 12px', borderRadius: 8, fontSize: 14 }
const btn: React.CSSProperties = { display: 'inline-block', padding: '8px 14px', background: '#1f2a44', color: '#e6edf3', border: 0, borderRadius: 8, textDecoration: 'none', fontSize: 14 }
const btnPrimary: React.CSSProperties = { ...btn, background: '#5eead4', color: '#0b1220', fontWeight: 700 }

// avoid unused warning
void collectInternalHrefsFromAny
