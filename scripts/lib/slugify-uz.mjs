/**
 * UZ slug generator with manual RU→Latin curated terms.
 *
 * We do NOT use generic transliteration — for Cyrillic Russian we would
 * get garbage like "lazernaya-gravirovka-tashkent" again (which is already
 * the RU slug). Instead the slug is generated from the *translated UZ H1*
 * (Uzbek Latin), which is normalized + slugified here.
 */

const REPLACE_MAP = {
  'ʻ': '',
  '‘': '',
  '’': '',
  '`': '',
  'ʼ': '',
  // common letters that survive but with diacritics
  'ş': 's', 'ç': 'ch', 'ğ': 'g', 'ö': 'o', 'ü': 'u', 'ı': 'i',
}

export function slugifyUz(input) {
  if (!input) return ''
  let s = String(input).trim().toLowerCase()
  // remove diacritics
  s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  // remove uzbek-latin apostrophes-as-letters (o‘ -> o, g‘ -> g)
  for (const [from, to] of Object.entries(REPLACE_MAP)) {
    s = s.split(from).join(to)
  }
  // anything not [a-z0-9] → dash
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  // collapse double dashes
  s = s.replace(/-{2,}/g, '-')
  // soft length cap (slug shouldn't exceed 80 chars)
  if (s.length > 80) {
    s = s.slice(0, 80).replace(/-[^-]*$/, '')
  }
  return s
}
