'use client'

import { useEffect, useState } from 'react'
import {
  getVisitorId,
  getVisitorContext,
  setVisitorContext,
  dismissNameCapture,
  isNameCaptureDismissed,
} from '@/lib/visitor'

// Inline section that appears on the homepage between the hero and the rest
// of the page. Asks two things:
//   1. Role (couple / parent / friend / planner / browsing)
//   2. Name(s) — labels change based on role
//
// Skipping is a first-class option, equal weight to submit. Once answered or
// skipped, the section collapses and never re-renders for that visitor.
//
// No email, no phone, no contact form. Pure content adaptation.

const ROLE_OPTIONS = [
  { key: 'couple',        label: "I'm planning my wedding" },
  { key: 'parent',        label: "I'm planning my child's wedding" },
  { key: 'friend_family', label: "A friend or family member's wedding" },
  { key: 'planner',       label: "A client's wedding (I'm a planner)" },
  { key: 'browsing',      label: 'Just looking for now' },
]

// Role-aware field labels for the second name slot.
function secondaryLabel(role) {
  switch (role) {
    case 'parent':        return "Your child's name (or names)"
    case 'friend_family': return "The couple's name (or names)"
    case 'planner':       return "Your couple's name (optional)"
    case 'browsing':      return null   // no second field
    case 'couple':
    default:              return "Your partner's name (optional)"
  }
}

export default function AdaptivePrompt() {
  const [mounted, setMounted]     = useState(false)
  const [show, setShow]           = useState(false)
  const [role, setRole]           = useState('')
  const [first, setFirst]         = useState('')
  const [partner, setPartner]     = useState('')
  const [stage, setStage]         = useState('intro') // intro | role | names | thanks | gone
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
    const ctx = getVisitorContext() || {}

    // Honor the "Update your details" flow — show the prompt and pre-fill
    // with the visitor's current values, even if they've already answered.
    let forced = false
    try {
      forced = sessionStorage.getItem('rixey_force_prompt') === '1'
      if (forced) sessionStorage.removeItem('rixey_force_prompt')
    } catch {}

    if (ctx.firstName) setFirst(ctx.firstName)
    if (ctx.partnerName) setPartner(ctx.partnerName)
    if (ctx.role) setRole(ctx.role)

    if (forced) {
      // Skip the intro if they're editing — they've already opted in
      setStage(ctx.role ? 'names' : 'role')
      setShow(true)
      return
    }

    if (ctx.firstName && ctx.role) return       // already given everything
    if (isNameCaptureDismissed()) return         // recently skipped
    setShow(true)
  }, [])

  if (!mounted || !show || stage === 'gone') return null

  function handleRoleSelect(key) {
    setRole(key)
    setStage('names')
  }

  async function handleSubmit(e) {
    e?.preventDefault?.()
    const f = first.trim()
    if (!f || !role) return
    const p = partner.trim()
    setSubmitting(true)
    setVisitorContext({ firstName: f, partnerName: p, role })
    try {
      await fetch('/api/track/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: getVisitorId(),
          first_name: f,
          partner_name: p || null,
          role,
        }),
      })
    } catch {}
    setStage('thanks')
    setTimeout(() => setStage('gone'), 4500)
    setSubmitting(false)
  }

  function handleSkip() {
    dismissNameCapture()
    setStage('gone')
  }

  const inputCls =
    'w-full bg-white border border-[var(--border)] px-4 py-3 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none focus:border-[var(--forest)] transition-colors'

  // Pretty label for the thanks state
  const greetingName =
    first && partner && role === 'couple' ? `${first} & ${partner}`
    : first || 'there'

  return (
    <section
      aria-label="Personalize your visit"
      className="bg-[var(--sage-light)]/40 border-y border-[var(--sage)]/30 py-12 lg:py-16 px-6 lg:px-10"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-3xl mx-auto">

        {stage === 'intro' && (
          <div className="text-center">
            <p
              className="text-[24px] lg:text-[30px] leading-snug text-[var(--ink)] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              We&rsquo;d love to make this site about <em>your</em> wedding instead of a generic one.
            </p>
            <p className="text-[15px] text-[var(--ink-mid)] leading-relaxed mb-7 max-w-xl mx-auto">
              Takes 10 seconds. We won&rsquo;t ask for your email &mdash; just two quick things about you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                type="button"
                onClick={() => setStage('role')}
                className="btn-primary"
              >
                Make this about us
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-[13px] text-[var(--ink-light)] hover:text-[var(--ink-mid)] underline underline-offset-2"
              >
                Just let me look around
              </button>
            </div>
          </div>
        )}

        {stage === 'role' && (
          <div>
            <p
              className="text-[12px] tracking-[0.22em] uppercase text-[var(--ink-light)] mb-3 text-center"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Step 1 of 2
            </p>
            <p
              className="text-[22px] lg:text-[26px] leading-snug text-[var(--ink)] mb-7 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              I&rsquo;m planning&hellip;
            </p>
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              {ROLE_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleRoleSelect(opt.key)}
                  className={`text-left px-5 py-3.5 border bg-white text-[15px] text-[var(--ink-mid)] transition-all duration-150 hover:border-[var(--forest)] hover:bg-[var(--forest)]/5 ${
                    role === opt.key ? 'border-[var(--forest)] bg-[var(--forest)]/5 text-[var(--ink)]' : 'border-[var(--border)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={handleSkip}
                className="text-[13px] text-[var(--ink-light)] hover:text-[var(--ink-mid)] underline underline-offset-2"
              >
                Just let me look around
              </button>
            </div>
          </div>
        )}

        {stage === 'names' && (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <p
              className="text-[12px] tracking-[0.22em] uppercase text-[var(--ink-light)] mb-3 text-center"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Step 2 of 2
            </p>
            <p
              className="text-[22px] lg:text-[26px] leading-snug text-[var(--ink)] mb-7 text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What should we call you?
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={first}
                onChange={e => setFirst(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                required
                autoFocus
                className={inputCls}
              />
              {secondaryLabel(role) && (
                <input
                  type="text"
                  value={partner}
                  onChange={e => setPartner(e.target.value)}
                  placeholder={secondaryLabel(role)}
                  aria-label={secondaryLabel(role)}
                  className={inputCls}
                />
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-6">
              <button
                type="submit"
                disabled={!first.trim() || submitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving' : 'Make this about us'}
              </button>
              <button
                type="button"
                onClick={() => setStage('role')}
                className="text-[13px] text-[var(--ink-light)] hover:text-[var(--ink-mid)] underline underline-offset-2"
              >
                back
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-[13px] text-[var(--ink-light)] hover:text-[var(--ink-mid)] underline underline-offset-2"
              >
                skip
              </button>
            </div>
          </form>
        )}

        {stage === 'thanks' && (
          <div className="text-center">
            <p
              className="text-[26px] lg:text-[32px] leading-snug text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
            >
              {role === 'couple'
                ? `So ${greetingName}, welcome to a wedding built on you.`
                : `Lovely to meet you, ${first}.`}
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
