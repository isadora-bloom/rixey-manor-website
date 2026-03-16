import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function checkPassword(req) {
  const pw = req.headers.get('x-admin-password')
  return pw && pw === process.env.ADMIN_PASSWORD
}

// GET — public, returns all booked dates
export async function GET() {
  const supabase = adminClient()
  const { data, error } = await supabase
    .from('booked_dates')
    .select('id, start_date, end_date')
    .order('start_date')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — admin only, add a booked range
export async function POST(req) {
  if (!checkPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { start_date, end_date, notes } = await req.json()
  if (!start_date || !end_date) {
    return NextResponse.json({ error: 'start_date and end_date required' }, { status: 400 })
  }

  const supabase = adminClient()
  const { data, error } = await supabase
    .from('booked_dates')
    .insert({ start_date, end_date, notes: notes || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// DELETE — admin only, remove by id
export async function DELETE(req) {
  if (!checkPassword(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = adminClient()
  const { error } = await supabase
    .from('booked_dates')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
