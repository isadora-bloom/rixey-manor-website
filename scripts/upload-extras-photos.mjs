/**
 * Upload photos for the "Only at Rixey" extras page.
 * Resizes each source image → WebP, uploads to Supabase Storage,
 * then updates the venue_extras row (matched by title).
 *
 * Run: node scripts/upload-extras-photos.mjs
 */

import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

// ── config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL      = 'https://fgbnvotlqpfaewvpnsxf.supabase.co'
const SERVICE_ROLE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYm52b3RscXBmYWV3dnBuc3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgyNTYwMiwiZXhwIjoyMDg4NDAxNjAyfQ.nEv1I2XEuxpxaOcNJ0sdjqZzB6nKmGtmvTuM8qxJSQc'
const BUCKET            = 'rixey-media'
const MAX_PX            = 2000
const QUALITY           = 82

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ── photo mapping ─────────────────────────────────────────────────────────────
// title must match exactly the `title` column in venue_extras
// slug is the storage path: extras/{slug}.webp
const PHOTOS = [
  {
    title:  'Sparkler exit',
    slug:   'sparkler-exit',
    src:    'E:/NugenMediaSparklerExit.jpg',
    alt:    'Guests line the front steps with sparklers as the couple exits Rixey Manor at night',
  },
  {
    title:  'Food trucks',
    slug:   'food-trucks',
    src:    'E:/Best of teh Best/1 s houston food truck.jpg',
    alt:    'Couple kissing in front of a gourmet food truck parked at Rixey Manor',
  },
  {
    title:  'Pets',
    slug:   'pets',
    src:    'E:/Best of teh Best/pet tree ceremony.jpg',
    alt:    'A dog lies at the end of the aisle during an outdoor ceremony under the oak tree at Rixey Manor',
  },
  {
    title:  'The copper tub at midnight',
    slug:   'copper-tub',
    src:    'E:/Best of teh Best/bathtub.jpg',
    alt:    'Bride in a unicorn hat holding champagne in the ornate copper tub in the Rixey Manor bridal suite',
  },
  {
    title:  'Come as you are',
    slug:   'come-as-you-are',
    src:    'E:/2025/Ariana & Mitchell/2O4A9965.jpg',
    alt:    'A joyful person in a wedding gown laughing at the front door of Rixey Manor',
  },
  {
    title:  'The big group photo',
    slug:   'group-photo',
    src:    'E:/Guests1 & Family.JPG',
    alt:    'Wedding party gathered on the front steps of Rixey Manor with a flower girl in the foreground',
  },
  {
    title:  'The tree swing',
    slug:   'tree-swing',
    src:    'E:/Best of teh Best/kids swing.jpg',
    alt:    'Flower girl and ring bearer on the tree swing with rolling Virginia hills behind them',
  },
  {
    title:  'The library at the end of the night',
    slug:   'library',
    src:    'E:/sitting room 1.jpg',
    alt:    'The sitting room at Rixey Manor — sofas, fireplace, chandelier, tapestry',
  },
  {
    title:  'Baraat procession',
    slug:   'baraat',
    src:    'E:/New Photos/unnamed (5).jpg',
    alt:    'Bridesmaids in richly embroidered maroon and gold dresses with orange orchid bouquets',
  },
]

// ── helpers ───────────────────────────────────────────────────────────────────
async function resizeToWebP(srcPath) {
  const buf = fs.readFileSync(srcPath)
  return sharp(buf)
    .resize({ width: MAX_PX, height: MAX_PX, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer()
}

async function uploadToStorage(webpBuf, slug) {
  const storagePath = `extras/${slug}.webp`
  const { error } = await sb.storage.from(BUCKET).upload(storagePath, webpBuf, {
    contentType: 'image/webp',
    upsert: true,
  })
  if (error) throw new Error(`Storage upload failed: ${error.message}`)
  const { data } = sb.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

async function updateExtrasRow(title, imageUrl) {
  const { error } = await sb
    .from('venue_extras')
    .update({ image_url: imageUrl })
    .eq('title', title)
  if (error) throw new Error(`DB update failed for "${title}": ${error.message}`)
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Uploading ${PHOTOS.length} extras photos...\n`)

  for (const photo of PHOTOS) {
    process.stdout.write(`  ${photo.title} ... `)
    try {
      if (!fs.existsSync(photo.src)) {
        console.log(`⚠  SKIPPED — file not found: ${photo.src}`)
        continue
      }
      const webpBuf = await resizeToWebP(photo.src)
      const url     = await uploadToStorage(webpBuf, photo.slug)
      await updateExtrasRow(photo.title, url)
      console.log(`✓  ${url}`)
    } catch (err) {
      console.log(`✗  ${err.message}`)
    }
  }

  console.log('\nDone.')
}

main()
