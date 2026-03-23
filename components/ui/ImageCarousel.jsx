'use client'

import { useState } from 'react'
import Image from 'next/image'

// images: [{ url, alt_text, object_position }] — first item is the primary image
export default function ImageCarousel({ images = [], sizes, className = '', style = {} }) {
  const [idx, setIdx] = useState(0)
  if (!images || images.length === 0) return null

  const img   = images[idx]
  const total = images.length

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <Image
        src={img.url}
        alt={img.alt_text || ''}
        fill
        className="object-cover transition-opacity duration-300"
        style={{ objectPosition: img.object_position || 'center center', zIndex: 0 }}
        sizes={sizes}
      />

      {total > 1 && (
        <>
          {/* Prev */}
          <button
            onClick={() => setIdx(i => Math.max(0, i - 1))}
            aria-label="Previous image"
            disabled={idx === 0}
            style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              zIndex: 10, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: idx === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.45)',
              color: 'white', border: 'none', cursor: idx === 0 ? 'default' : 'pointer',
              fontFamily: 'var(--font-ui)', fontSize: 20, lineHeight: 1,
              transition: 'background 0.2s',
            }}
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={() => setIdx(i => Math.min(total - 1, i + 1))}
            aria-label="Next image"
            disabled={idx === total - 1}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              zIndex: 10, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: idx === total - 1 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.45)',
              color: 'white', border: 'none', cursor: idx === total - 1 ? 'default' : 'pointer',
              fontFamily: 'var(--font-ui)', fontSize: 20, lineHeight: 1,
              transition: 'background 0.2s',
            }}
          >
            ›
          </button>

          {/* Dots */}
          <div style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, display: 'flex', gap: 6,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Image ${i + 1}`}
                style={{
                  width: 7, height: 7, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0,
                  background: i === idx ? 'white' : 'rgba(255,255,255,0.4)',
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <div style={{
            position: 'absolute', top: 10, right: 10, zIndex: 10,
            background: 'rgba(0,0,0,0.35)', color: 'white', padding: '3px 8px',
            fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.05em',
          }}>
            {idx + 1} / {total}
          </div>
        </>
      )}
    </div>
  )
}
