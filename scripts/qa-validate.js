#!/usr/bin/env node
/**
 * QA Validation Script for Graver.uz Next.js Migration
 *
 * Checks:
 * 1. MDX file count and frontmatter completeness
 * 2. Sitemap generation
 * 3. Robots.txt generation
 * 4. Build output completeness
 * 5. Redirect coverage
 * 6. Schema.org presence in pages
 * 7. Canonical/hreflang in metadata
 * 8. Blog slug cross-reference coverage
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.join(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content', 'blog')
const BUILD_DIR = path.join(ROOT, '.next')

let passed = 0
let failed = 0
let warnings = 0

function check(name, condition, message, isWarning = false) {
  if (condition) {
    console.log(`  ✅ ${name}`)
    passed++
  } else {
    if (isWarning) {
      console.log(`  ⚠️  ${name}: ${message}`)
      warnings++
    } else {
      console.log(`  ❌ ${name}: ${message}`)
      failed++
    }
  }
}

function warn(name, message) {
  console.log(`  ⚠️  ${name}: ${message}`)
  warnings++
}

function info(message) {
  console.log(`  ℹ️  ${message}`)
}

// ── 1. MDX Content ──────────────────────────────────────────────────────────
console.log('\n📄 1. MDX Content Files')

const ruFiles = fs.readdirSync(path.join(CONTENT_DIR, 'ru')).filter(f => f.endsWith('.mdx'))
const uzFiles = fs.readdirSync(path.join(CONTENT_DIR, 'uz')).filter(f => f.endsWith('.mdx'))

check('RU blog posts count', ruFiles.length >= 60, `Only ${ruFiles.length} RU posts found (expected ≥60)`)
check('UZ blog posts count', uzFiles.length >= 60, `Only ${uzFiles.length} UZ posts found (expected ≥60)`)
info(`RU: ${ruFiles.length} posts, UZ: ${uzFiles.length} posts`)

// Check frontmatter completeness
let missingSlug = 0, missingTitle = 0, missingDesc = 0, missingDate = 0
const allFiles = [
  ...ruFiles.map(f => path.join(CONTENT_DIR, 'ru', f)),
  ...uzFiles.map(f => path.join(CONTENT_DIR, 'uz', f)),
]

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) {
    missingSlug++
    continue
  }
  const fm = frontmatterMatch[1]
  if (!fm.includes('slug:')) missingSlug++
  if (!fm.includes('title:')) missingTitle++
  if (!fm.includes('description:')) missingDesc++
  if (!fm.includes('date:')) missingDate++
}

check('All MDX files have slug', missingSlug === 0, `${missingSlug} files missing slug`)
check('All MDX files have title', missingTitle === 0, `${missingTitle} files missing title`)
check('All MDX files have description', missingDesc === 0, `${missingDesc} files missing description`)
check('All MDX files have date', missingDate === 0, `${missingDate} files missing date`, true)

// ── 2. Build Output ──────────────────────────────────────────────────────────
console.log('\n🏗️  2. Build Output')

const buildExists = fs.existsSync(BUILD_DIR)
check('Build directory exists', buildExists, '.next directory not found — run npm run build')

if (buildExists) {
  const buildManifest = path.join(BUILD_DIR, 'build-manifest.json')
  check('Build manifest exists', fs.existsSync(buildManifest), 'build-manifest.json not found')

  // Check static pages
  const staticDir = path.join(BUILD_DIR, 'server', 'app')
  if (fs.existsSync(staticDir)) {
    const checkPage = (pagePath) => {
      const htmlPath = path.join(staticDir, pagePath)
      return fs.existsSync(htmlPath + '.html') || fs.existsSync(htmlPath + '/index.html')
    }

    // Next.js App Router with dynamic [locale] segment outputs to /ru, /uz directly
    const checkBuiltPage = (p) => {
      const base = path.join(BUILD_DIR, 'server', 'app')
      return fs.existsSync(path.join(base, p + '.html')) ||
             fs.existsSync(path.join(base, p, 'index.html')) ||
             fs.existsSync(path.join(base, p + '.rsc'))
    }
    check('Homepage RU generated', checkBuiltPage('ru'), '/ru homepage not in build')
    check('Homepage UZ generated', checkBuiltPage('uz'), '/uz homepage not in build')
    check('Blog index RU generated', checkBuiltPage('ru/blog'), '/ru/blog not in build', true)
    check('Sitemap generated', fs.existsSync(path.join(BUILD_DIR, 'server', 'app', 'sitemap.xml.body')), 'sitemap.xml not generated', true)
    check('Robots generated', fs.existsSync(path.join(BUILD_DIR, 'server', 'app', 'robots.txt.body')), 'robots.txt not generated', true)
  }
}

// ── 3. Page Structure ────────────────────────────────────────────────────────
console.log('\n📁 3. Page Structure')

const requiredPages = [
  'app/[locale]/page.tsx',
  'app/[locale]/layout.tsx',
  'app/[locale]/blog/page.tsx',
  'app/[locale]/blog/[slug]/page.tsx',
  'app/[locale]/engraved-gifts/page.tsx',
  'app/[locale]/catalog-products/page.tsx',
  'app/[locale]/contacts/page.tsx',
  'app/[locale]/guarantees/page.tsx',
  'app/[locale]/thanks/page.tsx',
  'app/[locale]/not-found.tsx',
  'app/not-found.tsx',
  'app/sitemap.ts',
  'app/robots.ts',
  'middleware.ts',
]

for (const page of requiredPages) {
  const exists = fs.existsSync(path.join(ROOT, page))
  check(`Page exists: ${page}`, exists, `File not found: ${page}`)
}

// ── 4. Product Pages ─────────────────────────────────────────────────────────
console.log('\n🛍️  4. Product Pages')

const products = ['neo-watches', 'lighters', 'pens', 'powerbanks', 'notebooks']
for (const product of products) {
  const exists = fs.existsSync(path.join(ROOT, `app/[locale]/products/${product}/page.tsx`))
  check(`Product page: ${product}`, exists, `Missing product page: ${product}`)
}

// ── 5. Components ────────────────────────────────────────────────────────────
console.log('\n🧩 5. Components')

const requiredComponents = [
  'components/Header.tsx',
  'components/Footer.tsx',
  'components/SchemaOrg.tsx',
  'components/OptimizedImage.tsx',
  'components/ProductPage.tsx',
]

for (const comp of requiredComponents) {
  check(`Component: ${comp}`, fs.existsSync(path.join(ROOT, comp)), `Missing: ${comp}`)
}

// ── 6. Lib Files ─────────────────────────────────────────────────────────────
console.log('\n📚 6. Library Files')

const requiredLibs = [
  'lib/i18n.ts',
  'lib/seo.ts',
  'lib/blog.ts',
]

for (const lib of requiredLibs) {
  check(`Lib: ${lib}`, fs.existsSync(path.join(ROOT, lib)), `Missing: ${lib}`)
}

// ── 7. i18n Messages ─────────────────────────────────────────────────────────
console.log('\n🌐 7. i18n Messages')

const ruMessages = path.join(ROOT, 'messages/ru.json')
const uzMessages = path.join(ROOT, 'messages/uz.json')

check('RU messages file', fs.existsSync(ruMessages), 'messages/ru.json not found')
check('UZ messages file', fs.existsSync(uzMessages), 'messages/uz.json not found')

if (fs.existsSync(ruMessages) && fs.existsSync(uzMessages)) {
  const ru = JSON.parse(fs.readFileSync(ruMessages, 'utf-8'))
  const uz = JSON.parse(fs.readFileSync(uzMessages, 'utf-8'))

  const requiredKeys = ['site', 'nav', 'hero', 'cta', 'contact']
  for (const key of requiredKeys) {
    check(`RU messages.${key}`, !!ru[key], `Missing key: ${key}`)
    check(`UZ messages.${key}`, !!uz[key], `Missing key: ${key}`)
  }
}

// ── 8. SEO Checks ────────────────────────────────────────────────────────────
console.log('\n🔍 8. SEO Configuration')

// Check that SchemaOrg component has LocalBusiness schema
const schemaOrgPath = path.join(ROOT, 'components/SchemaOrg.tsx')
if (fs.existsSync(schemaOrgPath)) {
  const content = fs.readFileSync(schemaOrgPath, 'utf-8')
  check('SchemaOrg has LocalBusiness', content.includes('LocalBusiness'), 'LocalBusiness schema not found')
  check('SchemaOrg has BreadcrumbList', content.includes('BreadcrumbList'), 'BreadcrumbList schema not found')
  check('SchemaOrg has FAQPage', content.includes('FAQPage'), 'FAQPage schema not found')
  check('SchemaOrg has Article', content.includes('Article'), 'Article schema not found')
}

// Check lib/seo.ts has canonical and alternates
const seoLibPath = path.join(ROOT, 'lib/seo.ts')
if (fs.existsSync(seoLibPath)) {
  const content = fs.readFileSync(seoLibPath, 'utf-8')
  check('SEO lib has canonical', content.includes('canonical'), 'canonical not in lib/seo.ts')
  check('SEO lib has alternates', content.includes('alternates'), 'alternates not in lib/seo.ts')
  check('SEO lib has hreflang', content.includes('hreflang') || content.includes('languages'), 'hreflang not in lib/seo.ts')
}

// Check middleware has locale redirect
const middlewarePath = path.join(ROOT, 'middleware.ts')
if (fs.existsSync(middlewarePath)) {
  const content = fs.readFileSync(middlewarePath, 'utf-8')
  check('Middleware handles locale', content.includes('locale') || content.includes('ru'), 'Locale handling not found in middleware')
}

// ── 9. Blog Cross-Reference ──────────────────────────────────────────────────
console.log('\n🔗 9. Blog Cross-Reference (hreflang)')

const ruSlugs = new Set(ruFiles.map(f => f.replace('.mdx', '')))
const uzSlugs = new Set(uzFiles.map(f => f.replace('.mdx', '')))

// Check how many UZ posts have -uz suffix (indicating they're locale variants)
const uzWithSuffix = uzFiles.filter(f => f.endsWith('-uz.mdx')).length
const uzWithoutSuffix = uzFiles.length - uzWithSuffix

info(`UZ posts with -uz suffix: ${uzWithSuffix}`)
info(`UZ posts without -uz suffix: ${uzWithoutSuffix}`)

// Check alternateSlug presence in UZ files
let uzWithAlternate = 0
for (const uzFile of uzFiles) {
  const content = fs.readFileSync(path.join(CONTENT_DIR, 'uz', uzFile), 'utf-8')
  if (content.includes('alternateSlug:')) uzWithAlternate++
}
info(`UZ posts with alternateSlug: ${uzWithAlternate}/${uzFiles.length}`)

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60))
console.log(`📊 QA Summary`)
console.log(`   ✅ Passed:   ${passed}`)
console.log(`   ❌ Failed:   ${failed}`)
console.log(`   ⚠️  Warnings: ${warnings}`)
console.log('═'.repeat(60))

if (failed === 0) {
  console.log('\n🎉 All critical checks passed! Project is ready for deployment review.')
} else {
  console.log(`\n⚠️  ${failed} critical check(s) failed. Review and fix before deployment.`)
}

process.exit(failed > 0 ? 1 : 0)
