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
  const { searchParams } = new URL(req.url)
  const active    = searchParams.get('active')    // 'true' | 'false' | null (all)
  const scene     = searchParams.get('scene')     // scene_type filter
  const page      = parseInt(searchParams.get('page') || '1')
  const limit     = 60
  const offset    = (page - 1) * limit

  let query = sb()
    .from('media')
    .select('id, url, label, alt_text, quality, scene_type, mood, active', { count: 'exact' })
    .eq('category', 'gallery')
    .order('quality', { ascending: false })
    .order('label')
    .range(offset, offset + limit - 1)

  if (active === 'true')  query = query.eq('active', true)
  if (active === 'false') query = query.eq('active', false)
  if (scene)              query = query.eq('scene_type', scene)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count, page, limit })
}

export async function PATCH(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, active } = await req.json()
  if (!id || active === undefined) return NextResponse.json({ error: 'id and active required' }, { status: 400 })
  const { error } = await sb().from('media').update({ active }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
