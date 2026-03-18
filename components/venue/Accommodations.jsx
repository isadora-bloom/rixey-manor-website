import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'
import ImageCarousel from '@/components/ui/ImageCarousel'

const MANOR_ROOMS = [
  {
    name: 'The Newlywed Suite',
    tag: 'California King · en suite · copper bathtub · 360-degree mirror · Juliet balcony',
    slot: 'venue-room-newlywed',
    copy: "The suite saved for the couple. A California King, a handmade copper bathtub, a 360-degree mirror, and a Juliet balcony. It's a room that knows what it's for.",
  },
  {
    name: 'The Maple Room',
    tag: 'California King four-post bed · en suite · lake and mountain views',
    slot: 'venue-room-maple',
    copy: 'A California King four-poster bed with lake and mountain views. The kind of room you want to stay in when it isn\'t your wedding night.',
  },
  {
    name: 'The Mountain Room',
    tag: 'Queen sleigh bed · copper tub · Blue Ridge views',
    slot: 'venue-room-mountain',
    copy: 'Queen sleigh bed, copper tub, Blue Ridge Mountain views. Best room to wake up in on Sunday morning.',
  },
  {
    name: 'The Garden Room',
    tag: 'Queen · en suite shower · kitchen access',
    slot: 'venue-room-back',
    copy: 'A Queen bedroom with its own shower and direct access to the kitchen. Useful for early risers and parents who need to get the kids sorted.',
  },
]

function RoomCard({ room, image }) {
  const allImages = image
    ? [{ url: image.url, alt_text: image.alt_text || room.name, object_position: image.object_position }, ...(image.extras || [])]
    : []

  return (
    <FadeUp>
      <div className="flex flex-col">
        <div className="relative w-full aspect-[4/3] bg-[var(--sage-light)] overflow-hidden mb-5">
          {allImages.length > 0 ? (
            <ImageCarousel
              images={allImages}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-[var(--sage-light)]" />
          )}
        </div>
        <p
          className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-2"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {room.tag}
        </p>
        <h4
          className="text-[20px] leading-snug text-[var(--ink)] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {room.name}
        </h4>
        <p className="body-copy text-[15px]">{room.copy}</p>
      </div>
    </FadeUp>
  )
}

export default function Accommodations({ roomImages = {} }) {
  function getImage(slot) {
    return roomImages[slot] || null
  }

  const cottageImage = getImage('venue-room-cottage')

  return (
    <section id="accommodations" className="bg-[var(--cream)] py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Intro */}
        <FadeUp>
          <div className="max-w-2xl mb-16 lg:mb-20">
            <p className="eyebrow mb-6">Stay the Weekend</p>
            <h2
              className="text-[32px] lg:text-[42px] leading-[1.1] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              The manor sleeps up to 14.
            </h2>
            <p className="body-copy">
              The manor sleeps up to 14 guests across four bedrooms and a separate cottage. On Friday night,
              everyone arrives and settles in. On Saturday, the wedding happens. On Sunday morning, there are
              pastries, bagels, and coffee waiting before everyone heads home.
            </p>
          </div>
        </FadeUp>

        {/* Manor bedrooms */}
        <FadeUp>
          <h3
            className="text-[13px] font-medium tracking-[0.2em] uppercase text-[var(--ink-light)] mb-10"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            The Manor — Four Bedrooms
          </h3>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-20">
          {MANOR_ROOMS.map(room => (
            <RoomCard key={room.name} room={room} image={getImage(room.slot)} />
          ))}
        </div>

        {/* Cottage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-12 border-t border-[var(--border)]">

          <FadeUp>
            <div className="relative w-full aspect-[3/2] bg-[var(--sage-light)] overflow-hidden">
              {cottageImage ? (
                <Image
                  src={cottageImage.url}
                  alt={cottageImage.alt_text || 'The Blacksmith Cottage'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-[var(--sage-light)]" />
              )}
            </div>
          </FadeUp>

          <FadeUp delay={100}>
            <p
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-4"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Separate from the manor house
            </p>
            <h3
              className="text-[28px] lg:text-[34px] leading-[1.15] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              The Blacksmith Cottage
            </h3>
            <p className="body-copy mb-4">
              Separate from the manor house, the Blacksmith Cottage is a full private home.
            </p>
            <p className="body-copy mb-4">
              Two bedrooms (Queen and 2 Twins), a large bathroom, a living area with a U-shaped sofa
              and Queen pullout, and a kitchen. It sleeps up to six. It's the right option for the
              bridal party, parents who want their own space, or the friends who want to stay up late
              without waking the manor.
            </p>
            <p className="body-copy">
              On the morning of the wedding, it's usually where the groom's party disappears to.
            </p>
          </FadeUp>

        </div>
      </div>
    </section>
  )
}
