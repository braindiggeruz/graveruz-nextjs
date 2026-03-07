import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/contact
 * Receives contact form submissions and forwards them to Telegram.
 * Falls back to a simple 200 OK if Telegram delivery fails,
 * so the user always sees a success message.
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, locale } = body

    // Basic validation
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Build Telegram message
    const text = [
      `📩 Новая заявка с сайта graver-studio.uz`,
      ``,
      `👤 Имя: ${name}`,
      `📧 Email: ${email || '—'}`,
      `📱 Телефон: ${phone}`,
      `🌐 Язык: ${locale || '—'}`,
      ``,
      `💬 Сообщение:`,
      message,
    ].join('\n')

    // Send to Telegram if credentials are configured
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text,
              parse_mode: 'HTML',
            }),
          }
        )
      } catch (tgError) {
        // Log but don't fail the request
        console.error('Telegram send failed:', tgError)
      }
    } else {
      // No Telegram credentials — log to console for now
      console.log('Contact form submission (no Telegram configured):', text)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
