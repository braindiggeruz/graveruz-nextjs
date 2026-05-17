/**
 * Admin Tools landing — simple 3-actions dashboard + SEO blockers summary.
 */
import Link from 'next/link'
import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from './_components/TokenForm'
import { getSnapshotPages, getSnapshotMeta } from '@/lib/seo-snapshot'
import { auditPage, scorePage, NAV_LINKED_SLUGS } from '@/lib/seo-score'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function hasBlock(blocks: any[], t: string) {
  return (blocks || []).some((b) => b.discriminant === t)
}
function collectHrefs(blocks: any[]) {
  const out: string[] = []
  for (const b of blocks || []) {
    const v = b?.value || {}
    if (typeof v.ctaHref === 'string') out.push(v.ctaHref)
    if (typeof v.buttonHref === 'string') out.push(v.buttonHref)
  }
  return out
}

export default async function AdminToolsHome({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const sp = await searchParams
  if (!getServerToken()) {
    return (
      <div style={{ padding: 24, background: '#321319', border: '1px solid #ff6b6b', borderRadius: 12 }}>
        <h1 style={{ margin: 0, color: '#ffbab8' }}>Admin Tools отключены</h1>
        <p style={{ marginTop: 12, color: '#fcd5d3' }}>
          Установи переменную окружения <code style={mono}>ADMIN_TOOLS_TOKEN</code> в Cloudflare Pages
          (Settings → Environment variables → Production, тип <em>Secret</em>) — минимум 8 символов.
          Затем перезапусти деплой.
        </p>
      </div>
    )
  }
  if (!(await isAuthed(sp.token))) return <TokenForm />

  // ── Compute SEO blockers from snapshot ─────────────────────────────
  const pages = getSnapshotPages()
  const meta = getSnapshotMeta()

  const inboundBySlug: Record<string, string[]> = {}
  for (const s of NAV_LINKED_SLUGS) inboundBySlug[s] = ['(footer/nav)']
  for (const p of pages) {
    for (const h of collectHrefs(p.blocks as any)) {
      const m = h.match(/^\/(ru|uz)\/([^/?#]+)/)
      if (m && p.slug !== m[2]) (inboundBySlug[m[2]] = inboundBySlug[m[2]] || []).push(p.slug)
    }
  }

  const blockers = {
    orphan: [] as string[],
    noindex: [] as string[],
    missingPair: [] as string[],
    missingCta: [] as string[],
    missingFaq: [] as string[],
    missingOg: [] as string[],
  }
  for (const p of pages) {
    if (p.status !== 'published') continue
    const inbound = inboundBySlug[p.slug] || []
    if (inbound.length === 0) blockers.orphan.push(p.slug)
    if (p.seo?.noindex) blockers.noindex.push(p.slug)
    const pairKey = (p.locale || 'ru') === 'ru' ? 'uz' : 'ru'
    if (!p.alternateSlug?.[pairKey as 'ru' | 'uz']) blockers.missingPair.push(p.slug)
    const blocks = (p.blocks as any[]) || []
    if (!hasBlock(blocks, 'cta')) blockers.missingCta.push(p.slug)
    if (!hasBlock(blocks, 'faq')) blockers.missingFaq.push(p.slug)
    if (!p.seo?.ogImage) blockers.missingOg.push(p.slug)
  }

  const totalBlockers =
    blockers.orphan.length +
    blockers.noindex.length +
    blockers.missingPair.length +
    blockers.missingCta.length +
    blockers.missingFaq.length +
    blockers.missingOg.length

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Admin Tools</h1>
      <p style={{ color: '#9aa8c4' }}>Низкоуровневое управление SEO и контентом. Snapshot: <code style={mono}>{meta.generatedAt}</code></p>

      {/* ── 3 big actions ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
          marginTop: 28,
        }}
      >
        <ActionCard
          step="1"
          title="Проверить SEO страниц"
          desc="Score, SERP preview, orphans, FAQ, CTA, language pair — состояние всех страниц и продуктов."
          buttonLabel="Открыть SEO Cockpit"
          href="/admin-tools/seo-cockpit/"
        />
        <ActionCard
          step="2"
          title="Создать перевод RU → UZ"
          desc="3 шага, copy-ready блоки и кнопка в Keystatic. Перевод делает Gemini, страница появляется как Draft."
          buttonLabel="Инструкция по переводу"
          href="/admin-tools/translate/"
        />
        <ActionCard
          step="3"
          title="Исправить SEO-блокеры"
          desc={
            totalBlockers === 0
              ? 'Все ключевые проверки пройдены ✓'
              : `Найдено ${totalBlockers} блокер${totalBlockers === 1 ? '' : totalBlockers < 5 ? 'а' : 'ов'}. Список ниже.`
          }
          buttonLabel="Перейти к SEO Cockpit"
          href="/admin-tools/seo-cockpit/"
          accent={totalBlockers > 0 ? '#ffb86b' : '#5eead4'}
        />
      </div>

      {/* ── SEO Blockers summary ─────────────────────────────────── */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ marginBottom: 12 }}>SEO-блокеры на опубликованных страницах</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 12,
          }}
        >
          <Blocker
            label="Orphan pages"
            count={blockers.orphan.length}
            slugs={blockers.orphan}
            why="Опубликованная страница без входящих ссылок. Google не передаёт ей вес → плохо ранжируется. Реши: добавь ссылку с главной/меню/блога."
          />
          <Blocker
            label="Noindex on published"
            count={blockers.noindex.length}
            slugs={blockers.noindex}
            why="Опубликованная money page с noindex = страница исчезает из Google. Сними noindex в Keystatic."
            critical
          />
          <Blocker
            label="Missing language pair"
            count={blockers.missingPair.length}
            slugs={blockers.missingPair}
            why="Не заполнен alternateSlug.ru или alternateSlug.uz. Google не свяжет RU↔UZ страницы (hreflang)."
          />
          <Blocker
            label="Missing CTA block"
            count={blockers.missingCta.length}
            slugs={blockers.missingCta}
            why="На money page нет CTA-блока → теряются конверсии. Добавь в page builder."
          />
          <Blocker
            label="Missing FAQ block"
            count={blockers.missingFaq.length}
            slugs={blockers.missingFaq}
            why="FAQ-блок генерирует schema.org FAQPage — Google показывает ответы прямо в выдаче."
          />
          <Blocker
            label="Missing social image"
            count={blockers.missingOg.length}
            slugs={blockers.missingOg}
            why="OG-картинка определяет превью при шеринге в Telegram / Facebook. Размер: 1200×630."
          />
        </div>
      </section>

      <section style={{ marginTop: 36 }}>
        <h3>Полезные ссылки</h3>
        <ul style={{ lineHeight: '2', color: '#9aa8c4' }}>
          <li><a style={linkStyle} href="/keystatic/" target="_blank">Keystatic CMS</a> — главная админка контента</li>
          <li><a style={linkStyle} href="/keystatic/branch/main/collection/translationJobs" target="_blank">Keystatic → Переводы RU→UZ</a></li>
          <li><a style={linkStyle} href="https://graver-studio.uz/sitemap.xml" target="_blank">/sitemap.xml</a></li>
          <li><a style={linkStyle} href="https://github.com/braindiggeruz/graveruz-nextjs/actions" target="_blank">GitHub Actions</a> — очередь переводов</li>
        </ul>
      </section>
    </div>
  )
}

function ActionCard({
  step, title, desc, buttonLabel, href, accent = '#5eead4',
}: {
  step: string; title: string; desc: string; buttonLabel: string; href: string; accent?: string
}) {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 12,
        background: '#0d1830',
        border: '1px solid #1f2a44',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 200,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#1f2a44',
            color: accent,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {step}
        </span>
        <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
      </div>
      <p style={{ color: '#9aa8c4', fontSize: 14, flex: 1, margin: '8px 0 16px' }}>{desc}</p>
      <Link
        href={href}
        style={{
          display: 'inline-block',
          textAlign: 'center',
          padding: '10px 16px',
          background: accent,
          color: '#0b1220',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {buttonLabel} →
      </Link>
    </div>
  )
}

function Blocker({
  label, count, slugs, why, critical = false,
}: { label: string; count: number; slugs: string[]; why: string; critical?: boolean }) {
  const ok = count === 0
  const color = ok ? '#5eead4' : critical ? '#ff6b6b' : '#ffb86b'
  return (
    <div
      style={{
        padding: 16,
        background: '#0d1830',
        border: `1px solid ${ok ? '#1f2a44' : color}`,
        borderRadius: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: 14 }}>{label}</strong>
        <span style={{ color, fontSize: 22, fontWeight: 700 }}>{count}</span>
      </div>
      <p style={{ color: '#9aa8c4', fontSize: 12, margin: '6px 0 0', lineHeight: 1.5 }}>{why}</p>
      {slugs.length > 0 && (
        <ul style={{ margin: '8px 0 0', paddingLeft: 16, color: '#cbd5ea', fontSize: 12 }}>
          {slugs.slice(0, 4).map((s) => (
            <li key={s}>
              <a style={linkStyle} href={`/admin-tools/seo-cockpit/?slug=${encodeURIComponent(s)}`}>{s}</a>
            </li>
          ))}
          {slugs.length > 4 && <li style={{ color: '#7a8aa8' }}>…и ещё {slugs.length - 4}</li>}
        </ul>
      )}
    </div>
  )
}

const linkStyle: React.CSSProperties = { color: '#9ec1ff', textDecoration: 'none' }
const mono: React.CSSProperties = { background: '#1f2a44', padding: '2px 6px', borderRadius: 4, fontSize: 12 }

// touch unused helpers
void scorePage; void auditPage
