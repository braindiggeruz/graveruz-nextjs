#!/usr/bin/env node
/**
 * Blog Migration Script: blogPosts.js + blogSeoOverrides.js → MDX files
 *
 * Usage: node scripts/migrate-blog.js [--source-dir /path/to/data]
 *
 * Reads the CRA blogPosts.js and blogSeoOverrides.js files and outputs
 * one .mdx file per post in content/blog/{locale}/{slug}.mdx
 */

const fs = require('fs')
const path = require('path')

// ─── Config ───────────────────────────────────────────────────────────────────
const BLOG_POSTS_FILE = process.env.BLOG_POSTS_FILE || '/tmp/blogPosts.js'
const SEO_OVERRIDES_FILE = process.env.SEO_OVERRIDES_FILE || '/tmp/blogSeoOverrides.js'
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'blog')

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts HTML content to clean Markdown.
 * Handles the most common patterns in blogPosts.js contentHtml.
 */
function htmlToMarkdown(html) {
  if (!html) return ''

  let md = html
    // Remove img tags (we reference images via frontmatter ogImage)
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, (_, alt) => `\n*${alt}*\n`)
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
    // Bold / italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gis, '\n$1\n')
    // Lists
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_, inner) => {
      const items = []
      inner.replace(/<li[^>]*>(.*?)<\/li>/gis, (__, item) => {
        items.push(`- ${item.replace(/<[^>]+>/g, '').trim()}`)
      })
      return '\n' + items.join('\n') + '\n'
    })
    .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_, inner) => {
      const items = []
      let i = 1
      inner.replace(/<li[^>]*>(.*?)<\/li>/gis, (__, item) => {
        items.push(`${i++}. ${item.replace(/<[^>]+>/g, '').trim()}`)
      })
      return '\n' + items.join('\n') + '\n'
    })
    // Tables
    .replace(/<table[^>]*>(.*?)<\/table>/gis, (_, inner) => {
      const rows = []
      let headerDone = false
      inner.replace(/<tr[^>]*>(.*?)<\/tr>/gis, (__, row) => {
        const cells = []
        row.replace(/<t[dh][^>]*>(.*?)<\/t[dh]>/gis, (__, cell) => {
          cells.push(cell.replace(/<[^>]+>/g, '').trim())
        })
        if (cells.length === 0) return
        rows.push('| ' + cells.join(' | ') + ' |')
        if (!headerDone) {
          rows.push('|' + cells.map(() => '---|').join(''))
          headerDone = true
        }
      })
      return '\n' + rows.join('\n') + '\n'
    })
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '\n> $1\n')
    // Code
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gis, '\n```\n$1\n```\n')
    // Divs and spans — just unwrap
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return md
}

/**
 * Extracts the first image src from HTML content (for ogImage fallback)
 */
function extractFirstImage(html) {
  if (!html) return null
  const match = html.match(/<img[^>]*src="([^"]+)"/)
  return match ? match[1] : null
}

/**
 * Escapes special YAML characters in a string value
 */
function yamlStr(str) {
  if (!str) return '""'
  // Use double-quoted YAML string, escape inner double quotes
  const escaped = str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `"${escaped}"`
}

/**
 * Builds YAML frontmatter for a post
 */
function buildFrontmatter(post, seoOverride, locale, alternateSlug) {
  const ogImage = post.ogImage || extractFirstImage(post.contentHtml) || `/images/blog/${post.slug}.jpg`
  const faq = seoOverride?.faq || post.faq || []
  const relatedSlugs = seoOverride?.relatedSlugs || post.relatedPosts || []

  let fm = `---\n`
  fm += `slug: ${yamlStr(post.slug)}\n`
  fm += `locale: ${yamlStr(locale)}\n`
  fm += `title: ${yamlStr(seoOverride?.title || post.title)}\n`
  fm += `description: ${yamlStr(seoOverride?.description || post.description)}\n`
  fm += `ogTitle: ${yamlStr(seoOverride?.ogTitle || post.title)}\n`
  fm += `ogDescription: ${yamlStr(seoOverride?.ogDescription || post.description)}\n`
  fm += `ogImage: ${yamlStr(ogImage)}\n`
  fm += `date: ${yamlStr(post.date || '2026-01-01')}\n`
  fm += `author: ${yamlStr(post.author || 'Graver.uz')}\n`
  fm += `category: ${yamlStr(post.category || '')}\n`

  if (alternateSlug) {
    fm += `alternateSlug:\n`
    for (const [loc, slug] of Object.entries(alternateSlug)) {
      fm += `  ${loc}: ${yamlStr(slug)}\n`
    }
  }

  if (relatedSlugs.length > 0) {
    fm += `relatedSlugs:\n`
    for (const s of relatedSlugs.slice(0, 4)) {
      fm += `  - ${yamlStr(s)}\n`
    }
  }

  if (faq.length > 0) {
    fm += `faq:\n`
    for (const item of faq) {
      fm += `  - q: ${yamlStr(item.q)}\n`
      fm += `    a: ${yamlStr(item.a)}\n`
    }
  }

  fm += `---\n`
  return fm
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('📖 Reading source files...')

  if (!fs.existsSync(BLOG_POSTS_FILE)) {
    console.error(`❌ blogPosts.js not found at ${BLOG_POSTS_FILE}`)
    process.exit(1)
  }

  const blogPostsRaw = fs.readFileSync(BLOG_POSTS_FILE, 'utf-8')
  const seoOverridesRaw = fs.existsSync(SEO_OVERRIDES_FILE)
    ? fs.readFileSync(SEO_OVERRIDES_FILE, 'utf-8')
    : ''

  // ── Parse blogPosts.js ──
  // Extract RU and UZ arrays using regex (JS is not valid JSON, so we use Node eval trick)
  // We create a temporary module that exports the data

  const tmpBlogModule = '/tmp/_blog_migration_posts.cjs'
  const tmpSeoModule = '/tmp/_blog_migration_seo.cjs'

  // Rewrite ES module syntax to CommonJS
  // Convert ES module syntax to JSON-extractable format using regex parsing
  // This avoids the need to eval/import the JS files
  let blogPosts = { ru: [], uz: [] }
  let seoOverrides = {}

  // Parse blogPosts using Python (more reliable for complex JS object extraction)
  const { execSync } = require('child_process')

  try {
    const result = execSync(`python3.11 /tmp/parse_blog.py`, { encoding: 'utf-8' })
    const parsed = JSON.parse(result)
    blogPosts = parsed
    console.log(`✅ Loaded ${blogPosts.ru?.length || 0} RU posts, ${blogPosts.uz?.length || 0} UZ posts`)
  } catch (e) {
    console.error('❌ Failed to parse blogPosts.js:', e.message)
    process.exit(1)
  }

  try {
    const result2 = execSync(`python3.11 /tmp/parse_seo.py`, { encoding: 'utf-8' })
    seoOverrides = JSON.parse(result2)
    console.log(`✅ Loaded ${Object.keys(seoOverrides).length} SEO overrides`)
  } catch (e) {
    console.warn('⚠️  Could not parse blogSeoOverrides.js:', e.message)
  }

  // ── Build slug cross-reference map ──
  // Map: ru_slug → uz_slug and uz_slug → ru_slug
  const ruSlugs = new Set((blogPosts.ru || []).map(p => p.slug))
  const uzSlugs = new Set((blogPosts.uz || []).map(p => p.slug))

  // Try to match by removing -uz suffix or by explicit alternateSlug in post data
  const slugCrossRef = {}
  for (const post of (blogPosts.uz || [])) {
    const ruEquivalent = post.slug.replace(/-uz$/, '')
    if (ruSlugs.has(ruEquivalent)) {
      slugCrossRef[post.slug] = { ru: ruEquivalent }
      slugCrossRef[ruEquivalent] = { uz: post.slug }
    }
    // Also check explicit alternateSlug if present in post data
    if (post.alternateSlug?.ru) {
      slugCrossRef[post.slug] = { ru: post.alternateSlug.ru }
      slugCrossRef[post.alternateSlug.ru] = { uz: post.slug }
    }
  }

  // ── Write MDX files ──
  let ruWritten = 0
  let uzWritten = 0

  for (const locale of ['ru', 'uz']) {
    const posts = blogPosts[locale] || []
    const outDir = path.join(OUTPUT_DIR, locale)
    fs.mkdirSync(outDir, { recursive: true })

    for (const post of posts) {
      if (!post.slug) continue

      const seoOverride = seoOverrides[post.slug] || null
      const alternateSlug = slugCrossRef[post.slug] || null
      const frontmatter = buildFrontmatter(post, seoOverride, locale, alternateSlug)
      const body = htmlToMarkdown(post.contentHtml || post.content || '')

      const mdxContent = frontmatter + '\n' + body + '\n'
      const outPath = path.join(outDir, `${post.slug}.mdx`)

      fs.writeFileSync(outPath, mdxContent, 'utf-8')
      if (locale === 'ru') ruWritten++
      else uzWritten++
    }
  }

  console.log(`\n✅ Migration complete!`)
  console.log(`   RU: ${ruWritten} files → content/blog/ru/`)
  console.log(`   UZ: ${uzWritten} files → content/blog/uz/`)
  console.log(`\n🔍 Validation: run 'find content/blog -name "*.mdx" | wc -l'`)
}

main()
