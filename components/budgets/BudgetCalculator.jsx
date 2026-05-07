'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { getUTM } from '@/lib/utm'
import { getVisitorContext } from '@/lib/visitor'

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n == null) return ''
  return '$' + Math.round(n).toLocaleString()
}

function formatRange(low, high) {
  if (low == null && high == null) return null
  if (low != null && high != null) return `${fmt(low)}–${fmt(high)}`
  if (low != null)  return `from ${fmt(low)}`
  return `up to ${fmt(high)}`
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

function SectionHead({ num, label, hint }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>
        {num} — {label}
      </p>
      {hint && (
        <p className="text-[13px] text-[var(--ink-light)] mt-2" style={{ fontFamily: 'var(--font-body)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

const NEXT_STEPS = [
  { key: 'more-info', label: 'Be contacted with more information' },
  { key: 'pre-tour',  label: 'Just let us know a little more about your wedding before your tour' },
  { key: 'planning',  label: 'Learn more about full planning services' },
]

// ── Main component ───────────────────────────────────────────────────────────
export default function BudgetCalculator({
  categories,        // [{ id, slug, name, description, sort_order }]
  optionsByCategory, // { categorySlug: [{ id, slug, label, description, range_low, range_high, range_note }] }
  vendorsByOption,   // { optionId: [{ id, name, descriptor }] }
  fallbackTotalLow,
  fallbackTotalHigh,
  fallbackTotalNote,
  fallbackTotalCaveat,
}) {
  // Calculator state: { [category_slug]: option_id }
  const [selections, setSelections] = useState({})
  const [openVendorOpt, setOpenVendorOpt] = useState(null)

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

  useEffect(() => {
    const { firstName, partnerName, role } = getVisitorContext() || {}
    if (role === 'couple' || !role) {
      if (firstName && !p1Name) setP1Name(firstName)
      if (partnerName && !p2Name) setP2Name(partnerName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pickOption(catSlug, optionId) {
    setSelections(prev => ({ ...prev, [catSlug]: optionId }))
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'budget_option_pick', { category: catSlug, option_id: optionId })
    }
  }

  function clearOption(catSlug) {
    setSelections(prev => {
      const next = { ...prev }
      delete next[catSlug]
      return next
    })
  }

  function toggleVendorPanel(optionId) {
    setOpenVendorOpt(prev => (prev === optionId ? null : optionId))
    if (typeof window !== 'undefined' && window.gtag && openVendorOpt !== optionId) {
      window.gtag('event', 'budget_vendor_panel_open', { option_id: optionId })
    }
  }

  function toggleSet(setter, key) {
    setter(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // Running estimate from picked options
  const result = useMemo(() => {
    let low = 0, high = 0
    let chosenCount = 0
    let chosenWithRangeCount = 0
    const lines = []

    for (const cat of categories) {
      const optId = selections[cat.slug]
      if (optId == null) continue
      chosenCount++
      const opt = (optionsByCategory[cat.slug] || []).find(o => o.id === optId)
      if (!opt) continue
      if (opt.range_low != null) low += opt.range_low
      if (opt.range_high != null) high += opt.range_high
      if (opt.range_low != null || opt.range_high != null) chosenWithRangeCount++
      lines.push({
        category_slug: cat.slug,
        category_name: cat.name,
        option_id: opt.id,
        option_label: opt.label,
        range_low: opt.range_low ?? null,
        range_high: opt.range_high ?? null,
      })
    }

    return {
      lines,
      low: chosenWithRangeCount > 0 ? low : null,
      high: chosenWithRangeCount > 0 ? high : null,
      chosenCount,
      chosenWithRangeCount,
    }
  }, [selections, categories, optionsByCategory])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!p1Name || !p1Email) return
    setSubmitting(true); setSubmitError('')

    const selectionsPayload = {}
    for (const line of result.lines) {
      selectionsPayload[line.category_slug] = {
        category_name: line.category_name,
        option_id: line.option_id,
        option_label: line.option_label,
        range_low: line.range_low,
        range_high: line.range_high,
      }
    }

    const payload = {
      selections: selectionsPayload,
      totalLow: result.low,
      totalHigh: result.high,
      nextSteps: NEXT_STEPS.filter(s => nextSteps.has(s.key)).map(s => s.label),
      weddingDate,
      p1Name, p1Email, p1Phone,
      p2Name, p2Phone,
      notes,
      ...getUTM(),
    }

    try {
      const res = await fetch('/api/budget-calculator-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'budget_submit', { total_low: result.low, total_high: result.high })
      }
    } catch {
      setSubmitError('Something went wrong. Please email us directly at info@rixeymanor.com')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = 'w-full border border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none focus:border-[var(--forest)] transition-colors'

  // Show fallback range when nothing chosen yet
  const showFallback = result.chosenWithRangeCount === 0 && (fallbackTotalLow != null || fallbackTotalHigh != null)
  const stickyLow  = result.low  != null ? result.low  : fallbackTotalLow
  const stickyHigh = result.high != null ? result.high : fallbackTotalHigh

  return (
    <div id="budget-calculator" className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-14 lg:gap-16 items-start">

        {/* ── Left: form ── */}
        <div className="flex flex-col gap-12">

          {categories.map((cat, idx) => {
            const opts = optionsByCategory[cat.slug] || []
            const selectedOptId = selections[cat.slug] ?? null
            const num = String(idx + 1).padStart(2, '0')
            return (
              <div key={cat.slug}>
                <SectionHead num={num} label={cat.name} hint={cat.description || null} />
                <div className="flex flex-col gap-2">
                  {opts.map(opt => {
                    const isSelected = selectedOptId === opt.id
                    const range = formatRange(opt.range_low, opt.range_high)
                    const vendors = vendorsByOption[opt.id] || []
                    const panelOpen = openVendorOpt === opt.id
                    return (
                      <div
                        key={opt.id}
                        className={`border transition-all duration-150 ${
                          isSelected ? 'border-[var(--forest)] bg-[var(--forest)]/5' : 'border-[var(--border)] hover:border-[var(--sage)]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => isSelected ? clearOption(cat.slug) : pickOption(cat.slug, opt.id)}
                          className="w-full text-left p-4 flex items-start justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-[15px] text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                                {opt.label}
                              </span>
                              {vendors.length > 0 && (
                                <button
                                  type="button"
                                  onClick={e => { e.stopPropagation(); toggleVendorPanel(opt.id) }}
                                  aria-label={`Show vendors who fit ${opt.label}`}
                                  className="inline-flex items-center justify-center"
                                  style={{
                                    background: 'transparent',
                                    border: '1px solid var(--rose-light)',
                                    borderRadius: '50%',
                                    width: 20, height: 20,
                                    color: 'var(--rose)',
                                    fontFamily: 'var(--font-ui)',
                                    fontSize: 11,
                                    cursor: 'pointer',
                                    padding: 0,
                                  }}
                                >
                                  {panelOpen ? '−' : 'i'}
                                </button>
                              )}
                            </div>
                            {opt.description && (
                              <p className="block text-[12px] text-[var(--ink-light)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                                {opt.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            {range && (
                              <span className="text-[13px] font-medium text-[var(--forest)] whitespace-nowrap" style={{ fontFamily: 'var(--font-ui)' }}>
                                {range}
                              </span>
                            )}
                            {opt.range_note && (
                              <span className="block text-[11px] text-[var(--ink-light)] mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                                {opt.range_note}
                              </span>
                            )}
                          </div>
                        </button>

                        {panelOpen && vendors.length > 0 && (
                          <div className="px-4 pb-4 pt-2 border-t border-[var(--border)] bg-[var(--cream)]">
                            <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-[var(--ink-light)] mb-3" style={{ fontFamily: 'var(--font-ui)' }}>
                              Some of our favorites at this range
                            </p>
                            <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                              {vendors.map(v => (
                                <li key={v.id}>
                                  <p className="text-[14px] text-[var(--ink)] m-0" style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                                    {v.name}
                                  </p>
                                  {v.descriptor && (
                                    <p className="text-[12px] text-[var(--ink-light)] m-0 mt-0.5 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                                      {v.descriptor}
                                    </p>
                                  )}
                                </li>
                              ))}
                            </ul>
                            <p className="text-[11px] italic text-[var(--ink-light)] mt-3 mb-0" style={{ fontFamily: 'var(--font-body)' }}>
                              Your coordinator will introduce you to whichever feels right when you're ready.
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {opts.length === 0 && (
                    <p className="text-[13px] text-[var(--ink-light)] italic" style={{ fontFamily: 'var(--font-body)' }}>
                      Options coming soon.
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {/* Inline total */}
          <div className="border-t border-[var(--border)] pt-10">
            <SectionHead num={String(categories.length + 1).padStart(2, '0')} label="Your estimated total" />
            <div className="bg-[var(--cream)] border border-[var(--border)] p-8">
              {(stickyLow != null || stickyHigh != null) ? (
                <>
                  <p className="text-[11px] font-medium tracking-[0.22em] uppercase mb-2" style={{ fontFamily: 'var(--font-ui)', color: 'var(--rose)' }}>
                    {showFallback ? 'Most weddings here' : 'Your wedding so far'}
                  </p>
                  <p className="text-[44px] lg:text-[56px] leading-none text-[var(--forest)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                    {formatRange(stickyLow, stickyHigh)}
                  </p>
                  {!showFallback && (
                    <p className="text-[13px] text-[var(--ink-light)] mb-5" style={{ fontFamily: 'var(--font-body)' }}>
                      Across the {result.lines.length} line{result.lines.length === 1 ? '' : 's'} you've picked. Pick the rest to refine the number.
                    </p>
                  )}
                  {showFallback && fallbackTotalNote && (
                    <p className="text-[13px] text-[var(--ink-light)] mb-5" style={{ fontFamily: 'var(--font-body)' }}>
                      {fallbackTotalNote}
                    </p>
                  )}

                  {result.lines.length > 0 && (
                    <div className="flex flex-col gap-1.5 pt-5 mt-1 border-t border-[var(--border)]">
                      {result.lines.map(line => (
                        <div key={line.category_slug} className="flex justify-between items-baseline gap-2">
                          <span className="text-[13px] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>
                            {line.category_name}
                            <span className="text-[var(--ink-light)] ml-2">— {line.option_label}</span>
                          </span>
                          {(line.range_low != null || line.range_high != null) && (
                            <span className="text-[13px] text-[var(--forest)] whitespace-nowrap" style={{ fontFamily: 'var(--font-ui)' }}>
                              {formatRange(line.range_low, line.range_high)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-5 border-t border-[var(--border)]">
                    <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                      <strong>This is everything except the venue.</strong> Add the venue cost from the pricing calculator for your full wedding total.
                    </p>
                    <Link href="/pricing#calculator" className="text-link" style={{ fontFamily: 'var(--font-body)', fontSize: 13 }}>
                      See venue cost →
                    </Link>
                  </div>

                  {fallbackTotalCaveat && (
                    <p className="text-[12px] italic text-[var(--ink-light)] mt-5 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {fallbackTotalCaveat}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-[15px] text-[var(--ink-light)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  Pick options above to build your estimate. The total updates as you go.
                </p>
              )}
            </div>
          </div>

          {/* Contact form */}
          <div className="border-t-2 border-[var(--forest)] pt-10">
            <SectionHead num={String(categories.length + 2).padStart(2, '0')} label="Send yourself a copy" />

            {submitted ? (
              <div className="bg-[var(--cream)] border border-[var(--border)] p-8">
                <p className="text-[20px] text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  <em>Sent.</em>
                </p>
                <p className="body-copy text-[15px]">
                  A copy of your budget has been sent to {p1Email}. We'll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <p className="body-copy text-[15px]">
                  Fill in your details and we'll email you a copy of this budget. We'll also be in touch about a tour.
                </p>

                <div>
                  <p className="text-[13px] text-[var(--ink-mid)] mb-3" style={{ fontFamily: 'var(--font-body)' }}>Would you like to…</p>
                  <div className="flex flex-col gap-3">
                    {NEXT_STEPS.map(s => (
                      <div key={s.key} className="flex items-center gap-3">
                        <Toggle checked={nextSteps.has(s.key)} onChange={() => toggleSet(setNextSteps, s.key)} id={`bns-${s.key}`} />
                        <label htmlFor={`bns-${s.key}`} className="text-[14px] text-[var(--ink-mid)] cursor-pointer" style={{ fontFamily: 'var(--font-body)' }}>{s.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                    Do you have a specific date in mind?
                  </label>
                  <input type="text" value={weddingDate} onChange={e => setWeddingDate(e.target.value)} placeholder="e.g. October 4, 2026" className={inputCls} style={{ fontFamily: 'var(--font-body)' }} />
                </div>

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
                    Partner One Phone <span className="text-[11px] normal-case tracking-normal text-[var(--ink-light)]">(optional)</span>
                  </label>
                  <input type="tel" value={p1Phone} onChange={e => setP1Phone(e.target.value)} className={inputCls} style={{ fontFamily: 'var(--font-body)' }} />
                </div>

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

                <div>
                  <label className="block text-[12px] font-medium tracking-widest uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
                    Anything else you'd like to share?
                  </label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className={`${inputCls} resize-none`} style={{ fontFamily: 'var(--font-body)' }} />
                </div>

                {submitError && (
                  <p className="text-[13px] text-[var(--rose)]" style={{ fontFamily: 'var(--font-body)' }}>{submitError}</p>
                )}

                <button type="submit" disabled={submitting} className="btn-primary self-start disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Sending…' : 'Send my budget'}
                </button>
              </form>
            )}
          </div>

          <p className="text-[13px] text-[var(--ink-light)] leading-relaxed mt-2" style={{ fontFamily: 'var(--font-body)' }}>
            Framework, not quote. Vendor pricing changes, your specific choices change the math, and your coordinator will build a real budget with you once you book. Want something specific (mariachi band, kosher catering, drone, mehndi setup, a horse)? We have favorites for almost everything. Ask on your tour.
          </p>
        </div>

        {/* ── Right: sticky panel ── */}
        <div className="hidden lg:block lg:sticky lg:top-32">
          <div className="bg-[var(--cream)] border border-[var(--border)] p-8">
            <p className="eyebrow mb-5">{showFallback ? 'Most weddings here' : 'Your wedding so far'}</p>
            <div className="mb-6 pb-6 border-b border-[var(--border)]">
              {(stickyLow != null || stickyHigh != null) ? (
                <>
                  <p className="text-[40px] leading-none text-[var(--forest)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                    {formatRange(stickyLow, stickyHigh)}
                  </p>
                  <p className="text-[13px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-body)' }}>
                    {showFallback ? 'Typical range' : 'Estimated total'}
                  </p>
                </>
              ) : (
                <p className="text-[15px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-body)' }}>
                  Pick options on the left to build your estimate.
                </p>
              )}
            </div>

            {result.lines.length > 0 && (
              <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-[var(--border)]">
                {result.lines.map(line => (
                  <div key={line.category_slug} className="flex justify-between items-baseline gap-2">
                    <span className="text-[12px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-body)' }}>
                      {line.category_name}
                    </span>
                    <span className="text-[12px] text-[var(--ink-mid)] text-right" style={{ fontFamily: 'var(--font-body)' }}>
                      {line.option_label}
                      {(line.range_low != null || line.range_high != null) && (
                        <span className="block text-[11px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>
                          {formatRange(line.range_low, line.range_high)}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {fallbackTotalNote && showFallback && (
              <p className="text-[12px] text-[var(--ink-light)] mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {fallbackTotalNote}
              </p>
            )}
            {fallbackTotalCaveat && (
              <p className="text-[11px] italic text-[var(--ink-light)] mb-0 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {fallbackTotalCaveat}
              </p>
            )}
          </div>

          <p className="text-[12px] text-[var(--ink-light)] mt-3 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            Venue cost handled separately on the <Link href="/pricing" className="text-link">pricing calculator</Link>.
          </p>
        </div>

      </div>

      {/* Mobile sticky bar */}
      {(stickyLow != null || stickyHigh != null) && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--cream)] border-t border-[var(--border)] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] tracking-widest uppercase text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>
              {showFallback ? 'Typical' : 'Your estimate'}
            </p>
            <p className="text-[20px] leading-tight text-[var(--forest)]" style={{ fontFamily: 'var(--font-display)' }}>
              {formatRange(stickyLow, stickyHigh)}
            </p>
          </div>
          <a href="#budget-calculator" className="btn-primary text-[11px]" onClick={e => { e.preventDefault(); document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Send to me
          </a>
        </div>
      )}
    </div>
  )
}
