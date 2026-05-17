/**
 * YAML read/write helpers using yaml package (already a transitive dep
 * via Keystatic).
 *
 * We use a sub-dependency `yaml` if available; otherwise fall back to a
 * tiny inline parser. To keep things robust we require `yaml` explicitly
 * — install with `npm i --save-dev yaml`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'node:fs'
import { dirname } from 'node:path'

let yaml
try {
  yaml = await import('yaml')
} catch {
  throw new Error('Missing dependency "yaml". Run: npm i --save-dev yaml')
}

export function readYaml(path) {
  if (!existsSync(path)) {
    throw new Error(`File not found: ${path}`)
  }
  const raw = readFileSync(path, 'utf8')
  return yaml.parse(raw)
}

export function writeYaml(path, data) {
  mkdirSync(dirname(path), { recursive: true })
  // lineWidth 0 disables auto-wrap so we keep long URLs/strings intact
  const out = yaml.stringify(data, { lineWidth: 0, defaultStringType: 'PLAIN', defaultKeyType: 'PLAIN' })
  writeFileSync(path, out, 'utf8')
}

/** Recursively copy a directory (Node 16+) */
export function copyDir(src, dst) {
  if (!existsSync(src)) return
  cpSync(src, dst, { recursive: true })
}
