/**
 * HreflangLinks — injects hreflang <link> tags directly into <head> as static HTML.
 *
 * Next.js 14 App Router renders `alternates.languages` from generateMetadata()
 * into the RSC payload (visible to browsers after hydration) but does NOT always
 * emit them as static <link> tags in the initial HTML for SSG pages.
 *
 * This component is placed inside the locale layout's <head> via the `<head>`
 * export pattern, ensuring Googlebot sees hreflang in the raw HTML response.
 */

import type { Locale } from '@/lib/i18n'

const BASE_URL = 'https://graver-studio.uz'

interface HreflangLinksProps {
  locale: Locale
  path: string                              // e.g. '' | 'blog/my-slug' | 'engraved-gifts'
  alternateSlug?: Partial<Record<Locale, string>>  // for posts with different slugs per locale
}

export default function HreflangLinks({ locale, path, alternateSlug }: HreflangLinksProps) {
  const ruPath = alternateSlug?.ru
    ? path.replace(/[^/]*$/, alternateSlug.ru)
    : path
  const uzPath = alternateSlug?.uz
    ? path.replace(/[^/]*$/, alternateSlug.uz)
    : path

  const ruUrl = `${BASE_URL}/ru${ruPath ? `/${ruPath}` : ''}`
  const uzUrl = `${BASE_URL}/uz${uzPath ? `/${uzPath}` : ''}`
  const xDefaultUrl = ruUrl  // x-default = Russian version

  return (
    <>
      <link rel="alternate" hrefLang="ru" href={ruUrl} />
      <link rel="alternate" hrefLang="uz" href={uzUrl} />
      <link rel="alternate" hrefLang="x-default" href={xDefaultUrl} />
    </>
  )
}
