import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function fmt(n) {
  if (n == null) return ''
  return '$' + Number(n).toLocaleString()
}

export async function POST(req) {
  const data = await req.json()

  const {
    selections, // { category_slug: { category_name, option_label, range_low, range_high } }
    budgetLow,
    budgetHigh,
    totalLow,    // grand total including venue + bartender if present
    totalHigh,
    venueSnapshot, // optional: full snapshot from /pricing localStorage
    nextSteps,
    weddingDate,
    p1Name, p1Email, p1Phone,
    p2Name, p2Phone,
    notes,
    source, medium, campaign, referrer,
    visitor_id,
  } = data

  // 1. Save to Supabase
  const { error: dbError } = await supabase.from('budget_calculator_submissions').insert({
    selections: selections || {},
    total_low: totalLow ?? null,
    total_high: totalHigh ?? null,
    venue_snapshot: venueSnapshot || null,
    next_steps: nextSteps?.join(', ') || null,
    wedding_date: weddingDate || null,
    p1_name: p1Name,
    p1_email: p1Email,
    p1_phone: p1Phone || null,
    p2_name: p2Name || null,
    p2_phone: p2Phone || null,
    notes: notes || null,
    source: source || null, medium: medium || null, campaign: campaign || null, referrer: referrer || null,
    visitor_id: visitor_id || null,
  })

  if (dbError) {
    console.error('[budget-calculator-submit] DB error:', dbError.message)
  }

  // 1b. Best-effort visitor identity backfill — same pattern as /api/calculator-submit
  if (visitor_id && p1Email) {
    try {
      const { data: existing } = await supabase
        .from('site_visitors')
        .select('visitor_id, first_name, partner_name, email, phone, identified_at')
        .eq('visitor_id', visitor_id)
        .maybeSingle()

      const update = {}
      if (p1Name && !existing?.first_name)   update.first_name   = p1Name
      if (p2Name && !existing?.partner_name) update.partner_name = p2Name
      if (p1Email && !existing?.email)       update.email        = p1Email.toLowerCase()
      if (p1Phone && !existing?.phone)       update.phone        = p1Phone
      if (!existing?.identified_at && (update.first_name || update.email)) {
        update.identified_at = new Date().toISOString()
      }
      if (existing && Object.keys(update).length) {
        await supabase.from('site_visitors').update(update).eq('visitor_id', visitor_id)
      } else if (!existing) {
        await supabase.from('site_visitors').insert({
          visitor_id,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
          first_name: p1Name || null,
          partner_name: p2Name || null,
          email: p1Email.toLowerCase(),
          phone: p1Phone || null,
          identified_at: new Date().toISOString(),
        })
      }
    } catch (e) {
      console.error('[budget-calculator-submit] visitor backfill error:', e?.message || e)
    }
  }

  // 2. Email if Resend is configured
  if (resend) {
    const selectionRows = Object.entries(selections || {})
      .map(([slug, sel]) => {
        const range = sel.range_low != null && sel.range_high != null
          ? `${fmt(sel.range_low)}–${fmt(sel.range_high)}`
          : ''
        return `${sel.category_name || slug}: ${sel.option_label}${range ? ` (${range})` : ''}`
      })
      .join('\n')

    const totalRange = (totalLow != null && totalHigh != null)
      ? (totalLow === totalHigh ? fmt(totalLow) : `${fmt(totalLow)}–${fmt(totalHigh)}`)
      : ''
    const budgetRange = (budgetLow != null && budgetHigh != null)
      ? `${fmt(budgetLow)}–${fmt(budgetHigh)}`
      : ''

    // Venue snapshot lines (when present)
    const v = venueSnapshot || null
    const venueHasData = v?.totals?.total != null
    const venueRows = venueHasData ? [
      ['Venue (' + [v.season?.label, v.guests?.label, v.nights?.label].filter(Boolean).join(' · ') + ')', fmt(v.totals.total)],
      v.bartenders?.cost ? ['Bartender service (paid direct, no markup)', fmt(v.bartenders.cost)] : null,
    ].filter(Boolean) : []

    const coupleHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
        <h2 style="font-size: 28px; font-weight: normal; margin-bottom: 8px;">Your Rixey wedding, line by line</h2>
        <p style="color: #7A6E68; font-size: 15px; margin-bottom: 24px;">Here's the wedding you put together. We'll be in touch soon.</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          ${venueRows.map(([label, value]) => `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E0D8D0; color: #7A6E68; font-size: 13px; width: 40%;">${label}</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E0D8D0; font-size: 14px;">${value}</td>
            </tr>
          `).join('')}
          ${Object.entries(selections || {}).map(([slug, sel]) => {
            const range = sel.range_low != null && sel.range_high != null
              ? `${fmt(sel.range_low)}–${fmt(sel.range_high)}`
              : ''
            return `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E0D8D0; color: #7A6E68; font-size: 13px; width: 40%;">${sel.category_name || slug}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E0D8D0; font-size: 14px;">${sel.option_label}${range ? ` <span style="color:#7A6E68;font-size:12px">${range}</span>` : ''}</td>
              </tr>
            `
          }).join('')}
        </table>

        ${totalRange ? `
        <div style="background: #F7F3EE; padding: 24px; margin-bottom: 24px;">
          <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7A6E68; margin: 0 0 6px;">${venueHasData ? 'Your wedding total' : 'Estimated total'}</p>
          <p style="font-size: 32px; color: #2E7D54; margin: 0; font-weight: normal;">${totalRange}</p>
          <p style="font-size: 12px; color: #7A6E68; margin: 8px 0 0;">${venueHasData ? 'Venue + bartender (fixed) plus everything else (range).' : 'Everything except the venue. Add the venue calculator to see your full total.'} Framework, not quote.</p>
        </div>
        ` : ''}

        ${weddingDate ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Date in mind:</strong> ${weddingDate}</p>` : ''}
        ${nextSteps?.length ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Next steps requested:</strong> ${nextSteps.join(', ')}</p>` : ''}
        ${p1Phone ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Phone on file:</strong> ${p1Phone}</p>` : ''}
        ${notes ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Notes:</strong> ${notes}</p>` : ''}

        <hr style="border: none; border-top: 1px solid #E0D8D0; margin: 24px 0;" />
        <p style="font-size: 13px; color: #7A6E68;">
          Rixey Manor · 9155 Pleasant Hill Lane, Rixeyville, VA 22737 · (540) 212-4545
        </p>
      </div>
    `

    const utmBits = [
      source && `source: ${source}`,
      medium && `medium: ${medium}`,
      campaign && `campaign: ${campaign}`,
      referrer && `referrer: ${referrer}`,
    ].filter(Boolean).join(' · ')

    // Venue summary block for venue email
    const venueSummary = venueHasData ? [
      `Venue: ${v.season?.label || ''} · ${v.guests?.label || ''} · ${v.nights?.label || ''}`,
      v.upgrades?.length ? `  Upgrades: ${v.upgrades.map(u => u.label).join(', ')}` : null,
      v.discounts?.length ? `  Discounts: ${v.discounts.map(d => d.label).join(', ')}` : null,
      `  Venue total: ${fmt(v.totals.total)}`,
      v.bartenders?.cost ? `  Bartenders: ${v.bartenders.count} × ${fmt(v.bartenders.rate)} = ${fmt(v.bartenders.cost)} (paid direct)` : null,
      v.saved_at ? `  Snapshot saved: ${new Date(v.saved_at).toISOString().slice(0, 10)}` : null,
    ].filter(Boolean).join('\n') : '⚠ No venue calculator data — couple submitted budget without filling /pricing yet.'

    const venueHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 4px;">New budget submission${venueHasData ? '' : ' (no venue data)'}</h2>
        <p style="color: #7A6E68; font-size: 14px; margin-bottom: 24px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p style="font-size: 16px; margin-bottom: 4px;"><strong>${p1Name}</strong>${p2Name ? ` &amp; ${p2Name}` : ''}</p>
        <p style="font-size: 14px; color: #3D3530; margin-bottom: 2px;">${p1Email}</p>
        ${p1Phone ? `<p style="font-size: 14px; color: #3D3530; margin-bottom: 2px;">P1 phone: ${p1Phone}</p>` : ''}
        ${p2Phone ? `<p style="font-size: 14px; color: #3D3530; margin-bottom: 16px;">P2 phone: ${p2Phone}</p>` : '<br/>'}

        ${weddingDate ? `<p style="font-size: 14px; margin: 0 0 6px;"><strong>Date in mind:</strong> ${weddingDate}</p>` : ''}
        ${nextSteps?.length ? `<p style="font-size: 14px; margin: 0 0 6px;"><strong>Next steps:</strong> ${nextSteps.join(', ')}</p>` : ''}
        ${totalRange ? `<p style="font-size: 14px; margin: 0 0 6px;"><strong>${venueHasData ? 'Wedding total' : 'Budget portion'}:</strong> ${totalRange}</p>` : ''}
        ${venueHasData && budgetRange ? `<p style="font-size: 14px; margin: 0 0 6px;"><strong>Budget portion:</strong> ${budgetRange}</p>` : ''}

        <pre style="font-size: 13px; background: #F7F3EE; padding: 16px; white-space: pre-wrap; margin-top: 16px; ${venueHasData ? '' : 'border-left: 3px solid #B8908A;'}">${venueSummary}</pre>

        <pre style="font-size: 14px; background: #F7F3EE; padding: 16px; white-space: pre-wrap; margin-top: 16px;">${selectionRows}</pre>

        ${notes ? `<p style="font-size: 14px;"><strong>Notes:</strong> ${notes}</p>` : ''}
        ${utmBits ? `<p style="font-size: 12px; color: #7A6E68; margin-top: 16px;"><strong>Attribution:</strong> ${utmBits}</p>` : ''}
      </div>
    `

    await Promise.allSettled([
      resend.emails.send({
        from: 'Rixey Manor <hello@rixeymanor.com>',
        to: p1Email,
        cc: 'info@rixeymanor.com',
        subject: 'Your Rixey wedding budget',
        html: coupleHtml,
      }),
      resend.emails.send({
        from: 'Rixey Manor Budget <hello@rixeymanor.com>',
        to: 'info@rixeymanor.com',
        subject: `New budget${venueHasData ? '' : ' (no venue)'}: ${p1Name}${p2Name ? ` & ${p2Name}` : ''}${totalRange ? ` — ${totalRange}` : ''}`,
        html: venueHtml,
      }),
    ])
  }

  return Response.json({ ok: true })
}
