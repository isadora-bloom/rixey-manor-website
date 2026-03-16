/**
 * update-media-labels-batch2.mjs
 *
 * Updates category, label, space, season, is_couple, alt_text, sort_order
 * for the 27 images uploaded from "E:/Hero Images" (flat folder, March 2026).
 *
 * Run: node scripts/update-media-labels-batch2.mjs
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const UPDATES = [

  // Ballroom set for indoor ceremony — chiavari chairs, candelabras, greenery arch at French doors (winter wedding decor)
  {
    match: '1519829339-88c8dd4b0a06748e-1519829336-e0794ba668f43f38-1519829334595-58-aidanmikecolor-25',
    update: {
      category: 'gallery',
      label: 'ballroom-ceremony',
      space: 'ballroom',
      season: 'winter',
      is_couple: false,
      sort_order: 21,
      alt_text: 'The Rixey Manor ballroom set for a ceremony with white chiavari chairs, gold candelabras, and a greenery arch in front of the French doors.',
    },
  },

  // Wide aerial-ish shot of outdoor fall ceremony — bride walking down aisle, pond + Blue Ridge foothills
  {
    match: '2O4A0636',
    update: {
      category: 'gallery',
      label: 'outdoor-ceremony',
      space: 'ceremony',
      season: 'autumn',
      is_couple: true,
      sort_order: 22,
      alt_text: 'A wide shot of an outdoor fall ceremony at Rixey Manor, with the bride walking toward a floral arch and the Blue Ridge foothills and pond stretching out behind the guests.',
    },
  },

  // Bride and escort descending the front brick steps, veil trailing, white columns behind
  {
    match: '58dea379-e8d0-4bc9-ac77-300050f21284~rs_2880.1418',
    update: {
      category: 'gallery',
      label: 'bride-entrance',
      space: null,
      season: 'autumn',
      is_couple: false,
      sort_order: 23,
      alt_text: 'A bride and her escort walk down the brick front steps of Rixey Manor just before the ceremony, her veil trailing behind her.',
    },
  },

  // Nighttime sparkler exit — couple kissing inside long-exposure sparkler light trails
  {
    match: '596',
    update: {
      category: 'gallery',
      label: 'sparkler-exit',
      space: null,
      season: null,
      is_couple: true,
      sort_order: 24,
      alt_text: 'The newlyweds share a kiss surrounded by swirling sparkler light trails as guests cheer them out at the end of the night.',
    },
  },

  // Outdoor ceremony on the gravel forecourt — couple at altar on front steps, guests in chairs, summer foliage
  {
    match: '600297009_1198618362482869_5009503132833258730_n',
    update: {
      category: 'gallery',
      label: 'front-porch-ceremony',
      space: 'ceremony',
      season: 'summer',
      is_couple: true,
      sort_order: 25,
      alt_text: 'A couple exchanges vows on the front steps of Rixey Manor with guests seated on the forecourt and lush summer trees framing the white columns.',
    },
  },

  // Outdoor lawn ceremony — colorful chairs, floral arch, Virginia countryside and open sky behind
  {
    match: '601670259_25514930391530714_2790925038978980661_n',
    update: {
      category: 'gallery',
      label: 'lawn-ceremony',
      space: 'ceremony',
      season: 'summer',
      is_couple: true,
      sort_order: 26,
      alt_text: 'Guests watch from colorful chairs as a couple marries under a floral arch on the open lawn, with green Virginia hills stretching to the horizon.',
    },
  },

  // Couple at the tree swing at golden hour — bride in satin gown on swing, groom standing beside her
  {
    match: '604456064_1207628728230697_1873827555637617706_n',
    update: {
      category: 'gallery',
      label: 'tree-swing',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 27,
      alt_text: 'A bride sits on the flower-wrapped tree swing at golden hour while her groom stands beside her, the green field glowing behind them.',
    },
  },

  // Just-married petal exit off the front steps — bride laughing, petals in the air, guests cheering
  {
    match: '605495411_1118962483485521_7137651388796103021_n',
    update: {
      category: 'gallery',
      label: 'petal-exit',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 28,
      alt_text: 'The just-married couple walks through a shower of petals off the manor\'s front steps while guests cheer on both sides.',
    },
  },

  // Wide establishing exterior — manor from across the pasture fence, mature trees, ceremony chairs faintly visible
  {
    match: '777ade0d-c1d4-457b-8811-712a4bc99367',
    update: {
      category: 'gallery',
      label: 'manor-exterior',
      space: null,
      season: 'summer',
      is_couple: false,
      sort_order: 29,
      alt_text: 'A wide view of the Rixey Manor house from across the pasture, its white facade and columned porch visible behind a wooden fence and mature trees.',
    },
  },

  // Manor exterior set for fall reception — cocktail tables, autumn wreaths on shutters, yellow mums at steps
  {
    match: 'audra-jones-photogrpahy-rixey-manor-wedding-liz-alex-83',
    update: {
      category: 'gallery',
      label: 'autumn-reception-setup',
      space: null,
      season: 'autumn',
      is_couple: false,
      sort_order: 30,
      alt_text: 'Rixey Manor\'s front entrance dressed for a fall wedding reception, with white cocktail tables on the lawn, autumn wreaths on the shutters, and mums at the steps.',
    },
  },

  // B&W silhouette — bride at end of dim manor hallway, backlit by window
  {
    match: 'audra-jones-photogrpahy-rixey-manor-wedding-liz-alex-74',
    update: {
      category: 'gallery',
      label: 'bride-silhouette',
      space: null,
      season: null,
      is_couple: false,
      sort_order: 31,
      alt_text: 'A black and white silhouette of a bride at the end of a dim manor hallway, her gown and veil lit from behind by a window.',
    },
  },

  // B&W mirror reflection — bride in ballgown reflected in arched mirror on staircase wall, exposed brick behind
  {
    match: 'audra-jones-photogrpahy-rixey-manor-wedding-liz-alex-60',
    update: {
      category: 'gallery',
      label: 'bride-mirror',
      space: null,
      season: null,
      is_couple: false,
      sort_order: 32,
      alt_text: 'A bride\'s reflection in an arched mirror on the manor staircase wall, exposed brick and small topiaries framing the shot in black and white.',
    },
  },

  // Cocktail hour crowd on the front lawn — dozens of guests chatting, autumn trees and white columns behind
  {
    match: 'audra-jones-photogrpahy-rixey-manor-wedding-liz-alex-31',
    update: {
      category: 'gallery',
      label: 'cocktail-hour',
      space: null,
      season: 'autumn',
      is_couple: false,
      sort_order: 33,
      alt_text: 'Guests in formal dress mingle on the lawn in front of Rixey Manor during cocktail hour, the white columns and autumn trees behind them.',
    },
  },

  // B&W getting-ready — bride smiling as bridesmaid shakes out her train, fireplace room inside the manor
  {
    match: 'audra-jones-photogrpahy-rixey-manor-wedding-liz-alex-27',
    update: {
      category: 'gallery',
      label: 'getting-ready',
      space: null,
      season: null,
      is_couple: false,
      sort_order: 34,
      alt_text: 'A black and white photo of the bride smiling while a bridesmaid fluffs her train in the fireplace room inside the manor.',
    },
  },

  // Dusk portrait — couple walking toward glowing clear-top tent, bride looking back, veil trailing
  {
    match: 'audra-jones-photogrpahy-rixey-manor-wedding-liz-alex-171',
    update: {
      category: 'gallery',
      label: 'tent-dusk',
      space: 'terrace',
      season: 'summer',
      is_couple: true,
      sort_order: 35,
      alt_text: 'The couple walks across the dark lawn toward the glowing clear-top reception tent as evening falls, the bride glancing back over her shoulder.',
    },
  },

  // Full wedding party group photo — ~50 people on forecourt, white suits + sage gowns, couple on balcony above
  {
    match: 'DSC01390',
    update: {
      category: 'gallery',
      label: 'full-party-group',
      space: null,
      season: 'autumn',
      is_couple: true,
      sort_order: 36,
      alt_text: 'The full wedding party gathered on the gravel forecourt in front of Rixey Manor, with the couple waving from the balcony above the crowd.',
    },
  },

  // Couple running through a golden sunlit field at sunset, joyful and candid
  {
    match: 'DSC01827',
    update: {
      category: 'gallery',
      label: 'field-run',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 37,
      alt_text: 'The couple runs laughing through a golden field at sunset, the low sun blazing behind the treeline on the Rixey Manor property.',
    },
  },

  // Editorial motion-blur — groom in burgundy velvet blazer stands still as groomsmen blur past, autumn wreaths
  {
    match: 'DSC08290',
    update: {
      category: 'gallery',
      label: 'groom-motion',
      space: null,
      season: 'autumn',
      is_couple: false,
      sort_order: 38,
      alt_text: 'A groom in a burgundy velvet blazer stands composed in front of the manor doors while groomsmen move past him in a blur.',
    },
  },

  // Editorial motion-blur — tattooed bride stands still, bridesmaids in black blur past her on the front steps
  {
    match: 'DSC09025',
    update: {
      category: 'gallery',
      label: 'bride-motion',
      space: null,
      season: 'autumn',
      is_couple: false,
      sort_order: 39,
      alt_text: 'A tattooed bride holds her bouquet and stares into the camera while her bridesmaids move around her in a blur on the manor\'s front steps.',
    },
  },

  // First dance lift under wisteria canopy inside reception tent — groom lifts bride into a kiss, guests applauding
  {
    match: 'js-670',
    update: {
      category: 'gallery',
      label: 'first-dance',
      space: 'terrace',
      season: 'summer',
      is_couple: true,
      sort_order: 40,
      alt_text: 'The groom lifts his bride into a kiss on the dance floor under a canopy of hanging wisteria inside the reception tent as guests applaud.',
    },
  },

  // Daytime exterior of clear-top tent full of guests — old oak tree with swing visible, lush summer lawn
  {
    match: 'js-740',
    update: {
      category: 'gallery',
      label: 'tent-reception',
      space: 'terrace',
      season: 'summer',
      is_couple: false,
      sort_order: 41,
      alt_text: 'The clear-top reception tent full of guests seated at tables on the green lawn, with the old oak tree and its swing visible to the right.',
    },
  },

  // Lively reception dance floor — guest in wheelchair with gold sneakers at center, guests in leis dancing
  {
    match: 'js-871',
    update: {
      category: 'gallery',
      label: 'dance-floor',
      space: 'ballroom',
      season: null,
      is_couple: false,
      sort_order: 42,
      alt_text: 'Guests dance together on the manor ballroom floor, with a guest in a wheelchair at the center in a vivid outfit and gold sneakers.',
    },
  },

  // Sunset portrait at tree swing — bride on swing with bouquet, groom beside her, amber Virginia fields behind
  {
    match: 'maggie+mattwedding-1011',
    update: {
      category: 'gallery',
      label: 'swing-portrait',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 43,
      alt_text: 'A bride on the floral-wrapped tree swing holds her bouquet while her groom stands close, the golden Virginia fields behind them at sunset.',
    },
  },

  // Balcony view of outdoor ceremony — couple at arch, full sweep of fenced property, pond, and woodland visible
  {
    match: 'maggie+mattwedding-358',
    update: {
      category: 'gallery',
      label: 'ceremony-overview',
      space: 'ceremony',
      season: 'summer',
      is_couple: true,
      sort_order: 44,
      alt_text: 'A bird\'s-eye view of the outdoor ceremony from the manor balcony, showing the couple at the altar with the full sweep of the fenced Rixey Manor property behind them.',
    },
  },

  // Golden hour couple portrait in the open field — cathedral veil trailing, sun backlighting the green pasture
  {
    match: 'maggie+mattwedding-976',
    update: {
      category: 'gallery',
      label: 'field-portrait',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 45,
      alt_text: 'A couple walks hand in hand through the sun-drenched green field at Rixey Manor, the bride\'s long veil trailing behind her as the sun sets.',
    },
  },

  // Couple kissing beneath the oak tree hung with black lanterns and climbing peach roses — summer meadow behind
  {
    match: 'S+J-165_websize',
    update: {
      category: 'gallery',
      label: 'tree-kiss',
      space: null,
      season: 'summer',
      is_couple: true,
      sort_order: 46,
      alt_text: 'A couple kisses beneath the old oak tree hung with black lanterns and a climbing arrangement of peach roses, the summer meadow behind them.',
    },
  },

  // Intimate ceremony under a vivid red, orange, fuchsia floral arch between two trees, dappled shade
  {
    match: '_RAP4551',
    update: {
      category: 'gallery',
      label: 'colorful-arch-ceremony',
      space: 'ceremony',
      season: 'summer',
      is_couple: true,
      sort_order: 47,
      alt_text: 'A couple exchanges vows under a bold red and orange floral arch between two trees, guests seated on both sides in the dappled shade.',
    },
  },

]

async function run() {
  console.log(`\nUpdating ${UPDATES.length} media rows...\n`)

  let succeeded = 0
  let failed = 0
  let notFound = 0

  for (const { match, update } of UPDATES) {
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
      console.log(`OK  ${update.category.padEnd(14)} ${update.label.padEnd(28)} ${label.slice(0, 50)}`)
      succeeded++
    }
  }

  console.log(`\nDone. ${succeeded} updated, ${failed} errors, ${notFound} not found.`)
}

run()
