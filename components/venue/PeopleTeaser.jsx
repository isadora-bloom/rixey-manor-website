import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'

// Compact teaser that replaced the full Owner story + Team blocks on /venue.
// The canonical, long-form version now lives on /history — this avoids the
// same story and team bios being duplicated across two indexed pages.
export default function PeopleTeaser({ image }) {
  return (
    <section id="story" className="section-cream py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-14 lg:gap-20 items-center">

        <FadeUp>
          <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] bg-[var(--sage-light)] overflow-hidden">
            {image ? (
              <Image
                src={image.url}
                alt={image.alt_text || 'Isadora Martin-Dye at Rixey Manor'}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            ) : (
              <div className="w-full h-full bg-[var(--sage-light)]" />
            )}
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <p className="eyebrow mb-6">Our Story &amp; Team</p>
          <h2
            className="text-[30px] lg:text-[38px] leading-[1.15] text-[var(--ink)] mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            She found it on Zillow.
            It was derelict.
            <em> She bought it anyway.</em>
          </h2>
          <div className="flex flex-col gap-5 mb-10">
            <p className="body-copy">
              Isadora Martin-Dye found a foreclosed 1801 estate on Zillow, bought it, and
              restored it by hand. That was 2014. She has run weddings here ever since,
              first alone, now with a small team who have mostly been here for more than ten
              years.
            </p>
            <p className="body-copy">
              The house goes back much further. It began as a plain working farmhouse, and
              the grand columned front everyone photographs was only added in the early 1900s,
              built for Margaret Rixey's wedding to Jim Dyer. It is a good story, and it is
              worth the full read.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <Link href="/history" className="text-link">
              Read the full history →
            </Link>
            <Link href="/history#team" className="text-link">
              Meet the team →
            </Link>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
