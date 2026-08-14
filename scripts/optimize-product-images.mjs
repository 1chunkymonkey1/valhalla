#!/usr/bin/env node
/**
 * Generate matrix thumbs (~480px) and detail md (~1280px) JPEGs from full product stills.
 * Requires macOS `sips` (or set VH_IMAGE_TOOL=magick if ImageMagick is installed).
 *
 * Usage:
 *   node scripts/optimize-product-images.mjs
 *   node scripts/optimize-product-images.mjs --force
 */

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const productsRoot = path.join(root, 'public/images/products')
const force = process.argv.includes('--force')
const tool = process.env.VH_IMAGE_TOOL || 'sips'

let made = 0
let skipped = 0
let failed = 0

function resize(src, out, maxEdge, quality) {
  fs.mkdirSync(path.dirname(out), { recursive: true })
  if (tool === 'magick') {
    const r = spawnSync(
      'magick',
      [src, '-resize', `${maxEdge}x${maxEdge}>`, '-quality', String(quality), out],
      { encoding: 'utf8' },
    )
    return r.status === 0
  }
  const r = spawnSync(
    'sips',
    ['-Z', String(maxEdge), '-s', 'format', 'jpeg', '-s', 'formatOptions', String(quality), src, '--out', out],
    { encoding: 'utf8' },
  )
  return r.status === 0
}

for (const hall of fs.readdirSync(productsRoot)) {
  const hallDir = path.join(productsRoot, hall)
  if (!fs.statSync(hallDir).isDirectory() || hall.startsWith('_')) continue
  for (const file of fs.readdirSync(hallDir)) {
    if (!file.endsWith('.jpg')) continue
    const src = path.join(hallDir, file)
    if (!fs.statSync(src).isFile()) continue
    const thumbOut = path.join(hallDir, 'thumbs', file)
    const mdOut = path.join(hallDir, 'md', file)
    const needThumb =
      force || !fs.existsSync(thumbOut) || fs.statSync(thumbOut).mtimeMs < fs.statSync(src).mtimeMs
    const needMd =
      force || !fs.existsSync(mdOut) || fs.statSync(mdOut).mtimeMs < fs.statSync(src).mtimeMs
    if (!needThumb && !needMd) {
      skipped += 1
      continue
    }
    let ok = true
    if (needThumb) ok = resize(src, thumbOut, 480, 72) && ok
    if (needMd) ok = resize(src, mdOut, 1280, 78) && ok
    if (!ok) {
      failed += 1
      console.error('failed', src)
      continue
    }
    made += 1
  }
}

console.log(JSON.stringify({ made, skipped, failed, tool }, null, 2))
if (failed) process.exitCode = 1
