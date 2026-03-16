'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '../layout'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

function PostRow({ post, password, onUpdated }) {
  const router = useRouter()
  const [published, setPublished] = useState(post.published)
  const [toggling, setToggling]   = useState(false)

  async function togglePublished() {
    setToggling(true)
    const newVal = !published
    await fetch('/api/admin/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: post.id, published: newVal }),
    })
    setPublished(newVal)
    onUpdated(post.id, { published: newVal })
    setToggling(false)
  }

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
      {/* Cover */}
      <div style={{ width: 80, height: 54, flexShrink: 0, background: 'var(--sage-light)', position: 'relative', overflow: 'hidden' }}>
        {post.cover_image ? (
          <Image src={post.cover_image} alt={post.title} fill style={{ objectFit: 'cover' }} sizes="80px" />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, color: 'var(--ink-light)' }}>No cover</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {post.title}
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          /blog/{post.slug}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => router.push(`/admin/blog/${post.id}`)}
          style={btnStyle('#f0f0f0', 'var(--ink)')}
        >
          Edit
        </button>
        <button
          onClick={togglePublished}
          disabled={toggling}
          style={btnStyle(published ? '#2E7D54' : '#b0956a')}
        >
          {toggling ? '…' : published ? 'Published' : 'Draft'}
        </button>
      </div>
    </div>
  )
}

function btnStyle(bg, color = 'white') {
  return { padding: '6px 14px', background: bg, color, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12 }
}

export default function BlogPage() {
  const { password } = useAdmin()
  const router = useRouter()
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/blog', { headers: { 'x-admin-password': password } })
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
  }, [password])

  function handleUpdated(id, fields) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p))
  }

  const published = posts.filter(p => p.published)
  const drafts    = posts.filter(p => !p.published)

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 4 }}>Blog</h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>
            {published.length} published · {drafts.length} drafts
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/blog/new')}
          style={{ ...btnStyle('var(--forest)'), marginLeft: 'auto' }}
        >
          + New post
        </button>
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>Loading…</p>}

      {published.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 10 }}>Published</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {published.map(post => <PostRow key={post.id} post={post} password={password} onUpdated={handleUpdated} />)}
          </div>
        </div>
      )}

      {drafts.length > 0 && (
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 10 }}>Drafts</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {drafts.map(post => <PostRow key={post.id} post={post} password={password} onUpdated={handleUpdated} />)}
          </div>
        </div>
      )}
    </div>
  )
}
