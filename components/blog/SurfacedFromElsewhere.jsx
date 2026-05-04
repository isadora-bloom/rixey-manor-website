// Cards for posts that live canonically on another site (Isadora & Co etc)
// but are tagged for surfacing on Rixey. Click goes to the canonical URL,
// not to /blog/[slug] here — those posts are NOT in our sitemap and we
// don't want duplicate-content signals.

import Image from 'next/image'

export default function SurfacedFromElsewhere({ posts }) {
  return (
    <div>
      <p
        className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-3"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        From elsewhere
      </p>
      <h2
        className="text-[28px] lg:text-[36px] leading-[1.15] text-[var(--ink)] mb-8 max-w-2xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Worth a read from across the Isadora &amp; Co world
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.canonical_url}
            target="_blank"
            rel="noopener"
            className="no-underline group block"
          >
            {p.cover_image && (
              <div className="relative w-full aspect-[3/2] overflow-hidden mb-5">
                <Image
                  src={p.cover_image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  unoptimized
                />
              </div>
            )}
            <div className="border-t border-[var(--border)] pt-7">
              <p
                className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--ink-light)] mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                On {p.canonical_label}
              </p>
              <h3
                className="text-[20px] lg:text-[22px] leading-[1.2] text-[var(--ink)] mb-3 group-hover:text-[var(--forest)] transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="body-copy text-[15px] mb-4 line-clamp-3">{p.excerpt}</p>
              )}
              <span className="text-link">Read on {p.canonical_label} →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
