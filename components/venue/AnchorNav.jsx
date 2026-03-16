'use client'

import { useState } from 'react'

const ANCHORS = [
  { label: 'The Spaces', href: '#spaces' },
  { label: 'Accommodations', href: '#accommodations' },
  { label: 'Our Story', href: '#story' },
  { label: 'The Team', href: '#team' },
  { label: "What's Included", href: '#included' },
  { label: 'Details', href: '#details' },
]

export default function AnchorNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-16 z-40 bg-[var(--warm-white)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Desktop — inline links */}
        <div className="hidden lg:flex items-center gap-8 h-12">
          {ANCHORS.map(a => (
            <a
              key={a.href}
              href={a.href}
              className="text-link"
            >
              {a.label}
            </a>
          ))}
        </div>

        {/* Mobile — "Jump to" dropdown */}
        <div className="lg:hidden flex items-center h-12">
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ink-mid)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Jump to
            <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 bg-[var(--warm-white)] border-b border-[var(--border)] shadow-sm z-50">
              {ANCHORS.map(a => (
                <a
                  key={a.href}
                  href={a.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 text-[13px] text-[var(--ink-mid)] border-b border-[var(--border)] last:border-0"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {a.label}
                </a>
              ))}
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}
