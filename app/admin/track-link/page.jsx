'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdmin } from '../layout'

// Where each destination sends the visitor. The ?lid=<code> param is appended
// by buildUrl below.
const DESTINATIONS = [
  { value: 'pricing', label: 'Pricing calculator', path: '/pricing' },
  { value: 'tour',    label: 'Tour booking page',  path: '/availability' },
  { value: 'home',    label: 'Homepage',           path: '/' },
  { value: 'venue',   label: 'The Venue page',     path: '/venue' },
]

const ROLES = [
  { value: 'couple',        label: 'Couple' },
  { value: 'parent',        label: 'Parent' },
  { value: 'friend_family', label: 'Friend / Family' },
  { value: 'planner',       label: 'Planner' },
]

const EMPTY = {
  first_name: '', partner_name: '', email: '', phone: '',
  role: 'couple', destination: 'pricing', label: '',
}

function destPath(value) {
  return (DESTINATIONS.find(d => d.value === value) || DESTINATIONS[0]).path
}

function buildUrl(link) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.rixeymanor.com'
  return `${origin}${destPath(link.destination)}?lid=${link.code}`
}

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── shared styles ─────────────────────────────────────────────────────────────
const card  = { background: 'white', border: '1px solid var(--border)', borderRadius: 4, padding: 24 }
const label = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 6, display: 'block' }
const input = { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', background: '#FDFAF6', fontFamily: 'var(--font-ui)', fontSize: 14, outline: 'none', borderRadius: 3 }
const btn   = { padding: '10px 18px', background: 'var(--forest)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: '0.08em', borderRadius: 3 }

export default function TrackLinkPage() {
  const { password } = useAdmin()
  const [form, setForm]     = useState(EMPTY)
  const [links, setLinks]   = useState([])
  const [busy, setBusy]     = useState(false)
  const [error, setError]   = useState('')
  const [justMade, setJustMade] = useState(null)
  const [copied, setCopied] = useState('')

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': password }

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/track-link', { headers: { 'x-admin-password': password } })
      const json = await res.json()
      if (res.ok) setLinks(json.links || [])
      else setError(json.error || 'Failed to load links.')
    } catch { setError('Network error loading links.') }
  }, [password])

  useEffect(() => { load() }, [load])

  async function create(e) {
    e.preventDefault()
    setError(''); setJustMade(null); setBusy(true)
    try {
      const res = await fetch('/api/admin/track-link', {
        method: 'POST', headers, body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Could not create link.'); return }
      setJustMade(json.link)
      setForm({ ...EMPTY })
      load()
    } catch { setError('Network error.') }
    finally { setBusy(false) }
  }

  async function remove(code) {
    if (!confirm('Delete this tracked link? Existing copies of it will stop identifying the client.')) return
    try {
      await fetch(`/api/admin/track-link?code=${encodeURIComponent(code)}`, {
        method: 'DELETE', headers: { 'x-admin-password': password },
      })
      load()
    } catch { setError('Could not delete.') }
  }

  function copy(url) {
    navigator.clipboard?.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(''), 1800)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ maxWidth: 920, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display, Playfair Display)', fontSize: 30, color: 'var(--ink)', marginBottom: 4 }}>
        Tracked Email Links
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink-light)', marginBottom: 24, lineHeight: 1.5 }}>
        Generate a personalized link for a client. Paste it into your email. When they click it,
        the site recognizes who they are — and every page they view from then on is logged under their name.
      </p>

      {error && (
        <p style={{ color: 'var(--rose)', fontSize: 13, fontFamily: 'var(--font-ui)', marginBottom: 16 }}>{error}</p>
      )}

      {/* ── Builder form ── */}
      <form onSubmit={create} style={{ ...card, marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={label}>Client first name</label>
            <input style={input} value={form.first_name} onChange={set('first_name')} placeholder="Jane" />
          </div>
          <div>
            <label style={label}>Partner name</label>
            <input style={input} value={form.partner_name} onChange={set('partner_name')} placeholder="Tom" />
          </div>
          <div>
            <label style={label}>Email</label>
            <input style={input} type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" />
          </div>
          <div>
            <label style={label}>Phone</label>
            <input style={input} value={form.phone} onChange={set('phone')} placeholder="(540) 000-0000" />
          </div>
          <div>
            <label style={label}>Role</label>
            <select style={input} value={form.role} onChange={set('role')}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Link goes to</label>
            <select style={input} value={form.destination} onChange={set('destination')}>
              {DESTINATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={label}>Label (your note — not shown to the client)</label>
          <input style={input} value={form.label} onChange={set('label')} placeholder="Jane & Tom — pricing follow-up, sent 5/15" />
        </div>
        <button type="submit" style={{ ...btn, opacity: busy ? 0.6 : 1 }} disabled={busy}>
          {busy ? 'Generating…' : 'Generate link'}
        </button>

        {justMade && (
          <div style={{ marginTop: 16, padding: 14, background: 'var(--sage-light, #B5CDBE)', borderRadius: 3 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-mid)', marginBottom: 6 }}>
              Link ready — copy it into your email:
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <code style={{ flex: 1, fontSize: 13, wordBreak: 'break-all', background: 'white', padding: '8px 10px', borderRadius: 3 }}>
                {buildUrl(justMade)}
              </code>
              <button type="button" onClick={() => copy(buildUrl(justMade))} style={{ ...btn, padding: '8px 14px' }}>
                {copied === buildUrl(justMade) ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* ── Existing links ── */}
      <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 12 }}>
        Links you've sent ({links.length})
      </h2>

      {links.length === 0 && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink-light)' }}>
          No tracked links yet. Generate one above.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(link => {
          const url = buildUrl(link)
          const who = [link.first_name, link.partner_name].filter(Boolean).join(' & ') || link.email || '(no name)'
          const opened = (link.click_count || 0) > 0
          return (
            <div key={link.code} style={{ ...card, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <strong style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--ink)' }}>{who}</strong>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)' }}>
                  → {(DESTINATIONS.find(d => d.value === link.destination) || {}).label || link.destination}
                </span>
                <span style={{
                  marginLeft: 'auto', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
                  color: opened ? 'var(--forest)' : 'var(--ink-light)',
                }}>
                  {opened
                    ? `Opened ${link.click_count}× · last ${fmtDate(link.last_clicked_at)}`
                    : 'Not opened yet'}
                </span>
              </div>
              {link.label && (
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', margin: '4px 0 8px' }}>
                  {link.label}
                </p>
              )}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <code style={{ flex: 1, fontSize: 12, wordBreak: 'break-all', background: '#FDFAF6', padding: '6px 9px', borderRadius: 3, color: 'var(--ink-mid)' }}>
                  {url}
                </code>
                <button onClick={() => copy(url)} style={{ ...btn, padding: '6px 12px', fontSize: 12 }}>
                  {copied === url ? 'Copied' : 'Copy'}
                </button>
                <button onClick={() => remove(link.code)} style={{
                  padding: '6px 12px', fontSize: 12, background: 'none', border: '1px solid var(--border)',
                  color: 'var(--ink-light)', cursor: 'pointer', borderRadius: 3, fontFamily: 'var(--font-ui)',
                }}>
                  Delete
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', marginTop: 8 }}>
                Created {fmtDate(link.created_at)}
                {opened && ` · first opened ${fmtDate(link.first_clicked_at)}`}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
