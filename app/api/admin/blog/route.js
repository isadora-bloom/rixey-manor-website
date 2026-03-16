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
  const id = searchParams.get('id')

  if (id) {
    const { data, error } = await sb()
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await sb()
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image, cover_image_position, published, created_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...fields } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const allowed = ['title', 'slug', 'excerpt', 'content', 'cover_image', 'cover_image_position', 'published', 'author', 'category']
  const update = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)))
  if (!Object.keys(update).length) return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
  const { error } = await sb().from('blog_posts').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function POST(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const fields = await req.json()
  const { title, slug } = fields
  if (!title || !slug) return NextResponse.json({ error: 'title and slug required' }, { status: 400 })
  const { data, error } = await sb()
    .from('blog_posts')
    .insert({ ...fields, published: false })
    .select('id')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
