import { supabaseServer } from '@/lib/supabaseServer'
import Link from 'next/link'
import FinalCTA from '@/components/home/FinalCTA'
import { getOgImage } from '@/lib/getPageSeo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const ogImage = await getOgImage('compare')
  return {
    title: 'All-Inclusive vs. Rixey — Two Kinds of Wedding Venue',
    description: 'An honest read on the trade-off between an all-inclusive venue and choosing your own vendors at Rixey. Both are valid. Here is how to know which one is yours.',
    alternates: { canonical: 'https://www.rixeymanor.com/compare' },
    openGraph: {
      title: 'All-Inclusive vs. Rixey',
      description: 'Two kinds of wedding venue. Both valid. Here is the honest version of what each is for.',
      url: 'https://www.rixeymanor.com/compare',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const ROWS = [
  { topic: 'How the wedding gets built',             rixey: 'Curated around you, top to bottom',  allinc: 'You fit inside their template' },
  { topic: 'Coordinator on your side',               rixey: 'Yes, helping you decide',             allinc: 'Yes, also selling you in-house upgrades' },
  { topic: 'Vendor recommendations',                 rixey: 'Matched to your taste, no commission', allinc: 'From their preferred list, often commissioned' },
  { topic: 'Choose your own caterer',                rixey: 'Yes',                                 allinc: 'Usually no, in-house only' },
  { topic: 'Bring your own alcohol',                 rixey: 'Yes, no corkage fee',                 allinc: 'No, venue bar package' },
  { topic: 'Choose your own florist, DJ, photographer', rixey: 'Yes, with our help',              allinc: 'Usually from their list' },
  { topic: 'Whole property to yourselves',           rixey: 'Yes',                                 allinc: 'Sometimes' },
  { topic: 'Lodging on site',                        rixey: 'Yes, for up to 14',                   allinc: 'Sometimes' },
  { topic: 'Friday + Saturday + Sunday',             rixey: 'Standard',                            allinc: 'Sometimes' },
  { topic: 'Pet-friendly',                           rixey: 'Yes',                                 allinc: 'Rare' },
  { topic: 'Vendor markup baked in',                 rixey: 'None',                                allinc: 'Often, sometimes meaningfully' },
]

export default async function ComparePage() {
  const { data: contentRows } = await supabaseServer()
    .from('site_content')
    .select('key, value')
    .in('key', ['calendly_url'])

  const content = (contentRows || []).reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  return (
    <>
      {/* Hero */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px) clamp(40px, 5vw, 64px)',
        textAlign: 'center',
        background: 'var(--warm-white)',
        borderBottom: '1px solid var(--border)',
      }}>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--ink-light)',
          marginBottom: 20,
        }}>
          Choosing a venue
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(34px, 5vw, 60px)',
          color: 'var(--ink)',
          lineHeight: 1.12,
          marginBottom: 24,
        }}>
          All-inclusive,<br /><em>or all-yours.</em>
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'var(--ink-light)',
          maxWidth: 640,
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          There are two kinds of wedding venue. One bundles you into a template.
          The other builds around you. Here is the honest version of what each is for.
        </p>
      </section>

      {/* If you are shopping for an all-inclusive venue */}
      <section style={{
        padding: 'clamp(60px, 7vw, 96px) clamp(20px, 5vw, 60px)',
        background: 'var(--cream)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: 18 }}>If you want all-inclusive</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.6vw, 40px)',
            color: 'var(--ink)',
            lineHeight: 1.18,
            marginBottom: 28,
          }}>
            One contract, one team, one invoice.
          </h2>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            The pitch is simple. The venue brings the caterer, the florist, the DJ, the bar.
            You pick from inside their menu and turn up. Less of the planning lands on you,
            and one team handles the day.
          </p>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            The trade is the template. The wedding fits the house style, not the other way
            around. The vendors come from a preferred list, usually with a commission to
            the venue baked into your invoice. The coordinator who supports you is also
            the person selling you in-house upgrades. You don't always see that part,
            because you don't see the vendor invoices.
          </p>
          <p className="body-copy">
            If your priority is fewer choices and you trust the house style to feel like
            yours, all-inclusive can be the right answer.
          </p>
        </div>
      </section>

      {/* If you are shopping for Rixey */}
      <section style={{
        padding: 'clamp(60px, 7vw, 96px) clamp(20px, 5vw, 60px)',
        background: 'var(--warm-white)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: 18, color: 'var(--rose)' }}>If you want Rixey</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.6vw, 40px)',
            color: 'var(--ink)',
            lineHeight: 1.18,
            marginBottom: 28,
          }}>
            <em>The other thing.</em>
          </h2>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            Rixey is the other thing. The estate is yours. The wedding gets built around
            you, not slotted into a template. Your coordinator's job is to help you decide,
            with as much hand-holding as you want and as little as you don't. Because we
            don't sell in-house upgrades, the advice you get is the advice they'd actually give.
          </p>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            We don't bring the caterer, the florist, the DJ, or the bar — but you don't pick alone.
            For every category, your coordinator brings two or three recommendations matched
            to your taste, your guests, your budget, and the day you actually want. We don't
            keep a preferred-vendor list because we don't take referral commissions and we
            don't want to. The names we pass you are the names we'd recommend to a friend
            getting married. We do, regularly.
          </p>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            By the time you reach the day, the wedding is genuinely yours. The food is the
            food your family will remember. The bar is the bar your people will actually drink.
            The flowers are the flowers you chose. And the person walking you through it has
            been doing this here for ten years.
          </p>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            The full weekend is yours. Friday for the rehearsal dinner. Saturday for the
            wedding. Sunday for brunch. Up to 14 people sleep in the manor and the cottage.
            No other events. No strangers. No one hurrying you out.
          </p>
          <p className="body-copy">
            If that read sounds right, Rixey is probably your kind of place.
          </p>
        </div>
      </section>

      {/* Side by side */}
      <section style={{
        padding: 'clamp(60px, 7vw, 96px) clamp(20px, 5vw, 60px)',
        background: 'var(--cream)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: 18, textAlign: 'center' }}>Side by side</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.6vw, 40px)',
            color: 'var(--ink)',
            lineHeight: 1.18,
            marginBottom: 36,
            textAlign: 'center',
          }}>
            What each gives you, plainly.
          </h2>

          {/* Desktop table */}
          <div className="hidden md:block" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1fr',
              fontFamily: 'var(--font-ui)',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--ink-light)',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ padding: '18px 22px' }}></div>
              <div style={{ padding: '18px 22px', color: 'var(--rose)', borderLeft: '1px solid var(--border)' }}>Rixey</div>
              <div style={{ padding: '18px 22px', borderLeft: '1px solid var(--border)' }}>A typical all-inclusive</div>
            </div>
            {ROWS.map((row, i) => (
              <div
                key={row.topic}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1fr 1fr',
                  borderBottom: i === ROWS.length - 1 ? 'none' : '1px solid var(--border)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                }}
              >
                <div style={{ padding: '18px 22px', color: 'var(--ink-mid)' }}>{row.topic}</div>
                <div style={{ padding: '18px 22px', color: 'var(--ink)', borderLeft: '1px solid var(--border)' }}>{row.rixey}</div>
                <div style={{ padding: '18px 22px', color: 'var(--ink-light)', borderLeft: '1px solid var(--border)' }}>{row.allinc}</div>
              </div>
            ))}
          </div>

          {/* Mobile stacked. display rules live entirely in Tailwind classes
              so they don't get overridden by inline styles. */}
          <div className="flex flex-col gap-4 md:hidden">
            {ROWS.map(row => (
              <div key={row.topic} style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', padding: 18 }}>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-light)',
                  marginBottom: 12,
                }}>
                  {row.topic}
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--rose)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Rixey</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>{row.rixey}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>All-inclusive</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-light)' }}>{row.allinc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honest cost reality */}
      <section style={{
        padding: 'clamp(60px, 7vw, 96px) clamp(20px, 5vw, 60px)',
        background: 'var(--warm-white)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: 18 }}>The honest cost reality</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.6vw, 40px)',
            color: 'var(--ink)',
            lineHeight: 1.18,
            marginBottom: 28,
          }}>
            All-inclusive isn't usually cheaper.<br /><em>It's just less visible.</em>
          </h2>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            The bundle hides the markup, but the markup is there. A 100-guest wedding at
            Rixey, with vendors picked at retail and no commissions in the middle, often
            lands in the same range as a comparable all-inclusive venue. Sometimes
            meaningfully less.
          </p>
          <p className="body-copy">
            The difference is rarely the dollar total at the bottom of the page. The
            difference is whether you can see what you're paying for, line by line — and
            whether the wedding looks like you, or like the venue.
          </p>
        </div>
      </section>

      {/* Self-select close */}
      <section style={{
        padding: 'clamp(60px, 7vw, 96px) clamp(20px, 5vw, 60px)',
        background: 'var(--cream)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 3.4vw, 36px)',
            color: 'var(--ink)',
            lineHeight: 1.22,
            marginBottom: 24,
            fontStyle: 'italic',
          }}>
            So which one are you?
          </h2>
          <p className="body-copy" style={{ marginBottom: 14 }}>
            If the all-inclusive description sounded right, that's good information. We'd
            rather you knew now.
          </p>
          <p className="body-copy" style={{ marginBottom: 32 }}>
            If the Rixey description sounded right, a wedding built around you, with someone
            who knows what they're doing in your corner, come and see it for yourself.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/pricing#book-tour" className="btn-primary">
              Book a tour
            </Link>
            <Link href="/checklist" className="text-link">
              Touring other venues? Use the checklist →
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA calendlyUrl={content.calendly_url} />
    </>
  )
}
