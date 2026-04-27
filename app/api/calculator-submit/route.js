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
    bartenders, bartenderCost,
    nextSteps, weddingDate,
    p1Name, p1Email, p1Phone,
    p2Name, p2Phone,
    notes,
    source, medium, campaign, referrer,
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
  })

  if (dbError) {
    console.error('DB error:', dbError.message)
    // Don't fail the whole request — try to send email anyway
  }

  // 2. Send emails if Resend is configured
  if (resend) {
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
      `Plus bartending — required, billed separately: ${bartenders ?? 2} bartenders × $400 = $${(bartenderCost ?? 800).toLocaleString()} (in-house bartenders only, no outside bartenders)`,
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
            You bring your own alcohol, but bartending must be staffed by our in-house team — outside bartenders aren't permitted, for licensing and insurance reasons. <strong>Two-bartender minimum</strong>, typically one per 50 guests, at <strong>$400 each</strong>.
          </p>
          <p style="font-size: 13px; color: #7A6E68; margin: 0;">
            For ${guests} guests, plan on <strong>${bartenders ?? 2} bartenders — about $${(bartenderCost ?? 800).toLocaleString()}</strong> on top of the venue total.
          </p>
        </div>

        ${weddingDate ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Date in mind:</strong> ${weddingDate}</p>` : ''}
        ${nextSteps?.length ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Next steps requested:</strong> ${nextSteps.join(', ')}</p>` : ''}
        ${notes ? `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Notes:</strong> ${notes}</p>` : ''}

        <hr style="border: none; border-top: 1px solid #E0D8D0; margin: 24px 0;" />
        <p style="font-size: 13px; color: #7A6E68;">
          This is an estimate. Final pricing is confirmed at your tour.<br>
          Rixey Manor · 9155 Pleasant Hill Lane, Rixeyville, VA 22737 · (540) 212-4545
        </p>
      </div>
    `

    const venueHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
        <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 4px;">New calculator submission</h2>
        <p style="color: #7A6E68; font-size: 14px; margin-bottom: 24px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p style="font-size: 16px; margin-bottom: 4px;"><strong>${p1Name}</strong>${p2Name ? ` & ${p2Name}` : ''}</p>
        <p style="font-size: 14px; color: #3D3530; margin-bottom: 2px;">${p1Email}</p>
        ${p1Phone ? `<p style="font-size: 14px; color: #3D3530; margin-bottom: 2px;">${p1Phone}</p>` : ''}
        ${p2Phone ? `<p style="font-size: 14px; color: #3D3530; margin-bottom: 16px;">${p2Phone}</p>` : '<br/>'}

        <pre style="font-size: 14px; background: #F7F3EE; padding: 16px; white-space: pre-wrap;">${summaryLines}</pre>

        ${weddingDate ? `<p style="font-size: 14px;"><strong>Date in mind:</strong> ${weddingDate}</p>` : ''}
        ${nextSteps?.length ? `<p style="font-size: 14px;"><strong>Next steps:</strong> ${nextSteps.join(', ')}</p>` : ''}
        ${notes ? `<p style="font-size: 14px;"><strong>Notes:</strong> ${notes}</p>` : ''}
      </div>
    `

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
        subject: `New estimate: ${p1Name}${p2Name ? ` & ${p2Name}` : ''} — $${estimate?.toLocaleString()}`,
        html: venueHtml,
      }),
    ])
  }

  return Response.json({ ok: true })
}
