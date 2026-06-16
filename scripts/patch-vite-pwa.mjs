#!/usr/bin/env node
/**
 * vite-plugin-pwa v1.3.0 uses the deprecated `inlineDynamicImports: true`
 * option internally. Vite 8 emits a warning and recommends `codeSplitting: false`.
 *
 * This script patches the dist files where the deprecated option appears,
 * replacing it with the Vite 8-compatible equivalent.
 *
 * The patch is idempotent — it only applies the change if the old string exists
 * and skips if already patched.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const pwaDir = resolve(root, 'node_modules/vite-plugin-pwa/dist')

let patchedCount = 0

// ─── Target 1: index.cjs (main CJS entry) ─────────────────────────────────

const indexCjs = resolve(pwaDir, 'index.cjs')
if (existsSync(indexCjs)) {
  const content = readFileSync(indexCjs, 'utf-8')
  const oldPattern = 'inlineDynamicImports: true'
  const newPattern = 'codeSplitting: false'

  if (!content.includes(oldPattern)) {
    if (content.includes(newPattern)) {
      console.log(`[patch-vite-pwa] Already patched: ${indexCjs}`)
    } else {
      console.warn(`[patch-vite-pwa] Pattern '${oldPattern}' not found in ${indexCjs}`)
    }
  } else {
    const patched = content.replace(oldPattern, newPattern)
    writeFileSync(indexCjs, patched, 'utf-8')
    patchedCount++
    console.log(`[patch-vite-pwa] Patched: ${indexCjs}`)
  }
} else {
  console.warn(`[patch-vite-pwa] Skipped — file not found: ${indexCjs}`)
}

// ─── Target 2: vite-build-*.js (internal build helper, hash may change) ───

const buildFiles = readdirSync(pwaDir).filter(f => /^vite-build-[\w-]+\.js$/.test(f))

for (const file of buildFiles) {
  const filePath = resolve(pwaDir, file)
  const content = readFileSync(filePath, 'utf-8')
  const oldPattern = 'inlineDynamicImports: true'
  const newPattern = 'codeSplitting: false'

  if (!content.includes(oldPattern)) {
    if (content.includes(newPattern)) {
      console.log(`[patch-vite-pwa] Already patched: ${filePath}`)
    } else {
      // Pattern not found in this file — might not be the right file
      console.warn(`[patch-vite-pwa] Pattern not found in: ${filePath}`)
    }
    continue
  }

  const patched = content.replace(oldPattern, newPattern)
  writeFileSync(filePath, patched, 'utf-8')
  patchedCount++
  console.log(`[patch-vite-pwa] Patched: ${filePath}`)
}

if (patchedCount === 0) {
  console.log('[patch-vite-pwa] No patches needed — already up to date.')
} else {
  console.log(`[patch-vite-pwa] ${patchedCount} file(s) patched successfully.`)
}
