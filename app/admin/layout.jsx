'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const AdminContext = createContext({ password: '' })
export function useAdmin() { return useContext(AdminContext) }

const NAV = [
  { href: '/admin',             label: 'Dashboard'    },
  { href: '/admin/content',     label: 'Content'      },
  { href: '/admin/images',      label: 'Images'       },
  { href: '/admin/videos',      label: 'Videos'       },
  { href: '/admin/gallery',     label: 'Gallery'      },
  { href: '/admin/blog',        label: 'Blog'         },
  { href: '/admin/availability',label: 'Availability' },
]

export default function AdminLayout({ children }) {
  const [password, setPassword] = useState('')
  const [input, setInput]       = useState('')
  const [error, setError]       = useState('')
  const pathname = usePathname()

  // Persist password in sessionStorage (clears on tab close)
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw')
    if (saved) setPassword(saved)
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': input },
      body: JSON.stringify({}),
    })
    if (res.status === 401) { setError('Wrong password.'); return }
    sessionStorage.setItem('admin_pw', input)
    setPassword(input)
  }

  if (!password) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 4 }}>
            Rixey Manor Admin
          </p>
          <input
            type="password"
            placeholder="Password"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            style={{ padding: '10px 14px', border: '1px solid var(--border)', background: 'white', fontFamily: 'var(--font-ui)', fontSize: 14, outline: 'none' }}
          />
          {error && <p style={{ color: 'var(--rose)', fontSize: 13 }}>{error}</p>}
          <button type="submit" style={{ padding: '10px 14px', background: 'var(--forest)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 13, letterSpacing: '0.1em' }}>
            Sign in
          </button>
        </form>
      </div>
    )
  }

  return (
    <AdminContext.Provider value={{ password }}>
      <div style={{ minHeight: '100vh', background: '#FDFAF6', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <header style={{ background: '#1C3829', color: 'white', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 32, height: 52, flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>
            Rixey Admin
          </span>
          <nav style={{ display: 'flex', gap: 4 }}>
            {NAV.map(n => {
              const active = pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href))
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
                  }}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => { sessionStorage.removeItem('admin_pw'); setPassword('') }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px 32px' }}>
          {children}
        </main>

      </div>
    </AdminContext.Provider>
  )
}
