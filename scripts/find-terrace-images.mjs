/**
 * find-terrace-images.mjs
 * Queries the media table for images likely to be terrace/tent shots,
 * displays them so you can pick the best, then tags selected ones as
 * category='spaces', space='terrace'.
 *
 * Usage:
 *   node scripts/find-terrace-images.mjs           -- list candidates
 *   node scripts/find-terrace-images.mjs --tag      -- tag top candidate automatically
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const TAG_MODE = process.argv.includes('--tag')

// IDs to manually tag as terrace (fill in after reviewing candidates)
const TERRACE_IDS = process.argv.includes('--ids')
  ? process.argv[process.argv.indexOf('--ids') + 1].split(',')
  : []

async function main() {
  if (TERRACE_IDS.length > 0) {
    // Tag specific IDs as terrace space images
    const { error } = await supabase
      .from('media')
      .update({ category: 'spaces', space: 'terrace', active: true })
      .in('id', TERRACE_IDS)
    if (error) { console.error('Tag error:', error); process.exit(1) }
    console.log(`✅ Tagged ${TERRACE_IDS.length} image(s) as terrace`)
    return
  }

  // Find candidate images — tent/reception scenes that mention terrace/tent in labels
  const { data: candidates, error } = await supabase
    .from('media')
    .select('id, url, alt_text, scene_type, label, quality, couple_names, wedding_month, space, category')
    .or('category.eq.spaces,label.ilike.%tent%,label.ilike.%terrace%,label.ilike.%clear%')
    .order('quality', { ascending: false })
    .limit(60)

  if (error) { console.error(error); process.exit(1) }

  // Also pull reception/venue shots with high quality
  const { data: reception, error: e2 } = await supabase
    .from('media')
    .select('id, url, alt_text, scene_type, label, quality, couple_names, wedding_month, space, category')
    .eq('scene_type', 'reception')
    .gte('quality', 4)
    .order('quality', { ascending: false })
    .limit(80)

  if (e2) { console.error(e2); process.exit(1) }

  // Combine and deduplicate
  const seen = new Set()
  const all = [...(candidates || []), ...(reception || [])].filter(img => {
    if (seen.has(img.id)) return false
    seen.add(img.id)
    return true
  })

  // Filter for likely tent/terrace shots
  const scored = all.map(img => {
    const l = (img.label || '').toLowerCase()
    const a = (img.alt_text || '').toLowerCase()
    let score = img.quality || 3
    if (l.includes('tent') || a.includes('tent')) score += 3
    if (l.includes('terrace') || a.includes('terrace')) score += 3
    if (l.includes('clear') && (l.includes('tent') || l.includes('span'))) score += 2
    if (l.includes('string light') || l.includes('fairy light')) score += 1
    if (l.includes('drape') || l.includes('chandelier')) score += 1
    if (img.category === 'spaces' && img.space === 'rooftop') score += 1
    return { ...img, score }
  }).sort((a, b) => b.score - a.score)

  console.log(`\nFound ${scored.length} candidate images. Top 30:\n`)
  console.log('ID                                    | Score | Quality | Scene       | Month    | Alt text / labels snippet')
  console.log('--------------------------------------+-------+---------+-------------+----------+--------------------------------------------')

  scored.slice(0, 30).forEach(img => {
    const id = img.id.padEnd(36)
    const score = String(img.score).padEnd(5)
    const quality = String(img.quality ?? '?').padEnd(7)
    const scene = (img.scene_type || '').padEnd(11)
    const month = (img.wedding_month || '').padEnd(8)
    const snippet = ((img.alt_text || img.label || '').substring(0, 60)).replace(/\n/g, ' ')
    console.log(`${id} | ${score} | ${quality} | ${scene} | ${month} | ${snippet}`)
  })

  console.log('\n--- Currently tagged as spaces ---')
  const { data: current } = await supabase
    .from('media')
    .select('id, url, space, alt_text')
    .eq('category', 'spaces')
  ;(current || []).forEach(img => {
    console.log(`  [${img.space}] ${img.id} — ${(img.alt_text || '').substring(0, 60)}`)
  })

  console.log(`
To tag images as terrace, run:
  node scripts/find-terrace-images.mjs --ids ID1,ID2,ID3
`)
}

main()
