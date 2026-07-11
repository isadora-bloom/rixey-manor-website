// Diagnostic: did visitor_tracking.sql get applied? Look for the 'clair' name.
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

console.log('Project URL:', process.env.NEXT_PUBLIC_SUPABASE_URL, '\n')

// 1. Does site_visitors exist?
{
  const { data, error, count } = await supabase
    .from('site_visitors')
    .select('*', { count: 'exact' })
    .limit(20)
  if (error) {
    console.log('site_visitors: NOT FOUND or error:', error.message)
  } else {
    console.log(`site_visitors: ${count} total rows. Recent:`)
    console.log(JSON.stringify(data, null, 2))
  }
}

// 2. Does site_visits exist?
{
  const { data, error, count } = await supabase
    .from('site_visits')
    .select('*', { count: 'exact' })
    .order('ts', { ascending: false })
    .limit(10)
  if (error) {
    console.log('\nsite_visits: NOT FOUND or error:', error.message)
  } else {
    console.log(`\nsite_visits: ${count} total rows. Most recent ${data?.length || 0}:`)
    console.log(JSON.stringify(data, null, 2))
  }
}

// 3. Search for "clair" anywhere
console.log('\n— Looking for "clair" across all submission tables —')
const tables = ['site_visitors', 'calculator_submissions', 'contact_submissions', 'quiz_submissions']
for (const t of tables) {
  try {
    const { data, error } = await supabase.from(t).select('*').ilike('first_name', '%clair%').limit(5)
    const { data: d2 } = await supabase.from(t).select('*').ilike('p1_name', '%clair%').limit(5)
    const { data: d3 } = await supabase.from(t).select('*').ilike('name', '%clair%').limit(5)
    const all = [...(data || []), ...(d2 || []), ...(d3 || [])]
    if (error) console.log(`  ${t}: error - ${error.message}`)
    else if (all.length === 0) console.log(`  ${t}: 0 hits for "clair"`)
    else console.log(`  ${t}: ${all.length} hits!`, JSON.stringify(all, null, 2))
  } catch (e) { console.log(`  ${t}: ${e.message}`) }
}
