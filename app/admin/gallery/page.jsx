'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAdmin } from '../layout'
import Image from 'next/image'
import { resizeImage } from '@/lib/resizeImage'

const SCENE_OPTIONS = [
  { value: '',              label: 'All tags'        },
  { value: 'ceremony',      label: 'Ceremony'        },
  { value: 'reception',     label: 'Reception'       },
  { value: 'portraits',     label: 'Portraits'       },
  { value: 'getting-ready', label: 'Getting Ready'   },
  { value: 'detail',        label: 'Details'         },
  { value: 'venue',         label: 'Venue / Grounds' },
  { value: 'other',         label: 'Other'           },
]

const SCENE_LABELS = Object.fromEntries(SCENE_OPTIONS.filter(o => o.value).map(o => [o.value, o.label]))

function qualityStars(q) {
  const n = Math.round(Number(q) / 20) || 0
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

function PhotoCard({ photo, password, onUpdate }) {
  const [toggling, setToggling]   = useState(false)
  const [editing, setEditing]     = useState(false)
  const [sceneVal, setSceneVal]   = useState(photo.scene_type || '')
  const [altVal, setAltVal]       = useState(photo.alt_text || '')
  const [saving, setSaving]       = useState(false)

  async function toggleActive() {
    setToggling(true)
    const res = await fetch('/api/admin/gallery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: photo.id, active: !photo.active }),
    })
    if (res.ok) onUpdate(photo.id, { active: !photo.active })
    setToggling(false)
  }

  async function saveMeta() {
    setSaving(true)
    const res = await fetch('/api/admin/gallery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: photo.id, scene_type: sceneVal, alt_text: altVal }),
    })
    if (res.ok) { onUpdate(photo.id, { scene_type: sceneVal, alt_text: altVal }); setEditing(false) }
    setSaving(false)
  }

  const stars = qualityStars(photo.quality)
  const sceneLabel = SCENE_LABELS[photo.scene_type] || photo.scene_type || 'Untagged'

  return (
    <div style={{ position: 'relative', background: 'var(--sage-light)', overflow: 'visible' }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <Image
          src={photo.url}
          alt={photo.alt_text || photo.label || ''}
          fill
          style={{ objectFit: 'cover', opacity: photo.active ? 1 : 0.3, transition: 'opacity 0.2s' }}
          sizes="200px"
        />

        {/* Quality stars */}
        <div title={`Quality: ${photo.quality}/100`} style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.55)', color: photo.quality >= 70 ? '#8ecfa0' : photo.quality >= 40 ? '#e8d080' : '#e89090', fontFamily: 'monospace', fontSize: 10, padding: '2px 5px', letterSpacing: 1 }}>
          {stars}
        </div>

        {/* Show/Hide button */}
        <button
          onClick={toggleActive}
          disabled={toggling}
          title={photo.active ? 'Click to hide' : 'Click to show'}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 5, opacity: 0, transition: 'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}
        >
          <span style={{ background: photo.active ? '#b84040' : '#2E7D54', color: 'white', fontFamily: 'var(--font-ui)', fontSize: 11, padding: '3px 10px' }}>
            {toggling ? '…' : photo.active ? 'Hide' : 'Show'}
          </span>
        </button>
      </div>

      {/* Tag + edit row */}
      {editing ? (
        <div style={{ padding: '6px 6px 8px', background: 'white', borderTop: '1px solid var(--border)' }}>
          <select
            value={sceneVal}
            onChange={e => setSceneVal(e.target.value)}
            style={{ width: '100%', padding: '4px 6px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 11, background: 'white', marginBottom: 4 }}
          >
            {SCENE_OPTIONS.filter(o => o.value).map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <input
            value={altVal}
            onChange={e => setAltVal(e.target.value)}
            placeholder="Alt text"
            style={{ width: '100%', padding: '4px 6px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 11, marginBottom: 4, boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={saveMeta} disabled={saving} style={{ flex: 1, padding: '4px 0', background: 'var(--forest)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 10 }}>
              {saving ? '…' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '4px 0', background: '#e8e4de', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 10 }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', background: '#f5f2ee', borderTop: '1px solid var(--border)', cursor: 'pointer' }}
          onClick={() => setEditing(true)}
          title="Click to edit tag + alt text"
        >
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, color: photo.scene_type ? 'var(--ink-mid)' : 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {sceneLabel}
          </span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, color: 'var(--ink-light)' }}>edit</span>
        </div>
      )}
    </div>
  )
}

// Map capture scene_type values to gallery scene_type values
const CAPTURE_TO_SCENE = {
  ceremony: 'ceremony',
  ballroom: 'reception',
  terrace: 'venue',
  grounds: 'venue',
  rooms: 'other',
  details: 'detail',
  couple: 'portraits',
  reception: 'reception',
  portraits: 'portraits',
  other: 'other',
}

function UploadPanel({ password, onUploaded }) {
  const [open, setOpen]         = useState(false)
  const [queue, setQueue]       = useState([])   // [{ file, status, result }]
  const [running, setRunning]   = useState(false)
  const fileRef = useRef()

  function addFiles(e) {
    const files = Array.from(e.target.files || [])
    const ts = Date.now()
    setQueue(prev => [...prev, ...files.map((f, i) => ({ id: ts + i, file: f, status: 'pending', result: null }))])
    fileRef.current.value = ''
  }

  function updateItem(id, fields) {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, ...fields } : q))
  }

  async function processQueue() {
    setRunning(true)
    const snapshot = queue.filter(q => q.status === 'pending')

    for (const item of snapshot) {
      // 1. Resize then upload
      const resized = await resizeImage(item.file)
      const ts   = Date.now()
      const form = new FormData()
      form.append('file', resized)
      form.append('path', `gallery/${ts}.webp`)
      updateItem(item.id, { status: 'uploading' })
      let url = ''
      try {
        const upRes = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'x-admin-password': password },
          body: form,
        })
        if (!upRes.ok) throw new Error('Upload failed')
        ;({ url } = await upRes.json())
      } catch (err) {
        updateItem(item.id, { status: 'error', result: err.message })
        continue
      }

      // 2. Auto-caption with Claude Vision
      updateItem(item.id, { status: 'captioning' })
      let alt_text = ''
      let scene_type = 'other'
      try {
        const capForm = new FormData()
        capForm.append('file', resized)
        const capRes = await fetch('/api/admin/capture', {
          method: 'POST',
          headers: { 'x-admin-password': password },
          body: capForm,
        })
        if (capRes.ok) {
          const analysis = await capRes.json()
          const sug = analysis.suggestions?.find(s => s.action === 'add_to_gallery') || analysis.suggestions?.[0]
          alt_text   = sug?.alt_text   || ''
          scene_type = CAPTURE_TO_SCENE[sug?.scene_type] || 'other'
        }
      } catch { /* caption is optional */ }

      // 3. Insert into media table
      try {
        const insRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
          body: JSON.stringify({ url, alt_text, scene_type, label: item.file.name }),
        })
        if (!insRes.ok) throw new Error('DB insert failed')
        const newPhoto = await insRes.json()
        updateItem(item.id, { status: 'done', result: { alt_text, scene_type } })
        onUploaded(newPhoto)
      } catch (err) {
        updateItem(item.id, { status: 'error', result: err.message })
      }
    }
    setRunning(false)
  }

  const pending = queue.filter(q => q.status === 'pending').length
  const done    = queue.filter(q => q.status === 'done').length

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', marginBottom: 24 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink)' }}
      >
        <span>↑ Upload photos to gallery</span>
        <span style={{ fontSize: 10, color: 'var(--ink-light)' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', margin: '10px 0 10px' }}>
            Select one or more photos. Each will be auto-tagged and captioned by AI, then added to the gallery.
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={addFiles} style={{ display: 'none' }} />
            <button
              onClick={() => fileRef.current.click()}
              style={{ padding: '6px 14px', background: '#e8e4de', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12 }}
            >
              Choose files
            </button>
            {pending > 0 && (
              <button
                onClick={processQueue}
                disabled={running}
                style={{ padding: '6px 14px', background: 'var(--forest)', color: 'white', border: 'none', cursor: running ? 'default' : 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12 }}
              >
                {running ? 'Processing…' : `Upload ${pending} photo${pending !== 1 ? 's' : ''}`}
              </button>
            )}
            {done > 0 && queue.every(q => q.status !== 'pending') && (
              <button
                onClick={() => setQueue([])}
                style={{ padding: '6px 14px', background: '#e8e4de', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12 }}
              >
                Clear
              </button>
            )}
          </div>
          {queue.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {queue.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-ui)', fontSize: 11 }}>
                  <span style={{ color: item.status === 'done' ? 'var(--forest)' : item.status === 'error' ? 'var(--rose)' : 'var(--ink-light)', minWidth: 80 }}>
                    {item.status === 'pending' ? 'Queued' : item.status === 'uploading' ? 'Uploading…' : item.status === 'captioning' ? 'Captioning…' : item.status === 'done' ? '✓ Done' : `Error: ${item.result}`}
                  </span>
                  <span style={{ color: 'var(--ink)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.file.name}</span>
                  {item.status === 'done' && item.result && (
                    <span style={{ color: 'var(--ink-light)', fontSize: 10 }}>
                      {SCENE_LABELS[item.result.scene_type] || item.result.scene_type} · {item.result.alt_text ? item.result.alt_text.slice(0, 60) : 'no caption'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GalleryPage() {
  const { password } = useAdmin()
  const [photos, setPhotos]         = useState([])
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)
  const [activeFilter, setActiveFilter] = useState('true')
  const [sceneFilter, setSceneFilter]   = useState('')
  const [loading, setLoading]       = useState(false)

  const load = useCallback(async (pg = 1, active = activeFilter, scene = sceneFilter) => {
    setLoading(true)
    const params = new URLSearchParams({ page: pg, active })
    if (scene) params.set('scene', scene)
    const res  = await fetch(`/api/admin/gallery?${params}`, { headers: { 'x-admin-password': password } })
    const json = await res.json()
    setPhotos(json.data || [])
    setTotal(json.count || 0)
    setPage(pg)
    setLoading(false)
  }, [password, activeFilter, sceneFilter])

  useEffect(() => { load(1, activeFilter, sceneFilter) }, [activeFilter, sceneFilter]) // eslint-disable-line

  function handleUpdate(id, fields) {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p))
    if (fields.active !== undefined) setTotal(t => t - 1)
  }

  function handleUploaded(photo) {
    setPhotos(prev => [photo, ...prev])
    setTotal(t => t + 1)
  }

  const totalPages = Math.ceil(total / 60)

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>Gallery</h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 16 }}>
        {total} photos. Hover and click <strong>Hide/Show</strong> to toggle visibility. Click the tag row below each photo to edit its category and alt text.
      </p>

      <UploadPanel password={password} onUploaded={handleUploaded} />

      {/* Tag legend */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.12em', textTransform: 'uppercase', marginRight: 4 }}>Tags:</span>
        {SCENE_OPTIONS.filter(o => o.value).map(o => (
          <span
            key={o.value}
            onClick={() => { setSceneFilter(o.value === sceneFilter ? '' : o.value); setPage(1) }}
            style={{ fontFamily: 'var(--font-ui)', fontSize: 11, padding: '3px 10px', background: sceneFilter === o.value ? 'var(--forest)' : '#e8e4de', color: sceneFilter === o.value ? 'white' : 'var(--ink)', cursor: 'pointer', borderRadius: 2 }}
          >
            {o.label}
          </span>
        ))}
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', marginLeft: 8 }}>
          ★ = quality rating assigned by AI when uploaded (1–5 stars). Higher = more likely to show first.
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {[['true', 'Visible'], ['false', 'Hidden'], ['', 'All']].map(([val, label]) => (
            <button key={val} onClick={() => { setActiveFilter(val); setPage(1) }}
              style={{ padding: '6px 14px', background: activeFilter === val ? 'var(--forest)' : 'white', color: activeFilter === val ? 'white' : 'var(--ink)', border: '1px solid var(--border)', borderRight: val === '' ? undefined : 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12 }}>
              {label}
            </button>
          ))}
        </div>

        {sceneFilter && (
          <button onClick={() => { setSceneFilter(''); setPage(1) }}
            style={{ padding: '6px 12px', background: 'var(--forest)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 11 }}>
            {SCENE_LABELS[sceneFilter] || sceneFilter} ×
          </button>
        )}

        {loading && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)' }}>Loading…</span>}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 6, marginBottom: 24 }}>
        {photos.map(photo => (
          <PhotoCard key={photo.id} photo={photo} password={password} onUpdate={handleUpdate} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button disabled={page <= 1} onClick={() => load(page - 1)}
            style={{ padding: '6px 14px', border: '1px solid var(--border)', background: 'white', cursor: page > 1 ? 'pointer' : 'default', fontFamily: 'var(--font-ui)', fontSize: 12, opacity: page <= 1 ? 0.4 : 1 }}>
            ← Prev
          </button>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)' }}>
            Page {page} of {totalPages} ({total} photos)
          </span>
          <button disabled={page >= totalPages} onClick={() => load(page + 1)}
            style={{ padding: '6px 14px', border: '1px solid var(--border)', background: 'white', cursor: page < totalPages ? 'pointer' : 'default', fontFamily: 'var(--font-ui)', fontSize: 12, opacity: page >= totalPages ? 0.4 : 1 }}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
