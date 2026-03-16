/**
 * rescan-gallery.mjs
 *
 * Re-evaluates all uploaded gallery images using Claude Sonnet Vision.
 * Improves tags, adds curation scoring, and can deactivate weak photos.
 *
 * What it does better than the original scripts:
 *   - Uses claude-sonnet (not Haiku) — much more accurate
 *   - Asks specifically: does this photo showcase venue / emotions / couple?
 *   - Sets active=false on photos that fail all three (filler shots)
 *   - Rewrites alt_text with better descriptions
 *   - Re-scores quality, scene_type, mood, photo_style in one pass
 *
 * Usage:
 *   node scripts/rescan-gallery.mjs                   dry run — shows what would change
 *   node scripts/rescan-gallery.mjs --apply           apply all tag updates, no deactivations yet
 *   node scripts/rescan-gallery.mjs --apply --curate  apply updates AND deactivate weak photos
 *   node scripts/rescan-gallery.mjs --limit 20        test on first 20 images
 *   node scripts/rescan-gallery.mjs --only-weak       only rescan images already marked quality <= 2
 *   node scripts/rescan-gallery.mjs --reactivate      reactivate all previously deactivated images (undo)
 *
 * What gets deactivated with --curate:
 *   Photos where showcase=false (Claude judges them not gallery-worthy).
 *   These are NOT deleted — just hidden. Run --reactivate to bring them back.
 *
 * No SQL migration needed — uses existing columns only.
 * showcase → sets active=false when --curate is used
 * venue_showcase → stored in manor_visible (existing column)
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import https from 'https'

const supabase  = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const APPLY       = process.argv.includes('--apply')
const CURATE      = process.argv.includes('--curate')
const REACTIVATE  = process.argv.includes('--reactivate')
const ONLY_WEAK   = process.argv.includes('--only-weak')
const CONCURRENCY = 1  // Sonnet hits token rate limits at 2 — keep at 1

const limitArg = process.argv.includes('--limit')
  ? parseInt(process.argv[process.argv.indexOf('--limit') + 1])
  : null

// ─── Fetch image from URL ─────────────────────────────────────────────────────

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const get = url.startsWith('https') ? https : require('http')
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject)
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// ─── Vision prompt ────────────────────────────────────────────────────────────

const VISION_PROMPT = `You are curating the public gallery for Rixey Manor — a historic estate wedding venue in rural Virginia. Your job is to evaluate whether this photo belongs in a premium wedding venue gallery.

Return ONLY a valid JSON object with these exact fields, nothing else:
{
  "scene_type": "ceremony" | "reception" | "portraits" | "getting-ready" | "detail" | "venue" | "other",
  "quality": 1 | 2 | 3 | 4 | 5,
  "venue_showcase": boolean,
  "emotion_visible": boolean,
  "couple_featured": boolean,
  "showcase": boolean,
  "mood": "dark-moody" | "light-bright" | "colorful" | "neutral",
  "photo_style": "vintage" | "editorial" | "classic" | "documentary",
  "alt_text": "descriptive string under 120 characters"
}

QUALITY GUIDE — be rigorous:
5 = Hero-worthy. Sharp, well-lit, emotionally resonant or strikingly beautiful. Would make someone want to book this venue.
4 = Good. Clear, well-composed, publishable without hesitation.
3 = Acceptable. Minor issues (slightly soft, darker areas, awkward crop) but usable in a gallery.
2 = Poor. Clearly blurry, significantly underexposed, or poorly composed. Only use if nothing better exists.
1 = Unusable. Out of focus, severely dark, obscured subject, or technically failed.

SHOWCASE CRITERIA — set showcase=false if ANY of these are true:
- Photo is blurry, dark, or technically poor (quality 1 or 2)
- No clear subject — random crowd shot with no focal point, backs of heads only
- Purely logistical photo (vendor setup, empty tables being set up, chairs stacked)
- Food/catering closeups with no people or venue visible
- Unflattering moment (someone mid-sneeze, eyes closed and not in a meaningful way, awkward expression)
- Very similar to a dozen other shots in a gallery (duplicate-feeling close-up of flowers with no people)
- Does not tell any story about the venue, the couple, or the wedding experience

Set showcase=true if the photo clearly shows at least one of:
- The venue's distinctive spaces (ceremony site with carriage steps, terrace tent, ballroom, rooftop, lake view)
- Genuine human emotion (joy, tears, laughter, first look, first dance, parent moments)
- The couple looking their best

venue_showcase: true if Rixey Manor's architecture, grounds, lake, tent, or ceremony site is clearly visible and looks beautiful
emotion_visible: true if genuine human emotion is clearly visible
couple_featured: true if the couple or main wedding subjects are prominently shown

alt_text: describe what's actually happening in the photo. Include venue location if identifiable (e.g. "Couple's first dance under crystal chandeliers in the Rixey Manor ballroom"). Under 120 characters.`

// ─── Vision call ──────────────────────────────────────────────────────────────

async function visionScan(imageUrl) {
  const raw = await fetchBuffer(imageUrl)
  const thumb = await sharp(raw)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer()

  const base64 = thumb.toString('base64')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/webp', data: base64 } },
        { type: 'text', text: VISION_PROMPT },
      ],
    }],
  })

  const text = response.content[0].text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/\s*```$/, '')
  return JSON.parse(text)
}

// ─── Concurrency helper ───────────────────────────────────────────────────────

async function runConcurrent(tasks, limit) {
  let i = 0
  const workers = Array.from({ length: limit }, async () => {
    while (i < tasks.length) {
      const task = tasks[i++]
      await task()
    }
  })
  await Promise.all(workers)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍 Rixey Manor — Gallery Rescan & Curation')
  console.log(`   Model:  claude-sonnet-4-6`)
  console.log(`   Mode:   ${APPLY ? (CURATE ? 'APPLY + CURATE (will deactivate weak photos)' : 'APPLY (update tags only)') : 'DRY RUN (no changes)'}`)
  if (limitArg) console.log(`   Limit:  ${limitArg} images`)
  console.log()

  // ── Reactivate mode ──────────────────────────────────────────────────────────
  if (REACTIVATE) {
    console.log('Reactivating all previously deactivated gallery images...')
    const { error, count } = await supabase
      .from('media')
      .update({ active: true })
      .eq('category', 'gallery')
      .eq('active', false)
    if (error) { console.error(error.message); process.exit(1) }
    console.log(`Done — reactivated images (check Supabase for count).`)
    return
  }

  // ── Build query ──────────────────────────────────────────────────────────────
  let query = supabase
    .from('media')
    .select('id, url, label, quality, scene_type, active')
    .eq('category', 'gallery')
    .eq('active', true)
    .order('id')

  if (ONLY_WEAK) {
    query = query.lte('quality', 2)
  }

  if (limitArg) {
    query = query.limit(limitArg)
  }

  const { data: images, error } = await query
  if (error) { console.error(error.message); process.exit(1) }

  console.log(`Found ${images.length} images to scan\n`)

  let updated = 0, deactivated = 0, failed = 0
  const deactivateList = []

  const tasks = images.map(img => async () => {
    try {
      await new Promise(r => setTimeout(r, 5000)) // 5s between calls ~= 12/min (avoids 30k token/min limit)
      const tags = await visionScan(img.url)

      const willDeactivate = CURATE && !tags.showcase

      const line = [
        tags.showcase ? '✓' : '✗',
        `[q${tags.quality}]`,
        `[${tags.scene_type?.padEnd(13)}]`,
        `[${tags.mood?.padEnd(12)}]`,
        willDeactivate ? '→ DEACTIVATE' : '',
        img.label.slice(0, 55),
      ].filter(Boolean).join(' ')

      console.log(line)

      if (APPLY) {
        const updateData = {
          scene_type:    tags.scene_type,
          quality:       tags.quality,
          mood:          tags.mood,
          photo_style:   tags.photo_style,
          alt_text:      tags.alt_text,
          manor_visible: tags.venue_showcase,  // reuse existing column
        }

        if (CURATE && !tags.showcase) {
          updateData.active = false
          deactivated++
          deactivateList.push(img.label.slice(0, 60))
        }

        const { error: updateErr } = await supabase
          .from('media')
          .update(updateData)
          .eq('id', img.id)

        if (updateErr) throw new Error(updateErr.message)
        updated++
      }
    } catch (err) {
      failed++
      console.warn(`  ⚠ FAILED ${img.label.slice(0, 40)}: ${err.message}`)
    }
  })

  await runConcurrent(tasks, CONCURRENCY)

  console.log('\n─────────────────────────────────────────────────')
  if (APPLY) {
    console.log(`Done — ${updated} tags updated, ${deactivated} deactivated, ${failed} failed`)
    if (deactivated > 0) {
      console.log(`\nDeactivated photos (run --reactivate to undo):`)
      deactivateList.forEach(l => console.log(`  - ${l}`))
    }
  } else {
    console.log(`Dry run complete — ${images.length} scanned, ${failed} failed`)
    console.log(`\nRun with --apply to save tag updates`)
    console.log(`Run with --apply --curate to also deactivate photos marked ✗`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
