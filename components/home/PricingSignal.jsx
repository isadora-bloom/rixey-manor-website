import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'
import CalendlyPopupButton from '@/components/ui/CalendlyPopupButton'

export default function PricingSignal({ oneDayFrom, weekendFrom, availabilityBlurb, calendlyUrl = '' }) {
  // Defaults aligned with the three-package, two-tier season model.
  // Midweek (off-season) is the lowest starting point; Estate Weekend (peak)
  // is the upper bound on the headline range. Real values come from
  // site_content.pricing_one_day_from / pricing_weekend_from when present.
  const oneDay = oneDayFrom || '$7,000'
  const weekend = weekendFrom || '$21,000'
  const availability = availabilityBlurb || 'Now taking 2027 and 2028 dates.'

  return (
    <section className="section-warm-white py-24 lg:py-32 px-6 lg:px-10 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — copy */}
        <FadeUp>
          <p className="eyebrow mb-6">Transparent Pricing</p>
          <h2
            className="text-[36px] lg:text-[44px] leading-[1.05] text-[var(--ink)] mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            No hidden fees.<br />
            No surprises.<br />
            <em>No nonsense.</em>
          </h2>
          <div className="flex flex-col gap-5 mb-10">
            <p className="body-copy">
              Three packages. Midweek weddings start from <strong>{oneDay}</strong>.
              Estate Weekends — Friday rehearsal dinner through Sunday brunch with
              two nights of lodging — reach <strong>{weekend}</strong> in peak season,
              depending on guest count and what you add. You can build your own
              estimate before you ever talk to us.
            </p>
            <p className="body-copy">
              What you see is what you pay. Licensed bartending, linens, our silk floral
              and candle package, and the day-of venue team are <strong>in the price</strong>.
              No corkage fees, no required vendors, no markup on your other vendors. The
              coordinator and the borrow shed come with every package, before you spend
              a dollar extra.
            </p>
          </div>
          <Link href="/pricing" className="btn-primary">
            Build your estimate
          </Link>
        </FadeUp>

        {/* Right — availability signal */}
        <FadeUp delay={150}>
          <div className="lg:pl-12 lg:border-l lg:border-[var(--border)]">
            <div className="bg-[var(--cream)] p-8 lg:p-10">
              <p
                className="text-[13px] tracking-[0.15em] uppercase text-[var(--sage)] mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Availability
              </p>
              <p
                className="text-[22px] lg:text-[26px] leading-[1.3] text-[var(--ink)] mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {availability}
              </p>
              <p className="body-copy text-[14px] mb-3">
                We host 30 weddings a year — not because that's all the estate can hold,
                but because it's all we can do properly. Every couple gets the same
                coordinator, the same team, real attention. That number is the point.
              </p>
              <p className="body-copy text-[14px] mb-6">
                Off-season is January, February, July and August.
                Peak is everything else. Autumn Saturdays go earliest.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/availability" className="text-link">
                  See the full calendar →
                </Link>
                <Link href="/pricing#calculator" className="text-link">
                  Build your estimate →
                </Link>
                <CalendlyPopupButton url={calendlyUrl} className="text-link text-left">
                  Book a tour →
                </CalendlyPopupButton>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
