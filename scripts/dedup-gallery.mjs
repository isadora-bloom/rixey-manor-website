/**
 * dedup-gallery.mjs
 *
 * Finds visually duplicate (or near-duplicate) gallery images using perceptual
 * hashing (dHash). For each duplicate group, keeps the highest-quality image
 * and deactivates the rest.
 *
 * Usage:
 *   node scripts/dedup-gallery.mjs              dry run — prints duplicate groups
 *   node scripts/dedup-gallery.mjs --apply      deactivate lower-quality duplicates
 *   node scripts/dedup-gallery.mjs --threshold 6  similarity threshold (default 8, lower = stricter)
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import https from 'https'
import http from 'http'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const APPLY = process.argv.includes('--apply')

const thresholdArg = process.argv.includes('--threshold')
  ? parseInt(process.argv[process.argv.indexOf('--threshold') + 1])
  : 8  // hamming distance ≤ 8 out of 64 bits = ~87% similar

// ─── Fetch image buffer ───────────────────────────────────────────────────────

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// ─── dHash: 8x8 difference hash → 64-bit as BigInt ───────────────────────────
// Resize to 9×8 grayscale, compare each pixel to the right neighbour per row.

async function dHash(url) {
  const raw = await fetchBuffer(url)
  const pixels = await sharp(raw)
    .resize(9, 8, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer()

  let hash = 0n
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const left  = pixels[row * 9 + col]
      const right = pixels[row * 9 + col + 1]
      hash = (hash << 1n) | (left > right ? 1n : 0n)
    }
  }
  return hash
}

// ─── Hamming distance between two BigInt hashes ───────────────────────────────

function hamming(a, b) {
  let x = a ^ b
  let dist = 0
  while (x > 0n) {
    x &= x - 1n
    dist++
  }
  return dist
}

// ─── Concurrency-limited fetcher ─────────────────────────────────────────────

async function mapConcurrent(items, limit, fn) {
  const results = new Array(items.length)
  let i = 0
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx], idx)
    }
  })
  await Promise.all(workers)
  return results
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔁 Rixey Manor — Gallery Deduplication')
  console.log(`   Mode:      ${APPLY ? 'APPLY (will deactivate duplicates)' : 'DRY RUN (no changes)'}`)
  console.log(`   Threshold: hamming distance ≤ ${thresholdArg}`)
  console.log()

  // Fetch all active gallery images
  const { data: images, error } = await supabase
    .from('media')
    .select('id, url, label, quality')
    .eq('category', 'gallery')
    .eq('active', true)
    .order('quality', { ascending: false })  // highest quality first

  if (error) { console.error(error.message); process.exit(1) }
  console.log(`Fetched ${images.length} active gallery images. Computing hashes...\n`)

  // Compute dHash for each image (concurrency 8 — no rate limits here)
  let done = 0
  const hashes = await mapConcurrent(images, 8, async (img) => {
    try {
      const h = await dHash(img.url)
      process.stdout.write(`\r  ${++done}/${images.length} hashed`)
      return { ...img, hash: h, ok: true }
    } catch (err) {
      process.stdout.write(`\r  ${++done}/${images.length} hashed`)
      return { ...img, hash: null, ok: false, err: err.message }
    }
  })
  console.log('\n')

  const valid = hashes.filter(h => h.ok)
  const failed = hashes.filter(h => !h.ok)
  if (failed.length) console.log(`  ⚠ ${failed.length} images failed to hash (skipped)\n`)

  // Find duplicate groups using union-find
  const parent = new Map(valid.map(img => [img.id, img.id]))

  function find(id) {
    if (parent.get(id) !== id) parent.set(id, find(parent.get(id)))
    return parent.get(id)
  }
  function union(a, b) {
    parent.set(find(a), find(b))
  }

  // Compare all pairs — O(n²) but n≈1100 so ~600k comparisons, fast in JS
  for (let i = 0; i < valid.length; i++) {
    for (let j = i + 1; j < valid.length; j++) {
      if (hamming(valid[i].hash, valid[j].hash) <= thresholdArg) {
        union(valid[i].id, valid[j].id)
      }
    }
  }

  // Group by root
  const groups = new Map()
  for (const img of valid) {
    const root = find(img.id)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root).push(img)
  }

  // Only keep groups with 2+ images (actual duplicates)
  const dupGroups = [...groups.values()].filter(g => g.length > 1)

  if (dupGroups.length === 0) {
    console.log('✓ No duplicates found.')
    return
  }

  console.log(`Found ${dupGroups.length} duplicate groups:\n`)

  const toDeactivate = []

  for (const group of dupGroups) {
    // Sort by quality desc, then treat first as keeper
    group.sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0))
    const keeper = group[0]
    const dupes  = group.slice(1)

    console.log(`  KEEP   [q${keeper.quality ?? '?'}] ${keeper.label.slice(0, 60)}`)
    for (const d of dupes) {
      console.log(`  REMOVE [q${d.quality ?? '?'}] ${d.label.slice(0, 60)}`)
      toDeactivate.push(d)
    }
    console.log()
  }

  console.log(`─────────────────────────────────────────────────`)
  console.log(`${toDeactivate.length} duplicates to deactivate across ${dupGroups.length} groups\n`)

  if (!APPLY) {
    console.log(`Run with --apply to deactivate duplicates.`)
    return
  }

  // Deactivate duplicates in batches
  let deactivated = 0, deactFailed = 0
  for (const img of toDeactivate) {
    const { error: err } = await supabase
      .from('media')
      .update({ active: false })
      .eq('id', img.id)
    if (err) {
      console.warn(`  ⚠ Failed to deactivate ${img.label.slice(0, 40)}: ${err.message}`)
      deactFailed++
    } else {
      deactivated++
    }
  }

  console.log(`Done — ${deactivated} duplicates deactivated, ${deactFailed} failed.`)
}

main().catch(err => { console.error(err); process.exit(1) })
