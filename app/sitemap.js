import { supabaseServer } from '@/lib/supabaseServer'
const supabase = supabaseServer()

export default async function sitemap() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, post_date')
    .eq('published', true)
    .order('post_date', { ascending: false })

  const staticPages = [
    { url: 'https://www.rixeymanor.com',          lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: 'https://www.rixeymanor.com/venue',     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.rixeymanor.com/pricing',   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.rixeymanor.com/gallery',   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: 'https://www.rixeymanor.com/faq',       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.rixeymanor.com/availability', lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: 'https://www.rixeymanor.com/quiz',        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.rixeymanor.com/blog',        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: 'https://www.rixeymanor.com/app',         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const blogPages = (posts || []).map(post => ({
    url: `https://www.rixeymanor.com/blog/${post.slug}`,
    lastModified: post.post_date ? new Date(post.post_date) : new Date(),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
