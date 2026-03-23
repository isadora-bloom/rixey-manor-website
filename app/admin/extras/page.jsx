'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../layout'
import Image from 'next/image'
import { resizeImage } from '@/lib/resizeImage'

const BLANK = { title: '', description: '', quote: '', image_url: '' }

function btn(bg, color = 'white') {
  return {
    padding: '6px 14px', background: bg, color, border: 'none',
    cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 11,
    letterSpacing: '0.06em', flexShrink: 0,
  }
}

function ExtraRow({ extra, password, onUpdate, onDelete, onMove, isFirst, isLast }) {
  const [open, setOpen]         = useState(false)
  const [form, setForm]         = useState({ title: extra.title, description: extra.description || '', quote: extra.quote || '', image_url: extra.image_url || '' })
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus]     = useState('')
  const fileRef = useRef()

  function field(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })) }

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/extras', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: extra.id, ...form }),
    })
    if (res.ok) { onUpdate(extra.id, form); setOpen(false) }
    else setStatus('Save failed')
    setSaving(false)
  }

  async function toggleActive() {
    const res = await fetch('/api/admin/extras', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: extra.id, active: !extra.active }),
    })
    if (res.ok) onUpdate(extra.id, { active: !extra.active })
  }

  async function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true); setStatus('Uploading…')
    try {
      const resized = await resizeImage(file)
      const form2 = new FormData()
      form2.append('file', resized)
      form2.append('path', `extras/${extra.id}-${Date.now()}.webp`)
      const upRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: form2,
      })
      if (!upRes.ok) throw new Error('Upload failed')
      const { url } = await upRes.json()
      const patchRes = await fetch('/api/admin/extras', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id: extra.id, image_url: url }),
      })
      if (!patchRes.ok) throw new Error('Save failed')
      setForm(f => ({ ...f, image_url: url }))
      onUpdate(extra.id, { image_url: url })
      setStatus('✓ Photo saved')
      setTimeout(() => setStatus(''), 2500)
    } catch (err) {
      setStatus('Error: ' + err.message)
    } finally {
      setUploading(false)
      fileRef.current.value = ''
    }
  }

  async function removeImage() {
    const res = await fetch('/api/admin/extras', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: extra.id, image_url: null }),
    })
    if (res.ok) { setForm(f => ({ ...f, image_url: '' })); onUpdate(extra.id, { image_url: null }) }
  }

  async function del() {
    if (!confirm(`Delete "${extra.title}"?`)) return
    const res = await fetch('/api/admin/extras', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: extra.id }),
    })
    if (res.ok) onDelete(extra.id)
  }

  const img = form.image_url || extra.image_url

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', marginBottom: 6 }}>
      {/* Row header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
        {/* Sort arrows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
          <button onClick={() => onMove(extra.id, -1)} disabled={isFirst}
            style={{ padding: '1px 5px', fontSize: 9, background: '#e8e4de', border: 'none', cursor: isFirst ? 'default' : 'pointer', opacity: isFirst ? 0.3 : 1 }}>▲</button>
          <button onClick={() => onMove(extra.id, 1)} disabled={isLast}
            style={{ padding: '1px 5px', fontSize: 9, background: '#e8e4de', border: 'none', cursor: isLast ? 'default' : 'pointer', opacity: isLast ? 0.3 : 1 }}>▼</button>
        </div>

        {/* Thumbnail */}
        <div style={{ width: 48, height: 36, background: 'var(--sage-light)', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          {img && <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="48px" />}
        </div>

        {/* Title + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: extra.active ? 'var(--ink)' : 'var(--ink-light)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {extra.title}
          </p>
          {!extra.active && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', margin: 0 }}>Hidden</p>}
        </div>

        {/* Actions */}
        <button onClick={toggleActive} style={btn(extra.active ? '#e8e4de' : 'var(--forest)', extra.active ? 'var(--ink)' : 'white')}>
          {extra.active ? 'Hide' : 'Show'}
        </button>
        <button onClick={() => setOpen(o => !o)} style={btn('#e8e4de', 'var(--ink)')}>
          {open ? 'Close' : 'Edit'}
        </button>
        <button onClick={del} style={btn('#b84040')}>Delete</button>
      </div>

      {/* Edit panel */}
      {open && (
        <div style={{ padding: '14px 16px 18px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: 4 }}>Title</label>
            <input value={form.title} onChange={field('title')}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea value={form.description} onChange={field('description')} rows={3}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: 4 }}>Review quote (optional)</label>
            <textarea value={form.quote} onChange={field('quote')} rows={2}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          {/* Image */}
          <div>
            <label style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: 6 }}>Photo</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {img && (
                <div style={{ position: 'relative', width: 80, height: 60, overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="80px" />
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              <button onClick={() => fileRef.current.click()} disabled={uploading} style={btn('var(--forest)')}>
                {uploading ? 'Uploading…' : img ? 'Replace photo' : 'Upload photo'}
              </button>
              {img && <button onClick={removeImage} style={btn('#e8e4de', 'var(--ink)')}>Remove</button>}
              {status && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: status.startsWith('Error') ? 'var(--rose)' : 'var(--forest)' }}>{status}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button onClick={save} disabled={saving} style={btn('var(--forest)')}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button onClick={() => setOpen(false)} style={btn('#e8e4de', 'var(--ink)')}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

function AddForm({ password, onAdded }) {
  const [open, setOpen]     = useState(false)
  const [form, setForm]     = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function field(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })) }

  async function save() {
    if (!form.title.trim()) { setError('Title required'); return }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/extras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newExtra = await res.json()
      onAdded(newExtra)
      setForm(BLANK)
      setOpen(false)
    } else {
      setError('Failed to add')
    }
    setSaving(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{ ...btn('var(--forest)'), padding: '8px 18px', fontSize: 12, marginBottom: 20 }}>
        + Add new extra
      </button>
    )
  }

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 20 }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 12 }}>New extra</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[['title', 'Title', 'input'], ['description', 'Description', 'textarea'], ['quote', 'Review quote (optional)', 'textarea']].map(([k, label, type]) => (
          <div key={k}>
            <label style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: 4 }}>{label}</label>
            {type === 'textarea'
              ? <textarea value={form[k]} onChange={field(k)} rows={2} style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              : <input value={form[k]} onChange={field(k)} style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            }
          </div>
        ))}
        {error && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--rose)' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={save} disabled={saving} style={btn('var(--forest)')}>{saving ? 'Adding…' : 'Add'}</button>
          <button onClick={() => { setOpen(false); setForm(BLANK) }} style={btn('#e8e4de', 'var(--ink)')}>Cancel</button>
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', margin: 0 }}>
          You can upload a photo after adding.
        </p>
      </div>
    </div>
  )
}

export default function ExtrasAdminPage() {
  const { password } = useAdmin()
  const [extras, setExtras]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/extras', { headers: { 'x-admin-password': password } })
      .then(r => r.json())
      .then(data => { setExtras(Array.isArray(data) ? data : []); setLoading(false) })
  }, [password])

  function handleUpdate(id, fields) {
    setExtras(prev => prev.map(e => e.id === id ? { ...e, ...fields } : e))
  }

  function handleDelete(id) {
    setExtras(prev => prev.filter(e => e.id !== id))
  }

  function handleAdded(extra) {
    setExtras(prev => [...prev, extra])
  }

  async function handleMove(id, dir) {
    const idx = extras.findIndex(e => e.id === id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= extras.length) return

    const a = extras[idx]
    const b = extras[swapIdx]

    // Swap sort_orders
    const newExtras = extras.map(e => {
      if (e.id === a.id) return { ...e, sort_order: b.sort_order }
      if (e.id === b.id) return { ...e, sort_order: a.sort_order }
      return e
    }).sort((x, y) => x.sort_order - y.sort_order)

    setExtras(newExtras)

    // Persist both
    await Promise.all([
      fetch('/api/admin/extras', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ id: a.id, sort_order: b.sort_order }) }),
      fetch('/api/admin/extras', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ id: b.id, sort_order: a.sort_order }) }),
    ])
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>Only at Rixey</h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 24 }}>
        Manage the extras shown on <strong>/extras</strong>. Use ▲▼ to reorder. Hide to remove from the site without deleting.
      </p>

      {loading && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>Loading…</p>}

      <AddForm password={password} onAdded={handleAdded} />

      {extras.map((extra, i) => (
        <ExtraRow
          key={extra.id}
          extra={extra}
          password={password}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onMove={handleMove}
          isFirst={i === 0}
          isLast={i === extras.length - 1}
        />
      ))}
    </div>
  )
}
