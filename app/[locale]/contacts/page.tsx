import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, getMessages, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { localBusinessSchema, breadcrumbSchema } from '@/components/SchemaOrg'
import ContactForm from '@/components/ContactForm'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale

  if (locale === 'ru') {
    return buildMetadata({
      locale,
      path: 'contacts',
      title: 'Контакты — Лазерная гравировка в Ташкенте | Graver.uz',
      description: 'Свяжитесь с Graver.uz: телефон, WhatsApp, Telegram, адрес — ул. Мукими, 59, Ташкент. Ответ в Telegram за 15 минут. Работаем с B2B-клиентами по всему Узбекистану.',
    })
  }

  return buildMetadata({
    locale,
    path: 'contacts',
    title: "Aloqa — Toshkentda lazer o'ymakorlik | Graver.uz",
    description: "Graver.uz bilan bog'laning: telefon, WhatsApp, Telegram, manzil — Mukimiy ko'chasi, 59, Toshkent. Telegramda 15 daqiqada javob. O'zbekiston bo'ylab B2B-mijozlar bilan ishlaymiz.",
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
              <h2 className="text-xl font-semibold text-white mb-4">WhatsApp</h2>
              <a
                href="https://wa.me/998770802288"
                data-track="wa" data-placement="contacts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-400 transition text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.366l-.36-.214-3.727.977.994-3.634-.234-.374A9.818 9.818 0 1112 21.818zm5.472-7.436c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                +998 77 080 22 88
              </a>
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
              <p className="text-gray-400 text-sm mt-2">
                {isRu ? 'Обычно отвечаем в течение 15 минут' : "Odatda 15 daqiqa ichida javob beramiz"}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                {isRu ? 'Адрес' : 'Manzil'}
              </h2>
              <address className="text-gray-300 not-italic">
                {isRu ? 'Ташкент, ул. Мукими, 59' : "Toshkent, Mukimiy ko'chasi, 59"}
              </address>
              <p className="text-gray-400 text-sm mt-2">
                {isRu ? 'Рядом с метро Амира Темура' : "Amir Temur metro bekatiga yaqin"}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                {isRu ? 'Режим работы' : 'Ish vaqti'}
              </h2>
              <p className="text-gray-300">
                {isRu ? 'Пн–Сб: 09:00–18:00' : 'Du–Shan: 09:00–18:00'}
              </p>
              <p className="text-teal-500 text-sm mt-1 font-semibold">
                {isRu ? 'Заявки принимаем 24/7' : 'Arizalar 24/7 qabul qilinadi'}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm locale={locale} />
        </div>

        {/* Google Maps */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            {isRu ? 'Как нас найти' : 'Bizni qanday topish mumkin'}
          </h2>
          <div className="rounded-xl overflow-hidden border border-gray-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.5!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b4a8b4b4b4b%3A0x0!2zNDHCsDE3JzU4LjIiTiA2OcKwMTQnMjQuNCJF!5e0!3m2!1sru!2suz!4v1709800000000!5m2!1sru!2suz"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={isRu ? 'Graver.uz на карте — Ташкент, ул. Мукими, 59' : "Graver.uz xaritada — Toshkent, Mukimiy ko'chasi, 59"}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {isRu
              ? 'Ташкент, ул. Мукими, 59 — рядом с метро Амира Темура'
              : "Toshkent, Mukimiy ko'chasi, 59 — Amir Temur metro bekatiga yaqin"}
          </p>
        </div>
      </div>
    </>
  )
}
