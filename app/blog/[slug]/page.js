import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs, renderMarkdown, formatDate, CATEGORY_LABELS } from '@/lib/posts'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} — Rixey Manor`,
    description: post.excerpt || undefined,
    alternates: { canonical: `https://www.rixeymanor.com/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} — Rixey Manor`,
      description: post.excerpt || undefined,
      url: `https://www.rixeymanor.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.post_date,
      ...(post.cover_image && { images: [{ url: post.cover_image, width: 1200, height: 630 }] }),
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const html = renderMarkdown(post.content)
  const label = CATEGORY_LABELS[post.category] || post.category
  const date = formatDate(post.post_date)
  const readTime = Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.post_date,
    dateModified: post.post_date,
    image: post.cover_image || 'https://www.rixeymanor.com/assets/rixey-manor-logo.png',
    author: {
      '@type': 'Person',
      name: post.author || 'Isadora Martin-Dye',
      url: 'https://www.rixeymanor.com/venue#team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rixey Manor',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.rixeymanor.com/assets/rixey-manor-logo.png',
      },
    },
    url: `https://www.rixeymanor.com/blog/${post.slug}`,
    mainEntityOfPage: `https://www.rixeymanor.com/blog/${post.slug}`,
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.rixeymanor.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.rixeymanor.com/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <article>
        {/* Header */}
        <header className="bg-[var(--cream)] pt-40 pb-12 lg:pt-48 lg:pb-16 px-6 lg:px-10">
          <div className="max-w-2xl">
            <p
              className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-5"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {label} · {date} · {readTime} min read
            </p>
            <h1
              className="text-[34px] lg:text-[48px] leading-[1.1] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="body-copy text-[18px] max-w-xl">{post.excerpt}</p>
            )}
          </div>
        </header>

        {/* Cover image */}
        {post.cover_image && (
          <div className="relative w-full aspect-[16/7] bg-[var(--cream)]">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Body */}
        <div className="bg-[var(--warm-white)] py-12 lg:py-16 px-6 lg:px-10">
          <div
            className="blog-prose max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Footer nav */}
        <div className="bg-[var(--warm-white)] pb-16 px-6 lg:px-10 border-t border-[var(--border)]">
          <div className="max-w-2xl mx-auto pt-8 flex items-center justify-between">
            <Link href="/blog" className="text-link">
              ← All posts
            </Link>
            <div className="flex gap-6">
              <Link href="/venue" className="text-link">The Venue</Link>
              <Link href="/pricing" className="text-link">Pricing</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
