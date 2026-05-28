import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const VALID_WINDOWS = new Set([30, 90, 365])

// GET /api/admin/sources/visitors?source=theknot&medium=directory&days=30
//
// Returns the actual visitors behind a single row in /admin/sources, with
// their identity, funnel status, and the timestamps that matter for
// follow-up. Sorted by intent level so the most-actionable rows are first:
//
//   tour scheduled > tour opened > any form submission > named only > anonymous
//
// Anonymous visitors (no name + no submissions) are intentionally excluded
// — they're a count, not a lead.
export async function GET(req) {
  const password = req.headers.get('x-admin-password')
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const requestedDays = parseInt(url.searchParams.get('days') || '30', 10)
  const days = VALID_WINDOWS.has(requestedDays) ? requestedDays : 30
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  // (direct) and (none) sentinel values map back to nulls in the DB.
  const rawSource = url.searchParams.get('source')
  const rawMedium = url.searchParams.get('medium')
  const source = !rawSource || rawSource === '(direct)' ? null : rawSource
  const medium = !rawMedium || rawMedium === '(none)'  ? null : rawMedium

  try {
    // ─── Visitors in this source+medium+window ─────────────────────────
    let q = supabase
      .from('site_visitors')
      .select('visitor_id, first_seen_at, last_seen_at, visit_count, pageview_count, first_referrer, first_landing_page, first_name, partner_name, email, phone, role, identified_at, first_campaign')
      .gte('first_seen_at', cutoff)
      .order('last_seen_at', { ascending: false })

    q = source === null ? q.is('first_source', null) : q.eq('first_source', source)
    q = medium === null ? q.is('first_medium', null) : q.eq('first_medium', medium)

    const visitors = await pageThrough(q)
    const visitorIds = visitors.map(v => v.visitor_id)

    if (visitorIds.length === 0) {
      return Response.json({ source: source || '(direct)', medium: medium || '(none)', windowDays: days, visitors: [] })
    }

    // ─── Pull joined submissions/intents ───────────────────────────────
    const [calc, contact, quiz, intents] = await Promise.all([
      fetchByVisitorIds('calculator_submissions', 'visitor_id, created_at, p1_name, p1_email, p1_phone, wedding_date, estimate, guests', visitorIds),
      fetchByVisitorIds('contact_submissions',    'visitor_id, created_at, name, email',                                                   visitorIds),
      fetchByVisitorIds('quiz_submissions',       'visitor_id, created_at, name, email, tier',                                             visitorIds),
      fetchByVisitorIds('tour_intents',           'visitor_id, opened_at, scheduled_at, email, first_name',                                visitorIds),
    ])

    const byVisitor = (rows) => {
      const m = new Map()
      for (const r of rows) {
        const arr = m.get(r.visitor_id) || []
        arr.push(r)
        m.set(r.visitor_id, arr)
      }
      return m
    }
    const calcByV    = byVisitor(calc)
    const contactByV = byVisitor(contact)
    const quizByV    = byVisitor(quiz)
    const intentsByV = byVisitor(intents)

    // ─── Build per-visitor records ─────────────────────────────────────
    const records = []
    for (const v of visitors) {
      const vCalc    = calcByV.get(v.visitor_id)    || []
      const vContact = contactByV.get(v.visitor_id) || []
      const vQuiz    = quizByV.get(v.visitor_id)    || []
      const vInt     = intentsByV.get(v.visitor_id) || []

      const latestCalc    = latest(vCalc, 'created_at')
      const latestContact = latest(vContact, 'created_at')
      const latestQuiz    = latest(vQuiz, 'created_at')
      const latestSched   = latest(vInt.filter(r => r.scheduled_at), 'scheduled_at')
      const latestOpen    = latest(vInt, 'opened_at')

      // Best identity available: prefer most recent submission, fall back
      // to the visitor row, fall back to tour intent.
      const name = pick(
        latestCalc?.p1_name,
        latestContact?.name,
        latestQuiz?.name,
        v.first_name && combine(v.first_name, v.partner_name),
        latestSched?.first_name || latestOpen?.first_name,
      )
      const email = pick(
        latestCalc?.p1_email,
        latestContact?.email,
        latestQuiz?.email,
        v.email,
        latestSched?.email || latestOpen?.email,
      )
      const phone = pick(latestCalc?.p1_phone, v.phone)

      // Skip anonymous visitors entirely (no name + no submissions + no intent).
      const hasSubmission = vCalc.length || vContact.length || vQuiz.length || vInt.length
      if (!name && !email && !hasSubmission) continue

      records.push({
        visitor_id:        v.visitor_id,
        name:              name || null,
        email:             email || null,
        phone:             phone || null,
        role:              v.role || null,
        first_seen_at:     v.first_seen_at,
        last_seen_at:      v.last_seen_at,
        identified_at:     v.identified_at,
        visit_count:       v.visit_count || 0,
        pageview_count:    v.pageview_count || 0,
        first_referrer:    v.first_referrer || null,
        first_landing_page:v.first_landing_page || null,
        first_campaign:    v.first_campaign || null,
        // Funnel stamps — null if didn't happen.
        calculator_at:     latestCalc?.created_at  || null,
        contact_at:        latestContact?.created_at || null,
        quiz_at:           latestQuiz?.created_at  || null,
        tour_opened_at:    latestOpen?.opened_at   || null,
        tour_scheduled_at: latestSched?.scheduled_at || null,
        // Useful calc details for the most recent estimate
        wedding_date:      latestCalc?.wedding_date || null,
        estimate:          latestCalc?.estimate    || null,
        guests:            latestCalc?.guests      || null,
        // Stage label for sorting + display
        stage: stageFor({
          scheduled: latestSched, opened: latestOpen,
          calculator: latestCalc, contact: latestContact, quiz: latestQuiz,
          identified: v.identified_at,
        }),
      })
    }

    // Sort by stage rank desc, then last_seen_at desc.
    const STAGE_RANK = { scheduled: 5, opened: 4, submitted: 3, named: 2, browsing: 1 }
    records.sort((a, b) => {
      const r = (STAGE_RANK[b.stage] || 0) - (STAGE_RANK[a.stage] || 0)
      if (r !== 0) return r
      return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime()
    })

    return Response.json({
      source: source || '(direct)',
      medium: medium || '(none)',
      windowDays: days,
      visitors: records,
    })
  } catch (err) {
    console.error('[admin/sources/visitors]', err?.message || err)
    return Response.json({ error: err?.message || 'unknown' }, { status: 500 })
  }
}

// ── Helpers ───────────────────────────────────────────────────────────

async function pageThrough(builder) {
  const pageSize = 1000
  let from = 0
  let rows = []
  for (;;) {
    const { data, error } = await builder.range(from, from + pageSize - 1)
    if (error) throw error
    if (!data || data.length === 0) break
    rows = rows.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }
  return rows
}

async function fetchByVisitorIds(table, columns, visitorIds) {
  if (visitorIds.length === 0) return []
  const chunkSize = 200
  let out = []
  for (let i = 0; i < visitorIds.length; i += chunkSize) {
    const chunk = visitorIds.slice(i, i + chunkSize)
    const { data, error } = await supabase.from(table).select(columns).in('visitor_id', chunk)
    if (error) throw error
    if (data) out = out.concat(data)
  }
  return out
}

function latest(rows, field) {
  if (!rows.length) return null
  return rows.reduce((best, r) => {
    if (!best) return r
    return new Date(r[field]).getTime() > new Date(best[field]).getTime() ? r : best
  }, null)
}

function pick(...vals) {
  for (const v of vals) if (v && String(v).trim()) return String(v).trim()
  return null
}

function combine(first, partner) {
  if (!first) return null
  return partner ? `${first} & ${partner}` : first
}

function stageFor({ scheduled, opened, calculator, contact, quiz, identified }) {
  if (scheduled) return 'scheduled'
  if (opened) return 'opened'
  if (calculator || contact || quiz) return 'submitted'
  if (identified) return 'named'
  return 'browsing'
}
