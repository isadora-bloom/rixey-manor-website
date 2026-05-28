import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// POST /api/track/tour-intent
//
// Two shapes are accepted:
//
//   { kind: 'open', visitor_id, calendly_url, first_source, ..., trigger_path }
//     → upserts an "opened the Calendly widget" row. Idempotent per visitor
//       per calendly_url per calendar day so reloads + double-clicks don't
//       create duplicate rows.
//
//   { kind: 'scheduled', visitor_id, calendly_url, scheduled_event_uri, email, first_name }
//     → finds the matching open row (visitor + calendly_url, same day, no
//       scheduled_at yet) and stamps scheduled_at + invitee details. Falls
//       back to inserting a fresh row if no open match (rare: direct deep
//       link bypass).
//
// Designed to never fail the page render.
export async function POST(req) {
  try {
    const data = await req.json()
    const kind = data.kind || 'open'

    if (!data.visitor_id) {
      return Response.json({ ok: false, error: 'visitor_id required' }, { status: 400 })
    }

    if (kind === 'scheduled') {
      // Find the most recent matching open row to stamp.
      const startOfDay = new Date()
      startOfDay.setUTCHours(0, 0, 0, 0)

      const { data: openRow } = await supabase
        .from('tour_intents')
        .select('id')
        .eq('visitor_id', data.visitor_id)
        .is('scheduled_at', null)
        .gte('opened_at', startOfDay.toISOString())
        .order('opened_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const patch = {
        scheduled_at: new Date().toISOString(),
        scheduled_event_uri: data.scheduled_event_uri || null,
        email: data.email || null,
        first_name: data.first_name || null,
        partner_name: data.partner_name || null,
      }

      if (openRow) {
        await supabase.from('tour_intents').update(patch).eq('id', openRow.id)
      } else {
        // No matching open — log scheduled-without-open (deep link path)
        await supabase.from('tour_intents').insert({
          visitor_id: data.visitor_id,
          calendly_url: data.calendly_url || null,
          source: data.source || null,
          medium: data.medium || null,
          campaign: data.campaign || null,
          referrer: data.referrer || null,
          landing_page: data.landing_page || null,
          trigger_path: data.trigger_path || null,
          ...patch,
        })
      }

      return Response.json({ ok: true })
    }

    // kind === 'open' — idempotent upsert per visitor per calendly_url per day.
    const startOfDay = new Date()
    startOfDay.setUTCHours(0, 0, 0, 0)

    const { data: existing } = await supabase
      .from('tour_intents')
      .select('id')
      .eq('visitor_id', data.visitor_id)
      .eq('calendly_url', data.calendly_url || '')
      .gte('opened_at', startOfDay.toISOString())
      .order('opened_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing) {
      // Already logged today — nothing to do
      return Response.json({ ok: true, dedup: true })
    }

    await supabase.from('tour_intents').insert({
      visitor_id: data.visitor_id,
      calendly_url: data.calendly_url || null,
      source: data.source || null,
      medium: data.medium || null,
      campaign: data.campaign || null,
      referrer: data.referrer || null,
      landing_page: data.landing_page || null,
      trigger_path: data.trigger_path || null,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[track/tour-intent]', err?.message || err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
