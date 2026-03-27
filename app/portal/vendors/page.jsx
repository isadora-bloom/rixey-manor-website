'use client'

import { useState } from 'react'
import { VENDORS, CATEGORIES } from '@/lib/vendors'

export default function VendorsPage() {
  const [filterCategory, setFilterCategory] = useState('')
  const [filterTag, setFilterTag] = useState('')

  const filtered = VENDORS.filter(v => {
    if (filterCategory && v.category !== filterCategory) return false
    if (filterTag === 'local' && !v.local) return false
    if (filterTag === 'budget' && !v.budgetFriendly) return false
    if (filterTag === 'veteran' && !v.multipleEvents) return false
    if (filterTag === 'indian' && !v.indian) return false
    return true
  })

  const grouped = filtered.reduce((acc, v) => {
    if (!acc[v.category]) acc[v.category] = []
    acc[v.category].push(v)
    return acc
  }, {})

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: 800, margin: '0 auto' }}>

      <div style={{ marginBottom: 32 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Vendor Directory</p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          Recommended vendors.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--ink-light)',
            maxWidth: 520,
          }}
        >
          Trusted partners who know Rixey Manor and love working here. Each one has been personally recommended by our team.
        </p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Category filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <FilterButton active={!filterCategory} onClick={() => setFilterCategory('')}>All</FilterButton>
          {CATEGORIES.map(cat => (
            <FilterButton
              key={cat}
              active={filterCategory === cat}
              onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
            >
              {cat}
            </FilterButton>
          ))}
        </div>

        {/* Tag filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <TagButton active={filterTag === 'veteran'} onClick={() => setFilterTag(filterTag === 'veteran' ? '' : 'veteran')} color="#7c3aed" bg="#f3e8ff">Rixey Veteran</TagButton>
          <TagButton active={filterTag === 'local'} onClick={() => setFilterTag(filterTag === 'local' ? '' : 'local')} color="#1d4ed8" bg="#dbeafe">Local</TagButton>
          <TagButton active={filterTag === 'budget'} onClick={() => setFilterTag(filterTag === 'budget' ? '' : 'budget')} color="#15803d" bg="#dcfce7">Budget-Friendly</TagButton>
          <TagButton active={filterTag === 'indian'} onClick={() => setFilterTag(filterTag === 'indian' ? '' : 'indian')} color="#b45309" bg="#fef3c7">Indian / Fusion</TagButton>
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.08em', marginBottom: 24 }}>
        {filtered.length} vendor{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Vendor list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([cat, vendors]) => (
          <div key={cat}>
            <h2
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--ink-light)',
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '1px solid var(--border)',
              }}
            >
              {cat}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {vendors.map((v, i) => (
                <VendorCard key={`${v.name}-${i}`} vendor={v} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-light)', textAlign: 'center', padding: '40px 0' }}>
          No vendors match your filters. Try adjusting them.
        </p>
      )}
    </div>
  )
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        letterSpacing: '0.04em',
        padding: '5px 12px',
        border: '1px solid',
        borderColor: active ? 'var(--forest)' : 'var(--border)',
        background: active ? 'var(--forest)' : 'white',
        color: active ? 'white' : 'var(--ink-mid)',
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
    >
      {children}
    </button>
  )
}

function TagButton({ active, onClick, children, color, bg }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 10,
        letterSpacing: '0.04em',
        padding: '4px 10px',
        border: `1px solid ${active ? color : 'var(--border)'}`,
        borderRadius: 20,
        background: active ? bg : 'transparent',
        color: active ? color : 'var(--ink-light)',
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
    >
      {children}
    </button>
  )
}

function VendorCard({ vendor: v }) {
  const hasWebsite = v.website && v.website.startsWith('http')

  return (
    <div
      style={{
        padding: '14px 18px',
        background: 'white',
        border: '1px solid var(--border)',
        transition: 'border-color 150ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
              {v.name}
            </h3>
            {v.multipleEvents && (
              <span style={{ fontSize: 10, padding: '2px 8px', background: '#f3e8ff', color: '#7c3aed', borderRadius: 20, fontFamily: 'var(--font-ui)' }}>
                Rixey Veteran
              </span>
            )}
            {v.local && (
              <span style={{ fontSize: 10, padding: '2px 8px', background: '#dbeafe', color: '#1d4ed8', borderRadius: 20, fontFamily: 'var(--font-ui)' }}>
                Local
              </span>
            )}
            {v.budgetFriendly && (
              <span style={{ fontSize: 10, padding: '2px 8px', background: '#dcfce7', color: '#15803d', borderRadius: 20, fontFamily: 'var(--font-ui)' }}>
                Budget-Friendly
              </span>
            )}
            {v.indian && (
              <span style={{ fontSize: 10, padding: '2px 8px', background: '#fef3c7', color: '#b45309', borderRadius: 20, fontFamily: 'var(--font-ui)' }}>
                Indian / Fusion
              </span>
            )}
            {v.chinese && (
              <span style={{ fontSize: 10, padding: '2px 8px', background: '#fef3c7', color: '#b45309', borderRadius: 20, fontFamily: 'var(--font-ui)' }}>
                Chinese
              </span>
            )}
          </div>
          {v.notes && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-mid)', marginTop: 4, lineHeight: 1.5 }}>
              {v.notes}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
        {v.contact && (
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-light)' }}>
            Contact: {v.contact}
          </span>
        )}
        {hasWebsite && (
          <a
            href={v.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              color: 'var(--forest)',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
            }}
          >
            Website &nearr;
          </a>
        )}
      </div>
    </div>
  )
}
