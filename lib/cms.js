// Fetches posts from the Presshouse CMS (the unified content backend).
// Returns posts canonical to 'rixey'. Surfaced posts (canonical to other
// sites but tagged for Rixey) are fetched separately via getSurfaced.
//
// Shape is normalized to match the existing /lib/posts.js return shape so
// the existing UI components (BlogIndex, post detail) can render either
// source without modification.

const API_BASE = process.env.NEXT_PUBLIC_PRESSHOUSE_API_URL || 'https://presshouse.vercel.app'
const SITE = 'rixey'

function normalize(p) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    post_date: p.published_at,
    category: p.category || 'practical-advice',
    excerpt: p.excerpt || '',
    content: p.body_md || '',
    featured: !!p.featured,
    author: p.author_name || 'Isadora Martin-Dye',
    cover_image: p.hero_image || null,
    cover_image_alt: p.hero_image_alt || null,
    seo_title: p.seo_title || null,
    seo_description: p.seo_description || null,
    updated_at: p.published_at,
    source: 'cms',
    tags: p.tags || []
  }
}

async function safeFetch(url) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.error('cms fetch failed:', url, e)
    return null
  }
}

export async function getCmsPosts() {
  const json = await safeFetch(`${API_BASE}/api/public/posts?site=${SITE}&limit=100`)
  if (!json?.posts) return []
  return json.posts.map(normalize)
}

export async function getCmsPostBySlug(slug) {
  const json = await safeFetch(`${API_BASE}/api/public/posts/${encodeURIComponent(slug)}?site=${SITE}`)
  if (!json?.post) return null
  return normalize(json.post)
}

export async function getCmsSurfaced() {
  const json = await safeFetch(`${API_BASE}/api/public/posts/surfaced?site=${SITE}&limit=12`)
  if (!json?.posts) return []
  return json.posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    cover_image: p.hero_image,
    canonical_url: p.canonical_url,
    canonical_label: p.canonical_label,
    published_at: p.published_at
  }))
}
