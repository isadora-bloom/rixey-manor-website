'use client'

import { useState, useEffect, useCallback } from 'react'

export default function AdminAvailabilityPage() {
  const [password, setPassword]       = useState('')
  const [authed, setAuthed]           = useState(false)
  const [authError, setAuthError]     = useState('')
  const [bookedDates, setBookedDates] = useState([])
  const [startDate, setStartDate]     = useState('')
  const [endDate, setEndDate]         = useState('')
  const [notes, setNotes]             = useState('')
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': password }

  const loadDates = useCallback(async () => {
    const res = await fetch('/api/availability')
    const data = await res.json()
    setBookedDates(Array.isArray(data) ? data : [])
  }, [])

  // Verify password against the API
  async function handleLogin(e) {
    e.preventDefault()
    setAuthError('')
    // Try a POST with a clearly invalid body — 401 = wrong password, 400 = right password (bad body)
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    })
    if (res.status === 401) {
      setAuthError('Wrong password.')
    } else {
      setAuthed(true)
      loadDates()
    }
  }

  useEffect(() => {
    if (authed) loadDates()
  }, [authed, loadDates])

  async function handleAdd(e) {
    e.preventDefault()
    if (!startDate || !endDate) { setError('Both dates required.'); return }
    if (endDate < startDate) { setError('End date must be on or after start date.'); return }
    setSaving(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/availability', {
      method: 'POST',
      headers,
      body: JSON.stringify({ start_date: startDate, end_date: endDate, notes }),
    })

    if (res.status === 401) { setError('Wrong password.'); setSaving(false); return }
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed.'); setSaving(false); return }

    setStartDate('')
    setEndDate('')
    setNotes('')
    setSuccess('Saved.')
    setTimeout(() => setSuccess(''), 3000)
    await loadDates()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Remove this booked date?')) return
    const res = await fetch('/api/availability', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id }),
    })
    if (res.ok) await loadDates()
  }

  function formatDate(str) {
    return new Date(str + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
    })
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="eyebrow mb-6">Admin</p>
          <h1 className="text-[28px] text-[var(--ink)] mb-8" style={{ fontFamily: 'var(--font-display)' }}>
            Availability Manager
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-[var(--border)] bg-white px-4 py-3 text-[var(--ink)] w-full focus:outline-none focus:border-[var(--sage)]"
              style={{ fontFamily: 'var(--font-body)' }}
            />
            {authError && (
              <p className="text-[var(--rose)] text-sm" style={{ fontFamily: 'var(--font-body)' }}>{authError}</p>
            )}
            <button type="submit" className="btn-primary w-full justify-center">
              Sign in
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--warm-white)] pt-20 px-6 pb-20">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="eyebrow mb-2">Admin</p>
            <h1 className="text-[32px] text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              Availability Manager
            </h1>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="text-[12px] tracking-[0.1em] uppercase text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Sign out
          </button>
        </div>

        {/* Add new */}
        <section className="bg-white border border-[var(--border)] p-8 mb-10">
          <h2 className="text-[18px] text-[var(--ink)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Mark dates as booked
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                  First day (usually Friday)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="border border-[var(--border)] bg-[var(--warm-white)] px-4 py-3 text-[var(--ink)] w-full focus:outline-none focus:border-[var(--sage)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                  Last day (usually Sunday)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="border border-[var(--border)] bg-[var(--warm-white)] px-4 py-3 text-[var(--ink)] w-full focus:outline-none focus:border-[var(--sage)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                Notes (internal only, never shown publicly)
              </label>
              <input
                type="text"
                placeholder="e.g. Smith / Johnson wedding"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="border border-[var(--border)] bg-[var(--warm-white)] px-4 py-3 text-[var(--ink)] w-full focus:outline-none focus:border-[var(--sage)]"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>
            {error && <p className="text-[var(--rose)] text-sm" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>}
            {success && <p className="text-[var(--forest)] text-sm" style={{ fontFamily: 'var(--font-body)' }}>{success}</p>}
            <button type="submit" disabled={saving} className="btn-primary self-start">
              {saving ? 'Saving…' : 'Save booked dates'}
            </button>
          </form>
        </section>

        {/* Existing booked dates */}
        <section>
          <h2 className="text-[18px] text-[var(--ink)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Currently booked — {bookedDates.length} {bookedDates.length === 1 ? 'range' : 'ranges'}
          </h2>

          {bookedDates.length === 0 ? (
            <p className="body-copy text-[var(--ink-light)]">No booked dates yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {bookedDates.map(b => (
                <div
                  key={b.id}
                  className="flex items-center justify-between bg-white border border-[var(--border)] px-6 py-4"
                >
                  <div>
                    <p className="text-[14px] text-[var(--ink)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {formatDate(b.start_date)} — {formatDate(b.end_date)}
                    </p>
                    {b.notes && (
                      <p className="text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-ui)' }}>
                        {b.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-[11px] tracking-[0.1em] uppercase text-[var(--rose)] hover:text-[var(--ink)] transition-colors ml-6 shrink-0"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
