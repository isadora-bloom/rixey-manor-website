'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '../layout'

const VIDEO_SLOTS = [
  {
    key: 'feature_video_url',
    label: 'Main feature video',
    desc: 'Home page — featured player below press strip. Also used as hero fallback.',
    pages: ['Home'],
  },
  {
    key: 'video_terrace',
    label: 'Terrace / viral lights video',
    desc: 'The video that went viral. Shown on home page (after spaces) and venue page (after spaces). YouTube, Vimeo, or mp4.',
    pages: ['Home', 'Venue'],
  },
  {
    key: 'video_venue_tour',
    label: 'Venue tour / walkthrough',
    desc: 'Autoplay background loop on the venue page. Use an mp4 for autoplay — YouTube/Vimeo will show as a player instead.',
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
  return { type: 'unknown', label: 'Unknown format' }
}

function VideoSlot({ slotDef, currentValue, password, onSaved }) {
  const [value, setValue]   = useState(currentValue || '')
  const [status, setStatus] = useState('')
  const dirty = value !== (currentValue || '')
  const preview = getEmbedPreview(value)

  async function save() {
    setStatus('saving')
    const res = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ key: slotDef.key, value }),
    })
    if (res.ok) {
      onSaved(slotDef.key, value)
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
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {slotDef.pages.map(p => (
            <span key={p} style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--sage-light)', color: 'var(--forest)', padding: '2px 7px', borderRadius: 2 }}>
              {p}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="https://youtube.com/watch?v=… or https://vimeo.com/… or https://….mp4"
            style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 12, outline: 'none', background: 'white', minWidth: 0 }}
          />
          <button
            onClick={save}
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

        {value && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
        Paste a YouTube URL, Vimeo URL, or direct mp4 link. Slots with no URL are simply hidden on the site.
      </p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', marginBottom: 32 }}>
        YouTube and Vimeo URLs show as a player with a play button. MP4 URLs can also autoplay as a silent background loop (venue tour slot).
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
