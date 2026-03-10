'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import type { Locale } from '@/lib/i18n'
import LocaleSwitcher from '@/components/LocaleSwitcher'

interface HeaderProps {
  locale: Locale
  messages: {
    nav: {
      services: string
      products: string
      catalog?: string
      portfolio: string
      process: string
      faq: string
      blog: string
      contacts: string
      watches: string
      lighters: string
      pens: string
      powerbanks: string
      notebooks: string
    }
  }
}

export default function Header({ locale, messages }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nav = messages.nav

  const handleWrapperEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setProductsOpen(true)
  }

  const handleWrapperLeave = () => {
    leaveTimer.current = setTimeout(() => setProductsOpen(false), 150)
  }

  const handleButtonClick = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setProductsOpen(prev => !prev)
  }

  const productLinks = [
    { href: `/${locale}/products/neo-watches`, label: nav.watches },
    { href: `/${locale}/products/lighters`, label: nav.lighters },
    { href: `/${locale}/products/pens`, label: nav.pens },
    { href: `/${locale}/products/powerbanks`, label: nav.powerbanks },
    { href: `/${locale}/products/notebooks`, label: nav.notebooks },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-white">
              Graver<span className="text-teal-500">.uz</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">
            <Link href={`/${locale}#services`} className="text-gray-300 hover:text-teal-500 transition">
              {nav.services}
            </Link>

            {/* Products dropdown — wrapper-level hover, no gap, leave-delay 150ms */}
            <div
              className="relative"
              onMouseEnter={handleWrapperEnter}
              onMouseLeave={handleWrapperLeave}
            >
              <button
                className="text-gray-300 hover:text-teal-500 transition flex items-center"
                onClick={handleButtonClick}
                aria-haspopup="true"
                aria-expanded={productsOpen}
                data-testid="nav-products"
              >
                {nav.products}
                <svg
                  className={`ml-1 w-4 h-4 transition-transform duration-150 ${productsOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown — pt-2 creates invisible bridge over the gap */}
              {productsOpen && (
                <div
                  className="absolute top-full left-0 pt-2 w-52"
                  style={{ zIndex: 60 }}
                >
                  <div className="bg-black border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                    {productLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-500 transition text-sm"
                        onClick={() => setProductsOpen(false)}
                      >
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-800">
                      <Link
                        href={`/${locale}/catalog-products`}
                        className="block px-4 py-3 text-teal-500 hover:bg-gray-800 hover:text-teal-400 transition text-sm font-medium"
                        onClick={() => setProductsOpen(false)}
                      >
                        {locale === 'ru' ? 'Весь каталог →' : "To'liq katalog →"}
                      </Link>
                      <Link
                        href={`/${locale}/engraved-gifts`}
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-500 transition text-sm"
                        onClick={() => setProductsOpen(false)}
                      >
                        {locale === 'ru' ? 'Гравированные подарки' : "O'ymakor sovg'alar"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href={`/${locale}#portfolio`} className="text-gray-300 hover:text-teal-500 transition">
              {nav.portfolio}
            </Link>
            <Link href={`/${locale}#process`} className="text-gray-300 hover:text-teal-500 transition">
              {nav.process}
            </Link>
            <Link href={`/${locale}#faq`} className="text-gray-300 hover:text-teal-500 transition">
              {nav.faq}
            </Link>
            <Link href={`/${locale}/blog`} className="text-gray-300 hover:text-teal-500 transition" data-testid="nav-blog">
              {nav.blog}
            </Link>
            <Link href={`/${locale}/contacts`} className="text-gray-300 hover:text-teal-500 transition">
              {nav.contacts}
            </Link>

            {/* Language switcher */}
            <div className="flex items-center border-l border-gray-700 pl-4">
              <LocaleSwitcher locale={locale} />
            </div>
          </nav>

          {/* Phone Numbers */}
          <div className="hidden md:flex flex-col items-end space-y-1">
            <a href="tel:+998770802288" className="text-white font-semibold hover:text-teal-500 transition flex items-center text-sm" data-testid="phone-number-1" data-track="tel" data-placement="header">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +998 77 080 22 88
            </a>
            <a href="tel:+998974802288" className="text-gray-300 text-xs hover:text-teal-500 transition flex items-center" data-testid="phone-number-2" data-track="tel" data-placement="header">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +998 97 480 22 88
            </a>
          </div>

          {/* Mobile locale switcher — always visible between logo and burger */}
          <div className="lg:hidden flex items-center mr-1">
            <LocaleSwitcher
              locale={locale}
              className="flex items-center space-x-1"
              activeClassName="text-teal-400 font-bold text-sm"
              inactiveClassName="text-gray-400 hover:text-white text-sm"
            />
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            data-testid="mobile-menu-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile navigation — full product list */}
        {mobileOpen && (
          <div id="mobile-navigation" className="lg:hidden pb-4 border-t border-gray-800 mt-4 pt-4">
            <nav className="flex flex-col space-y-3">
              <Link href={`/${locale}#services`} className="text-gray-300 hover:text-teal-500 transition text-left px-2" onClick={() => setMobileOpen(false)}>
                {nav.services}
              </Link>

              {/* Mobile products accordion */}
              <div>
                <button
                  className="w-full text-left text-gray-300 hover:text-teal-500 transition px-2 flex items-center justify-between"
                  onClick={() => setMobileProductsOpen(prev => !prev)}
                >
                  <span>{nav.products}</span>
                  <svg className={`w-4 h-4 transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileProductsOpen && (
                  <div className="mt-2 ml-4 flex flex-col space-y-2 border-l border-gray-700 pl-3">
                    {productLinks.map(({ href, label }) => (
                      <Link key={href} href={href} className="text-gray-400 hover:text-teal-500 transition text-sm" onClick={() => setMobileOpen(false)}>
                        {label}
                      </Link>
                    ))}
                    <Link href={`/${locale}/catalog-products`} className="text-teal-500 hover:text-teal-400 transition text-sm font-medium" onClick={() => setMobileOpen(false)}>
                      {locale === 'ru' ? 'Весь каталог →' : "To'liq katalog →"}
                    </Link>
                    <Link href={`/${locale}/engraved-gifts`} className="text-gray-400 hover:text-teal-500 transition text-sm" onClick={() => setMobileOpen(false)}>
                      {locale === 'ru' ? 'Гравированные подарки' : "O'ymakor sovg'alar"}
                    </Link>
                  </div>
                )}
              </div>

              <Link href={`/${locale}#portfolio`} className="text-gray-300 hover:text-teal-500 transition text-left px-2" onClick={() => setMobileOpen(false)}>
                {nav.portfolio}
              </Link>
              <Link href={`/${locale}#process`} className="text-gray-300 hover:text-teal-500 transition text-left px-2" onClick={() => setMobileOpen(false)}>
                {nav.process}
              </Link>
              <Link href={`/${locale}#faq`} className="text-gray-300 hover:text-teal-500 transition text-left px-2" onClick={() => setMobileOpen(false)}>
                {nav.faq}
              </Link>
              <Link href={`/${locale}/blog`} className="text-gray-300 hover:text-teal-500 transition text-left px-2" onClick={() => setMobileOpen(false)}>
                {nav.blog}
              </Link>
              <Link href={`/${locale}/contacts`} className="text-gray-300 hover:text-teal-500 transition text-left px-2" onClick={() => setMobileOpen(false)}>
                {nav.contacts}
              </Link>

              <div className="pt-2 border-t border-gray-800 px-2">
                <LocaleSwitcher
                  locale={locale}
                  className="flex items-center space-x-3"
                  inactiveClassName="text-gray-400"
                />
              </div>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-800 px-2">
                <a href="tel:+998770802288" className="text-white font-semibold hover:text-teal-500 transition flex items-center" data-track="tel">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  +998 77 080 22 88
                </a>
                <a href="tel:+998974802288" className="text-gray-300 hover:text-teal-500 transition flex items-center" data-track="tel">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  +998 97 480 22 88
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
