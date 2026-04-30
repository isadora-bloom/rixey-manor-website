import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Upsert visitor row + insert a pageview row.
// Designed to be cheap and forgiving — never fails the page render.
export async function POST(req) {
  try {
    const data = await req.json()
    const {
      visitor_id, session_id,
      path, query, referrer,
      first_source, first_medium, first_campaign, first_content, first_term,
      first_referrer, first_landing_page, first_seen_at,
      last_source, last_medium, last_campaign, last_referrer, last_landing_page,
    } = data

    if (!visitor_id || !path) {
      return Response.json({ ok: false, error: 'visitor_id and path required' }, { status: 400 })
    }

    const ua = req.headers.get('user-agent') || null

    // Does the visitor exist?
    const { data: existing } = await supabase
      .from('site_visitors')
      .select('visitor_id, visit_count, pageview_count, last_seen_at')
      .eq('visitor_id', visitor_id)
      .maybeSingle()

    if (!existing) {
      // First time we've seen this visitor server-side — create them with first-touch
      await supabase.from('site_visitors').insert({
        visitor_id,
        first_seen_at: first_seen_at || new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        visit_count: 1,
        pageview_count: 1,
        first_source, first_medium, first_campaign, first_content, first_term,
        first_referrer, first_landing_page,
        last_source: last_source || first_source,
        last_medium: last_medium || first_medium,
        last_campaign: last_campaign || first_campaign,
        last_referrer: last_referrer || first_referrer,
        last_landing_page: last_landing_page || first_landing_page,
        user_agent: ua,
      })
    } else {
      // Returning visitor — bump counters, refresh last-touch fields if provided
      const lastSeenMs = existing.last_seen_at ? new Date(existing.last_seen_at).getTime() : 0
      const isNewSession = !lastSeenMs || (Date.now() - lastSeenMs) > 30 * 60 * 1000

      const update = {
        last_seen_at: new Date().toISOString(),
        pageview_count: (existing.pageview_count || 0) + 1,
        visit_count: (existing.visit_count || 1) + (isNewSession ? 1 : 0),
      }
      if (last_source)        update.last_source = last_source
      if (last_medium)        update.last_medium = last_medium
      if (last_campaign)      update.last_campaign = last_campaign
      if (last_referrer)      update.last_referrer = last_referrer
      if (last_landing_page)  update.last_landing_page = last_landing_page

      await supabase
        .from('site_visitors')
        .update(update)
        .eq('visitor_id', visitor_id)
    }

    // Always log the pageview
    await supabase.from('site_visits').insert({
      visitor_id,
      session_id: session_id || null,
      path,
      query: query || null,
      referrer: referrer || null,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[track/pageview]', err?.message || err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
