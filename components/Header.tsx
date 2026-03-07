'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Locale } from '@/lib/i18n'

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
  const nav = messages.nav

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

            {/* Products dropdown */}
            <div className="relative group">
              <button
                className="text-gray-300 hover:text-teal-500 transition flex items-center"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
                aria-haspopup="true"
                aria-expanded={productsOpen}
                data-testid="nav-products"
              >
                {nav.products}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {productsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-black/90 border border-gray-800 rounded-lg shadow-lg z-50"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <Link href={`/${locale}/products/neo-watches`} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-teal-500">
                    {nav.watches}
                  </Link>
                  <Link href={`/${locale}/products/lighters`} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-teal-500">
                    {nav.lighters}
                  </Link>
                  <Link href={`/${locale}/products/pens`} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-teal-500">
                    {nav.pens}
                  </Link>
                  <Link href={`/${locale}/products/powerbanks`} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-teal-500">
                    {nav.powerbanks}
                  </Link>
                  <Link href={`/${locale}/products/notebooks`} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-teal-500">
                    {nav.notebooks}
                  </Link>
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
            <div className="flex items-center space-x-2 border-l border-gray-700 pl-4">
              <Link
                href="/ru"
                className={`text-sm font-medium transition ${locale === 'ru' ? 'text-teal-500' : 'text-gray-400 hover:text-white'}`}
              >
                RU
              </Link>
              <span className="text-gray-600">/</span>
              <Link
                href="/uz"
                className={`text-sm font-medium transition ${locale === 'uz' ? 'text-teal-500' : 'text-gray-400 hover:text-white'}`}
              >
                UZ
              </Link>
            </div>
          </nav>

          {/* Phone Numbers — exact from CRA */}
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

        {/* Mobile navigation — exact CRA transplant (all links + phones) */}
        {mobileOpen && (
          <div id="mobile-navigation" className="lg:hidden pb-4 border-t border-gray-800 mt-4 pt-4">
            <nav className="flex flex-col space-y-3">
              <Link href={`/${locale}#services`} className="text-gray-300 hover:text-teal-500 transition text-left px-2" onClick={() => setMobileOpen(false)}>
                {nav.services}
              </Link>
              <Link href={`/${locale}/products/lighters`} className="text-gray-300 hover:text-teal-500 transition text-left px-2" onClick={() => setMobileOpen(false)}>
                {nav.catalog || nav.products}
              </Link>
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
                <div className="flex items-center space-x-3">
                  <Link href="/ru" className={`text-sm font-medium ${locale === 'ru' ? 'text-teal-500' : 'text-gray-400'}`}>RU</Link>
                  <span className="text-gray-600">/</span>
                  <Link href="/uz" className={`text-sm font-medium ${locale === 'uz' ? 'text-teal-500' : 'text-gray-400'}`}>UZ</Link>
                </div>
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
