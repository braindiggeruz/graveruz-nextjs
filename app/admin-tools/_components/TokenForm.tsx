'use client'
import { useState } from 'react'

export function TokenForm() {
  const [token, setToken] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    const res = await fetch('/api/admin-tools/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    setLoading(false)
    if (res.ok) {
      window.location.href = '/admin-tools/'
    } else {
      const j = await res.json().catch(() => ({}))
      setErr(j.error || 'Неверный токен')
    }
  }

  return (
    <form
      onSubmit={submit}
      style={{
        maxWidth: 420,
        margin: '64px auto',
        padding: 28,
        borderRadius: 12,
        background: '#0d1830',
        border: '1px solid #1f2a44',
      }}
    >
      <h1 style={{ marginTop: 0 }}>Admin Tools — вход</h1>
      <p style={{ color: '#9aa8c4', fontSize: 14 }}>
        Введите ADMIN_TOOLS_TOKEN. Токен задаёт владелец в Cloudflare Pages env.
      </p>
      <input
        type="password"
        autoComplete="off"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Токен"
        style={{
          width: '100%',
          padding: '10px 12px',
          marginTop: 12,
          background: '#0b1220',
          color: '#e6edf3',
          border: '1px solid #1f2a44',
          borderRadius: 8,
          fontSize: 16,
        }}
        data-testid="admin-tools-token-input"
      />
      {err && (
        <div style={{ marginTop: 10, color: '#ff8a8a', fontSize: 14 }} data-testid="admin-tools-error">
          {err}
        </div>
      )}
      <button
        type="submit"
        disabled={loading || !token}
        style={{
          marginTop: 14,
          padding: '10px 16px',
          background: '#5eead4',
          color: '#0b1220',
          border: 0,
          borderRadius: 8,
          fontWeight: 700,
          cursor: 'pointer',
          width: '100%',
          fontSize: 15,
        }}
        data-testid="admin-tools-token-submit"
      >
        {loading ? 'Проверка…' : 'Войти'}
      </button>
    </form>
  )
}
