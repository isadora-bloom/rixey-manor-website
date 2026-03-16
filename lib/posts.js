import { supabase } from '@/lib/supabase'
import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

export async function getAllPosts() {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) return null
  return data
}

export async function getAllSlugs() {
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true)
  return (data || []).map(p => p.slug)
}

export function renderMarkdown(content) {
  return marked(content)
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export const CATEGORY_LABELS = {
  'practical-advice': 'Practical Advice',
  'real-rixey':       'Real Rixey',
  'budgeting':        'Budgeting',
  'rixey-specific':   'Rixey Life',
  'pep-talk':         'Pep Talk',
}
