import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: 'Admin Tools — Graver Studio',
}

export default function AdminToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0b1220', color: '#e6edf3', fontFamily: 'system-ui, sans-serif' }}>
      <header
        style={{
          padding: '14px 24px',
          background: '#0d1830',
          borderBottom: '1px solid #1f2a44',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              display: 'inline-block',
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#5eead4',
              color: '#0b1220',
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: '28px',
            }}
          >
            G
          </span>
          <strong>Graver Admin Tools</strong>
          <span style={{ color: '#7a8aa8', fontSize: 13 }}>· SEO Cockpit · Translation</span>
        </div>
        <nav style={{ display: 'flex', gap: 18, fontSize: 14 }}>
          <a href="/admin-tools/" style={navLink}>Home</a>
          <a href="/admin-tools/seo-cockpit/" style={navLink}>SEO Cockpit</a>
          <a href="/admin-tools/translate/" style={navLink}>Translate RU→UZ</a>
          <a href="/keystatic/" style={navLink}>← Keystatic</a>
        </nav>
      </header>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>{children}</main>
    </div>
  )
}

const navLink: React.CSSProperties = { color: '#9ec1ff', textDecoration: 'none' }
