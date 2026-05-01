// Rewrite weak alt text on site_images + site_image_extras with scene-descriptive
// alts that include "Rixey Manor", location, and scene type — for SEO + AI image
// surfaces. Templated per slot since we can't see individual photos. Better than
// empty.
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

function loadEnv() {
  const txt = readFileSync('.env.local', 'utf-8')
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}
loadEnv()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

// Per-slot descriptive alts for site_images (9 weak rows)
const SITE_IMAGE_ALTS = {
  'spaces-ballroom':       'The Rixey Manor ballroom set for a seated wedding dinner, with crystal chandeliers and French doors on three sides',
  'home-spaces-ballroom':  'Wedding reception in the Rixey Manor ballroom, Northern Virginia',
  'venue-spaces-ballroom': 'Interior of the Rixey Manor ballroom, an indoor reception space at the historic Virginia estate',
  'blog-banner':           'A wedding scene at Rixey Manor, the historic estate wedding venue in Rixeyville, Virginia',
  'hero-venue':            'Aerial view of Rixey Manor, a 225-year-old wedding venue on 30 acres in Rixeyville, Northern Virginia',
  'faq-accent':            'The Rixey Manor estate exterior, a historic 1801 wedding venue in Culpeper County, Virginia',
  'venue-team-grace':      'Grace, the venue manager at Rixey Manor wedding venue in Rixeyville, Virginia',
  'faq-banner':            'The grounds of Rixey Manor estate, with the lakeside ceremony site and Blue Ridge Mountains in the distance',
  'availability-hero':     'Rixey Manor estate at golden hour, a Northern Virginia wedding venue 60 miles from Washington DC',
}

// Per-slot template alts for the 31 empty extras
const EXTRAS_ALT_BY_SLOT = {
  'home-spaces-ceremony':    'Outdoor wedding ceremony at the Rixey Manor lakeside terrace, with Blue Ridge Mountain views',
  'home-spaces-ballroom':    'Wedding reception inside the Rixey Manor ballroom, Northern Virginia',
  'home-spaces-terrace':     'Wedding reception under the clear-span tent on the Rixey Manor terrace, with string lights and mountain views',
  'home-spaces-bar':         'The bar at Rixey Manor wedding venue, set up for a wedding reception',
  'venue-spaces-ceremony':   'Lakeside wedding ceremony at Rixey Manor with the Blue Ridge Mountain backdrop',
  'venue-spaces-ballroom':   'The Rixey Manor ballroom dressed for a seated wedding dinner',
  'venue-spaces-terrace':    'The Rixey Manor terrace with clear-span tent, string lights, and Blue Ridge views',
  'venue-spaces-rooftop':    'The 1,800 square foot rooftop at Rixey Manor, facing west toward the Blue Ridge Mountains',
  'venue-team-isadora':      'Isadora Martin-Dye, owner and founder of Rixey Manor wedding venue',
  'venue-room-cottage':      'Inside the Blacksmith Cottage at Rixey Manor, providing overnight lodging for wedding guests',
  'venue-room-newlywed':     'The Newlywed Suite at Rixey Manor, featuring a copper bathtub and 360-degree mirror',
  'hero-homepage':           'Rixey Manor estate, a historic 1801 wedding venue on 30 acres in Rixeyville, Virginia',
}

let okSite = 0, okExtras = 0, fail = 0

// Update site_images
for (const [id, alt] of Object.entries(SITE_IMAGE_ALTS)) {
  const { error } = await supabase.from('site_images').update({ alt_text: alt }).eq('id', id)
  if (error) { console.error(`FAIL site_images ${id}:`, error.message); fail++ }
  else okSite++
}

// Update site_image_extras — only those whose alt_text is currently empty
{
  const { data: extras } = await supabase
    .from('site_image_extras')
    .select('id, slot_id, alt_text')
    .not('url', 'is', null)
  for (const e of extras || []) {
    const isWeak = !e.alt_text || String(e.alt_text).trim().length < 8
    if (!isWeak) continue
    const alt = EXTRAS_ALT_BY_SLOT[e.slot_id]
    if (!alt) {
      console.log(`SKIP extras#${e.id} slot=${e.slot_id} (no template)`)
      continue
    }
    const { error } = await supabase.from('site_image_extras').update({ alt_text: alt }).eq('id', e.id)
    if (error) { console.error(`FAIL extras#${e.id}:`, error.message); fail++ }
    else okExtras++
  }
}

console.log(`\nUpdated: ${okSite} site_images, ${okExtras} extras, ${fail} failed.`)
