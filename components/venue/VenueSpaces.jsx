import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'

const SPACES = [
  {
    id: 'ceremony',
    name: 'The Ceremony Site',
    tag: 'Outdoor ceremony · up to 250 guests',
    imageLabel: 'ceremony',
    copy: [
      'The 225-year-old carriage steps descend toward Rixey Lake, with the Blue Ridge Mountains rising behind your guests. Photographers never have to worry about a bad background here — the backdrop does the work before a camera is raised.',
      'On still mornings, fog lifts off the water. In the afternoon the light comes in from the west and goes warm.',
    ],
  },
  {
    id: 'terrace',
    name: 'The Terrace',
    tag: 'Outdoor reception & dining · clear-span tent · up to 200 guests · Blue Ridge views · ADA accessible',
    imageLabel: 'terrace',
    copy: [
      'A sparkling clear-span tent on the terrace — string lights overhead, mountain views through the walls, the whole evening framed in glass. It works for cocktail hour, al fresco dinners, and dancing. Up to 200 guests under the tent.',
      'The way the lights fall at night is something guests photograph and post without being asked. It has made Rixey one of the most-shared wedding venues in the region. In summer months a white shade tent can be added for guest comfort. In cooler months, standing heaters keep the evening going longer than anyone planned. The terrace is step-free from the parking area and fully accessible. On warm evenings the sides roll up. In autumn the mountains turn and the light does something impossible.',
    ],
  },
  {
    id: 'ballroom',
    name: 'The Ballroom',
    tag: 'Indoor reception · climate controlled · up to 100 guests · ADA accessible',
    imageLabel: 'ballroom',
    copy: [
      'Twenty crystal chandeliers. French doors on three sides. Natural light until the candles take over. Commercial climate control keeps it comfortable year round — making the ballroom the reason a winter wedding here works just as well as any other season.',
      'The ballroom holds up to 100 guests for a seated dinner and is fully accessible from the parking area. Hundreds of weddings have happened in this room. You can feel it — not in a haunted way, in the way that makes first dances feel like they mean something.',
    ],
  },
  {
    id: 'rooftop',
    name: 'The Rooftop',
    tag: 'Cocktail hour or ceremony alternative · 1,800 sq ft · staircase access only',
    imageLabel: 'rooftop',
    copy: [
      '1,800 square feet of open rooftop, facing west. Cocktail hour up here means your guests watch the sun drop behind the Blue Ridge while holding their first drink of the evening.',
      'Staircase access only — not suitable for guests with mobility limitations. For accessible outdoor events the terrace is the right choice.',
    ],
  },
]

function SpaceCard({ space, image, reverse }) {
  const bg = reverse ? 'bg-[var(--cream)]' : 'bg-[var(--warm-white)]'

  return (
    <div className={`${bg} py-16 lg:py-24 px-6 lg:px-10`}>
      <div className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>

        {/* Image */}
        <FadeUp>
          <div className="relative w-full aspect-[3/2] bg-[var(--sage-light)] overflow-hidden">
            {image ? (
              <Image
                src={image.url}
                alt={image.alt_text || space.name}
                fill
                className="object-cover"
                quality={85}
                style={{ objectPosition: image.object_position || 'center center' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-[var(--sage-light)] flex items-center justify-center">
                <span
                  className="text-[11px] tracking-widest uppercase text-[var(--ink-light)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {space.name}
                </span>
              </div>
            )}
          </div>
        </FadeUp>

        {/* Text */}
        <FadeUp delay={100}>
          <p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-4"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {space.tag}
          </p>
          <h3
            className="text-[28px] lg:text-[34px] leading-[1.15] text-[var(--ink)] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {space.name}
          </h3>
          <div className="flex flex-col gap-4">
            {space.copy.map((p, i) => (
              <p key={i} className="body-copy">{p}</p>
            ))}
          </div>
        </FadeUp>

      </div>
    </div>
  )
}

export default function VenueSpaces({ spaceImages = {} }) {
  function getImage(label) {
    return spaceImages[label] || null
  }

  return (
    <section id="spaces">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-4 bg-[var(--warm-white)]">
        <FadeUp>
          <p className="eyebrow mb-4">The Spaces</p>
          <p className="body-copy max-w-2xl">
            Every part of the estate is yours for the weekend. Here's what you're working with.
          </p>
        </FadeUp>
      </div>

      {SPACES.map((space, i) => (
        <SpaceCard
          key={space.id}
          space={space}
          image={getImage(space.imageLabel)}
          reverse={i % 2 !== 0}
        />
      ))}
    </section>
  )
}
