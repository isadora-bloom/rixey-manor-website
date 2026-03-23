import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found — Rixey Manor',
}

export default function NotFound() {
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
        404 — Page not found
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)', color: 'var(--ink)', lineHeight: 1.15, fontStyle: 'italic', marginBottom: 20 }}>
        This page doesn't exist.
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-light)', maxWidth: 440, lineHeight: 1.7, marginBottom: 36 }}>
        The link may have moved or been mistyped. Try one of the pages below, or call us at (540) 212-4545.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 40 }}>
        <Link href="/" className="btn-primary">Back to home</Link>
        <Link href="/venue" className="text-link" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>The Venue</Link>
        <Link href="/pricing" className="text-link" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Pricing</Link>
        <Link href="/faq" className="text-link" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>FAQs</Link>
      </div>
    </div>
  )
}
