'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    href: '/admin/content',
    title: 'Content',
    desc: 'Edit pricing, availability text, phone number, and other site-wide copy stored in the database.',
  },
  {
    href: '/admin/images',
    title: 'Images',
    desc: 'View and replace images for venue spaces, team photos, hero slots, and other named image positions.',
  },
  {
    href: '/admin/gallery',
    title: 'Gallery',
    desc: 'Browse all gallery photos. Toggle active/inactive, view quality scores, filter by scene type.',
  },
  {
    href: '/admin/blog',
    title: 'Blog',
    desc: 'Manage blog posts — edit titles, excerpts, cover images, and publish/unpublish.',
  },
  {
    href: '/admin/availability',
    title: 'Availability',
    desc: 'Add and remove booked date ranges that appear on the public availability calendar.',
  },
]

export default function AdminDashboard() {
  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', marginBottom: 8 }}>
        Dashboard
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-light)', marginBottom: 36 }}>
        Rixey Manor website admin. Changes take effect immediately.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              border: '1px solid var(--border)',
              padding: '20px 22px',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--forest)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)', marginBottom: 6 }}>
                {s.title}
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)', lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
