/**
 * Gemini translation engine for Graver Studio.
 *
 * Uses Google Generative AI REST API directly (no SDK) to keep the
 * dependency tree zero and Cloudflare-Worker-compatible.
 *
 * Reads GEMINI_API_KEY (preferred) or GOOGLE_API_KEY from env.
 * Default model: gemini-2.5-flash (fast, cheap, supports JSON mode and
 * is reliable for short multilingual translation tasks).
 */
import { glossaryAsPrompt, BRAND_RESERVED } from './glossary.mjs'

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

function getApiKey() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!key) {
    throw new Error(
      'Missing GEMINI_API_KEY (or GOOGLE_API_KEY) in env. ' +
        'Set it in .env.local locally or as a GitHub Actions secret in CI.'
    )
  }
  return key
}

const SYSTEM_PROMPT = `You are a senior bilingual translator for Graver Studio (graver-studio.uz),
a premium laser engraving studio in Tashkent, Uzbekistan.

Task: translate Russian marketing/SEO copy into Uzbek (Latin script ONLY).

STRICT RULES:
1. Output Uzbek Latin only. Never Cyrillic. Use apostrophes for tutuq belgisi: ʻ in "oʻ", "gʻ".
   You may emit ‘ as an acceptable alternative — but be consistent within one response.
2. Preserve markdown structure exactly: headings (#, ##), lists (-), bold (**), links [text](url), images.
3. Never translate URLs, slugs, product names, brand names, code blocks, or HTML attributes.
4. Brand names MUST remain unchanged: ${BRAND_RESERVED.join(', ')}.
5. Never invent prices, deadlines, warranty terms, certifications, awards, partners or statistics
   that aren't in the source. Translate only what's written.
6. Preserve the meaning and call-to-action intent — CTA buttons must remain action-driven.
7. Keep tone professional, warm, business-confident — same as the Russian source.
8. If a phrase has no good Uzbek equivalent (e.g. tech terms like "powerbank", "welcome pack"),
   keep the English/transliterated form.
9. Internal links: do NOT change href values. The post-processor will handle /ru/ → /uz/.
10. Output ONLY the translated string for each requested field. No commentary, no explanations.

${glossaryAsPrompt()}`

/**
 * Translate a flat JSON object of {key: ruText} → {key: uzText}.
 * Keys are returned unchanged; only values are translated.
 *
 * Strategy: send the entire object as JSON and ask Gemini to return JSON
 * with the same keys, translated values. Empty strings stay empty.
 */
export async function translateBatch(input, opts = {}) {
  const apiKey = getApiKey()
  const model = opts.model || DEFAULT_MODEL
  const targetLocale = opts.targetLocale || 'uz'
  if (targetLocale !== 'uz') {
    throw new Error(`Only uz target is supported (got: ${targetLocale})`)
  }

  // Filter out empty strings — no need to send them
  const entries = Object.entries(input).filter(([, v]) => typeof v === 'string' && v.trim().length > 0)
  if (entries.length === 0) return { ...input }
  const payload = Object.fromEntries(entries)

  const userPrompt = `Translate every VALUE in the JSON below from Russian to Uzbek Latin.
Keep KEYS unchanged. Return a single JSON object with the same keys and translated values.

INPUT:
${JSON.stringify(payload, null, 2)}`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const body = {
    systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  }

  let attempt = 0
  let lastErr
  while (attempt < 3) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`Gemini API ${res.status}: ${txt.slice(0, 500)}`)
      }
      const json = await res.json()
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) {
        throw new Error('Empty response from Gemini')
      }
      const parsed = JSON.parse(text)
      const result = { ...input }
      for (const [k, v] of Object.entries(parsed)) {
        result[k] = typeof v === 'string' ? v : input[k]
      }
      return result
    } catch (err) {
      lastErr = err
      attempt++
      if (attempt < 3) {
        const wait = 1500 * attempt
        await new Promise((r) => setTimeout(r, wait))
      }
    }
  }
  throw lastErr
}

/**
 * Translate a single string. Convenience wrapper.
 */
export async function translateOne(ruText, opts = {}) {
  if (!ruText || typeof ruText !== 'string' || ruText.trim().length === 0) return ruText
  const out = await translateBatch({ value: ruText }, opts)
  return out.value || ruText
}
