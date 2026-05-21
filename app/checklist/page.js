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

// The checklist is structured as 3 sections so couples can compare what's
// included, what's available as an upgrade, and what discounts apply at each
// venue. Rows with `section: 'header'` render a band across all columns.
//
// wd / ew values for cell rows:
//   'check' → green ✓     'dash' → em-dash (not included / not available)
//   any other string is rendered verbatim ("10pm", "None", "+$1,750", "−10%")
// `mode` controls how the BLANK competitor columns render:
//   'dollar' (default) → ☐ +$_____
//   'yesno'            → ☐ yes / ☐ no
//   'text'             → ___________________
//   'percent'          → ☐ +____% (for discount rows)
const ROWS = [
  // ── Section 1: what you get for the headline price ──────────────────────
  { section: 'header', label: "What's in the base price" },
  { item: 'Venue rental, full day',                       wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Friday access for rehearsal dinner',           wd: 'dash',  ew: 'check', mode: 'dollar' },
  { item: 'Two nights lodging for 14 (manor + cottage)',  wd: 'dash',  ew: 'check', mode: 'dollar' },
  { item: 'Chiavari chairs & tables',                     wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Two separate getting-ready spaces',            wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'One wedding per weekend (no shared events)',   wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Licensed bartending — Saturday',               wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Licensed bartending — Friday',                 wd: 'dash',  ew: 'check', mode: 'dollar' },
  { item: 'BYOB, no corkage fees',                        wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Basic linens',                                 wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Silk floral + candle centerpieces',            wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Borrow shed (décor library)',                  wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'No required vendor list',                      wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'No vendor markup or facility fee',             wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Day-of venue team',                            wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Day-of coordinator',                           wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Pets welcome at ceremony',                     wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Outdoor finish time',                          wd: '10pm',  ew: '10pm',  mode: 'text' },
  { item: 'Guest minimum',                                wd: 'None',  ew: 'None',  mode: 'text' },

  // ── Section 2: paid upgrades ────────────────────────────────────────────
  { section: 'header', label: 'Available upgrades' },
  { item: 'Extra hour beyond standard finish (manor interior)', wd: '+$750/hr', ew: '+$750/hr', mode: 'dollar' },
  { item: 'Third night of lodging',                              wd: 'dash',     ew: '+$1,750',  mode: 'dollar' },
  { item: 'Overnight — one night before or after',               wd: '+$1,750',  ew: 'dash',     mode: 'dollar' },
  { item: 'Overnight — two nights around the wedding',           wd: '+$3,250',  ew: 'dash',     mode: 'dollar' },
  { item: 'Extra event (cultural ceremony, exit brunch, etc.)',  wd: '+$1,500/50', ew: '+$1,500/50', mode: 'dollar' },
  { item: 'Larger guest count (101–150 Saturday)',               wd: '+$1,500',  ew: '+$1,500',  mode: 'dollar' },
  { item: 'Larger guest count (151–200 Saturday)',               wd: '+$3,000',  ew: '+$3,000',  mode: 'dollar' },

  // ── Section 3: discounts ────────────────────────────────────────────────
  { section: 'header', label: 'Available discounts (stackable up to 20% at Rixey)' },
  { item: 'Off-site ceremony (church, separate venue)',          wd: '−5%',  ew: '−5%',  mode: 'percent' },
  { item: 'Recommended vendors only',                            wd: '−5%',  ew: '−5%',  mode: 'percent' },
  { item: 'Under 50 Saturday guests',                            wd: '−10%', ew: '−10%', mode: 'percent' },
  { item: 'Military / veteran / first responder',                wd: '−10%', ew: '−10%', mode: 'percent' },

  // ── Section 4: BYO freedom + other policies ─────────────────────────────
  // The things couples never think to ask about — until they're six months in
  // and find out their venue forbids candles, or requires a $300 liability
  // insurance binder, or charges a corkage fee per bottle.
  { section: 'header', label: 'Bring-your-own + other policies' },
  { item: 'Outside caterer of your choice allowed',              wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Food trucks allowed',                                 wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Sparklers allowed (wedding-safe)',                    wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Open-flame candles allowed',                          wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Real-flower petals allowed',                          wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Indoor backup if it rains',                           wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'No day-of liability insurance required by venue',     wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Same-sex / LGBTQ+ weddings welcome',                  wd: 'check', ew: 'check', mode: 'yesno' },
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
  if (mode === 'percent') {
    return (
      <span style={{ color: 'var(--ink-light)', fontSize: 12, letterSpacing: '0.05em' }}>
        ☐ &nbsp; − _____ %
      </span>
    )
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

            {/* Item rows. Section-header rows render as a single band so the
                couple can visually group "what's included" vs "upgrades" vs
                "discounts". Index `i` is used for the zebra-striping only on
                regular rows. */}
            {(() => {
              let stripe = 0
              return ROWS.map((row, i) => {
                if (row.section === 'header') {
                  stripe = 0  // restart stripe within each new section
                  return (
                    <div
                      key={`hdr-${i}`}
                      style={{
                        padding: '12px 14px',
                        background: 'var(--forest)',
                        color: '#fff',
                        fontFamily: 'var(--font-ui)',
                        fontSize: 10,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {row.label}
                    </div>
                  )
                }
                const bg = stripe % 2 === 0 ? '#fff' : 'var(--warm-white)'
                stripe++
                return (
                  <div
                    key={row.item}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: colTemplate,
                      borderBottom: '1px solid var(--border)',
                      background: bg,
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
                )
              })
            })()}

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
