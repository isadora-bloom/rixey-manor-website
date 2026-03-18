'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '../layout'

const FIELD_LABELS = {
  calendly_url:              'Calendly booking URL (e.g. https://calendly.com/rixeymanor/manortour)',
  pricing_one_day_from:      'One-day price — number only (e.g. 6000)',
  pricing_weekend_from:      'Weekend price — number only (e.g. 10000)',
  availability_blurb:        'Availability blurb (shown on home page below pricing)',
  portal_url:                'Couple portal URL (e.g. https://portal.rixeymanor.com)',
  portal_api_url:            'Portal Sage API URL (Railway backend URL)',
  phone:                     'Phone number (e.g. +15402124545)',
  email:                     'Email address',
}

const MULTILINE = ['availability_blurb']

function Field({ item, password, onSaved }) {
  const [value, setValue] = useState(item.value || '')
  const [status, setStatus] = useState('')  // '' | 'saving' | 'saved' | 'error'
  const dirty = value !== (item.value || '')

  async function save() {
    setStatus('saving')
    const res = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ key: item.key, value }),
    })
    if (res.ok) {
      setStatus('saved')
      onSaved(item.key, value)
      setTimeout(() => setStatus(''), 2000)
    } else {
      setStatus('error')
    }
  }

  const label = FIELD_LABELS[item.key] || item.key
  const isMulti = MULTILINE.includes(item.key)

  return (
    <div style={{ padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {isMulti ? (
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            rows={3}
            style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 14, resize: 'vertical', outline: 'none', background: 'white' }}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 14, outline: 'none', background: 'white' }}
          />
        )}
        <button
          onClick={save}
          disabled={!dirty || status === 'saving'}
          style={{
            padding: '8px 16px',
            background: dirty ? 'var(--forest)' : 'var(--border)',
            color: dirty ? 'white' : 'var(--ink-light)',
            border: 'none',
            cursor: dirty ? 'pointer' : 'default',
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            letterSpacing: '0.08em',
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved' : status === 'error' ? 'Error' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default function ContentPage() {
  const { password } = useAdmin()
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    fetch('/api/admin/content', { headers: { 'x-admin-password': password } })
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setError('Failed to load'); setLoading(false) })
  }, [password])

  function handleSaved(key, value) {
    setItems(prev => prev.map(i => i.key === key ? { ...i, value } : i))
  }

  // Sort: known fields first (in label order), then unknowns alphabetically
  const knownKeys  = Object.keys(FIELD_LABELS)
  const known   = items.filter(i => knownKeys.includes(i.key)).sort((a, b) => knownKeys.indexOf(a.key) - knownKeys.indexOf(b.key))
  const unknown = items.filter(i => !knownKeys.includes(i.key)).sort((a, b) => a.key.localeCompare(b.key))
  const sorted  = [...known, ...unknown]

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>Content</h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 32 }}>
        Edit site-wide text fields. Changes go live immediately.
      </p>

      {loading && <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>Loading…</p>}
      {error   && <p style={{ color: 'var(--rose)', fontFamily: 'var(--font-ui)', fontSize: 13 }}>{error}</p>}

      {sorted.map(item => (
        <Field key={item.key} item={item} password={password} onSaved={handleSaved} />
      ))}
    </div>
  )
}
