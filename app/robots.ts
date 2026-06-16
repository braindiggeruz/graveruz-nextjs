import type { MetadataRoute } from 'next'

const BASE_URL = 'https://graver-studio.uz'

/**
 * Disallow paths shared by every user-agent block.
 * Keep in one place so a wildcard-only rule and per-AI-bot rules stay in sync.
 */
const SHARED_DISALLOW = [
  '/ru/thanks/',
  '/uz/thanks/',
  '/ru/thanks',
  '/uz/thanks',
  '/keystatic',
  '/keystatic/',
  '/admin-tools',
  '/admin-tools/',
  '/_next/',
  '/api/',
]

/**
 * Explicit allow-list for major LLM / AI-assistant crawlers (2025–2026).
 * Two reasons we list them out instead of relying on `*`:
 *   1. Several of these bots (GPTBot, ClaudeBot, Google-Extended, AppleBot-Extended,
 *      MistralAI-User, …) treat the absence of an explicit rule as an opt-out
 *      signal. Naming each bot gives an unambiguous opt-in.
 *   2. Per-bot rules let us tune access later (e.g. block training-only bots
 *      while keeping answer/search bots).
 *
 * Sources:
 *   - OpenAI:        https://platform.openai.com/docs/bots
 *   - Anthropic:     https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web
 *   - Perplexity:    https://docs.perplexity.ai/guides/bots
 *   - Google AI:     https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers#google-extended
 *   - Apple Intel.:  https://support.apple.com/en-us/119829
 *   - Mistral:       https://docs.mistral.ai/guides/observability/
 */
const AI_USER_AGENTS = [
  // OpenAI — training crawler, answer-engine crawler, user-fetch
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic — Claude crawler + legacy aliases
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  // Perplexity — index crawler + per-question fetch
  'PerplexityBot',
  'Perplexity-User',
  // Google Gemini / AI Overviews opt-in (separate from Googlebot SEO crawl)
  'Google-Extended',
  // Apple Intelligence (separate from Applebot)
  'Applebot-Extended',
  // Mistral, Cohere, DuckDuckGo Assist, You.com, ByteDance / Doubao, Common Crawl,
  // Diffbot (LLM data partner), Meta AI
  'MistralAI-User',
  'cohere-ai',
  'DuckAssistBot',
  'YouBot',
  'Bytespider',
  'CCBot',
  'Diffbot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for everyone (Googlebot, Bingbot, Yandex, etc.)
      {
        userAgent: '*',
        allow: '/',
        disallow: SHARED_DISALLOW,
      },
      // Explicit allow for every named AI/LLM crawler.
      // Same disallow list — we never want them touching /keystatic, /api, etc.
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: SHARED_DISALLOW,
      })),
    ],
    sitemap: [`${BASE_URL}/sitemap.xml`, `${BASE_URL}/image-sitemap.xml`],
    host: BASE_URL,
  }
}
