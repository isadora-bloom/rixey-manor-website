import { supabaseServer } from '@/lib/supabaseServer'
import { getCmsPosts } from '@/lib/cms'

const supabase = supabaseServer()

export default async function sitemap() {
  const [legacyRes, cmsPosts] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('slug, post_date')
      .eq('published', true)
      .order('post_date', { ascending: false }),
    getCmsPosts()
  ])

  const staticPages = [
    { url: 'https://www.rixeymanor.com',          lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: 'https://www.rixeymanor.com/venue',     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.rixeymanor.com/pricing',   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.rixeymanor.com/what-it-costs', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: 'https://www.rixeymanor.com/gallery',   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: 'https://www.rixeymanor.com/faq',       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.rixeymanor.com/availability', lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: 'https://www.rixeymanor.com/extras',      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.rixeymanor.com/compare',     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.rixeymanor.com/quiz',        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.rixeymanor.com/blog',        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: 'https://www.rixeymanor.com/app',         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Merge legacy + CMS posts into the sitemap. CMS-canonical posts only;
  // surfaced posts (canonical to other sites) belong in those sites' sitemaps.
  const seen = new Set()
  const blogPages = []
  for (const list of [cmsPosts, legacyRes.data || []]) {
    for (const post of list) {
      if (seen.has(post.slug)) continue
      seen.add(post.slug)
      blogPages.push({
        url: `https://www.rixeymanor.com/blog/${post.slug}`,
        lastModified: post.post_date ? new Date(post.post_date) : new Date(),
        changeFrequency: 'yearly',
        priority: 0.6,
      })
    }
  }

  return [...staticPages, ...blogPages]
}
