import FadeUp from '@/components/ui/FadeUp'
import BlogIndex from '@/components/blog/BlogIndex'
import { getAllPosts } from '@/lib/posts'
import { getOgImage } from '@/lib/getPageSeo'

export const revalidate = 3600

export async function generateMetadata() {
  const ogImage = await getOgImage('blog')
  return {
    title: { absolute: 'Wedding Planning Advice — Rixey Manor Blog' },
    description: 'Real couple stories and honest planning advice from a venue that has hosted 500+ weddings. No trends. No fluff. Just what actually works.',
    alternates: { canonical: 'https://www.rixeymanor.com/blog' },
    openGraph: {
      title: 'Wedding Planning Advice — Rixey Manor Blog',
      description: 'Real couple stories and honest planning advice from a venue that has hosted 500+ weddings. No trends. No fluff. Just what actually works.',
      url: 'https://www.rixeymanor.com/blog',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.rixeymanor.com/blog' },
  ],
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="bg-[var(--cream)] pt-40 pb-16 lg:pt-48 lg:pb-20 px-6 lg:px-10">
        <div className="max-w-3xl">
          <FadeUp>
            <p className="eyebrow mb-6">From the Manor</p>
            <h1
              className="text-[42px] lg:text-[58px] leading-[1.05] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Practical advice.<br />
              <em>Real stories.</em>
            </h1>
            <p className="body-copy max-w-xl">
              Written from a venue that has hosted hundreds of weddings since 2014.
              No sponsored content. No generic tips. Just what we have actually seen work.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[var(--warm-white)] py-16 lg:py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <BlogIndex posts={posts} />
        </div>
      </section>
    </>
  )
}
