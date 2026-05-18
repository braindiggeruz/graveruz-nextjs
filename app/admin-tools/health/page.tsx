/**
 * Health dashboard for Graver Studio operators.
 *
 * Token-gated. Shows:
 *   - homepage CMS shape (hero, stats, services, portfolio, FAQ, SEO, OG)
 *   - aggregate counts from the SEO snapshot (money pages, stories,
 *     noindex, missing UZ pairs, warnings)
 *   - admin token configuration status (configured / not, NO value shown)
 *   - quick links to Stories Audit, Publish Checklist, Redirects,
 *     Keystatic homepage edit, GitHub content file
 *
 * No secrets are ever rendered. The token is only checked for presence
 * (process.env.ADMIN_TOOLS_TOKEN !== undefined).
 */
import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from '../_components/TokenForm'
import {
  getSnapshotPages,
  getSnapshotStories,
  getSnapshotMeta,
} from '@/lib/seo-snapshot'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse as parseYaml } from 'yaml'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const REPO = 'braindiggeruz/graveruz-nextjs'

function loadHomepage(): any {
  try {
    const p = resolve(process.cwd(), 'content', 'homepage', 'index.yaml')
    if (!existsSync(p)) return null
    return parseYaml(readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

function ok(b: boolean) {
  return b ? <span style={{ color: '#5eead4' }}>✓ ok</span> : <span style={{ color: '#ff6b6b' }}>✘ missing</span>
}

export default async function HealthPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const sp = await searchParams
  const tokenConfigured = !!getServerToken()
  if (!tokenConfigured) {
    return (
      <div style={panel}>
        <h1 style={{ marginTop: 0 }}>Admin tools health</h1>
        <p style={{ color: '#ffb86b' }}>
          <strong>Admin tools token is not configured.</strong>
        </p>
        <p style={{ color: '#9aa8c4' }}>
          Set <code style={mono}>ADMIN_TOOLS_TOKEN</code> as an encrypted production environment variable in Cloudflare:
        </p>
        <ol style={{ color: '#9aa8c4', lineHeight: 1.9 }}>
          <li>Cloudflare → Workers &amp; Pages → <strong>graveruz-nextjs</strong></li>
          <li>Settings → Environment variables → Production</li>
          <li>Add variable → name <code style={mono}>ADMIN_TOOLS_TOKEN</code>, type <strong>Encrypt</strong></li>
          <li>Trigger a redeploy.</li>
        </ol>
        <p style={{ color: '#9aa8c4' }}>
          Or via Wrangler: <code style={mono}>wrangler pages secret put ADMIN_TOOLS_TOKEN --project-name graveruz-nextjs</code>
        </p>
      </div>
    )
  }
  if (!(await isAuthed(sp.token))) return <TokenForm />

  // ── Homepage CMS shape ─────────────────────────────────────────
  const home = loadHomepage()
  const hero = home?.hero || {}
  const stats = Array.isArray(hero.stats) ? hero.stats : []
  const services = Array.isArray(home?.services) ? home.services : []
  const portfolio = Array.isArray(home?.portfolio) ? home.portfolio : []
  const steps = Array.isArray(home?.processSteps) ? home.processSteps : []
  const faq = Array.isArray(home?.faq) ? home.faq : []
  const seo = home?.seo || {}

  const homeChecks = [
    { k: 'hero.titleRu', v: !!hero.titleRu },
    { k: 'hero.titleUz', v: !!hero.titleUz },
    { k: 'hero.titleAccentRu', v: !!hero.titleAccentRu },
    { k: 'hero.titleAccentUz', v: !!hero.titleAccentUz },
    { k: 'hero.subtitleRu', v: !!hero.subtitleRu },
    { k: 'hero.subtitleUz', v: !!hero.subtitleUz },
    { k: 'hero.ctaPrimaryRu', v: !!hero.ctaPrimaryRu },
    { k: 'hero.ctaPrimaryUz', v: !!hero.ctaPrimaryUz },
    { k: 'hero.ctaPrimaryHrefRu', v: !!hero.ctaPrimaryHrefRu },
    { k: 'hero.ctaPrimaryHrefUz', v: !!hero.ctaPrimaryHrefUz },
    { k: 'hero.stats >= 4', v: stats.length >= 4 },
    { k: 'services >= 5', v: services.length >= 5 },
    { k: 'portfolio >= 4', v: portfolio.length >= 4 },
    { k: 'processSteps >= 3', v: steps.length >= 3 },
    { k: 'faq >= 5', v: faq.length >= 5 },
    { k: 'seo.titleRu', v: !!(seo.titleRu || seo.title) },
    { k: 'seo.titleUz', v: !!(seo.titleUz || seo.titleRu || seo.title) },
    { k: 'seo.descriptionRu', v: !!(seo.descriptionRu || seo.description) },
    { k: 'seo.descriptionUz', v: !!(seo.descriptionUz || seo.descriptionRu || seo.description) },
    { k: 'seo.ogTitleRu (opt)', v: !!seo.ogTitleRu },
    { k: 'seo.ogTitleUz (opt)', v: !!seo.ogTitleUz },
    { k: 'seo.ogDescriptionRu (opt)', v: !!seo.ogDescriptionRu },
    { k: 'seo.ogDescriptionUz (opt)', v: !!seo.ogDescriptionUz },
    { k: 'seo.ogImage', v: !!seo.ogImage },
    { k: 'seo.noindex = false', v: seo.noindex !== true },
  ]
  const homeFail = homeChecks.filter((c) => !c.v).length

  // ── Snapshot aggregates ─────────────────────────────────────────
  const pages = getSnapshotPages()
  const stories = getSnapshotStories()
  const meta = getSnapshotMeta()

  const moneyPagesPublished = pages.filter((p) => p.status === 'published').length
  const pagesNoindex = pages.filter((p) => !!p.seo?.noindex).length
  const storiesPublished = stories.length
  const storiesNoindex = stories.filter((s) => !!s.noindex).length
  const storiesMissingPair = stories.filter((s) =>
    s.locale === 'ru' ? !s.alternateUz : !s.alternateRu,
  ).length
  const storiesThin = stories.filter((s) => (s.wordCount || 0) < 200).length
  const storiesNoFaq = stories.filter((s) => !s.hasFaq).length

  const tokenSummary = `configured: yes · server-validated · value not displayed`
  const homeEditUrl = `/keystatic/branch/main/singleton/homepage`
  const githubYamlUrl = `https://github.com/${REPO}/blob/main/content/homepage/index.yaml`

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>System Health</h1>
      <p style={{ color: '#9aa8c4' }}>
        Live status snapshot for Graver.uz. Snapshot generated at{' '}
        <strong>{meta.generatedAt || 'unknown'}</strong>.
      </p>

      {/* Top KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, margin: '18px 0' }}>
        <Kpi label="Money pages published" value={moneyPagesPublished} />
        <Kpi label="Stories published" value={storiesPublished} />
        <Kpi label="Pages w/ noindex" value={pagesNoindex} severity={pagesNoindex > 0 ? 'warn' : 'ok'} />
        <Kpi label="Stories w/ noindex" value={storiesNoindex} severity={storiesNoindex > 0 ? 'warn' : 'ok'} />
        <Kpi label="Stories missing UZ pair" value={storiesMissingPair} severity={storiesMissingPair > 5 ? 'warn' : 'ok'} />
        <Kpi label="Thin stories (<200w)" value={storiesThin} severity={storiesThin > 0 ? 'warn' : 'ok'} />
        <Kpi label="Stories without FAQ" value={storiesNoFaq} severity={storiesNoFaq > 10 ? 'warn' : 'ok'} />
        <Kpi label="Homepage CMS errors" value={homeFail} severity={homeFail > 0 ? 'critical' : 'ok'} />
      </div>

      {/* Token panel */}
      <section style={{ ...panel, marginBottom: 18 }}>
        <h2 style={h2}>Admin tools token</h2>
        <p style={{ margin: 0, color: '#9aa8c4' }}>{tokenSummary}</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#5a6a87' }}>
          Token value is never rendered on this page or in build artifacts.
        </p>
      </section>

      {/* Homepage CMS shape */}
      <section style={{ ...panel, marginBottom: 18 }}>
        <h2 style={h2}>Homepage CMS shape (content/homepage/index.yaml)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 6 }}>
          {homeChecks.map((c) => (
            <div key={c.k} style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #11192b', padding: '4px 0' }}>
              <span style={{ color: '#cbd5ea', fontFamily: 'monospace', fontSize: 12 }}>{c.k}</span>
              <span>{ok(c.v)}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 12, color: '#9aa8c4' }}>
          Counts: stats={stats.length}, services={services.length}, portfolio={portfolio.length}, processSteps={steps.length}, faq={faq.length}
        </p>
      </section>

      {/* Build / deploy info */}
      <section style={{ ...panel, marginBottom: 18 }}>
        <h2 style={h2}>Build &amp; deploy</h2>
        <ul style={listReset}>
          <li><strong>Snapshot generated at:</strong> <code style={mono}>{meta.generatedAt || '—'}</code></li>
          <li><strong>Pages in snapshot:</strong> {pages.length}</li>
          <li><strong>Stories in snapshot:</strong> {stories.length}</li>
        </ul>
        <p style={{ marginTop: 12, fontSize: 13, color: '#9aa8c4' }}>
          Deployment status is managed by Cloudflare Pages. See:{' '}
          <a style={link} href="https://dash.cloudflare.com/?to=/:account/pages/view/graveruz-nextjs" target="_blank" rel="noopener">
            Cloudflare Pages dashboard ↗
          </a>
        </p>
      </section>

      {/* Quick links */}
      <section style={panel}>
        <h2 style={h2}>Quick links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
          <QuickLink href={`/admin-tools/stories/${sp.token ? `?token=${encodeURIComponent(sp.token)}` : ''}`} title="Stories Audit" desc="139 статей · фильтры noindex, canonical, no-date, thin, missing-pair" />
          <QuickLink href={`/admin-tools/publish-checklist/${sp.token ? `?token=${encodeURIComponent(sp.token)}` : ''}`} title="Publish Checklist" desc="Pre-flight для отправки в GSC" />
          <QuickLink href={`/admin-tools/redirects/${sp.token ? `?token=${encodeURIComponent(sp.token)}` : ''}`} title="Redirects" desc="previousSlugs → canonical 301 viewer" />
          <QuickLink href={`/admin-tools/seo-cockpit/${sp.token ? `?token=${encodeURIComponent(sp.token)}` : ''}`} title="SEO Cockpit" desc="Поиск + аудит money pages" />
          <QuickLink href={`/admin-tools/coverage/${sp.token ? `?token=${encodeURIComponent(sp.token)}` : ''}`} title="RU↔UZ Coverage" desc="Какие RU-статьи не имеют UZ-пары" />
          <QuickLink href={homeEditUrl} title="Edit homepage" desc="Keystatic → Главная" external />
          <QuickLink href={githubYamlUrl} title="content/homepage/index.yaml" desc="GitHub raw view" external />
          <QuickLink href="https://search.google.com/search-console" title="Google Search Console" desc="Submit URLs · inspect · coverage" external />
        </div>
      </section>
    </div>
  )
}

function Kpi({ label, value, severity = 'ok' as 'ok' | 'warn' | 'critical' }: { label: string; value: number; severity?: 'ok' | 'warn' | 'critical' }) {
  const c = { ok: '#5eead4', warn: '#ffe066', critical: '#ff6b6b' }[severity]
  return (
    <div style={{ background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 11, color: '#9aa8c4', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: c, marginTop: 6 }}>{value}</div>
    </div>
  )
}

function QuickLink({ href, title, desc, external = false }: { href: string; title: string; desc: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      style={{
        display: 'block',
        background: '#0d1830',
        border: '1px solid #1f2a44',
        borderRadius: 10,
        padding: 14,
        textDecoration: 'none',
        color: '#e6edf3',
      }}
    >
      <strong style={{ color: '#9ec1ff', fontSize: 14 }}>
        {title} {external ? '↗' : '→'}
      </strong>
      <p style={{ margin: '6px 0 0', color: '#9aa8c4', fontSize: 12 }}>{desc}</p>
    </a>
  )
}

const panel: React.CSSProperties = { background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 12, padding: 18 }
const h2: React.CSSProperties = { marginTop: 0, marginBottom: 12, fontSize: 16 }
const listReset: React.CSSProperties = { listStyle: 'none', padding: 0, margin: 0, color: '#cbd5ea', fontSize: 13, lineHeight: 1.9 }
const link: React.CSSProperties = { color: '#9ec1ff', textDecoration: 'none' }
const mono: React.CSSProperties = { background: '#1f2a44', padding: '1px 6px', borderRadius: 4, fontSize: 12 }
