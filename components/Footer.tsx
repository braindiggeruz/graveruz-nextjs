import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

interface FooterProps {
  locale: Locale
  messages: {
    nav: { blog: string; contacts: string; services: string; products: string }
    footer: {
      description: string
      rights: string
      address: string
      phone1: string
      phone2: string
    }
  }
}

export default function Footer({ locale, messages }: FooterProps) {
  const { footer, nav } = messages
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold text-white">
                Graver<span className="text-teal-500">.uz</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">{footer.description}</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'ru' ? 'Навигация' : 'Navigatsiya'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}#services`} className="text-gray-400 hover:text-teal-500 text-sm transition">
                  {nav.services}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalog-products`} className="text-gray-400 hover:text-teal-500 text-sm transition">
                  {nav.products}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-gray-400 hover:text-teal-500 text-sm transition">
                  {nav.blog}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contacts`} className="text-gray-400 hover:text-teal-500 text-sm transition">
                  {nav.contacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'ru' ? 'Контакты' : 'Aloqa'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="tel:+998770802288" className="text-gray-400 hover:text-teal-500 text-sm transition">
                  {footer.phone1}
                </a>
              </li>
              <li>
                <a href="tel:+998974802288" className="text-gray-400 hover:text-teal-500 text-sm transition">
                  {footer.phone2}
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/GraverAdm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-teal-500 text-sm transition"
                >
                  Telegram
                </a>
              </li>
              <li className="text-gray-500 text-sm">{footer.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {year} Graver.uz. {footer.rights}.
          </p>
        </div>
      </div>
    </footer>
  )
}
