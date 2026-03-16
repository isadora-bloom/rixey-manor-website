import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'

export default function StorySection({ isadoraImage }) {
  return (
    <section className="relative section-cream py-24 lg:py-32 px-6 lg:px-10 overflow-hidden">
      <div className="absolute left-[42%] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none hidden lg:block">
        <Image src="/assets/rixey-logo-icon-transparent.png" alt="" width={500} height={334} className="w-[380px]" />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-14 lg:gap-20 items-center">

        {/* Photo */}
        <FadeUp>
          <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] bg-[var(--sage-light)] overflow-hidden">
            {isadoraImage ? (
              <Image
                src={isadoraImage.url}
                alt={isadoraImage.alt_text || 'Isadora Martin-Dye at Rixey Manor'}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            ) : (
              <div className="w-full h-full bg-[var(--sage-light)]" />
            )}
          </div>
        </FadeUp>

        {/* Text */}
        <FadeUp delay={100}>
          <p className="eyebrow mb-6">The Owner</p>
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
              Isadora Martin-Dye grew up in England, moved to Los Angeles, and
              ended up in rural Virginia after finding a foreclosed 1801 estate
              listed on Zillow. The building was in bad shape. She bought it,
              moved in, and started restoring it.
            </p>
            <p className="body-copy">
              That was 2014. She's been running weddings here ever since, first
              alone, now with a small team who treat every couple the way Isadora
              treats every couple: like the only wedding that matters.
            </p>
            <p className="body-copy">
              No strangers in the next room. No one else's timeline to work
              around. Just your people and the whole estate, for as long as you
              need it.
            </p>
          </div>

          {/* Madeline Stuart callout */}
          <blockquote className="border-l-2 border-[var(--sage)] pl-5 mb-10">
            <p
              className="text-[15px] leading-[1.75] text-[var(--ink-mid)] italic mb-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              "A lot of newly engaged women cannot see themselves as a bride
              because all the images magazines use are of these tall, thin
              models. Being a bride is a life experience that every woman
              should be able to see herself doing."
            </p>
            <cite
              className="text-[12px] tracking-[0.12em] uppercase not-italic text-[var(--ink-light)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Isadora — on hosting Madeline Stuart, the world's first
              professional model with Down syndrome, for a bridal shoot
              at Rixey in 2016. Covered by CNN, People, HuffPost &amp; TODAY.
            </cite>
          </blockquote>

          <Link href="/venue#team" className="text-link">
            Meet the full team →
          </Link>
        </FadeUp>

      </div>
    </section>
  )
}
