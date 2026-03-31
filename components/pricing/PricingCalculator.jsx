'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getUTM } from '@/lib/utm'

// ── Pricing data ──────────────────────────────────────────────────────────────

const SEASONS = [
  { key: 'winter',  label: 'Winter',  months: 'Dec, Jan, Feb',           price: 10000 },
  { key: 'spring',  label: 'Spring',  months: 'March, April, May',        price: 13000 },
  { key: 'summer',  label: 'Summer',  months: 'June, July, Aug',          price: 10000 },
  { key: 'fall',    label: 'Fall',    months: 'Sept, Oct, Nov',            price: 14000 },
  { key: 'weekday', label: 'Weekday', months: 'Tuesday or Wednesday only', price: 6000  },
  { key: 'lastcall-2026', label: 'Last Call 2026', months: 'Labor Day, Nov 14, Dec 12 & 19', price: 10000, special: true, specialNote: 'One-day rate (12 hours). Overnights available at $1,000/night.' },
]

const GUEST_TIERS = [
  { key: 'u50',     label: 'Under 50',  modifier: -500 },
  { key: '50-100',  label: '50–100',    modifier: 0    },
  { key: '100-150', label: '100–150',   modifier: 1000 },
  { key: '150-200', label: '150–200',   modifier: 1500 },
]

const NIGHTS = [
  { key: '0', label: 'No overnight stay', note: '',                                                                 price: 0    },
  { key: '1', label: 'One night',         note: 'Check in 11am day of wedding, check out 10am the morning after.', price: 1750 },
  { key: '2', label: 'Two nights',        note: 'Check in 3pm the day before, check out 10am day after wedding.',  price: 3250 },
  { key: '3', label: 'Three nights',      note: 'Arrive Friday, stay through Sunday morning.',                     price: 4500 },
]

const UPGRADES = [
  { key: 'reh-sm',       label: 'Rehearsal Dinner on Site (up to 50 guests)',  note: 'Max 4 hours. Under 25 guests included free for all Friday overnight stays.', price: 1000 },
  { key: 'reh-md',       label: 'Rehearsal Dinner on Site (50–100 guests)',    note: 'Max 4 hours.',                                                               price: 2000 },
  { key: 'reh-lg',       label: 'Rehearsal Dinner on Site (100–200 guests)',   note: 'Max 4 hours.',                                                               price: 3000 },
  { key: 'late-out',     label: 'Late Check Out (1pm)',                         note: 'Standard overnight check out is 10am.',                                      price: 1000 },
  { key: 'early-in',     label: 'Early Check In (Noon)',                        note: 'Standard overnight check in is 3pm.',                                        price: 1000 },
  { key: 'extra-hour',   label: 'Extra Hour of Wedding',                        note: 'Event must finish by 11pm. Special circumstances may allow midnight finish.', price: 750  },
  { key: 'extra-event',  label: 'Extra Event (40+ guests)',                     note: 'Large exit brunch, cultural celebration, or similar.',                       price: 1000 },
  { key: 'early-makeup', label: 'Early Hair & Makeup Check In',                 note: 'From 7am, up to 10 guests. Newlywed Suite access only.',                     price: 750  },
]

const DISCOUNTS_5 = [
  { key: 'ceremony-offsite', label: 'Ceremony Off Site',              note: 'e.g. ceremony held in a church or other venue.' },
  { key: 'early-finish',     label: 'Early Finish',                    note: 'All non-overnight guests departed by 6pm.' },
  { key: 'rec-vendors',      label: 'Using Only Recommended Vendors',  note: 'Caterers, florists, DJs, hair & makeup, photographers. Exceptions: dessert, food trucks, officiant, transportation.' },
]

const DISCOUNTS_10 = [
  { key: 'military',   label: 'Military / Veteran / First Responder', note: 'Active military, veterans, and first responders. Veteran parents do not qualify.' },
  { key: 'early-2026', label: 'Wedding Apr–Jun 2026',                  note: 'Wedding must be held April–June 2026. Limited dates remain. Does not apply to Last Call dates.' },
]

const NEXT_STEPS = [
  { key: 'more-info',    label: 'Be contacted with more information' },
  { key: 'contract',     label: 'Be sent a contract' },
  { key: 'pre-tour',     label: 'Just let us know a little more about your wedding before your tour' },
  { key: 'planning',     label: 'Learn more about full planning services' },
]

const INCLUDED = [
  'Classic white Chiavari chairs',
  'Tables: rounds, rectangulars, cocktail tables',
  'On-site coordinator (planning meetings + full wedding day)',
  'Drop-off appointment the day before',
  'Wedding rehearsal',
  'Décor inventory: table numbers, arbors, card boxes, lanterns, signs, and more (free to use)',
  'Ballroom, patio, bar, and rooftop for up to 12 hours',
  'Manor library, dining room, and sitting room',
  'Kitchen and bedrooms for VIPs to get ready',
  'Newlywed Suite for the couple to get ready',
  'BYO alcohol, no corkage fees',
  'Licensed in-house bartending service (required when serving alcohol)',
  'Choose your own vendors for everything else, no required vendor list',
  'Parking on-site',
  'Wi-Fi throughout the manor',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n) {
  return '$' + Math.round(n).toLocaleString()
}

function Toggle({ checked, onChange, id }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-[var(--forest)] ${
        checked ? 'bg-[var(--forest)]' : 'bg-[var(--border)]'
      }`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function SectionHead({ num, label }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--ink-light)] mb-5" style={{ fontFamily: 'var(--font-ui)' }}>
      {num} — {label}
    </p>
  )
}

function LineItem({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-[13px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-body)' }}>{label}</span>
      <span className={`text-[13px] font-medium ${highlight ? 'text-[var(--forest)]' : 'text-[var(--ink-mid)]'}`} style={{ fontFamily: 'var(--font-ui)' }}>{value}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PricingCalculator() {
  // Calculator state
  const [season, setSeason]     = useState(null)
  const [guests, setGuests]     = useState('50-100')
  const [nights, setNights]     = useState('0')
  const [upgrades, setUpgrades] = useState(new Set())
  const [disc5, setDisc5]       = useState(new Set())
  const [disc10, setDisc10]     = useState(new Set())

  // Contact form state
  const [nextSteps, setNextSteps] = useState(new Set())
  const [weddingDate, setWeddingDate] = useState('')
  const [p1Name, setP1Name]   = useState('')
  const [p1Email, setP1Email] = useState('')
  const [p1Phone, setP1Phone] = useState('')
  const [p2Name, setP2Name]   = useState('')
  const [p2Phone, setP2Phone] = useState('')
  const [notes, setNotes]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [submitError, setSubmitError] = useState('')

  function toggleSet(setter, key) {
    setter(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const isLastCall = season === 'lastcall-2026'

  const result = useMemo(() => {
    if (!season) return null
    const base       = SEASONS.find(s => s.key === season).price
    const guestMod   = GUEST_TIERS.find(g => g.key === guests)?.modifier ?? 0
    // Last Call 2026: overnights at $1,000/night flat
    const nightsNum  = parseInt(nights, 10) || 0
    const nightsAmt  = isLastCall ? nightsNum * 1000 : (NIGHTS.find(n => n.key === nights)?.price ?? 0)
    const upgradeAmt = UPGRADES.filter(u => upgrades.has(u.key)).reduce((s, u) => s + u.price, 0)
    const subtotal   = base + guestMod + nightsAmt + upgradeAmt
    const discPct    = (disc5.size * 0.05) + (disc10.size * 0.10)
    const discAmt    = subtotal * discPct
    const total      = subtotal - discAmt
    const perPayment = total / 3
    return { base, guestMod, nightsAmt, upgradeAmt, subtotal, discPct, discAmt, total, perPayment }
  }, [season, guests, nights, upgrades, disc5, disc10, isLastCall])

  const wantsContract = nextSteps.has('contract')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!p1Name || !p1Email) return
    if (!season)                              { setSubmitError('Please select a wedding season.'); return }
    if (wantsContract && !weddingDate.trim()) { setSubmitError('Please enter a wedding date to request a contract.'); return }
    if (wantsContract && !p1Phone.trim())     { setSubmitError('Please enter a phone number to request a contract.'); return }
    setSubmitting(true)
    setSubmitError('')

    const payload = {
      // Calculator selections
      season:   SEASONS.find(s => s.key === season)?.label || '',
      guests:   GUEST_TIERS.find(g => g.key === guests)?.label || '',
      nights:   NIGHTS.find(n => n.key === nights)?.label || '',
      upgrades: UPGRADES.filter(u => upgrades.has(u.key)).map(u => u.label),
      discounts5:  DISCOUNTS_5.filter(d => disc5.has(d.key)).map(d => d.label),
      discounts10: DISCOUNTS_10.filter(d => disc10.has(d.key)).map(d => d.label),
      estimate: result ? Math.round(result.total) : 0,
      perPayment: result ? Math.round(result.perPayment) : 0,
      // Contact
      nextSteps: NEXT_STEPS.filter(s => nextSteps.has(s.key)).map(s => s.label),
      weddingDate,
      p1Name, p1Email, p1Phone,
      p2Name, p2Phone,
      notes,
      // UTM
      ...getUTM(),
    }

    try {
      const res = await fetch('/api/calculator-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'calculator_submit', {
          season: SEASONS.find(s => s.key === season)?.label || '',
          guests: GUEST_TIERS.find(g => g.key === guests)?.label || '',
          estimate: result ? Math.round(result.total) : 0,
        })
      }
    } catch {
      setSubmitError('Something went wrong. Please email us directly at info@rixeymanor.com')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = 'w-full border border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none focus:border-[var(--forest)] transition-colors'

  return (
    <div id="calculator" className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-14 lg:gap-16 items-start">

        {/* ── Left: form ── */}
        <div className="flex flex-col gap-12">

          {/* 1. Season */}
          <div>
            <SectionHead num="01" label="Wedding Season" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {SEASONS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSeason(s.key)}
                  className={`text-left p-4 border transition-all duration-150 ${
                    season === s.key ? 'border-[var(--forest)] bg-[var(--forest)]/5' : s.special ? 'border-[var(--rose)] hover:border-[var(--rose-light)]' : 'border-[var(--border)] hover:border-[var(--sage)]'
                  }`}
                >
                  {s.special && <span className="block text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--rose)] mb-1" style={{ fontFamily: 'var(--font-ui)' }}>Limited dates</span>}
                  <span className="block text-[15px] text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{s.label}</span>
                  <span className="block text-[12px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-body)' }}>{s.months}</span>
                  <span className="block text-[13px] font-medium text-[var(--forest)] mt-2" style={{ fontFamily: 'var(--font-ui)' }}>{fmt(s.price)}</span>
                  {s.specialNote && <span className="block text-[11px] text-[var(--ink-light)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>{s.specialNote}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Guest count */}
          <div>
            <SectionHead num="02" label="Guest Count" />
            <p className="text-[13px] text-[var(--ink-light)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
              Guests over approximately 100 will need a tent on the patio, rented separately.
            </p>
            <div className="flex flex-wrap gap-3">
              {GUEST_TIERS.map(g => (
                <button
                  key={g.key}
                  onClick={() => setGuests(g.key)}
                  className={`px-5 py-3 border text-[14px] transition-all duration-150 ${
                    guests === g.key ? 'border-[var(--forest)] bg-[var(--forest)]/5 text-[var(--ink)]' : 'border-[var(--border)] text-[var(--ink-mid)] hover:border-[var(--sage)]'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {g.label}
                  {g.modifier !== 0 && (
                    <span className="ml-2 text-[12px] text-[var(--ink-light)]">
                      {g.modifier > 0 ? `+${fmt(g.modifier)}` : fmt(g.modifier)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Overnight stays */}
          <div>
            <SectionHead num="03" label="Overnight Stays" />
            <p className="text-[13px] text-[var(--ink-light)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
              The manor sleeps up to 14 guests comfortably across the manor house and Blacksmith Cottage.
              {isLastCall && <span className="block text-[var(--rose)] mt-1">Last Call 2026 rate: $1,000 per night.</span>}
            </p>
            <div className="flex flex-col gap-2">
              {NIGHTS.map(n => {
                const nightCount = parseInt(n.key, 10) || 0
                const displayPrice = isLastCall ? nightCount * 1000 : n.price
                return (
                  <button
                    key={n.key}
                    onClick={() => setNights(n.key)}
                    className={`flex items-start justify-between gap-4 text-left p-4 border transition-all duration-150 ${
                      nights === n.key ? 'border-[var(--forest)] bg-[var(--forest)]/5' : 'border-[var(--border)] hover:border-[var(--sage)]'
                    }`}
                  >
                    <div>
                      <span className="block text-[14px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>{n.label}</span>
                      {n.note && <span className="block text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>{n.note}</span>}
                    </div>
                    {displayPrice > 0 && (
                      <span className="text-[13px] font-medium text-[var(--forest)] whitespace-nowrap mt-0.5" style={{ fontFamily: 'var(--font-ui)' }}>+{fmt(displayPrice)}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. What's included */}
          <div>
            <SectionHead num="04" label="Included with every booking" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {INCLUDED.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--forest)] flex-shrink-0" />
                  <span className="text-[14px] text-[var(--ink-mid)] leading-snug" style={{ fontFamily: 'var(--font-body)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Upgrades */}
          <div>
            <SectionHead num="05" label="Upgrades" />
            <div className="flex flex-col gap-0">
              {UPGRADES.map(u => (
                <div key={u.key} className="flex items-start gap-4 py-4 border-b border-[var(--border)]">
                  <Toggle checked={upgrades.has(u.key)} onChange={() => toggleSet(setUpgrades, u.key)} id={u.key} />
                  <label htmlFor={u.key} className="flex-1 cursor-pointer">
                    <span className="block text-[14px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>{u.label}</span>
                    <span className="block text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>{u.note}</span>
                  </label>
                  <span className="text-[13px] font-medium text-[var(--forest)] whitespace-nowrap" style={{ fontFamily: 'var(--font-ui)' }}>+{fmt(u.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Discounts */}
          <div>
            <SectionHead num="06" label="Discounts" />

            <p className="text-[11px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-3" style={{ fontFamily: 'var(--font-ui)' }}>5% each</p>
            <div className="flex flex-col mb-8">
              {DISCOUNTS_5.map(d => (
                <div key={d.key} className="flex items-start gap-4 py-4 border-b border-[var(--border)]">
                  <Toggle checked={disc5.has(d.key)} onChange={() => toggleSet(setDisc5, d.key)} id={d.key} />
                  <label htmlFor={d.key} className="flex-1 cursor-pointer">
                    <span className="block text-[14px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>{d.label}</span>
                    <span className="block text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>{d.note}</span>
                  </label>
                </div>
              ))}
            </div>

            <p className="text-[11px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-3" style={{ fontFamily: 'var(--font-ui)' }}>10% each</p>
            <div className="flex flex-col">
              {DISCOUNTS_10.map(d => (
                <div key={d.key} className="flex items-start gap-4 py-4 border-b border-[var(--border)]">
                  <Toggle checked={disc10.has(d.key)} onChange={() => toggleSet(setDisc10, d.key)} id={d.key} />
                  <label htmlFor={d.key} className="flex-1 cursor-pointer">
                    <span className="block text-[14px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>{d.label}</span>
                    <span className="block text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>{d.note}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Contact form */}
          <div className="border-t-2 border-[var(--forest)] pt-10">
            <SectionHead num="07" label="Send yourself a copy" />

            {submitted ? (
              <div className="bg-[var(--cream)] border border-[var(--border)] p-8">
                <p className="text-[20px] text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  <em>Sent.</em>
                </p>
                <p className="body-copy text-[15px]">
                  A copy of your estimate has been sent to {p1Email}. We'll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <p className="body-copy text-[15px]">
                  Fill in your details and we'll email you a copy of this estimate. This is also how we start the booking process.
                </p>

                {/* Next steps */}
                <div>
                  <p className="text-[13px] text-[var(--ink-mid)] mb-3" style={{ fontFamily: 'var(--font-body)' }}>Would you like to…</p>
                  <div className="flex flex-col gap-3">
                    {NEXT_STEPS.map(s => (
                      <div key={s.key} className="flex items-center gap-3">
                        <Toggle checked={nextSteps.has(s.key)} onChange={() => toggleSet(setNextSteps, s.key)} id={`ns-${s.key}`} />
                        <label htmlFor={`ns-${s.key}`} className="text-[14px] text-[var(--ink-mid)] cursor-pointer" style={{ fontFamily: 'var(--font-body)' }}>{s.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[12px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                    Do you have a specific date in mind? {wantsContract && <span className="text-[var(--rose)]">*</span>}
                  </label>
                  <input
                    type="text"
                    value={weddingDate}
                    onChange={e => setWeddingDate(e.target.value)}
                    placeholder="e.g. October 4, 2026"
                    required={wantsContract}
                    className={inputCls}
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                  {wantsContract && !weddingDate.trim() && (
                    <p className="text-[12px] text-[var(--rose)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>Required to request a contract</p>
                  )}
                </div>

                {/* Partner 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                      Partner One Name <span className="text-[var(--rose)]">*</span>
                    </label>
                    <input type="text" required value={p1Name} onChange={e => setP1Name(e.target.value)} className={inputCls} style={{ fontFamily: 'var(--font-body)' }} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                      Partner One Email <span className="text-[var(--rose)]">*</span>
                    </label>
                    <input type="email" required value={p1Email} onChange={e => setP1Email(e.target.value)} className={inputCls} style={{ fontFamily: 'var(--font-body)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                    Partner One Phone {wantsContract ? <span className="text-[var(--rose)]">*</span> : <span className="text-[11px] normal-case tracking-normal text-[var(--ink-light)]">(optional)</span>}
                  </label>
                  <input type="tel" required={wantsContract} value={p1Phone} onChange={e => setP1Phone(e.target.value)} className={inputCls} style={{ fontFamily: 'var(--font-body)' }} />
                </div>

                {/* Partner 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>Partner Two Name</label>
                    <input type="text" value={p2Name} onChange={e => setP2Name(e.target.value)} className={inputCls} style={{ fontFamily: 'var(--font-body)' }} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>Partner Two Phone</label>
                    <input type="tel" value={p2Phone} onChange={e => setP2Phone(e.target.value)} className={inputCls} style={{ fontFamily: 'var(--font-body)' }} />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[12px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                    Is there anything else you'd like to share?
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={4}
                    className={`${inputCls} resize-none`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>

                {submitError && (
                  <p className="text-[13px] text-[var(--rose)]" style={{ fontFamily: 'var(--font-body)' }}>{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary self-start disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending…' : 'Send my estimate'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* ── Right: sticky result panel ── */}
        <div className="hidden lg:block lg:sticky lg:top-32">
          <div className="bg-[var(--cream)] border border-[var(--border)] p-8">
            {!result ? (
              <p className="text-[15px] text-[var(--ink-light)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Select a season to see your estimate.
              </p>
            ) : (
              <>
                <p className="eyebrow mb-5">Your estimate</p>
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <p className="text-[52px] leading-none text-[var(--forest)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{fmt(result.total)}</p>
                  <p className="text-[13px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-body)' }}>Estimated total</p>
                </div>
                <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-[var(--border)]">
                  <LineItem label="Season base" value={fmt(result.base)} />
                  {result.guestMod !== 0 && <LineItem label="Guest count" value={(result.guestMod > 0 ? '+' : '') + fmt(result.guestMod)} />}
                  {result.nightsAmt > 0 && <LineItem label="Overnight stays" value={'+' + fmt(result.nightsAmt)} />}
                  {result.upgradeAmt > 0 && <LineItem label="Upgrades" value={'+' + fmt(result.upgradeAmt)} />}
                  {result.discAmt > 0 && <LineItem label={`Discounts (${Math.round(result.discPct * 100)}%)`} value={'−' + fmt(result.discAmt)} highlight />}
                </div>
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <p className="text-[13px] text-[var(--ink-light)] mb-1" style={{ fontFamily: 'var(--font-body)' }}>Paid in 3 instalments</p>
                  <p className="text-[24px] text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>{fmt(result.perPayment)} each</p>
                  <p className="text-[11px] text-[var(--ink-light)] mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>Retainer on booking · halfway through planning · 3 months before.</p>
                </div>
                <p className="text-[12px] text-[var(--ink-light)] mb-0" style={{ fontFamily: 'var(--font-body)' }}>
                  Final pricing confirmed at your tour. Fill in your details below to save this estimate.
                </p>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Mobile sticky bar */}
      {result && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--cream)] border-t border-[var(--border)] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] tracking-widest uppercase text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>Estimate</p>
            <p className="text-[24px] leading-tight text-[var(--forest)]" style={{ fontFamily: 'var(--font-display)' }}>{fmt(result.total)}</p>
          </div>
          <a href="#calculator" className="btn-primary text-[11px]" onClick={e => { e.preventDefault(); document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Send to me
          </a>
        </div>
      )}
    </div>
  )
}
