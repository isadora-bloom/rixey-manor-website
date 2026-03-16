import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'

export default function OwnerStory({ image }) {
  return (
    <section id="story" className="bg-[var(--warm-white)] py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-14 lg:gap-20 items-start">

        {/* Photo */}
        <FadeUp>
          <div className="flex flex-col">
            <div className="relative w-full aspect-[4/5] bg-[var(--sage-light)] overflow-hidden">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.alt_text || 'Isadora Martin-Dye at Rixey Manor'}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="w-full h-full bg-[var(--sage-light)]" />
              )}
            </div>
            <p
              className="mt-3 text-[12px] text-[var(--ink-light)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Isadora Martin-Dye, owner of Rixey Manor since 2014.
            </p>
          </div>
        </FadeUp>

        {/* Text */}
        <FadeUp delay={100}>
          <p className="eyebrow mb-6">How Rixey Manor Came to Be</p>
          <h2
            className="text-[30px] lg:text-[38px] leading-[1.15] text-[var(--ink)] mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            She found it on Zillow.
            It was derelict.
            <em> She bought it anyway.</em>
          </h2>
          <div className="flex flex-col gap-5">
            <p className="body-copy">
              Before all this, Isadora spent years in Los Angeles working in film, TV, and talent management —
              running her own company, working on productions like The Hunger Games. That world trained her in
              the things that matter most: high-pressure logistics, an eye for detail, and knowing how to make
              a hundred moving parts look effortless on the day.
            </p>
            <p className="body-copy">
              She found a foreclosed 1801 estate on Zillow. The building had been abandoned.
              The grounds were overgrown. Most people would have kept scrolling.
            </p>
            <p className="body-copy">
              She didn't. She bought it, moved in, and started restoring it by hand.
            </p>
            <p className="body-copy">
              That was 2014. Since then, Rixey Manor has hosted over 350 weddings. Hall of Fame status on The Knot.
              Couples who write long notes years later to say it was the best decision they made.
            </p>
            <p className="body-copy">
              What hasn't changed: one wedding at a time. That was the original standard and it remains the
              standard. Not because it's a marketing line — Isadora knows what happens to a place when
              you start running it like a factory. It stops being a place.
            </p>
            <p className="body-copy">
              Couples often say they felt like they were staying in a friend's home. That's the goal.
              It's also, genuinely, what it is.
            </p>
          </div>

          {/* Credentials */}
          <div className="mt-10 pt-8 border-t border-[var(--border)] flex flex-col gap-8">

            <div>
              <p
                className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--ink-light)] mb-4"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Qualifications & Recognition
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  'Certified Elite Wedding Planner',
                  'Member of The Knot Hall of Fame',
                  '350+ weddings personally planned and coordinated',
                  'Inclusive, LGBTQ+ affirming & culturally fluent',
                  'Dual UK / US citizenship — international client friendly',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[6px] w-1 h-1 rounded-full bg-[var(--rose)] flex-shrink-0" />
                    <span
                      className="text-[14px] leading-snug text-[var(--ink-light)]"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--ink-light)] mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Featured In
              </p>
              <p
                className="text-[13px] leading-relaxed text-[var(--ink-light)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Martha Stewart Weddings · Washingtonian Weddings · People Magazine · The Venue Report · Style Me Pretty · Refinery29 · Virginia Bride Magazine
              </p>
            </div>

          </div>
        </FadeUp>

      </div>
    </section>
  )
}
