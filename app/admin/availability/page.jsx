'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '../layout'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function toDateStr(date) {
  return date.toISOString().slice(0, 10)
}



function MonthGrid({ monthDate, today, isBooked, onToggle, saving }) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const label = monthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow = new Date(year, month, 1).getDay()

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 8, letterSpacing: '0.05em' }}>
        {label}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 9, color: 'var(--ink-light)', padding: '2px 0', letterSpacing: '0.05em' }}>
            {d}
          </div>
        ))}
        {cells.map((dateStr, i) => {
          if (!dateStr) return <div key={`e${i}`} />
          const isPast = dateStr < today
          const booked = isBooked(dateStr)
          const isToday = dateStr === today
          const isSaving = saving === dateStr
          const dow = new Date(dateStr + 'T12:00:00').getDay()
          const isWeekend = dow === 5 || dow === 6 || dow === 0

          return (
            <button
              key={dateStr}
              onClick={() => !isPast && onToggle(dateStr)}
              disabled={isPast || isSaving}
              title={dateStr}
              style={{
                padding: '5px 0',
                textAlign: 'center',
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                border: isToday ? '1px solid var(--forest)' : '1px solid transparent',
                cursor: isPast ? 'default' : 'pointer',
                background: booked ? '#b84040' : isPast ? 'transparent' : isWeekend ? '#e8e4de' : '#f5f2ee',
                color: booked ? 'white' : isPast ? '#ccc' : 'var(--ink)',
                opacity: isSaving ? 0.4 : 1,
                transition: 'background 0.1s',
                fontWeight: isWeekend ? 500 : 400,
              }}
            >
              {new Date(dateStr + 'T12:00:00').getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminAvailabilityPage() {
  const { password } = useAdmin()
  const [ranges, setRanges] = useState([])
  const [saving, setSaving] = useState(null)
  const [error, setError] = useState('')

  const today = toDateStr(new Date())
  const headers = { 'Content-Type': 'application/json', 'x-admin-password': password }

  async function loadRanges() {
    const res = await fetch('/api/availability')
    const data = await res.json()
    setRanges(Array.isArray(data) ? data : [])
  }

  useEffect(() => { loadRanges() }, []) // eslint-disable-line

  function isBooked(dateStr) {
    return ranges.some(r => dateStr >= r.start_date && dateStr <= r.end_date)
  }

  function getRangeFor(dateStr) {
    return ranges.find(r => dateStr >= r.start_date && dateStr <= r.end_date)
  }

  async function toggleDate(dateStr) {
    if (dateStr < today) return
    setSaving(dateStr)
    setError('')

    const existing = getRangeFor(dateStr)

    if (existing) {
      const res = await fetch('/api/availability', {
        method: 'DELETE', headers,
        body: JSON.stringify({ id: existing.id }),
      })
      if (res.ok) {
        setRanges(prev => prev.filter(r => r.id !== existing.id))
      } else {
        setError('Failed to remove date.')
      }
    } else {
      const res = await fetch('/api/availability', {
        method: 'POST', headers,
        body: JSON.stringify({ start_date: dateStr, end_date: dateStr, notes: '' }),
      })
      if (res.ok) {
        await loadRanges()
      } else {
        setError('Failed to book date.')
      }
    }

    setSaving(null)
  }

  async function removeRange(id) {
    const res = await fetch('/api/availability', {
      method: 'DELETE', headers,
      body: JSON.stringify({ id }),
    })
    if (res.ok) setRanges(prev => prev.filter(r => r.id !== id))
  }

  function formatDate(str) {
    return new Date(str + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  // 24 months starting from today — computed once with stable keys
  const months = Array.from({ length: 24 }, (_, i) => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + i, 1)
  })

  const upcoming = ranges
    .filter(r => r.end_date >= today)
    .sort((a, b) => a.start_date.localeCompare(b.start_date))

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 6 }}>
        Availability
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 4 }}>
        Click any date to book or unbook it. Click multiple days to block out a range.
      </p>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 14, height: 14, background: '#b84040' }} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>Booked</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 14, height: 14, background: '#e8e4de', border: '1px solid #d4cfc9' }} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>Weekend (available)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 14, height: 14, border: '1px solid var(--forest)' }} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)' }}>Today</span>
        </div>
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--rose)', marginBottom: 12 }}>{error}</p>
      )}

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28, marginBottom: 40 }}>
        {months.map(m => (
          <MonthGrid
            key={`${m.getFullYear()}-${m.getMonth()}`}
            monthDate={m}
            today={today}
            isBooked={isBooked}
            onToggle={toggleDate}
            saving={saving}
          />
        ))}
      </div>

      {/* Upcoming booked list */}
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 12 }}>
          Upcoming booked — {upcoming.length} {upcoming.length === 1 ? 'block' : 'blocks'}
        </p>
        {upcoming.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)' }}>Nothing booked yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {upcoming.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid var(--border)', padding: '10px 16px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>
                    {r.start_date === r.end_date
                      ? formatDate(r.start_date)
                      : `${formatDate(r.start_date)} — ${formatDate(r.end_date)}`}
                  </span>
                  {r.notes && (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', marginLeft: 12 }}>
                      {r.notes}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeRange(r.id)}
                  style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 16 }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
