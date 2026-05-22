import Link from 'next/link'
import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'
import PricingCalculator from '@/components/pricing/PricingCalculator'
import InclusionGrid from '@/components/pricing/InclusionGrid'
import AnchorNav from '@/components/layout/AnchorNav'
import FinalCTA from '@/components/home/FinalCTA'
import CalendlyInline from '@/components/ui/CalendlyInline'
import { ROWS, filterRowsBySection } from '@/lib/inclusionRows'
import { supabaseServer } from '@/lib/supabaseServer'
import { getSiteImages } from '@/lib/getSiteImages'
import { getOgImage } from '@/lib/getPageSeo'
const supabase = supabaseServer()

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const ogImage = await getOgImage('pricing')
  return {
    title: { absolute: 'Wedding Venue Pricing — Honest, No Surprises — Rixey Manor' },
    description: 'Calculate your actual cost. One-day and full weekend packages. Military discount, off-peak rates, elopement pricing. No hidden fees.',
    alternates: { canonical: 'https://www.rixeymanor.com/pricing' },
    openGraph: {
      title: 'Wedding Venue Pricing — Honest, No Surprises — Rixey Manor',
      description: 'Calculate your actual cost. One-day and full weekend packages. Military discount, off-peak rates, elopement pricing. No hidden fees.',
      url: 'https://www.rixeymanor.com/pricing',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://www.rixeymanor.com/pricing' },
  ],
}

const PRICING_ANCHORS = [
  { label: 'Why',             href: '#included' },
  { label: "What's In It",    href: '#whats-in-it' },
  { label: 'Calculator',      href: '#calculator' },
  { label: 'Other Costs',     href: '#other-costs' },
  { label: 'Elopements',      href: '#elopements' },
  { label: 'Book a Tour',     href: '#book-tour' },
]

const pricingFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the three Rixey Manor wedding packages?',
      acceptedAnswer: { '@type': 'Answer', text: 'There are three. The Estate Weekend (Friday afternoon through Sunday morning, includes Friday rehearsal dinner and two nights of lodging for up to 14 guests). The Wedding Day (Saturday only, 8am to 10pm, no rehearsal dinner, overnights available as upgrades). The Midweek Wedding (Tuesday or Wednesday, 8am to 9pm, no rehearsal dinner and no overnights). Same venue, same team, same coordinator across all three.' },
    },
    {
      '@type': 'Question',
      name: 'What is included in the Rixey Manor wedding package?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every package includes full exclusive use of the estate (one wedding per weekend), a Rixey coordinator, the day-of venue team, licensed in-house bartending (up to 6 hours), table linens, our silk floral and candle centerpiece package, Chiavari chairs and tables, the borrow shed (décor library), BYOB with no corkage fees, and no required vendor list. Catering, alcohol, and third-party vendors are chosen by the couple. The Estate Weekend additionally includes Friday rehearsal dinner space and two nights of lodging for up to 14 guests.' },
    },
    {
      '@type': 'Question',
      name: 'Can we bring our own alcohol?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Rixey Manor is BYOB with no corkage fees — you source and purchase your own bar at retail. Bartending is included in the package price (up to 6 hours, or 7 if you add an extra hour beyond the 10pm finish), staffed by our licensed in-house team, as required by Virginia ABC licensing and insurance. Outside bartenders are not permitted.' },
    },
    {
      '@type': 'Question',
      name: 'What time does the wedding need to wrap up?',
      acceptedAnswer: { '@type': 'Answer', text: 'On the Estate Weekend and Wedding Day, the standard wrap is 10pm. Extra hours are available as an upgrade at $750 per hour. After 10pm the celebration moves indoors — the bar can keep pouring and the music can keep playing inside — or guests can gather around the fire pit outside. There is no amplified music outdoors after 10pm. Adding an extra hour also extends the bar service maximum from 6 hours to 7. The Midweek Wedding finishes at 9pm with the property fully cleared by 10pm; no extensions available on Midweek.' },
    },
    {
      '@type': 'Question',
      name: 'Do you require us to use your preferred vendors?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Rixey Manor has no required vendor list. You can hire any licensed and insured caterer, photographer, florist, DJ, or other vendor you choose. The only exception is bartending, which is included in the package and staffed by our licensed in-house team. We do not take a markup or referral commission on your other vendors.' },
    },
    {
      '@type': 'Question',
      name: 'Is there a military or first responder discount?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. A 10% discount applies for active military, veterans, and first responders. Discounts stack with off-site ceremony (5%), recommended vendors only (5%), and under-50 Saturday guests (10%), up to a total cap of 20%.' },
    },
    {
      '@type': 'Question',
      name: 'Do you offer elopement packages?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Elopement packages are available Monday through Wednesday for up to 12 guests, ranging from $950 to $1,250.' },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum guest count?',
      acceptedAnswer: { '@type': 'Answer', text: '200 guests Saturday on any package. The Estate Weekend Friday rehearsal dinner is capped at 150 guests. There is no minimum — we host elopements as small as twelve and weddings up to two hundred.' },
    },
    {
      '@type': 'Question',
      name: 'Are pets welcome at the ceremony?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Dogs are welcome at the ceremony and on the property.' },
    },
    {
      '@type': 'Question',
      name: 'Are there hidden fees?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. There is no cake-cutting fee, no corkage fee, no service charge added at the end, no venue insurance requirement, and no vendor markup or facility fee on your other vendors. The price quoted in the calculator is what you pay (plus 6% Virginia sales tax, shown).' },
    },
  ],
}

async function getCalendlyUrl() {
  const { data } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', 'calendly_url')
    .single()
  return data?.value || ''
}

async function getPricingImages() {
  return getSiteImages([
    'pricing-banner',
    'pricing-accent-inclusions', 'pricing-inclusions-2', 'pricing-inclusions-3',
    'pricing-accent-elopements',
    'pricing-mid-strip',
  ])
}


export default async function PricingPage() {
  const [calendlyUrl, pricingImages] = await Promise.all([getCalendlyUrl(), getPricingImages()])
  const heroImage = pricingImages['pricing-banner']
  const inclusionsImages = [
    pricingImages['pricing-accent-inclusions'],
    pricingImages['pricing-inclusions-2'],
    pricingImages['pricing-inclusions-3'],
  ].filter(Boolean)
  const elopementsImage = pricingImages['pricing-accent-elopements']
  const midStripImage = pricingImages['pricing-mid-strip']

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }} />
      {/* Hero */}
      <section className="bg-[var(--cream)] pt-40 pb-16 lg:pt-48 lg:pb-20 px-6 lg:px-10">
        <div className="max-w-3xl">
          <FadeUp>
            <p className="eyebrow mb-6">Pricing</p>
            <h1
              className="text-[42px] lg:text-[58px] leading-[1.05] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              No hidden fees.<br />
              <em>No surprises.</em>
            </h1>
            <p className="body-copy max-w-xl">
              Most venue websites end with "contact us for pricing." This one doesn't.
              Build your estimate below — and if the numbers feel right, come walk the
              grounds and meet the team who'll run your day. Getting married at Rixey is
              a feeling — you'll know it the moment you're standing in it.
            </p>
          </FadeUp>
        </div>
      </section>


      <AnchorNav items={PRICING_ANCHORS} />

      {/* Manor image — grounds context before the numbers */}
      {heroImage && (
        <div className="relative w-full h-[40vh] lg:h-[55vh] overflow-hidden">
          <Image
            src={heroImage.url}
            alt={heroImage.alt_text || 'Rixey Manor estate'}
            fill
            className="object-cover"
            style={{ objectPosition: heroImage.object_position || 'center center' }}
            sizes="100vw"
          />
        </div>
      )}

      {/* What's included — value before the number */}
      <section id="included" className="bg-[var(--warm-white)] py-20 lg:py-28 px-6 lg:px-10 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-20 items-start">

            {/* Left: text */}
            <div>
              <FadeUp>
                <p className="eyebrow mb-10">Why we sell things this way</p>
              </FadeUp>

              <div className="flex flex-col gap-10">

                <FadeUp delay={60}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      The whole place. Yours.
                    </h3>
                    <p className="body-copy">
                      Every booking is full exclusive use of the property. The ballroom, the rooftop, the
                      ceremony site, the terrace, the manor library, the kitchen,{' '}
                      <Link href="/venue#spaces" className="text-link">all 30 acres</Link>. No other
                      weddings. No other couples. No strangers in the corridor wondering who you are.
                    </p>
                    <p className="body-copy mt-3">
                      Most venues rent you a room for the afternoon. Rixey gives you a home for the day.
                      Your wedding, built the way you actually want it.
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={95}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      A planning portal, from the day you book.
                    </h3>
                    <p className="body-copy">
                      Most venues hand you a date and a contract and leave the planning to
                      you, your inbox, and a stack of spreadsheets. Every Rixey couple gets a
                      custom planning portal instead — the timeline, vendor details, floor
                      plans, checklists, payments, and a direct line to your coordinator, all
                      in one place. It's yours from the moment you book, and it stays current
                      right up to the day.
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={125}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      The décor is already here.
                    </h3>
                    <p className="body-copy">
                      Arbors, lanterns, card boxes, easels, table numbers, candleholders,
                      signage — a full décor inventory, free to use. Plus the borrow shed,
                      stocked with pieces couples have left behind from weddings past. Décor
                      is one of the biggest line items couples brace for, and most find they
                      barely need to buy a thing. Borrow what works, bring what's truly yours.
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={155}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      Linens, centerpieces, the venue team. A floor, not a ceiling.
                    </h3>
                    <p className="body-copy">
                      Basic table linens and our silk floral and candle centerpiece package come with
                      every booking. Set for you, ready to go. For couples whose wedding isn't really
                      about the décor, that's the table done. It looks good. Move on.
                    </p>
                    <p className="body-copy mt-3">
                      For couples where the flowers and the styling <em>are</em> part of the day (and
                      we work with a lot of them), we know epic florists, decorators, and installation
                      artists who do real flowers, hanging installations, full tablescapes, anything you
                      can picture. Use what's included as your floor and build up from there. Your
                      coordinator brings the right names.
                    </p>
                    <p className="body-copy mt-3">
                      The day-of venue team is included too: the people who handle the bits that fall
                      between vendor contracts (setup details, food service support, guest direction,
                      the small moments nobody else owns). All in the price. No à la carte.
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={180}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      Your people, your vendors. No markup.
                    </h3>
                    <p className="body-copy">
                      Hire your cousin's band. Use the caterer your family loves. Book the photographer
                      whose work you've followed for two years. The only exception is bartending, which
                      our licensed in-house team handles. Everything else is yours to choose. We have a
                      vetted recommendation list if you want a starting point. It's a list, not a mandate.
                      And we don't take a markup or referral commission on your other vendors. What they
                      invoice you is what they invoice you. The full vendor and policy notes live in the{' '}
                      <Link href="/faq" className="text-link">FAQ</Link>.
                    </p>
                  </div>
                </FadeUp>

              </div>
            </div>

            {/* Right: photo stack */}
            {inclusionsImages.length > 0 && (
              <div className="hidden lg:flex flex-col gap-4">
                {inclusionsImages.map((img, i) => (
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

      {/* What's actually in your number — line-item grid showing base price
          inclusions + upgrades. Rixey columns only (the comparison-with-blank-
          competitor-columns version lives at /checklist for printing). Sits
          between the voice blocks and the calculator: couples see the full
          inclusion picture before they build their estimate. */}
      <section id="whats-in-it" className="bg-[var(--cream)] border-t border-[var(--border)] py-20 lg:py-24 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <p className="eyebrow mb-4">What's actually in your number</p>
            <h2
              className="text-[28px] lg:text-[36px] leading-[1.1] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Every line. <em>Both packages.</em>
            </h2>
            <p className="body-copy mb-10 max-w-2xl">
              The base price covers everything in the green band below. Upgrades are listed
              underneath at their actual cost. No quote-on-request. No asterisks.
            </p>
          </FadeUp>

          <FadeUp delay={80}>
            <InclusionGrid
              rows={filterRowsBySection(ROWS, 'base', 'upgrades')}
              showCompetitorCols={false}
              showHeadlinePrice={true}
              showTotals={false}
            />
          </FadeUp>

          <FadeUp delay={140}>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-[var(--border)]">
              <p className="body-copy text-[14px] max-w-md">
                Touring other venues? The printable version of this grid has two blank
                columns for you to fill in their numbers, plus the discounts and BYO
                policies you'll want to ask about.
              </p>
              <Link href="/checklist" className="text-link shrink-0">
                Use the printable comparison →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="bg-[var(--warm-white)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-4">
          <FadeUp>
            <p className="eyebrow mb-4">Build your estimate</p>
            <p className="body-copy max-w-xl mb-2">
              Select your options below. The total updates as you go. Final pricing is confirmed at your tour.
            </p>
          </FadeUp>
        </div>
        <PricingCalculator />
      </section>

      {/* Planning app teaser */}
      <section className="bg-[var(--cream)] border-t border-[var(--border)] py-14 lg:py-16 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="eyebrow mb-2">After you book</p>
            <p
              className="text-[var(--ink)] leading-snug mb-1"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontStyle: 'italic' }}
            >
              Your planning portal opens the moment your deposit clears.
            </p>
            <p className="body-copy text-[14px] mt-2 max-w-lg">
              Guest list, seating plan, budget tracker, timeline, vendor inbox — all in one place, set up with your coordinator at your onboarding session.{' '}
              <span className="text-[var(--ink-light)]">Dates are not held until a deposit is placed.</span>
            </p>
          </div>
          <a
            href="https://rixey-app.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-white !text-[var(--ink-mid)] !border-[var(--border)] hover:!border-[var(--sage)] hover:!bg-transparent shrink-0"
          >
            Preview the app →
          </a>
        </div>
      </section>

      {/* Mid-page atmospheric strip */}
      {midStripImage && (
        <div className="relative w-full h-[40vh] lg:h-[52vh] overflow-hidden">
          <Image
            src={midStripImage.url}
            alt={midStripImage.alt_text || 'A wedding moment at Rixey Manor'}
            fill
            className="object-cover"
            style={{ objectPosition: midStripImage.object_position || 'center 40%' }}
            sizes="100vw"
          />
        </div>
      )}

      {/* What Else to Budget For */}
      <section id="other-costs" className="bg-[var(--cream)] py-20 lg:py-28 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="eyebrow mb-6">The full picture</p>
            <h2
              className="text-[28px] lg:text-[36px] leading-[1.1] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What you'll spend beyond<br />
              <em>the venue fee.</em>
            </h2>
            <p className="body-copy mb-14 max-w-2xl">
              Most couples arrive having researched venues but not having priced out the rest.
              Here's what the other categories typically look like, so you can go into planning
              with a real number in mind, not a guess.
            </p>
          </FadeUp>

          <div className="flex flex-col gap-8">
            {[
              {
                label: 'Catering',
                range: '$60–$250 per person',
                copy: 'The biggest variable, and the one that most affects your total. It depends heavily on service style, menu, and guest count. Food trucks and family-style options tend to run lower than plated full-service. You choose your own caterer. We can connect you with people who know this kitchen.',
              },
              {
                label: 'Bar (alcohol only)',
                range: '$10–$20 per person',
                copy: 'Since Rixey is BYOB, you buy alcohol at retail. What you spend depends on what you serve and how long the reception runs. Beer and wine only is meaningfully less than a full open bar. Our licensed in-house bartenders pour it for up to six hours — and that bartending is already in your package price. No corkage, no service charge, no separate bar invoice.',
              },
              {
                label: 'Photography',
                range: '$3,500–$8,500',
                copy: 'Full-day wedding photography varies widely based on experience and coverage hours. If you book videography too, plan for roughly the same range again. If you want a photographer who already knows how the light moves on this property, our recommendation list is a good starting point.',
              },
              {
                label: 'Florals',
                range: '$2,000 and up',
                copy: 'The range here is enormous and almost entirely a style choice. Simple greenery and personal flowers look beautiful and cost far less than full floral installations. Couples who use the borrow shed often find they need far less than they originally planned.',
              },
              {
                label: 'Music',
                range: '$1,600–$9,000',
                copy: 'A DJ and a live band are very different price points. Ceremony musicians (a string quartet, an acoustic guitar) are usually a separate booking. What you spend here is largely about how important live music is to you.',
              },
              {
                label: 'Tent (if applicable)',
                range: '$1,600–$9,000',
                copy: 'Not required. If you\'re planning an outdoor reception and want weather insurance, a tent with flooring and sidewalls is worth pricing out. Many couples skip it and use the ballroom as the rain plan, which works well.',
              },
              {
                label: 'Everything else',
                copy: 'Officiant (around $350). Hair and makeup (from $350 per face). Guest transportation ($1,500 to $4,500). Cake or dessert. Signage, stationery, favors. These add up but most are optional and all are yours to decide.',
              },
            ].map(({ label, range, copy }) => (
              <FadeUp key={label}>
                <div className="border-t border-[var(--border)] pt-7">
                  <h3
                    className={`text-[18px] italic text-[var(--ink)] ${range ? 'mb-1' : 'mb-3'}`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {label}
                  </h3>
                  {range && (
                    <p
                      className="text-[11px] tracking-[0.2em] uppercase text-[var(--rose)] mb-4"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {range}
                    </p>
                  )}
                  <p className="body-copy">{copy}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Elopements */}
      <section id="elopements" className="bg-[var(--cream)] py-20 lg:py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          <FadeUp>
            <p className="eyebrow mb-5">Elopements</p>
            <h2
              className="text-[28px] lg:text-[36px] leading-[1.1] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Small wedding.<br />
              <em>Full estate.</em>
            </h2>
            <p className="body-copy mb-4">
              Elopement packages are available Monday through Wednesday for up to 12 guests.
              Packages range from $950 to $1,250.
            </p>
            <p className="body-copy mb-8">
              You get the whole manor (the ceremony site, the ballroom, the grounds) for your
              ceremony and a small celebration. No compromises on the setting.
            </p>
            <a href="mailto:info@rixeymanor.com" className="text-link-forest">
              Email us about elopements →
            </a>
          </FadeUp>

          {elopementsImage && (
            <FadeUp delay={100}>
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src={elopementsImage.url}
                  alt={elopementsImage.alt_text || 'An intimate wedding moment at Rixey Manor'}
                  fill
                  className="object-cover"
                  style={{ objectPosition: elopementsImage.object_position || 'center 30%' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeUp>
          )}

        </div>
      </section>

      {/* Book a tour — inline calendar */}
      <section id="book-tour" className="bg-[var(--warm-white)] py-20 lg:py-24 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="eyebrow mb-5">Ready to see it in person?</p>
            <h2
              className="text-[30px] lg:text-[40px] leading-[1.1] text-[var(--ink)] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pick a time.<br />
              <em>Come and see it.</em>
            </h2>
            <p className="body-copy mb-10">
              Tours take about an hour. We'll walk every space, go through your estimate,
              and answer everything. Most couples know by the end whether Rixey is the right fit.
              Or call / text us at <a href="tel:+15402124545" className="text-link">(540) 212-4545</a>.
            </p>
          </FadeUp>
          <CalendlyInline url={calendlyUrl} />
        </div>
      </section>

      <FinalCTA calendlyUrl={calendlyUrl} />
    </>
  )
}
