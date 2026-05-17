/**
 * Admin Tools landing page — shows status + entry points.
 * Token gate: ?token=... sets cookie via /api/admin-tools/login.
 */
import Link from 'next/link'
import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from './_components/TokenForm'

export const dynamic = 'force-dynamic'

export default async function AdminToolsHome({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const sp = await searchParams
  const serverToken = getServerToken()
  if (!serverToken) {
    return (
      <div style={{ padding: 24, background: '#321319', border: '1px solid #ff6b6b', borderRadius: 12 }}>
        <h1 style={{ margin: 0, color: '#ffbab8' }}>Admin Tools отключены</h1>
        <p style={{ marginTop: 12, color: '#fcd5d3' }}>
          Установи переменную окружения <code style={mono}>ADMIN_TOOLS_TOKEN</code> в Cloudflare Pages
          (Settings → Environment variables → Production, тип <em>Secret</em>) — минимум 8 символов.
        </p>
        <p style={{ marginTop: 12, color: '#fcd5d3' }}>
          Затем перезапусти деплой. После этого открой эту страницу с <code style={mono}>?token=…</code>.
        </p>
      </div>
    )
  }
  const authed = await isAuthed(sp.token)
  if (!authed) return <TokenForm />

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Admin Tools</h1>
      <p style={{ color: '#9aa8c4' }}>
        Низкоуровневые инструменты управления контентом и SEO для Graver Studio. Все изменения уходят
        в GitHub и автоматически деплоятся через Cloudflare Pages.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginTop: 32,
        }}
      >
        <Card
          href="/admin-tools/seo-cockpit/"
          title="SEO Cockpit"
          desc="Score, SERP preview, language pair, orphan detection, image SEO, internal linking — для всех Pages, Products, Stories."
          tag="Read-only"
        />
        <Card
          href="/admin-tools/translate/"
          title="Translate RU → UZ"
          desc="Создание перевода страницы через Translation Job + GitHub Action + Gemini. Открой Keystatic → SEO-инструменты → Переводы (RU → UZ)."
          tag="Workflow"
        />
        <Card
          href="/keystatic/"
          title="Keystatic CMS"
          desc="Главная админка контента: страницы, продукты, блог, настройки."
          tag="CMS"
        />
      </div>

      <section style={{ marginTop: 48 }}>
        <h2>Полезные ссылки</h2>
        <ul style={{ lineHeight: '2', color: '#9aa8c4' }}>
          <li>
            <a style={link} href="https://graver-studio.uz/sitemap.xml" target="_blank">/sitemap.xml</a>{' '}— проверка индексации
          </li>
          <li>
            <a style={link} href="https://graver-studio.uz/robots.txt" target="_blank">/robots.txt</a>
          </li>
          <li>
            <a style={link} href="https://graver-studio.uz/image-sitemap.xml" target="_blank">/image-sitemap.xml</a>
          </li>
          <li>
            <a style={link} href="https://github.com/braindiggeruz/graveruz-nextjs/actions" target="_blank">
              GitHub Actions
            </a>{' '}— очередь переводов
          </li>
        </ul>
      </section>
    </div>
  )
}

function Card({ href, title, desc, tag }: { href: string; title: string; desc: string; tag: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        padding: 20,
        borderRadius: 12,
        background: '#0d1830',
        border: '1px solid #1f2a44',
        color: 'inherit',
        textDecoration: 'none',
        transition: 'border-color .15s, transform .15s',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          padding: '2px 8px',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1,
          background: '#163349',
          color: '#5eead4',
          borderRadius: 4,
        }}
      >
        {tag}
      </span>
      <h3 style={{ margin: '12px 0 6px' }}>{title}</h3>
      <p style={{ margin: 0, color: '#9aa8c4', fontSize: 14 }}>{desc}</p>
    </Link>
  )
}

const link: React.CSSProperties = { color: '#9ec1ff' }
const mono: React.CSSProperties = { background: '#1f2a44', padding: '2px 6px', borderRadius: 4, fontSize: 13 }
