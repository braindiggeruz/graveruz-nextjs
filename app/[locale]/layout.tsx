import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { isValidLocale, getMessages, getHtmlLang, type Locale } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrackingProvider from '@/components/TrackingProvider'
import PixelRouteTracker from '@/components/PixelRouteTracker'
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
        {/* Preconnect to analytics origins actually used (fonts are system,
            so no Google Fonts preconnect needed). */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />

        {/* Silence unwanted GTM-injected consent-proxy beacons (*.on.aws /
            *.run.app /events?cee=...) that CSP blocks — short-circuit them
            so no console error / Issues-panel entry is logged. Must run
            before GTM, hence beforeInteractive + inline. */}
        <Script
          id="tp-guard"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(window.__tpGuard)return;window.__tpGuard=1;
            function blk(u){if(!u)return false;if(!/\\/events\\?cee=/i.test(u))return false;return /\\.on\\.aws\\//i.test(u)||/\\.run\\.app\\//i.test(u);}
            var of=window.fetch&&window.fetch.bind(window);
            if(of){window.fetch=function(i,n){var u=typeof i==='string'?i:(i&&i.url)||(i&&i.href)||'';if(blk(u))return Promise.resolve(new Response(null,{status:204}));return of(i,n);};}
            var nb=navigator.sendBeacon&&navigator.sendBeacon.bind(navigator);
            if(nb){navigator.sendBeacon=function(u,d){var s=typeof u==='string'?u:(u&&u.href)||'';if(blk(s))return true;return nb(u,d);};}
            }catch(e){}})();`,
          }}
        />

        {/* ── Analytics: stubs now, heavy SDKs after first interaction ──
            gtag()/fbq() stubs queue events immediately; the heavy SDKs
            (gtag.js → also loads GTM/Google Ads, fbevents.js) load only
            after the user's first interaction (pointer/key/scroll/touch)
            or a 6s fallback. This keeps the main thread free during load
            (TBT↓) and delays third-party cookies (Google Ads test_cookie)
            until the visitor actually engages (BP↑). */}

        {/* GA4 + Meta Pixel command stubs (tiny, define queues immediately) */}
        <Script
          id="analytics-stubs"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            window.gtag=gtag;
            gtag('js', new Date());
            gtag('config', '${ga4Id}', { page_path: window.location.pathname, send_page_view: true });
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window,document);
            fbq('init', '${metaPixelId}');
            var _gpvId='pv_init_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
            fbq('track','PageView',{event_id:_gpvId},{eventID:_gpvId});`,
          }}
        />

        {/* Interaction-gated loader for heavy analytics SDKs */}
        <Script
          id="analytics-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){if(window.__aLoaded)return;
            function load(){if(window.__aLoaded)return;window.__aLoaded=1;
              cleanup();
              var s=document.createElement('script');s.async=true;
              s.src='https://www.googletagmanager.com/gtag/js?id=${ga4Id}';
              document.head.appendChild(s);
              var f=document.createElement('script');f.async=true;
              f.src='https://connect.facebook.net/en_US/fbevents.js';
              document.head.appendChild(f);
            }
            var evs=['pointerdown','keydown','touchstart','scroll','mousemove'];
            function cleanup(){evs.forEach(function(e){window.removeEventListener(e,load,{passive:true,capture:true});});}
            evs.forEach(function(e){window.addEventListener(e,load,{passive:true,capture:true,once:true});});
            // Fallback: load after 6s of inactivity so bots / quick bounces still track.
            setTimeout(load,6000);
            })();`,
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
          <PixelRouteTracker />
          <AlternateSlugProvider>
            <Header locale={validLocale} messages={messages} settings={settings} />
            <main id="main-content" className="pt-20">
              {children}
            </main>
            <Footer locale={validLocale} messages={messages} settings={settings} recentPosts={getAllPostsMeta(validLocale).filter(p => !p.noindex).slice(0, 3)} />
            <StickyMobileCTA locale={validLocale} />
          </AlternateSlugProvider>
        </TrackingProvider>
      </body>
    </html>
  )
}
