'use client'

// LightersLanding.tsx
// Exact transplant from CRA frontend/src/pages/LightersPage.js
// Minimal adaptations: React Router → Next.js Link, img → Next.js Image, CRA-specific imports removed

import Link from 'next/link'
import Image from 'next/image'

// ── Product data (exact from CRA) ──────────────────────────────────────────
const products = [
  {
    id: 'silver-gloss',
    sku: 'R-109',
    nameRu: 'Silver Gloss',
    nameUz: 'Silver Gloss',
    price: 140000,
    descRu: 'Минимализм и чёткость: имя, дата, инициалы — чисто и строго.',
    descUz: "Minimal va tartibli: ism, sana, initsial — toza ko'rinadi.",
    bestFor: ['logos', 'text', 'contour'],
    color: 'from-gray-300 to-gray-100',
    image: '/images/products/lighters/r109_silver_gloss.jpg',
    altRu: 'Серебристая глянцевая зажигалка R-109 с лазерной гравировкой',
    altUz: 'R-109 kumushrang yaltiroq zajigalka lazer gravyurasi bilan',
  },
  {
    id: 'black-matte',
    sku: 'R-110',
    nameRu: 'Black Matte',
    nameUz: 'Black Matte',
    price: 150000,
    descRu: 'Логотип или символ + короткая подпись: баланс "видно" и "смысл".',
    descUz: "Logotip yoki belgi + qisqa yozuv: ko'rinish va ma'no muvozanati.",
    bestFor: ['photos', 'detailed', 'portraits'],
    color: 'from-gray-800 to-gray-900',
    image: '/images/products/lighters/r110_black_matte.jpg',
    altRu: 'Чёрная матовая зажигалка R-110 для фотогравировки',
    altUz: 'R-110 qora mat zajigalka foto-gravirovka uchun',
  },
  {
    id: 'black-texture',
    sku: 'R-111',
    nameRu: 'Black Texture',
    nameUz: 'Black Texture',
    price: 170000,
    descRu: 'Контрастный стиль для монограммы или короткой фразы — выглядит собрано.',
    descUz: "Kontrastli uslub: monogramma yoki qisqa ibora uchun juda mos.",
    bestFor: ['graphic', 'deep', 'brutal'],
    color: 'from-gray-700 to-black',
    image: '/images/products/lighters/r111_black_texture.jpg',
    altRu: 'Текстурированная чёрная зажигалка R-111 для глубокой гравировки',
    altUz: 'R-111 teksturali qora zajigalka chuqur gravirovka uchun',
  },
  {
    id: 'brushed-steel',
    sku: 'R-112',
    nameRu: 'Brushed Steel',
    nameUz: 'Brushed Steel',
    price: 160000,
    descRu: 'Максимум индивидуальности: знак/логотип и отдельная подпись.',
    descUz: "Maksimal individuallik: belgi/logotip va alohida yozuv.",
    bestFor: ['text', 'universal', 'daily'],
    color: 'from-gray-500 to-gray-400',
    image: '/images/products/lighters/r112_brushed_steel.jpg',
    altRu: 'Зажигалка R-112 из шлифованной стали — универсальный выбор',
    altUz: "R-112 silliqlangan po'lat zajigalka — universal tanlov",
  },
]

// ── Engraving benefits (exact from CRA) ───────────────────────────────────
const engravingTypes = [
  { nameRu: 'Чёткая лазерная гравировка по металлу: линии читаются, края ровные', nameUz: "Metallga aniq lazer gravyura: chiziqlar o'qiladi, konturlar silliq", icon: '✓' },
  { nameRu: 'Макет до нанесения: вы видите, как будет выглядеть готовый вариант', nameUz: "Gravyuradan oldin maket: tayyor ko'rinishini avval ko'rasiz", icon: '✓' },
  { nameRu: 'Подходит для подарка и брендинга: инициалы, символы, логотипы', nameUz: "Sovg'a va brendlash uchun: initsial, belgi, logotip, qisqa ibora", icon: '✓' },
  { nameRu: 'Премиальный "вес" вещи: минимализм, который запоминается', nameUz: "Minimalizm + \"vazn\": ko'rinishi jiddiy, esda qoladi", icon: '✓' },
  { nameRu: 'Гравируем на нашей продукции — стабильный результат', nameUz: "Gravyurani o'z mahsulotimizga qilamiz — sirt toza, natija barqaror", icon: '✓' },
  { nameRu: 'Можно сделать лаконично или "с историей" — на одной или двух сторонах', nameUz: "Bir tomonga yoki ikki tomonga: qisqa yoki \"ma'noli\" variant", icon: '✓' },
]

// ── Specs (exact from CRA) ─────────────────────────────────────────────────
const specs = { height: '57 мм', width: '38 мм', depth: '13 мм', weight: '55-60 г' }

interface Props {
  locale: string
}

export default function LightersLanding({ locale }: Props) {
  const isRu = locale === 'ru'

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(isRu ? 'ru-RU' : 'uz-UZ').format(price)

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Hero Section (exact from CRA lines 226-305) ─────────────────── */}
      <section className="pt-24 pb-16 relative overflow-hidden" data-testid="lighters-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-black to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href={`/${locale}`} className="hover:text-teal-500 transition">{isRu ? 'Главная' : 'Bosh sahifa'}</Link>
            <span>/</span>
            <span className="text-gray-300">{isRu ? 'Зажигалки' : 'Zajigalkalar'}</span>
          </nav>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c0 0-6 5.686-6 10a6 6 0 0012 0c0-4.314-6-10-6-10z"/></svg>
              {isRu ? 'Премиум коллекция' : 'Premium kolleksiya'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {isRu ? 'Металлические зажигалки с лазерной гравировкой' : 'Metall zajigalkalarda lazer gravyura'}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                {' '}{isRu ? '— персональный подарок без лишних слов' : "— ortiqcha gaplarsiz esda qoladigan sovg'a"}
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {isRu
                ? 'Имя, дата, фраза или логотип — аккуратно наносим на металл. Сначала согласуем макет, затем делаем гравировку, чтобы результат выглядел достойно.'
                : "Ism, sana, ibora yoki logotipni metallga tartibli tushiramiz. Avval maketni kelishamiz, keyin gravyura qilamiz — natija chiroyli va \"premium\" ko'rinadi."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/GraverAdm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-700 transition"
                data-testid="lighters-cta-models"
              >
                {isRu ? 'Получить макет' : 'Maketni olish'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
              <a
                href="https://t.me/GraverAdm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition border border-gray-700"
                data-testid="lighters-cta-download"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                {isRu ? 'Написать в Telegram' : 'Telegramga yozish'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Section (exact from CRA lines 307-357) ─────────────── */}
      <section id="products" className="py-20 bg-gray-900/50" data-testid="lighters-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isRu ? 'Модели зажигалок' : 'Zajigalka modellari'}
            </h2>
            <p className="text-gray-400 text-lg">
              {isRu ? '4 варианта покрытия под разные типы гравировок' : '4 xil qoplama turi har xil gravirovkalar uchun'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition group"
                data-testid={`product-card-${idx + 1}`}
              >
                <div className="aspect-square relative overflow-hidden bg-gray-800">
                  <Image
                    src={product.image}
                    alt={isRu ? product.altRu : product.altUz}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {product.sku}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                    {product.nameRu}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {isRu ? product.descRu : product.descUz}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-400">
                      {formatPrice(product.price)}{' '}
                      <span className="text-sm text-gray-500">{isRu ? 'сум' : "so'm"}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Engraving Benefits (exact from CRA lines 359-380) ───────────── */}
      <section className="py-20 bg-black" data-testid="lighters-engraving">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isRu ? 'Преимущества' : 'Afzalliklar'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engravingTypes.map((type, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-start gap-3 hover:border-orange-500/50 transition"
              >
                <span className="text-teal-500 text-xl flex-shrink-0">{type.icon}</span>
                <span className="text-gray-300 text-sm">{isRu ? type.nameRu : type.nameUz}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specifications Section (exact from CRA lines 382-451) ────────── */}
      <section className="py-20 bg-gray-900/50" data-testid="lighters-specs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {isRu ? 'Технические характеристики' : 'Texnik xususiyatlari'}
              </h2>
              <p className="text-gray-400 mb-8">
                {isRu
                  ? 'Классическая бензиновая зажигалка с откидной крышкой в металлическом корпусе. Надежная конструкция, простая заправка и характерный щелчок крышки.'
                  : "Metall korpusli qopqog'i ochiladigan klassik benzinli zajigalka. Ishonchli konstruksiya, oson yoqilg'i quyish va qopqoqning o'ziga xos \"chert\" tovushi."}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: isRu ? 'Высота' : 'Balandligi', value: specs.height },
                  { label: isRu ? 'Ширина' : 'Kengligi', value: specs.width },
                  { label: isRu ? 'Толщина' : 'Qalinligi', value: specs.depth },
                  { label: isRu ? 'Вес' : "Og'irligi", value: specs.weight },
                ].map((spec, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                    <div>
                      <p className="text-gray-400 text-xs">{spec.label}</p>
                      <p className="text-white font-bold">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: '🛡', color: 'text-teal-500', title: isRu ? 'Металлический корпус' : 'Metall korpus', desc: isRu ? 'Прочный и долговечный' : "Mustahkam va uzoq muddatli" },
                { icon: '🔥', color: 'text-orange-500', title: isRu ? 'Кремневый механизм' : "Kremniyli mexanizm", desc: isRu ? 'Надёжный поджиг в любую погоду' : "Har qanday obhavoda ishonchli yoqish" },
                { icon: '💨', color: 'text-cyan-500', title: isRu ? 'Ветрозащитный кожух' : "Shamoldan himoya", desc: isRu ? 'Работает при ветре' : "Shamolda ham ishlaydi" },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 flex items-start gap-4">
                  <span className={`text-2xl flex-shrink-0 ${item.color}`}>{item.icon}</span>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section (exact from CRA lines 453-505) ───────────────────── */}
      <section className="py-20 bg-gradient-to-b from-orange-900/30 to-black" data-testid="lighters-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {isRu ? 'Готовы сделать заказ?' : "Buyurtma berishga tayyormisiz?"}
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            {isRu
              ? 'Напишите нам — согласуем макет, уточним тираж и сроки. Ответим быстро.'
              : "Yozing — maketni kelishamiz, tiraj va muddatni aniqlaymiz. Tez javob beramiz."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/GraverAdm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-5 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-700 transition shadow-lg shadow-orange-500/30"
              data-testid="lighters-cta-telegram"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              {isRu ? 'Написать в Telegram' : 'Telegramga yozish'}
            </a>
            <a
              href="tel:+998770802288"
              className="inline-flex items-center justify-center bg-gray-800 text-white px-10 py-5 rounded-lg font-bold text-lg hover:bg-gray-700 transition border border-gray-700"
              data-testid="lighters-cta-phone"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +998 77 080 22 88
            </a>
          </div>
        </div>
      </section>

      {/* ── Related Products (exact from CRA lines 551-578) ─────────────── */}
      <section className="py-12 bg-black" data-testid="lighters-related-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {isRu ? 'Другие продукты с гравировкой' : "Boshqa gravyurali mahsulotlar"}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/products/neo-watches`}
              className="bg-gray-900 border border-gray-800 rounded-lg px-6 py-3 text-gray-300 hover:text-teal-400 hover:border-teal-500/50 transition"
            >
              {isRu ? '⌚ Часы NEO с логотипом' : "⌚ NEO logotipli soat"}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="bg-gray-900 border border-gray-800 rounded-lg px-6 py-3 text-gray-300 hover:text-teal-400 hover:border-teal-500/50 transition"
            >
              {isRu ? '📖 Блог о гравировке' : "📖 Gravyura haqida blog"}
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="bg-gray-900 border border-gray-800 rounded-lg px-6 py-3 text-gray-300 hover:text-teal-400 hover:border-teal-500/50 transition"
            >
              {isRu ? '📦 Заказать гравировку' : "📦 Gravyura buyurtma berish"}
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
