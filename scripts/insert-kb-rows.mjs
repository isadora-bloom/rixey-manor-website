import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabase = createClient(
  'https://mewwmahgokmjbcsogmvm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld3dtYWhnb2ttamJjc29nbXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIzMDE0NCwiZXhwIjoyMDg1ODA2MTQ0fQ.rB2fOiH3j7SusaBPISWVr27frwdwkh6-JhCtTmpx48c'
)

const csv = readFileSync('C:/Users/Ismar/Downloads/kb_new_rows_to_insert.csv', 'utf-8')

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        result.push(current)
        current = ''
      } else {
        current += ch
      }
    }
  }
  result.push(current)
  return result
}

function parseCSV(text) {
  const rows = []
  const lines = text.split('\n')
  const headers = parseCSVLine(lines[0])

  let i = 1
  while (i < lines.length) {
    let line = lines[i]
    // Accumulate lines until quotes are balanced (multiline content fields)
    while (i + 1 < lines.length && (line.match(/"/g) || []).length % 2 !== 0) {
      i++
      line += '\n' + lines[i]
    }
    if (line.trim()) {
      const values = parseCSVLine(line)
      if (values.length === headers.length) {
        const row = {}
        headers.forEach((h, idx) => (row[h] = values[idx]))
        rows.push(row)
      }
    }
    i++
  }
  return rows
}

const rows = parseCSV(csv)
console.log(`Parsed ${rows.length} rows from CSV\n`)

const insertRows = rows.map((r) => ({
  id: r.id,
  title: r.title,
  category: r.category,
  subcategory: r.subcategory,
  description: r.description,
  content: r.content,
  created_at: r.created_at,
  active: r.active === 'True' || r.active === 'true',
  updated_at: r.updated_at,
}))

const { data, error } = await supabase
  .from('knowledge_base')
  .upsert(insertRows, { onConflict: 'id' })
  .select('id, title')

if (error) {
  console.error('Insert error:', error.message)
  process.exit(1)
}

console.log(`Inserted ${data.length} rows:`)
data.forEach((r) => console.log(`  + ${r.title}`))
