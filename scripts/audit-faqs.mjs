// Read all active FAQ rows. Used for the SEO/GEO audit pass to identify
// answers that bury the answer past the first sentence (anti-pattern for
// AI engines that quote answers verbatim).
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

const { data, error } = await supabase
  .from('faqs')
  .select('id, category, sort_order, question, answer, active')
  .eq('active', true)
  .order('category')
  .order('sort_order')

if (error) { console.error(error); process.exit(1) }

console.log(`\n${data.length} active FAQ rows:\n`)
console.log(JSON.stringify(data, null, 2))
