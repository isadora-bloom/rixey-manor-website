'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../layout'
import Image from 'next/image'

const SLOT_LABELS = {
  'venue-hero':              'Venue page hero',
  'home-hero':               'Home page hero',
  'home-spaces-ceremony':    'Home → Ceremony space',
  'home-spaces-terrace':     'Home → Terrace space',
  'home-spaces-ballroom':    'Home → Ballroom space',
  'home-spaces-bar':         'Home → Bar section',
  'home-quiz-bg':            'Home → Quiz section background',
  'venue-room-newlywed':     'Room: Newlywed Suite',
  'venue-room-maple':        'Room: Maple Room',
  'venue-room-mountain':     'Room: Mountain Room',
  'venue-room-back':         'Room: Garden Room',
  'venue-room-cottage':      'Room: Blacksmith Cottage',
  'venue-team-isadora':      'Team: Isadora',
  'venue-team-grace':        'Team: Grace',
  'venue-story-isadora':     'Story section: Isadora photo',
  'availability-hero':       'Availability: Hero (page top)',
  'availability-spring':     'Availability: Spring',
  'availability-summer':     'Availability: Summer',
  'availability-fall':       'Availability: Fall',
  'availability-winter':     'Availability: Winter',
}

function ImageSlot({ slot, password, onUpdated }) {
  const [uploading, setUploading] = useState(false)
  const [editAlt, setEditAlt]     = useState(false)
  const [altVal, setAltVal]       = useState(slot.alt_text || '')
  const [posVal, setPosVal]       = useState(slot.object_position || 'center center')
  const [status, setStatus]       = useState('')
  const fileRef = useRef()

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setStatus('')
    try {
      const ext  = file.name.split('.').pop()
      const path = `site/${slot.id}.${ext}`
      const form = new FormData()
      form.append('file', file)
      form.append('path', path)
      const upRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: form,
      })
      if (!upRes.ok) throw new Error('Upload failed')
      const { url } = await upRes.json()

      const patchRes = await fetch('/api/admin/images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id: slot.id, url }),
      })
      if (!patchRes.ok) throw new Error('Save failed')
      onUpdated(slot.id, { url })
      setStatus('saved')
      setTimeout(() => setStatus(''), 2000)
    } catch (err) {
      setStatus('error: ' + err.message)
    } finally {
      setUploading(false)
      fileRef.current.value = ''
    }
  }

  async function saveAlt() {
    const res = await fetch('/api/admin/images', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: slot.id, alt_text: altVal, object_position: posVal }),
    })
    if (res.ok) { onUpdated(slot.id, { alt_text: altVal, object_position: posVal }); setEditAlt(false) }
  }

  const label = SLOT_LABELS[slot.id] || slot.id

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', padding: 16, display: 'flex', gap: 16 }}>
      {/* Thumbnail */}
      <div style={{ width: 100, height: 75, flexShrink: 0, background: 'var(--sage-light)', position: 'relative', overflow: 'hidden' }}>
        {slot.url ? (
          <Image src={slot.url} alt={slot.alt_text || label} fill style={{ objectFit: 'cover' }} sizes="100px" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', textAlign: 'center', padding: 4 }}>No image</span>
          </div>
        )}
      </div>

      {/* Info + controls */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {slot.id}
        </p>

        {editAlt ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
            <input value={altVal} onChange={e => setAltVal(e.target.value)} placeholder="Alt text"
              style={{ padding: '5px 8px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 12, outline: 'none' }} />
            <input value={posVal} onChange={e => setPosVal(e.target.value)} placeholder="Object position (e.g. center 30%)"
              style={{ padding: '5px 8px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 12, outline: 'none' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveAlt} style={btnStyle('var(--forest)')}>Save</button>
              <button onClick={() => setEditAlt(false)} style={btnStyle('var(--border)', 'var(--ink)')}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current.click()} disabled={uploading} style={btnStyle('var(--forest)')}>
              {uploading ? 'Uploading…' : 'Replace image'}
            </button>
            <button onClick={() => setEditAlt(true)} style={btnStyle('#f0f0f0', 'var(--ink)')}>Edit alt / position</button>
          </div>
        )}

        {status && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: status.startsWith('error') ? 'var(--rose)' : 'var(--forest)', marginTop: 4 }}>
            {status === 'saved' ? '✓ Saved' : status}
          </p>
        )}
      </div>
    </div>
  )
}

function btnStyle(bg, color = 'white') {
  return { padding: '5px 12px', background: bg, color, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.06em' }
}

export default function ImagesPage() {
  const { password } = useAdmin()
  const [slots, setSlots]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/images', { headers: { 'x-admin-password': password } })
      .then(r => r.json())
      .then(data => { setSlots(Array.isArray(data) ? data : []); setLoading(false) })
  }, [password])

  function handleUpdated(id, fields) {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s))
  }

  const knownIds = Object.keys(SLOT_LABELS)
  const known    = slots.filter(s => knownIds.includes(s.id)).sort((a, b) => knownIds.indexOf(a.id) - knownIds.indexOf(b.id))
  const other    = slots.filter(s => !knownIds.includes(s.id)).sort((a, b) => a.id.localeCompare(b.id))

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>Images</h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 32 }}>
        Replace any named image slot. Upload a new file to swap it out instantly.
      </p>

      {loading && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>Loading…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[...known, ...other].map(slot => (
          <ImageSlot key={slot.id} slot={slot} password={password} onUpdated={handleUpdated} />
        ))}
      </div>
    </div>
  )
}
