'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../../layout'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

const POSITION_PRESETS = [
  'center center', 'center top', 'center bottom',
  'center 20%', 'center 30%', 'center 40%', 'center 60%', 'center 70%',
  'left center', 'right center',
]

export default function BlogEditorPage() {
  const { password } = useAdmin()
  const { id }       = useParams()
  const router       = useRouter()
  const isNew        = id === 'new'
  const fileRef      = useRef()

  const [post, setPost]           = useState(null)
  const [loading, setLoading]     = useState(!isNew)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus]       = useState('')  // '' | 'saved' | 'error: ...'
  const [preview, setPreview]     = useState(false)

  // Editable fields
  const [title, setTitle]     = useState('')
  const [slug, setSlug]       = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverUrl, setCoverUrl]   = useState('')
  const [coverPos, setCoverPos]   = useState('center center')
  const [published, setPublished] = useState(false)
  const [author, setAuthor]   = useState('Isadora Martin-Dye')

  useEffect(() => {
    if (isNew) return
    fetch(`/api/admin/blog?id=${id}`, { headers: { 'x-admin-password': password } })
      .then(r => r.json())
      .then(data => {
        setPost(data)
        setTitle(data.title || '')
        setSlug(data.slug || '')
        setExcerpt(data.excerpt || '')
        setContent(data.content || '')
        setCoverUrl(data.cover_image || '')
        setCoverPos(data.cover_image_position || 'center center')
        setPublished(data.published || false)
        setAuthor(data.author || 'Isadora Martin-Dye')
        setLoading(false)
      })
  }, [id, password, isNew])

  function autoSlug(val) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleTitleChange(val) {
    setTitle(val)
    if (isNew) setSlug(autoSlug(val))
  }

  async function handleCoverFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('path', `blog/${slug || 'post'}-cover.${file.name.split('.').pop()}`)
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-password': password },
      body: form,
    })
    if (res.ok) {
      const { url } = await res.json()
      setCoverUrl(url)
    }
    setUploading(false)
    fileRef.current.value = ''
  }

  async function save(publishOverride) {
    setSaving(true)
    setStatus('')
    const body = {
      title, slug, excerpt, content,
      cover_image: coverUrl,
      cover_image_position: coverPos,
      published: publishOverride !== undefined ? publishOverride : published,
      author,
    }

    let res
    if (isNew) {
      res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const { id: newId } = await res.json()
        router.replace(`/admin/blog/${newId}`)
      }
    } else {
      res = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id, ...body }),
      })
    }

    if (res.ok) {
      if (publishOverride !== undefined) setPublished(publishOverride)
      setStatus('saved')
      setTimeout(() => setStatus(''), 2500)
    } else {
      const err = await res.json().catch(() => ({}))
      setStatus('error: ' + (err.error || res.status))
    }
    setSaving(false)
  }

  if (loading) return <p style={labelStyle}>Loading…</p>

  return (
    <div style={{ maxWidth: 900, paddingBottom: 80 }}>

      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <button onClick={() => router.push('/admin/blog')} style={btnStyle('#f0f0f0', 'var(--ink)')}>
          ← All posts
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', flex: 1, margin: 0 }}>
          {isNew ? 'New post' : title || 'Edit post'}
        </h1>
        {status && (
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: status.startsWith('error') ? 'var(--rose)' : 'var(--forest)' }}>
            {status === 'saved' ? '✓ Saved' : status}
          </span>
        )}
        <button onClick={() => save()} disabled={saving} style={btnStyle('var(--forest)')}>
          {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button
          onClick={() => save(!published)}
          disabled={saving}
          style={btnStyle(published ? '#b0956a' : '#2E7D54')}
        >
          {published ? 'Unpublish' : 'Publish'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <Field label="Title">
            <input value={title} onChange={e => handleTitleChange(e.target.value)} style={inputStyle} placeholder="Post title" />
          </Field>

          <Field label="Slug (URL)">
            <input value={slug} onChange={e => setSlug(e.target.value)} style={inputStyle} placeholder="url-friendly-slug" />
            {slug && <p style={{ ...labelStyle, marginTop: 4 }}>/blog/{slug}</p>}
          </Field>

          <Field label="Excerpt (shown in listings)">
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="One or two sentences about this post…" />
          </Field>

          <Field label={
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              Content
              <button onClick={() => setPreview(p => !p)} style={{ ...btnStyle('#f0f0f0', 'var(--ink)'), padding: '3px 10px', fontSize: 11 }}>
                {preview ? 'Edit' : 'Preview'}
              </button>
            </span>
          }>
            {preview ? (
              <div
                className="body-copy"
                style={{ minHeight: 400, padding: '16px', background: 'white', border: '1px solid var(--border)', lineHeight: 1.8, fontSize: 15 }}
                dangerouslySetInnerHTML={{ __html: content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>').replace(/^/, '<p>').replace(/$/, '</p>') }}
              />
            ) : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{ ...inputStyle, minHeight: 500, resize: 'vertical', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }}
                placeholder="Write your post here. HTML is supported. Use blank lines to separate paragraphs."
              />
            )}
          </Field>

        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Status */}
          <SidePanel title="Status">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: published ? '#2E7D54' : '#b0956a', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink)' }}>
                {published ? 'Published' : 'Draft'}
              </span>
            </div>
            {!isNew && post?.created_at && (
              <p style={{ ...labelStyle, marginTop: 6 }}>
                Created {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </SidePanel>

          {/* Author */}
          <SidePanel title="Author">
            <input value={author} onChange={e => setAuthor(e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
          </SidePanel>

          {/* Cover image */}
          <SidePanel title="Cover image">
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'var(--sage-light)', marginBottom: 10, overflow: 'hidden' }}>
              {coverUrl ? (
                <Image src={coverUrl} alt="Cover" fill style={{ objectFit: 'cover', objectPosition: coverPos }} sizes="280px" />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <span style={labelStyle}>No image</span>
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverFile} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current.click()} disabled={uploading} style={{ ...btnStyle('var(--forest)'), width: '100%', marginBottom: 10 }}>
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>

            <label style={labelStyle}>Or paste URL</label>
            <input value={coverUrl} onChange={e => setCoverUrl(e.target.value)} style={{ ...inputStyle, fontSize: 12, marginTop: 4 }} placeholder="https://…" />

            <label style={{ ...labelStyle, display: 'block', marginTop: 12, marginBottom: 4 }}>Image position</label>
            <select value={coverPos} onChange={e => setCoverPos(e.target.value)}
              style={{ ...inputStyle, fontSize: 12 }}>
              {POSITION_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={coverPos} onChange={e => setCoverPos(e.target.value)} style={{ ...inputStyle, fontSize: 12, marginTop: 6 }} placeholder="Custom: e.g. center 35%" />
          </SidePanel>

        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', ...labelStyle, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function SidePanel({ title, children }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', padding: 14 }}>
      <p style={{ ...labelStyle, marginBottom: 10 }}>{title}</p>
      {children}
    </div>
  )
}

const labelStyle = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: 0 }
const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 14, outline: 'none', background: 'white', boxSizing: 'border-box' }

function btnStyle(bg, color = 'white') {
  return { padding: '7px 14px', background: bg, color, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.06em', flexShrink: 0 }
}
