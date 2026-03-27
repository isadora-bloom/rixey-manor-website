import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

let resend = null
try {
  if (process.env.RESEND_API_KEY) resend = new Resend(process.env.RESEND_API_KEY)
} catch (e) {
  console.error('Resend init error:', e)
}

export async function POST(req) {
  try {
    const { name, email, message, source, medium, campaign, referrer } = await req.json()

    if (!name || !email || !message) {
      return Response.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }

    // Always save to Supabase regardless of Resend status
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name, email, message,
      source: source || null, medium: medium || null, campaign: campaign || null, referrer: referrer || null,
    })
    if (dbError) console.error('DB error:', dbError.message)

    if (!resend) {
      return Response.json({ ok: true })
    }

    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    const [notif, confirm] = await Promise.allSettled([
      resend.emails.send({
        from: 'Rixey Manor Website <hello@rixeymanor.com>',
        to: 'info@rixeymanor.com',
        reply_to: email,
        subject: `Question from ${name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
            <h2 style="font-size: 22px; font-weight: normal; margin-bottom: 4px;">New question from the website</h2>
            <p style="color: #7A6E68; font-size: 14px; margin-bottom: 24px;">${date}</p>
            <p style="font-size: 16px; margin-bottom: 2px;"><strong>${name}</strong></p>
            <p style="font-size: 14px; color: #3D3530; margin-bottom: 20px;">${email}</p>
            <div style="background: #F7F3EE; padding: 20px; border-left: 3px solid #2E7D54;">
              <p style="font-size: 15px; line-height: 1.7; margin: 0; color: #1C1814;">${message}</p>
            </div>
            <p style="font-size: 13px; color: #7A6E68; margin-top: 24px;">Reply to this email to respond to ${name}.</p>
          </div>
        `,
      }),
      resend.emails.send({
        from: 'Rixey Manor <hello@rixeymanor.com>',
        to: email,
        subject: 'We got your message — Rixey Manor',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C1814;">
            <h2 style="font-size: 26px; font-weight: normal; margin-bottom: 8px;">Got it, ${name}.</h2>
            <p style="color: #7A6E68; font-size: 15px; margin-bottom: 24px;">We'll get back to you within 24 hours. If it's urgent, call or text us at (540) 212-4545.</p>
            <div style="background: #F7F3EE; padding: 20px; margin-bottom: 24px;">
              <p style="font-size: 12px; color: #7A6E68; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 8px;">Your message</p>
              <p style="font-size: 15px; line-height: 1.7; margin: 0; color: #3D3530;">${message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #E0D8D0; margin: 24px 0;" />
            <p style="font-size: 13px; color: #7A6E68;">
              Rixey Manor · 9155 Pleasant Hill Lane, Rixeyville, VA 22737 · (540) 212-4545
            </p>
          </div>
        `,
      }),
    ])

    // Log any Resend errors for debugging
    if (notif.status === 'fulfilled' && notif.value?.error) {
      console.error('Resend notif error:', notif.value.error)
    }
    if (confirm.status === 'fulfilled' && confirm.value?.error) {
      console.error('Resend confirm error:', confirm.value.error)
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err?.message || err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
