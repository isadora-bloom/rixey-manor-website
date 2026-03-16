import Image from 'next/image'

export default function VenueHero({ heroImage }) {
  return (
    <section className="relative min-h-[80vh] lg:min-h-[100dvh] flex items-end lg:items-center overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        {heroImage?.url ? (
          <Image
            src={heroImage.url}
            alt={heroImage.alt_text || 'Rixey Manor estate grounds'}
            fill
            className="object-cover object-center"
            priority
            quality={90}
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-[var(--ink)]" />
        )}
        {/* Dark overlay — full bleed, lighter on desktop */}
        <div className="absolute inset-0 bg-[var(--ink)]/55 lg:bg-[var(--ink)]/40" />
        {/* Desktop: subtle extra darkness on left so text is readable */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[var(--ink)]/30 to-transparent" />
      </div>

      {/* Text — overlaid */}
      <div className="relative z-10 px-8 lg:px-16 pb-16 lg:pb-0 pt-32 lg:pt-0 max-w-xl">
        <p className="eyebrow-sage mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>Rixeyville, Virginia &nbsp;·&nbsp; Est. 1801</p>
        <h1
          className="text-[44px] sm:text-[56px] lg:text-[64px] leading-[1.05] mb-6"
          style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}
        >
          Thirty acres.<br />
          <em>One wedding.</em><br />
          <em>All weekend.</em>
        </h1>
        <p
          className="text-[17px] lg:text-[18px] leading-[1.75] max-w-md mb-8"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.8)' }}
        >
          Everything you need to know about the manor, the spaces, the people who run it, and how it all works.
        </p>
        <a
          href="https://www.theknot.com/marketplace/rixey-manor"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 no-underline group"
        >
          <span style={{ color: 'var(--rose)', fontSize: '13px' }}>★★★★★</span>
          <span
            className="text-[11px] tracking-[0.15em] uppercase transition-colors"
            style={{ fontFamily: 'var(--font-ui)', color: 'rgba(255,255,255,0.55)' }}
          >
            The Knot Hall of Fame &nbsp;·&nbsp; 220+ Reviews
          </span>
        </a>
      </div>

    </section>
  )
}
