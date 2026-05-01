import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { isValidLocale, getMessages, getHtmlLang, type Locale } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrackingProvider from '@/components/TrackingProvider'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import { getAllPostsMeta } from '@/lib/blog'
import { AlternateSlugProvider } from '@/components/AlternateSlugContext'
import { getSettings } from '@/lib/cms'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const messages = getMessages(resolvedParams.locale as Locale)
  return {
    title: {
      default: `${messages.site.name} — ${messages.site.tagline}`,
      template: `%s | ${messages.site.name}`,
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  const validLocale = locale as Locale
  const messages = getMessages(validLocale)
  const htmlLang = getHtmlLang(validLocale)

  // Read site-level settings from Keystatic CMS (one source of truth)
  const settings = await getSettings().catch(() => null)
  const ga4Id = settings?.ga4Id || 'G-Z7V0FSGE4Y'
  const metaPixelId = settings?.metaPixelId || '1358428289305229'

  return (
    <html lang={htmlLang} className="scroll-smooth">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Analytics 4 (GA4) — ID from CMS Settings */}
        <Script
          id="ga4-gtag"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        />
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga4Id}', {
              page_path: window.location.pathname,
              send_page_view: true
            });`,
          }}
        />

        {/* Meta Pixel — ID from CMS Settings */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');`,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body className="bg-black text-white min-h-screen antialiased">
        <TrackingProvider>
          <AlternateSlugProvider>
            <Header locale={validLocale} messages={messages} />
            <main id="main-content" className="pt-20">
              {children}
            </main>
            <Footer locale={validLocale} messages={messages} recentPosts={getAllPostsMeta(validLocale).filter(p => !p.noindex).slice(0, 3)} />
            <StickyMobileCTA locale={validLocale} />
          </AlternateSlugProvider>
        </TrackingProvider>
      </body>
    </html>
  )
}
