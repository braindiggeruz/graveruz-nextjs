import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { localBusinessSchema, breadcrumbSchema } from '@/components/SchemaOrg'
import ContactForm from '@/components/ContactForm'

export const runtime = 'edge'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale

  if (locale === 'ru') {
    return buildMetadata({
      locale,
      path: 'contacts',
      title: 'Контакты — Graver.uz',
      description: 'Свяжитесь с Graver.uz: телефон, Telegram, адрес в Ташкенте. Работаем с B2B-клиентами по всему Узбекистану.',
    })
  }

  return buildMetadata({
    locale,
    path: 'contacts',
    title: "Aloqa — Graver.uz",
    description: "Graver.uz bilan bog'laning: telefon, Telegram, Toshkentdagi manzil. O'zbekiston bo'ylab B2B-mijozlar bilan ishlaymiz.",
  })
}

export default async function ContactsPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const messages = getMessages(locale)
  const isRu = locale === 'ru'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}` },
    { name: messages.contact.title, url: `https://graver-studio.uz/${locale}/contacts` },
  ]

  return (
    <>
      <SchemaOrg schema={[localBusinessSchema(), breadcrumbSchema(breadcrumbs)]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><Link href={`/${locale}`} className="hover:text-teal-500">Graver.uz</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-gray-300">{messages.contact.title}</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold text-white mb-8">{messages.contact.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                {isRu ? 'Телефоны' : 'Telefonlar'}
              </h2>
              <div className="space-y-2">
                <a href="tel:+998770802288" data-track="tel" data-placement="contacts" className="block text-teal-500 hover:text-teal-400 text-lg font-semibold transition">
                  +998 77 080 22 88
                </a>
                <a href="tel:+998974802288" data-track="tel" data-placement="contacts" className="block text-gray-300 hover:text-teal-500 transition">
                  +998 97 480 22 88
                </a>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Telegram</h2>
              <a
                href="https://t.me/GraverAdm"
                data-track="tg" data-placement="contacts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-400 transition text-lg"
              >
                @GraverAdm
              </a>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                {isRu ? 'Адрес' : 'Manzil'}
              </h2>
              <address className="text-gray-300 not-italic">
                {isRu ? 'Ташкент, ул. Мукими' : "Toshkent, Mukimiy ko'chasi"}
              </address>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                {isRu ? 'Режим работы' : 'Ish vaqti'}
              </h2>
              <p className="text-gray-300">
                {isRu ? 'Пн–Сб: 09:00–18:00' : 'Du–Shan: 09:00–18:00'}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm locale={locale} />
        </div>
      </div>
    </>
  )
}
