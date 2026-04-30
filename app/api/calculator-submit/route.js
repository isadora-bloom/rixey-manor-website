import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req) {
  const data = await req.json()

  const {
    season, guests, nights, upgrades, discounts5, discounts10,
    estimate, tax, perPayment,
    bartenders, bartenderRate, bartenderCost,
    nextSteps, weddingDate,
    p1Name, p1Email, p1Phone,
    p2Name, p2Phone,
    notes,
    source, medium, campaign, referrer,
    visitor_id,
  } = data

  // 1. Save to Supabase
  const { error: dbError } = await supabase.from('calculator_submissions').insert({
    season, guests, nights,
    upgrades: upgrades?.join(', ') || '',
    discounts: [...(discounts5 || []), ...(discounts10 || [])].join(', '),
    estimate,
    per_payment: perPayment,
    next_steps: nextSteps?.join(', ') || '',
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
    console.error('DB error:', dbError.message)
    // Don't fail the whole request — try to send email anyway
  }

  // 1b. Backfill identity onto the visitor row so this person is now identified
  // for any prior anonymous pageviews. Best-effort; never blocks the response.
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
      console.error('[calculator-submit] visitor backfill error:', e?.message || e)
    }
  }

  // 2. Send emails if Resend is configured
  if (resend) {
    const wantsContract = nextSteps?.some(s => /contract/i.test(s))

    const summaryLines = [
      `Season: ${season}`,
      `Guests: ${guests}`,
      `Overnight stays: ${nights}`,
      upgrades?.length ? `Upgrades: ${upgrades.join(', ')}` : null,
      discounts5?.length ? `5% discounts: ${discounts5.join(', ')}` : null,
      discounts10?.length ? `10% discounts: ${discounts10.join(', ')}` : null,
      ``,
      `Estimated total (incl. 6% tax): $${estimate?.toLocaleString()}`,
      tax ? `  Sales tax (6%): $${tax.toLocaleString()}` : null,
      `Per payment (×3): $${perPayment?.toLocaleString()}`,
      ``,
      `Plus bartending — required, billed separately. Two-bartender minimum, ~1 per 50 guests (around ${bartenders ?? 2} for this guest count). In-house bartenders only — final staffing and pricing confirmed directly.`,
    ].filter(Boolean).join('\n')

    const coupleHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
        <h2 style="font-size: 28px; font-weight: normal; margin-bottom: 8px;">Your Rixey Manor estimate</h2>
        <p style="color: #7A6E68; font-size: 15px; margin-bottom: 24px;">Here's a summary of what you put together. We'll be in touch soon.</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          ${[
            ['Season', season],
            ['Guests', guests],
            ['Overnight stays', nights],
            upgrades?.length ? ['Upgrades', upgrades.join(', ')] : null,
            discounts5?.length ? ['5% discounts', discounts5.join(', ')] : null,
            discounts10?.length ? ['10% discounts', discounts10.join(', ')] : null,
          ].filter(Boolean).map(([label, value]) => `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E0D8D0; color: #7A6E68; font-size: 13px; width: 40%;">${label}</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E0D8D0; font-size: 14px;">${value}</td>
            </tr>
          `).join('')}
        </table>

        <div style="background: #F7F3EE; padding: 24px; margin-bottom: 24px;">
          <p style="font-size: 36px; color: #2E7D54; margin: 0 0 4px; font-weight: normal;">$${estimate?.toLocaleString()}</p>
          <p style="font-size: 13px; color: #7A6E68; margin: 0 0 16px;">Estimated total (includes 6% Virginia sales tax${tax ? ` of $${tax.toLocaleString()}` : ''})</p>
          <p style="font-size: 18px; color: #1C1814; margin: 0 0 4px;">$${perPayment?.toLocaleString()} × 3 payments</p>
          <p style="font-size: 12px; color: #7A6E68; margin: 0;">Retainer to reserve the date · halfway through planning · 3 months before the wedding.</p>
        </div>

        <div style="border: 1px solid #E0D8D0; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #B8908A; margin: 0 0 8px;">Plus bartending — required, billed separately</p>
          <p style="font-size: 14px; color: #3D3530; margin: 0 0 6px; line-height: 1.5;">
            You bring your own alcohol, but bartending must be staffed by our in-house team — outside bartenders aren't permitted, for licensing and insurance reasons. <strong>Two-bartender minimum</strong>, typically one per 50 guests.
          </p>
          <p style="font-size: 13px; color: #7A6E68; margin: 0;">
            For ${guests} guests, plan on around <strong>${bartenders ?? 2} bartenders</strong>. We'll confirm staffing and pricing with you directly.
          </p>
        </div>

        ${weddingDate ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Date in mind:</strong> ${weddingDate}</p>` : ''}
        ${nextSteps?.length ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Next steps requested:</strong> ${nextSteps.join(', ')}</p>` : ''}
        ${p1Phone ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Phone on file:</strong> ${p1Phone}</p>` : ''}
        ${notes ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Notes:</strong> ${notes}</p>` : ''}

        <hr style="border: none; border-top: 1px solid #E0D8D0; margin: 24px 0;" />
        <p style="font-size: 13px; color: #7A6E68;">
          This is an estimate. Final pricing is confirmed at your tour.<br>
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

    const venueHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 4px;">New calculator submission${wantsContract ? ' — contract requested' : ''}</h2>
        <p style="color: #7A6E68; font-size: 14px; margin-bottom: 24px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p style="font-size: 16px; margin-bottom: 4px;"><strong>${p1Name}</strong>${p2Name ? ` & ${p2Name}` : ''}</p>
        <p style="font-size: 14px; color: #3D3530; margin-bottom: 2px;">${p1Email}</p>
        ${p1Phone ? `<p style="font-size: 14px; color: #3D3530; margin-bottom: 2px;">P1 phone: ${p1Phone}</p>` : ''}
        ${p2Phone ? `<p style="font-size: 14px; color: #3D3530; margin-bottom: 16px;">P2 phone: ${p2Phone}</p>` : '<br/>'}

        ${weddingDate ? `<p style="font-size: 14px; margin: 0 0 6px;"><strong>Date in mind:</strong> ${weddingDate}</p>` : ''}
        ${nextSteps?.length ? `<p style="font-size: 14px; margin: 0 0 6px;"><strong>Next steps:</strong> ${nextSteps.join(', ')}</p>` : ''}

        <pre style="font-size: 14px; background: #F7F3EE; padding: 16px; white-space: pre-wrap; margin-top: 16px;">${summaryLines}</pre>

        ${notes ? `<p style="font-size: 14px;"><strong>Notes:</strong> ${notes}</p>` : ''}
        ${utmBits ? `<p style="font-size: 12px; color: #7A6E68; margin-top: 16px;"><strong>Attribution:</strong> ${utmBits}</p>` : ''}
      </div>
    `

    const venueSubject = wantsContract
      ? `Contract requested: ${p1Name}${p2Name ? ` & ${p2Name}` : ''}${weddingDate ? ` — ${weddingDate}` : ''} — $${estimate?.toLocaleString()}`
      : `New estimate: ${p1Name}${p2Name ? ` & ${p2Name}` : ''} — $${estimate?.toLocaleString()}`

    await Promise.allSettled([
      // Email to couple
      resend.emails.send({
        from: 'Rixey Manor <hello@rixeymanor.com>',
        to: p1Email,
        cc: 'info@rixeymanor.com',
        subject: 'Your Rixey Manor estimate',
        html: coupleHtml,
      }),
      // Email to venue
      resend.emails.send({
        from: 'Rixey Manor Calculator <hello@rixeymanor.com>',
        to: 'info@rixeymanor.com',
        subject: venueSubject,
        html: venueHtml,
      }),
    ])
  }

  return Response.json({ ok: true })
}
