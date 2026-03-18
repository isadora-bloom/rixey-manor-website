import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}
function auth(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

// GET /api/admin/image-extras?slot=venue-room-newlywed
export async function GET(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const slot = new URL(req.url).searchParams.get('slot')
  if (!slot) return NextResponse.json({ error: 'slot required' }, { status: 400 })
  const { data, error } = await sb()
    .from('site_image_extras')
    .select('*')
    .eq('slot_id', slot)
    .order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// POST { slot_id, url, alt_text }
export async function POST(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slot_id, url, alt_text = '' } = await req.json()
  if (!slot_id || !url) return NextResponse.json({ error: 'slot_id and url required' }, { status: 400 })
  const { data: existing } = await sb()
    .from('site_image_extras')
    .select('sort_order')
    .eq('slot_id', slot_id)
    .order('sort_order', { ascending: false })
    .limit(1)
  const sort_order = existing?.length ? (existing[0].sort_order + 1) : 0
  const { data, error } = await sb()
    .from('site_image_extras')
    .insert({ slot_id, url, alt_text, sort_order })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE { id }
export async function DELETE(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const { error } = await sb().from('site_image_extras').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// PATCH { id, alt_text } — update alt text
export async function PATCH(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, alt_text } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const { error } = await sb().from('site_image_extras').update({ alt_text }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
