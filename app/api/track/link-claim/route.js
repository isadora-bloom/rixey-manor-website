import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Called by the Tracker when a visitor lands with a ?lid=<code> param.
// Two jobs:
//   1. Stamp the known client identity (from tracked_links) onto the browser's
//      site_visitors row — so this and every future pageview is attributed.
//   2. Record the open on the tracked_links row.
// The Tracker claims each code at most once per browser, so click_count
// reflects distinct browsers, not reloads or email-scanner pre-fetches.
export async function POST(req) {
  try {
    const { code, visitor_id } = await req.json()
    if (!code || !visitor_id) {
      return Response.json({ ok: false, error: 'code and visitor_id required' }, { status: 400 })
    }

    // Look up the link
    const { data: link } = await supabase
      .from('tracked_links')
      .select('*')
      .eq('code', code)
      .maybeSingle()

    if (!link) return Response.json({ ok: false, error: 'unknown code' }, { status: 404 })

    const now = new Date().toISOString()

    // ── 1. Identify the visitor ────────────────────────────────────────────
    // Same rules as /api/track/identify: never overwrite a non-null field
    // with empty; set identified_at once.
    const { data: existing } = await supabase
      .from('site_visitors')
      .select('visitor_id, first_name, partner_name, email, phone, role, identified_at')
      .eq('visitor_id', visitor_id)
      .maybeSingle()

    const idUpdate = {}
    if (link.first_name)   idUpdate.first_name   = link.first_name
    if (link.partner_name) idUpdate.partner_name = link.partner_name
    if (link.email)        idUpdate.email        = link.email
    if (link.phone)        idUpdate.phone        = link.phone
    if (link.role)         idUpdate.role         = link.role
    if ((idUpdate.first_name || idUpdate.email) && !existing?.identified_at) {
      idUpdate.identified_at = now
    }

    if (!existing) {
      await supabase.from('site_visitors').insert({
        visitor_id,
        first_seen_at: now,
        last_seen_at: now,
        ...idUpdate,
      })
    } else if (Object.keys(idUpdate).length > 0) {
      await supabase.from('site_visitors').update(idUpdate).eq('visitor_id', visitor_id)
    }

    // ── 2. Record the open ─────────────────────────────────────────────────
    await supabase
      .from('tracked_links')
      .update({
        click_count: (link.click_count || 0) + 1,
        first_clicked_at: link.first_clicked_at || now,
        last_clicked_at: now,
        last_visitor_id: visitor_id,
      })
      .eq('code', code)

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[track/link-claim]', err?.message || err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
