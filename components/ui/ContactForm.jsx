'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | done | error

  function set(key) {
    return e => setFields(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const inputCls = 'w-full border border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none focus:border-[var(--forest)] transition-colors'

  if (status === 'done') {
    return (
      <div style={{ padding: '32px 28px', background: 'var(--cream)', borderLeft: '3px solid var(--forest)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8 }}>
          Got it — we'll be in touch within 24 hours.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-light)' }}>
          Check your inbox for a confirmation. If it's urgent, call or text (540) 212-4545.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
            Your name
          </label>
          <input
            type="text"
            required
            placeholder="First name is fine"
            value={fields.name}
            onChange={set('name')}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
            Email
          </label>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={fields.email}
            onChange={set('email')}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className="block text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
          Your question
        </label>
        <textarea
          required
          rows={4}
          placeholder="What do you want to know?"
          value={fields.message}
          onChange={set('message')}
          className={`${inputCls} resize-none`}
        />
      </div>
      {status === 'error' && (
        <p className="text-[13px] text-[var(--rose)]" style={{ fontFamily: 'var(--font-body)' }}>
          Something went wrong. Try emailing us directly at info@rixeymanor.com.
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  )
}
