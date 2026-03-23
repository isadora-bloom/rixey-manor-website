'use client'

import Link from 'next/link'

export default function Error({ reset }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--warm-white)',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 20 }}>
        Something went wrong
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)', color: 'var(--ink)', lineHeight: 1.15, fontStyle: 'italic', marginBottom: 20 }}>
        That wasn't supposed to happen.
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-light)', maxWidth: 440, lineHeight: 1.7, marginBottom: 36 }}>
        A page error occurred. Try refreshing — if it keeps happening, give us a call at (540) 212-4545 or email info@rixeymanor.com.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', alignSelf: 'center', textDecoration: 'underline', textUnderlineOffset: 4 }}>
          Go home
        </Link>
      </div>
    </div>
  )
}
