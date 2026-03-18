import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}
function auth(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function GET(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await sb().from('site_images').select('*').order('id')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, url, alt_text, object_position } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const update = {}
  if (url           !== undefined) update.url            = url
  if (alt_text      !== undefined) update.alt_text       = alt_text
  if (object_position !== undefined) update.object_position = object_position
  // upsert so uploading to a slot that doesn't have a DB row yet creates it
  const { error } = await sb().from('site_images').upsert({ id, ...update }, { onConflict: 'id' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
