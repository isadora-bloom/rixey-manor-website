import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'

const LOCAL_SPACE_IMAGES = {
  ballroom: '/assets/space-ballroom.webp',
}

const defaultSpaces = [
  {
    slug: 'ceremony',
    eyebrow: 'The Ceremony Site',
    name: '225-year-old carriage steps',
    description:
      'Rixey Lake in front of you. The Blue Ridge Mountains behind your guests. The original carriage steps — carved into the hillside over two centuries ago — frame the aisle in a way no decorator could replicate.',
    highlight: 'In ten years, couples still send photos from this spot.',
  },
  {
    slug: 'terrace',
    eyebrow: 'The Terrace',
    name: 'The lights that went viral',
    description:
      'A clear-span tent on the terrace with string lights overhead, mountain views through the walls. The way the light falls at night has produced some of the most-shared wedding moments on the internet. Couples are always surprised by it.',
    highlight: 'The tent goes up, the space transforms. Every time.',
  },
  {
    slug: 'ballroom',
    eyebrow: 'The Ballroom',
    name: 'Twenty crystal chandeliers',
    description:
      'French doors on three sides. Natural light until the candles take over. Climate controlled, fully accessible, built for a party.',
    highlight: 'Hundreds of weddings have happened in this room. You can feel it.',
  },
]

const BAR = {
  eyebrow: 'The Bar',
  name: 'Built-in, beautiful, and entirely yours.',
  description: 'The bar at Rixey is not an afterthought. It\'s a proper built-in fixture — the kind of thing guests photograph and couples end up mentioning in their thank-you notes. Bring your own stock, no corkage fees, no restrictions on what you pour. Our licensed in-house bartenders staff the bar (required, two-bartender minimum, billed separately). Stock it your way; serve it our way.',
  highlight: 'No corkage fees. No mandatory packages. Just a beautiful bar, stocked your way.',
}

export default function SpacesSection({ spaces = [], spaceImages = {} }) {
  const displaySpaces = spaces.length > 0
    ? spaces.filter(s => ['ceremony', 'terrace', 'ballroom'].includes(s.slug)).slice(0, 3)
    : defaultSpaces

  function getSpaceImage(slug) {
    return spaceImages[slug] || null
  }

  return (
    <section className="section-cream py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        <FadeUp>
          <div className="mb-16">
            <p className="eyebrow mb-4">The Spaces</p>
            <h2
              className="text-[36px] lg:text-[44px] leading-[1.1] text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Every part of the estate,<br />
              <em>all weekend long.</em>
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {displaySpaces.map((space, i) => {
            const img = getSpaceImage(space.slug)
            return (
              <FadeUp key={space.slug} delay={i * 100}>
                <article className="flex flex-col">
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] bg-[var(--sage-light)] overflow-hidden mb-5">
                    {(img || LOCAL_SPACE_IMAGES[space.slug]) ? (
                      <Image
                        src={img?.url || LOCAL_SPACE_IMAGES[space.slug]}
                        alt={img?.alt_text || `${space.name} at Rixey Manor`}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--sage-light)]" />
                    )}
                  </div>

                  {/* Text */}
                  <p className="eyebrow mb-2">{space.eyebrow}</p>
                  <h3
                    className="text-[22px] lg:text-[24px] text-[var(--ink)] mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {space.name}
                  </h3>
                  <p className="body-copy text-[15px] mb-3 leading-[1.75]">
                    {space.description}
                  </p>
                  <p
                    className="text-[14px] italic text-[var(--ink-light)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {space.highlight}
                  </p>
                </article>
              </FadeUp>
            )
          })}
        </div>

        {/* Bar — featured */}
        <FadeUp delay={200}>
          <div className="mt-16 pt-14 border-t border-[var(--border)] grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {spaceImages?.bar ? (
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={spaceImages.bar.url}
                  alt={spaceImages.bar.alt_text || 'The bar at Rixey Manor'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : null}
            <div className={!spaceImages?.bar ? 'lg:col-span-2 max-w-2xl' : ''}>
              <p className="eyebrow mb-2">{BAR.eyebrow}</p>
              <h3
                className="text-[22px] lg:text-[28px] text-[var(--ink)] mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {BAR.name}
              </h3>
              <p className="body-copy mb-4">{BAR.description}</p>
              <p className="text-[14px] italic text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-body)' }}>
                {BAR.highlight}
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={300}>
          <div className="mt-14">
            <Link href="/venue" className="text-link">
              See every space →
            </Link>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
