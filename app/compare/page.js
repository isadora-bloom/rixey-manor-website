import { supabaseServer } from '@/lib/supabaseServer'
import Link from 'next/link'
import FinalCTA from '@/components/home/FinalCTA'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'All-Inclusive vs. Rixey — Two Kinds of Wedding Venue',
    description: 'An honest read on the trade-off between an all-inclusive venue and choosing your own vendors at Rixey. Both are valid. Here is how to know which one is yours.',
    alternates: { canonical: 'https://www.rixeymanor.com/compare' },
    openGraph: {
      title: 'All-Inclusive vs. Rixey',
      description: 'Two kinds of wedding venue. Both valid. Here is the honest version of what each is for.',
      url: 'https://www.rixeymanor.com/compare',
    },
  }
}

const ROWS = [
  { topic: 'Choose your own caterer',                rixey: 'Yes',                          allinc: 'Usually no, in-house only' },
  { topic: 'Bring your own alcohol',                 rixey: 'Yes, no corkage fee',           allinc: 'No, venue bar package' },
  { topic: 'Choose your own florist, DJ, photographer', rixey: 'Yes',                       allinc: 'Usually from a preferred list' },
  { topic: 'Coordinator',                            rixey: 'Included, on your side',       allinc: 'Included, often steered toward in-house options' },
  { topic: 'Whole property to yourselves',           rixey: 'Yes',                          allinc: 'Sometimes' },
  { topic: 'Lodging on site',                        rixey: 'Yes, for up to 14',            allinc: 'Sometimes' },
  { topic: 'Friday rehearsal + Saturday + Sunday brunch', rixey: 'Standard',                allinc: 'Sometimes' },
  { topic: 'Pet-friendly',                           rixey: 'Yes',                          allinc: 'Rare' },
  { topic: 'One number, one invoice',                rixey: 'No, several vendors',          allinc: 'Yes' },
  { topic: 'Decisions you make',                     rixey: 'Many',                         allinc: 'Few' },
  { topic: 'Vendor markup baked in',                 rixey: 'None',                         allinc: 'Often, sometimes meaningfully' },
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
          maxWidth: 620,
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          There are two kinds of wedding venue, and they want different things from you.
          Here is the honest version of what each is for, so you can choose with your eyes open.
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
            The pitch is simple. The venue picks the caterer, the florist, the DJ, the bar.
            You pick from inside their menu and turn up. For a real kind of couple, this is
            the right product. If your time genuinely matters more to you than your money, if
            you trust a venue's house style to also be yours, and if you'd rather do less of
            the planning, all-inclusive can take a lot off your plate.
          </p>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            What it costs is built into the package. Most all-inclusive venues mark up the
            vendors they bundle, sometimes meaningfully. You don't see the markup, because
            you don't see the vendor invoices. The convenience is real. The trade is also real.
          </p>
          <p className="body-copy">
            If that read sounds right to you, an all-inclusive venue is probably your kind
            of place. We mean that.
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
            Rixey is an 1801 manor on 30 acres in Culpeper County. We give you the whole
            estate, a coordinator who works for you, and a borrow shed that a decade of
            weddings has filled. We do not bring the caterer, the florist, the DJ, or the
            alcohol. You do. We do not have a preferred-vendor list, because we do not take
            referral commissions and we do not want to.
          </p>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            That means more decisions on your side. It also means a wedding that, by the
            time you reach it, is genuinely yours. The food is the food your family will
            remember. The bar is the bar your people will actually drink. The flowers are
            the flowers you chose.
          </p>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            The full weekend is yours. Friday for the rehearsal dinner. Saturday for the
            wedding. Sunday for brunch. Up to 14 people sleep in the manor and the cottage.
            No other events. No strangers in the next room. No one hurrying you out at midnight.
          </p>
          <p className="body-copy">
            If that read sounds right to you, Rixey is probably your kind of place.
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

          {/* Mobile stacked */}
          <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            Rixey, with you choosing your caterer, your florist, your DJ, and your bar at
            retail, typically lands in the same range as a comparable all-inclusive venue.
            Sometimes meaningfully less. The difference is rarely the dollar total at the
            bottom of the page.
          </p>
          <p className="body-copy">
            The difference is whether you want to make the choices, and whether you want
            to know what you are paying for, line by line.
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
            If the all-inclusive description was the relief, that is your sign. You would
            be unhappy at Rixey, and we'd rather you knew that now than after a deposit.
          </p>
          <p className="body-copy" style={{ marginBottom: 32 }}>
            If the Rixey description was the relief, take the quiz, or skip it and book the tour.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/quiz" className="btn-rose">
              Take the quiz
            </Link>
            <Link href="/pricing#book-tour" className="btn-primary">
              Book a tour
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA calendlyUrl={content.calendly_url} />
    </>
  )
}
