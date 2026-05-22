'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { getUTM } from '@/lib/utm'
import { getVisitorContext } from '@/lib/visitor'

// ── Pricing data ──────────────────────────────────────────────────────────────
// Three packages, two-tier season. Off-season is Jan/Feb/Jul/Aug; peak is
// everything else. Every package includes bartending, linens, the silk floral
// + candle package, the venue team, and the coordinator — they're priced in,
// not added on. See PRICING-RESTRUCTURE brief for the source of these numbers.

const PACKAGES = [
  {
    key: 'estate-weekend',
    label: 'The Estate Weekend',
    subtitle: 'Friday afternoon through Sunday morning',
    summary: 'Rehearsal dinner Friday, wedding Saturday, brunch and exit Sunday. Two nights of lodging for 14. The whole estate, the whole weekend.',
    prices: { off: 16000, peak: 21000 },
    capacity: { saturday: 200, friday: 150 },
  },
  {
    key: 'wedding-day',
    label: 'The Wedding Day',
    subtitle: 'Saturday, 8am to 10pm',
    summary: 'Setup, ceremony, reception. No rehearsal dinner. Overnights available as upgrades.',
    prices: { off: 12000, peak: 15500 },
    capacity: { saturday: 200 },
  },
  {
    key: 'midweek',
    label: 'The Midweek Wedding',
    subtitle: 'Tuesday or Wednesday, 8am to 9pm',
    summary: 'Same venue, same team, same coordinator. Just a Tuesday. No overnights available.',
    prices: { off: 7000, peak: 9000 },
    capacity: { saturday: 200 },
  },
]

const SEASON_TIERS = [
  { key: 'off',  label: 'Off-season',  months: 'January, February, July, August' },
  { key: 'peak', label: 'Peak season', months: 'March–June, September–December' },
]

// Saturday guest tiers — every package
const SAT_TIERS = [
  { key: 'u100',    label: 'Up to 100',  add: 0 },
  { key: '100-150', label: '101–150',    add: 1500 },
  { key: '150-200', label: '151–200',    add: 3000 },
]

// Friday guest tiers — Estate Weekend only
const FRI_TIERS = [
  { key: 'u50',     label: 'Up to 50',   add: 0 },
  { key: '50-100',  label: '51–100',     add: 1500 },
  { key: '100-150', label: '101–150',    add: 3000 },
]

// Extra event sizes — same +$1,500 per 50 guests math as Saturday, all packages
const EXTRA_EVENT_TIERS = [
  { key: 'ee-u50',     label: 'Up to 50 guests',  price: 1500 },
  { key: 'ee-50-100',  label: '51–100 guests',    price: 3000 },
  { key: 'ee-100-150', label: '101–150 guests',   price: 4500 },
  { key: 'ee-150-200', label: '151–200 guests',   price: 6000 },
]

// Upgrades. `packages` lists which package keys the upgrade is available for.
const UPGRADES = [
  {
    key: 'third-night',
    label: 'Third night',
    note: 'Often used for mehndi, baraat, bachelor/bachelorette, or family arrival night.',
    price: 1750,
    packages: ['estate-weekend'],
  },
  {
    key: 'overnight-1',
    label: 'Overnight — one night',
    note: 'Night before OR night after the wedding. Manor + Blacksmith Cottage sleep 14.',
    price: 1750,
    packages: ['wedding-day'],
  },
  {
    key: 'overnight-2',
    label: 'Overnight — two nights',
    note: 'Both nights around the wedding.',
    price: 3250,
    packages: ['wedding-day'],
    excludes: ['overnight-1'],
  },
]

// Discounts. Stackable, capped at MAX_DISCOUNT_PCT in aggregate.
const DISCOUNTS = [
  { key: 'offsite-ceremony', label: 'Off-site ceremony',                       note: 'Church or other venue for the ceremony.',                                                            percent: 5  },
  { key: 'rec-vendors',      label: 'Recommended vendors only',                note: 'Caterers, florists, DJs, hair & makeup, photographers from our list.',                              percent: 5  },
  { key: 'small-wedding',    label: 'Under 50 Saturday guests',                note: 'A smaller wedding day.',                                                                              percent: 10 },
  { key: 'military',         label: 'Military / veteran / first responder',    note: 'Active or veteran. Veteran parents do not qualify.',                                                  percent: 10 },
]
const MAX_DISCOUNT_PCT = 20

const NEXT_STEPS = [
  { key: 'more-info', label: 'Be contacted with more information' },
  { key: 'contract',  label: 'Be sent a contract' },
  { key: 'pre-tour',  label: 'Just let us know a little more about your wedding before your tour' },
  { key: 'planning',  label: 'Learn more about full planning services' },
]

// The "what's included" list used to live inside the calculator as Section #5.
// It now lives ABOVE the calculator on /pricing (as <InclusionGrid>) so couples
// see the full inclusion picture before they start building their estimate.
// Calculator stays focused on price-building. Single source of truth for the
// grid data: lib/inclusionRows.js.

const TAX_RATE = 0.06          // Virginia 6% sales tax on venue

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
  const [pkg, setPkg]               = useState(null)        // package key
  const [season, setSeason]         = useState(null)        // season tier key
  const [satGuests, setSatGuests]   = useState('u100')
  const [friGuests, setFriGuests]   = useState('u50')
  const [upgrades, setUpgrades]     = useState(new Set())
  const [extraHours, setExtraHours] = useState(0)           // 0–3 extra manor-interior hours
  const [extraEvent, setExtraEvent] = useState(null)        // tier key or null
  const [discounts, setDiscounts]   = useState(new Set())

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

  // Pre-fill name fields when we know the visitor is one of the couple.
  useEffect(() => {
    const { firstName, partnerName, role } = getVisitorContext() || {}
    if (role === 'couple' || !role) {
      if (firstName && !p1Name) setP1Name(firstName)
      if (partnerName && !p2Name) setP2Name(partnerName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleSet(setter, key) {
    setter(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // When the user toggles an overnight upgrade with `excludes`, drop the
  // excluded keys to keep the selection coherent (one vs two nights, not both).
  function toggleUpgrade(key) {
    setUpgrades(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
        return next
      }
      const def = UPGRADES.find(u => u.key === key)
      if (def?.excludes) def.excludes.forEach(k => next.delete(k))
      // Also drop sibling overnight upgrades that mutually exclude this one
      UPGRADES.forEach(other => {
        if (other.excludes?.includes(key)) next.delete(other.key)
      })
      next.add(key)
      return next
    })
  }

  const pkgDef    = useMemo(() => PACKAGES.find(p => p.key === pkg)   ?? null, [pkg])
  const seasonDef = useMemo(() => SEASON_TIERS.find(s => s.key === season) ?? null, [season])
  const isEW      = pkg === 'estate-weekend'
  const isMW      = pkg === 'midweek'
  const allowsExtraHour = pkg === 'estate-weekend' || pkg === 'wedding-day'

  // Reset selections that don't apply when package changes
  useEffect(() => {
    if (!isEW) setFriGuests('u50')
    if (!allowsExtraHour) setExtraHours(0)
    // Drop any upgrades not available for this package
    setUpgrades(prev => {
      const next = new Set()
      for (const u of UPGRADES) {
        if (u.packages.includes(pkg) && prev.has(u.key)) next.add(u.key)
      }
      return next
    })
  }, [pkg, isEW, allowsExtraHour])

  const result = useMemo(() => {
    if (!pkg || !season) return null
    const base       = pkgDef.prices[season]
    const satMod     = SAT_TIERS.find(g => g.key === satGuests)?.add ?? 0
    const friMod     = isEW ? (FRI_TIERS.find(g => g.key === friGuests)?.add ?? 0) : 0
    const upgradeAmt = UPGRADES
      .filter(u => upgrades.has(u.key) && u.packages.includes(pkg))
      .reduce((s, u) => s + u.price, 0)
    const hoursAmt   = allowsExtraHour ? extraHours * 750 : 0
    const extraEventAmt = extraEvent ? (EXTRA_EVENT_TIERS.find(e => e.key === extraEvent)?.price ?? 0) : 0
    const subtotal   = base + satMod + friMod + upgradeAmt + hoursAmt + extraEventAmt
    const rawPct     = [...discounts].reduce((s, k) => s + (DISCOUNTS.find(d => d.key === k)?.percent ?? 0), 0)
    const discPct    = Math.min(rawPct, MAX_DISCOUNT_PCT) / 100
    const discAmt    = subtotal * discPct
    const subAfterDisc = subtotal - discAmt
    const tax        = subAfterDisc * TAX_RATE
    const total      = subAfterDisc + tax
    const perPayment = total / 3
    return { base, satMod, friMod, upgradeAmt, hoursAmt, extraEventAmt, subtotal, rawPct, discPct, discAmt, subAfterDisc, tax, total, perPayment }
  }, [pkg, pkgDef, season, satGuests, friGuests, upgrades, extraHours, extraEvent, discounts, isEW, allowsExtraHour])

  // Auto-save snapshot for /what-it-costs BudgetCalculator. Keeps the legacy
  // shape (season/guests/nights labels, bartenders.cost) so the budget tool
  // doesn't break. bartenders.cost is now 0 — bartending is in the venue total.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!pkg || !season || !result) return

    const satObj = SAT_TIERS.find(g => g.key === satGuests)
    const friObj = isEW ? FRI_TIERS.find(g => g.key === friGuests) : null
    const upgradesArr = UPGRADES
      .filter(u => upgrades.has(u.key) && u.packages.includes(pkg))
      .map(u => ({ key: u.key, label: u.label, price: u.price }))
    if (extraHours > 0 && allowsExtraHour) {
      upgradesArr.push({ key: 'extra-hour', label: `Extra hour${extraHours > 1 ? `s × ${extraHours}` : ''} (tent + amplified music + fire pit)`, price: extraHours * 750 })
    }
    if (extraEvent) {
      const ee = EXTRA_EVENT_TIERS.find(e => e.key === extraEvent)
      upgradesArr.push({ key: 'extra-event', label: `Extra event (${ee.label.toLowerCase()})`, price: ee.price })
    }
    const discountsArr = DISCOUNTS
      .filter(d => discounts.has(d.key))
      .map(d => ({ key: d.key, label: d.label, percent: d.percent }))

    // For BudgetCalculator's display: combine package + season + guest tiers
    // into the legacy label fields so the venue card still reads sensibly.
    const seasonLabel = `${pkgDef.label} · ${seasonDef.label}`
    const guestsLabel = isEW
      ? `Saturday ${satObj?.label?.toLowerCase()} · Friday ${friObj?.label?.toLowerCase()}`
      : `Saturday ${satObj?.label?.toLowerCase()}`

    const snapshot = {
      saved_at: new Date().toISOString(),
      package: { key: pkg, label: pkgDef.label, base: pkgDef.prices[season] },
      season:  { key: season, label: seasonLabel, months: seasonDef.months },
      guests:  { key: satGuests, label: guestsLabel, modifier: (result.satMod + result.friMod) },
      nights:  { key: 'n/a', label: '', amount: 0 },
      upgrades: upgradesArr,
      discounts: discountsArr,
      totals: {
        subtotal:           result.subtotal,
        discount_pct:       result.rawPct,           // raw uncapped percent (for display)
        discount_applied:   Math.round(result.discPct * 100),
        discount_amount:    result.discAmt,
        sub_after_discount: result.subAfterDisc,
        tax:                result.tax,
        total:              result.total,
        per_payment:        result.perPayment,
      },
      bartenders: { included: true, count: 0, rate: 0, cost: 0 },
    }

    try {
      localStorage.setItem('rixey_venue_snapshot_v1', JSON.stringify(snapshot))
    } catch {
      // Quota exceeded or disabled — not worth surfacing to the couple
    }
  }, [pkg, pkgDef, season, seasonDef, satGuests, friGuests, isEW, upgrades, extraHours, extraEvent, allowsExtraHour, discounts, result])

  const wantsContract = nextSteps.has('contract')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!p1Name || !p1Email) return
    if (!pkg)                                 { setSubmitError('Please choose a package.'); return }
    if (!season)                              { setSubmitError('Please select off-season or peak season.'); return }
    if (wantsContract && !weddingDate.trim()) { setSubmitError('Please enter a wedding date to request a contract.'); return }
    if (wantsContract && !p1Phone.trim())     { setSubmitError('Please enter a phone number to request a contract.'); return }
    setSubmitting(true)
    setSubmitError('')

    // Collapse the new fields back into the API's existing flat shape so the
    // calculator_submissions table doesn't need a migration to accept this
    // submission. Package + season are concatenated into the legacy `season`
    // text column; Saturday/Friday guest counts are concatenated into `guests`.
    const upgradeLabels = []
    UPGRADES.filter(u => upgrades.has(u.key) && u.packages.includes(pkg)).forEach(u => upgradeLabels.push(u.label))
    if (extraHours > 0 && allowsExtraHour) {
      upgradeLabels.push(`Extra hour${extraHours > 1 ? `s × ${extraHours}` : ''} (manor interior)`)
    }
    if (extraEvent) {
      const ee = EXTRA_EVENT_TIERS.find(e => e.key === extraEvent)
      upgradeLabels.push(`Extra event (${ee.label.toLowerCase()})`)
    }

    const discount5  = DISCOUNTS.filter(d => discounts.has(d.key) && d.percent === 5).map(d => d.label)
    const discount10 = DISCOUNTS.filter(d => discounts.has(d.key) && d.percent === 10).map(d => d.label)

    const satLabel = SAT_TIERS.find(g => g.key === satGuests)?.label
    const friLabel = isEW ? FRI_TIERS.find(g => g.key === friGuests)?.label : null
    const guestsField = friLabel ? `Saturday ${satLabel} · Friday ${friLabel}` : `Saturday ${satLabel}`

    // Structured add-ons for the ContractHouse handoff: { calculator_key: qty }.
    // Keys match service_items.calculator_key in ContractHouse's Rixey seed.
    const addons = {}
    UPGRADES.filter(u => upgrades.has(u.key) && u.packages.includes(pkg)).forEach(u => { addons[u.key] = 1 })
    if (extraHours > 0 && allowsExtraHour) addons['extra-hour'] = extraHours
    if (extraEvent) {
      const ee = EXTRA_EVENT_TIERS.find(e => e.key === extraEvent)
      // ContractHouse prices extra-event at $1,500/unit; qty = number of $1,500 blocks.
      if (ee) addons['extra-event'] = Math.max(1, Math.round(ee.price / 1500))
    }

    const payload = {
      season:   `${pkgDef.label} · ${seasonDef.label}`,
      guests:   guestsField,
      nights:   '',                                      // legacy — overnights now live in upgrades
      upgrades: upgradeLabels,
      discounts5: discount5,
      discounts10: discount10,
      estimate:   result ? Math.round(result.total) : 0,
      tax:        result ? Math.round(result.tax) : 0,
      perPayment: result ? Math.round(result.perPayment) : 0,
      // Bartending is included in package price — send zeroes for back-compat.
      bartenders: 0,
      bartenderRate: 0,
      bartenderCost: 0,
      // Structured fields for the ContractHouse handoff (draft-contract creation).
      packageKey:     pkg,
      seasonKey:      season,
      subtotalPreTax: result ? Math.round(result.subAfterDisc) : 0,
      addons,
      nextSteps:   NEXT_STEPS.filter(s => nextSteps.has(s.key)).map(s => s.label),
      weddingDate, p1Name, p1Email, p1Phone, p2Name, p2Phone, notes,
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
          package: pkgDef.label,
          season: seasonDef.label,
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

          {/* 1. Package */}
          <div>
            <SectionHead num="01" label="Choose your package" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {PACKAGES.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPkg(p.key)}
                  className={`text-left p-5 border transition-all duration-150 ${
                    pkg === p.key ? 'border-[var(--forest)] bg-[var(--forest)]/5' : 'border-[var(--border)] hover:border-[var(--sage)]'
                  }`}
                >
                  <span className="block text-[17px] text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{p.label}</span>
                  <span className="block text-[12px] tracking-[0.12em] uppercase text-[var(--ink-light)] mb-3" style={{ fontFamily: 'var(--font-ui)' }}>{p.subtitle}</span>
                  <span className="block text-[13px] text-[var(--ink-mid)] leading-snug mb-3" style={{ fontFamily: 'var(--font-body)' }}>{p.summary}</span>
                  <span className="block text-[13px] font-medium text-[var(--forest)]" style={{ fontFamily: 'var(--font-ui)' }}>
                    From {fmt(p.prices.off)} off-season · {fmt(p.prices.peak)} peak
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Season */}
          <div>
            <SectionHead num="02" label="Season" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SEASON_TIERS.map(s => {
                const price = pkgDef ? pkgDef.prices[s.key] : null
                return (
                  <button
                    key={s.key}
                    onClick={() => setSeason(s.key)}
                    disabled={!pkg}
                    className={`text-left p-5 border transition-all duration-150 ${
                      season === s.key ? 'border-[var(--forest)] bg-[var(--forest)]/5'
                        : pkg ? 'border-[var(--border)] hover:border-[var(--sage)]' : 'border-[var(--border)] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="block text-[15px] text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{s.label}</span>
                    <span className="block text-[12px] text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-body)' }}>{s.months}</span>
                    {price != null && (
                      <span className="block text-[13px] font-medium text-[var(--forest)]" style={{ fontFamily: 'var(--font-ui)' }}>{fmt(price)}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Saturday guest count + the under-50 discount lives here, so couples
              see it at the moment of deciding their guest count — not buried in the
              discounts section below. */}
          <div>
            <SectionHead num="03" label="Saturday guest count" />
            <p className="text-[13px] text-[var(--ink-light)] mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              Maximum 200 guests. Every 50 (or part of 50) over 100 adds $1,500.
            </p>
            <p className="text-[13px] text-[var(--ink-mid)] mb-4 italic" style={{ fontFamily: 'var(--font-body)' }}>
              You can always increase your guest count later — start on the lower end if you're unsure.
            </p>
            <div className="flex flex-wrap gap-3 mb-5">
              {SAT_TIERS.map(g => (
                <button
                  key={g.key}
                  onClick={() => setSatGuests(g.key)}
                  className={`px-5 py-3 border text-[14px] transition-all duration-150 ${
                    satGuests === g.key ? 'border-[var(--forest)] bg-[var(--forest)]/5 text-[var(--ink)]' : 'border-[var(--border)] text-[var(--ink-mid)] hover:border-[var(--sage)]'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {g.label}
                  {g.add > 0 && <span className="ml-2 text-[12px] text-[var(--ink-light)]">+{fmt(g.add)}</span>}
                </button>
              ))}
            </div>

            {/* Under-50 discount toggle. Lives here (not in #6/#7) because it's
                a question about guest count, not a separate discount the couple
                hunts for. */}
            <div className="flex items-start gap-4 py-4 px-4 border border-[var(--border)] bg-[var(--cream)]">
              <Toggle
                checked={discounts.has('small-wedding')}
                onChange={() => toggleSet(setDiscounts, 'small-wedding')}
                id="small-wedding-inline"
              />
              <label htmlFor="small-wedding-inline" className="flex-1 cursor-pointer">
                <span className="block text-[14px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Will you have under 50 Saturday guests?
                </span>
                <span className="block text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                  Tick for a 10% discount. Only applies when Saturday is genuinely under 50.
                </span>
              </label>
              <span className="text-[13px] font-medium text-[var(--forest)] whitespace-nowrap" style={{ fontFamily: 'var(--font-ui)' }}>−10%</span>
            </div>
          </div>

          {/* 4. Friday guest count — Estate Weekend only */}
          {isEW && (
            <div>
              <SectionHead num="04" label="Friday guest count (rehearsal dinner)" />
              <p className="text-[13px] text-[var(--ink-light)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                Maximum 150 Friday guests. Every 50 (or part of 50) over 50 adds $1,500.
              </p>
              <div className="flex flex-wrap gap-3">
                {FRI_TIERS.map(g => (
                  <button
                    key={g.key}
                    onClick={() => setFriGuests(g.key)}
                    className={`px-5 py-3 border text-[14px] transition-all duration-150 ${
                      friGuests === g.key ? 'border-[var(--forest)] bg-[var(--forest)]/5 text-[var(--ink)]' : 'border-[var(--border)] text-[var(--ink-mid)] hover:border-[var(--sage)]'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {g.label}
                    {g.add > 0 && <span className="ml-2 text-[12px] text-[var(--ink-light)]">+{fmt(g.add)}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Upgrades — filtered by package. (Section formerly numbered 6;
              the "Included" section that used to live here has moved above
              the calculator on /pricing.) */}
          <div>
            <SectionHead num={isEW ? '05' : '04'} label="Upgrades" />
            {isMW && (
              <p className="text-[13px] text-[var(--ink-light)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                Midweek finishes at 9pm and has no overnight option. Only extra events apply here.
              </p>
            )}

            {/* Package-specific upgrade toggles */}
            <div className="flex flex-col gap-0 mb-6">
              {UPGRADES.filter(u => u.packages.includes(pkg)).map(u => (
                <div key={u.key} className="flex items-start gap-4 py-4 border-b border-[var(--border)]">
                  <Toggle checked={upgrades.has(u.key)} onChange={() => toggleUpgrade(u.key)} id={u.key} />
                  <label htmlFor={u.key} className="flex-1 cursor-pointer">
                    <span className="block text-[14px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>{u.label}</span>
                    <span className="block text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>{u.note}</span>
                  </label>
                  <span className="text-[13px] font-medium text-[var(--forest)] whitespace-nowrap" style={{ fontFamily: 'var(--font-ui)' }}>+{fmt(u.price)}</span>
                </div>
              ))}
            </div>

            {/* Extra hour — tent, amplified music, fire pit all stay open
                (EW + WD only; Midweek's 9pm finish is firm). */}
            {allowsExtraHour && (
              <div className="flex items-start gap-4 py-4 border-b border-[var(--border)]">
                <div className="flex-1">
                  <span className="block text-[14px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>Extra hour beyond 10pm</span>
                  <span className="block text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                    Tent stays open, amplified music continues, guests can still hang by the fire pit outside.
                  </span>
                </div>
                <select
                  value={extraHours}
                  onChange={e => setExtraHours(parseInt(e.target.value, 10))}
                  className="border border-[var(--border)] bg-white px-3 py-2 text-[14px] text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  <option value={0}>None</option>
                  <option value={1}>1 hour (+$750)</option>
                  <option value={2}>2 hours (+$1,500)</option>
                  <option value={3}>3 hours (+$2,250)</option>
                </select>
              </div>
            )}

            {/* Extra event — all packages */}
            <div className="flex items-start gap-4 py-4 border-b border-[var(--border)]">
              <div className="flex-1">
                <span className="block text-[14px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>Extra event</span>
                <span className="block text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                  A third distinct event beyond the two included (e.g. cultural ceremony, exit brunch). +$1,500 per 50 guests.
                  {isEW && <> A mehndi <em>as the rehearsal dinner</em> doesn't count as extra.</>}
                </span>
              </div>
              <select
                value={extraEvent ?? ''}
                onChange={e => setExtraEvent(e.target.value || null)}
                className="border border-[var(--border)] bg-white px-3 py-2 text-[14px] text-[var(--ink)] focus:outline-none focus:border-[var(--forest)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <option value="">None</option>
                {EXTRA_EVENT_TIERS.map(e => (
                  <option key={e.key} value={e.key}>{e.label} (+{fmt(e.price)})</option>
                ))}
              </select>
            </div>
          </div>

          {/* 7. Discounts. The under-50-guests discount is rendered up near the
              Saturday guest count selector instead — it's a guest-count question
              by nature. Filtering it out here keeps the UI single-source. */}
          <div>
            <SectionHead num={isEW ? '06' : '05'} label="Other discounts" />
            <p className="text-[13px] text-[var(--ink-light)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
              Stackable with the small-wedding discount above, capped at 20% total. Confirmed at signing.
            </p>
            <div className="flex flex-col mb-4">
              {DISCOUNTS.filter(d => d.key !== 'small-wedding').map(d => (
                <div key={d.key} className="flex items-start gap-4 py-4 border-b border-[var(--border)]">
                  <Toggle checked={discounts.has(d.key)} onChange={() => toggleSet(setDiscounts, d.key)} id={d.key} />
                  <label htmlFor={d.key} className="flex-1 cursor-pointer">
                    <span className="block text-[14px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>{d.label}</span>
                    <span className="block text-[12px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>{d.note}</span>
                  </label>
                  <span className="text-[13px] font-medium text-[var(--forest)] whitespace-nowrap" style={{ fontFamily: 'var(--font-ui)' }}>−{d.percent}%</span>
                </div>
              ))}
            </div>
            {result && result.rawPct > MAX_DISCOUNT_PCT && (
              <p className="text-[12px] text-[var(--rose)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                You've selected {result.rawPct}% in stackable discounts — the cap of {MAX_DISCOUNT_PCT}% applies.
              </p>
            )}
          </div>

          {/* 8. Contact form */}
          <div className="border-t-2 border-[var(--forest)] pt-10">
            <SectionHead num={isEW ? '07' : '06'} label="Send yourself a copy" />

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
                    type="date"
                    value={weddingDate}
                    onChange={e => setWeddingDate(e.target.value)}
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
                Choose a package and season to see your estimate.
              </p>
            ) : (
              <>
                <p className="eyebrow mb-5">Your estimate</p>
                <p className="text-[12px] text-[var(--ink-light)] mb-1 tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-ui)' }}>{pkgDef.label}</p>
                <p className="text-[12px] text-[var(--ink-light)] mb-5" style={{ fontFamily: 'var(--font-body)' }}>{seasonDef.label}</p>
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <p className="text-[52px] leading-none text-[var(--forest)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{fmt(result.total)}</p>
                  <p className="text-[13px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-body)' }}>Estimated total</p>
                </div>
                <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-[var(--border)]">
                  <LineItem label="Package base" value={fmt(result.base)} />
                  {result.satMod > 0 && <LineItem label="Saturday guests" value={'+' + fmt(result.satMod)} />}
                  {result.friMod > 0 && <LineItem label="Friday guests" value={'+' + fmt(result.friMod)} />}
                  {result.upgradeAmt > 0 && <LineItem label="Upgrades" value={'+' + fmt(result.upgradeAmt)} />}
                  {result.hoursAmt > 0 && <LineItem label="Extra hours (manor interior)" value={'+' + fmt(result.hoursAmt)} />}
                  {result.extraEventAmt > 0 && <LineItem label="Extra event" value={'+' + fmt(result.extraEventAmt)} />}
                  {result.discAmt > 0 && <LineItem label={`Discounts (${Math.round(result.discPct * 100)}%)`} value={'−' + fmt(result.discAmt)} highlight />}
                  <LineItem label="Sales tax (6%)" value={'+' + fmt(result.tax)} />
                </div>
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <p className="text-[13px] text-[var(--ink-light)] mb-1" style={{ fontFamily: 'var(--font-body)' }}>Paid in 3 instalments</p>
                  <p className="text-[24px] text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>{fmt(result.perPayment)} each</p>
                  <p className="text-[11px] text-[var(--ink-light)] mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>Retainer to reserve the date · halfway through planning · 3 months before the wedding.</p>
                </div>
                <p className="text-[12px] text-[var(--ink-light)] mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  Bartending, linens, silk florals and the venue team are <strong>in the price above</strong>. Nothing billed separately.
                </p>
                <Link href="/checklist" className="text-link inline-block">
                  Touring other venues? Use the checklist →
                </Link>
                <p className="text-[12px] text-[var(--ink-light)] mt-4 mb-0" style={{ fontFamily: 'var(--font-body)' }}>
                  Final pricing confirmed at your tour.
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
