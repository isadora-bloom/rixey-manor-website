import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'

export default function DetailsSection() {
  return (
    <section id="details" className="bg-[var(--warm-white)] py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        <FadeUp>
          <p className="eyebrow mb-10">Details & Policies</p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">

          {/* Left column */}
          <FadeUp>
            <div className="flex flex-col gap-10">

              <div>
                <h3
                  className="text-[18px] italic text-[var(--ink)] mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Guest capacity.
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    ['Indoor reception (ballroom)', 'up to 100 guests'],
                    ['Outdoor reception (terrace/patio with tent)', 'up to 200+ guests'],
                    ['Ceremony (lake view site)', 'up to 250 guests'],
                    ['Overnight accommodation', 'up to 14 guests (manor + cottage)'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-baseline gap-4 py-2 border-b border-[var(--border)]">
                      <span className="body-copy text-[15px]">{label}</span>
                      <span
                        className="text-[12px] font-medium tracking-wide text-[var(--ink-light)] whitespace-nowrap"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3
                  className="text-[18px] italic text-[var(--ink)] mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Location.
                </h3>
                <p className="body-copy mb-3">
                  9155 Pleasant Hill Lane, Rixeyville, Virginia 22737.
                </p>
                <p className="body-copy">
                  60 miles from Washington DC, Charlottesville, Fredericksburg, and Middleburg.
                  A straightforward drive on I-66 or Route 29 from Northern Virginia.
                </p>
              </div>

            </div>
          </FadeUp>

          {/* Right column */}
          <FadeUp delay={100}>
            <div className="flex flex-col gap-10">

              <div>
                <h3
                  className="text-[18px] italic text-[var(--ink)] mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Pets.
                </h3>
                <p className="body-copy">
                  Pets are welcome, including at the ceremony. Approximately half of Rixey couples bring
                  their dogs. The grounds are large, the team is used to them, and the rooftop makes for
                  excellent dog photos.
                </p>
              </div>

              <div>
                <h3
                  className="text-[18px] italic text-[var(--ink)] mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Accessibility.
                </h3>
                <p className="body-copy mb-3">
                  The main floor of the manor, the ballroom, the terrace, and the patio are ADA accessible.
                  The rooftop is staircase access only. Upper-floor bedrooms are staircase access only.
                </p>
                <p className="body-copy">
                  If accessibility is a priority for your guests, let us know during your tour and we'll walk
                  through the logistics together.
                </p>
              </div>

              <div>
                <h3
                  className="text-[18px] italic text-[var(--ink)] mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Discounts.
                </h3>
                <p className="body-copy mb-3">
                  10% discount for active military, veterans, and first responders. Applied to venue fee. Confirm eligibility when booking.
                </p>
                <p className="body-copy">
                  Off-peak pricing available for non-peak months and weekdays, visible in the{' '}
                  <Link href="/pricing" className="text-link-forest">pricing calculator</Link>.
                </p>
              </div>

              <div>
                <h3
                  className="text-[18px] italic text-[var(--ink)] mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Elopements.
                </h3>
                <p className="body-copy">
                  Elopement packages are available Monday through Wednesday for up to 12 guests.
                  Packages range from $950 to $1,250.{' '}
                  <a href="mailto:info@rixeymanor.com" className="text-link-forest">Contact us</a>{' '}
                  for current availability.
                </p>
              </div>

            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  )
}
