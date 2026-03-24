import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

export async function POST(req) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return Response.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }

    // Save to DB (best effort — table may not exist yet)
    if (supabase) {
      await supabase.from('contact_submissions').insert({
        name, email, message,
        created_at: new Date().toISOString(),
      }).catch(() => {})
    }

  if (!resend) {
    console.log('Contact form (no Resend key):', { name, email, message })
    return Response.json({ ok: true })
  }

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  await Promise.allSettled([
    // Notification to venue
    resend.emails.send({
      from: 'Rixey Manor Website <hello@rixeymanor.com>',
      to: 'info@rixeymanor.com',
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
          <p style="font-size: 13px; color: #7A6E68; margin-top: 24px;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
      replyTo: email,
    }),
    // Confirmation to sender
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
            Rixey Manor · 9155 Pleasant Hill Lane, Rixeyville, VA 22737 · (540) 212-4545<br>
            <a href="https://www.rixeymanor.com" style="color: #2E7D54;">rixeymanor.com</a>
          </p>
        </div>
      `,
    }),
  ])

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
