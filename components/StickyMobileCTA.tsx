'use client'

import type { Locale } from '@/lib/i18n'

interface StickyMobileCTAProps {
  locale: Locale
}

/**
 * Sticky bottom bar for mobile devices with "Request Quote" and Telegram buttons.
 * Ported from CRA App.js sticky-mobile-cta.
 */
export default function StickyMobileCTA({ locale }: StickyMobileCTAProps) {
  const isRu = locale === 'ru'

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800 p-3 z-40">
      <div className="flex gap-2">
        <a
          href={`/${locale}/contacts`}
          className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:from-teal-600 hover:to-cyan-700 transition min-h-[48px] flex items-center justify-center"
        >
          {isRu ? 'Запросить расчёт' : "Narx so'rash"}
        </a>
        <a
          href="https://t.me/GraverAdm"
          data-track="tg"
          data-placement="sticky-mobile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isRu ? 'Написать в Telegram' : "Telegramga yozish"}
          className="bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-gray-700 transition flex items-center justify-center border border-gray-700 min-h-[48px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </a>
      </div>
    </div>
  )
}
