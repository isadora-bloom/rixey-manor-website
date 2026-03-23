'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../layout'
import Image from 'next/image'
import { resizeImage } from '@/lib/resizeImage'

// All slots keyed by their exact ID used in getSiteImages()
const SLOT_CONFIG = {
  // Homepage
  'hero-homepage':             { label: 'Home hero',               aspect: '21/7', group: 'Homepage' },
  'home-spaces-ceremony':      { label: 'Home → Ceremony',         aspect: '4/3',  group: 'Homepage' },
  'home-spaces-ballroom':      { label: 'Home → Ballroom',         aspect: '4/3',  group: 'Homepage' },
  'home-spaces-terrace':       { label: 'Home → Terrace',          aspect: '4/3',  group: 'Homepage' },
  'home-spaces-bar':           { label: 'Home → Bar',              aspect: '4/3',  group: 'Homepage' },
  'home-team-isadora':         { label: 'Home → Isadora (story)',  aspect: '3/4',  group: 'Homepage' },
  'home-quiz-bg':              { label: 'Home → Quiz background',  aspect: '4/3',  group: 'Homepage' },
  // Venue
  'hero-venue':                { label: 'Venue hero',              aspect: '21/7', group: 'Venue' },
  'venue-spaces-ceremony':     { label: 'Ceremony space',          aspect: '4/3',  group: 'Venue' },
  'venue-spaces-ballroom':     { label: 'Ballroom',                aspect: '4/3',  group: 'Venue' },
  'venue-spaces-terrace':      { label: 'Terrace',                 aspect: '4/3',  group: 'Venue' },
  'venue-spaces-rooftop':      { label: 'Rooftop',                 aspect: '4/3',  group: 'Venue' },
  'venue-team-isadora':        { label: 'Team: Isadora',           aspect: '3/4',  group: 'Venue' },
  'venue-team-grace':          { label: 'Team: Grace',             aspect: '3/4',  group: 'Venue' },
  'venue-inclusions-accent':   { label: 'Inclusions: main photo',  aspect: '4/3',  group: 'Venue' },
  'venue-inclusions-2':        { label: 'Inclusions: photo 2',     aspect: '4/3',  group: 'Venue' },
  'venue-inclusions-3':        { label: 'Inclusions: photo 3',     aspect: '4/3',  group: 'Venue' },
  // Rooms — support multi-image gallery
  'venue-room-newlywed':       { label: 'Room: Newlywed Suite',    aspect: '4/3',  group: 'Rooms', extras: true },
  'venue-room-maple':          { label: 'Room: Maple Room',        aspect: '4/3',  group: 'Rooms', extras: true },
  'venue-room-mountain':       { label: 'Room: Mountain Room',     aspect: '4/3',  group: 'Rooms', extras: true },
  'venue-room-back':           { label: 'Room: Garden Room',       aspect: '4/3',  group: 'Rooms', extras: true },
  'venue-room-cottage':        { label: 'Room: Blacksmith Cottage', aspect: '4/3', group: 'Rooms', extras: true },
  // Pricing
  'pricing-banner':            { label: 'Pricing hero',            aspect: '21/7', group: 'Pricing' },
  'pricing-accent-inclusions': { label: 'Inclusions photo',        aspect: '4/3',  group: 'Pricing' },
  'pricing-inclusions-2':      { label: 'Inclusions photo 2',      aspect: '4/3',  group: 'Pricing' },
  'pricing-inclusions-3':      { label: 'Inclusions photo 3',      aspect: '4/3',  group: 'Pricing' },
  'pricing-accent-elopements': { label: 'Elopements photo',        aspect: '4/3',  group: 'Pricing' },
  'pricing-mid-strip':         { label: 'Mid-page strip',          aspect: '21/7', group: 'Pricing' },
  // Availability
  'availability-hero':         { label: 'Availability hero',       aspect: '21/7', group: 'Availability' },
  'availability-spring':       { label: 'Spring',                  aspect: '4/3',  group: 'Availability' },
  'availability-summer':       { label: 'Summer',                  aspect: '4/3',  group: 'Availability' },
  'availability-fall':         { label: 'Fall',                    aspect: '4/3',  group: 'Availability' },
  'availability-winter':       { label: 'Winter',                  aspect: '4/3',  group: 'Availability' },
  // FAQ
  'faq-banner':                { label: 'FAQ banner',              aspect: '21/7', group: 'FAQ' },
}

const POSITION_OPTIONS = [
  { value: 'center center', label: 'Center (default)' },
  { value: 'center top',    label: 'Top' },
  { value: 'center 20%',   label: 'Upper' },
  { value: 'center 35%',   label: 'Upper-mid' },
  { value: 'center 65%',   label: 'Lower-mid' },
  { value: 'center 80%',   label: 'Lower' },
  { value: 'center bottom', label: 'Bottom' },
  { value: 'left center',   label: 'Left' },
  { value: 'right center',  label: 'Right' },
  { value: 'left top',      label: 'Top-left' },
  { value: 'right top',     label: 'Top-right' },
]

const GROUPS = ['Homepage', 'Venue', 'Rooms', 'Pricing', 'Availability', 'FAQ']

function btnStyle(bg, color = 'white') {
  return {
    padding: '5px 12px', background: bg, color, border: 'none',
    cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 11,
    letterSpacing: '0.06em', flexShrink: 0,
  }
}

function ExtraImage({ extra, password, onDelete }) {
  async function del() {
    const res = await fetch('/api/admin/image-extras', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: extra.id }),
    })
    if (res.ok) onDelete(extra.id)
  }
  return (
    <div style={{ position: 'relative', width: 64, height: 48, flexShrink: 0 }}>
      <Image src={extra.url} alt={extra.alt_text || ''} fill style={{ objectFit: 'cover' }} sizes="64px" />
      <button
        onClick={del}
        title="Remove"
        style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, background: 'rgba(180,50,50,0.85)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  )
}

function ImageSlot({ slot, password, onUpdated }) {
  const cfg = SLOT_CONFIG[slot.id] || { label: slot.id, aspect: '4/3', group: 'Other' }
  const [uploading, setUploading]   = useState(false)
  const [editMeta, setEditMeta]     = useState(false)
  const [altVal, setAltVal]         = useState(slot.alt_text || '')
  const [posVal, setPosVal]         = useState(slot.object_position || 'center center')
  const [status, setStatus]         = useState('')
  const [extras, setExtras]         = useState([])
  const [extrasLoaded, setExtrasLoaded] = useState(false)
  const [uploadingExtra, setUploadingExtra] = useState(false)
  const fileRef = useRef()
  const extraFileRef = useRef()

  // Lazy-load extras for all slots
  function loadExtras() {
    if (extrasLoaded) return
    setExtrasLoaded(true)
    fetch(`/api/admin/image-extras?slot=${slot.id}`, { headers: { 'x-admin-password': password } })
      .then(r => r.json())
      .then(data => setExtras(Array.isArray(data) ? data : []))
  }

  useEffect(() => { loadExtras() }, []) // eslint-disable-line

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true); setStatus('uploading')
    try {
      const resized = await resizeImage(file)
      const form = new FormData()
      form.append('file', resized)
      form.append('path', `site/${slot.id}.webp`)
      const upRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: form,
      })
      if (!upRes.ok) throw new Error('Upload failed')
      const { url } = await upRes.json()

      // Auto-caption with Claude Vision
      setStatus('captioning')
      let autoAlt = ''
      try {
        const captureForm = new FormData()
        captureForm.append('file', resized)
        const capRes = await fetch('/api/admin/capture', {
          method: 'POST',
          headers: { 'x-admin-password': password },
          body: captureForm,
        })
        if (capRes.ok) {
          const analysis = await capRes.json()
          const suggestion = analysis.suggestions?.find(s => s.alt_text)
          autoAlt = suggestion?.alt_text || ''
        }
      } catch { /* caption is optional */ }

      const patchRes = await fetch('/api/admin/images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id: slot.id, url, ...(autoAlt && { alt_text: autoAlt }) }),
      })
      if (!patchRes.ok) {
        const err = await patchRes.json().catch(() => ({}))
        throw new Error('DB save failed: ' + (err.error || patchRes.status))
      }
      onUpdated(slot.id, { url, ...(autoAlt && { alt_text: autoAlt }) })
      if (autoAlt) setAltVal(autoAlt)
      setStatus(autoAlt ? 'saved-captioned' : 'saved')
      setTimeout(() => setStatus(''), 3000)
    } catch (err) {
      setStatus('error: ' + err.message)
    } finally {
      setUploading(false)
      fileRef.current.value = ''
    }
  }

  async function handleExtraFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadingExtra(true)
    try {
      const resized = await resizeImage(file)
      const ts   = Date.now()
      const form = new FormData()
      form.append('file', resized)
      form.append('path', `site/${slot.id}-extra-${ts}.webp`)
      const upRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: form,
      })
      if (!upRes.ok) throw new Error('Upload failed')
      const { url } = await upRes.json()

      // Auto-caption with Claude Vision
      let autoAlt = ''
      try {
        const captureForm = new FormData()
        captureForm.append('file', resized)
        const capRes = await fetch('/api/admin/capture', {
          method: 'POST',
          headers: { 'x-admin-password': password },
          body: captureForm,
        })
        if (capRes.ok) {
          const analysis = await capRes.json()
          const suggestion = analysis.suggestions?.find(s => s.alt_text)
          autoAlt = suggestion?.alt_text || ''
        }
      } catch { /* caption is optional */ }

      const addRes = await fetch('/api/admin/image-extras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ slot_id: slot.id, url, alt_text: autoAlt }),
      })
      if (!addRes.ok) {
        const err = await addRes.json().catch(() => ({}))
        throw new Error('DB save failed: ' + (err.error || addRes.status))
      }
      const newExtra = await addRes.json()
      setExtras(prev => [...prev, newExtra])
    } catch (err) {
      setStatus('extra upload error: ' + err.message)
    } finally {
      setUploadingExtra(false)
      extraFileRef.current.value = ''
    }
  }

  async function saveMeta() {
    await fetch('/api/admin/images', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: slot.id, alt_text: altVal, object_position: posVal }),
    })
    onUpdated(slot.id, { alt_text: altVal, object_position: posVal })
    setEditMeta(false)
  }

  // thumbnail dimensions based on aspect
  const [aspectW, aspectH] = cfg.aspect.split('/').map(Number)
  const thumbW = Math.round(120 * (aspectW / aspectH))
  const thumbH = 80

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', padding: 14, display: 'flex', gap: 14 }}>
      {/* Thumbnail — correct aspect ratio, showing object-position */}
      <div style={{ width: thumbW, height: thumbH, flexShrink: 0, background: 'var(--sage-light)', position: 'relative', overflow: 'hidden' }}>
        {slot.url ? (
          <Image
            src={slot.url}
            alt={slot.alt_text || cfg.label}
            fill
            style={{ objectFit: 'cover', objectPosition: slot.object_position || 'center center' }}
            sizes={`${thumbW}px`}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, color: 'var(--ink-light)', textAlign: 'center', padding: 4 }}>No image</span>
          </div>
        )}
      </div>

      {/* Info + controls */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 1 }}>{cfg.label}</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', marginBottom: 8 }}>{slot.id}</p>

        {editMeta ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
            <input
              value={altVal}
              onChange={e => setAltVal(e.target.value)}
              placeholder="Alt text (for SEO + accessibility)"
              style={{ padding: '5px 8px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 12, outline: 'none' }}
            />
            <select
              value={posVal}
              onChange={e => setPosVal(e.target.value)}
              style={{ padding: '5px 8px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 12, outline: 'none', background: 'white' }}
            >
              {POSITION_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {/* Position preview */}
            {slot.url && (
              <div style={{ position: 'relative', width: thumbW * 1.5, height: thumbH * 1.5, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Image
                  src={slot.url}
                  alt=""
                  fill
                  style={{ objectFit: 'cover', objectPosition: posVal }}
                  sizes={`${thumbW * 1.5}px`}
                />
                <span style={{ position: 'absolute', bottom: 3, left: 4, fontFamily: 'var(--font-ui)', fontSize: 9, color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.4)', padding: '1px 4px' }}>
                  preview
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveMeta} style={btnStyle('var(--forest)')}>Save</button>
              <button onClick={() => setEditMeta(false)} style={btnStyle('#e8e4de', 'var(--ink)')}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: cfg.extras ? 8 : 0 }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current.click()} disabled={uploading} style={btnStyle('var(--forest)')}>
              {uploading ? 'Uploading…' : slot.url ? 'Replace' : 'Upload'}
            </button>
            <button onClick={() => setEditMeta(true)} style={btnStyle('#e8e4de', 'var(--ink)')}>
              Alt / Position
            </button>
          </div>
        )}

        {status && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: status.startsWith('error') ? 'var(--rose)' : 'var(--forest)', marginBottom: 4 }}>
            {status === 'uploading' ? 'Uploading…' : status === 'captioning' ? 'Auto-captioning…' : status === 'saved-captioned' ? '✓ Saved · alt text auto-generated' : status === 'saved' ? '✓ Saved' : status}
          </p>
        )}

        {/* Multi-image extras */}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', marginBottom: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Extra photos ({extras.length}) — show as carousel with ‹ › arrows on the site
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', marginBottom: 6, opacity: 0.7 }}>
              Upload additional photos here. The main photo + these will cycle with arrows on the venue page.
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              {extras.map(ex => (
                <ExtraImage
                  key={ex.id}
                  extra={ex}
                  password={password}
                  onDelete={id => setExtras(prev => prev.filter(e => e.id !== id))}
                />
              ))}
              <input ref={extraFileRef} type="file" accept="image/*" onChange={handleExtraFile} style={{ display: 'none' }} />
              <button
                onClick={() => extraFileRef.current.click()}
                disabled={uploadingExtra}
                style={{ ...btnStyle('#e8e4de', 'var(--ink)'), fontSize: 10, padding: '4px 10px' }}
              >
                {uploadingExtra ? '…' : '+ Add photo'}
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default function ImagesPage() {
  const { password } = useAdmin()
  const [slots, setSlots]     = useState([])
  const [loading, setLoading] = useState(true)
  const [group, setGroup]     = useState('Homepage')

  useEffect(() => {
    fetch('/api/admin/images', { headers: { 'x-admin-password': password } })
      .then(r => r.json())
      .then(data => {
        // Merge known config with DB rows; create placeholders for known slots not yet in DB
        const dbMap = {}
        ;(Array.isArray(data) ? data : []).forEach(s => { dbMap[s.id] = s })
        const merged = Object.keys(SLOT_CONFIG).map(id => dbMap[id] || { id, url: null, alt_text: '', object_position: '' })
        setSlots(merged)
        setLoading(false)
      })
  }, [password])

  function handleUpdated(id, fields) {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s))
  }

  const grouped = slots.filter(s => (SLOT_CONFIG[s.id]?.group || 'Other') === group)

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>Images</h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 20 }}>
        Upload photos for each slot. Thumbnails show the actual crop and position. Room slots support multiple photos (gallery arrows on the venue page).
      </p>

      {/* Group tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        {GROUPS.map(g => {
          const filled = slots.filter(s => (SLOT_CONFIG[s.id]?.group || 'Other') === g && s.url).length
          const total  = slots.filter(s => (SLOT_CONFIG[s.id]?.group || 'Other') === g).length
          return (
            <button
              key={g}
              onClick={() => setGroup(g)}
              style={{
                padding: '8px 16px',
                background: group === g ? 'var(--forest)' : 'transparent',
                color: group === g ? 'white' : 'var(--ink-light)',
                border: 'none',
                borderBottom: group === g ? '2px solid var(--forest)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                whiteSpace: 'nowrap',
              }}
            >
              {g} <span style={{ opacity: 0.7 }}>({filled}/{total})</span>
            </button>
          )
        })}
      </div>

      {loading && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>Loading…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {grouped.map(slot => (
          <ImageSlot key={slot.id} slot={slot} password={password} onUpdated={handleUpdated} />
        ))}
      </div>
    </div>
  )
}
