// Filtered alt audit — only show rows that have a URL but missing/weak alt text
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

function isWeakAlt(alt) {
  if (!alt) return true
  const a = String(alt).trim().toLowerCase()
  if (a.length < 8) return true
  // generic/placeholder alts
  if (['image', 'photo', 'wedding', 'rixey', 'rixey manor', 'venue', 'space'].includes(a)) return true
  if (/^(image|photo|img)[-_\s\d]*$/i.test(a)) return true
  return false
}

console.log('\n=== site_images: rows with URL but weak/missing alt ===')
{
  const { data } = await supabase.from('site_images').select('id, url, alt_text').not('url', 'is', null)
  const bad = (data || []).filter(r => isWeakAlt(r.alt_text))
  console.log(`${bad.length} of ${data?.length || 0} URL-bearing rows are weak`)
  bad.forEach(r => console.log(`  ${r.id}  alt: ${JSON.stringify(r.alt_text)}  url: ${r.url}`))
}

console.log('\n=== site_image_extras: rows with URL but weak/missing alt ===')
{
  const { data } = await supabase.from('site_image_extras').select('id, slot_id, url, alt_text').not('url', 'is', null)
  const bad = (data || []).filter(r => isWeakAlt(r.alt_text))
  console.log(`${bad.length} of ${data?.length || 0} extras are weak`)
  bad.forEach(r => console.log(`  ${r.slot_id}#${r.id}  alt: ${JSON.stringify(r.alt_text)}`))
}

console.log('\n=== media: rows with URL but weak/missing alt ===')
{
  try {
    const { data, error } = await supabase.from('media').select('id, label, category, alt_text, url').not('url', 'is', null)
    if (error) { console.log('  (no media table or no rows)'); }
    else {
      const bad = (data || []).filter(r => isWeakAlt(r.alt_text))
      console.log(`${bad.length} of ${data?.length || 0} media rows are weak`)
      bad.forEach(r => console.log(`  ${r.id}  label=${r.label}  category=${r.category}  alt: ${JSON.stringify(r.alt_text)}`))
    }
  } catch (e) { console.log('  (skipped)') }
}

console.log('\n=== blog_posts cover image alts ===')
{
  try {
    const { data, error } = await supabase.from('blog_posts').select('id, title, slug, cover_image, cover_image_alt').not('cover_image', 'is', null)
    if (error) { console.log('  (cover_image_alt may not exist):', error.message) }
    else {
      const bad = (data || []).filter(r => isWeakAlt(r.cover_image_alt))
      console.log(`${bad.length} of ${data?.length || 0} blog posts have weak cover alt`)
      bad.forEach(r => console.log(`  ${r.slug}  title=${r.title}  alt: ${JSON.stringify(r.cover_image_alt)}`))
    }
  } catch { console.log('  (skipped)') }
}
