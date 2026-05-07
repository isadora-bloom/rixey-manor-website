'use client'

import { useState, useMemo } from 'react'

function fmt(n) {
  return '$' + Number(n).toLocaleString()
}

function formatRange(low, high) {
  if (low == null && high == null) return null
  if (low != null && high != null) return `${fmt(low)}–${fmt(high)}`
  if (low != null)  return `from ${fmt(low)}`
  return `up to ${fmt(high)}`
}

export default function BudgetExplorer({
  categories,
  priorities,
  priorityMap,
  vendorsByCategory,
  totalLow,
  totalHigh,
  totalNote,
  totalCaveat,
}) {
  const [selected, setSelected] = useState(new Set())
  const [openVendorCat, setOpenVendorCat] = useState(null)

  function togglePriority(slug) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'budget_priority_toggle', { priority: slug })
    }
  }

  function toggleVendorPanel(catSlug) {
    setOpenVendorCat(prev => (prev === catSlug ? null : catSlug))

    if (typeof window !== 'undefined' && window.gtag && openVendorCat !== catSlug) {
      window.gtag('event', 'budget_panel_open', { category: catSlug })
    }
  }

  // Build a lookup so each category card can render its priority-driven note
  // (only when the note is actually populated — never fabricated).
  const noteByCategory = useMemo(() => {
    const out = {}
    for (const m of priorityMap) {
      if (!selected.has(m.priority_slug)) continue
      if (!m.note) continue
      if (!out[m.category_slug]) out[m.category_slug] = []
      out[m.category_slug].push(m.note)
    }
    return out
  }, [priorityMap, selected])

  // Categories with any matching priority get visual emphasis (just a flag).
  const emphasized = useMemo(() => {
    const out = new Set()
    for (const m of priorityMap) {
      if (selected.has(m.priority_slug)) out.add(m.category_slug)
    }
    return out
  }, [priorityMap, selected])

  return (
    <>
      {/* Priority chips */}
      <section style={{
        padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 60px)',
        background: 'var(--cream)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: 14, textAlign: 'center' }}>
            Start here
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3vw, 32px)',
            color: 'var(--ink)',
            lineHeight: 1.22,
            marginBottom: 10,
            textAlign: 'center',
          }}>
            What matters most to you?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--ink-light)',
            textAlign: 'center',
            maxWidth: 520,
            margin: '0 auto 28px',
            lineHeight: 1.7,
          }}>
            Pick a few. We'll highlight where couples like you typically lean
            in, and where they trim back to make room.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {priorities.map(p => {
              const on = selected.has(p.slug)
              return (
                <button
                  key={p.slug}
                  onClick={() => togglePriority(p.slug)}
                  className="priority-chip"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    letterSpacing: '0.06em',
                    padding: '10px 18px',
                    border: '1px solid',
                    borderColor: on ? 'var(--forest)' : 'var(--border)',
                    background: on ? 'var(--forest)' : 'var(--warm-white)',
                    color: on ? 'white' : 'var(--ink-mid)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  aria-pressed={on}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          {selected.size > 0 && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--ink-light)',
              textAlign: 'center',
              marginTop: 22,
            }}>
              <button
                onClick={() => setSelected(new Set())}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--rose)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                Clear selection
              </button>
            </p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section style={{
        padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 60px)',
        background: 'var(--warm-white)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Where the money goes</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3vw, 32px)',
            color: 'var(--ink)',
            lineHeight: 1.22,
            marginBottom: 36,
          }}>
            Every line, plainly.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {categories.map(cat => {
              const range = formatRange(cat.range_low, cat.range_high)
              const vendors = vendorsByCategory[cat.slug] || []
              const isEmphasized = emphasized.has(cat.slug)
              const notes = noteByCategory[cat.slug] || []
              const isOpen = openVendorCat === cat.slug

              return (
                <article
                  key={cat.slug}
                  style={{
                    borderTop: '1px solid var(--border)',
                    padding: '22px 0',
                    background: isEmphasized ? 'rgba(184, 144, 138, 0.06)' : 'transparent',
                    paddingLeft: isEmphasized ? 18 : 0,
                    paddingRight: isEmphasized ? 18 : 0,
                    transition: 'background 0.2s ease, padding 0.2s ease',
                    borderLeft: isEmphasized ? '2px solid var(--rose)' : '2px solid transparent',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(19px, 2.2vw, 24px)',
                      color: 'var(--ink)',
                      lineHeight: 1.25,
                      margin: 0,
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      flexWrap: 'wrap',
                    }}>
                      <span>{cat.name}</span>
                      {vendors.length > 0 && (
                        <button
                          onClick={() => toggleVendorPanel(cat.slug)}
                          aria-expanded={isOpen}
                          aria-label={`Show some of our favorite ${cat.name.toLowerCase()} vendors`}
                          style={{
                            background: 'none',
                            border: '1px solid var(--rose-light)',
                            borderRadius: '50%',
                            width: 22,
                            height: 22,
                            color: 'var(--rose)',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-ui)',
                            fontSize: 12,
                            lineHeight: 1,
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'translateY(2px)',
                          }}
                        >
                          {isOpen ? '−' : 'i'}
                        </button>
                      )}
                    </h3>
                    {range && (
                      <span style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 14,
                        color: 'var(--forest)',
                        whiteSpace: 'nowrap',
                      }}>
                        {range}
                        {cat.range_note && (
                          <span style={{ color: 'var(--ink-light)', marginLeft: 8, fontSize: 12 }}>
                            {cat.range_note}
                          </span>
                        )}
                      </span>
                    )}
                    {!range && (
                      <span style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 12,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-light)',
                      }}>
                        Range coming soon
                      </span>
                    )}
                  </div>

                  {cat.description && (
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 15,
                      color: 'var(--ink-mid)',
                      lineHeight: 1.7,
                      margin: '10px 0 0',
                    }}>
                      {cat.description}
                    </p>
                  )}

                  {cat.trade_off_note && (
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      fontStyle: 'italic',
                      color: 'var(--ink-light)',
                      lineHeight: 1.7,
                      margin: '8px 0 0',
                    }}>
                      {cat.trade_off_note}
                    </p>
                  )}

                  {notes.map((n, i) => (
                    <p key={i} style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      color: 'var(--rose)',
                      lineHeight: 1.7,
                      margin: '8px 0 0',
                    }}>
                      {n}
                    </p>
                  ))}

                  {isOpen && vendors.length > 0 && (
                    <div style={{
                      marginTop: 16,
                      padding: '18px 20px',
                      background: 'var(--cream)',
                      border: '1px solid var(--border)',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 11,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-light)',
                        marginBottom: 14,
                      }}>
                        Some of our favorites at this range
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {vendors.map(v => (
                          <li key={v.id}>
                            <p style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 15,
                              color: 'var(--ink)',
                              margin: 0,
                              fontWeight: 500,
                            }}>
                              {v.name}
                            </p>
                            {v.descriptor && (
                              <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 13,
                                color: 'var(--ink-light)',
                                margin: '2px 0 0',
                                lineHeight: 1.6,
                              }}>
                                {v.descriptor}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        fontStyle: 'italic',
                        color: 'var(--ink-light)',
                        marginTop: 16,
                        marginBottom: 0,
                      }}>
                        Your coordinator will introduce you to whichever feels right when you're ready.
                      </p>
                    </div>
                  )}
                </article>
              )
            })}
            <div style={{ borderTop: '1px solid var(--border)' }} />
          </div>
        </div>
      </section>

      {/* Soft total */}
      {(totalLow || totalHigh || totalNote) && (
        <section style={{
          padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 60px)',
          background: 'var(--cream)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Add it up</p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 3.4vw, 38px)',
              color: 'var(--ink)',
              lineHeight: 1.22,
              marginBottom: 22,
            }}>
              {(totalLow || totalHigh) ? (
                <>Most weddings here land between<br /><em>{formatRange(totalLow, totalHigh)}.</em></>
              ) : (
                <em>Most weddings here land in a real range.</em>
              )}
            </h2>
            {totalNote && (
              <p className="body-copy" style={{ marginBottom: 12 }}>
                {totalNote}
              </p>
            )}
            {totalCaveat && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontStyle: 'italic',
                color: 'var(--ink-light)',
                lineHeight: 1.7,
                margin: 0,
              }}>
                {totalCaveat}
              </p>
            )}
          </div>
        </section>
      )}
    </>
  )
}
