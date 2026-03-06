import ruMessages from '@/messages/ru.json'
import uzMessages from '@/messages/uz.json'

export const SUPPORTED_LOCALES = ['ru', 'uz'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'ru'

const messages: Record<Locale, typeof ruMessages> = {
  ru: ruMessages,
  uz: uzMessages as typeof ruMessages,
}

export function getMessages(locale: Locale) {
  return messages[locale] ?? messages[DEFAULT_LOCALE]
}

export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
}

/** Returns the HTML lang attribute value for a locale */
export function getHtmlLang(locale: Locale): string {
  return locale === 'uz' ? 'uz-Latn' : 'ru'
}

/** Returns the hreflang value for a locale */
export function getHreflang(locale: Locale): string {
  return locale === 'uz' ? 'uz' : 'ru'
}

/** Returns the absolute URL for a given locale and path */
export function getLocaleUrl(locale: Locale, path: string = ''): string {
  const base = 'https://graver-studio.uz'
  // When path is empty (homepage), return /locale without trailing slash
  if (!path || path === '/') {
    return `${base}/${locale}`
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}/${locale}${cleanPath}`
}
