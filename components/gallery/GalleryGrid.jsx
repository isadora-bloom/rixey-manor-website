'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'

const SEASON_MONTHS = {
  winter: ['december', 'january', 'february'],
  spring: ['march', 'april', 'may'],
  summer: ['june', 'july', 'august'],
  fall:   ['september', 'october', 'november'],
}

const SEASON_FIELD = {
  winter: 'winter',
  spring: 'spring',
  summer: 'summer',
  fall:   'autumn',
}

const FILTER_GROUPS = [
  {
    label: 'Season',
    filters: [
      { id: 'all',    label: 'All' },
      { id: 'winter', label: 'Winter', sub: 'Dec – Feb' },
      { id: 'spring', label: 'Spring', sub: 'Mar – May' },
      { id: 'summer', label: 'Summer', sub: 'Jun – Aug' },
      { id: 'fall',   label: 'Fall',   sub: 'Sep – Nov' },
    ],
  },
  {
    label: 'The Venue',
    filters: [
      { id: 'exterior', label: 'Manor Exteriors' },
      { id: 'interior', label: 'Manor Interiors' },
      { id: 'ceremony', label: 'Ceremony' },
      { id: 'reception', label: 'Reception' },
    ],
  },
  {
    label: 'Mood',
    filters: [
      { id: 'dark-moody',    label: 'Dark & Moody'      },
      { id: 'light-bright',  label: 'Light & Bright'    },
      { id: 'colorful',      label: 'Colourful & Bright' },
    ],
  },
  {
    label: 'Style',
    filters: [
      { id: 'style-vintage',       label: 'Vintage'       },
      { id: 'style-editorial',     label: 'Editorial'     },
      { id: 'style-classic',       label: 'Classic'       },
      { id: 'style-documentary',   label: 'Documentary'   },
    ],
  },
]

function matchesFilter(img, filter) {
  switch (filter) {
    case 'all': return true
    case 'winter':
    case 'spring':
    case 'summer':
    case 'fall':
      return SEASON_MONTHS[filter].includes(img.wedding_month) ||
             img.season === SEASON_FIELD[filter]
    case 'exterior':
      return img.manor_visible === true
    case 'interior':
      return img.scene_type === 'getting-ready' ||
             (img.scene_type === 'venue' && img.manor_visible !== true)
    case 'ceremony':
      return img.scene_type === 'ceremony'
    case 'reception':
      return img.scene_type === 'reception'
    case 'dark-moody':
      return img.mood === 'dark-moody'
    case 'light-bright':
      return img.mood === 'light-bright'
    case 'colorful':
      return img.mood === 'colorful'
    case 'style-vintage':
      return img.photo_style === 'vintage'
    case 'style-editorial':
      return img.photo_style === 'editorial'
    case 'style-classic':
      return img.photo_style === 'classic'
    case 'style-documentary':
      return img.photo_style === 'documentary'
    default:
      return true
  }
}

function FilterButton({ filter, active, onClick }) {
  const isActive = active === filter.id
  return (
    <button
      onClick={() => onClick(filter.id)}
      className={`px-4 py-2 text-[11px] font-medium tracking-[0.15em] uppercase transition-colors duration-200 whitespace-nowrap ${
        isActive
          ? 'bg-[var(--forest)] text-white'
          : 'bg-[var(--cream)] text-[var(--ink-light)] hover:text-[var(--ink)]'
      }`}
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {filter.label}
      {filter.sub && (
        <span className={`block text-[9px] tracking-[0.08em] mt-0.5 normal-case font-normal ${isActive ? 'text-white/70' : 'text-[var(--ink-light)]'}`}>
          {filter.sub}
        </span>
      )}
    </button>
  )
}

export default function GalleryGrid({ images }) {
  const [active, setActive] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  const filtered = useMemo(
    () => images
      .filter(img => matchesFilter(img, active))
      .sort((a, b) => (b.quality ?? 3) - (a.quality ?? 3)),
    [images, active]
  )

  // Only show filters that have at least 1 match (hide empty categories)
  const visibleGroups = FILTER_GROUPS.map(group => ({
    ...group,
    filters: group.label === 'Season'
      ? group.filters  // always show season
      : group.filters.filter(f => f.id === 'all' || images.some(img => matchesFilter(img, f.id))),
  })).filter(group => group.filters.length > 0)

  return (
    <div>
      {/* Filter rows */}
      <div className="space-y-3 mb-12">
        {visibleGroups.map(group => (
          <div key={group.label} className="flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] tracking-[0.18em] uppercase text-[var(--ink-light)] w-20 shrink-0 hidden lg:block"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {group.label}
            </span>
            <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 lg:flex-wrap lg:overflow-x-visible">
              {group.filters.map(f => (
                <FilterButton key={f.id} filter={f} active={active} onClick={setActive} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Count */}
      <p
        className="text-[11px] tracking-[0.12em] uppercase text-[var(--ink-light)] mb-8 border-t border-[var(--border)] pt-8"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {filtered.length} {filtered.length === 1 ? 'photo' : 'photos'}
      </p>

      {/* Masonry grid */}
      {filtered.length > 0 ? (
        <div className="columns-2 lg:columns-3 gap-3 lg:gap-4">
          {filtered.map(img => (
            <div
              key={img.id}
              className="break-inside-avoid mb-3 lg:mb-4 overflow-hidden group cursor-zoom-in"
              onClick={() => setLightbox(img)}
            >
              <Image
                src={img.url}
                alt={img.alt_text || 'Rixey Manor wedding'}
                width={800}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="body-copy text-[var(--ink-light)]">No photos for this filter yet.</p>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 lg:p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-6 text-white/60 hover:text-white text-3xl leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={lightbox.url}
              alt={lightbox.alt_text || 'Rixey Manor wedding'}
              width={1600}
              height={1200}
              className="w-full h-auto max-h-[90vh] object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  )
}
