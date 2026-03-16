import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}
function auth(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function POST(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file     = formData.get('file')
  const path     = formData.get('path')  // e.g. 'site/venue-hero.webp'

  if (!file || !path) return NextResponse.json({ error: 'file and path required' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer      = Buffer.from(arrayBuffer)
  const contentType = file.type || 'image/webp'

  const { error } = await sb()
    .storage
    .from('rixey-media')
    .upload(path, buffer, { contentType, upsert: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = sb().storage.from('rixey-media').getPublicUrl(path)
  return NextResponse.json({ url: publicUrl })
}
