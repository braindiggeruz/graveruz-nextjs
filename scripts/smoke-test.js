#!/usr/bin/env node
/**
 * Post-deploy smoke test for graver-studio.uz
 * Run: node scripts/smoke-test.js [base_url]
 * Default base_url: https://graver-studio.uz
 */

const BASE = process.argv[2] || 'https://graver-studio.uz'
const https = require('https')
const http = require('http')

let passed = 0
let failed = 0
const failures = []

function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, { timeout: 15000 }, (res) => {
      let body = ''
      res.on('data', d => body += d)
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }))
    }).on('error', reject).on('timeout', () => reject(new Error('timeout')))
  })
}

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`)
    passed++
  } else {
    console.log(`  ✗ ${label}${detail ? ': ' + detail : ''}`)
    failed++
    failures.push(`${label}${detail ? ': ' + detail : ''}`)
  }
}

async function checkPage(url, checks) {
  console.log(`\n→ ${url}`)
  try {
    const { status, body } = await fetch(url)
    assert(`HTTP ${checks.status || 200}`, status === (checks.status || 200), `got ${status}`)

    if (checks.titleContains) {
      const m = body.match(/<title[^>]*>([^<]+)<\/title>/)
      const title = m ? m[1] : ''
      assert(`Title contains "${checks.titleContains}"`, title.includes(checks.titleContains), `got: ${title}`)
    }
    if (checks.titleNotContains) {
      const m = body.match(/<title[^>]*>([^<]+)<\/title>/)
      const title = m ? m[1] : ''
      assert(`Title NOT contains "${checks.titleNotContains}"`, !title.includes(checks.titleNotContains), `got: ${title}`)
    }
    if (checks.hreflangCount) {
      const tags = (body.match(/hrefLang="[^"]+"/g) || [])
      // Only count <link rel="alternate"> tags, not navigation links
      const linkTags = (body.match(/<link[^>]*hrefLang[^>]*>/g) || [])
      assert(`Hreflang count = ${checks.hreflangCount}`, linkTags.length === checks.hreflangCount, `got ${linkTags.length}`)
    }
    if (checks.canonicalContains) {
      const m = body.match(/rel="canonical"[^>]*href="([^"]+)"/)
      const canon = m ? m[1] : ''
      assert(`Canonical contains "${checks.canonicalContains}"`, canon.includes(checks.canonicalContains), `got: ${canon}`)
    }
    if (checks.hasSchema) {
      assert('Schema.org present', body.includes('"@type"'), 'no JSON-LD found')
    }
    if (checks.noindex) {
      assert('noindex present', body.includes('noindex'), 'robots meta missing noindex')
    }
    if (checks.bodyContains) {
      assert(`Body contains "${checks.bodyContains}"`, body.includes(checks.bodyContains), 'not found')
    }
  } catch (e) {
    assert(`Reachable`, false, e.message)
  }
}

async function main() {
  console.log(`\n=== Smoke Test: ${BASE} ===\n`)

  // Core pages
  await checkPage(`${BASE}/ru`, {
    titleContains: 'Graver.uz',
    titleNotContains: 'Graver.uz | Graver.uz',
    hreflangCount: 3,
    canonicalContains: '/ru',
    hasSchema: true,
  })

  await checkPage(`${BASE}/uz`, {
    titleContains: 'Graver.uz',
    titleNotContains: 'Graver.uz | Graver.uz',
    hreflangCount: 3,
    canonicalContains: '/uz',
    hasSchema: true,
  })

  await checkPage(`${BASE}/ru/blog`, {
    titleContains: 'Graver.uz',
    titleNotContains: 'Graver.uz | Graver.uz',
    hreflangCount: 3,
  })

  await checkPage(`${BASE}/uz/blog`, {
    titleContains: 'Graver.uz',
    hreflangCount: 3,
  })

  await checkPage(`${BASE}/ru/contacts`, {
    titleContains: 'Graver.uz',
    hreflangCount: 3,
    hasSchema: true,
  })

  await checkPage(`${BASE}/ru/engraved-gifts`, {
    titleContains: 'Graver.uz',
    hreflangCount: 3,
  })

  // Blog articles
  await checkPage(`${BASE}/ru/blog/brendirovanie-suvenirov`, {
    titleNotContains: 'Graver Studio',
    hreflangCount: 3,
    hasSchema: true,
  })

  await checkPage(`${BASE}/ru/blog/korporativnye-podarki-uzbekistan`, {
    titleNotContains: 'Graver Studio',
    titleContains: 'Graver.uz',
    hreflangCount: 3,
  })

  // Thanks page (noindex)
  await checkPage(`${BASE}/ru/thanks`, {
    titleContains: 'Graver.uz',
    titleNotContains: 'Graver.uz | Graver.uz',
    noindex: true,
  })

  // Sitemap & robots
  await checkPage(`${BASE}/sitemap.xml`, {
    bodyContains: '<urlset',
  })

  await checkPage(`${BASE}/robots.txt`, {
    bodyContains: 'Sitemap:',
  })

  // 404
  await checkPage(`${BASE}/nonexistent-page-xyz`, {
    status: 404,
  })

  // Redirects
  await checkPage(`${BASE}/blog`, {
    status: 301,
  })

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Results: ${passed} passed, ${failed} failed`)
  if (failures.length > 0) {
    console.log('\nFailed checks:')
    failures.forEach(f => console.log(`  - ${f}`))
    process.exit(1)
  } else {
    console.log('\n✅ All checks passed!')
  }
}

main().catch(e => {
  console.error('Fatal error:', e)
  process.exit(1)
})
