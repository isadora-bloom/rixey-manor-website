/**
 * update-media-labels.mjs
 *
 * Updates category, label, space, season, is_couple, alt_text, sort_order
 * for all 27 hero images uploaded from "Heros in 2025".
 *
 * Run: node scripts/update-media-labels.mjs
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Map: original label (filename without extension) → update payload
const UPDATES = [

  // ─── HOMEPAGE HERO ────────────────────────────────────────────────────────
  // Drone aerial of full estate at sunset, Blue Ridge Mountains in background
  {
    match: 'DJI_0983',
    update: {
      category: 'hero',
      label: 'hero',
      space: null,
      season: 'spring',
      is_couple: false,
      sort_order: 1,
      alt_text: 'Aerial view of Rixey Manor at sunset — 30 acres, the lake, and the Blue Ridge Mountains',
    },
  },

  // ─── VENUE PAGE HERO ──────────────────────────────────────────────────────
  // Manor exterior at golden hour, ceremony chairs on the lawn
  {
    match: 'Untitled',
    update: {
      category: 'hero',
      label: 'venue-hero',
      space: null,
      season: 'summer',
      is_couple: false,
      sort_order: 1,
      alt_text: 'Rixey Manor estate at golden hour, white columns and ceremony chairs on the lawn',
    },
  },

  // ─── SPACES (homepage SpacesSection + venue VenueSpaces) ─────────────────
  // Elevated aerial of outdoor lake view ceremony, rolling hills
  {
    match: 'S+J-105_websize',
    update: {
      category: 'spaces',
      label: 'ceremony',
      space: 'ceremony',
      season: 'summer',
      is_couple: false,
      sort_order: 1,
      alt_text: 'Outdoor wedding ceremony at Rixey Manor with rolling hills and fenced pastures behind guests',
    },
  },
  // Empty ballroom set for reception — chandeliers, dark floors, full-length windows
  {
    match: '_DSF7109',
    update: {
      category: 'spaces',
      label: 'ballroom',
      space: 'ballroom',
      season: null,
      is_couple: false,
      sort_order: 2,
      alt_text: 'The Rixey Manor ballroom set for a wedding reception with crystal chandeliers and dark hardwood floors',
    },
  },
  // First dance inside clear tent at night — string lights, night sky through roof
  {
    match: 'DSC01117',
    update: {
      category: 'spaces',
      label: 'terrace',
      space: 'terrace',
      season: 'winter',
      is_couple: true,
      sort_order: 3,
      alt_text: 'First dance under the clear tent at Rixey Manor, string lights overhead and night sky visible through the roof',
    },
  },
  // Indoor candlelit ceremony in ballroom — shows ballroom as ceremony space
  {
    match: '670e6e2129b20baa53736577_Cassie---Maria---Vera-Photography---HIL--419082-',
    update: {
      category: 'spaces',
      label: 'ballroom-ceremony',
      space: 'ballroom',
      season: 'autumn',
      is_couple: true,
      sort_order: 4,
      alt_text: 'Indoor winter ceremony in the Rixey Manor ballroom, pillar candles lining the aisle',
    },
  },

  // ─── ACCOMMODATIONS ───────────────────────────────────────────────────────
  // Groomsmen in kilts in the Blacksmith Cottage living room
  {
    match: '_DSF6322',
    update: {
      category: 'gallery',
      label: 'cottage',
      space: null,
      season: null,
      is_couple: false,
      sort_order: 5,
      alt_text: 'Groomsmen relaxing in the Blacksmith Cottage at Rixey Manor before the ceremony',
    },
  },

  // ─── GALLERY ──────────────────────────────────────────────────────────────
  // Bridal party in snow, fur stoles, green gowns, fenced fields
  {
    match: '421491974_829143732556617_7162987475203957349_n',
    update: {
      category: 'gallery',
      label: 'january',
      space: null,
      season: 'winter',
      is_couple: false,
      sort_order: 1,
      alt_text: 'Bridal party in the snow at Rixey Manor, fur stoles and green gowns',
    },
  },
  // Couple on estate swing, golden hour, lush summer grass
  {
    match: '604456064_1207628728230697_1873827555637617706_n',
    update: {
      category: 'gallery',
      label: 'june',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 2,
      alt_text: 'Couple at golden hour on the estate swing at Rixey Manor',
    },
  },
  // Ballroom reception candid — bride at table, warm light, guests
  {
    match: '605011074_2082858585801653_5180200934701908134_n',
    update: {
      category: 'gallery',
      label: 'september',
      space: null,
      season: 'autumn',
      is_couple: true,
      sort_order: 3,
      alt_text: 'Candid moment during a wedding reception in the Rixey Manor ballroom',
    },
  },
  // Bride descending staircase with floral garland on banister
  {
    match: '608125945_856444327159708_3234277351560326964_n',
    update: {
      category: 'gallery',
      label: 'october',
      space: null,
      season: 'autumn',
      is_couple: false,
      sort_order: 4,
      alt_text: 'Bride descending the Rixey Manor staircase, flowers draped along the banister',
    },
  },
  // Double rainbow over estate grounds, couple embracing
  {
    match: 'Apeksha & Roy - Wedding Previews - Amative Creative-70',
    update: {
      category: 'gallery',
      label: 'july',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 5,
      alt_text: 'Couple embracing under a full double rainbow over the Rixey Manor grounds',
    },
  },
  // Bride on front steps, floral wreaths on green shutters
  {
    match: 'audra-jones-photogrpahy-rixey-manor-wedding-liz-alex-126',
    update: {
      category: 'gallery',
      label: 'march',
      space: null,
      season: 'spring',
      is_couple: false,
      sort_order: 6,
      alt_text: 'Bride stepping out of the front door of Rixey Manor, floral wreaths flanking the entrance',
    },
  },
  // Couple walking hand in hand toward lit tent at twilight
  {
    match: 'audra-jones-photogrpahy-rixey-manor-wedding-liz-alex-171',
    update: {
      category: 'gallery',
      label: 'august',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 7,
      alt_text: 'Couple walking toward the glowing clear tent at Rixey Manor at twilight',
    },
  },
  // Bride laughing by fireplace, bridesmaid emotional
  {
    match: 'audra-jones-photogrpahy-rixey-manor-wedding-liz-alex-32',
    update: {
      category: 'gallery',
      label: 'april',
      space: null,
      season: 'spring',
      is_couple: false,
      sort_order: 8,
      alt_text: 'Bride laughing by the fireplace in the manor while bridesmaid helps with her veil',
    },
  },
  // Getting ready scene in manor living room
  {
    match: 'DSC09036',
    update: {
      category: 'gallery',
      label: 'august',
      space: null,
      season: 'summer',
      is_couple: false,
      sort_order: 9,
      alt_text: 'Bridal party getting ready in the Rixey Manor living room',
    },
  },
  // Two brides with flower-crowned yellow lab
  {
    match: 'jamie and lauren dog',
    update: {
      category: 'gallery',
      label: 'june',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 10,
      alt_text: 'Two brides with their flower-crowned dog at Rixey Manor',
    },
  },
  // Couple at golden hour in front of manor, sun flare through trees
  {
    match: 'jk-513',
    update: {
      category: 'gallery',
      label: 'october',
      space: null,
      season: 'autumn',
      is_couple: true,
      sort_order: 11,
      alt_text: 'Couple at sunset in front of Rixey Manor, golden light filtering through the trees',
    },
  },
  // Couple with horse at fence, autumn light
  {
    match: 'LMP03815',
    update: {
      category: 'gallery',
      label: 'october',
      space: null,
      season: 'autumn',
      is_couple: true,
      sort_order: 12,
      alt_text: 'Couple with a horse at the pasture fence at Rixey Manor in autumn light',
    },
  },
  // Manor exterior, soft golden haze
  {
    match: 'maggie+mattwedding-618',
    update: {
      category: 'gallery',
      label: 'june',
      space: null,
      season: 'summer',
      is_couple: false,
      sort_order: 13,
      alt_text: 'Rixey Manor estate on a summer wedding day',
    },
  },
  // Confetti recessional, outdoor lake ceremony, summer
  {
    match: 'MCWFINAL-561',
    update: {
      category: 'gallery',
      label: 'june',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 14,
      alt_text: 'Couple recessioning through a shower of confetti at an outdoor Rixey Manor ceremony',
    },
  },
  // Clear tent at twilight, warm string lights (empty, atmospheric)
  {
    match: 'Sparkle Tent',
    update: {
      category: 'gallery',
      label: 'october',
      space: null,
      season: 'autumn',
      is_couple: false,
      sort_order: 15,
      alt_text: 'Clear tent reception at Rixey Manor at dusk, warm string lights glowing against the evening sky',
    },
  },
  // Indian mandap ceremony, outdoor, vibrant florals
  {
    match: 'unnamed (1)',
    update: {
      category: 'gallery',
      label: 'october',
      space: null,
      season: 'autumn',
      is_couple: true,
      sort_order: 16,
      alt_text: 'Indian wedding ceremony under a floral mandap at Rixey Manor, rolling hills in the background',
    },
  },
  // Two brides kissing, joyful bridal party surrounding them
  {
    match: '_RAP0479',
    update: {
      category: 'gallery',
      label: 'may',
      space: null,
      season: 'spring',
      is_couple: true,
      sort_order: 17,
      alt_text: 'Two brides kissing as their bridal party reacts with joy at Rixey Manor',
    },
  },
  // Couple with their large fluffy dog at outdoor ceremony altar, fall colors
  {
    match: '_RAP3734',
    update: {
      category: 'gallery',
      label: 'november',
      space: null,
      season: 'autumn',
      is_couple: true,
      sort_order: 18,
      alt_text: 'Couple petting their dog at the outdoor altar during their Rixey Manor ceremony, autumn colors',
    },
  },
  // Korean hanbok getting ready, bride being dressed, mirror shot
  {
    match: '_RAP3757',
    update: {
      category: 'gallery',
      label: 'june',
      space: null,
      season: 'summer',
      is_couple: false,
      sort_order: 19,
      alt_text: 'Bride in traditional Korean hanbok being dressed before her ceremony at Rixey Manor',
    },
  },
  // All guests + wedding party in front of manor, couple on balcony
  {
    match: '_RAP5095(2)',
    update: {
      category: 'gallery',
      label: 'june',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 20,
      alt_text: 'All guests gathered in front of Rixey Manor, couple waving from the balcony above',
    },
  },
]

async function run() {
  console.log(`\nUpdating ${UPDATES.length} media rows...\n`)

  let succeeded = 0
  let failed = 0
  let notFound = 0

  for (const { match, update } of UPDATES) {
    // Find the row by original label (partial match — the label was stored as original filename)
    const { data: rows, error: fetchErr } = await supabase
      .from('media')
      .select('id, label')
      .ilike('label', `%${match}%`)
      .limit(1)

    if (fetchErr) {
      console.log(`FETCH ERROR [${match}]: ${fetchErr.message}`)
      failed++
      continue
    }

    if (!rows || rows.length === 0) {
      console.log(`NOT FOUND: ${match}`)
      notFound++
      continue
    }

    const { id, label } = rows[0]
    const { error: updateErr } = await supabase
      .from('media')
      .update(update)
      .eq('id', id)

    if (updateErr) {
      console.log(`UPDATE ERROR [${label}]: ${updateErr.message}`)
      failed++
    } else {
      console.log(`OK  ${update.category.padEnd(14)} ${update.label.padEnd(20)} ${label.slice(0, 50)}`)
      succeeded++
    }
  }

  console.log(`\nDone. ${succeeded} updated, ${failed} errors, ${notFound} not found.`)
}

run()
