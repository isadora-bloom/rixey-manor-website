'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '../layout'
import Image from 'next/image'

const SCENES = ['', 'ceremony', 'reception', 'portraits', 'getting-ready', 'detail', 'venue', 'other']
const QUALITY_COLOR = { 5: '#2E7D54', 4: '#5a9e7a', 3: '#b0956a', 2: '#c97070', 1: '#aa4444' }

function PhotoCard({ photo, password, onToggle }) {
  const [toggling, setToggling] = useState(false)

  async function toggle() {
    setToggling(true)
    const res = await fetch('/api/admin/gallery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id: photo.id, active: !photo.active }),
    })
    if (res.ok) onToggle(photo.id, !photo.active)
    setToggling(false)
  }

  return (
    <div style={{ position: 'relative', background: 'var(--sage-light)', overflow: 'hidden', aspectRatio: '4/3' }}>
      <Image src={photo.url} alt={photo.alt_text || photo.label} fill style={{ objectFit: 'cover', opacity: photo.active ? 1 : 0.35, transition: 'opacity 0.2s' }} sizes="200px" />

      {/* Quality badge */}
      <div style={{ position: 'absolute', top: 5, left: 5, background: QUALITY_COLOR[photo.quality] || '#888', color: 'white', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 2 }}>
        q{photo.quality}
      </div>

      {/* Scene badge */}
      {photo.scene_type && (
        <div style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.55)', color: 'white', fontFamily: 'var(--font-ui)', fontSize: 9, padding: '2px 5px', borderRadius: 2 }}>
          {photo.scene_type}
        </div>
      )}

      {/* Toggle overlay */}
      <button
        onClick={toggle}
        disabled={toggling}
        title={photo.active ? 'Click to hide' : 'Click to show'}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6,
          opacity: 0, transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0}
      >
        <span style={{ background: photo.active ? '#c05050' : '#2E7D54', color: 'white', fontFamily: 'var(--font-ui)', fontSize: 11, padding: '4px 10px' }}>
          {toggling ? '…' : photo.active ? 'Hide' : 'Show'}
        </span>
      </button>
    </div>
  )
}

export default function GalleryPage() {
  const { password } = useAdmin()
  const [photos, setPhotos]   = useState([])
  const [total, setTotal]     = useState(0)
  const [page, setPage]       = useState(1)
  const [activeFilter, setActiveFilter] = useState('true')
  const [sceneFilter, setSceneFilter]   = useState('')
  const [loading, setLoading] = useState(false)

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

  function handleToggle(id, newActive) {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, active: newActive } : p))
    setTotal(t => t - 1)
  }

  const totalPages = Math.ceil(total / 60)

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>Gallery</h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 24 }}>
        {total} photos. Hover a photo and click Hide/Show to toggle visibility. Changes are instant.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {[['true', 'Active'], ['false', 'Hidden'], ['', 'All']].map(([val, label]) => (
            <button key={val} onClick={() => { setActiveFilter(val); setPage(1) }}
              style={{ padding: '6px 14px', background: activeFilter === val ? 'var(--forest)' : 'white', color: activeFilter === val ? 'white' : 'var(--ink)', border: '1px solid var(--border)', borderRight: val === '' ? undefined : 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12 }}>
              {label}
            </button>
          ))}
        </div>

        <select value={sceneFilter} onChange={e => { setSceneFilter(e.target.value); setPage(1) }}
          style={{ padding: '6px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 12, background: 'white', color: 'var(--ink)' }}>
          <option value="">All scenes</option>
          {SCENES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {loading && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)' }}>Loading…</span>}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 6, marginBottom: 24 }}>
        {photos.map(photo => (
          <PhotoCard key={photo.id} photo={photo} password={password} onToggle={handleToggle} />
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
