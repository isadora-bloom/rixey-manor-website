'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function StickyBookBar({ calendlyUrl }) {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  // Don't show on admin or pricing pages (they already have heavy CTAs)
  const suppress = pathname.startsWith('/admin') || pathname.startsWith('/pricing')

  useEffect(() => {
    if (suppress) return

    function onScroll() {
      const scrolled = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const viewHeight = window.innerHeight
      const nearBottom = scrolled + viewHeight > docHeight - 300

      setVisible(scrolled > 500 && !nearBottom)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [suppress])

  if (suppress) return null

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '80px'})`,
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        background: 'var(--ink)',
        borderRadius: 999,
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        padding: '0 6px 0 20px',
        height: 48,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.55)',
        marginRight: 14,
      }}>
        Rixey Manor
      </span>
      <Link
        href="/pricing#book-tour"
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--ink)',
          background: 'var(--warm-white)',
          borderRadius: 999,
          padding: '8px 18px',
          textDecoration: 'none',
          fontWeight: 500,
          display: 'inline-block',
        }}
      >
        Book a Tour
      </Link>
    </div>
  )
}
