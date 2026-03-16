/**
 * upload-images.mjs
 *
 * Resizes images to web dimensions, converts to WebP, uploads to Supabase Storage,
 * and inserts rows into the media table.
 *
 * Usage:
 *   node scripts/upload-images.mjs --folder "E:/Hero Images/Heros in 2025" --category hero
 *   node scripts/upload-images.mjs --folder "E:/some/gallery/folder" --category gallery
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (service role needed for storage uploads)
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { readdir, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, 'output')

// --- Config ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const STORAGE_BUCKET = 'rixey-media'
const MAX_WIDTH = 2000
const WEBP_QUALITY = 82

// --- Parse args ---
const args = process.argv.slice(2)
const folderIdx = args.indexOf('--folder')
const categoryIdx = args.indexOf('--category')

if (folderIdx === -1 || categoryIdx === -1) {
  console.error('Usage: node scripts/upload-images.mjs --folder "/path/to/images" --category hero')
  process.exit(1)
}

const SOURCE_FOLDER = args[folderIdx + 1]
const CATEGORY = args[categoryIdx + 1]

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'])

async function processImage(filePath, outputDir) {
  const ext = path.extname(filePath)
  const baseName = path.basename(filePath, ext)
  const safeName = baseName.replace(/[^a-z0-9_\-]/gi, '-').toLowerCase()
  const outFileName = `${safeName}.webp`
  const outPath = path.join(outputDir, outFileName)

  const meta = await sharp(filePath).metadata()
  const resizeWidth = meta.width > MAX_WIDTH ? MAX_WIDTH : undefined

  await sharp(filePath)
    .resize(resizeWidth ? { width: resizeWidth } : undefined)
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath)

  const stats = await import('fs').then(fs => fs.promises.stat(outPath))
  return { outPath, outFileName, safeName, originalSize: meta.width, fileSize: stats.size }
}

async function uploadToSupabase(outPath, outFileName, category) {
  const storagePath = `${category}/${outFileName}`
  const fileBuffer = await readFile(outPath)

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: 'image/webp',
      upsert: true,
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath)

  return publicUrl
}

async function insertMediaRow(url, label, category, sortOrder) {
  const { error } = await supabase.from('media').insert({
    url,
    label,
    category,
    alt_text: label,
    sort_order: sortOrder,
    active: true,
  })

  if (error) throw new Error(`DB insert failed: ${error.message}`)
}

async function run() {
  if (!existsSync(SOURCE_FOLDER)) {
    console.error(`Source folder not found: ${SOURCE_FOLDER}`)
    process.exit(1)
  }

  await mkdir(OUTPUT_DIR, { recursive: true })

  const files = (await readdir(SOURCE_FOLDER))
    .filter(f => IMAGE_EXTS.has(path.extname(f)))

  console.log(`\nFound ${files.length} images in ${SOURCE_FOLDER}`)
  console.log(`Category: ${CATEGORY} | Output: ${OUTPUT_DIR}\n`)

  let succeeded = 0
  let failed = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(SOURCE_FOLDER, file)
    const label = path.basename(file, path.extname(file))

    process.stdout.write(`[${i + 1}/${files.length}] ${file} ... `)

    try {
      const { outPath, outFileName, fileSize } = await processImage(filePath, OUTPUT_DIR)
      const sizekb = Math.round(fileSize / 1024)
      process.stdout.write(`resized (${sizekb}KB) ... `)

      const publicUrl = await uploadToSupabase(outPath, outFileName, CATEGORY)
      process.stdout.write(`uploaded ... `)

      await insertMediaRow(publicUrl, label, CATEGORY, i + 1)
      console.log(`done`)
      succeeded++
    } catch (err) {
      console.log(`FAILED — ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. ${succeeded} uploaded, ${failed} failed.`)
}

run()
