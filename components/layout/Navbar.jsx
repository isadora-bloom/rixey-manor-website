'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import CalendlyPopupButton from '@/components/ui/CalendlyPopupButton'

const navLinks = [
  {
    label: 'The Venue',
    href: '/venue',
    sub: [
      { label: 'The Spaces',      href: '/venue#spaces' },
      { label: 'Accommodations',  href: '/venue#accommodations' },
      { label: "What's Included", href: '/venue#included' },
      { label: 'Details',         href: '/venue#details' },
    ],
  },
  {
    label: 'Our Story',
    href: '/history',
    sub: [
      { label: 'The Estate',           href: '/history#heritage' },
      { label: 'How Rixey Came to Be', href: '/history#story' },
      { label: 'The Team',             href: '/history#team' },
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing',
    sub: [
      { label: "What's Included", href: '/pricing#included' },
      { label: 'Calculator',      href: '/pricing#calculator' },
      { label: 'Other Costs',     href: '/pricing#other-costs' },
      { label: 'Elopements',      href: '/pricing#elopements' },
      { label: 'Book a Tour',     href: '/pricing#book-tour' },
    ],
  },
  {
    label: 'Availability',
    href: '/availability',
    sub: [
      { label: 'Spring',      href: '/availability#season-spring' },
      { label: 'Summer',      href: '/availability#season-summer' },
      { label: 'Fall',        href: '/availability#season-fall' },
      { label: 'Winter',      href: '/availability#season-winter' },
      { label: 'Check Dates', href: '/availability#calendar' },
    ],
  },
  { label: 'Only at Rixey', href: '/extras' },
  { label: 'Gallery',       href: '/gallery' },
  { label: 'FAQ',           href: '/faq' },
  { label: 'The App',       href: '/app' },
]

function DesktopNavItem({ link }) {
  const [open, setOpen] = useState(false)
  const hasSub = !!link.sub?.length

  if (!hasSub) {
    return (
      <Link
        href={link.href}
        className="text-[12px] font-medium tracking-[0.12em] uppercase text-[var(--ink-mid)] hover:text-[var(--ink)] transition-colors duration-200 no-underline"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={link.href}
        className="flex items-center gap-1 text-[12px] font-medium tracking-[0.12em] uppercase text-[var(--ink-mid)] hover:text-[var(--ink)] transition-colors duration-200 no-underline"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {link.label}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </Link>

      {/* Hover bridge to keep menu open while moving cursor down */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 ${open ? 'visible' : 'invisible'}`}
      >
        <div
          className={`min-w-[220px] bg-[var(--warm-white)] border border-[var(--border)] shadow-[0_8px_24px_rgba(28,24,20,0.08)] py-2 transition-opacity duration-150 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {link.sub.map(sub => (
            <Link
              key={sub.href}
              href={sub.href}
              className="block px-5 py-2.5 text-[13px] text-[var(--ink-mid)] hover:text-[var(--forest)] hover:bg-[var(--cream)] transition-colors no-underline"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileNavItem({ link, onNavigate }) {
  const [expanded, setExpanded] = useState(false)
  const hasSub = !!link.sub?.length

  if (!hasSub) {
    return (
      <Link
        href={link.href}
        onClick={onNavigate}
        className="block py-3 border-b border-[var(--border)] no-underline text-[clamp(22px,5vw,28px)] text-[var(--ink)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <div className="border-b border-[var(--border)]">
      <div className="flex items-center justify-between py-3">
        <Link
          href={link.href}
          onClick={onNavigate}
          className="no-underline text-[clamp(22px,5vw,28px)] text-[var(--ink)] flex-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {link.label}
        </Link>
        <button
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Hide' : 'Show'} ${link.label} sections`}
          className="p-2 -mr-2 text-[var(--ink-light)]"
        >
          <ChevronDown size={20} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {expanded && (
        <div className="pb-3 pl-2 flex flex-col gap-1">
          {link.sub.map(sub => (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={onNavigate}
              className="block py-2 text-[15px] text-[var(--ink-mid)] no-underline"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

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
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <DesktopNavItem key={link.href} link={link} />
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

        <nav className="flex flex-col gap-1 p-8 mt-4 overflow-y-auto">
          {navLinks.map(link => (
            <MobileNavItem key={link.href} link={link} onNavigate={() => setOpen(false)} />
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
