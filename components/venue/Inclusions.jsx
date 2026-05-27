import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'

const BLOCKS = [
  {
    subhead: 'The whole place.',
    copy: 'Full exclusive use of the manor house, all outdoor spaces, the rooftop, the ballroom, the terrace and patio, the lake view ceremony site, and all 30 acres of grounds. For the duration of your booking — whether that\'s a single day or a full weekend. No other events share your time here.',
  },
  {
    subhead: 'A planning portal, from the day you book.',
    copy: 'Every couple gets a custom Rixey planning portal — your own private space for the timeline, vendor details, floor plans, checklists, payments, and a direct line to your coordinator, all in one place. No lost email threads, no scattered spreadsheets. Everything for your wedding lives here, and it is yours from the moment you book.',
  },
  {
    subhead: 'The décor is already here.',
    copy: 'A full décor inventory — arbors, table numbers, card boxes, lanterns, easels, candleholders, signage and more — free for you to use. Plus the borrow shed, stocked with pieces couples have left behind from weddings past. Décor is one of the biggest line items couples brace themselves for, and at Rixey most find they barely need to buy a thing. Classic white Chiavari chairs and round, rectangular, and cocktail tables are included too.',
  },
  {
    subhead: 'A place to get ready.',
    copy: 'The Newlywed Suite is held for the couple on the wedding day. The manor\'s kitchen, dining room, library, and sitting rooms are available for VIPs and vendors. Overnight accommodation across the manor house and Blacksmith Cottage (up to 14 guests) is available as an add-on — one night, two nights, or three.',
  },
  {
    subhead: 'A coordinator — not a day-of, a real one.',
    copy: 'A Rixey coordinator is included with every booking, and it is one of the things couples are most surprised to find in the price. This is not a day-of coordinator who arrives for the ceremony and leaves after dinner. This is someone who has worked this property, knows these vendors, and has seen what can go sideways — and how to prevent it. Planning meetings throughout, a walkthrough of every detail, and full wedding day coverage from setup to send-off. Most venues charge $2,000–3,000 for a fraction of this, or leave you to hire it yourself.',
  },
  {
    subhead: 'The things you forget to budget for.',
    copy: 'A drop-off appointment the day before. Your wedding rehearsal on site. Parking. WiFi throughout the manor. BYO alcohol — no corkage fees. Licensed in-house bartending up to six hours, included in the package price.',
  },
]

export default function Inclusions({ accentImages = [] }) {
  return (
    <section id="included" className="bg-[var(--cream)] py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-20 items-start">

          {/* Left: text */}
          <div>
            <FadeUp>
              <p className="eyebrow mb-6">What Comes With Your Booking</p>
              <h2
                className="text-[30px] lg:text-[38px] leading-[1.1] text-[var(--ink)] mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Every booking includes the following.
              </h2>
              <p className="body-copy mb-14">No à la carte surprises.</p>
            </FadeUp>

            <div className="flex flex-col gap-10 mb-14">
              {BLOCKS.map((block, i) => (
                <FadeUp key={i} delay={i * 60}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3
                      className="text-[20px] lg:text-[22px] leading-snug text-[var(--ink)] italic mb-4"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {block.subhead}
                    </h3>
                    <p className="body-copy">{block.copy}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* What you bring */}
            <FadeUp>
              <div className="bg-[var(--warm-white)] border border-[var(--border)] p-8">
                <h3
                  className="text-[18px] leading-snug text-[var(--ink)] italic mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  What Rixey doesn't provide.
                </h3>
                <p className="body-copy mb-3">
                  Catering, a bar stock, and a required vendor list.
                </p>
                <p className="body-copy">
                  Which means you choose your own caterer, bring your own bar (no corkage fees), and hire
                  whoever you want for flowers, music, photography, and everything else. Couples consistently
                  say this flexibility saved them thousands. It's the point.
                </p>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="mt-8 pt-8 border-t border-[var(--border)]">
                <h3
                  className="text-[15px] text-[var(--ink)] italic mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Discounts available.
                </h3>
                <p className="body-copy text-[14px]">
                  5% off each for holding your ceremony off-site or using only recommended vendors. 10% off for under 50 Saturday guests, and 10% off for active military, veterans, and first responders. Discounts stack up to a 20% cap, and the <a href="/pricing#calculator" className="text-link">pricing calculator</a> applies them as you go.
                </p>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="mt-10 pt-10 border-t border-[var(--border)]">
                <p className="body-copy text-[14px] text-[var(--ink-light)]">
                  The list above covers what is always included. Then there is everything else couples have done here — horses, lion dances, live painters, burying a bottle of whiskey, fire pits until 2am.
                </p>
                <Link href="/extras" className="text-link inline-block mt-3" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Only at Rixey →
                </Link>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="mt-8 pt-8 border-t border-[var(--border)]">
                <p className="body-copy text-[14px] text-[var(--ink-light)]">
                  How we plan around you. LGBTQ+ couples, disabled couples, couples with chronic illness or ongoing medical needs, and neurodivergent couples are named and protected in every contract.
                </p>
                <Link href="/inclusion" className="text-link inline-block mt-3" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Built for every couple →
                </Link>
              </div>
            </FadeUp>
          </div>

          {/* Right: photo stack */}
          {accentImages.length > 0 && (
            <div className="hidden lg:flex flex-col gap-4">
              {accentImages.map((img, i) => (
                <div
                  key={i}
                  className={`relative w-full overflow-hidden ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text || 'Rixey Manor'}
                    fill
                    className="object-cover"
                    style={{ objectPosition: img.object_position || 'center center' }}
                    sizes="(max-width: 1280px) 360px, 420px"
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
