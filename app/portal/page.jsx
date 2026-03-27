'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    href: '/portal/sage',
    title: 'Ask Sage',
    description: 'Your AI planning assistant, trained on everything Rixey — timeline advice, alcohol quantities, vendor budgets, what to bring, what to borrow. Available 24/7.',
    cta: 'Chat with Sage',
    accent: true,
  },
  {
    href: '/portal/vendors',
    title: 'Recommended Vendors',
    description: 'Our curated list of photographers, caterers, DJs, florists, and more — all personally recommended by the Rixey team.',
    cta: 'Browse vendors',
  },
  {
    href: '/portal/handbook',
    title: 'The Handbook',
    description: 'Everything you need to know about planning your wedding weekend at Rixey Manor — budgets, timelines, alcohol, packing, and all the little things people forget.',
    cta: 'Read the handbook',
  },
]

export default function FamilyPage() {
  return (
    <div style={{ padding: '48px 24px', maxWidth: 900, margin: '0 auto' }}>

      <div style={{ marginBottom: 48 }}>
        <p
          className="eyebrow"
          style={{ marginBottom: 12 }}
        >
          For Rixey Couples
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Your planning<br />
          <em>home base.</em>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 17,
            lineHeight: 1.75,
            color: 'var(--ink-light)',
            maxWidth: 560,
          }}
        >
          Everything the Rixey team has put together to help you plan your weekend —
          from vendor recommendations to the full handbook, plus Sage whenever you need her.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {SECTIONS.map(s => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: 'block',
              padding: '32px 32px',
              background: s.accent ? 'var(--forest)' : 'var(--cream)',
              border: s.accent ? 'none' : '1px solid var(--border)',
              textDecoration: 'none',
              transition: 'transform 150ms ease, box-shadow 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: s.accent ? 'white' : 'var(--ink)',
                marginBottom: 8,
              }}
            >
              {s.title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                lineHeight: 1.7,
                color: s.accent ? 'rgba(255,255,255,0.7)' : 'var(--ink-mid)',
                marginBottom: 16,
              }}
            >
              {s.description}
            </p>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: s.accent ? 'var(--sage-light)' : 'var(--forest)',
                borderBottom: `1px solid ${s.accent ? 'rgba(181,205,190,0.4)' : 'var(--sage-light)'}`,
                paddingBottom: 1,
              }}
            >
              {s.cta} &rarr;
            </span>
          </Link>
        ))}
      </div>

      {/* Portal nudge */}
      <div
        style={{
          marginTop: 32,
          padding: '24px 28px',
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>&#9733;</span>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'var(--ink-mid)',
              lineHeight: 1.7,
              marginBottom: 8,
            }}
          >
            <strong style={{ color: 'var(--ink)' }}>Are you the couple?</strong> You have access to a dedicated planning app with
            guest list management, table layout, timeline builder, budget tracker, vendor management,
            and Sage loaded with your specific wedding details. Ask the Rixey team for access if you haven&rsquo;t signed up yet.
          </p>
          <a
            href="/app"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--forest)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--sage-light)',
              paddingBottom: 1,
            }}
          >
            Learn about the Couple&rsquo;s App &rarr;
          </a>
        </div>
      </div>

      <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--ink-light)',
            lineHeight: 1.7,
          }}
        >
          Questions? Text or call <strong style={{ color: 'var(--ink-mid)' }}>(540) 212-4545</strong> or
          email <a href="mailto:info@rixeymanor.com" style={{ color: 'var(--forest)' }}>info@rixeymanor.com</a>.
        </p>
      </div>
    </div>
  )
}
