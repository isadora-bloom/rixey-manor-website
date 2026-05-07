import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}
function auth(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

const TABLES = {
  categories: {
    table: 'budget_categories',
    allowed: ['slug', 'name', 'description', 'required', 'sort_order', 'active'],
    required: ['slug', 'name'],
    orderBy: 'sort_order',
  },
  options: {
    table: 'budget_options',
    allowed: ['category_slug', 'slug', 'label', 'description', 'range_low', 'range_high', 'range_note', 'sort_order', 'active'],
    required: ['category_slug', 'slug', 'label'],
    orderBy: 'sort_order',
  },
  vendors: {
    table: 'budget_vendors',
    allowed: ['option_id', 'name', 'descriptor', 'sort_order', 'active', 'consent_on'],
    required: ['option_id', 'name'],
    orderBy: 'sort_order',
  },
}

const TOTAL_KEYS = [
  'what_it_costs_total_low',
  'what_it_costs_total_high',
  'what_it_costs_total_note',
  'what_it_costs_total_caveat',
  'what_it_costs_last_reviewed',
]

function pickAllowed(spec, fields) {
  const out = {}
  for (const k of spec.allowed) {
    if (fields[k] !== undefined) out[k] = fields[k]
  }
  return out
}

export async function GET(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const resource = searchParams.get('resource')

  if (resource === 'all') {
    const sbi = sb()
    const [cats, opts, vendors, totalRows] = await Promise.all([
      sbi.from('budget_categories').select('*').order('sort_order'),
      sbi.from('budget_options').select('*').order('sort_order'),
      sbi.from('budget_vendors').select('*').order('sort_order'),
      sbi.from('site_content').select('key, value').in('key', TOTAL_KEYS),
    ])

    const errors = [cats, opts, vendors, totalRows].find(r => r.error)
    if (errors) return NextResponse.json({ error: errors.error.message }, { status: 500 })

    const total = (totalRows.data || []).reduce((acc, r) => { acc[r.key] = r.value; return acc }, {})
    return NextResponse.json({
      categories: cats.data || [],
      options: opts.data || [],
      vendors: vendors.data || [],
      total,
    })
  }

  if (resource === 'total') {
    const { data, error } = await sb().from('site_content').select('key, value').in('key', TOTAL_KEYS)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const out = (data || []).reduce((acc, r) => { acc[r.key] = r.value; return acc }, {})
    return NextResponse.json(out)
  }

  const spec = TABLES[resource]
  if (!spec) return NextResponse.json({ error: 'unknown resource' }, { status: 400 })
  const { data, error } = await sb().from(spec.table).select('*').order(spec.orderBy)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const resource = body._resource

  if (resource === 'total') {
    return NextResponse.json({ error: 'use PATCH for total' }, { status: 400 })
  }

  const spec = TABLES[resource]
  if (!spec) return NextResponse.json({ error: 'unknown resource' }, { status: 400 })

  for (const k of spec.required) {
    if (body[k] == null || body[k] === '') return NextResponse.json({ error: `${k} required` }, { status: 400 })
  }

  const insertRow = pickAllowed(spec, body)
  if (insertRow.sort_order === undefined) insertRow.sort_order = 999

  const { data, error } = await sb().from(spec.table).insert(insertRow).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const resource = body._resource

  if (resource === 'total') {
    const updates = body.updates || {}
    const ops = []
    for (const [key, value] of Object.entries(updates)) {
      if (!TOTAL_KEYS.includes(key)) continue
      ops.push(
        sb().from('site_content').upsert({ key, value: value ?? '' }, { onConflict: 'key' })
      )
    }
    const results = await Promise.all(ops)
    const err = results.find(r => r.error)
    if (err) return NextResponse.json({ error: err.error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  const spec = TABLES[resource]
  if (!spec) return NextResponse.json({ error: 'unknown resource' }, { status: 400 })

  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const update = pickAllowed(spec, fields)
  if (Object.keys(update).length === 0) return NextResponse.json({ error: 'nothing to update' }, { status: 400 })

  const { error } = await sb().from(spec.table).update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const resource = body._resource
  const spec = TABLES[resource]
  if (!spec) return NextResponse.json({ error: 'unknown resource' }, { status: 400 })

  const { id } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await sb().from(spec.table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
