import Link from 'next/link'
import FinalCTA from '@/components/home/FinalCTA'
import PrintButton from './PrintButton'
import { supabaseServer } from '@/lib/supabaseServer'
import { getOgImage } from '@/lib/getPageSeo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const ogImage = await getOgImage('checklist')
  return {
    title: 'Wedding Venue Comparison Checklist — Rixey Manor',
    description: 'A one-page checklist to compare wedding venues honestly. Take it on every tour. Tick what is included, write in what costs extra, see the real cost at the bottom.',
    alternates: { canonical: 'https://www.rixeymanor.com/checklist' },
    openGraph: {
      title: 'Wedding Venue Comparison Checklist',
      description: 'A one-page checklist to compare wedding venues honestly. Take it on every tour.',
      url: 'https://www.rixeymanor.com/checklist',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

// One row per line in the checklist. wd / ew values:
//   'check' → green ✓     'dash' → em-dash (not included on this package)
//   any other string is rendered verbatim ("10pm", "None", etc.)
// mode controls how the BLANK competitor columns render:
//   'dollar' (default) → ☐ +$_____
//   'yesno'            → ☐ yes / ☐ no
//   'text'             → ___________________
const ROWS = [
  { item: 'Venue rental, full day',                       wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Friday access for rehearsal dinner',           wd: 'dash',  ew: 'check', mode: 'dollar' },
  { item: 'Two nights lodging for 14 (manor + cottage)',  wd: 'dash',  ew: 'check', mode: 'dollar' },
  { item: 'Chiavari chairs & tables',                     wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Two separate getting-ready spaces',            wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'One wedding per weekend (no shared events)',   wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Licensed bartending — Saturday',               wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Licensed bartending — Friday',                 wd: 'dash',  ew: 'check', mode: 'dollar' },
  { item: 'BYOB, no corkage fees',                        wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Linens',                                       wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Silk floral + candle centerpieces',            wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Borrow shed (décor library)',                  wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'No required vendor list',                      wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'No vendor markup or facility fee',             wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Day-of venue team',                            wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Day-of coordinator',                           wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Pets welcome at ceremony',                     wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Outdoor finish time',                          wd: '10pm',  ew: '10pm',  mode: 'text' },
  { item: 'Guest minimum',                                wd: 'None',  ew: 'None',  mode: 'text' },
]

function Cell({ value }) {
  if (value === 'check') {
    return <span style={{ color: 'var(--forest)', fontSize: 16, fontWeight: 500 }}>✓</span>
  }
  if (value === 'dash') {
    return <span style={{ color: 'var(--ink-light)' }}>—</span>
  }
  return <span style={{ color: 'var(--ink)', fontSize: 13 }}>{value}</span>
}

function BlankCell({ mode }) {
  if (mode === 'yesno') {
    return (
      <span style={{ color: 'var(--ink-light)', fontSize: 12, letterSpacing: '0.05em' }}>
        ☐ yes &nbsp; ☐ no
      </span>
    )
  }
  if (mode === 'text') {
    return <span style={{ color: 'var(--ink-light)' }}>_____________</span>
  }
  // dollar
  return (
    <span style={{ color: 'var(--ink-light)', fontSize: 12, letterSpacing: '0.05em' }}>
      ☐ &nbsp; + $ _________
    </span>
  )
}

export default async function ChecklistPage() {
  const { data: contentRows } = await supabaseServer()
    .from('site_content')
    .select('key, value')
    .in('key', ['calendly_url'])

  const content = (contentRows || []).reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  // Shared cell padding so both screen + print stay tight.
  const cellPad = '10px 14px'
  const colTemplate = '2.2fr 1.2fr 1.2fr 1.4fr 1.4fr'

  return (
    <>
      {/* Page-specific print rules. Kept inline so the page is self-contained
          and the print layout doesn't leak to other routes. */}
      <style>{`
        @media print {
          @page { size: letter landscape; margin: 0.4in; }
          html, body { background: #fff !important; }
          header, footer { display: none !important; }
          [data-no-print] { display: none !important; }
          /* Strip section padding so the checklist table dominates the page. */
          .checklist-print-root { padding: 0 !important; background: #fff !important; }
          .checklist-print-root .checklist-title { margin-bottom: 8px !important; }
          .checklist-print-root .checklist-grid { font-size: 11px !important; }
          .checklist-print-root .checklist-grid > div { padding: 6px 10px !important; }
          /* Force the table to fill the page width and avoid splitting. */
          .checklist-grid { page-break-inside: avoid; }
        }
      `}</style>

      {/* SCREEN-ONLY hero. Hidden in print to give the checklist the whole page. */}
      <section
        data-no-print
        style={{
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px) clamp(40px, 5vw, 64px)',
          textAlign: 'center',
          background: 'var(--warm-white)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <p className="eyebrow" style={{ marginBottom: 20 }}>The checklist</p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 5vw, 60px)',
            color: 'var(--ink)',
            lineHeight: 1.12,
            marginBottom: 24,
          }}
        >
          Comparing wedding venues?<br /><em>Use this on every tour.</em>
        </h1>
        <p
          className="body-copy"
          style={{ maxWidth: 640, margin: '0 auto 32px' }}
        >
          The price at the top of the page is rarely the price you pay. Tick what each venue
          actually includes. Write in what costs extra. The number at the bottom is the real one.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <PrintButton />
        </div>
      </section>

      {/* CHECKLIST — visible on both screen and print. */}
      <section
        className="checklist-print-root"
        style={{
          padding: 'clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)',
          background: 'var(--cream)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Print-only header so the printed sheet identifies itself. */}
          <div className="checklist-title" style={{ marginBottom: 18 }}>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--ink-light)',
                marginBottom: 6,
              }}
            >
              Rixey Manor &nbsp;·&nbsp; rixeymanor.com
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(20px, 2.6vw, 28px)',
                color: 'var(--ink)',
                lineHeight: 1.2,
                marginBottom: 4,
              }}
            >
              Wedding venue comparison checklist
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--ink-light)',
                fontStyle: 'italic',
              }}
            >
              Tick what's included. Write in the dollar add-on for what's extra. Add it up at the bottom.
            </p>
          </div>

          {/* The grid. Five columns: label, WD, EW, two blank competitor cols. */}
          <div
            className="checklist-grid"
            style={{
              background: '#fff',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: colTemplate,
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-light)',
                borderBottom: '1px solid var(--border)',
                background: 'var(--warm-white)',
              }}
            >
              <div style={{ padding: cellPad }}>&nbsp;</div>
              <div style={{ padding: cellPad, color: 'var(--rose)', borderLeft: '1px solid var(--border)' }}>
                The Wedding Day
              </div>
              <div style={{ padding: cellPad, color: 'var(--rose)', borderLeft: '1px solid var(--border)' }}>
                The Estate Weekend
              </div>
              <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>
                Venue: ________________
              </div>
              <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>
                Venue: ________________
              </div>
            </div>

            {/* Headline price row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: colTemplate,
                borderBottom: '1px solid var(--border)',
                background: 'var(--warm-white)',
              }}
            >
              <div
                style={{
                  padding: cellPad,
                  fontFamily: 'var(--font-ui)',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mid)',
                  fontWeight: 500,
                }}
              >
                Headline price
              </div>
              <div style={{ padding: cellPad, color: 'var(--ink)', borderLeft: '1px solid var(--border)' }}>
                <strong>$16,000</strong> peak<br />
                <span style={{ color: 'var(--ink-light)' }}>$12,500 off-season</span>
              </div>
              <div style={{ padding: cellPad, color: 'var(--ink)', borderLeft: '1px solid var(--border)' }}>
                <strong>$21,000</strong> peak<br />
                <span style={{ color: 'var(--ink-light)' }}>$16,000 off-season</span>
              </div>
              <div style={{ padding: cellPad, color: 'var(--ink-light)', borderLeft: '1px solid var(--border)' }}>
                $ _____________
              </div>
              <div style={{ padding: cellPad, color: 'var(--ink-light)', borderLeft: '1px solid var(--border)' }}>
                $ _____________
              </div>
            </div>

            {/* Item rows */}
            {ROWS.map((row, i) => (
              <div
                key={row.item}
                style={{
                  display: 'grid',
                  gridTemplateColumns: colTemplate,
                  borderBottom: '1px solid var(--border)',
                  background: i % 2 === 0 ? '#fff' : 'var(--warm-white)',
                }}
              >
                <div style={{ padding: cellPad, color: 'var(--ink-mid)' }}>{row.item}</div>
                <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)', textAlign: 'center' }}>
                  <Cell value={row.wd} />
                </div>
                <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)', textAlign: 'center' }}>
                  <Cell value={row.ew} />
                </div>
                <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>
                  <BlankCell mode={row.mode} />
                </div>
                <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>
                  <BlankCell mode={row.mode} />
                </div>
              </div>
            ))}

            {/* Totals row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: colTemplate,
                background: 'var(--cream)',
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
                fontWeight: 600,
              }}
            >
              <div style={{ padding: cellPad }}>Real total — headline + every add-on</div>
              <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)', textAlign: 'center' }}>
                $16,000 / $12,500
              </div>
              <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)', textAlign: 'center' }}>
                $21,000 / $16,000
              </div>
              <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>$ ______________</div>
              <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>$ ______________</div>
            </div>
          </div>

          {/* Tiny footnote — useful on print too, so no data-no-print. */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--ink-light)',
              fontStyle: 'italic',
              marginTop: 14,
              lineHeight: 1.5,
            }}
          >
            Off-season at Rixey: January, February, July, August. Most venues don't reduce
            rates in off-season the way we do — worth asking. &nbsp;·&nbsp; Comparable Northern
            Virginia market figures for reference: bartending ~$1,800 · corkage ~$1,400 · linens
            ~$750 · centerpieces ~$1,200 · coordinator ~$2,500 · second prep suite ~$750.
          </p>
        </div>
      </section>

      {/* SCREEN-ONLY body copy + close. */}
      <section
        data-no-print
        style={{
          padding: 'clamp(60px, 7vw, 96px) clamp(20px, 5vw, 60px)',
          background: 'var(--warm-white)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: 18 }}>A few things the table can't carry</p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 3.4vw, 36px)',
              color: 'var(--ink)',
              lineHeight: 1.2,
              marginBottom: 28,
            }}
          >
            <em>The unwritten lines.</em>
          </h2>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            We welcome dogs at the ceremony (we've had a lot of good ones). We don't have a guest
            minimum — we'll host an elopement of twelve or a wedding of two hundred. The 30 acres
            are yours for the weekend: no shared events, no other couples on the property.
          </p>
          <p className="body-copy" style={{ marginBottom: 18 }}>
            And when you tour somewhere that holds multiple weddings a day, or takes a percentage of
            your caterer's invoice, or quietly requires their own bar at a markup — that's where the
            blanks on the right side of this page start to fill in.
          </p>
          <p className="body-copy">
            The point of this checklist isn't to make a case for Rixey. It's to give you a way to
            compare honestly. If another venue ticks every box on the left and lands at a lower
            number than ours, book them. We'd rather you knew now.
          </p>
        </div>
      </section>

      <div data-no-print>
        <FinalCTA calendlyUrl={content.calendly_url} />
      </div>
    </>
  )
}
