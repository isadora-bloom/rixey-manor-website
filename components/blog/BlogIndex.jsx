'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_LABELS } from '@/lib/posts'

const ALL = 'all'

function PostCard({ post, large = false }) {
  const label = CATEGORY_LABELS[post.category] || post.category
  const date = new Date(post.post_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  })

  if (large) {
    return (
      <Link href={`/blog/${post.slug}`} className="no-underline group block">
        {post.cover_image && (
          <div className="relative w-full aspect-[16/7] overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}
        <div className="bg-[var(--cream)] p-10 lg:p-14">
          <p
            className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-4"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {label} · {date}
          </p>
          <h2
            className="text-[28px] lg:text-[38px] leading-[1.15] text-[var(--ink)] mb-5 group-hover:text-[var(--forest)] transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="body-copy text-[16px] max-w-2xl mb-6">{post.excerpt}</p>
          )}
          <span className="text-link">Read →</span>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="no-underline group block">
      {post.cover_image && (
        <div className="relative w-full aspect-[3/2] overflow-hidden mb-5">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      )}
      <div className="border-t border-[var(--border)] pt-7 pb-8">
        <p
          className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-3"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {label} · {date}
        </p>
        <h3
          className="text-[20px] lg:text-[22px] leading-[1.2] text-[var(--ink)] mb-3 group-hover:text-[var(--forest)] transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="body-copy text-[15px] mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        <span className="text-link">Read →</span>
      </div>
    </Link>
  )
}

export default function BlogIndex({ posts }) {
  const [active, setActive] = useState(ALL)

  const categories = [ALL, ...Array.from(new Set(posts.map(p => p.category)))]

  const filtered = active === ALL
    ? posts
    : posts.filter(p => p.category === active)

  const featured = filtered.find(p => p.featured)
  const rest = filtered.filter(p => !p.featured || active !== ALL)
  const listPosts = featured && active === ALL ? rest : filtered

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map(cat => {
          const label = cat === ALL ? 'All Posts' : (CATEGORY_LABELS[cat] || cat)
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase transition-colors duration-200 ${
                active === cat
                  ? 'bg-[var(--forest)] text-white'
                  : 'bg-[var(--cream)] text-[var(--ink-light)] hover:text-[var(--ink)]'
              }`}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Featured post */}
      {featured && active === ALL && (
        <div className="mb-10">
          <PostCard post={featured} large />
        </div>
      )}

      {/* Post grid */}
      {listPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
          {listPosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="body-copy text-[var(--ink-light)]">No posts in this category yet.</p>
      )}
    </div>
  )
}
