import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'

export default function OneThingSection() {
  return (
    <section id="one-thing" className="relative section-cream py-24 lg:py-32 px-6 lg:px-10 overflow-hidden">
      {/* House watermark */}
      <div className="absolute right-[48%] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none hidden lg:block">
        <Image src="/assets/rixey-logo-icon-transparent.png" alt="" width={500} height={334} className="w-[420px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 lg:gap-20 items-center">

        {/* Text */}
        <FadeUp>
          <p className="eyebrow mb-6">Why couples choose Rixey</p>
          <h2
            className="text-[36px] lg:text-[44px] leading-[1.1] text-[var(--ink)] mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Not another wedding venue.<br />
            <em>A home you get to borrow<br />for the weekend.</em>
          </h2>

          <div className="flex flex-col gap-6">
            <p className="body-copy">
              Most couples come to us after realising the venue search is harder
              than it looked. Too many rules. Too many restrictions. Too many venues
              that feel like a vendor transaction rather than a place to actually
              get married. Rixey is a different kind of answer.
            </p>
            <p className="body-copy">
              We're in Rixeyville, Virginia — an hour from Washington DC, 30 minutes from Warrenton,
              deep in the Culpeper County countryside with the Blue Ridge on the horizon.
              Most venues give you a room for a few hours and a list of rules.
              Rixey Manor gives you a {new Date().getFullYear() - 1801}-year-old estate: the whole building,
              the whole 30 acres, for your entire stay.
            </p>
            <p className="body-copy">
              Bring whoever you want to cook the food. Bring your own bar —
              no corkage fee, no required wine list, just retail prices and
              our licensed bartenders to pour it. Bring the dog. Stay the night.
              Stay two nights. Take over the rooftop for cocktail hour, the
              ballroom for dancing, the 225-year-old carriage steps overlooking
              the lake for your ceremony.
            </p>
            <p className="body-copy">
              And we have a borrow shed. A decade of weddings here has left behind
              real things: arbors, lanterns, table numbers, candleholders, signs,
              card boxes, frames. All of it is yours to use at no extra charge.
              Most couples end up cutting a meaningful amount from their rentals budget
              once they find out it exists.
            </p>
            <p className="body-copy">
              There are no other events. No strangers in the next room. No one
              hurrying you out at midnight. Just your people, your weekend, your
              wedding, exactly as you imagined it.
            </p>
          </div>
        </FadeUp>

        {/* Sketch */}
        <FadeUp delay={150}>
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative w-full max-w-[460px]">
              <Image
                src="/assets/rixey-sketch.png"
                alt="Pen and ink sketch of Rixey Manor"
                width={1080}
                height={1080}
                className="w-full h-auto"
              />
            </div>
            <p
              className="mt-4 text-[12px] text-[var(--ink-light)] leading-relaxed max-w-[380px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              A pen and ink sketch of the manor. Artist: Michelle Miller Powell.
            </p>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
