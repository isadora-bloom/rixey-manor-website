'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAdmin } from '../layout'

// Windows the API supports.
const WINDOWS = [
  { days: 30,  label: '30 days'  },
  { days: 90,  label: '90 days'  },
  { days: 365, label: '12 months'},
]

// Per-directory landing URLs Isadora pastes into each external listing.
// Kept here (not in the DB) because they're stable and discoverable in the
// admin alongside the data that proves they're working.
const DIRECTORY_LINKS = [
  { key: 'theknot',     label: 'The Knot',     path: '/knot',         medium: 'directory' },
  { key: 'weddingwire', label: 'WeddingWire',  path: '/weddingwire',  medium: 'directory' },
  { key: 'zola',        label: 'Zola',         path: '/zola',         medium: 'directory' },
  { key: 'pinterest',   label: 'Pinterest',    path: '/pinterest',    medium: 'social'    },
  { key: 'instagram',   label: 'Instagram',    path: '/instagram',    medium: 'social'    },
  { key: 'facebook',    label: 'Facebook',     path: '/facebook',     medium: 'social'    },
  { key: 'tiktok',      label: 'TikTok',       path: '/tiktok',       medium: 'social'    },
  { key: 'google',      label: 'Google Ads',   path: '/google-ads',   medium: 'cpc'       },
]

// ── shared styles ────────────────────────────────────────────────────────
const card  = { background: 'white', border: '1px solid var(--border)', borderRadius: 4, padding: 24 }
const eyebr = { fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: 0 }
const h2    = { fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', margin: '4px 0 16px' }
const th    = { textAlign: 'left', padding: '10px 12px', fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', borderBottom: '1px solid var(--border)' }
const td    = { padding: '12px', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)', borderBottom: '1px solid #F1ECE6' }
const tdNum = { ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }

function StatCard({ label, value }) {
  return (
    <div style={{ ...card, padding: '16px 18px' }}>
      <p style={eyebr}>{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
        {value.toLocaleString()}
      </p>
    </div>
  )
}

export default function SourcesPage() {
  const { password } = useAdmin()
  const [days, setDays]       = useState(30)
  const [data, setData]       = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied]   = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/sources?days=${days}`, {
        headers: { 'x-admin-password': password },
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Failed to load sources.'); setData(null) }
      else setData(json)
    } catch {
      setError('Network error.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [days, password])

  useEffect(() => { load() }, [load])

  const origin = useMemo(
    () => typeof window !== 'undefined' ? window.location.origin : 'https://www.rixeymanor.com',
    [],
  )

  async function copyLink(text, key) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(''), 1400)
    } catch {}
  }

  // Sub-totals for the conversion rates row
  const totals = data?.totals
  const rate = (n, d) => d > 0 ? `${((n / d) * 100).toFixed(1)}%` : '—'

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={eyebr}>Where people come from</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--ink)', margin: '4px 0 6px' }}>
            Sources
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', margin: 0 }}>
            First-touch attribution. A submission counts toward the channel the visitor first arrived from, even if they came back via a different path.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: 'white', border: '1px solid var(--border)', borderRadius: 4 }}>
          {WINDOWS.map(w => (
            <button
              key={w.days}
              onClick={() => setDays(w.days)}
              style={{
                padding: '8px 14px',
                background: days === w.days ? 'var(--forest)' : 'transparent',
                color: days === w.days ? 'white' : 'var(--ink)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: 3,
              }}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ ...card, borderColor: 'var(--rose)', marginBottom: 24 }}>
          <p style={{ color: 'var(--rose)', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Totals strip */}
      {totals && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 12 }}>
            <StatCard label="Visitors"        value={totals.visitors} />
            <StatCard label="Named"           value={totals.identified} />
            <StatCard label="Calculator"      value={totals.calculator} />
            <StatCard label="Contact"         value={totals.contact} />
            <StatCard label="Quiz"            value={totals.quiz} />
            <StatCard label="Tour opens"      value={totals.tour_intents} />
            <StatCard label="Tour scheduled"  value={totals.tour_scheduled} />
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', marginBottom: 28 }}>
            Named rate: <strong>{rate(totals.identified, totals.visitors)}</strong> · Calculator rate: <strong>{rate(totals.calculator, totals.visitors)}</strong> · Tour scheduled rate: <strong>{rate(totals.tour_scheduled, totals.visitors)}</strong>
          </p>
        </>
      )}

      {/* By source / medium */}
      <div style={{ ...card, padding: 0, marginBottom: 28 }}>
        <div style={{ padding: '20px 24px 8px' }}>
          <p style={eyebr}>By source · medium</p>
          <h2 style={h2}>Funnel per channel</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Source</th>
                <th style={th}>Medium</th>
                <th style={{ ...th, textAlign: 'right' }}>Visitors</th>
                <th style={{ ...th, textAlign: 'right' }}>Named</th>
                <th style={{ ...th, textAlign: 'right' }}>Calculator</th>
                <th style={{ ...th, textAlign: 'right' }}>Contact</th>
                <th style={{ ...th, textAlign: 'right' }}>Quiz</th>
                <th style={{ ...th, textAlign: 'right' }}>Tour opens</th>
                <th style={{ ...th, textAlign: 'right' }}>Tour scheduled</th>
                <th style={{ ...th, textAlign: 'right' }}>Tour rate</th>
              </tr>
            </thead>
            <tbody>
              {!loading && data?.bySource?.length === 0 && (
                <tr><td colSpan={10} style={{ ...td, textAlign: 'center', color: 'var(--ink-light)', padding: 32 }}>No visitors in this window yet.</td></tr>
              )}
              {loading && (
                <tr><td colSpan={10} style={{ ...td, textAlign: 'center', color: 'var(--ink-light)', padding: 32 }}>Loading…</td></tr>
              )}
              {data?.bySource?.map((row, i) => (
                <tr key={i}>
                  <td style={td}>{row.source}</td>
                  <td style={{ ...td, color: 'var(--ink-light)' }}>{row.medium}</td>
                  <td style={tdNum}>{row.visitors.toLocaleString()}</td>
                  <td style={tdNum}>{row.identified.toLocaleString()}</td>
                  <td style={tdNum}>{row.calculator.toLocaleString()}</td>
                  <td style={tdNum}>{row.contact.toLocaleString()}</td>
                  <td style={tdNum}>{row.quiz.toLocaleString()}</td>
                  <td style={tdNum}>{row.tour_intents.toLocaleString()}</td>
                  <td style={tdNum}>{row.tour_scheduled.toLocaleString()}</td>
                  <td style={tdNum}>{rate(row.tour_scheduled, row.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referrer breakdown for untagged traffic */}
      {data?.byReferrer && data.byReferrer.length > 0 && (
        <div style={{ ...card, padding: 0, marginBottom: 28 }}>
          <div style={{ padding: '20px 24px 8px' }}>
            <p style={eyebr}>Untagged traffic</p>
            <h2 style={h2}>Where (direct) visitors actually came from</h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', margin: '0 0 8px' }}>
              When a source field is empty, the visitor either came directly or arrived from a referrer that didn&rsquo;t tag the link. This is the referrer they had when they landed. Use it to spot directories that need a tagged URL (use the panel below).
            </p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Referrer host</th>
                  <th style={{ ...th, textAlign: 'right' }}>Visitors</th>
                </tr>
              </thead>
              <tbody>
                {data.byReferrer.map((row, i) => (
                  <tr key={i}>
                    <td style={td}>{row.referrer}</td>
                    <td style={tdNum}>{row.visitors.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Per-directory landing URLs */}
      <div style={{ ...card, marginBottom: 28 }}>
        <p style={eyebr}>URLs to paste into each directory</p>
        <h2 style={h2}>Tagged landing links</h2>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', margin: '0 0 16px' }}>
          Replace bare <code>rixeymanor.com</code> in each directory listing with the tagged URL below. Every click then comes in stamped with the right source, and you&rsquo;ll see it in the table above.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {DIRECTORY_LINKS.map(link => {
            const fullUrl = `${origin}${link.path}`
            return (
              <div key={link.key} style={{ background: '#FDFAF6', border: '1px solid var(--border)', padding: 14, borderRadius: 3 }}>
                <p style={{ ...eyebr, marginBottom: 4 }}>{link.label}</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink)', margin: '0 0 8px', wordBreak: 'break-all' }}>
                  {fullUrl}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', margin: '0 0 8px' }}>
                  Tags as <strong>{link.key}</strong> · <strong>{link.medium}</strong>
                </p>
                <button
                  onClick={() => copyLink(fullUrl, link.key)}
                  style={{
                    padding: '7px 12px',
                    background: copied === link.key ? 'var(--forest)' : 'white',
                    color: copied === link.key ? 'white' : 'var(--ink)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderRadius: 3,
                  }}
                >
                  {copied === link.key ? 'Copied' : 'Copy'}
                </button>
              </div>
            )
          })}
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', margin: '16px 0 0' }}>
          One-off source? Use <code>{origin}/r/&lt;your-source&gt;</code> — the platform name becomes the source automatically.
        </p>
      </div>

      {data?.generatedAt && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', textAlign: 'right' }}>
          Generated {new Date(data.generatedAt).toLocaleString()}
        </p>
      )}
    </div>
  )
}
