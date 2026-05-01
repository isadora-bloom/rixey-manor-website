// Audit alt text across image-bearing tables. Flag generic, empty, or
// SEO-weak alts so we can rewrite them.
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

const tables = [
  { name: 'site_images',        cols: 'id, url, alt_text' },
  { name: 'site_image_extras',  cols: 'id, slot_id, url, alt_text' },
  { name: 'media',              cols: 'id, label, category, alt_text, url' },
  { name: 'spaces',             cols: 'id, name, alt_text' },
  { name: 'blog_posts',         cols: 'id, title, slug, cover_image, cover_image_alt' },
  { name: 'homepage_testimonials', cols: 'id, name, photo_alt' },
  { name: 'homepage_press',     cols: 'id, name, logo_alt' },
]

for (const t of tables) {
  const { data, error } = await supabase.from(t.name).select(t.cols).limit(500)
  if (error) {
    console.log(`\n— ${t.name} — error: ${error.message}`)
    continue
  }
  console.log(`\n=== ${t.name} (${data.length} rows) ===`)
  console.log(JSON.stringify(data, null, 2))
}
