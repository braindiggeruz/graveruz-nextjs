import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#14b8a6',
}

export const metadata: Metadata = {
  title: {
    default: 'Graver.uz — Лазерная гравировка и брендирование для бизнеса в Ташкенте',
    template: '%s | Graver.uz',
  },
  description: 'Корпоративные подарки, welcome-паки, VIP-наборы с лазерной гравировкой. Работаем с B2B-клиентами по всему Узбекистану.',
  metadataBase: new URL('https://graver-studio.uz'),
  // Favicon
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // lang is set per-locale in [locale]/layout.tsx
    // This root layout is minimal — actual html/body are in locale layout
    <>{children}</>
  )
}
