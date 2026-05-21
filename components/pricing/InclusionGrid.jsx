// Reusable grid for "what's in / what's extra" comparison tables.
// Used by /pricing (Rixey columns only, base + upgrades) and by /checklist
// (all sections + 2 blank competitor columns + printable totals row).
//
// All styling is inline so the component is fully self-contained — no
// CSS module, no class dependencies. Print-mode adjustments live on the
// consumer page's <style> block, scoped via the `.checklist-grid` class
// that this component renders.

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
  // dollar (default)
  return (
    <span style={{ color: 'var(--ink-light)', fontSize: 12, letterSpacing: '0.05em' }}>
      ☐ &nbsp; + $ _________
    </span>
  )
}

export default function InclusionGrid({
  rows,
  showCompetitorCols = true,    // /checklist: true. /pricing: false.
  showHeadlinePrice  = true,    // Rixey peak/off-season prices row.
  showTotals         = true,    // "Real total" footer row (/checklist only).
}) {
  const cellPad = '10px 14px'

  // colTemplate: label + WD + EW + (two competitor cols if shown).
  const colTemplate = showCompetitorCols
    ? '2.2fr 1.2fr 1.2fr 1.4fr 1.4fr'
    : '2.4fr 1.4fr 1.4fr'

  return (
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
        {showCompetitorCols && (
          <>
            <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>
              Venue: ________________
            </div>
            <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>
              Venue: ________________
            </div>
          </>
        )}
      </div>

      {/* Headline price row */}
      {showHeadlinePrice && (
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
            <strong>$14,000</strong> peak<br />
            <span style={{ color: 'var(--ink-light)' }}>$10,500 off-season</span>
          </div>
          <div style={{ padding: cellPad, color: 'var(--ink)', borderLeft: '1px solid var(--border)' }}>
            <strong>$19,000</strong> peak<br />
            <span style={{ color: 'var(--ink-light)' }}>$14,000 off-season</span>
          </div>
          {showCompetitorCols && (
            <>
              <div style={{ padding: cellPad, color: 'var(--ink-light)', borderLeft: '1px solid var(--border)' }}>
                $ _____________
              </div>
              <div style={{ padding: cellPad, color: 'var(--ink-light)', borderLeft: '1px solid var(--border)' }}>
                $ _____________
              </div>
            </>
          )}
        </div>
      )}

      {/* Item rows. Section-header rows render as a forest-green band so
          the couple can visually group "what's included" vs "upgrades" vs
          "discounts" vs "policies". Zebra-stripe restarts inside each
          section so the rhythm reads cleanly across boundaries. */}
      {(() => {
        let stripe = 0
        return rows.map((row, i) => {
          if (row.section === 'header') {
            stripe = 0
            return (
              <div
                key={`hdr-${i}-${row.slug}`}
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
              {showCompetitorCols && (
                <>
                  <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>
                    <BlankCell mode={row.mode} />
                  </div>
                  <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>
                    <BlankCell mode={row.mode} />
                  </div>
                </>
              )}
            </div>
          )
        })
      })()}

      {/* Totals row (printable comparison: "headline + every add-on") */}
      {showTotals && (
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
            $14,000 / $10,500
          </div>
          <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)', textAlign: 'center' }}>
            $19,000 / $14,000
          </div>
          {showCompetitorCols && (
            <>
              <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>$ ______________</div>
              <div style={{ padding: cellPad, borderLeft: '1px solid var(--border)' }}>$ ______________</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
