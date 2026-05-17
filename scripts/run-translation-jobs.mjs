#!/usr/bin/env node
/**
 * Graver Studio — Translation Jobs processor.
 *
 * Reads pending jobs from content/translation-jobs/*.yaml and runs the
 * appropriate translator. Designed to run inside a GitHub Action that
 * is triggered when a new job file is committed by Keystatic.
 *
 * A "job" is a YAML file shaped like:
 *
 *   jobId: lazernaya-gravirovka-tashkent-uz-2026-03-15
 *   sourceCollection: pages         # pages | products | stories (only pages MVP)
 *   sourceSlug: lazernaya-gravirovka-tashkent
 *   sourceLocale: ru
 *   targetLocale: uz
 *   targetSlug: ""                  # optional override
 *   overwrite: false
 *   linkSource: true                # update RU page alternateSlug.uz on success
 *   status: pending                 # pending | running | done | error
 *   notes: ""                       # free-form
 *   createdAt: 2026-03-15
 *
 * The processor:
 *   1. Picks every job with status=pending (or 'queued').
 *   2. Updates status=running, runs translation CLI.
 *   3. On success: sets status=done, writes result.targetSlug + result.report.
 *   4. On error: sets status=error, writes error.message.
 *   5. The job YAML stays in repo as audit trail.
 *
 * Idempotent: only runs jobs with status=pending or 'queued'.
 */
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { readYaml, writeYaml } from './lib/yaml-io.mjs'

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')
const JOBS_DIR = join(ROOT, 'content', 'translation-jobs')

if (!existsSync(JOBS_DIR)) {
  console.log('No translation-jobs directory — nothing to do.')
  process.exit(0)
}

const jobFiles = readdirSync(JOBS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => join(JOBS_DIR, d.name, 'index.yaml'))
  .filter((p) => existsSync(p))

if (jobFiles.length === 0) {
  console.log('No job files found in content/translation-jobs/.')
  process.exit(0)
}

console.log(`Found ${jobFiles.length} job file(s).`)

let totalPending = 0
let totalDone = 0
let totalErr = 0

function run(cmd, args, env = {}) {
  return new Promise((resolveP, rejectP) => {
    const child = spawn(cmd, args, {
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    let err = ''
    child.stdout.on('data', (d) => { out += d.toString(); process.stdout.write(d) })
    child.stderr.on('data', (d) => { err += d.toString(); process.stderr.write(d) })
    child.on('exit', (code) => code === 0 ? resolveP({ out, err }) : rejectP(new Error(err || `Exit ${code}`)))
  })
}

for (const jobPath of jobFiles) {
  const job = readYaml(jobPath)
  const status = (job.status || 'pending').toLowerCase()
  if (status !== 'pending' && status !== 'queued') {
    continue
  }
  totalPending++

  console.log(`\n━━━ Job: ${job.jobId || jobPath} ━━━`)
  console.log(`  source: ${job.sourceCollection || 'pages'}/${job.sourceSlug} (${job.sourceLocale || 'ru'})`)
  console.log(`  target: → ${job.targetLocale || 'uz'} ${job.targetSlug ? `slug=${job.targetSlug}` : '(auto-slug)'}`)

  // For MVP we support "pages" and "stories" (blog) collections.
  const collection = job.sourceCollection || 'pages'
  if (collection !== 'pages' && collection !== 'stories') {
    job.status = 'error'
    job.errorMessage = `Unsupported sourceCollection "${collection}" — supported: pages, stories.`
    writeYaml(jobPath, job)
    totalErr++
    continue
  }

  job.status = 'running'
  job.startedAt = new Date().toISOString()
  writeYaml(jobPath, job)

  const scriptName = collection === 'stories' ? 'scripts/translate-story.mjs' : 'scripts/translate-page.mjs'
  const cliArgs = [scriptName, `--source=${job.sourceSlug}`]
  if (collection === 'pages') {
    cliArgs.push(`--from=${job.sourceLocale || 'ru'}`, `--to=${job.targetLocale || 'uz'}`)
  }
  if (job.targetSlug) cliArgs.push(`--target=${job.targetSlug}`)
  if (job.overwrite) cliArgs.push('--overwrite')
  if (job.linkSource !== false) cliArgs.push('--link-source')

  try {
    const { out } = await run('node', cliArgs)
    let m = null
    if (collection === 'pages') {
      m = out.match(/content\/pages\/([^/]+)\/index\.yaml \(status: draft\)/)
    } else {
      m = out.match(/content\/blog\/uz\/([^.]+)\.mdx \(status: draft\)/)
    }
    job.status = 'done'
    job.completedAt = new Date().toISOString()
    job.resultSlug = m ? m[1] : (job.targetSlug || '')
    job.errorMessage = ''
    writeYaml(jobPath, job)
    totalDone++
    console.log(`✓ Job done → ${job.resultSlug}`)
  } catch (err) {
    job.status = 'error'
    job.completedAt = new Date().toISOString()
    job.errorMessage = String(err.message || err).slice(0, 1000)
    writeYaml(jobPath, job)
    totalErr++
    console.error(`✘ Job failed: ${err.message}`)
  }
}

console.log(`\n━━━ Summary ━━━`)
console.log(`  Pending picked up: ${totalPending}`)
console.log(`  Done:              ${totalDone}`)
console.log(`  Errors:            ${totalErr}`)
process.exit(totalErr > 0 ? 1 : 0)
