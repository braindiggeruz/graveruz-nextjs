import { NextResponse } from 'next/server'
import { ADMIN_TOKEN_COOKIE, getServerToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const server = getServerToken()
  if (!server) {
    return NextResponse.json(
      { error: 'ADMIN_TOOLS_TOKEN is not configured on the server.' },
      { status: 503 }
    )
  }
  let body: { token?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.token || body.token !== server) {
    return NextResponse.json({ error: 'Неверный токен' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: ADMIN_TOKEN_COOKIE,
    value: server,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14, // 14 days
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: ADMIN_TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
