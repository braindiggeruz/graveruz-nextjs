/**
 * RU → UZ translation glossary for Graver Studio.
 * Used by the translator to force consistent terminology.
 *
 * Source of truth — change here and re-run translation jobs to get
 * uniform UZ output across all pages, products and stories.
 */
export const GLOSSARY_RU_UZ = [
  ['лазерная гравировка', 'lazer gravyura'],
  ['Лазерная гравировка', 'Lazer gravyura'],
  ['гравировка', 'gravyura'],
  ['Гравировка', 'Gravyura'],
  ['Ташкент', 'Toshkent'],
  ['Ташкенте', 'Toshkentda'],
  ['Ташкента', 'Toshkentdan'],
  ['Ташкенту', 'Toshkentga'],
  ['Узбекистан', 'O‘zbekiston'],
  ['Узбекистане', 'O‘zbekistonda'],
  ['Узбекистана', 'O‘zbekistondan'],
  ['подарки', 'sovg‘alar'],
  ['подарок', 'sovg‘a'],
  ['Подарок', 'Sovg‘a'],
  ['Подарки', 'Sovg‘alar'],
  ['сувениры', 'suvenirlar'],
  ['сувенир', 'suvenir'],
  ['бизнес-аксессуары', 'biznes aksessuarlari'],
  ['бизнес-аксессуаров', 'biznes aksessuarlari'],
  ['логотип', 'logotip'],
  ['логотипом', 'logotip bilan'],
  ['макет', 'maket'],
  ['макета', 'maket'],
  ['расчёт', 'hisob-kitob'],
  ['Расчёт', 'Hisob-kitob'],
  ['Получить расчёт', 'Hisob-kitob olish'],
  ['корпоративные подарки', 'korporativ sovg‘alar'],
  ['Корпоративные подарки', 'Korporativ sovg‘alar'],
  ['корпоративных подарков', 'korporativ sovg‘alar'],
  ['подарки с гравировкой', 'gravyurali sovg‘alar'],
  ['VIP-подарки', 'VIP sovg‘alar'],
  ['welcome pack', 'welcome pack'],
  ['Welcome pack', 'Welcome pack'],
  ['брендирование', 'brendlash'],
  ['Брендирование', 'Brendlash'],
  ['брендирования', 'brendlash'],
  ['ручка', 'ruchka'],
  ['ручки', 'ruchkalar'],
  ['зажигалка', 'zajigalka'],
  ['зажигалки', 'zajigalkalar'],
  ['блокнот', 'bloknot'],
  ['блокноты', 'bloknotlar'],
  ['powerbank', 'powerbank'],
  ['пауэрбанк', 'powerbank'],
  ['часы', 'soatlar'],
  ['часах', 'soatlarga'],
  ['тираж', 'tiraj'],
  ['наличии', 'mavjud'],
  ['В наличии', 'Mavjud'],
  ['под заказ', 'buyurtma asosida'],
  ['доставка', 'yetkazib berish'],
  ['доставку', 'yetkazib berishni'],
  ['нанесение', 'tushirish'],
  ['нанести', 'tushirish'],
  ['выбрать', 'tanlash'],
  ['клиент', 'mijoz'],
  ['клиенты', 'mijozlar'],
  ['клиентов', 'mijozlar'],
  ['сотрудник', 'xodim'],
  ['сотрудники', 'xodimlar'],
  ['сотрудников', 'xodimlar uchun'],
  ['партнёр', 'hamkor'],
  ['партнёры', 'hamkorlar'],
  ['партнёров', 'hamkorlar'],
  ['руководитель', 'rahbar'],
  ['руководители', 'rahbarlar'],
  ['руководителю', 'rahbarga'],
  ['компания', 'kompaniya'],
  ['компании', 'kompaniyalar'],
  ['Часто задаваемые вопросы', 'Ko‘p beriladigan savollar'],
  ['Запросить расчёт', 'Hisob-kitob so‘rash'],
  ['Подобрать', 'Tanlash'],
  ['Заказать', 'Buyurtma qilish'],
  ['Сколько стоит', 'Narxi qancha'],
  ['Цена', 'Narx'],
  ['Цены', 'Narxlar'],
]

/** Bilingual brand terms — MUST NEVER be translated */
export const BRAND_RESERVED = [
  'Graver Studio',
  'Graver.uz',
  'graver-studio.uz',
  'GraverAdm',
]

/**
 * Returns the glossary as a formatted block suitable for an LLM prompt.
 */
export function glossaryAsPrompt() {
  const items = GLOSSARY_RU_UZ.map(([ru, uz]) => `  - "${ru}" → "${uz}"`).join('\n')
  const brand = BRAND_RESERVED.map((b) => `  - "${b}"`).join('\n')
  return `Translation glossary (RU → UZ Latin) — STRICTLY use these mappings when the source contains the RU term:
${items}

Brand terms — NEVER translate, keep exactly as-is:
${brand}`
}
