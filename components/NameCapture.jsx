'use client'

import { useEffect, useState } from 'react'
import {
  getVisitorId,
  getVisitorName,
  setVisitorName,
  dismissNameCapture,
  isNameCaptureDismissed,
} from '@/lib/visitor'

// Slim sage-toned bar that appears at the very top of the site on first visit.
// Mad-libs style: "We don't host A wedding. We host ____'s wedding."
// As the visitor types, the blank fills live. On submit, the bar morphs to
// a personal greeting then fades. Once given OR dismissed, never shown again.
//
// The bar itself is the personalisation — typing your name *is* the reward.

export default function NameCapture() {
  const [mounted, setMounted]       = useState(false)
  const [show, setShow]             = useState(false)
  const [first, setFirst]           = useState('')
  const [partner, setPartner]       = useState('')
  const [showPartner, setShowPartner] = useState(false)
  const [stage, setStage]           = useState('ask') // 'ask' | 'thanks' | 'gone'
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
    const { firstName } = getVisitorName() || {}
    if (firstName) return                  // already given
    if (isNameCaptureDismissed()) return    // recently dismissed
    // Small delay so it doesn't pop in jarringly the moment the page loads
    const t = setTimeout(() => setShow(true), 600)
    return () => clearTimeout(t)
  }, [])

  if (!mounted || !show || stage === 'gone') return null

  async function handleSubmit(e) {
    e.preventDefault()
    const f = first.trim()
    if (!f) return
    const p = partner.trim()
    setSubmitting(true)
    setVisitorName(f, p)
    try {
      await fetch('/api/track/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: getVisitorId(),
          first_name: f,
          partner_name: p || null,
        }),
      })
    } catch {}
    setStage('thanks')
    setTimeout(() => setStage('gone'), 5000)
    setSubmitting(false)
  }

  function handleDismiss() {
    dismissNameCapture()
    setStage('gone')
  }

  // Live preview: "We host ____'s wedding"
  const previewName =
    first && partner ? `${first} & ${partner}` :
    first            ? first :
    null

  return (
    <div
      role="region"
      aria-label="Personalize your visit"
      className="w-full bg-[var(--sage-light)] text-[var(--ink)] border-b border-[var(--sage)]/40"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center gap-4">

        {stage === 'ask' && (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-[14px] leading-relaxed text-[var(--ink-mid)]">
              We don&rsquo;t host <em>a</em> wedding. We host{' '}
              <strong className="text-[var(--ink)]">
                {previewName ? `${previewName}'s` : <em className="text-[var(--ink-light)] not-italic opacity-70">someone&rsquo;s</em>}
              </strong>{' '}
              wedding. So &mdash; who are you?
            </p>

            <input
              type="text"
              value={first}
              onChange={e => {
                setFirst(e.target.value)
                if (e.target.value.trim() && !showPartner) setShowPartner(true)
              }}
              placeholder="Your name"
              required
              aria-label="Your first name"
              className="bg-white/80 border border-[var(--sage)]/40 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[var(--forest)] placeholder:text-[var(--ink-light)] w-36"
              style={{ fontFamily: 'var(--font-body)' }}
            />

            {showPartner && (
              <input
                type="text"
                value={partner}
                onChange={e => setPartner(e.target.value)}
                placeholder="Partner's name (optional)"
                aria-label="Partner's name"
                className="bg-white/80 border border-[var(--sage)]/40 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[var(--forest)] placeholder:text-[var(--ink-light)] w-44"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            )}

            <button
              type="submit"
              disabled={!first.trim() || submitting}
              className="bg-[var(--forest)] text-white px-4 py-1.5 text-[12px] uppercase tracking-[0.12em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--forest)]/90 transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {submitting ? 'Saving' : 'Hello'}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="text-[12px] text-[var(--ink-light)] hover:text-[var(--ink-mid)] underline underline-offset-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              not yet
            </button>
          </form>
        )}

        {stage === 'thanks' && (
          <p className="flex-1 text-[14px] text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            So {previewName || first}, welcome to a wedding built on you.
          </p>
        )}

      </div>
    </div>
  )
}
