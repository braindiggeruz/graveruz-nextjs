import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, getHtmlLang, type Locale } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const messages = getMessages(resolvedParams.locale as Locale)
  return {
    title: {
      default: `${messages.site.name} — ${messages.site.tagline}`,
      template: `%s | ${messages.site.name}`,
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const validLocale = locale as Locale
  const messages = getMessages(validLocale)
  const htmlLang = getHtmlLang(validLocale)

  return (
    <html lang={htmlLang} className="scroll-smooth">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* System font stack — no external font fetch needed for performance */}
      </head>
      <body className="bg-black text-white min-h-screen antialiased">
        <Header locale={validLocale} messages={messages} />
        <main id="main-content" className="pt-20">
          {children}
        </main>
        <Footer locale={validLocale} messages={messages} />
      </body>
    </html>
  )
}
