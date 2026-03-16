/**
 * tag-and-upload-weddings.mjs
 *
 * Walks E:\2024, resizes every wedding photo to web size, sends a thumbnail
 * to Claude Vision for tagging (same_sex, cultural_style, scene_type, quality, etc.),
 * uploads the full-size WebP to Supabase Storage, and inserts a media row.
 *
 * Prerequisites:
 *   1. Run migrate-media-columns.sql in Supabase SQL editor
 *   2. Add ANTHROPIC_API_KEY to .env.local
 *   3. npm install @anthropic-ai/sdk (already done)
 *
 * Usage:
 *   node scripts/tag-and-upload-weddings.mjs
 *   node scripts/tag-and-upload-weddings.mjs --dry-run   (parse only, no uploads)
 *   node scripts/tag-and-upload-weddings.mjs --month august  (one month only)
 *   node scripts/tag-and-upload-weddings.mjs --skip-vision   (upload without AI tagging)
 */

import { config } from 'dotenv'
import { resolve, join, basename, extname, relative } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { readdir, stat } from 'fs/promises'

// ─── Config ───────────────────────────────────────────────────────────────────

const SOURCE_DIR    = 'E:/2024'
const STORAGE_BUCKET = 'rixey-media'
const MAX_WIDTH     = 2000
const WEBP_QUALITY  = 82
const THUMB_WIDTH   = 500   // for Vision API (smaller = cheaper + faster)
const CONCURRENCY   = 2     // keep under 50 Vision API calls/minute
const IMAGE_EXTS    = new Set(['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'])

const DRY_RUN     = process.argv.includes('--dry-run')
const SKIP_VISION = process.argv.includes('--skip-vision')
const monthArg    = process.argv.includes('--month')
  ? process.argv[process.argv.indexOf('--month') + 1]?.toLowerCase()
  : null

const supabase  = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Month mapping ────────────────────────────────────────────────────────────

const MONTH_META = {
  jan:       { month: 'january',   season: 'winter' },
  feb:       { month: 'february',  season: 'winter' },
  march:     { month: 'march',     season: 'spring' },
  april:     { month: 'april',     season: 'spring' },
  may:       { month: 'may',       season: 'spring' },
  june:      { month: 'june',      season: 'summer' },
  july:      { month: 'july',      season: 'summer' },
  august:    { month: 'august',    season: 'summer' },
  september: { month: 'september', season: 'autumn' },
  october:   { month: 'october',   season: 'autumn' },
  november:  { month: 'november',  season: 'autumn' },
  december:  { month: 'december',  season: 'winter' },
  dec:       { month: 'december',  season: 'winter' },
}

const MONTH_DIRS = new Set(Object.keys(MONTH_META))

// ─── Folder name parser ───────────────────────────────────────────────────────

function parseWeddingFolder(monthKey, folderName) {
  const lower = folderName.toLowerCase()
  const parts = folderName.split(' - ')

  // Year: look for 4-digit year in folder name
  const yearMatch = folderName.match(/\b(20\d{2})\b/)
  const year = yearMatch ? parseInt(yearMatch[1]) : null

  // Photographer: second dash-separated segment if it looks like a name/studio
  const photographer = parts.length >= 2 ? parts[1]?.trim() : null

  // Couple names: third segment if it contains " and " and is short
  let coupleNames = null
  if (parts.length >= 3) {
    const candidate = parts[2]?.trim()
    if (/\band\b/i.test(candidate) && candidate.split(/\s+/).length <= 6) {
      coupleNames = candidate
    }
  }

  // Cultural style from vendor/keyword hints in folder name
  let culturalStyleHint = 'western'
  if (/mandap|hindi|hindu|sari|saree|mehendi|mehndi|indorama|indian/i.test(lower)) {
    culturalStyleHint = 'indian'
  } else if (/hanbok|korean/i.test(lower)) {
    culturalStyleHint = 'korean'
  } else if (/rabbi|huppah|chuppah|jewish/i.test(lower)) {
    culturalStyleHint = 'jewish'
  } else if (/mariachi|latino|hispanic/i.test(lower)) {
    culturalStyleHint = 'latino'
  }

  // Rough same-sex hint from two matching-gender first names
  const femalePattern = /\b(cassie|maria|jamie|lauren|caroline|caitlin|emily|sarah|melissa|hannah|chloe|kate|maddie|katie|rosie|kelsey|mady|erica|lily|ashley|alexis|diana|samantha|nickie|megan|priscilla|janice|kanchan|apeksha|anna|ally|chelsea|alyssa|michaela|kate|emi|jessica|abby|amanda)\b/i
  let potentialSameSex = false
  if (coupleNames) {
    const halves = coupleNames.split(/\s+and\s+/i)
    if (halves.length === 2 && femalePattern.test(halves[0]) && femalePattern.test(halves[1])) {
      potentialSameSex = true
    }
  }

  return {
    month: MONTH_META[monthKey]?.month || monthKey,
    season: MONTH_META[monthKey]?.season || 'summer',
    year,
    photographer,
    coupleNames,
    culturalStyleHint,
    potentialSameSex,
  }
}

// ─── Recursive image finder ───────────────────────────────────────────────────

async function findImages(dir) {
  const results = []
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) }
  catch { return results }

  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...await findImages(full))
    } else if (IMAGE_EXTS.has(extname(entry.name))) {
      results.push(full)
    }
  }
  return results
}

// ─── Vision tagging ───────────────────────────────────────────────────────────

async function visionTag(thumbBuffer, culturalHint, sameHint) {
  const base64 = thumbBuffer.toString('base64')

  const prompt = `You are analyzing a wedding photo from Rixey Manor, a wedding venue in rural Virginia.
The folder name hints: cultural_style may be "${culturalHint}", same_sex may be ${sameHint}.
Use the image to confirm or correct these hints.

Return ONLY a valid JSON object with these exact fields — no markdown, no extra text:
{
  "same_sex": boolean,
  "cultural_style": "western" | "indian" | "korean" | "jewish" | "latino" | "other",
  "scene_type": "ceremony" | "reception" | "portraits" | "getting-ready" | "detail" | "venue" | "other",
  "manor_visible": boolean,
  "quality": 1 | 2 | 3 | 4 | 5,
  "alt_text": "string under 120 chars"
}

Quality guide: 1=blurry/unusable, 2=poor, 3=acceptable, 4=good, 5=excellent.
manor_visible: true only if the white manor building is clearly in the frame.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [{
          type: 'image',
          source: { type: 'base64', media_type: 'image/webp', data: base64 },
        }, {
          type: 'text',
          text: prompt,
        }],
      }],
    })

    const text = response.content[0].text.trim()
    // Strip any accidental markdown fences
    const clean = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '')
    return JSON.parse(clean)
  } catch (err) {
    console.warn(`  ⚠ Vision failed: ${err.message}`)
    return {
      same_sex: sameHint,
      cultural_style: culturalHint,
      scene_type: 'other',
      manor_visible: false,
      quality: 3,
      alt_text: 'Wedding photo from Rixey Manor.',
    }
  }
}

// ─── Process single image ─────────────────────────────────────────────────────

async function processImage(imagePath, folderMeta, existingLabels) {
  const ext     = extname(imagePath)
  const stem    = basename(imagePath, ext)
  const safeStem = stem.replace(/[^a-z0-9_\-]/gi, '-').toLowerCase().slice(0, 60)

  // Build a deterministic label from wedding context + filename
  const monthSlug = (folderMeta.month || 'unknown').slice(0, 3)
  const yearSlug  = folderMeta.year ? String(folderMeta.year).slice(2) : 'xx'
  const coupleSlug = folderMeta.coupleNames
    ? folderMeta.coupleNames.replace(/[^a-z]/gi, '-').toLowerCase().slice(0, 20)
    : 'unknown'
  const label = `${yearSlug}-${monthSlug}-${coupleSlug}-${safeStem}`.slice(0, 100)

  if (existingLabels.has(label)) {
    return { status: 'skipped', label }
  }

  if (DRY_RUN) {
    console.log(`  DRY  ${label}`)
    return { status: 'dry', label }
  }

  try {
    // Resize to web size
    const webBuffer = await sharp(imagePath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer()

    // Resize to thumbnail for Vision
    let tags = null
    if (!SKIP_VISION) {
      const thumbBuffer = await sharp(imagePath)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer()
      tags = await visionTag(thumbBuffer, folderMeta.culturalStyleHint, folderMeta.potentialSameSex)
    } else {
      tags = {
        same_sex: folderMeta.potentialSameSex,
        cultural_style: folderMeta.culturalStyleHint,
        scene_type: 'other',
        manor_visible: false,
        quality: 3,
        alt_text: `Wedding photo from Rixey Manor${folderMeta.coupleNames ? ` — ${folderMeta.coupleNames}` : ''}.`,
      }
    }

    // Upload to Supabase Storage
    const storagePath = `weddings/${label}.webp`
    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, webBuffer, { contentType: 'image/webp', upsert: false })

    if (uploadErr) {
      if (uploadErr.message?.includes('already exists')) return { status: 'skipped', label }
      throw new Error(`Upload failed: ${uploadErr.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    // Insert media row
    const { error: insertErr } = await supabase.from('media').insert({
      url:            publicUrl,
      label,
      category:       'gallery',
      active:         true,
      season:         folderMeta.season,
      is_couple:      tags.scene_type === 'portraits' || tags.scene_type === 'ceremony',
      alt_text:       tags.alt_text,
      same_sex:       tags.same_sex,
      cultural_style: tags.cultural_style,
      scene_type:     tags.scene_type,
      manor_visible:  tags.manor_visible,
      quality:        tags.quality,
      couple_names:   folderMeta.coupleNames,
      photographer:   folderMeta.photographer,
      wedding_month:  folderMeta.month,
      wedding_year:   folderMeta.year,
    })

    if (insertErr) throw new Error(`Insert failed: ${insertErr.message}`)

    return { status: 'ok', label, quality: tags.quality, scene: tags.scene_type }
  } catch (err) {
    return { status: 'error', label, error: err.message }
  }
}

// ─── Concurrency helper ───────────────────────────────────────────────────────

async function runConcurrent(tasks, limit) {
  const results = []
  let i = 0
  const workers = Array.from({ length: limit }, async () => {
    while (i < tasks.length) {
      const task = tasks[i++]
      results.push(await task())
    }
  })
  await Promise.all(workers)
  return results
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n📸 Rixey Manor — Wedding Photo Tagger & Uploader`)
  console.log(`   Source: ${SOURCE_DIR}`)
  console.log(`   Mode:   ${DRY_RUN ? 'DRY RUN' : SKIP_VISION ? 'upload only (no vision)' : 'full (vision + upload)'}`)
  if (monthArg) console.log(`   Filter: month = ${monthArg}`)
  console.log()

  // Fetch all existing labels from Supabase for deduplication
  console.log('Fetching existing media labels...')
  const { data: existing } = await supabase.from('media').select('label')
  const existingLabels = new Set((existing || []).map(r => r.label))
  console.log(`  ${existingLabels.size} images already in database\n`)

  // Walk the source directory
  const topEntries = await readdir(SOURCE_DIR, { withFileTypes: true })
  const allTasks = []

  for (const entry of topEntries) {
    if (!entry.isDirectory()) continue
    const dirName  = entry.name
    const dirLower = dirName.toLowerCase()

    // ── Rixey Glamor Shots (venue photos, no wedding context) ──
    if (dirName === 'Rixey Glamor Shots') {
      const images = await findImages(join(SOURCE_DIR, dirName))
      console.log(`📁 Rixey Glamor Shots — ${images.length} images`)
      for (const img of images) {
        const folderMeta = { month: null, season: null, year: null, photographer: null, coupleNames: null, culturalStyleHint: 'western', potentialSameSex: false }
        allTasks.push(() => processImage(img, folderMeta, existingLabels))
      }
      continue
    }

    // ── Month folders ──
    const monthKey = Object.keys(MONTH_META).find(k => dirLower === k || dirLower.startsWith(k))
    if (!monthKey) continue
    if (monthArg && !dirLower.includes(monthArg)) continue

    const monthDir  = join(SOURCE_DIR, dirName)
    const monthEntries = await readdir(monthDir, { withFileTypes: true })

    let monthImageCount = 0

    for (const sub of monthEntries) {
      const subPath = join(monthDir, sub.name)

      if (sub.isDirectory()) {
        // Wedding subfolder
        const folderMeta = parseWeddingFolder(monthKey, sub.name)
        const images = await findImages(subPath)
        monthImageCount += images.length
        for (const img of images) {
          allTasks.push(() => processImage(img, folderMeta, existingLabels))
        }
      } else if (IMAGE_EXTS.has(extname(sub.name))) {
        // Loose image directly in month folder
        const folderMeta = { ...MONTH_META[monthKey], year: null, photographer: null, coupleNames: null, culturalStyleHint: 'western', potentialSameSex: false }
        monthImageCount++
        allTasks.push(() => processImage(subPath, folderMeta, existingLabels))
      }
    }

    console.log(`📅 ${dirName.padEnd(12)} — ${monthImageCount} images`)
  }

  console.log(`\nTotal tasks: ${allTasks.length} images to process (${existingLabels.size} already done)\n`)

  if (allTasks.length === 0) {
    console.log('Nothing to do.')
    return
  }

  // Run with concurrency
  let done = 0, skipped = 0, errors = 0
  const startTime = Date.now()

  const results = await runConcurrent(allTasks, CONCURRENCY)

  for (const r of results) {
    if (r.status === 'ok') {
      done++
      console.log(`✓ [q${r.quality}] [${r.scene?.padEnd(12)}] ${r.label}`)
    } else if (r.status === 'skipped' || r.status === 'dry') {
      skipped++
    } else if (r.status === 'error') {
      errors++
      console.error(`✗ ${r.label}: ${r.error}`)
    }
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000)
  console.log(`\n─────────────────────────────────────────────`)
  console.log(`Done in ${elapsed}s — ${done} uploaded, ${skipped} skipped, ${errors} errors`)
}

main().catch(err => { console.error(err); process.exit(1) })
