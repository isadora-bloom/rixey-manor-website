// Export every client-data / tracking table to exports/ as JSON + CSV.
// For uploading Rixey website touchpoints into the Bloom House portal.
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

function loadEnv() {
  const txt = readFileSync('.env.local', 'utf-8')
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}
loadEnv()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

const STAMP = new Date().toISOString().slice(0, 10)
const OUT = 'exports'
mkdirSync(OUT, { recursive: true })

// table -> column to order by (for stable, paginated reads)
const TABLES = {
  calculator_submissions: 'created_at',
  contact_submissions: 'created_at',
  quiz_submissions: 'created_at',
  budget_calculator_submissions: 'created_at',
  site_visitors: 'first_seen_at',
  site_visits: 'ts',
}

function toCSV(rows) {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  const esc = (v) => {
    if (v === null || v === undefined) return ''
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\r\n')
}

async function fetchAll(table, orderBy) {
  const all = []
  const PAGE = 1000
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending: true })
      .range(from, from + PAGE - 1)
    if (error) throw new Error(`${table}: ${error.message}`)
    all.push(...data)
    if (data.length < PAGE) break
  }
  return all
}

const manifest = { exported_at: new Date().toISOString(), source: process.env.NEXT_PUBLIC_SUPABASE_URL, tables: {} }

for (const [table, orderBy] of Object.entries(TABLES)) {
  const rows = await fetchAll(table, orderBy)
  const jsonPath = `${OUT}/${table}_${STAMP}.json`
  writeFileSync(jsonPath, JSON.stringify(rows, null, 2))
  let csvPath = null
  if (rows.length) {
    csvPath = `${OUT}/${table}_${STAMP}.csv`
    writeFileSync(csvPath, toCSV(rows))
  }
  manifest.tables[table] = { rows: rows.length, json: jsonPath, csv: csvPath }
  console.log(`${table}: ${rows.length} rows -> ${jsonPath}${csvPath ? ' + .csv' : ' (empty, json only)'}`)
}

writeFileSync(`${OUT}/_manifest_${STAMP}.json`, JSON.stringify(manifest, null, 2))
console.log(`\nManifest: ${OUT}/_manifest_${STAMP}.json`)
