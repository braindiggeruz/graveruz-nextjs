import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import type { BlogPostMeta } from '@/lib/blog'

interface FooterProps {
  locale: Locale
  recentPosts?: BlogPostMeta[]
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

export default function Footer({ locale, messages, recentPosts = [] }: FooterProps) {
  const { footer, nav } = messages
  const year = new Date().getFullYear()
  const isRu = locale === 'ru'

  return (
    <footer className="bg-black border-t border-gray-800 py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Graver<span className="text-teal-500">.uz</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">{footer.description}</p>
          </div>

          {/* Contacts — exact from CRA */}
          <div>
            <h3 className="text-white font-bold mb-4">{isRu ? 'Контакты' : 'Aloqa'}</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <a href="tel:+998770802288" className="flex items-center hover:text-teal-500 transition" data-testid="footer-phone-1" data-track="tel">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {footer.phone1}
              </a>
              <a href="tel:+998974802288" className="flex items-center hover:text-teal-500 transition" data-testid="footer-phone-2" data-track="tel">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {footer.phone2}
              </a>
              <a href="https://t.me/GraverAdm" data-track="tg" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-teal-500 transition" data-testid="footer-telegram">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                @GraverAdm
              </a>
              <a href="https://wa.me/998770802288" data-track="wa" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-teal-500 transition" data-testid="footer-whatsapp">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{footer.address}</span>
              </div>
            </div>
          </div>

          {/* Blog — exact CRA transplant: 3 recent posts + all posts link */}
          <div>
            <h3 className="text-white font-bold mb-4">{nav.blog}</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              {recentPosts.map((post, index) => (
                <Link
                  key={index}
                  href={`/${locale}/blog/${post.slug}`}
                  className="block hover:text-teal-500 transition line-clamp-1"
                >
                  {post.title}
                </Link>
              ))}
              <Link
                href={`/${locale}/blog`}
                className="block text-teal-500 hover:text-teal-400 font-medium mt-3"
              >
                {isRu ? 'Все статьи' : 'Barcha maqolalar'} →
              </Link>
            </div>
          </div>

          {/* Working hours + Quick links — exact from CRA */}
          <div>
            <h3 className="text-white font-bold mb-4">
              {isRu ? 'Режим работы' : 'Ish vaqti'}
            </h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                {isRu ? 'Пн–Сб: 09:00–18:00' : 'Du–Shan: 09:00–18:00'}
              </p>
              <p className="text-teal-500 font-semibold">
                {isRu ? 'Заявки 24/7' : 'Arizalar 24/7'}
              </p>
            </div>

            <h3 className="text-white font-bold mt-6 mb-3">
              {isRu ? 'Быстрые ссылки' : 'Tez havolalar'}
            </h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <Link href={`/${locale}/blog`} className="block hover:text-teal-500 transition">
                {isRu ? 'Блог' : 'Blog'}
              </Link>
              <Link href={`/${locale}#services`} className="block hover:text-teal-500 transition">
                {isRu ? 'Услуги' : 'Xizmatlar'}
              </Link>
              <Link href={`/${locale}/engraved-gifts`} className="block hover:text-teal-500 transition">
                {isRu ? 'Гравированные подарки' : "O'ymakor sovg'alar"}
              </Link>
              <Link href={`/${locale}/guarantees`} className="block hover:text-teal-500 transition">
                {isRu ? 'Гарантии' : 'Kafolatlar'}
              </Link>
              <Link href={`/${locale}#portfolio`} className="block hover:text-teal-500 transition">
                {isRu ? 'Портфолио' : 'Portfolio'}
              </Link>
              <Link href={`/${locale}#contact`} className="block hover:text-teal-500 transition">
                {isRu ? 'Контакты' : 'Aloqa'}
              </Link>
            </div>
          </div>

          {/* Products — exact from CRA */}
          <div>
            <h3 className="text-white font-bold mb-4">{nav.products}</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <Link href={`/${locale}/products/neo-watches`} className="block hover:text-teal-500 transition">
                {isRu ? 'Часы NEO' : 'NEO soatlar'}
              </Link>
              <Link href={`/${locale}/products/lighters`} className="block hover:text-teal-500 transition">
                {isRu ? 'Зажигалки' : 'Zazhigalkalar'}
              </Link>
              <Link href={`/${locale}/products/pens`} className="block hover:text-teal-500 transition">
                {isRu ? 'Ручки' : 'Ruchkalar'}
              </Link>
              <Link href={`/${locale}/products/powerbanks`} className="block hover:text-teal-500 transition">
                {isRu ? 'Повербанки' : 'Powerbanklar'}
              </Link>
              <Link href={`/${locale}/products/notebooks`} className="block hover:text-teal-500 transition">
                {isRu ? 'Ежедневники' : 'Kundaliklar'}
              </Link>
              <Link href={`/${locale}/catalog-products`} className="block text-teal-500 hover:text-teal-400 font-medium mt-3">
                {isRu ? 'Весь каталог' : "To'liq katalog"} →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-300 text-sm">
          <p>&copy; {year} Graver.uz. {footer.rights}.</p>
        </div>
      </div>
    </footer>
  )
}
