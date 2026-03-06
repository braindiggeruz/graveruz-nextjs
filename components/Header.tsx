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
    <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800">
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
            <Link href={`/${locale}/blog`} className="text-gray-300 hover:text-teal-500 transition">
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

          {/* Phone numbers */}
          <div className="hidden md:flex flex-col items-end space-y-1">
            <a href="tel:+998770802288" className="text-white font-semibold hover:text-teal-500 transition text-sm">
              +998 77 080 22 88
            </a>
            <a href="tel:+998974802288" className="text-gray-300 text-xs hover:text-teal-500 transition">
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

        {/* Mobile navigation */}
        {mobileOpen && (
          <nav id="mobile-navigation" className="lg:hidden border-t border-gray-800 py-4 space-y-2">
            <Link href={`/${locale}#services`} className="block px-4 py-2 text-gray-300 hover:text-teal-500" onClick={() => setMobileOpen(false)}>
              {nav.services}
            </Link>
            <Link href={`/${locale}/catalog-products`} className="block px-4 py-2 text-gray-300 hover:text-teal-500" onClick={() => setMobileOpen(false)}>
              {nav.products}
            </Link>
            <Link href={`/${locale}/blog`} className="block px-4 py-2 text-gray-300 hover:text-teal-500" onClick={() => setMobileOpen(false)}>
              {nav.blog}
            </Link>
            <Link href={`/${locale}/contacts`} className="block px-4 py-2 text-gray-300 hover:text-teal-500" onClick={() => setMobileOpen(false)}>
              {nav.contacts}
            </Link>
            <div className="flex items-center space-x-4 px-4 pt-2 border-t border-gray-800">
              <Link href="/ru" className={`text-sm font-medium ${locale === 'ru' ? 'text-teal-500' : 'text-gray-400'}`}>RU</Link>
              <Link href="/uz" className={`text-sm font-medium ${locale === 'uz' ? 'text-teal-500' : 'text-gray-400'}`}>UZ</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
