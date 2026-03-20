import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'
import { supabaseServer } from '@/lib/supabaseServer'
import SageDemo from '@/components/portal/SageDemo'
import { getOgImage } from '@/lib/getPageSeo'
const supabase = supabaseServer()

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const ogImage = await getOgImage('portal')
  return {
    title: { absolute: 'The Couple\'s Portal — Rixey Manor' },
    description: 'A private planning portal built exclusively for Rixey Manor couples. Timeline, seating, vendors, AI assistant, and direct coordinator access — all in one place.',
    alternates: { canonical: 'https://www.rixeymanor.com/portal' },
    openGraph: {
      title: 'The Couple\'s Portal — Rixey Manor',
      description: 'A private planning portal built exclusively for Rixey Manor couples.',
      url: 'https://www.rixeymanor.com/portal',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'The Couple\'s Portal', item: 'https://www.rixeymanor.com/portal' },
  ],
}

const FEATURES = [
  {
    title: 'Guest List',
    description: 'Add every guest with their contact info, RSVP status, dietary needs, meal choice, custom tags, and table assignment. Filter, print by table, import by CSV.',
  },
  {
    title: 'Table Layout Planner',
    description: 'Place round, rectangular, and farm tables on an interactive floor plan of the ballroom. Assign guests directly from the map. Choose your linens. Everything updates in real time.',
  },
  {
    title: 'Day-of Timeline',
    description: "Build your hour-by-hour schedule with golden hour calculated automatically for your date. Share it with your vendors the moment it's done.",
  },
  {
    title: 'Budget Tracker',
    description: "Track what you've budgeted, what you've committed, and what's still outstanding across every category — venue, florals, catering, photography, and more.",
  },
  {
    title: 'Borrow Catalog',
    description: "Browse Rixey's full inventory of décor, florals, lighting, and ceremony pieces that are included with your booking. Claim what you want, skip the rest.",
  },
  {
    title: 'Vendor Checklist',
    description: 'Log every vendor, upload contracts, track confirmations, and share contact sheets with us. One place, no inbox hunting.',
  },
  {
    title: 'Inspiration Gallery',
    description: 'Upload your reference photos and share your vision directly with us inside the portal. No more screenshots buried in email threads.',
  },
  {
    title: 'Ceremony Order',
    description: 'Place your wedding party exactly as you want them. Pick roles, group who walks together, reorder in seconds.',
  },
  {
    title: 'Hair & Makeup Schedule',
    description: "Schedule the getting-ready order for your whole party. We'll know exactly who needs to be where and when on the morning.",
  },
  {
    title: 'Allergy Registry',
    description: 'Document every food allergy in your guest list with severity and notes. We share this directly with your caterer so nothing gets missed.',
  },
  {
    title: 'Bedroom Assignments',
    description: 'Assign overnight guests to rooms across Friday and Saturday nights. Pets included.',
  },
  {
    title: 'Direct Messages',
    description: 'One message thread, straight to your Rixey coordinator. No wondering if your email landed.',
  },
  {
    title: 'Sage AI',
    description: 'Ask anything — alcohol quantities, timeline advice, what to budget for flowers, whether you need a shuttle. Trained on Rixey inside out. Available 24/7.',
    highlight: true,
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Your onboarding session',
    description: 'In the weeks after you book, your coordinator schedules a full planning session with you. We walk through the portal together, learn what matters most to you, and set everything up. Not a demo — a real working meeting.',
  },
  {
    number: '02',
    title: 'Keep adding as you go',
    description: 'The portal stays open between you and us. Add vendors as you book them, fill in guest details when you have them, update the timeline whenever something changes. Everything lands with your coordinator in real time.',
  },
  {
    number: '03',
    title: 'We take it from there',
    description: 'The closer you get to the day, the more we use what you built. Your timeline, your floor plan, your allergy list — it all goes directly to the team. Nothing gets lost and nothing has to be said twice.',
  },
]

async function getPortalData() {
  const { data } = await supabase
    .from('site_content')
    .select('key, value')
    .in('key', ['portal_url', 'portal_api_url', 'calendly_url'])
  const content = (data || []).reduce((acc, row) => { acc[row.key] = row.value; return acc }, {})
  return {
    portalUrl:    content.portal_url    || '',
    portalApiUrl: content.portal_api_url || '',
    calendlyUrl:  content.calendly_url  || '',
  }
}

export default async function PortalPage() {
  const { portalUrl, portalApiUrl, calendlyUrl } = await getPortalData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section className="section-cream py-28 lg:py-40 px-6 lg:px-10 border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <p className="eyebrow mb-6">Exclusively for Rixey couples</p>
            <h1
              className="text-[48px] lg:text-[64px] leading-[1.05] text-[var(--ink)] mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              We plan it<br />
              <em>with you.</em>
            </h1>
            <p
              className="text-[18px] lg:text-[19px] leading-[1.75] text-[var(--ink-light)] mb-10 max-w-xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              In the weeks after you book, we sit down together for a full onboarding session.
              Your coordinator walks you through the portal, learns your wedding, and sets everything
              up with you. After that, it stays open between you — every update goes straight to us,
              no email required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {portalUrl ? (
                <a href={portalUrl} className="btn-primary">
                  Access your portal
                </a>
              ) : (
                <Link href="/availability" className="btn-primary">
                  Check available dates
                </Link>
              )}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-[12px] tracking-[0.08em] uppercase text-[var(--ink-light)]"
              style={{ fontFamily: 'var(--font-ui)' }}>
              <span>✓ Onboarding session included</span>
              <span>✓ Built in-house by Rixey</span>
              <span>✓ Not a third-party app</span>
              <span>✓ Direct coordinator access</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Features */}
      <section className="section-warm-white py-24 lg:py-32 px-6 lg:px-10 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="eyebrow mb-4">What's included</p>
              <h2
                className="text-[32px] lg:text-[42px] leading-[1.1] text-[var(--ink)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Everything you need.<br />
                <em>Nothing you don't.</em>
              </h2>
              <p
                className="mt-6 text-[15px] text-[var(--ink-light)] max-w-lg mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Thirteen tools, all walked through with your coordinator at your onboarding session.
                Built in-house. No subscription. Just yours.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 35}>
                <div
                  className={`p-8 border h-full ${
                    f.highlight
                      ? 'bg-[var(--forest)] border-[var(--forest)]'
                      : 'bg-[var(--cream)] border-[var(--border)]'
                  }`}
                >
                  <h3
                    className={`mb-3 text-[13px] tracking-[0.12em] uppercase font-medium ${
                      f.highlight ? 'text-white' : 'text-[var(--ink)]'
                    }`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className={`text-[15px] leading-[1.75] ${
                      f.highlight ? 'text-white/70' : 'text-[var(--ink-mid)]'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {f.description}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Sage section */}
      <section className="section-cream py-24 lg:py-32 px-6 lg:px-10 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          <FadeUp>
            <p className="eyebrow mb-6">Ask Sage</p>
            <h2
              className="text-[32px] lg:text-[40px] leading-[1.1] text-[var(--ink)] mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              She knows Rixey<br />
              <em>inside out.</em>
            </h2>
            <div className="flex flex-col gap-4 mb-8">
              <p className="body-copy">
                Sage is our AI planning assistant, trained on everything Rixey — venue details,
                vendor budgets, timeline advice, alcohol quantities, what to bring, what to borrow.
              </p>
              <p className="body-copy">
                Ask how many bottles of wine you need for 85 guests. Ask what time your ceremony
                should start to catch golden hour in October. Ask about linen options, or whether
                you can bring your own caterer. Sage has an answer.
              </p>
              <p className="body-copy">
                Once you're in your portal, Sage knows your specific wedding — your vendors, your
                timeline, your guest count. It's not a generic chatbot. It's yours.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-2">
              {[
                'Trained on Rixey Manor inside out',
                "Knows your wedding details once you're logged in",
                'Available 24 hours a day — not just during office hours',
                'Not a third-party app — built and run by us',
              ].map(item => (
                <p key={item} className="flex items-center gap-3 text-[13px] text-[var(--ink-light)]"
                  style={{ fontFamily: 'var(--font-ui)' }}>
                  <span className="text-[var(--forest)]">✓</span> {item}
                </p>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={100}>
            <SageDemo apiUrl={portalApiUrl} />
          </FadeUp>

        </div>
      </section>

      {/* How it works */}
      <section className="section-forest py-24 lg:py-32 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2
              className="text-[32px] lg:text-[42px] leading-[1.1] text-white text-center mb-20"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              How it works.
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-16">
            {STEPS.map((step, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div>
                  <p
                    className="text-[44px] leading-none text-white/15 mb-5"
                    style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                  >
                    {step.number}
                  </p>
                  <h3
                    className="text-[13px] tracking-[0.12em] uppercase text-white font-medium mb-3"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[15px] leading-[1.75] text-white/60"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {step.description}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-cream py-20 lg:py-28 px-6 lg:px-10 border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <p
              className="text-[24px] lg:text-[30px] leading-[1.45] text-[var(--ink)] mb-8"
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
            >
              "We built this because we wanted our couples to feel looked after from the moment
              they booked — not just on the day itself."
            </p>
            <p className="eyebrow">Isadora — Rixey Manor</p>
            <p
              className="mt-4 text-[13px] text-[var(--ink-light)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              The portal is included with your booking. It is not a third-party service.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section-warm-white py-24 lg:py-32 px-6 lg:px-10 border-b border-[var(--border)]">
        <div className="max-w-xl mx-auto text-center">
          <FadeUp>
            <p className="eyebrow mb-6">Ready to start planning?</p>
            <h2
              className="text-[32px] lg:text-[42px] leading-[1.1] text-[var(--ink)] mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your portal is included<br />
              <em>with your booking.</em>
            </h2>
            <p
              className="text-[17px] leading-[1.75] text-[var(--ink-light)] mb-12 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Once you book, we schedule your onboarding session and set it up together.
              Your coordinator is in it with you from that first meeting all the way to the day.
            </p>
            {portalUrl ? (
              <a href={portalUrl} className="btn-primary">
                Access your portal
              </a>
            ) : (
              <Link href="/availability" className="btn-primary">
                Check available dates
              </Link>
            )}
          </FadeUp>
        </div>
      </section>
    </>
  )
}
