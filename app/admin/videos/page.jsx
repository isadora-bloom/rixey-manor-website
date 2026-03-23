'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../layout'

const VIDEO_SLOTS = [
  {
    key: 'feature_video_url',
    label: 'Main feature video',
    desc: 'Home page — featured player below press strip. Also appears on venue page.',
    pages: ['Home', 'Venue'],
  },
  {
    key: 'video_terrace',
    label: 'Terrace / viral lights video',
    desc: 'The video that went viral. Shown on home page (after spaces) and venue page (after spaces).',
    pages: ['Home', 'Venue'],
  },
  {
    key: 'video_venue_tour',
    label: 'Venue tour / walkthrough',
    desc: 'Background loop on the venue page. Use an mp4 for autoplay — YouTube/Vimeo will show as a play-button player instead.',
    pages: ['Venue'],
  },
  {
    key: 'video_real_wedding',
    label: 'Real wedding highlight reel',
    desc: 'Home page — shown after the terrace video. A full wedding day or highlight reel.',
    pages: ['Home'],
  },
]

function getEmbedPreview(url) {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return { type: 'youtube', thumb: `https://img.youtube.com/vi/${yt[1]}/mqdefault.jpg`, label: 'YouTube' }
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return { type: 'vimeo', label: 'Vimeo' }
  if (url.match(/\.(mp4|webm|mov)$/i)) return { type: 'mp4', label: 'MP4' }
  return { type: 'unknown', label: 'Linked video' }
}

function VideoSlot({ slotDef, currentValue, password, onSaved }) {
  const [value, setValue]       = useState(currentValue || '')
  const [status, setStatus]     = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const dirty = value !== (currentValue || '')
  const preview = getEmbedPreview(value)

  async function save(url) {
    const saveUrl = url !== undefined ? url : value
    setStatus('saving')
    const res = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ key: slotDef.key, value: saveUrl }),
    })
    if (res.ok) {
      onSaved(slotDef.key, saveUrl)
      setStatus('saved')
      setTimeout(() => setStatus(''), 2000)
    } else {
      setStatus('error')
    }
  }

  async function clear() {
    setValue('')
    setStatus('saving')
    const res = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ key: slotDef.key, value: '' }),
    })
    if (res.ok) { onSaved(slotDef.key, ''); setStatus('') }
    else setStatus('error')
  }

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setStatus('uploading')
    try {
      const ext  = file.name.split('.').pop().toLowerCase()
      const ts   = Date.now()
      const path = `videos/${slotDef.key}-${ts}.${ext}`

      // Step 1: get a signed upload URL from the server (bypasses Vercel body limit)
      const sigRes = await fetch('/api/admin/signed-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ path }),
      })
      if (!sigRes.ok) throw new Error('Could not get upload URL')
      const { signedUrl, publicUrl } = await sigRes.json()

      // Step 2: PUT the file directly to Supabase Storage (no size limit)
      const putRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'video/mp4' },
        body: file,
      })
      if (!putRes.ok) throw new Error('Upload to storage failed')

      setValue(publicUrl)
      await save(publicUrl)
    } catch (err) {
      setStatus('upload error: ' + err.message)
    } finally {
      setUploading(false)
      fileRef.current.value = ''
    }
  }

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', padding: 20, display: 'flex', gap: 20 }}>
      {/* Thumbnail / type badge */}
      <div style={{ width: 120, flexShrink: 0 }}>
        {preview?.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview.thumb} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', textAlign: 'center', padding: 4 }}>
              {preview?.label || 'No video'}
            </span>
          </div>
        )}
        {preview && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', marginTop: 4, textAlign: 'center' }}>
            {preview.label}
          </p>
        )}
      </div>

      {/* Info + input */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
          {slotDef.label}
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', marginBottom: 4 }}>
          {slotDef.desc}
        </p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {slotDef.pages.map(p => (
            <span key={p} style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--sage-light)', color: 'var(--forest)', padding: '2px 7px', borderRadius: 2 }}>
              {p}
            </span>
          ))}
        </div>

        {/* URL input row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Paste YouTube, Vimeo, or .mp4 URL…"
            style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 12, outline: 'none', background: 'white', minWidth: 0 }}
          />
          <button
            onClick={() => save()}
            disabled={!dirty || status === 'saving'}
            style={{ padding: '7px 14px', background: dirty ? 'var(--forest)' : 'var(--border)', color: dirty ? 'white' : 'var(--ink-light)', border: 'none', cursor: dirty ? 'pointer' : 'default', fontFamily: 'var(--font-ui)', fontSize: 12, flexShrink: 0 }}
          >
            {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved' : status === 'error' ? 'Error' : 'Save'}
          </button>
          {value && (
            <button onClick={clear} style={{ padding: '7px 10px', background: '#f0f0f0', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12, flexShrink: 0 }}>
              Clear
            </button>
          )}
        </div>

        {/* Desktop upload row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleFile} style={{ display: 'none' }} />
          <button
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            style={{ padding: '6px 12px', background: '#e8e4de', color: 'var(--ink)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.06em' }}
          >
            {uploading ? 'Uploading…' : '↑ Upload from computer'}
          </button>
          {status === 'uploading' && (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>Uploading video…</span>
          )}
          {status === 'saved' && (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--forest)' }}>✓ Saved</span>
          )}
          {status.startsWith('upload error') && (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--rose)' }}>{status}</span>
          )}
        </div>

        {value && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--ink-light)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value}
          </p>
        )}
      </div>
    </div>
  )
}

export default function VideosPage() {
  const { password } = useAdmin()
  const [values, setValues]   = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/content', { headers: { 'x-admin-password': password } })
      .then(r => r.json())
      .then(data => {
        const map = {}
        if (Array.isArray(data)) data.forEach(row => { map[row.key] = row.value })
        setValues(map)
        setLoading(false)
      })
  }, [password])

  function handleSaved(key, value) {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>Videos</h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 8 }}>
        Paste a YouTube or Vimeo URL, a direct .mp4 link, or upload a video file from your computer.
      </p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', marginBottom: 32 }}>
        YouTube and Vimeo show as a player with a play button. MP4 files can autoplay as a silent background loop (venue tour slot). Slots with no video are hidden on the site.
      </p>

      {loading && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>Loading…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {VIDEO_SLOTS.map(slot => (
          <VideoSlot
            key={slot.key}
            slotDef={slot}
            currentValue={values[slot.key] || ''}
            password={password}
            onSaved={handleSaved}
          />
        ))}
      </div>
    </div>
  )
}
