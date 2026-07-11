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

const { data, count } = await supabase
  .from('blog_posts')
  .select('slug, title, published, post_date, category', { count: 'exact' })
  .order('post_date', { ascending: false })

console.log(`${count} total blog posts\n`)
for (const p of data || []) {
  console.log(`  ${p.published ? '✓' : ' '} ${p.post_date}  ${p.category || '-'}  ${p.title}  /blog/${p.slug}`)
}
