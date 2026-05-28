import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const VALID_WINDOWS = new Set([30, 90, 365])

// GET /api/admin/sources?days=30
//
// Returns a source-keyed funnel for the rolling window:
//   visitors → identified → calculator → contact → quiz → tour intent → tour scheduled
//
// Plus a referrer breakdown for visitors whose first_source is null (so
// Isadora can see "X people came from theknot.com without a UTM tag").
//
// Visitor identity = site_visitors row, keyed by first_seen_at within the
// window. A submission counts toward a source only if the visitor's
// first_source matches — that protects the integrity of first-touch
// attribution even if a couple comes back via a different channel later.
export async function GET(req) {
  const password = req.headers.get('x-admin-password')
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const requestedDays = parseInt(url.searchParams.get('days') || '30', 10)
  const days = VALID_WINDOWS.has(requestedDays) ? requestedDays : 30
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  try {
    // ─── Pull all visitors in the window ───────────────────────────────
    // We page through because Supabase default limit is 1000.
    const visitors = await fetchAll('site_visitors',
      sb => sb.from('site_visitors')
        .select('visitor_id, first_source, first_medium, first_campaign, first_referrer, identified_at')
        .gte('first_seen_at', cutoff))

    const visitorIds = visitors.map(v => v.visitor_id)
    const visitorById = new Map(visitors.map(v => [v.visitor_id, v]))

    // ─── Pull submissions in window joined by visitor_id ───────────────
    // (We filter by visitor_id rather than created_at because a visitor
    // first-seen in the window who submits the next day still counts.)
    const [calc, contact, quiz, intents] = await Promise.all([
      fetchByVisitorIds('calculator_submissions', 'visitor_id, created_at', visitorIds),
      fetchByVisitorIds('contact_submissions',    'visitor_id, created_at', visitorIds),
      fetchByVisitorIds('quiz_submissions',       'visitor_id, created_at', visitorIds),
      fetchByVisitorIds('tour_intents',           'visitor_id, scheduled_at, created_at', visitorIds),
    ])

    // ─── Group by first_source + first_medium ──────────────────────────
    // Key shape: `${source}::${medium}`, displayed split.
    const groups = new Map()
    const ensure = (source, medium) => {
      const key = `${source || '(direct)'}::${medium || '(none)'}`
      if (!groups.has(key)) {
        groups.set(key, {
          source: source || '(direct)',
          medium: medium || '(none)',
          visitors: 0,
          identified: 0,
          calculator: 0,
          contact: 0,
          quiz: 0,
          tour_intents: 0,
          tour_scheduled: 0,
        })
      }
      return groups.get(key)
    }

    for (const v of visitors) {
      const g = ensure(v.first_source, v.first_medium)
      g.visitors += 1
      if (v.identified_at) g.identified += 1
    }

    const bump = (visitorId, field) => {
      const v = visitorById.get(visitorId)
      if (!v) return
      const g = ensure(v.first_source, v.first_medium)
      g[field] += 1
    }

    // Count distinct visitors per submission type per group.
    countDistinct(calc).forEach(id => bump(id, 'calculator'))
    countDistinct(contact).forEach(id => bump(id, 'contact'))
    countDistinct(quiz).forEach(id => bump(id, 'quiz'))
    countDistinct(intents).forEach(id => bump(id, 'tour_intents'))
    countDistinct(intents.filter(r => r.scheduled_at)).forEach(id => bump(id, 'tour_scheduled'))

    // Sort by visitors desc, then by submissions
    const bySource = [...groups.values()].sort((a, b) => {
      if (b.visitors !== a.visitors) return b.visitors - a.visitors
      const aSub = a.calculator + a.contact + a.quiz + a.tour_intents
      const bSub = b.calculator + b.contact + b.quiz + b.tour_intents
      return bSub - aSub
    })

    // ─── Referrer breakdown for source=null visitors ───────────────────
    const refMap = new Map()
    for (const v of visitors) {
      if (v.first_source) continue
      const raw = v.first_referrer || ''
      const host = extractHost(raw) || '(direct / no referrer)'
      refMap.set(host, (refMap.get(host) || 0) + 1)
    }
    const byReferrer = [...refMap.entries()]
      .map(([referrer, visitors]) => ({ referrer, visitors }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 25)

    // ─── Totals strip ──────────────────────────────────────────────────
    const totals = bySource.reduce((acc, g) => {
      acc.visitors       += g.visitors
      acc.identified     += g.identified
      acc.calculator     += g.calculator
      acc.contact        += g.contact
      acc.quiz           += g.quiz
      acc.tour_intents   += g.tour_intents
      acc.tour_scheduled += g.tour_scheduled
      return acc
    }, {
      visitors: 0, identified: 0, calculator: 0,
      contact: 0, quiz: 0, tour_intents: 0, tour_scheduled: 0,
    })

    return Response.json({
      windowDays: days,
      totals,
      bySource,
      byReferrer,
      generatedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[admin/sources]', err?.message || err)
    return Response.json({ error: err?.message || 'unknown' }, { status: 500 })
  }
}

// ── Helpers ───────────────────────────────────────────────────────────

// Page through a Supabase query that may return more than 1000 rows.
async function fetchAll(_label, build) {
  const pageSize = 1000
  let from = 0
  let rows = []
  for (;;) {
    const { data, error } = await build(supabase).range(from, from + pageSize - 1)
    if (error) throw error
    if (!data || data.length === 0) break
    rows = rows.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }
  return rows
}

// Pull rows from `table` matching visitor_ids. Chunks the .in() filter so
// we don't blow past PostgREST's max query length on big windows.
async function fetchByVisitorIds(table, columns, visitorIds) {
  if (visitorIds.length === 0) return []
  const chunkSize = 200
  let out = []
  for (let i = 0; i < visitorIds.length; i += chunkSize) {
    const chunk = visitorIds.slice(i, i + chunkSize)
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .in('visitor_id', chunk)
    if (error) throw error
    if (data) out = out.concat(data)
  }
  return out
}

// From an array of {visitor_id, ...}, return the set of distinct visitor_ids.
function countDistinct(rows) {
  return new Set(rows.map(r => r.visitor_id).filter(Boolean))
}

function extractHost(referrer) {
  if (!referrer) return null
  try {
    const u = new URL(referrer)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return referrer
  }
}
