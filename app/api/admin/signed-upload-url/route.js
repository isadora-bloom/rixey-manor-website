import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}
function auth(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

// POST { path: 'videos/my-video.mp4' }
// Returns { signedUrl, token, publicUrl }
// Client then PUTs the file directly to signedUrl — bypasses Vercel body limit
export async function POST(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { path } = await req.json()
  if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 })

  const { data, error } = await sb()
    .storage
    .from('rixey-media')
    .createSignedUploadUrl(path)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = sb().storage.from('rixey-media').getPublicUrl(path)

  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, publicUrl })
}
