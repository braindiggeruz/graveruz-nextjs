#!/usr/bin/env node
/**
 * Append a "Related Money Pages" hub block to broad gift cluster articles.
 * Idempotent: skips files that already contain the SENTINEL marker.
 *
 * Run: node scripts/append-money-pages-cta.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SENTINEL_TEXT = '<!-- moneyPagesHub:v1 -->'
// Idempotency sentinel: use unique heading texts (MDX-safe) instead of HTML comments
const RU_SENTINEL_HEADING = '## Связанные услуги Graver Studio'
const RU_B2B_SENTINEL_HEADING = '## Заказать'
const UZ_SENTINEL_HEADING = '## Graver Studio xizmatlari'
const UZ_B2B_SENTINEL_HEADING = "## Graver Studio'da"
function isAlreadyApplied(raw) {
  return (
    raw.includes(RU_SENTINEL_HEADING) ||
    raw.includes(RU_B2B_SENTINEL_HEADING) ||
    raw.includes(UZ_SENTINEL_HEADING) ||
    raw.includes(UZ_B2B_SENTINEL_HEADING)
  )
}

const TARGETS = [
  // ── RU broad gift cluster ────────────────────────────────────────────
  {
    file: 'content/blog/ru/chto-podarit-na-den-rozhdeniya.mdx',
    block: `



## Связанные услуги Graver Studio в Ташкенте

Если ищете больше идей под конкретную задачу, посмотрите тематические разделы:

- [Подарки с гравировкой для бизнеса](/ru/engraved-gifts/) — корпоративные сувениры с логотипом, материалы, тиражи.
- [Корпоративные подарки в Ташкенте](/ru/korporativnye-podarki/) — гид по подаркам для сотрудников, клиентов и партнёров.
- [Лазерная гравировка в Ташкенте](/ru/lazernaya-gravirovka-tashkent/) — как мы наносим имя, дату или логотип на изделия.

И ещё несколько подборок по поводу: [подарки мужчине](/ru/blog/chto-podarit-muzhchine/), [подарки женщине](/ru/blog/chto-podarit-zhenshchine/), [оригинальные подарки с гравировкой](/ru/blog/originalnye-podarki/).
`,
  },
  {
    file: 'content/blog/ru/chto-podarit-muzhchine.mdx',
    block: `



## Связанные услуги Graver Studio в Ташкенте

- [Подарки с гравировкой для бизнеса](/ru/engraved-gifts/) — корпоративные сувениры, материалы и тиражи.
- [Корпоративные подарки в Ташкенте](/ru/korporativnye-podarki/) — гид по подаркам для сотрудников и партнёров.
- [Лазерная гравировка в Ташкенте](/ru/lazernaya-gravirovka-tashkent/) — нанесение имени, инициалов или логотипа.

Полезные подборки рядом по теме: [подарки на день рождения](/ru/blog/chto-podarit-na-den-rozhdeniya/), [подарки женщине](/ru/blog/chto-podarit-zhenshchine/), [оригинальные подарки с гравировкой](/ru/blog/originalnye-podarki/).
`,
  },
  {
    file: 'content/blog/ru/chto-podarit-zhenshchine.mdx',
    block: `



## Связанные услуги Graver Studio в Ташкенте

- [Подарки с гравировкой для бизнеса](/ru/engraved-gifts/) — корпоративные сувениры с логотипом и материалы для гравировки.
- [Корпоративные подарки в Ташкенте](/ru/korporativnye-podarki/) — гид по подаркам для коллег и партнёров.
- [Лазерная гравировка в Ташкенте](/ru/lazernaya-gravirovka-tashkent/) — нанесение имени, даты или фразы.

Похожие подборки: [подарки на день рождения](/ru/blog/chto-podarit-na-den-rozhdeniya/), [подарки мужчине](/ru/blog/chto-podarit-muzhchine/), [оригинальные подарки с гравировкой](/ru/blog/originalnye-podarki/).
`,
  },
  {
    file: 'content/blog/ru/originalnye-podarki.mdx',
    block: `



## Связанные услуги Graver Studio в Ташкенте

- [Подарки с гравировкой для бизнеса](/ru/engraved-gifts/) — что и из каких материалов мы делаем.
- [Корпоративные подарки в Ташкенте](/ru/korporativnye-podarki/) — подарки для команды, клиентов и партнёров.
- [Лазерная гравировка в Ташкенте](/ru/lazernaya-gravirovka-tashkent/) — как сделать подарок именным.

Другие гиды по подаркам: [день рождения](/ru/blog/chto-podarit-na-den-rozhdeniya/), [подарки мужчине](/ru/blog/chto-podarit-muzhchine/), [подарки женщине](/ru/blog/chto-podarit-zhenshchine/).
`,
  },

  // ── UZ broad gift cluster ────────────────────────────────────────────
  {
    file: 'content/blog/uz/tugilgan-kunga-sovgalar.mdx',
    block: `



## Graver Studio xizmatlari (Toshkent)

Aniq vazifa uchun ko'proq g'oya kerak bo'lsa, quyidagi bo'limlarni qarang:

- [Gravyurali sovg'alar biznes uchun](/uz/engraved-gifts/) — logotip bilan korporativ suvenirlar, materiallar, tiraj.
- [Toshkentda korporativ sovg'alar](/uz/korporativnye-podarki/) — xodimlar, mijozlar va hamkorlar uchun sovg'alar bo'yicha qo'llanma.
- [Toshkentda lazer gravyura](/uz/toshkentda-lazer-gravyura/) — ism, sana yoki logotipni qanday tushirishimiz.

Yana foydali bo'limlar: [erkak uchun sovg'alar](/uz/blog/erkak-sovgalari/), [ayol uchun sovg'alar](/uz/blog/ayol-sovgalari/), [noyob sovg'alar (gravyura bilan)](/uz/blog/noyob-sovgalar/).
`,
  },
  {
    file: 'content/blog/uz/erkak-sovgalari.mdx',
    block: `



## Graver Studio xizmatlari (Toshkent)

- [Gravyurali sovg'alar biznes uchun](/uz/engraved-gifts/) — korporativ suvenirlar, materiallar, tiraj.
- [Toshkentda korporativ sovg'alar](/uz/korporativnye-podarki/) — xodimlar va hamkorlar uchun sovg'alar gidi.
- [Toshkentda lazer gravyura](/uz/toshkentda-lazer-gravyura/) — ism, bosh harflar yoki logotip.

Mavzu bo'yicha to'plamlar: [tug'ilgan kunga sovg'alar](/uz/blog/tugilgan-kunga-sovgalar/), [ayol uchun sovg'alar](/uz/blog/ayol-sovgalari/), [noyob sovg'alar](/uz/blog/noyob-sovgalar/).
`,
  },
  {
    file: 'content/blog/uz/ayol-sovgalari.mdx',
    block: `



## Graver Studio xizmatlari (Toshkent)

- [Gravyurali sovg'alar biznes uchun](/uz/engraved-gifts/) — logotip bilan korporativ suvenirlar.
- [Toshkentda korporativ sovg'alar](/uz/korporativnye-podarki/) — hamkasblar va hamkorlar uchun sovg'alar gidi.
- [Toshkentda lazer gravyura](/uz/toshkentda-lazer-gravyura/) — ism, sana yoki ibora tushirish.

O'xshash to'plamlar: [tug'ilgan kunga sovg'alar](/uz/blog/tugilgan-kunga-sovgalar/), [erkak uchun sovg'alar](/uz/blog/erkak-sovgalari/), [noyob sovg'alar](/uz/blog/noyob-sovgalar/).
`,
  },
  {
    file: 'content/blog/uz/noyob-sovgalar.mdx',
    block: `



## Graver Studio xizmatlari (Toshkent)

- [Gravyurali sovg'alar biznes uchun](/uz/engraved-gifts/) — nima va qaysi materiallarda qilishimiz.
- [Toshkentda korporativ sovg'alar](/uz/korporativnye-podarki/) — jamoa, mijoz va hamkorlar uchun sovg'alar.
- [Toshkentda lazer gravyura](/uz/toshkentda-lazer-gravyura/) — sovg'ani shaxsiy va esda qoladigan qilish.

Boshqa sovg'a gidlari: [tug'ilgan kun](/uz/blog/tugilgan-kunga-sovgalar/), [erkak uchun sovg'alar](/uz/blog/erkak-sovgalari/), [ayol uchun sovg'alar](/uz/blog/ayol-sovgalari/).
`,
  },

  // ── RU B2B cluster (lighter touch — single block, 3 money links) ─────
  {
    file: 'content/blog/ru/welcome-pack-dlya-sotrudnikov.mdx',
    block: `



## Заказать welcome-пак в Graver Studio

- [Welcome-паки с гравировкой логотипа](/ru/welcome-packs/) — готовые пакеты Start / Standart / Premium с ценами.
- [Корпоративные подарки в Ташкенте](/ru/korporativnye-podarki/) — другие форматы B2B-подарков.
- [Подарки с гравировкой для бизнеса](/ru/engraved-gifts/) — материалы, процесс, доставка.

Полезные статьи рядом: [гид по корпоративным подаркам в Узбекистане](/ru/blog/korporativnye-podarki-uzbekistan/), [кейс welcome-пак для IT-компании](/ru/blog/case-study-welcome-pack-enps/), [подарки сотрудникам — HR-гайд](/ru/blog/podarki-sotrudnikam-hr-gayd/).
`,
  },
  {
    file: 'content/blog/ru/podarki-sotrudnikam-hr-gayd.mdx',
    block: `



## Заказать подарки сотрудникам в Graver Studio

- [Корпоративные подарки в Ташкенте](/ru/korporativnye-podarki/) — каталог подарков для команды.
- [Welcome-паки для сотрудников](/ru/welcome-packs/) — готовые наборы для онбординга.
- [Подарки с гравировкой для бизнеса](/ru/engraved-gifts/) — материалы, тиражи и сроки.

Подробнее: [welcome-пак — полный гид](/ru/blog/welcome-pack-dlya-sotrudnikov/), [гид по корпоративным подаркам в Узбекистане](/ru/blog/korporativnye-podarki-uzbekistan/), [брендирование сувениров](/ru/blog/brendirovanie-suvenirov/).
`,
  },
  {
    file: 'content/blog/ru/brendirovanie-suvenirov.mdx',
    block: `



## Заказать брендированные сувениры в Graver Studio

- [Подарки с гравировкой для бизнеса](/ru/engraved-gifts/) — материалы и процесс гравировки.
- [Корпоративные подарки в Ташкенте](/ru/korporativnye-podarki/) — каталог B2B-подарков.
- [Welcome-паки для сотрудников](/ru/welcome-packs/) — готовые брендированные наборы.

Связанные статьи: [гид по корпоративным подаркам в Узбекистане](/ru/blog/korporativnye-podarki-uzbekistan/), [подарочные наборы с логотипом](/ru/blog/podarochnye-nabory-s-logotipom/), [как выбрать корпоративный подарок](/ru/blog/kak-vybrat-korporativnyj-podarok/).
`,
  },
  {
    file: 'content/blog/ru/kak-vybrat-korporativnyj-podarok.mdx',
    block: `



## Заказать корпоративный подарок в Graver Studio

- [Корпоративные подарки в Ташкенте](/ru/korporativnye-podarki/) — каталог подарков для команды и партнёров.
- [Подарки с гравировкой для бизнеса](/ru/engraved-gifts/) — материалы и процесс заказа.
- [Welcome-паки для сотрудников](/ru/welcome-packs/) — готовые наборы для онбординга.

Похожие гиды: [гид по корпоративным подаркам в Узбекистане](/ru/blog/korporativnye-podarki-uzbekistan/), [этикет B2B-подарков](/ru/blog/korporativnye-podarki-b2b-etiket/), [подарочные наборы с логотипом](/ru/blog/podarochnye-nabory-s-logotipom/).
`,
  },
  {
    file: 'content/blog/ru/podarki-na-8-marta-sotrudnitsam.mdx',
    block: `



## Заказать подарки на 8 марта в Graver Studio

- [Корпоративные подарки в Ташкенте](/ru/korporativnye-podarki/) — каталог B2B-подарков.
- [Подарки с гравировкой для бизнеса](/ru/engraved-gifts/) — материалы, тиражи и сроки.
- [Лазерная гравировка в Ташкенте](/ru/lazernaya-gravirovka-tashkent/) — нанесение имени или фразы на подарок.

Полезные статьи: [подарки сотрудникам — HR-гайд](/ru/blog/podarki-sotrudnikam-hr-gayd/), [идеи VIP-подарков](/ru/blog/idei-vip-podarkov/), [20 идей подарков на 8 марта](/ru/blog/podarki-8-marta-20-idej/).
`,
  },

  // ── UZ B2B cluster ────────────────────────────────────────────────────
  {
    file: 'content/blog/uz/xodimlar-uchun-welcome-pack.mdx',
    block: `



## Graver Studio'da welcome-pak buyurtma berish

- [Logotip gravyurasi bilan welcome-paklar](/uz/welcome-packs/) — Start / Standart / Premium tayyor paketlar.
- [Toshkentda korporativ sovg'alar](/uz/korporativnye-podarki/) — boshqa B2B sovg'a formatlari.
- [Gravyurali sovg'alar biznes uchun](/uz/engraved-gifts/) — materiallar, jarayon, yetkazib berish.

Foydali maqolalar: [O'zbekistonda korporativ sovg'alar](/uz/blog/korporativ-sovgalar-ozbekiston/), [xodimlar uchun HR sovg'a gidi](/uz/blog/xodimlarga-sovgalar-hr-gayd/), [korporativ sovg'ani qanday tanlash](/uz/blog/korporativ-sovgani-qanday-tanlash/).
`,
  },
  {
    file: 'content/blog/uz/xodimlarga-sovgalar-hr-gayd.mdx',
    block: `



## Graver Studio'da xodimlar uchun sovg'a buyurtma berish

- [Toshkentda korporativ sovg'alar](/uz/korporativnye-podarki/) — jamoa uchun sovg'alar katalogi.
- [Xodimlar uchun welcome-pak](/uz/welcome-packs/) — onboarding uchun tayyor to'plamlar.
- [Gravyurali sovg'alar biznes uchun](/uz/engraved-gifts/) — materiallar, tiraj va muddatlar.

Batafsil: [welcome-pak — to'liq qo'llanma](/uz/blog/xodimlar-uchun-welcome-pack/), [O'zbekistonda korporativ sovg'alar](/uz/blog/korporativ-sovgalar-ozbekiston/), [suvenirlarni brendlash](/uz/blog/suvenir-brendlash/).
`,
  },
  {
    file: 'content/blog/uz/suvenir-brendlash.mdx',
    block: `



## Graver Studio'da brendlangan suvenirlar buyurtma berish

- [Gravyurali sovg'alar biznes uchun](/uz/engraved-gifts/) — materiallar va gravyura jarayoni.
- [Toshkentda korporativ sovg'alar](/uz/korporativnye-podarki/) — B2B sovg'alar katalogi.
- [Xodimlar uchun welcome-pak](/uz/welcome-packs/) — tayyor brendlangan to'plamlar.

Bog'liq maqolalar: [O'zbekistonda korporativ sovg'alar](/uz/blog/korporativ-sovgalar-ozbekiston/), [logotipli sovg'a setlari](/uz/blog/logotipli-sovga-setlari/), [korporativ sovg'ani qanday tanlash](/uz/blog/korporativ-sovgani-qanday-tanlash/).
`,
  },
  {
    file: 'content/blog/uz/korporativ-sovgani-qanday-tanlash.mdx',
    block: `



## Graver Studio'da korporativ sovg'a buyurtma berish

- [Toshkentda korporativ sovg'alar](/uz/korporativnye-podarki/) — jamoa va hamkorlar uchun sovg'alar katalogi.
- [Gravyurali sovg'alar biznes uchun](/uz/engraved-gifts/) — materiallar va buyurtma jarayoni.
- [Xodimlar uchun welcome-pak](/uz/welcome-packs/) — onboarding uchun tayyor to'plamlar.

O'xshash qo'llanmalar: [O'zbekistonda korporativ sovg'alar](/uz/blog/korporativ-sovgalar-ozbekiston/), [B2B sovg'alar etiketi](/uz/blog/b2b-hamkorlar-uchun-sovgalar-etiket-gid/), [logotipli sovg'a setlari](/uz/blog/logotipli-sovga-setlari/).
`,
  },
  {
    file: 'content/blog/uz/8-martda-xodimalarga-sovgalar.mdx',
    block: `



## Graver Studio'da 8-mart sovg'alarini buyurtma berish

- [Toshkentda korporativ sovg'alar](/uz/korporativnye-podarki/) — B2B sovg'alar katalogi.
- [Gravyurali sovg'alar biznes uchun](/uz/engraved-gifts/) — materiallar, tiraj va muddatlar.
- [Toshkentda lazer gravyura](/uz/toshkentda-lazer-gravyura/) — ism yoki iborani sovg'aga tushirish.

Foydali maqolalar: [xodimlar uchun HR sovg'a gidi](/uz/blog/xodimlarga-sovgalar-hr-gayd/), [VIP sovg'a g'oyalari](/uz/blog/vip-sovga-goyalari/), [8 mart uchun korporativ sovg'a g'oyalari](/uz/blog/8-mart-uchun-korporativ-sovgalar-goyalari/).
`,
  },
]

let added = 0
let skipped = 0
let missing = 0

for (const { file, block } of TARGETS) {
  const full = path.join(ROOT, file)
  if (!fs.existsSync(full)) {
    console.warn(`[money-cta] MISSING: ${file}`)
    missing++
    continue
  }
  const raw = fs.readFileSync(full, 'utf-8')
  if (isAlreadyApplied(raw)) {
    skipped++
    continue
  }
  fs.writeFileSync(full, raw.trimEnd() + block, 'utf-8')
  console.log(`[money-cta] appended -> ${file}`)
  added++
}

console.log(`\n[money-cta] done. added=${added} skipped=${skipped} missing=${missing}`)
