import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Attach a name (and optionally email/phone) to a visitor.
// Called by the name-capture bar AND by form submissions — whichever comes first.
// Idempotent: never overwrites a non-null field with null/empty, but does update
// if a richer value comes in later (e.g. they gave name in bar, then email in form).
export async function POST(req) {
  try {
    const { visitor_id, first_name, partner_name, email, phone, role } = await req.json()
    if (!visitor_id) {
      return Response.json({ ok: false, error: 'visitor_id required' }, { status: 400 })
    }

    // Make sure the visitor row exists first
    const { data: existing } = await supabase
      .from('site_visitors')
      .select('visitor_id, first_name, partner_name, email, phone, role, identified_at')
      .eq('visitor_id', visitor_id)
      .maybeSingle()

    const update = {}
    if (first_name && first_name.trim())     update.first_name   = first_name.trim()
    if (partner_name && partner_name.trim()) update.partner_name = partner_name.trim()
    if (email && email.trim())               update.email        = email.trim().toLowerCase()
    if (phone && phone.trim())               update.phone        = phone.trim()
    // Role is allowed to change on later visits — don't gate on existing
    if (role && role.trim())                 update.role         = role.trim()
    if ((update.first_name || update.email) && !existing?.identified_at) {
      update.identified_at = new Date().toISOString()
    }

    if (Object.keys(update).length === 0) {
      return Response.json({ ok: true, noop: true })
    }

    if (!existing) {
      await supabase.from('site_visitors').insert({
        visitor_id,
        first_seen_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        ...update,
      })
    } else {
      await supabase
        .from('site_visitors')
        .update(update)
        .eq('visitor_id', visitor_id)
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[track/identify]', err?.message || err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
