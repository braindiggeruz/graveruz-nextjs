import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { localBusinessSchema, breadcrumbSchema } from '@/components/SchemaOrg'

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
      title: 'Контакты — Graver.uz | Лазерная гравировка в Ташкенте',
      description: 'Свяжитесь с Graver.uz: телефон, Telegram, адрес в Ташкенте. Работаем с B2B-клиентами по всему Узбекистану.',
    })
  }

  return buildMetadata({
    locale,
    path: 'contacts',
    title: "Aloqa — Graver.uz | Toshkentda lazer o'ymakorlik",
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
                <a href="tel:+998770802288" className="block text-teal-500 hover:text-teal-400 text-lg font-semibold transition">
                  +998 77 080 22 88
                </a>
                <a href="tel:+998974802288" className="block text-gray-300 hover:text-teal-500 transition">
                  +998 97 480 22 88
                </a>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Telegram</h2>
              <a
                href="https://t.me/GraverAdm"
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

          {/* CTA */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              {isRu ? 'Напишите нам' : 'Bizga yozing'}
            </h2>
            <p className="text-gray-400 mb-6">
              {isRu
                ? 'Ответим в течение 30 минут в рабочее время. Для срочных вопросов — звоните.'
                : "Ish vaqtida 30 daqiqa ichida javob beramiz. Shoshilinch savollar uchun — qo'ng'iroq qiling."}
            </p>
            <div className="space-y-4">
              <a
                href="https://t.me/GraverAdm"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-lg font-semibold hover:opacity-90 transition"
              >
                {isRu ? 'Написать в Telegram' : "Telegramga yozish"}
              </a>
              <a
                href="tel:+998770802288"
                className="block w-full text-center border border-teal-500 text-teal-500 px-6 py-4 rounded-lg font-semibold hover:bg-teal-500 hover:text-white transition"
              >
                {isRu ? 'Позвонить' : "Qo'ng'iroq qilish"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
