/**
 * retag-mood-style.mjs
 *
 * Second-pass Vision tagging — adds mood and photo_style to all gallery images.
 *
 * Prerequisites:
 *   Run this SQL in Supabase first:
 *     ALTER TABLE media ADD COLUMN IF NOT EXISTS mood text;
 *     ALTER TABLE media ADD COLUMN IF NOT EXISTS photo_style text;
 *
 * Usage:
 *   node scripts/retag-mood-style.mjs
 *   node scripts/retag-mood-style.mjs --limit 50   (test on first 50)
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { readFile } from 'fs/promises'
import https from 'https'

const supabase  = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CONCURRENCY = 2
const limitArg = process.argv.includes('--limit')
  ? parseInt(process.argv[process.argv.indexOf('--limit') + 1])
  : null

// ─── Fetch image as buffer from URL ──────────────────────────────────────────

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// ─── Vision call ──────────────────────────────────────────────────────────────

async function tagMoodStyle(imageUrl) {
  // Download and shrink to 400px for cheap/fast API call
  const raw = await fetchBuffer(imageUrl)
  const thumb = await sharp(raw)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 60 })
    .toBuffer()

  const base64 = thumb.toString('base64')

  const prompt = `Analyze this wedding photo and return ONLY a JSON object with two fields:
{
  "mood": "dark-moody" | "light-bright" | "colorful" | "neutral",
  "photo_style": "vintage" | "editorial" | "classic" | "documentary"
}

Definitions:
- mood "dark-moody": deep shadows, muted tones, dramatic, moody atmosphere
- mood "light-bright": airy, pale backgrounds, soft light, washed whites
- mood "colorful": vivid saturated colours, bold florals or attire, high energy
- mood "neutral": balanced, natural tones — doesn't strongly fit the others

- style "vintage": film grain, faded tones, retro aesthetic
- style "editorial": posed, fashion-forward, stylised compositions
- style "classic": traditional wedding photography, timeless, polished
- style "documentary": candid, photojournalistic, unposed moments

Return only the JSON, no other text.`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 80,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/webp', data: base64 } },
        { type: 'text', text: prompt },
      ],
    }],
  })

  const text = response.content[0].text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '')
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
  console.log('\n🎨 Rixey Manor — Mood & Style Tagger\n')

  // Fetch all gallery images that don't have mood set yet
  let query = supabase
    .from('media')
    .select('id, url, label')
    .eq('category', 'gallery')
    .eq('active', true)
    .is('mood', null)
    .order('id')

  if (limitArg) query = query.limit(limitArg)

  const { data: images, error } = await query
  if (error) { console.error(error.message); process.exit(1) }

  console.log(`Found ${images.length} images without mood/style tags\n`)

  let done = 0, failed = 0

  const tasks = images.map(img => async () => {
    try {
      const tags = await tagMoodStyle(img.url)

      await supabase.from('media').update({
        mood:        tags.mood,
        photo_style: tags.photo_style,
      }).eq('id', img.id)

      done++
      console.log(`✓ [${tags.mood?.padEnd(12)}] [${tags.photo_style}] ${img.label.slice(0, 60)}`)
    } catch (err) {
      failed++
      console.warn(`✗ ${img.label.slice(0, 50)}: ${err.message}`)
    }
  })

  await runConcurrent(tasks, CONCURRENCY)

  console.log(`\n─────────────────────────────────────────`)
  console.log(`Done — ${done} tagged, ${failed} failed`)
}

main().catch(err => { console.error(err); process.exit(1) })
