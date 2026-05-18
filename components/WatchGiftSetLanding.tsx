'use client'
// ============================================================
// Watch Gift Set Landing — premium corporate gift set landing
// CRO conversion page for Meta Ads
// URLs:
//   RU: /ru/podarochniy-nabor-s-chasami/
//   UZ: /uz/soatli-sovga-toplami/
//
// Content (H1, intro, SEO, CTA labels/hrefs, FAQ) is editable
// via Keystatic CMS (content/pages/{slug}/index.yaml).
// Visual structure & long-form copy is component-internal.
// ============================================================
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

const TELEGRAM_URL = 'https://t.me/GraverAdm'
const PRODUCT_ID = 'gift-set-watch'

// ─── Hardcoded long-form sections (component-internal copy) ───
const COMPOSITION = [
  {
    img: '/images/products/gift-set-watch/watch.webp',
    titleRu: 'Часы SLIM',
    titleUz: 'SLIM soat',
    textRu: 'Кварцевый механизм TMI VJ32B Japan. Ремешок из натуральной телячьей кожи.',
    textUz: 'Yapon TMI VJ32B kvarts mexanizmi. Tabiiy buzoq charmidan tasma.',
  },
  {
    img: '/images/products/gift-set-watch/wallet.webp',
    titleRu: 'Кожаное портмоне',
    titleUz: 'Charm hamyon',
    textRu: 'Натуральная кожа, производство Турция.',
    textUz: 'Tabiiy charm, Turkiya ishlab chiqarishi.',
  },
  {
    img: '/images/products/gift-set-watch/pen.webp',
    titleRu: 'Ручка-роллер',
    titleUz: 'Roller ruchka',
    textRu: 'Рифлёная фактура, деловой акцент.',
    textUz: 'Rifli to‘qima, ishbilarmonlik aksenti.',
  },
  {
    img: '/images/products/gift-set-watch/packaging.webp',
    titleRu: 'Премиальный футляр',
    titleUz: 'Premium futlyar',
    textRu: 'Эксклюзивная эко-кожа, брендированный пакет, готовый подарочный вид.',
    textUz: 'Eksklyuziv eko-charm, brendlangan paket, tayyor sovg‘a ko‘rinishi.',
  },
]

const PERSONALIZATION_RU = [
  'логотип компании',
  'эмблема',
  'имя получателя',
  'должность',
  'памятная дата',
  'короткая фраза',
  'брендированный футляр или пакет',
]

const PERSONALIZATION_UZ = [
  'kompaniya logotipi',
  'emblema',
  'qabul qiluvchining ismi',
  'lavozim',
  'esda qoladigan sana',
  'qisqa yozuv',
  'brendlangan futlyar yoki paket',
]

const AUDIENCE = [
  { img: '/images/products/gift-set-watch/executive-gift.webp', titleRu: 'Партнёрам и VIP-клиентам', titleUz: 'Hamkorlar va VIP-mijozlarga' },
  { img: '/images/products/gift-set-watch/executive-gift.webp', titleRu: 'Руководителям и топ-менеджерам', titleUz: 'Rahbarlar va top-menejerlarga' },
  { img: '/images/products/gift-set-watch/welcome-pack.webp', titleRu: 'Новым сотрудникам в welcome pack', titleUz: 'Yangi xodimlarga welcome pack' },
  { img: '/images/products/gift-set-watch/cta.webp', titleRu: 'Команде на корпоративные праздники', titleUz: 'Jamoaga korporativ bayramlarda' },
  { img: '/images/products/gift-set-watch/packaging.webp', titleRu: 'Спикерам и гостям мероприятий', titleUz: 'Spiker va tadbir mehmonlariga' },
  { img: '/images/products/gift-set-watch/composition.webp', titleRu: 'Клиентам после сделки', titleUz: 'Bitim yakuniga yetgan mijozlarga' },
]

const WHY_RU = [
  'подбираем способ нанесения под материал',
  'готовим макет перед запуском',
  'помогаем собрать цельный подарочный комплект',
  'адаптируем набор под стиль компании',
  'работаем с корпоративными заказами',
  'консультируем перед расчётом',
]

const WHY_UZ = [
  'materialga mos gravyura usulini tanlaymiz',
  'ishlab chiqarishdan oldin maket tayyorlaymiz',
  'yagona sovg‘a komplektini yig‘ishga yordam beramiz',
  'to‘plamni kompaniya uslubiga moslashtiramiz',
  'korporativ buyurtmalar bilan ishlaymiz',
  'hisob-kitobdan oldin maslahat beramiz',
]

const STEPS = [
  {
    n: 1,
    titleRu: 'Вы оставляете заявку',
    titleUz: 'Siz ariza qoldirasiz',
    textRu: 'Пишете в Telegram — мы сразу выходим на связь.',
    textUz: 'Telegramda yozasiz — biz darhol bog‘lanamiz.',
  },
  {
    n: 2,
    titleRu: 'Уточняем количество, логотип и пожелания',
    titleUz: 'Miqdor, logo va xohishlarni aniqlashtiramiz',
    textRu: 'Обсуждаем формат нанесения, упаковку и сроки.',
    textUz: 'Gravyura, qadoq va muddatlarni muhokama qilamiz.',
  },
  {
    n: 3,
    titleRu: 'Готовим макет',
    titleUz: 'Maket tayyorlaymiz',
    textRu: 'Согласуем визуал до старта производства.',
    textUz: 'Ishlab chiqarishdan oldin vizualni kelishib olamiz.',
  },
  {
    n: 4,
    titleRu: 'Наносим персонализацию и передаём готовые наборы',
    titleUz: 'Personalizatsiya qilamiz va tayyor to‘plamlarni topshiramiz',
    textRu: 'Гравируем элементы и собираем подарочный вид.',
    textUz: 'Elementlarni gravyura qilamiz va sovg‘a ko‘rinishini yig‘amiz.',
  },
]

const RELATED_RU = [
  { href: '/ru/korporativnye-podarki/', label: 'Корпоративные подарки с гравировкой' },
  { href: '/ru/welcome-packs/', label: 'Welcome pack для новых сотрудников' },
  { href: '/ru/vip-podarki/', label: 'VIP-подарки с персонализацией' },
  { href: '/ru/lazernaya-gravirovka-tashkent/', label: 'Лазерная гравировка в Ташкенте' },
]

const RELATED_UZ = [
  { href: '/uz/toshkentda-korporativ-sovgalar/', label: 'Toshkentda korporativ sovg‘alar' },
  { href: '/uz/welcome-packs/', label: 'Yangi xodimlar uchun welcome pack' },
  { href: '/uz/vip-podarki/', label: 'Personalizatsiya qilingan VIP sovg‘alar' },
  { href: '/uz/toshkentda-lazer-gravyura/', label: 'Toshkentda lazer gravyura' },
]

export interface WatchGiftSetLandingProps {
  locale: Locale
  /** From CMS pages collection — H1, intro, CTA labels/hrefs, FAQ */
  h1: string
  intro: string
  finalCta: {
    title: string
    subtitle: string
    primaryLabel: string
    primaryHref: string
  }
  faq: Array<{ q: string; a: string }>
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function fireLead(ctaLocation: string, locale: Locale) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  const eventID = `lead_giftset_${ctaLocation}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const params = {
    content_name: 'Premium watch corporate gift set',
    content_category: 'Corporate Gifts',
    content_ids: [PRODUCT_ID],
    content_type: 'product',
    lead_type: 'telegram_click',
    page_type: 'landing',
    language: locale,
    cta_location: ctaLocation,
  }
  // Lead — primary conversion event for Meta Ads optimization
  window.fbq('track', 'Lead', { ...params, event_id: eventID }, { eventID })
  // Contact — secondary diagnostic, the user is initiating contact via Telegram
  const contactEventID = `contact_giftset_${ctaLocation}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  window.fbq('track', 'Contact', {
    contact_channel: 'telegram',
    content_name: 'Premium watch corporate gift set',
    content_category: 'Corporate Gifts',
    content_ids: [PRODUCT_ID],
    page_type: 'landing',
    language: locale,
    event_id: contactEventID,
  }, { eventID: contactEventID })
  // Custom diagnostic event
  window.fbq('trackCustom', 'GiftSetTelegramClick', {
    page_type: 'landing',
    product: PRODUCT_ID,
    language: locale,
    cta_location: ctaLocation,
  })
}

function fireRelatedClick(href: string, locale: Locale) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('trackCustom', 'GiftSetRelatedLinkClick', {
    target_url: href,
    page_type: 'landing',
    product: PRODUCT_ID,
    language: locale,
  })
}

export default function WatchGiftSetLanding({
  locale,
  h1,
  intro,
  finalCta,
  faq,
}: WatchGiftSetLandingProps) {
  const isRu = locale === 'ru'
  const related = isRu ? RELATED_RU : RELATED_UZ

  // ── ViewContent on mount (once) + hide global sticky CTA on this landing ──
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
    const eventID = `viewcontent_giftset_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    window.fbq('track', 'ViewContent', {
      content_name: 'Premium watch corporate gift set',
      content_category: 'Corporate Gifts',
      content_ids: [PRODUCT_ID],
      content_type: 'product',
      page_type: 'landing',
      language: locale,
      event_id: eventID,
    }, { eventID })
  }, [locale])

  // Hide the global <StickyMobileCTA> on this landing — we use our own
  // tracked sticky CTA below. Toggling a body data attribute via effect
  // avoids fighting hydration on SSR.
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.dataset.giftSetLanding = 'true'
    return () => {
      delete document.body.dataset.giftSetLanding
    }
  }, [])

  const tgClick = (loc: string) => () => fireLead(loc, locale)

  return (
    <>
      <style>{`
        .gs-landing { font-family: 'Inter','Segoe UI',sans-serif; color: #f0ede8; max-width: 1200px; margin: 0 auto; padding: 0 20px 120px; }
        .gs-hero { display: grid; grid-template-columns: 1.05fr 1fr; gap: 56px; align-items: center; padding: 56px 0 60px; }
        .gs-hero h1 { font-size: 2.6rem; font-weight: 800; line-height: 1.12; color: #fff; margin: 0 0 18px; letter-spacing: -0.01em; }
        .gs-hero p.sub { font-size: 1.08rem; color: rgba(240,237,232,0.7); line-height: 1.65; margin: 0 0 26px; }
        .gs-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
        .gs-chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1px solid rgba(20, 184, 166, 0.35); background: rgba(20, 184, 166, 0.08); border-radius: 999px; font-size: 0.82rem; color: #5eead4; font-weight: 500; }
        .gs-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .gs-btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 32px; background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); color: #06201d; font-size: 0.98rem; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; text-decoration: none; transition: transform .15s ease, box-shadow .15s ease; box-shadow: 0 8px 24px rgba(20,184,166,.25); }
        .gs-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(20,184,166,.4); }
        .gs-btn-secondary { display: inline-flex; align-items: center; justify-content: center; padding: 15px 30px; background: transparent; color: #5eead4; font-size: 0.98rem; font-weight: 600; border: 1.5px solid rgba(94, 234, 212, 0.4); border-radius: 12px; cursor: pointer; text-decoration: none; transition: all .15s ease; }
        .gs-btn-secondary:hover { background: rgba(20, 184, 166, 0.1); border-color: #14b8a6; }
        .gs-hero-img { position: relative; aspect-ratio: 1/1; border-radius: 20px; overflow: hidden; border: 1px solid rgba(94, 234, 212, 0.15); box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04); }
        .gs-section { padding: 56px 0; }
        .gs-section h2 { font-size: 2rem; font-weight: 800; color: #fff; margin: 0 0 12px; letter-spacing: -0.01em; }
        .gs-section .lead { color: rgba(240,237,232,0.6); font-size: 1rem; margin: 0 0 36px; max-width: 640px; }
        .gs-composition { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .gs-comp-card { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; transition: transform .2s ease, border-color .2s ease; }
        .gs-comp-card:hover { transform: translateY(-3px); border-color: rgba(20, 184, 166, 0.35); }
        .gs-comp-photo { position: relative; aspect-ratio: 1/1; background: #0a0a0b; }
        .gs-comp-body { padding: 18px 18px 22px; }
        .gs-comp-body h3 { font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .gs-comp-body p { font-size: 0.85rem; line-height: 1.55; color: rgba(240,237,232,0.55); margin: 0; }
        .gs-pers-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; background: linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(0,0,0,0) 60%); border: 1px solid rgba(20, 184, 166, 0.18); border-radius: 24px; padding: 48px; }
        .gs-pers-img { position: relative; aspect-ratio: 4/5; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
        .gs-pers-list { list-style: none; padding: 0; margin: 20px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 18px; }
        .gs-pers-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.95rem; color: rgba(240,237,232,0.85); line-height: 1.45; }
        .gs-pers-list li::before { content: ''; display: block; width: 6px; height: 6px; border-radius: 50%; background: #14b8a6; margin-top: 8px; flex-shrink: 0; }
        .gs-pers-note { margin-top: 20px; padding: 14px 18px; border-left: 2px solid #14b8a6; background: rgba(20, 184, 166, 0.06); font-size: 0.92rem; color: rgba(240,237,232,0.78); line-height: 1.55; border-radius: 0 8px 8px 0; }
        .gs-audience { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .gs-aud-card { padding: 0; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; transition: border-color .2s ease, transform .2s ease; }
        .gs-aud-card:hover { border-color: rgba(20, 184, 166, 0.35); transform: translateY(-3px); }
        .gs-aud-photo { position: relative; aspect-ratio: 4/3; background: #0a0a0b; }
        .gs-aud-card h4 { font-size: 0.98rem; font-weight: 600; color: #fff; margin: 0; line-height: 1.4; padding: 16px 18px 18px; }
        .gs-why { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; max-width: 880px; }
        .gs-why-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.98rem; color: rgba(240,237,232,0.85); line-height: 1.5; }
        .gs-why-row::before { content: '✓'; color: #14b8a6; font-weight: 700; font-size: 1rem; margin-top: 2px; flex-shrink: 0; }
        .gs-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .gs-step { padding: 24px 22px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; position: relative; }
        .gs-step-num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #14b8a6, #0d9488); color: #06201d; font-weight: 800; font-size: 0.95rem; margin-bottom: 14px; }
        .gs-step h4 { font-size: 0.98rem; font-weight: 700; color: #fff; margin: 0 0 6px; line-height: 1.35; }
        .gs-step p { font-size: 0.85rem; color: rgba(240,237,232,0.6); line-height: 1.5; margin: 0; }
        .gs-final-cta { text-align: center; background: linear-gradient(135deg, rgba(10,10,11,0.92) 0%, rgba(20,20,20,0.92) 100%), url('/images/products/gift-set-watch/cta.webp') center/cover; border: 1px solid rgba(20, 184, 166, 0.3); border-radius: 24px; padding: 64px 40px; margin-top: 24px; position: relative; overflow: hidden; }
        .gs-final-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.18), transparent 55%); pointer-events: none; }
        .gs-final-cta-inner { position: relative; z-index: 1; }
        .gs-final-cta h2 { color: #fff; margin: 0 0 14px; font-size: 1.85rem; font-weight: 800; letter-spacing: -0.01em; }
        .gs-final-cta p { color: rgba(240,237,232,0.7); font-size: 1.02rem; margin: 0 0 32px; max-width: 560px; margin-left: auto; margin-right: auto; line-height: 1.55; }
        .gs-final-cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .gs-faq { max-width: 760px; margin: 0 auto; }
        .gs-faq summary { cursor: pointer; padding: 18px 22px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; font-weight: 600; color: #fff; font-size: 0.98rem; list-style: none; display: flex; justify-content: space-between; align-items: center; transition: border-color .15s ease; }
        .gs-faq summary::-webkit-details-marker { display: none; }
        .gs-faq summary::after { content: '+'; color: #14b8a6; font-size: 1.4rem; font-weight: 400; flex-shrink: 0; margin-left: 12px; }
        .gs-faq details[open] summary { border-color: #14b8a6; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
        .gs-faq details[open] summary::after { content: '−'; }
        .gs-faq details { margin-bottom: 10px; }
        .gs-faq .gs-faq-answer { padding: 16px 22px 20px; border: 1px solid #14b8a6; border-top: none; border-radius: 0 0 12px 12px; background: rgba(20, 184, 166, 0.04); font-size: 0.94rem; color: rgba(240,237,232,0.78); line-height: 1.65; }
        .gs-related { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-width: 760px; }
        .gs-related a { padding: 16px 20px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; color: rgba(240,237,232,0.85); font-size: 0.94rem; text-decoration: none; display: flex; align-items: center; justify-content: space-between; transition: all .15s ease; }
        .gs-related a:hover { border-color: rgba(20, 184, 166, 0.4); background: rgba(20, 184, 166, 0.06); color: #fff; }
        .gs-related a::after { content: '→'; color: #14b8a6; transition: transform .15s ease; }
        .gs-related a:hover::after { transform: translateX(3px); }
        .gs-sticky-mobile { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: rgba(10,10,11,0.96); border-top: 1px solid rgba(20, 184, 166, 0.25); padding: 10px 14px calc(10px + env(safe-area-inset-bottom)); backdrop-filter: blur(10px); }
        .gs-sticky-mobile .gs-btn-primary { width: 100%; padding: 14px 18px; font-size: 0.95rem; }
        /* Hide global StickyMobileCTA on this landing — our own tracked CTA replaces it */
        body[data-gift-set-landing='true'] > div.fixed.bottom-0.lg\\:hidden { display: none !important; }
        @media (max-width: 1024px) {
          .gs-composition { grid-template-columns: repeat(2, 1fr); }
          .gs-audience { grid-template-columns: repeat(2, 1fr); }
          .gs-steps { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .gs-landing { padding: 0 16px 100px; }
          .gs-hero { grid-template-columns: 1fr; gap: 28px; padding: 28px 0 36px; }
          .gs-hero h1 { font-size: 1.85rem; }
          .gs-hero p.sub { font-size: 0.98rem; }
          .gs-hero-img { order: -1; aspect-ratio: 4/3; }
          .gs-section { padding: 40px 0; }
          .gs-section h2 { font-size: 1.5rem; }
          .gs-pers-wrap { grid-template-columns: 1fr; padding: 28px 22px; gap: 28px; }
          .gs-pers-img { aspect-ratio: 4/3; }
          .gs-pers-list { grid-template-columns: 1fr; }
          .gs-why { grid-template-columns: 1fr; }
          .gs-final-cta { padding: 44px 22px; }
          .gs-final-cta h2 { font-size: 1.4rem; }
          .gs-related { grid-template-columns: 1fr; }
          .gs-sticky-mobile { display: block; }
          .gs-cta-row { flex-direction: column; }
          .gs-cta-row .gs-btn-primary, .gs-cta-row .gs-btn-secondary { width: 100%; }
          .gs-final-cta-buttons { flex-direction: column; }
          .gs-final-cta-buttons .gs-btn-primary, .gs-final-cta-buttons .gs-btn-secondary { width: 100%; }
        }
        @media (max-width: 480px) {
          .gs-composition { grid-template-columns: 1fr 1fr; gap: 10px; }
          .gs-comp-body { padding: 14px; }
          .gs-comp-body h3 { font-size: 0.95rem; }
          .gs-comp-body p { font-size: 0.78rem; }
          .gs-audience { grid-template-columns: 1fr; }
          .gs-steps { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="gs-landing" data-page="watch-gift-set">
        {/* ── HERO ── */}
        <section className="gs-hero" id="hero">
          <div>
            <h1>{h1}</h1>
            <p className="sub">{intro}</p>
            <div className="gs-chips">
              <span className="gs-chip">{isRu ? 'Для бизнеса и HR' : 'Biznes va HR uchun'}</span>
              <span className="gs-chip">{isRu ? 'Логотип / имя / эмблема' : 'Logo / ism / emblema'}</span>
              <span className="gs-chip">{isRu ? 'Подарочная упаковка' : 'Sovg‘a qadog‘i'}</span>
              <span className="gs-chip">{isRu ? 'Ташкент и Узбекистан' : 'Toshkent va O‘zbekiston'}</span>
            </div>
            <div className="gs-cta-row">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={tgClick('hero')}
                data-cta="gift-set-telegram"
                data-page="watch-gift-set"
                data-cta-location="hero"
                data-testid="hero-telegram-cta"
                className="gs-btn-primary"
              >
                {isRu ? 'Рассчитать стоимость в Telegram' : 'Telegram orqali narxni hisoblash'}
              </a>
              <a
                href="#lead"
                data-testid="hero-secondary-cta"
                className="gs-btn-secondary"
              >
                {isRu ? 'Подробнее о наборе' : 'To‘plam haqida batafsil'}
              </a>
            </div>
          </div>
          <div className="gs-hero-img">
            <Image
              src="/images/products/gift-set-watch/hero.webp"
              alt={isRu
                ? 'Премиальный подарочный набор: часы SLIM, кожаное портмоне и ручка-роллер в фирменном футляре с брендированным пакетом'
                : 'Premium sovg‘a to‘plami: SLIM soat, charm hamyon va roller ruchka firma futlyari va brendlangan paketda'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 580px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </section>

        {/* ── COMPOSITION ── */}
        <section className="gs-section" id="composition">
          <h2>{isRu ? 'Что входит в набор' : 'To‘plam tarkibida nima bor'}</h2>
          <p className="lead">
            {isRu
              ? 'Четыре аксессуара в фирменном футляре — единый премиальный комплект.'
              : 'Firma futlyarida to‘rt aksessuar — yagona premium komplekt.'}
          </p>
          <div className="gs-composition">
            {COMPOSITION.map((c, i) => (
              <article key={i} className="gs-comp-card">
                <div className="gs-comp-photo">
                  <Image
                    src={c.img}
                    alt={isRu ? c.titleRu : c.titleUz}
                    fill
                    sizes="(max-width: 480px) 50vw, (max-width: 1024px) 50vw, 280px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="gs-comp-body">
                  <h3>{isRu ? c.titleRu : c.titleUz}</h3>
                  <p>{isRu ? c.textRu : c.textUz}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── PERSONALIZATION ── */}
        <section className="gs-section" id="personalization">
          <div className="gs-pers-wrap">
            <div className="gs-pers-img">
              <Image
                src="/images/products/gift-set-watch/engraving.webp"
                alt={isRu
                  ? 'Лазерная гравировка эмблемы на металле — рядом часы SLIM и ручка-роллер'
                  : 'Metalga emblema lazer gravyurasi — yonida SLIM soat va roller ruchka'}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <h2>{isRu ? 'Нанесём логотип, имя или эмблему' : 'Logo, ism yoki emblema tushiramiz'}</h2>
              <p className="lead">
                {isRu
                  ? 'Подарок становится частью бренда, когда на нём есть точная персонализация: логотип компании, имя получателя, памятная дата или короткая фраза.'
                  : 'Sovg‘a brend qismiga aylanadi, qachonki unda aniq personalizatsiya bo‘lsa: kompaniya logotipi, qabul qiluvchi ismi, esda qoladigan sana yoki qisqa yozuv.'}
              </p>
              <ul className="gs-pers-list">
                {(isRu ? PERSONALIZATION_RU : PERSONALIZATION_UZ).map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="gs-pers-note">
                {isRu
                  ? 'Это не обычный сувенир, а подарок, который выглядит как часть корпоративной культуры.'
                  : 'Bu oddiy suvenir emas, bu korporativ madaniyat qismi kabi ko‘rinadigan sovg‘a.'}
              </div>
            </div>
          </div>
        </section>

        {/* ── AUDIENCE ── */}
        <section className="gs-section" id="audience">
          <h2>{isRu ? 'Кому подойдёт такой набор' : 'Bunday to‘plam kimga mos keladi'}</h2>
          <p className="lead">
            {isRu
              ? 'Универсальный B2B-подарок — для людей, отношения с которыми вы хотите подчеркнуть.'
              : 'Universal B2B sovg‘a — munosabatlarini ta‘kidlamoqchi bo‘lgan odamlar uchun.'}
          </p>
          <div className="gs-audience">
            {AUDIENCE.map((a, i) => (
              <article key={i} className="gs-aud-card">
                <div className="gs-aud-photo">
                  <Image
                    src={a.img}
                    alt={isRu ? a.titleRu : a.titleUz}
                    fill
                    sizes="(max-width: 768px) 50vw, 380px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h4>{isRu ? a.titleRu : a.titleUz}</h4>
              </article>
            ))}
          </div>
        </section>

        {/* ── WHY GRAVER STUDIO ── */}
        <section className="gs-section" id="why">
          <h2>{isRu ? 'Почему компании выбирают Graver Studio' : 'Nega kompaniyalar Graver Studio‘ni tanlaydi'}</h2>
          <div className="gs-why">
            {(isRu ? WHY_RU : WHY_UZ).map((w) => (
              <div key={w} className="gs-why-row">{w}</div>
            ))}
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className="gs-section" id="process">
          <h2>{isRu ? 'Как проходит заказ' : 'Buyurtma qanday o‘tadi'}</h2>
          <div className="gs-steps">
            {STEPS.map((s) => (
              <article key={s.n} className="gs-step">
                <div className="gs-step-num">{s.n}</div>
                <h4>{isRu ? s.titleRu : s.titleUz}</h4>
                <p>{isRu ? s.textRu : s.textUz}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA / LEAD ── */}
        <section className="gs-section" id="lead">
          <div className="gs-final-cta">
            <div className="gs-final-cta-inner">
              <h2>{finalCta.title}</h2>
              <p>{finalCta.subtitle}</p>
              <div className="gs-final-cta-buttons">
                <a
                  href={finalCta.primaryHref || TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={tgClick('final')}
                  data-cta="gift-set-telegram"
                  data-page="watch-gift-set"
                  data-cta-location="final"
                  data-testid="final-telegram-cta"
                  className="gs-btn-primary"
                >
                  {finalCta.primaryLabel}
                </a>
                <a
                  href={`/${locale}/contacts/`}
                  data-testid="final-contacts-cta"
                  className="gs-btn-secondary"
                >
                  {isRu ? 'Все контакты' : 'Barcha aloqalar'}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        {faq.length > 0 && (
          <section className="gs-section" id="faq">
            <h2>{isRu ? 'Частые вопросы' : 'Ko‘p so‘raladigan savollar'}</h2>
            <div className="gs-faq">
              {faq.map((item, i) => (
                <details key={i}>
                  <summary>{item.q}</summary>
                  <div className="gs-faq-answer">{item.a}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── RELATED SERVICES (internal links) ── */}
        <section className="gs-section" id="related">
          <h2>{isRu ? 'Связанные услуги' : 'Tegishli xizmatlar'}</h2>
          <div className="gs-related">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => fireRelatedClick(r.href, locale)}
                data-testid={`related-link-${r.href.replace(/\W+/g, '-')}`}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="gs-sticky-mobile">
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={tgClick('sticky_mobile')}
          data-cta="gift-set-telegram"
          data-page="watch-gift-set"
          data-cta-location="sticky_mobile"
          data-testid="sticky-mobile-cta"
          className="gs-btn-primary"
        >
          {isRu ? 'Рассчитать в Telegram' : 'Telegramda hisoblash'}
        </a>
      </div>
    </>
  )
}
