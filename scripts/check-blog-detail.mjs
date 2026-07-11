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

const { data: posts } = await supabase
  .from('blog_posts')
  .select('slug, title, post_date, category, excerpt, featured, author, cover_image, published')

for (const p of posts || []) {
  console.log(`\n— ${p.slug} —`)
  console.log(`  published: ${p.published}, featured: ${p.featured}`)
  console.log(`  category:  ${JSON.stringify(p.category)}`)
  console.log(`  cover:     ${p.cover_image}`)
  console.log(`  excerpt:   ${p.excerpt ? p.excerpt.slice(0, 60) + '...' : '(none)'}`)
}

// Distinct categories (including null)
const cats = new Set((posts || []).map(p => p.category))
console.log('\nDistinct categories present:', [...cats])
