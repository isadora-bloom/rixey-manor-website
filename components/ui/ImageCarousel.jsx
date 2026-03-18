'use client'

import { useState } from 'react'
import Image from 'next/image'

// images: [{ url, alt_text }] — first item is the primary image
export default function ImageCarousel({ images = [], sizes, className = '', style = {} }) {
  const [idx, setIdx] = useState(0)
  if (!images || images.length === 0) return null

  const img = images[idx]
  const total = images.length

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <Image
        src={img.url}
        alt={img.alt_text || ''}
        fill
        className="object-cover transition-opacity duration-300"
        style={{ objectPosition: img.object_position || 'center center' }}
        sizes={sizes}
      />

      {total > 1 && (
        <>
          {/* Prev */}
          {idx > 0 && (
            <button
              onClick={() => setIdx(i => i - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors"
              style={{ fontFamily: 'var(--font-ui)', fontSize: 16 }}
            >
              ‹
            </button>
          )}

          {/* Next */}
          {idx < total - 1 && (
            <button
              onClick={() => setIdx(i => i + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors"
              style={{ fontFamily: 'var(--font-ui)', fontSize: 16 }}
            >
              ›
            </button>
          )}

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Image ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
