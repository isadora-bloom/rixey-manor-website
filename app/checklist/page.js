import Link from 'next/link'
import FinalCTA from '@/components/home/FinalCTA'
import PrintButton from './PrintButton'
import InclusionGrid from '@/components/pricing/InclusionGrid'
import { ROWS } from '@/lib/inclusionRows'
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

export default async function ChecklistPage() {
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

      {/* CHECKLIST — visible on both screen and print. All 4 sections, both
          competitor columns, and the totals row. Identical artifact to the
          mini-grid on /pricing, just with the comparison columns added. */}
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

          <InclusionGrid
            rows={ROWS}
            showCompetitorCols={true}
            showHeadlinePrice={true}
            showTotals={true}
          />

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
