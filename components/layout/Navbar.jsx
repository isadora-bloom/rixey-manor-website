'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import CalendlyPopupButton from '@/components/ui/CalendlyPopupButton'

const navLinks = [
  { label: 'The Venue', href: '/venue' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Availability', href: '/availability' },
  { label: 'Only at Rixey', href: '/extras' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'FAQ', href: '/faq' },
  { label: 'The App', href: '/app' },
  { label: 'Take the Quiz', href: '/quiz', accent: true },
]

export default function Navbar({ calendlyUrl = '' }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--warm-white)]/90 backdrop-blur-md shadow-[0_1px_0_var(--border)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="no-underline flex items-center">
            <Image
              src="/assets/rixey-logo-full.png"
              alt="Rixey Manor"
              width={2720}
              height={1530}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[12px] font-medium tracking-[0.12em] uppercase transition-colors duration-200 no-underline ${
                  link.accent
                    ? 'text-[var(--rose)] hover:text-[var(--ink)]'
                    : 'text-[var(--ink-mid)] hover:text-[var(--ink)]'
                }`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {link.label}
              </Link>
            ))}
            <CalendlyPopupButton url={calendlyUrl} className="btn-primary">
              Book a Tour
            </CalendlyPopupButton>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-[var(--ink)] focus-visible:outline-[var(--forest)]"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-[var(--warm-white)] flex flex-col transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-6 h-20 flex items-center justify-between border-b border-[var(--border)]">
          <Link href="/" onClick={() => setOpen(false)} className="no-underline flex items-center">
            <Image
              src="/assets/rixey-logo-full.png"
              alt="Rixey Manor"
              width={2720}
              height={1530}
              className="h-14 w-auto"
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-[var(--ink-mid)]"
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-8 mt-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-3 border-b border-[var(--border)] no-underline ${
                link.accent
                  ? 'text-2xl text-[var(--rose)]'
                  : 'text-[clamp(22px,5vw,28px)] text-[var(--ink)]'
              }`}
              style={{ fontFamily: link.accent ? 'var(--font-ui)' : 'var(--font-display)', letterSpacing: link.accent ? '0.1em' : undefined, textTransform: link.accent ? 'uppercase' : undefined, fontSize: link.accent ? 13 : undefined }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-8">
            <CalendlyPopupButton
              url={calendlyUrl}
              className="btn-primary w-full justify-center"
            >
              Book a Tour
            </CalendlyPopupButton>
          </div>
          <div className="mt-8 pt-8 border-t border-[var(--border)]">
            <p
              className="text-[var(--ink-light)] text-sm mb-1"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              (540) 212-4545
            </p>
            <p
              className="text-[var(--ink-light)] text-[11px] tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Yes, you can text.
            </p>
          </div>
        </nav>
      </div>
    </>
  )
}
