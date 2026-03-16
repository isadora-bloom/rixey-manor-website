import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// maggie+mattwedding-358 = bird's eye view from the rooftop/balcony looking down at the ceremony
// Perfect for the rooftop space slot: shows what you see FROM up there
const { data: rows } = await supabase.from('media').select('id, label').ilike('url', '%maggie-mattwedding-358%').limit(1)
if (!rows?.length) { console.log('NOT FOUND'); process.exit(1) }

const { error } = await supabase.from('media').update({
  category: 'spaces',
  label: 'rooftop',
  space: 'rooftop',
  season: 'summer',
  is_couple: true,
  sort_order: 2,
  alt_text: "A bird's-eye view from the Rixey Manor rooftop, looking down at the outdoor ceremony with fenced pastures, the pond, and dense woodland stretching to the horizon.",
}).eq('id', rows[0].id)

console.log(error ? 'ERROR: ' + error.message : 'OK — maggie+mattwedding-358 → spaces/rooftop')
