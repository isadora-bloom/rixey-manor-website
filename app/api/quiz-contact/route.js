import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req) {
  const data = await req.json()
  const { name, partner, email, date, notes, tier, path, answers, source, medium, campaign, referrer } = data

  if (!name || !email) {
    return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
  }

  const tierLabels = { 1: "You're a Rixey Couple", 2: 'Could Go Either Way', 3: "Probably Not Their Place" }
  const pathLabels = { vibes: 'Vibe Check', logistics: 'Logistics Check', both: 'Both Checks' }

  // Always save to Supabase regardless of Resend status
  const { error: dbError } = await supabase.from('quiz_submissions').insert({
    name, partner: partner || null, email,
    wedding_date: date || null, notes: notes || null,
    tier: tier || null, path: path || null, answers: answers || null,
    source: source || null, medium: medium || null, campaign: campaign || null, referrer: referrer || null,
  })
  if (dbError) console.error('DB error:', dbError.message)

  if (!resend) {
    return Response.json({ ok: true })
  }

  const coupleHtml = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
      <h2 style="font-size: 26px; font-weight: normal; margin-bottom: 4px;">Thanks, ${name}.</h2>
      <p style="color: #7A6E68; font-size: 15px; margin-bottom: 32px;">We've got your quiz answers. Isadora will be in touch soon.</p>

      <div style="background: #F7F3EE; padding: 20px; margin-bottom: 24px; border-left: 3px solid #2E7D54;">
        <p style="font-size: 13px; color: #7A6E68; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 6px;">Your result</p>
        <p style="font-size: 18px; color: #1C1814; margin: 0;">${tierLabels[tier] || 'Quiz complete'}</p>
      </div>

      <hr style="border: none; border-top: 1px solid #E0D8D0; margin: 24px 0;" />
      <p style="font-size: 13px; color: #7A6E68;">
        Rixey Manor · 9155 Pleasant Hill Lane, Rixeyville, VA 22737 · (540) 212-4545<br>
        <a href="https://www.rixeymanor.com" style="color: #2E7D54;">rixeymanor.com</a>
      </p>
    </div>
  `

  const venueHtml = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
      <h2 style="font-size: 22px; font-weight: normal; margin-bottom: 4px;">Quiz inquiry — ${name}${partner ? ` & ${partner}` : ''}</h2>
      <p style="color: #7A6E68; font-size: 14px; margin-bottom: 24px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p style="font-size: 16px; margin-bottom: 2px;"><strong>${name}${partner ? ` & ${partner}` : ''}</strong></p>
      <p style="font-size: 14px; color: #3D3530; margin-bottom: 16px;">${email}</p>

      <div style="background: #F7F3EE; padding: 16px; margin-bottom: 20px;">
        <p style="font-size: 12px; color: #7A6E68; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 4px;">Result</p>
        <p style="font-size: 16px; color: #1C1814; margin: 0 0 8px;">${tierLabels[tier] || '—'}</p>
        <p style="font-size: 12px; color: #7A6E68; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 4px;">Quiz taken</p>
        <p style="font-size: 14px; color: #1C1814; margin: 0;">${pathLabels[path] || path || '—'}</p>
      </div>

      ${date ? `<p style="font-size: 14px; margin-bottom: 12px;"><strong>Date in mind:</strong> ${date}</p>` : ''}
      ${notes ? `<p style="font-size: 14px; margin-bottom: 20px;"><strong>Notes:</strong> ${notes}</p>` : ''}

      ${answers ? `
        <p style="font-size: 12px; color: #7A6E68; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">Quiz answers</p>
        <pre style="font-size: 13px; background: #F7F3EE; padding: 16px; white-space: pre-wrap; line-height: 1.7; color: #3D3530;">${answers}</pre>
      ` : ''}
    </div>
  `

  await Promise.allSettled([
    resend.emails.send({
      from: 'Rixey Manor <hello@rixeymanor.com>',
      to: email,
      cc: 'info@rixeymanor.com',
      subject: 'Your Rixey Manor quiz result',
      html: coupleHtml,
    }),
    resend.emails.send({
      from: 'Rixey Manor Quiz <hello@rixeymanor.com>',
      to: 'info@rixeymanor.com',
      subject: `Quiz inquiry: ${name}${partner ? ` & ${partner}` : ''} — ${tierLabels[tier] || 'result'}`,
      html: venueHtml,
    }),
  ])

  return Response.json({ ok: true })
}
