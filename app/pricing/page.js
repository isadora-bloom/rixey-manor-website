import Link from 'next/link'
import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'
import PricingCalculator from '@/components/pricing/PricingCalculator'
import FinalCTA from '@/components/home/FinalCTA'
import CalendlyInline from '@/components/ui/CalendlyInline'
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

const pricingFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is included in the Rixey Manor venue fee?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every booking includes full exclusive use of the estate, a Rixey coordinator, tables and chairs for up to 100 indoor guests, use of the borrow shed, overnight accommodation for up to 14 guests, and on-site parking. Catering, alcohol, and third-party vendors are not included and are chosen by the couple.' },
    },
    {
      '@type': 'Question',
      name: 'Can we bring our own alcohol?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Rixey Manor is BYOB with no corkage fees. You source and purchase your own bar. Our licensed in-house bartenders handle service and that cost is included in your venue fee.' },
    },
    {
      '@type': 'Question',
      name: 'Do you require us to use your preferred vendors?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Rixey Manor has no required vendor list. You can hire any licensed and insured caterer, photographer, florist, or other vendor you choose. Bartending is handled by our in-house team.' },
    },
    {
      '@type': 'Question',
      name: 'Is there a military or first responder discount?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. A 10% discount applies to the venue fee for active military, veterans, and first responders. Confirm eligibility when booking.' },
    },
    {
      '@type': 'Question',
      name: 'Do you offer elopement packages?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Elopement packages are available Monday through Wednesday for up to 12 guests, starting at $950.' },
    },
    {
      '@type': 'Question',
      name: 'Are there hidden fees?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. There is no cake-cutting fee, corkage fee, service charge, or venue insurance requirement. The price quoted is what you pay.' },
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
              Build your estimate below, and if the numbers work, come and see the place.
            </p>
          </FadeUp>
        </div>
      </section>


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
      <section className="bg-[var(--warm-white)] py-20 lg:py-28 px-6 lg:px-10 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16 lg:gap-20 items-start">

            {/* Left: text */}
            <div>
              <FadeUp>
                <p className="eyebrow mb-6">What every wedding includes</p>
                <p className="body-copy mb-14 max-w-2xl">
                  Before the number, here's what's in it. We put this first because a price without context
                  is just a number. You should know what you're getting before you decide if it makes sense.
                </p>
              </FadeUp>

              <div className="flex flex-col gap-10">

                <FadeUp delay={60}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      The whole place. Yours.
                    </h3>
                    <p className="body-copy">
                      Every booking is full exclusive use of the property. The ballroom, the rooftop, the
                      ceremony site, the terrace, the manor library, the kitchen, all 30 acres. No other
                      weddings. No other couples. No strangers in the corridor wondering who you are.
                    </p>
                    <p className="body-copy mt-3">
                      Most venues rent you a room for the afternoon. Rixey gives you a home for the day.
                      Your wedding, built the way you actually want it.
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={100}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      A coordinator. Included.
                    </h3>
                    <p className="body-copy">
                      Not someone who shows up at 2pm with a clipboard. A coordinator who has run hundreds of
                      weddings on this specific property, knows which vendors work well here, and has seen
                      what can go sideways and how to stop it before you notice. She is part of your day from
                      the start. This is not an add-on.
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={140}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      Bring your own bar. Keep your money.
                    </h3>
                    <p className="body-copy">
                      Rixey is BYOB. You choose the beer, the wine, the spirits. You buy them at retail,
                      no markup, no corkage fee, no required wine list. Our licensed in-house bartenders
                      handle service professionally. Couples consistently say this saved them thousands
                      compared to per-drink venue pricing. That is genuinely the point.
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={180}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      Your people, your vendors.
                    </h3>
                    <p className="body-copy">
                      Hire your cousin's band. Use the caterer your family loves. Book the photographer
                      whose work you've followed for two years. The only exception is bartending, which our
                      licensed in-house team handles. Everything else is yours to choose. We have a vetted
                      recommendation list if you want a starting point. It's a list, not a mandate.
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={220}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      The borrow shed.
                    </h3>
                    <p className="body-copy">
                      Over a decade of weddings at Rixey has left behind a real collection: arbors, signs,
                      table numbers, easels, lanterns, card boxes, candleholders, frames. All of it is
                      available to use at no charge. Most couples who find this out end up cutting a
                      meaningful chunk from their rentals budget.
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={260}>
                  <div className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-[20px] italic text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      What you see is what you pay.
                    </h3>
                    <p className="body-copy">
                      No cake-cutting fee. No corkage fee. No service charge added at the end.
                      No venue insurance requirement buried in page 6 of the contract. We quote a number
                      and that is what you pay. The calculator below gives you a real estimate, not a
                      range designed to get you on the phone.
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

      {/* Calculator */}
      <section className="bg-[var(--warm-white)]">
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
      <section className="bg-[var(--cream)] py-20 lg:py-28 px-6 lg:px-10 border-t border-[var(--border)]">
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
                copy: 'The biggest variable, and the one that most affects your total. It depends heavily on service style, menu, and guest count. Food trucks and family-style options tend to run lower than plated full-service. You choose your own caterer. We can connect you with people who know this kitchen.',
              },
              {
                label: 'Bar',
                copy: 'Since Rixey is BYOB, you buy at retail. What you spend depends on what you serve and how long the reception runs. Beer and wine only is meaningfully less than a full open bar. Our in-house bartenders handle service and that cost is included in your venue fee.',
              },
              {
                label: 'Photography',
                copy: 'Full-day wedding photography varies widely based on experience, coverage hours, and whether you add videography. If you want a photographer who already knows how the light moves on this property, our recommendation list is a good starting point.',
              },
              {
                label: 'Florals',
                copy: 'The range here is enormous and almost entirely a style choice. Simple greenery and personal flowers look beautiful and cost far less than full floral installations. Couples who use the borrow shed often find they need far less than they originally planned.',
              },
              {
                label: 'Music',
                copy: 'A DJ and a live band are very different price points. Ceremony musicians (a string quartet, an acoustic guitar) are usually a separate booking. What you spend here is largely about how important live music is to you.',
              },
              {
                label: 'Tent (if applicable)',
                copy: 'Not required. If you\'re planning an outdoor reception and want weather insurance, a tent with flooring and sidewalls is worth pricing out. Many couples skip it and use the ballroom as the rain plan, which works well.',
              },
              {
                label: 'Everything else',
                copy: 'Officiant. Guest transportation. Hair and makeup for the wedding party. Cake or dessert. Signage, stationery, favors. These add up but most are optional and all are yours to decide.',
              },
            ].map(({ label, copy }) => (
              <FadeUp key={label}>
                <div className="border-t border-[var(--border)] pt-7">
                  <h3
                    className="text-[18px] italic text-[var(--ink)] mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {label}
                  </h3>
                  <p className="body-copy">{copy}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Elopements */}
      <section className="bg-[var(--cream)] py-20 lg:py-28 px-6 lg:px-10">
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
