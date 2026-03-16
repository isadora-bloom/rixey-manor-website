import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'
import CalendlyPopupButton from '@/components/ui/CalendlyPopupButton'

export default function PricingSignal({ oneDayFrom, weekendFrom, availabilityBlurb, calendlyUrl = '' }) {
  const oneDay = oneDayFrom || '$6,000'
  const weekend = weekendFrom || '$20,000+'
  const availability = availabilityBlurb || 'Peak season weekends still available in 2026 & 2027'

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
              Midweek and one-day weddings start from <strong>{oneDay}</strong>.
              Full weekends in peak season reach <strong>{weekend}</strong> depending on guest count and what you add.
              You can build your own estimate before you ever talk to us.
            </p>
            <p className="body-copy">
              What you see is what you pay. No corkage fees — you buy your own
              bar at retail and keep the difference. No required vendors. No
              mandatory upgrades. A coordinator, overnight rooms, and a full
              décor borrow shed are included before you spend a dollar extra.
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
              <p className="body-copy text-[14px] mb-6">
                Peak season runs April through November.
                Weekends book quickly. Autumn especially.
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
