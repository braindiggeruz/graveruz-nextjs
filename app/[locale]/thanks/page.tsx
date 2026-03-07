import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, getLocaleUrl, type Locale } from '@/lib/i18n'


interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = isValidLocale(resolvedParams.locale) ? (resolvedParams.locale as Locale) : 'ru'
  const canonicalUrl = getLocaleUrl(locale, 'thanks')
  const titleText = locale === 'uz'
    ? 'Rahmat — Graver.uz'
    : 'Спасибо за заявку — Graver.uz'

  return {
    title: { absolute: titleText },
    alternates: { canonical: canonicalUrl },
    robots: { index: false, follow: false },
  }
}

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

export default async function ThanksPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const messages = getMessages(locale)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">{messages.thanks.title}</h1>
        <p className="text-gray-400 mb-8">{messages.thanks.description}</p>
        <Link
          href={`/${locale}`}
          className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {messages.thanks.back_home}
        </Link>
      </div>
    </div>
  )
}
