import { supabaseServer } from '@/lib/supabaseServer'
import { marked } from 'marked'
import { getCmsPosts, getCmsPostBySlug } from '@/lib/cms'

// Pure helpers live in blog-meta.js (safe for client imports). Re-export here
// for backward compatibility — but client code should import from blog-meta
// directly to avoid pulling Supabase into the client bundle.
export { CATEGORY_LABELS, formatDate } from '@/lib/blog-meta'

marked.setOptions({ breaks: true, gfm: true })

// Lazily create the Supabase client per call so importing this module from a
// client component (even by accident) doesn't trigger createClient at top
// level — that fails with "supabaseKey is required" in the browser bundle.
function sb() {
  return supabaseServer()
}

async function getLegacyPosts() {
  const { data, error } = await sb()
    .from('blog_posts')
    .select('id, title, slug, post_date, category, excerpt, featured, author, cover_image')
    .eq('published', true)
    .order('post_date', { ascending: false })

  if (error) {
    console.error('Error fetching legacy blog posts:', error)
    return []
  }
  return (data || []).map((p) => ({ ...p, source: 'legacy' }))
}

// Merge legacy blog_posts (the original Rixey table) with new posts from
// the Presshouse CMS canonical to 'rixey'. Both are sorted into one stream
// by post_date desc, with featured posts pinned to the top.
export async function getAllPosts() {
  const [legacy, cms] = await Promise.all([getLegacyPosts(), getCmsPosts()])
  // Dedup by slug — if a slug exists in both, prefer the CMS version (it's
  // the active editing surface going forward).
  const cmsSlugs = new Set(cms.map((p) => p.slug))
  const merged = [...cms, ...legacy.filter((p) => !cmsSlugs.has(p.slug))]
  return merged.sort((a, b) => {
    if (a.featured !== b.featured) return b.featured ? 1 : -1
    return new Date(b.post_date).getTime() - new Date(a.post_date).getTime()
  })
}

export async function getPostBySlug(slug) {
  // Try legacy first (existing URLs are sacred — they have backlinks).
  const { data } = await sb()
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (data) return { ...data, source: 'legacy' }

  // Fall through to the CMS for new posts.
  return await getCmsPostBySlug(slug)
}

export async function getAllSlugs() {
  const [legacy, cms] = await Promise.all([
    sb().from('blog_posts').select('slug').eq('published', true).then((r) => r.data || []),
    getCmsPosts()
  ])
  const slugs = new Set([...legacy.map((p) => p.slug), ...cms.map((p) => p.slug)])
  return Array.from(slugs)
}

export function renderMarkdown(content) {
  return marked(content)
}
