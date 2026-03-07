'use client'
// ============================================================
// NEO Watches Landing — exact transplant from CRA NeoWatchesLanding.js
// Source: braindiggeruz/graveruz frontend/src/pages/NeoWatchesLanding.js
// Adaptations: useParams → locale prop, SEOHead → removed (handled by page.tsx),
//              B2CForm → ContactForm, img → next/image, CSS → inline via <style>
// ============================================================
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import ContactForm from '@/components/ContactForm'

// Real watch photos — exact same paths as CRA (images already in public/images/products/neo/)
const GALLERY_PHOTOS = [
  {
    src: '/images/products/neo/neo-watch-black-gold.jpg',
    altRu: 'Часы NEO — чёрный циферблат, золотой корпус',
    altUz: 'NEO soat — qora raqamlar, oltin korpus',
  },
  {
    src: '/images/products/neo/neo-watch-black-silver.jpg',
    altRu: 'Часы NEO — чёрный циферблат, серебряный корпус',
    altUz: 'NEO soat — qora raqamlar, kumush korpus',
  },
  {
    src: '/images/products/neo/neo-watch-white-gold.jpg',
    altRu: 'Часы NEO — белый циферблат, золотой корпус',
    altUz: 'NEO soat — oq raqamlar, oltin korpus',
  },
  {
    src: '/images/products/neo/neo-watch-white-silver.jpg',
    altRu: 'Часы NEO — белый циферблат, серебряный корпус',
    altUz: 'NEO soat — oq raqamlar, kumush korpus',
  },
]

const USE_CASES = [
  {
    icon: '👤',
    titleRu: 'Для себя',
    titleUz: "O'zingiz uchun",
    textRu: 'Уникальный аксессуар с вашими инициалами или символом, который подчёркивает характер.',
    textUz: "Xarakteringizni ta'kidlaydigan initsiallar yoki ramz bilan noyob aksessuar.",
  },
  {
    icon: '🎁',
    titleRu: 'В подарок близкому',
    titleUz: "Yaqin insonga sovg'a",
    textRu: 'Персональная гравировка превращает часы в памятный подарок, который хранят годами.',
    textUz: "Shaxsiy gravyura soatni yillar davomida saqlanadigan esdalik sovg'asiga aylantiradi.",
  },
  {
    icon: '🏢',
    titleRu: 'Сотрудникам',
    titleUz: 'Xodimlarga',
    textRu: 'Ценный корпоративный подарок за достижения — с логотипом компании или именем сотрудника.',
    textUz: "Kompaniya logotipi yoki xodim ismi bilan yutuqlar uchun qimmatbaho korporativ sovg'a.",
  },
  {
    icon: '🤝',
    titleRu: 'Партнёрам',
    titleUz: 'Hamkorlarga',
    textRu: 'Укрепите деловые отношения премиальным презентом, который запомнится надолго.',
    textUz: "Uzoq vaqt esda qoladigan premium taqdim bilan ishbilarmonlik aloqalarini mustahkamlang.",
  },
]

const FAQ_ITEMS_RU = [
  {
    q: 'Что можно нанести на гравировку?',
    a: 'Текст, инициалы, дату, логотип, символ или любой рисунок. Мы подберём оптимальный вариант под ваш запрос.',
  },
  {
    q: 'Как выглядит гравировка — покажите пример?',
    a: 'Перед нанесением мы бесплатно создаём цифровой макет. Вы видите результат заранее и утверждаете его.',
  },
  {
    q: 'Сколько стоит гравировка?',
    a: 'Стоимость зависит от сложности рисунка и количества. Оставьте заявку — мы рассчитаем и пришлём макет.',
  },
  {
    q: 'Сколько времени занимает изготовление?',
    a: 'После утверждения макета мы наносим гравировку в течение нескольких рабочих дней. Уточняйте при заказе.',
  },
  {
    q: 'Есть ли доставка по Узбекистану?',
    a: 'Да, доставляем по Ташкенту и другим городам. Детали уточняем при оформлении заказа.',
  },
  {
    q: 'Можно ли заказать тираж для корпоративного подарка?',
    a: 'Да, принимаем корпоративные заказы. Напишите нам в Telegram или оставьте заявку — обсудим условия.',
  },
  {
    q: 'Что если мне не понравится макет?',
    a: 'Мы дорабатываем макет до вашего одобрения. Гравировка начинается только после вашего согласования.',
  },
  {
    q: 'Как оформить заказ?',
    a: 'Нажмите «Оставить заявку» или напишите нам в Telegram. Мы свяжемся, уточним детали и пришлём макет.',
  },
]

const FAQ_ITEMS_UZ = [
  {
    q: "Gravyuraga nima qo'yish mumkin?",
    a: "Matn, initsiallar, sana, logotip, ramz yoki istalgan rasm. Biz so'rovingizga mos optimal variantni tanlaymiz.",
  },
  {
    q: "Gravyura qanday ko'rinadi — misol ko'rsata olasizmi?",
    a: "Naqsh qo'yishdan oldin biz bepul raqamli maket yaratamiz. Siz natijani oldindan ko'rasiz va tasdiqlaysiz.",
  },
  {
    q: 'Gravyura qancha turadi?',
    a: "Narx rasm murakkabligi va miqdoriga bog'liq. Ariza qoldiring — biz hisoblab, maket yuboramiz.",
  },
  {
    q: 'Ishlab chiqarish qancha vaqt oladi?',
    a: "Maket tasdiqlanganidan so'ng biz bir necha ish kuni ichida gravyura qilamiz. Buyurtma berishda aniqlashtiring.",
  },
  {
    q: "O'zbekiston bo'ylab yetkazib berish bormi?",
    a: "Ha, Toshkent va boshqa shaharlarga yetkazib beramiz. Tafsilotlarni buyurtma rasmiylashtirish paytida aniqlashtiring.",
  },
  {
    q: "Korporativ sovg'a uchun tiraj buyurtma qilish mumkinmi?",
    a: "Ha, korporativ buyurtmalarni qabul qilamiz. Telegramda yozing yoki ariza qoldiring — shartlarni muhokama qilamiz.",
  },
  {
    q: 'Agar maket menga yoqmasa nima bo\'ladi?',
    a: "Biz maketni siz tasdiqlaguningizcha takomillashtira miz. Gravyura faqat sizning roziligingizdan so'ng boshlanadi.",
  },
  {
    q: 'Buyurtmani qanday rasmiylashtirish mumkin?',
    a: "«Ariza qoldirish» tugmasini bosing yoki Telegramda yozing. Biz bog'lanamiz, tafsilotlarni aniqlaymiz va maket yuboramiz.",
  },
]

interface NeoWatchesLandingProps {
  locale: Locale
}

export default function NeoWatchesLanding({ locale }: NeoWatchesLandingProps) {
  const isRu = locale === 'ru'
  const [activePhoto, setActivePhoto] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const faqItems = isRu ? FAQ_ITEMS_RU : FAQ_ITEMS_UZ

  const handleTelegramClick = () => {
    window.open('https://t.me/GraverAdm', '_blank')
  }
  const handleFormOpen = () => setShowForm(true)
  const handleFormClose = () => setShowForm(false)

  return (
    <>
      {/* ── NEO LANDING CSS (scoped, exact transplant from NeoWatchesLanding.css) ── */}
      <style>{`
        :root {
          --neo-gold: #c9a84c;
          --neo-gold-light: #e8c97a;
          --neo-dark: #0a0a0b;
          --neo-dark-2: #141414;
          --neo-dark-3: #1e1e1e;
          --neo-text-on-dark: #f0ede8;
          --neo-muted-on-dark: rgba(240, 237, 232, 0.65);
          --neo-text-on-light: #1a1a1a;
          --neo-muted-on-light: #555;
          --neo-border-dark: rgba(201,168,76,0.2);
          --neo-border-light: #e0e0e0;
          --neo-bg-light: #f9f8f6;
          --neo-radius: 12px;
          --neo-shadow: 0 4px 24px rgba(0,0,0,0.18);
          --neo-shadow-hover: 0 8px 40px rgba(0,0,0,0.28);
        }
        .neo-landing {
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: var(--neo-text-on-dark);
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 100px;
        }
        .neo-cta-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 36px;
          background: linear-gradient(135deg, var(--neo-gold), var(--neo-gold-light));
          color: #1a1a1a;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
        }
        .neo-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201,168,76,0.45);
        }
        .neo-cta-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 15px 36px;
          background: transparent;
          color: var(--neo-gold-light);
          font-size: 1rem;
          font-weight: 600;
          border: 2px solid var(--neo-gold);
          border-radius: 50px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
        }
        .neo-cta-secondary:hover {
          background: var(--neo-gold);
          color: #1a1a1a;
        }
        .neo-section-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--neo-text-on-dark);
          margin: 0 0 12px;
        }
        .neo-section-subtitle {
          color: var(--neo-muted-on-dark);
          font-size: 1rem;
          margin: 0 0 40px;
        }
        /* ── HERO ── */
        .neo-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 80px 0 60px;
        }
        .neo-hero-content h1 {
          font-size: 2.6rem;
          font-weight: 800;
          line-height: 1.2;
          color: #ffffff;
          margin: 0 0 20px;
        }
        .neo-hero-subtitle {
          font-size: 1.15rem;
          color: var(--neo-muted-on-dark);
          line-height: 1.7;
          margin: 0 0 24px;
        }
        .neo-hero-bullets {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 36px;
        }
        .neo-hero-bullets span {
          font-size: 0.95rem;
          color: var(--neo-text-on-dark);
          font-weight: 500;
        }
        .neo-hero-ctas {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .neo-hero-gallery {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .neo-hero-main-photo {
          border-radius: var(--neo-radius);
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
          aspect-ratio: 1 / 1;
          background: #1e1e1e;
          border: 1px solid var(--neo-border-dark);
          position: relative;
        }
        .neo-hero-main-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .neo-hero-main-photo:hover img { transform: scale(1.03); }
        .neo-hero-thumbs { display: flex; gap: 12px; }
        .neo-thumb {
          flex: 1;
          border: 2px solid rgba(201,168,76,0.3);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          background: #1e1e1e;
          padding: 0;
          aspect-ratio: 1 / 1;
          transition: border-color 0.2s ease, transform 0.2s ease;
          position: relative;
        }
        .neo-thumb:hover { transform: scale(1.04); border-color: var(--neo-gold); }
        .neo-thumb.active { border-color: var(--neo-gold); box-shadow: 0 0 0 1px var(--neo-gold); }
        .neo-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        /* ── DIVIDER ── */
        .neo-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--neo-gold), transparent);
          margin: 0 0 80px;
          opacity: 0.35;
        }
        /* ── GALLERY ── */
        .neo-gallery {
          padding: 0 0 80px;
          text-align: center;
        }
        .neo-gallery .neo-section-title,
        .neo-how-it-works .neo-section-title,
        .neo-faq .neo-section-title {
          color: #ffffff;
        }
        .neo-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .neo-gallery-item {
          border-radius: var(--neo-radius);
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.35);
          background: #1e1e1e;
          border: 1px solid var(--neo-border-dark);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .neo-gallery-item:hover {
          box-shadow: 0 8px 40px rgba(201,168,76,0.2);
          transform: translateY(-4px);
          border-color: var(--neo-gold);
        }
        .neo-gallery-item img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; display: block; }
        .neo-gallery-caption {
          font-size: 0.8rem;
          color: var(--neo-muted-on-dark);
          padding: 10px 12px;
          margin: 0;
          text-align: center;
        }
        /* ── USE CASES (light section) ── */
        .neo-use-cases {
          background: var(--neo-bg-light);
          border-radius: 24px;
          padding: 60px 40px;
          margin: 0 -20px 80px;
          text-align: center;
        }
        .neo-use-cases .neo-section-title { color: var(--neo-text-on-light); }
        .neo-use-cases .neo-section-subtitle { color: var(--neo-muted-on-light); }
        .neo-use-cases-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 40px;
        }
        .neo-use-case-card {
          background: #fff;
          border-radius: var(--neo-radius);
          padding: 32px 24px;
          box-shadow: var(--neo-shadow);
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .neo-use-case-card:hover { transform: translateY(-4px); box-shadow: var(--neo-shadow-hover); }
        .neo-use-case-icon { font-size: 2.4rem; margin-bottom: 16px; line-height: 1; }
        .neo-use-case-card h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--neo-text-on-light);
          margin: 0 0 12px;
        }
        .neo-use-case-card p {
          font-size: 0.9rem;
          color: var(--neo-muted-on-light);
          line-height: 1.6;
          margin: 0;
        }
        /* ── HOW IT WORKS ── */
        .neo-how-it-works { padding: 0 0 80px; text-align: center; }
        .neo-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 48px;
          position: relative;
        }
        .neo-steps::before {
          content: '';
          position: absolute;
          top: 28px;
          left: calc(16.67% + 20px);
          right: calc(16.67% + 20px);
          height: 2px;
          background: linear-gradient(90deg, var(--neo-gold), var(--neo-gold-light));
          z-index: 0;
        }
        .neo-step { position: relative; z-index: 1; }
        .neo-step-number {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--neo-gold), var(--neo-gold-light));
          color: #1a1a1a;
          font-size: 1.4rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 4px 16px rgba(201,168,76,0.45);
        }
        .neo-step h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 12px;
        }
        .neo-step p {
          font-size: 0.9rem;
          color: var(--neo-muted-on-dark);
          line-height: 1.6;
          margin: 0;
        }
        /* ── FAQ ── */
        .neo-faq { padding: 0 0 80px; }
        .neo-faq .neo-section-title { text-align: center; margin-bottom: 40px; }
        .neo-faq-list {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .neo-faq-item {
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: var(--neo-radius);
          overflow: hidden;
          transition: border-color 0.2s ease;
          background: var(--neo-dark-2);
        }
        .neo-faq-item.open { border-color: var(--neo-gold); }
        .neo-faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: var(--neo-dark-2);
          border: none;
          cursor: pointer;
          text-align: left;
          font-size: 1rem;
          font-weight: 600;
          color: var(--neo-text-on-dark);
          gap: 16px;
          transition: background 0.2s ease;
        }
        .neo-faq-question:hover { background: var(--neo-dark-3); }
        .neo-faq-icon { font-size: 1.4rem; font-weight: 400; color: var(--neo-gold); flex-shrink: 0; line-height: 1; }
        .neo-faq-answer { padding: 0 24px 20px; background: var(--neo-dark-2); }
        .neo-faq-answer p {
          font-size: 0.95rem;
          color: var(--neo-muted-on-dark);
          line-height: 1.7;
          margin: 0;
        }
        /* ── FINAL CTA ── */
        .neo-final-cta {
          text-align: center;
          background: linear-gradient(135deg, #141414 0%, #1e1e1e 100%);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 24px;
          padding: 80px 40px;
          margin: 0 -20px;
        }
        .neo-final-cta h2 { color: #ffffff; margin-bottom: 16px; font-size: 2rem; font-weight: 800; }
        .neo-final-cta p { color: var(--neo-muted-on-dark); font-size: 1.05rem; margin: 0 0 40px; }
        .neo-final-cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        /* ── MODAL ── */
        .neo-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(6px);
        }
        .neo-modal-content {
          background: #1a1a1a;
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 20px;
          padding: 40px;
          max-width: 560px;
          width: 100%;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }
        .neo-modal-close {
          position: absolute;
          top: 16px;
          right: 20px;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: var(--neo-muted-on-dark);
          line-height: 1;
          padding: 0;
          transition: color 0.2s ease;
        }
        .neo-modal-close:hover { color: #fff; }
        /* ── STICKY MOBILE CTA ── */
        .neo-sticky-cta {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 500;
          background: rgba(10,10,11,0.95);
          border-top: 1px solid rgba(201,168,76,0.3);
          padding: 12px 16px;
          gap: 10px;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
        }
        .neo-sticky-btn { flex: 1; padding: 14px 16px; font-size: 0.9rem; }
        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .neo-gallery-grid { grid-template-columns: repeat(2, 1fr); }
          .neo-use-cases-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .neo-landing { padding-bottom: 80px; }
          .neo-hero { grid-template-columns: 1fr; gap: 32px; padding: 40px 0 48px; }
          .neo-hero-content h1 { font-size: 1.9rem; }
          .neo-hero-gallery { order: -1; }
          .neo-hero-ctas { flex-direction: column; }
          .neo-hero-ctas .neo-cta-primary,
          .neo-hero-ctas .neo-cta-secondary { width: 100%; text-align: center; }
          .neo-section-title,
          .neo-gallery .neo-section-title,
          .neo-use-cases .neo-section-title,
          .neo-how-it-works .neo-section-title,
          .neo-faq .neo-section-title,
          .neo-final-cta h2 { font-size: 1.5rem; }
          .neo-gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .neo-use-cases { margin: 0 0 60px; padding: 40px 20px; }
          .neo-use-cases-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
          .neo-use-case-card { padding: 24px 16px; }
          .neo-steps { grid-template-columns: 1fr; gap: 32px; }
          .neo-steps::before { display: none; }
          .neo-final-cta { margin: 0; padding: 50px 20px; }
          .neo-final-cta-buttons { flex-direction: column; }
          .neo-final-cta-buttons .neo-cta-primary,
          .neo-final-cta-buttons .neo-cta-secondary { width: 100%; }
          .neo-sticky-cta { display: flex; }
          .neo-modal-content { padding: 24px 20px; }
        }
        @media (max-width: 480px) {
          .neo-use-cases-grid { grid-template-columns: 1fr; }
          .neo-gallery-grid { grid-template-columns: 1fr 1fr; }
          .neo-hero-thumbs { gap: 8px; }
        }
      `}</style>

      <div className="neo-landing">
        {/* ── HERO ── */}
        <section className="neo-hero">
          <div className="neo-hero-content">
            <h1>{isRu ? 'Часы NEO с вашей гравировкой' : 'NEO soatlari — sizning gravyurangiz'}</h1>
            <p className="neo-hero-subtitle">
              {isRu
                ? 'Кварцевые и механические. От идеи до готового подарка — с бесплатным макетом перед нанесением.'
                : "Kvars va mexanik. G'oyadan tayyor sovg'agacha — naqsh qo'yishdan oldin bepul maket bilan."}
            </p>
            <div className="neo-hero-bullets">
              <span>✓ {isRu ? 'Персональная гравировка' : 'Shaxsiy gravyura'}</span>
              <span>✓ {isRu ? 'Макет перед нанесением' : 'Naqshdan oldin maket'}</span>
              <span>✓ {isRu ? 'Для себя и корпоративно' : "O'zingiz va korporativ"}</span>
            </div>
            <div className="neo-hero-ctas">
              <button className="neo-cta-primary" onClick={handleFormOpen}>
                {isRu ? 'Оставить заявку' : 'Ariza qoldirish'}
              </button>
              <button className="neo-cta-secondary" onClick={handleTelegramClick}>
                {isRu ? 'Написать в Telegram' : 'Telegramda yozish'}
              </button>
            </div>
          </div>
          <div className="neo-hero-gallery">
            <div className="neo-hero-main-photo">
              <Image
                src={GALLERY_PHOTOS[activePhoto].src}
                alt={isRu ? GALLERY_PHOTOS[activePhoto].altRu : GALLERY_PHOTOS[activePhoto].altUz}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <div className="neo-hero-thumbs">
              {GALLERY_PHOTOS.map((photo, i) => (
                <button
                  key={i}
                  className={`neo-thumb${activePhoto === i ? ' active' : ''}`}
                  onClick={() => setActivePhoto(i)}
                  aria-label={isRu ? photo.altRu : photo.altUz}
                >
                  <Image
                    src={photo.src}
                    alt={isRu ? photo.altRu : photo.altUz}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="neo-divider" />

        {/* ── PHOTO GALLERY ── */}
        <section className="neo-gallery">
          <h2 className="neo-section-title">{isRu ? 'Варианты исполнения' : 'Bajarilish variantlari'}</h2>
          <p className="neo-section-subtitle">
            {isRu
              ? 'Четыре цветовых решения — выберите то, что подходит именно вам.'
              : "To'rtta rang yechimi — o'zingizga mos kelganini tanlang."}
          </p>
          <div className="neo-gallery-grid">
            {GALLERY_PHOTOS.map((photo, i) => (
              <div key={i} className="neo-gallery-item">
                <Image
                  src={photo.src}
                  alt={isRu ? photo.altRu : photo.altUz}
                  width={400}
                  height={400}
                  style={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                />
                <p className="neo-gallery-caption">
                  {isRu ? photo.altRu : photo.altUz}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── USE CASES ── */}
        <section className="neo-use-cases">
          <h2 className="neo-section-title">{isRu ? 'Кому подходят часы NEO?' : 'NEO soatlari kimga mos keladi?'}</h2>
          <div className="neo-use-cases-grid">
            {USE_CASES.map((item, i) => (
              <div key={i} className="neo-use-case-card">
                <div className="neo-use-case-icon">{item.icon}</div>
                <h4>{isRu ? item.titleRu : item.titleUz}</h4>
                <p>{isRu ? item.textRu : item.textUz}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="neo-how-it-works">
          <h2 className="neo-section-title">{isRu ? '3 шага до вашего подарка' : "Sovg'angizgacha 3 qadam"}</h2>
          <div className="neo-steps">
            <div className="neo-step">
              <div className="neo-step-number">1</div>
              <h4>{isRu ? 'Обсуждаем идею' : "G'oyani muhokama qilamiz"}</h4>
              <p>{isRu
                ? 'Оставьте заявку или напишите в Telegram. Мы уточним детали: текст, символ, количество.'
                : "Ariza qoldiring yoki Telegramda yozing. Biz tafsilotlarni aniqlaymiz: matn, ramz, miqdor."}</p>
            </div>
            <div className="neo-step">
              <div className="neo-step-number">2</div>
              <h4>{isRu ? 'Согласуем макет' : 'Maketni kelishib olamiz'}</h4>
              <p>{isRu
                ? 'Наш дизайнер создаёт цифровой макет бесплатно. Вы видите результат до нанесения.'
                : "Dizaynerimiz bepul raqamli maket yaratadi. Siz naqsh qo'yishdan oldin natijani ko'rasiz."}</p>
            </div>
            <div className="neo-step">
              <div className="neo-step-number">3</div>
              <h4>{isRu ? 'Гравируем и доставляем' : 'Gravyura qilamiz va yetkazamiz'}</h4>
              <p>{isRu
                ? 'После вашего одобрения наносим гравировку и доставляем в премиальной упаковке.'
                : "Sizning roziligingizdan so'ng gravyura qilamiz va premium o'ramda yetkazib beramiz."}</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="neo-faq">
          <h2 className="neo-section-title">{isRu ? 'Частые вопросы' : "Ko'p so'raladigan savollar"}</h2>
          <div className="neo-faq-list">
            {faqItems.map((item, i) => (
              <div key={i} className={`neo-faq-item${openFaq === i ? ' open' : ''}`}>
                <button
                  className="neo-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className="neo-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="neo-faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="neo-final-cta">
          <h2>{isRu ? 'Готовы создать ваш уникальный подарок?' : "Noyob sovg'angizni yaratishga tayyormisiz?"}</h2>
          <p>{isRu
            ? 'Оставьте заявку — мы свяжемся, обсудим идею и пришлём бесплатный макет.'
            : "Ariza qoldiring — biz bog'lanamiz, g'oyani muhokama qilamiz va bepul maket yuboramiz."}</p>
          <div className="neo-final-cta-buttons">
            <button className="neo-cta-primary" onClick={handleFormOpen}>
              {isRu ? 'Оставить заявку' : 'Ariza qoldirish'}
            </button>
            <button className="neo-cta-secondary" onClick={handleTelegramClick}>
              {isRu ? 'Написать в Telegram' : 'Telegramda yozish'}
            </button>
          </div>
        </section>
      </div>

      {/* ── MODAL FORM ── */}
      {showForm && (
        <div className="neo-modal-overlay" onClick={handleFormClose}>
          <div className="neo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="neo-modal-close" onClick={handleFormClose} aria-label="Закрыть">×</button>
            <ContactForm locale={locale} />
          </div>
        </div>
      )}

      {/* ── STICKY MOBILE CTA ── */}
      <div className="neo-sticky-cta">
        <button className="neo-cta-primary neo-sticky-btn" onClick={handleFormOpen}>
          {isRu ? 'Оставить заявку' : 'Ariza qoldirish'}
        </button>
        <button className="neo-cta-secondary neo-sticky-btn" onClick={handleTelegramClick}>
          Telegram
        </button>
      </div>
    </>
  )
}
