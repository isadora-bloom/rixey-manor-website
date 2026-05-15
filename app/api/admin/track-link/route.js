import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}
function auth(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

// 8-char code, no ambiguous chars (0/O, 1/l/I)
function makeCode() {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789'
  let s = ''
  for (let i = 0; i < 8; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return s
}

// GET — list all tracked links, newest first
export async function GET(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await sb()
    .from('tracked_links')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ links: data })
}

// POST — create a new tracked link
export async function POST(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const first_name   = (body.first_name   || '').trim()
  const partner_name = (body.partner_name || '').trim()
  const email        = (body.email        || '').trim().toLowerCase()
  const phone        = (body.phone        || '').trim()
  const role         = (body.role         || '').trim()
  const destination  = (body.destination  || 'pricing').trim()
  const label        = (body.label        || '').trim()

  if (!first_name && !email) {
    return NextResponse.json({ error: 'Give at least a name or an email.' }, { status: 400 })
  }

  // Generate a code, retry on the (very unlikely) collision
  const supabase = sb()
  let code = makeCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: clash } = await supabase
      .from('tracked_links').select('code').eq('code', code).maybeSingle()
    if (!clash) break
    code = makeCode()
  }

  const { data, error } = await supabase
    .from('tracked_links')
    .insert({
      code, label, destination,
      first_name:   first_name   || null,
      partner_name: partner_name || null,
      email:        email        || null,
      phone:        phone        || null,
      role:         role         || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ link: data })
}

// DELETE — remove a tracked link by code (?code=...)
export async function DELETE(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const code = new URL(req.url).searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 })
  const { error } = await sb().from('tracked_links').delete().eq('code', code)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
