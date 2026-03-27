'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const FamilyContext = createContext({ authenticated: false })
export function useFamily() { return useContext(FamilyContext) }

const NAV = [
  { href: '/portal',          label: 'Home' },
  { href: '/portal/sage',     label: 'Ask Sage' },
  { href: '/portal/vendors',  label: 'Vendors' },
  { href: '/portal/handbook', label: 'Handbook' },
]

export default function FamilyLayout({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const pathname = usePathname()

  const EXPIRY_DAYS = 90

  useEffect(() => {
    try {
      const raw = localStorage.getItem('portal_session')
      if (!raw) return
      const { expires } = JSON.parse(raw)
      if (Date.now() > expires) { localStorage.removeItem('portal_session'); return }
      setAuthenticated(true)
    } catch {
      localStorage.removeItem('portal_session')
    }
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/portal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input }),
      })
      if (res.status === 401) { setError('That password didn\u2019t work.'); return }
      if (!res.ok) { setError('Something went wrong \u2014 try again.'); return }
      const expires = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
      localStorage.setItem('portal_session', JSON.stringify({ expires }))
      setAuthenticated(true)
    } catch {
      setError('Can\u2019t connect \u2014 check your internet.')
    }
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warm-white)' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320, padding: 40 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 4 }}>
            Welcome back.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.6, marginBottom: 8 }}>
            This area is for Rixey Manor couples and team. Enter your password to continue.
          </p>
          <input
            type="password"
            placeholder="Password"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            style={{
              padding: '12px 16px',
              border: '1px solid var(--border)',
              background: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              outline: 'none',
              color: 'var(--ink)',
            }}
          />
          {error && <p style={{ color: 'var(--rose)', fontSize: 13, fontFamily: 'var(--font-body)' }}>{error}</p>}
          <button
            type="submit"
            className="btn-primary"
            style={{ justifyContent: 'center' }}
          >
            Enter
          </button>
        </form>
      </div>
    )
  }

  return (
    <FamilyContext.Provider value={{ authenticated }}>
      <div style={{ minHeight: '100vh', background: 'var(--warm-white)', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <header
          className="border-b"
          style={{
            background: 'var(--forest)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            height: 52,
            flexShrink: 0,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <Link
            href="/portal"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '0.02em',
              opacity: 0.9,
              whiteSpace: 'nowrap',
            }}
          >
            Rixey Manor
          </Link>

          <nav style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
            {NAV.map(n => {
              const active = pathname === n.href
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 12,
                    letterSpacing: '0.08em',
                    padding: '6px 12px',
                    color: active ? 'white' : 'rgba(255,255,255,0.55)',
                    background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                    textDecoration: 'none',
                    borderRadius: 3,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>

          <div style={{ marginLeft: 'auto' }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
              }}
            >
              Back to site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </FamilyContext.Provider>
  )
}
