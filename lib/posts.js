import { supabaseServer } from '@/lib/supabaseServer'
import { marked } from 'marked'

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

export async function getAllPosts() {
  const { data, error } = await sb()
    .from('blog_posts')
    .select('id, title, slug, post_date, category, excerpt, featured, author, cover_image')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('post_date', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  return data || []
}

export async function getPostBySlug(slug) {
  const { data, error } = await sb()
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) return null
  return data
}

export async function getAllSlugs() {
  const { data } = await sb()
    .from('blog_posts')
    .select('slug')
    .eq('published', true)
  return (data || []).map(p => p.slug)
}

export function renderMarkdown(content) {
  return marked(content)
}
